# Rise to Rice Docs

This folder is the internal source of truth for the current Rise to Rice codebase.

Last audited: 2026-05-12

Audit scope:
- `frontend/` application code, package scripts, and environment keys
- `backend/` application code, package scripts, Express routes, and environment keys
- frontend routes from `frontend/src/main.tsx`
- backend route mounts from `backend/src/index.ts`

## What This Project Is

Rise to Rice is a community recycling platform for Barangay Bagong Silangan, Quezon City.

The current product flow is:
1. Residents learn about the program through public marketing and education pages.
2. Residents register and manage a profile.
3. Admins log recyclable exchanges for residents.
4. Logged exchanges convert material weight into user points.
5. Users redeem rewards with their points, including rice-related rewards.
6. Admins manage materials, rewards, announcements, redeem requests, and contact messages from a dashboard.

## Documentation Map

- `product-overview.md`: product purpose, user roles, and frontend route inventory
- `architecture.md`: system layout, request flow, auth model, and technical stack
- `api.md`: backend endpoint inventory and access rules
- `data-model.md`: core entities, relationships, and business rules inferred from code
- `environment.md`: environment variables currently present in `.env` files and whether the code still uses them

## Current Workspace Shape

- `frontend/` is a standalone Vite + React + TypeScript app.
- `backend/` is a standalone Express + TypeScript + MySQL app.
- The workspace root is not a Git repository.
- `frontend/` and `backend/` each contain their own `.git` directory.

## Operational Notes

- Frontend API calls use relative `/api/...` paths and rely on the Vite dev proxy in local development.
- Backend serves uploaded announcement images from `/uploads`.
- The application currently has no automated test suite configured in either package.
- No `.env.example` files exist at the time of this audit.

## Maintenance Rule

When code changes affect routes, access control, data shape, environment requirements, or user-facing flows, update the matching file in `docs/` in the same change set.
