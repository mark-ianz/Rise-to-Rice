# Environment Reference

This file documents the environment variables currently present in `frontend/.env` and `backend/.env`, along with whether the current codebase still reads them.

No secret values are copied into this document.

## Frontend Environment Variables

| Variable | Used by current code | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | yes | Vite dev proxy target for `/api` requests |
| `VITE_MINIMUM_PASSWORD_LENGTH` | yes | Mirrors backend password-length rule in client validation |
| `VITE_CONTACT_NUMBER_LENGTH` | yes | Mirrors backend contact-number rule in client validation |
| `VITE_FRONTEND_BASE_URL` | yes | Base URL used by the announcement share button |
| `VITE_IMGUR_CLIENT_ID` | no | Present in `.env`, but no active code reference was found |

## Backend Environment Variables

| Variable | Used by current code | Purpose |
| --- | --- | --- |
| `PORT` | yes | Express listen port |
| `HOST` | yes | Express listen host |
| `MINIMUM_USERNAME_LENGTH` | no | Present in `.env`, but no active code reference was found |
| `MAXIMUM_USERNAME_LENGTH` | no | Present in `.env`, but no active code reference was found |
| `MINIMUM_PASSWORD_LENGTH` | yes | Password validation rule |
| `CONTACT_NUMBER_LENGTH` | yes | Contact-number validation rule |
| `DB_HOSTNAME` | yes | MySQL host |
| `DB_USER` | yes | MySQL user |
| `DB_PASSWORD` | yes | MySQL password |
| `DB_NAME` | yes | MySQL database name |
| `SALT_ROUND` | yes | bcrypt salt rounds |
| `ACCESS_TOKEN_SECRET` | yes | JWT signing secret for auth tokens |
| `REFRESH_TOKEN_SECRET` | yes | JWT signing secret for refresh tokens |
| `IMGUR_CLIENT_ID` | no | Present in `.env`, but no active code reference was found |
| `NODEMAILER_EMAIL_ADDRESS` | yes | SMTP sender address |
| `NODEMAILER_EMAIL_PASSWORD` | yes | SMTP credential |
| `NODEMAILER_SMTP_HOST` | yes | SMTP host |
| `NODEMAILER_SMTP_PORT` | yes | SMTP port |
| `FRONTEND_URL` | yes | CORS origin allowlist value |

## Where These Variables Are Used

Frontend code references:
- `frontend/vite.config.ts`
- `frontend/src/schema/CreateAccountSchema.ts`
- `frontend/src/schema/UpdatePersonalInfoSchema.ts`
- `frontend/src/schema/tl/CreateAccountSchema.ts`
- `frontend/src/schema/tl/UpdatePersonalInfoSchema.ts`
- `frontend/src/components/page-components/announcements/ShareButton.tsx`

Backend code references:
- `backend/src/index.ts`
- `backend/src/connection/database.ts`
- `backend/src/nodemailer/transporter.ts`
- `backend/src/middleware/authentication.ts`
- `backend/src/controllers/auth.ts`
- `backend/src/helpers/jwt.ts`
- `backend/src/helpers/hash.ts`
- `backend/src/helpers/mailer.ts`
- `backend/src/schema/UserCreate.ts`
- `backend/src/schema/UserUpdate.ts`

## Notes

- The frontend and backend both keep validation-related environment variables for password length and contact number length. Those values should stay aligned.
- `FRONTEND_URL` controls CORS and should match the browser origin serving the frontend.
- The repo currently has no `.env.example` files, so this document is the only checked-in environment reference at the time of writing.
