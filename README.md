# Sangathan

Sangathan is a multi-tenant civic organisation platform built with Next.js and Supabase.

## Stack

- Next.js App Router
- Supabase for auth, database, RLS, and admin/service workflows
- Web Push via `web-push`

## Scripts

```bash
npm run dev           # Development server
npm run build         # Production build
npm run start         # Start production server
npm run lint          # ESLint
npm run audit         # Dependency vulnerability audit
npm run secrets:scan  # Scan for leaked secrets in codebase
npm run precommit     # Secrets scan + lint (for CI/local hooks)
npm run ci            # Full CI pipeline locally
```

## Core Environment

Create `.env.local` with the values your environment needs.

```env
NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

COOKIE_SIGNING_SECRET=
QR_TOKEN_SECRET=

NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
PUSH_CONTACT_EMAIL=

CRON_SECRET=
SUPER_ADMIN_EMAILS=
ALLOWED_SERVICE_IPS=       # Comma-separated IPs allowed to use service client

NEXT_PUBLIC_MAINTENANCE_MODE=false
MAINTENANCE_BYPASS_SECRET=
```

## Notes

- Public form submissions now rely on signed tokens; `COOKIE_SIGNING_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` must be present.
- Event QR tickets now use a server-side signing secret; set `QR_TOKEN_SECRET` for production.
- Push delivery is real, not stubbed; it requires the VAPID keys and contact email above.

## Git Hooks

Install pre-commit hooks to automatically scan for secrets:

```bash
git config core.hooksPath .githooks
```

## Verification

```bash
npm run lint
npm run build
npm run audit
```

All pass in the current repo state.
