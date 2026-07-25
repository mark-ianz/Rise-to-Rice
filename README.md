# Rise to Rice

> Turn recyclable waste into community value.

Rise to Rice is a community recycling platform for **Barangay Bagong Silangan, Quezon City, Philippines**. Residents exchange recyclable materials for points, which can be redeemed for rice and other essential goods.

## Problem & Solution

Waste management is a growing challenge in urban communities. Rise to Rice tackles this by creating a tangible incentive system: residents bring recyclables to community collection points, the materials are weighed and converted into points, and those points are redeemed for rewards — starting with rice, the community's most essential staple.

## Key Features

**For visitors** — Landing page, announcements feed, about page, contact form, registration.

**For registered users** — Profile management, points balance, rewards catalog, redeem requests, activity history, announcement reactions.

**For administrators** — Dashboard analytics, user management, material & category CRUD, exchange logging (points calculation), reward & variation management, redeem request moderation, announcement publishing, contact message management.

**Cross-cutting** — Bilingual interface (English / Filipino), cookie-based JWT authentication with refresh token rotation, dark mode, responsive design, toast notifications, skeleton loading states.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 18, TypeScript, Vite 6, React Router v7, TanStack Query 5, Axios, Tailwind CSS 3, Radix UI / shadcn/ui, Framer Motion, GSAP, Recharts, i18next, Zod |
| **Backend** | Express 4, TypeScript, MySQL (mysql2/promise), JWT, bcrypt, Zod, Nodemailer / Resend, Cloudinary SDK, Multer |
| **Infrastructure** | Vercel (frontend), Node.js host (backend) |

## Architecture

Rise to Rice is a two-application monorepo:

```
Rise to Rice/
├── frontend/     # React SPA (Vite build, deployed on Vercel)
├── backend/      # Express REST API (TypeScript, MySQL)
└── docs/         # Internal documentation
```

The frontend communicates with the backend over `/api/*` endpoints. In development, Vite proxies these requests to the backend. Authentication is cookie-based: a short-lived JWT (15 min) with a refresh token (7 days, database-rotated). Three roles exist: `user`, `admin`, `super_admin`.

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8+

### Setup

```bash
# Clone and install dependencies
git clone <repo-url>
cd Rise to Rice
cd frontend && npm install
cd ../backend && npm install
cd ..

# Configure environment variables
# Copy and fill in the example files:
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

See [docs/environment.md](docs/environment.md) for a complete reference of all environment variables.

### Database

The backend auto-migrates its schema on first run — no manual migration step needed. Create an empty MySQL database and point `DB_NAME` in `backend/.env` to it.

### Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

The frontend dev server runs on `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:3000`.

## Project Structure

```
Rise to Rice/
├── frontend/                     # React SPA
│   ├── src/
│   │   ├── main.tsx              # App root, routing, providers
│   │   ├── Layout.tsx            # Shared layout (header, footer)
│   │   ├── pages/                # Route-level page components
│   │   ├── components/           # Reusable UI (shadcn/ui primitives, header, general)
│   │   ├── hooks/                # TanStack Query hooks, context hooks
│   │   ├── services/             # Axios API call wrappers
│   │   ├── context/              # React context providers
│   │   ├── schema/               # Zod validation (EN + TL)
│   │   ├── translations/         # i18n JSON (en/, tl/)
│   │   └── lib/                  # Utilities, constants, query keys
│   ├── public/                   # Static assets
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/                      # Express API
│   ├── src/
│   │   ├── index.ts              # App bootstrap & route mounting
│   │   ├── routes/               # Express route definitions
│   │   ├── controllers/          # Request handlers
│   │   ├── service/              # Reusable DB query logic
│   │   ├── middleware/           # Auth middleware (requireAuth, etc.)
│   │   ├── helpers/              # JWT, hash, mailer utilities
│   │   ├── schema/               # Zod request validation
│   │   ├── types/                # TypeScript types
│   │   ├── connection/           # MySQL pool & auto-migration
│   │   ├── templates/            # Email templates (EJS)
│   │   └── nodemailer/           # Transporter config
│   ├── test/                     # Integration tests
│   └── uploads/                  # Announcement images
└── docs/                         # Internal documentation
    ├── product-overview.md
    ├── architecture.md
    ├── api.md
    ├── data-model.md
    └── environment.md
```

## Scripts

| Directory | Script | Purpose |
| --- | --- | --- |
| `frontend/` | `npm run dev` | Start Vite dev server |
| `frontend/` | `npm run build` | TypeScript check + Vite build |
| `frontend/` | `npm run lint` | ESLint check |
| `frontend/` | `npm run preview` | Preview production build |
| `backend/` | `npm run dev` | Start with nodemon (auto-restart) |
| `backend/` | `npm run build` | TypeScript compilation |
| `backend/` | `npm run start` | Run compiled JS |
| `backend/` | `npm run test` | Build + run integration tests |

## API Overview

The backend exposes a RESTful API at `/api/` with these resource groups:

| Group | Base Path | Auth |
| --- | --- | --- |
| Auth | `/api/auth/*` | Public (login, logout, session) |
| Users | `/api/user/*` | Mixed (public register, protected profile) |
| Announcements | `/api/announcements/*` | Mixed (public read, admin write) |
| Materials | `/api/material/*` | Admin |
| Exchanges | `/api/exchange/*` | Admin (logs + calculates points) |
| Points | `/api/points/*` | Authenticated |
| Rewards | `/api/reward/*` | Mixed (authenticated read, admin write) |
| Reward Variations | `/api/reward-variation/*` | Admin |
| Redeem Requests | `/api/redeem-request/*` | Authenticated |
| Reactions | `/api/reactions/*` | Authenticated |
| Analytics | `/api/analytics/*` | Admin |
| Contact | `/api/contact-us/*` | Public (submit), Admin (manage) |
| Activity | `/api/activity/*` | Authenticated |

For complete endpoint details, see [docs/api.md](docs/api.md).

## Authentication

- **Cookie-based JWT** — `authToken` (15 min lifetime) and `refreshToken` (7 days, stored in DB, rotated on use)
- **HttpOnly, sameSite: strict** cookies
- **Role hierarchy**: `user` < `admin` < `super_admin`
- **Middleware chain**: `requireAuth` → `requireAdmin` → `requireSuperAdmin` → `requireSelfOrAdmin`

## Deployment

- **Frontend** — Built with `npm run build` in `frontend/` and deployed to Vercel (SPA rewrites configured via `vercel.json`)
- **Backend** — Compiled with `npm run build` in `backend/` and run with `npm run start` on a Node.js host
- **CORS** — Configured via `FRONTEND_URL` in `backend/.env`; must match the deployed frontend origin

## Documentation

The `docs/` directory contains detailed reference material:

- [Product Overview](docs/product-overview.md) — Mission, user roles, flows, route inventory
- [Architecture](docs/architecture.md) — System layout, request flow, auth model
- [API Reference](docs/api.md) — All endpoints, methods, access rules
- [Data Model](docs/data-model.md) — Entities, relationships, validation rules
- [Environment Variables](docs/environment.md) — Complete env reference

## License

ISC
