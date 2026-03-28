# Sangathan

Sangathan is a multi-tenant civic organisation platform built with Next.js, Supabase, Firebase phone auth, Razorpay subscriptions, and Sender email delivery.

## Stack

- Next.js App Router
- Supabase for auth, database, RLS, and admin/service workflows
- Firebase for phone verification
- Razorpay for supporter subscriptions
- Sender for transactional email
- Web Push via `web-push`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
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

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_PLAN_ID=
RAZORPAY_WEBHOOK_SECRET=

SENDER_API_KEY=
SENDER_FROM_EMAIL=
SENDER_FROM_NAME=

NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
PUSH_CONTACT_EMAIL=

CRON_SECRET=
SUPER_ADMIN_EMAILS=

NEXT_PUBLIC_MAINTENANCE_MODE=false
MAINTENANCE_BYPASS_SECRET=
```

## Notes

- Public form submissions now rely on signed tokens; `COOKIE_SIGNING_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` must be present.
- Event QR tickets now use a server-side signing secret; set `QR_TOKEN_SECRET` for production.
- Push delivery is real, not stubbed; it requires the VAPID keys and contact email above.
- Razorpay no longer initializes with dummy credentials; missing keys will fail the supporter flow instead of silently degrading.

## Verification

Current expected verification commands:

```bash
npm run lint
npm run build
```

Both pass in the current repo state.
