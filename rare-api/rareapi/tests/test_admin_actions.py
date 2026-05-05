import pytest
from rareapi.models import RareUser, DemotionQueue
from rareapi.services import admin_actions


@pytest.fixture
def admin_a(db):
    return RareUser.objects.create_user(
        username='admin_a', password='x', is_staff=True, is_active=True,
    )


@pytest.fixture
def admin_b(db):
    return RareUser.objects.create_user(
        username='admin_b', password='x', is_staff=True, is_active=True,
    )


@pytest.fixture
def admin_c(db):
    return RareUser.objects.create_user(
        username='admin_c', password='x', is_staff=True, is_active=True,
    )


@pytest.fixture
def author(db):
    return RareUser.objects.create_user(
        username='author', password='x', is_staff=False, is_active=True,
    )


class TestDeactivate:
    def test_deactivating_author_is_immediate(self, admin_a, author):
        result = admin_actions.deactivate_user(actor=admin_a, target=author)
        assert result.executed is True
        author.refresh_from_db()
        assert author.is_active is False

    def test_first_admin_vote_queues_action(self, admin_a, admin_b, admin_c):
        result = admin_actions.deactivate_user(actor=admin_a, target=admin_b)
        assert result.queued is True
        admin_b.refresh_from_db()
        assert admin_b.is_active is True  # not yet deactivated
        assert DemotionQueue.objects.filter(action=f'deactivate:{admin_b.pk}').count() == 1

    def test_second_admin_vote_executes(self, admin_a, admin_b, admin_c):
        admin_actions.deactivate_user(actor=admin_a, target=admin_b)
        result = admin_actions.deactivate_user(actor=admin_c, target=admin_b)
        assert result.executed is True
        admin_b.refresh_from_db()
        assert admin_b.is_active is False
        # Queue cleaned up after execution
        assert DemotionQueue.objects.filter(action=f'deactivate:{admin_b.pk}').count() == 0

    def test_same_admin_cannot_vote_twice(self, admin_a, admin_b, admin_c):
        admin_actions.deactivate_user(actor=admin_a, target=admin_b)
        result = admin_actions.deactivate_user(actor=admin_a, target=admin_b)
        assert result.error is True
        assert 'already voted' in result.message


class TestChangeRole:
    def test_promote_author_to_admin_is_immediate(self, admin_a, author):
        result = admin_actions.change_user_role(actor=admin_a, target=author, new_role='Admin')
        assert result.executed is True
        author.refresh_from_db()
        assert author.is_staff is True

    def test_demote_author_is_immediate_noop(self, admin_a, author):
        result = admin_actions.change_user_role(actor=admin_a, target=author, new_role='Author')
        assert result.executed is True
        author.refresh_from_db()
        assert author.is_staff is False

    def test_demote_admin_requires_two_votes(self, admin_a, admin_b, admin_c):
        result = admin_actions.change_user_role(actor=admin_a, target=admin_b, new_role='Author')
        assert result.queued is True
        admin_b.refresh_from_db()
        assert admin_b.is_staff is True

        result = admin_actions.change_user_role(actor=admin_c, target=admin_b, new_role='Author')
        assert result.executed is True
        admin_b.refresh_from_db()
        assert admin_b.is_staff is False

    def test_invalid_role_returns_error(self, admin_a, author):
        result = admin_actions.change_user_role(actor=admin_a, target=author, new_role='Gremlin')
        assert result.error is True
        assert 'Invalid' in result.message

    def test_same_admin_cannot_vote_twice_on_demotion(self, admin_a, admin_b):
        admin_actions.change_user_role(actor=admin_a, target=admin_b, new_role='Author')
        result = admin_actions.change_user_role(actor=admin_a, target=admin_b, new_role='Author')
        assert result.error is True
        assert 'already voted' in result.message
