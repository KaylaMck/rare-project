"""Admin actions: deactivation and role changes.

Admin-to-admin actions (deactivating another admin, demoting another admin to
Author) require approval from two separate admins. The first admin's call
queues the action; the second admin's call executes it.

Non-admin targets (deactivating an Author, promoting an Author to Admin) take
effect immediately — no second vote needed.

All functions return an `ActionResult` describing what happened. Views translate
these into HTTP responses; business logic stays here so it can be tested
directly without the HTTP layer.
"""
from dataclasses import dataclass
from typing import Optional
from rareapi.models import RareUser, DemotionQueue


@dataclass
class ActionResult:
    """Outcome of an admin action.

    Exactly one of `executed`, `queued`, or `error` is True.
    - executed: the action was applied immediately
    - queued:   first vote recorded, waiting on a second admin
    - error:    the action was rejected; `message` explains why
    """
    executed: bool = False
    queued: bool = False
    error: bool = False
    message: Optional[str] = None


def _count_remaining_active_admins(exclude_pk: int) -> int:
    return RareUser.objects.filter(
        is_staff=True, is_active=True
    ).exclude(pk=exclude_pk).count()


def _apply_two_admin_vote(action: str, actor: RareUser, target_pk: int,
                          on_execute, last_admin_error: str,
                          duplicate_vote_error: str) -> ActionResult:
    """Shared two-admin voting logic.

    - If the actor has already voted for this action → error (duplicate vote).
    - If another admin has already voted → this is the second vote. Guard
      against demoting the last active admin, then execute `on_execute()` and
      clear the queue.
    - Otherwise this is the first vote → queue it and wait for a second admin.
    """
    if DemotionQueue.objects.filter(action=action, admin=actor).exists():
        return ActionResult(error=True, message=duplicate_vote_error)

    existing_votes = DemotionQueue.objects.filter(action=action)
    if existing_votes.exists():
        if _count_remaining_active_admins(exclude_pk=target_pk) == 0:
            return ActionResult(error=True, message=last_admin_error)
        existing_votes.delete()
        on_execute()
        return ActionResult(executed=True)

    DemotionQueue.objects.create(action=action, admin=actor, approver_one=actor)
    return ActionResult(queued=True, message=(
        'Request queued. A second admin must also approve to complete this action.'
    ))


def deactivate_user(actor: RareUser, target: RareUser) -> ActionResult:
    """Deactivate a user. Admin targets require a second admin's approval."""
    if target.is_staff:
        def _execute():
            target.is_active = False
            target.save()

        return _apply_two_admin_vote(
            action=f'deactivate:{target.pk}',
            actor=actor,
            target_pk=target.pk,
            on_execute=_execute,
            last_admin_error='Cannot deactivate the last admin. Make someone else an admin first.',
            duplicate_vote_error='You have already voted to deactivate this admin. A second admin must also approve.',
        )

    target.is_active = False
    target.save()
    return ActionResult(executed=True)


def change_user_role(actor: RareUser, target: RareUser, new_role: str) -> ActionResult:
    """Change a user's role.

    Promoting to Admin takes effect immediately. Demoting an admin to Author
    requires a second admin's approval. Demoting a non-admin (already an
    Author) is a no-op and takes effect immediately.
    """
    if new_role not in ('Admin', 'Author'):
        return ActionResult(error=True, message='Invalid user_type')

    if new_role == 'Admin':
        target.is_staff = True
        target.save()
        return ActionResult(executed=True)

    # Demoting an admin to Author → two-admin vote required
    if target.is_staff:
        def _execute():
            target.is_staff = False
            target.save()

        return _apply_two_admin_vote(
            action=f'demote:{target.pk}',
            actor=actor,
            target_pk=target.pk,
            on_execute=_execute,
            last_admin_error='Cannot change the last admin to Author. Make someone else an admin first.',
            duplicate_vote_error='You have already voted to demote this admin. A second admin must also approve.',
        )

    # Already an Author → no-op success
    target.is_staff = False
    target.save()
    return ActionResult(executed=True)
