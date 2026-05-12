# API Reference

This file documents the backend routes mounted by `backend/src/index.ts` and declared under `backend/src/routes/`.

## Base Behavior

- API base path: `/api`
- upload base path: `/uploads`
- all JSON bodies are handled by Express JSON middleware
- cookie parsing is enabled globally

## Auth And Session Rules

- `authToken` is a JWT cookie used for short-lived authentication
- `refreshToken` is a database-backed cookie used for session refresh
- `requireAuth` reads cookies, verifies the auth token first, then falls back to the refresh token lookup

Important mount-level protection from `backend/src/index.ts`:
- `/api/points` is wrapped with `requireAuth`
- `/api/redeem-request` is wrapped with `requireAuth`
- `/api/reactions` is wrapped with `requireAuth`

That means some routes appear unguarded inside their route file but still require authentication because the router is mounted behind `requireAuth`.

## Common Patterns

- Pagination helper defaults: `page=1`, `limit=25`
- Admin list screens often override `limit` to `50` from the frontend
- Common query params across list endpoints: `page`, `limit`, `search`, `searchFor`

## Auth Routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | public | Log in and set auth cookies |
| `POST` | `/api/auth/logout` | public | Clear auth cookies |
| `GET` | `/api/auth/check` | token-aware | Return the current authenticated user, refreshing if needed |

## User Routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/user` | admin | Get all users |
| `PUT` | `/api/user/reset-password` | public | Reset a password by email |
| `PUT` | `/api/user/change-password/:id` | public | Change password for a user id |
| `POST` | `/api/user/verification-code/request` | public | Send verification code |
| `POST` | `/api/user/verification-code/verify` | public | Verify code |
| `POST` | `/api/user/email-exists` | public | Check whether email already exists |
| `GET` | `/api/user/search` | admin | Search users |
| `POST` | `/api/user/create` | public | Create a user |
| `PUT` | `/api/user/update_role/:id/:role_id` | super admin | Update a user's role |
| `GET` | `/api/user/:id` | self or admin | Get account info |
| `PUT` | `/api/user/:id` | self or admin | Update account info |
| `DELETE` | `/api/user/:id` | super admin | Delete a user |

## Announcement Routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/announcements/get-author/:id` | public | Get the announcement author |
| `GET` | `/api/announcements` | public | List announcements |
| `GET` | `/api/announcements/:id` | public | Get one announcement |
| `POST` | `/api/announcements` | admin | Create an announcement, optional `image` upload |
| `PUT` | `/api/announcements/:id` | admin | Update an announcement |
| `DELETE` | `/api/announcements/:id` | admin | Delete an announcement |

Announcement list query params currently supported:
- `page`
- `limit`
- `author_id`
- `sort`

Recognized announcement sort values:
- `oldest`
- `reactions`
- default newest-first ordering

## Material Routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/material` | public | List materials |
| `GET` | `/api/material/categories` | public | List material categories |
| `POST` | `/api/material/categories` | admin | Create a material category |
| `DELETE` | `/api/material/categories/:id` | admin | Delete a material category |
| `GET` | `/api/material/:id` | public | Get one material |
| `POST` | `/api/material` | admin | Create a material |
| `PUT` | `/api/material/:id` | admin | Update a material |
| `DELETE` | `/api/material/:id` | admin | Delete a material |

## Exchange Routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/exchange/log` | admin | Log a material exchange and add points |

## Analytics Routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/analytics/total_weight/:time/:id?` | public | Material weight analytics, optionally per user |
| `GET` | `/api/analytics/user/:time/:id?` | public | User analytics summary |
| `GET` | `/api/analytics/dashboard` | admin | Dashboard totals |

## Points Routes

These routes are mounted behind `requireAuth`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/points` | authenticated | Get current user's points |
| `GET` | `/api/points/:id` | admin | Get a specific user's points |
| `POST` | `/api/points/manipulate_user_points` | authenticated | Add or deduct user points |

Important note:
- the route file only adds `requireAdmin` to `GET /:id`
- `POST /manipulate_user_points` is authenticated by mount-level middleware, but not explicitly admin-guarded in the route file

## Reward Routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/reward` | admin | Create a reward |
| `GET` | `/api/reward/:id?` | authenticated | List rewards or get one reward |
| `PUT` | `/api/reward/:id` | admin | Update a reward |
| `DELETE` | `/api/reward/:id` | admin | Delete a reward |

## Reward Variation Routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/reward-variation` | admin | Create a reward variation |
| `GET` | `/api/reward-variation/:id?` | authenticated | List variations or get one variation |
| `PUT` | `/api/reward-variation/:id` | admin | Update a reward variation |
| `DELETE` | `/api/reward-variation/:id` | admin | Delete a reward variation |

## Redeem Request Routes

These routes are mounted behind `requireAuth`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/redeem-request` | authenticated | Create a redeem request |
| `GET` | `/api/redeem-request/user/:id` | authenticated | Get redeem requests for a user |
| `PUT` | `/api/redeem-request/cancel/:id` | authenticated | Cancel a redeem request |
| `GET` | `/api/redeem-request` | admin | Get all redeem requests |
| `GET` | `/api/redeem-request/:id` | admin | Get one redeem request |
| `DELETE` | `/api/redeem-request/:id` | admin | Delete a redeem request |
| `PUT` | `/api/redeem-request/status/:id` | admin | Update redeem request status |

## Reaction Routes

These routes are mounted behind `requireAuth`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/reactions` | authenticated | React to an announcement |
| `GET` | `/api/reactions/users/:announcement_id` | authenticated | Get users who reacted |
| `GET` | `/api/reactions/:announcement_id` | authenticated | Get reaction counts and data |
| `DELETE` | `/api/reactions/:reaction_id` | authenticated | Remove a reaction |

## Contact Routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/contact-us` | public | Submit a contact message |
| `GET` | `/api/contact-us` | public in current route file | Get all contact messages |
| `PUT` | `/api/contact-us/:id` | public in current route file | Update contact message status |
| `DELETE` | `/api/contact-us/:id` | public in current route file | Delete a contact message |

Important note:
- the contact routes currently have no auth middleware applied in `backend/src/routes/contact-us.ts`
- the frontend treats contact message review as an admin dashboard feature, but the backend route definitions do not currently enforce that

## Test Route

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/test/pagination` | public | Pagination test endpoint |
