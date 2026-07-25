# Rise to Rice — Backend

The backend is an **Express 4 REST API** written in **TypeScript** that powers the Rise to Rice community recycling platform. It handles authentication, business logic, and data persistence against a **MySQL** database.

Authentication is cookie-based JWT with refresh token rotation. The data layer uses raw SQL queries via `mysql2/promise` with a connection pool.

## Tech Stack

Express 4, TypeScript, MySQL (mysql2/promise), JWT (jsonwebtoken), bcrypt, Zod, Nodemailer / Resend, Cloudinary SDK, Multer, dotenv, cors, cookie-parser, nanoid, dayjs

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start with `nodemon` (auto-restart on changes) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled JS (`node ./dist/index.js`) |
| `npm run test` | Build + run integration tests in `test/` |

## Environment Variables

Copy `.env.example` to `.env` and configure. Key groups:

| Group | Variables |
| --- | --- |
| **Server** | `PORT`, `FRONTEND_URL`, `NODE_ENV` |
| **Database** | `DB_HOSTNAME`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` |
| **JWT** | `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `ACCESS_TOKEN_JWT_EXPIRES_IN`, `REFRESH_TOKEN_JWT_EXPIRES_IN` |
| **Auth config** | `SALT_ROUND`, `ACCESS_TOKEN_COOKIE_MAX_AGE`, `REFRESH_TOKEN_COOKIE_MAX_AGE`, `EMAIL_VERIFICATION_CODE_TTL_MINUTES`, `PASSWORD_RESET_PROOF_TTL_MINUTES` |
| **Email** | `EMAIL_PROVIDER`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SMTP_FROM_NAME` |
| **Cloudinary** | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER` |
| **Validation** | `MINIMUM_PASSWORD_LENGTH`, `CONTACT_NUMBER_LENGTH` |

See [docs/environment.md](../docs/environment.md) for the complete reference.

## Project Structure

```
src/
├── index.ts                     # App bootstrap: CORS, middleware, route mounting
├── connection/
│   └── database.ts              # MySQL pool + runtime auto-migration
├── middleware/
│   └── authentication.ts        # requireAuth, requireAdmin, requireSuperAdmin, etc.
├── routes/                      # Express Router definitions
│   ├── auth.ts                  # Login, logout, session
│   ├── user.ts                  # CRUD, role management, password, email verification
│   ├── announcement.ts          # CRUD with image uploads and flare filters
│   ├── material.ts              # Materials and categories CRUD
│   ├── exchange.ts              # Log recyclable exchanges
│   ├── points.ts                # Points balance and manipulation
│   ├── reward.ts                # Rewards CRUD
│   ├── reward-variation.ts      # Reward variations CRUD
│   ├── redeem-request.ts        # Submit, cancel, approve/reject
│   ├── reactions.ts             # Announcement reactions (Like, Heart, etc.)
│   ├── analytics.ts             # Weight stats, user stats, dashboard totals
│   ├── contact-us.ts            # Contact form submissions
│   ├── activity.ts              # User activity logs
│   ├── refresh-token.ts         # Token lifecycle
│   └── test.ts                  # Test-only endpoints
├── controllers/                 # Request handler functions
├── service/                     # Reusable SQL query helpers
├── helpers/                     # JWT, hash, login, mailer, token utilities
├── schema/                      # Zod validation schemas
├── types/                       # TypeScript interfaces and types
├── nodemailer/                  # Transporter configuration
├── templates/                   # EJS email templates
└── utils/                       # Multer config, Cloudinary helpers, generators
test/                            # Integration tests (vanilla JS)
uploads/                         # Announcement images (local disk storage)
```

## Database

The backend uses a **direct MySQL connection pool** with **runtime auto-migration**. The schema is created and updated automatically on first server start. No manual migration tool is required.

The database structure can be inferred from:
- SQL statements in `src/connection/database.ts`, controllers, and service files
- TypeScript type definitions in `src/types/`
- Zod validation schemas in `src/schema/`

See [docs/data-model.md](../docs/data-model.md) for entity documentation.

## API Endpoints

| Base Path | Auth | Resource |
| --- | --- | --- |
| `/api/auth/*` | Public | Login, logout, session check |
| `/api/user/*` | Mixed | Registration (public), profile (authenticated), management (admin/super_admin) |
| `/api/announcements/*` | Mixed | Public read, admin create/update/delete |
| `/api/material/*` | Admin | Materials and categories CRUD |
| `/api/exchange/*` | Admin | Log exchanges (calculates and awards points) |
| `/api/points/*` | Authenticated | View points balance |
| `/api/reward/*` | Mixed | Authenticated read, admin write |
| `/api/reward-variation/*` | Admin | Reward variations (quantity + points cost) |
| `/api/redeem-request/*` | Authenticated | Submit, cancel, moderate |
| `/api/reactions/*` | Authenticated | Announcement reactions |
| `/api/analytics/*` | Admin | Dashboard statistics |
| `/api/contact-us/*` | Mixed | Public submit, admin manage |
| `/api/activity/*` | Authenticated | User activity history |

For full endpoint details (methods, parameters, response shapes), see [docs/api.md](../docs/api.md).

## Authentication Model

- **Cookie-based JWT** — `authToken` is a short-lived JWT (15 min, httpOnly, sameSite:strict)
- **Refresh token rotation** — `refreshToken` is stored in the database (7-day interval) and rotated on each use
- **Fallback** — If the auth token is expired or missing, middleware falls back to the refresh token
- **Role hierarchy**: `user` → `admin` → `super_admin`
- `admin` and `super_admin` are both treated as admin-capable (`isAdmin`)
- Only `super_admin` can update roles and delete users

## File Uploads

Announcement images are handled by **Multer** with disk storage, written to `backend/uploads/`. Files are served at `/uploads/<filename>` via Express static middleware.

## CORS

Configured via `FRONTEND_URL` in `.env`. Only this origin is allowed (with credentials). Allowed methods: `GET, POST, PUT, DELETE, PATCH`.
