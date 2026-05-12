# Architecture

## High-Level Shape

Rise to Rice is a two-application workspace:
- `frontend/`: browser client
- `backend/`: HTTP API and business logic

The frontend talks to the backend over `/api/*` endpoints and, in development, proxies requests through Vite to the backend host defined by `VITE_API_URL`.

## Frontend Stack

Current frontend technologies:
- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Radix UI primitives
- i18next / react-i18next
- Recharts
- React Helmet
- Axios
- Zod

## Frontend Structure

Important frontend layers:
- routing in `src/main.tsx`
- shared page frame in `src/Layout.tsx`
- feature pages in `src/pages/`
- reusable UI in `src/components/`
- query hooks in `src/hooks/query/`
- REST client calls in `src/services/`
- global state via React context providers in `src/context/`
- schema validation in `src/schema/`
- translations in `src/translations/`

Provider order in the current app root:
1. `QueryClientProvider`
2. `UserProvider`
3. `FullUserProvider`
4. `CreateAccountProvider`
5. `EditProfileProvider`
6. `SearchUserResultProvider`
7. `LogExchangeProvider`
8. `RouterProvider`

## Backend Stack

Current backend technologies:
- Express
- TypeScript
- MySQL via `mysql2/promise`
- Zod
- JWT
- bcrypt
- cookie-parser
- cors
- multer
- Nodemailer

## Backend Structure

Important backend layers:
- app bootstrap in `src/index.ts`
- route modules in `src/routes/`
- request handlers in `src/controllers/`
- reusable DB logic in `src/service/`
- authentication helpers and middleware in `src/helpers/` and `src/middleware/`
- request validation in `src/schema/`
- DB pool configuration in `src/connection/database.ts`

## Request Flow

Typical request flow:
1. React component triggers a query hook or Axios request.
2. Vite proxies `/api/*` to the backend in local development.
3. Express route receives the request.
4. Middleware performs cookie auth and role checks where configured.
5. Zod validates request payloads in controllers.
6. Controllers call MySQL directly or through service helpers.
7. JSON response returns to the frontend.
8. React Query updates cached UI state when applicable.

## Authentication Model

Authentication is cookie-based.

Cookies currently used:
- `authToken`
- `refreshToken`

Current behavior:
- login sets an auth token with a 15 minute lifetime
- login sets a refresh token with a 7 day lifetime
- cookies are `httpOnly`
- cookies are `sameSite: "strict"`
- auth middleware first tries `authToken`
- if `authToken` is missing or invalid, middleware falls back to the refresh token lookup in the database

Authorization helpers currently in use:
- `requireAuth`
- `requireAdmin`
- `requireSuperAdmin`
- `requireSelfOrAdmin`

Role semantics:
- `admin` and `super_admin` are both treated as admin-capable by `isAdmin`
- only `super_admin` can delete users or update user roles

## File Uploads

Announcement image uploads currently use `multer` with disk storage.

Behavior:
- files are written to `backend/uploads/`
- public URLs are stored as `/uploads/<filename>`
- uploads are exposed by Express through `app.use("/uploads", express.static(...))`

## Data And Persistence

The backend uses a direct MySQL connection pool and SQL queries in controllers and service files.

There is no migration system, schema definition file, or ORM present in this repository audit. The database structure must currently be inferred from:
- SQL statements in `backend/src/`
- TypeScript types
- Zod validators

## Observed Operational Boundaries

- CORS currently allows the single origin from `FRONTEND_URL`
- rewards and reward variations are readable only when authenticated
- points, redeem requests, and reactions are mounted behind app-level auth in `src/index.ts`
- dashboard pages are client-side protected by `ProtectedRoute role="admin"`

## Scripts

Frontend scripts:
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`
- `npm run host`

Backend scripts:
- `npm run dev`
- `npm run build`
- `npm run start`

## Current Gaps

The following structural gaps are visible in the current codebase:
- no automated tests are configured
- no shared root package or monorepo tool is present
- no `.env.example` files are present
- no formal migration files are present
