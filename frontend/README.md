# Rise to Rice — Frontend

The frontend is a **React 18 single-page application** that serves as the user-facing interface for the Rise to Rice community recycling platform.

Built with **Vite 6**, **TypeScript**, and **Tailwind CSS 3**. Features server-state management via **TanStack Query 5**, bilingual internationalization (English / Filipino), responsive mobile-first design, and an admin analytics dashboard with **Recharts** charts.

## Tech Stack

React 18, TypeScript, Vite 6, React Router v7, TanStack Query 5, Axios, Tailwind CSS 3, Radix UI / shadcn/ui, Framer Motion, GSAP, Recharts, i18next / react-i18next, Zod, React Helmet Async, Sonner (toasts), Lucide React

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite dev server (default `:5173`) |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | ESLint across the project |
| `npm run preview` | Preview the production build locally |
| `npm run host` | Start dev server on the network |

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://127.0.0.1:3000` | Backend origin (Vite proxies `/api` here) |
| `VITE_FRONTEND_BASE_URL` | `http://localhost:5173` | Base URL for share links |
| `VITE_MINIMUM_PASSWORD_LENGTH` | `8` | Client-side password length rule |
| `VITE_CONTACT_NUMBER_LENGTH` | `11` | Client-side contact number rule |

## Project Structure

```
src/
├── main.tsx                    # Root: providers, router, lazy-loaded routes
├── Layout.tsx                  # Shared page frame (header, footer, <Outlet/>)
├── index.css                   # Tailwind directives, CSS variables, dark mode
├── pages/                      # Route-level page components
│   ├── LandingPage.tsx         # Marketing homepage
│   ├── Register.tsx, Login.tsx, ForgotPassword.tsx
│   ├── UserHome.tsx, Profile.tsx
│   ├── Announcements.tsx, ViewAnnouncement.tsx
│   ├── RedeemRewards.tsx, RedeemHistory.tsx
│   ├── ActivityHistory.tsx, ActivityHistoryRedeem.tsx, ActivityHistoryExchange.tsx
│   ├── AboutUs.tsx, ContactUs.tsx
│   ├── TermsAndConditions.tsx, PrivacyPolicy.tsx
│   └── dashboard/              # Admin-only pages
│       ├── Dashboard.tsx       # Analytics overview
│       ├── Users.tsx, ViewUser.tsx
│       ├── Rewards.tsx, Material.tsx
│       ├── RedeemRequest.tsx, ContactMessages.tsx
├── components/
│   ├── ui/                     # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── header/                 # Navigation, sidebar, profile dropdown
│   ├── general/                # Loader, footer, error boundary
│   ├── protected/              # ProtectedRoute role guard
│   ├── icons/                  # Custom reaction icons
│   └── page-components/        # Page-specific component fragments
├── hooks/
│   ├── query/                  # TanStack Query hooks (useUser, useAnnouncements, etc.)
│   └── context hooks           # useUserContext, useLogout, etc.
├── services/                   # Axios API call wrappers
├── context/                    # React context providers
├── schema/                     # Zod validation (en/ and tl/ versions)
├── translations/               # i18next JSON (en/translation.json, tl/translation.json)
├── lib/                        # Utilities, constants, query key factory
└── utils/                      # i18n init, analytics helpers, formatting
```

## Routing

All routes are **lazy-loaded** via `React.lazy()` and wrapped in `<Suspense>`. The provider hierarchy is:

1. `QueryClientProvider`
2. `UserProvider` → `FullUserProvider`
3. `CreateAccountProvider` → `EditProfileProvider`
4. `SearchUserResultProvider` → `LogExchangeProvider`
5. `RouterProvider`

Admin routes are guarded by `<ProtectedRoute role="admin" />`.

## Key Conventions

- **API calls** use Axios with `withCredentials: true` and an `Accept-Language` interceptor for i18n
- **Server state** is managed through TanStack Query hooks in `hooks/query/`
- **Forms** use controlled inputs with Zod validation schemas
- **Translations** live in `translations/` and are loaded via i18next; the `Accept-Language` header keeps the backend in sync

## Dev Proxy

In development, the Vite config proxies `/api` requests to `VITE_API_URL`. This avoids CORS issues during local development.

## Deployment

Build with `npm run build` (outputs to `dist/`). Deploy as a static SPA — the `vercel.json` config handles SPA rewrites.
