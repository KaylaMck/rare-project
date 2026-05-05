# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow

At the start of every session, before writing any code:
1. **Understand** — Read and explain the relevant existing code affected by the task.
2. **Plan** — Propose a concrete implementation approach.
3. **Confirm** — Wait for explicit approval before proceeding.

**No code may be written or modified without explicit user approval. This rule overrides auto mode and any other default behavior. Always present a plan and wait for a clear "yes" before touching any file.**

Any code that contains business logic must have tests.

## Project Overview

RARE is a full-stack blogging platform (monorepo). The `rare-api/` directory contains a Django REST API backend and `rare-client/` contains a React 18 SPA frontend.

## Commands

### Backend (rare-api/)

```bash
# Start PostgreSQL first (run from rare-api/)
docker compose up -d

# Install and activate virtualenv
pipenv install
pipenv shell

# Apply migrations and seed data
python manage.py migrate
python manage.py loaddata rareapi/fixtures/initial_data.json

# Run dev server (http://localhost:8088)
python manage.py runserver 8088

# Run all tests
pipenv run python -m pytest

# Run a single test file
pipenv run python -m pytest rareapi/tests/test_post_count.py

# Lint
pylint rareapi/
```

### Frontend (rare-client/)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm test         # vitest
npm run test:watch
```

## Architecture

Three-tier: React SPA → Django REST API → PostgreSQL 16 (Docker).

**Auth flow:** DRF Token Authentication. On login, the token and user ID are stored in `localStorage`. Every API request includes `Authorization: Token <token>` in the header.

**URL convention:** `APPEND_SLASH = False` — all API URLs omit the trailing slash (e.g. `/posts`, not `/posts/`). The base URL is hardcoded to `http://localhost:8088` in `rare-client/src/api.js`.

**Frontend structure:**
- `src/managers/` — one module per domain (PostManager, UserManager, etc.) that handles all `fetch` calls for that resource
- `src/components/` — feature-organized UI components. Forms use `useRef` for input values, not `useState`. Styling uses Bulma utility classes only — no custom CSS on components.
- `src/views/ApplicationViews.js` — top-level route definitions; `Authorized` and `AdminOnly` are route guards

**Backend structure:**
- `rareapi/views/` — one view file per resource, function-based views using `@api_view` decorator dispatched by HTTP method. Do not use class-based views.
- `rareapi/models/` — one file per model; `RareUser` extends `AbstractUser`. This split-model pattern is intentional — do not consolidate models into a single file.
- `rareapi/serializers/` — DRF serializers for JSON responses
- `rareapi/services/admin_actions.py` — business logic for admin governance workflows

**Key domain rules:**
- Posts by staff (`is_staff=True`) are auto-published; posts by regular users enter a moderation queue. This logic lives intentionally in the view layer (`rareapi/views/post_views.py`) — do not refactor it into the model.
- Demoting or deactivating an admin requires a second admin's approval (`DemotionQueue` model)
- Media uploads (post images, profile images) are stored under `media/` and served via Django

**Database:** 11 models — `RareUser`, `Post`, `Category`, `Tag`, `Comment`, `PostTag`, `Reaction`, `PostReaction`, `Subscription`, `DemotionQueue`. See `rare-api/docs/schema.md` for the ER diagram.

**Fixture accounts:** `rare-api/rareapi/fixtures/initial_data.json` seeds 13 users. Staff accounts: `admin_sarah`, `admin_marcus`.

## Commit Messages

Follow the conventional commit format:

```
<type>[optional scope]: <description>

[optional body]
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

- Keep the description under 72 characters.
- Do not include `Co-Authored-By` lines.

## Pull Requests

When creating a PR with `gh pr create`, use this format:

**Title:** `<type>[optional scope]: <description>`

**Body:**
```
## What changed
<1-3 bullet points describing the change>

## Why
<reason for the change>

## How to test
<steps to verify the change works>
```

## Architecture Docs

Detailed diagrams live in `rare-api/docs/`:
- `architecture.md` — component diagram and system overview
- `schema.md` — full ER diagram
- `create-post-sequence.md` — step-by-step post creation flow
