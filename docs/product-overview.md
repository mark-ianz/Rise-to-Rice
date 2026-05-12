# Product Overview

## Mission

Rise to Rice turns recyclable waste into community value. The application supports a recycling program where collected materials are weighed, converted into points, and redeemed for rewards.

The public-facing copy currently positions the product as:
- community-driven
- sustainability-focused
- centered on recycling education
- oriented toward redeeming points for rice and other rewards

## User Roles

The code currently recognizes three account roles:
- `user`
- `admin`
- `super_admin`

Role behavior in the frontend:
- guests can browse public pages and submit contact forms
- authenticated users can access profile, rewards, and redeem history
- admins can access the dashboard
- super admins inherit admin behavior and additionally control user role changes and user deletion in the backend

## Primary User Flows

### Public Visitor

1. Land on the homepage.
2. Learn how the program works.
3. Read announcements.
4. Read the about page and partner information.
5. Submit a contact message.
6. Register or log in.

### Registered User

1. Log in with email and password.
2. View and update profile information.
3. View accumulated points.
4. Browse rewards and variations.
5. Submit redeem requests.
6. View redeem history.
7. React to announcements.

### Admin

1. Open the dashboard.
2. Search and manage users.
3. Log material exchanges for users.
4. Manage materials and categories.
5. Manage rewards and reward variations.
6. Review and update redeem requests.
7. Review contact messages.
8. Publish, edit, and delete announcements.
9. View dashboard analytics.

## Frontend Route Inventory

Routes are declared in `frontend/src/main.tsx`.

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | public | Landing page |
| `/register` | guest-only | Account creation |
| `/login` | guest-only | User login |
| `/forgot-password` | guest-only | Password reset flow |
| `/profile` | authenticated user | Profile and personal data |
| `/announcements` | public | Announcement list |
| `/announcements/:id` | public | Single announcement view |
| `/about-us` | public | Mission, vision, and program context |
| `/contact-us` | public | Contact form |
| `/redeem-rewards` | authenticated user | Reward browsing and redemption |
| `/redeem-history` | authenticated user | User redemption history |
| `/dashboard` | admin | Dashboard home |
| `/dashboard/users` | admin | User search and management |
| `/dashboard/users/:id` | admin | Single user view |
| `/dashboard/redeem-request` | admin | Redeem request moderation |
| `/dashboard/rewards` | admin | Reward management |
| `/dashboard/materials` | admin | Material and category management |
| `/dashboard/contact-messages` | admin | Contact message review |

## Product Modules Present In The Frontend

- marketing pages
- bilingual content with `en` and `tl` translations
- authentication and session awareness
- profile management
- announcement feed and announcement reactions
- reward browsing and redemption
- admin dashboard and operational tooling
- charts and analytics

## Localization

The frontend initializes `i18next` with two languages:
- `en`
- `tl`

Namespaces currently loaded include:
- `global`
- `landing_page`
- `announcements`
- `education_and_awareness`
- `about_us`
- `contact_us`
- `register`
- `form`
- `profile`
- `redeem_rewards`
- `header`
- `analytics`
- `login`
- `forgot_password`
- `footer`
- `change_password`

## Search And Pagination Behavior

The app uses repeated admin list patterns:
- page-based pagination
- text search via `search`
- field selection via `searchFor`
- role or status filters for some dashboard views
- frontend list pages commonly request `limit=50`
