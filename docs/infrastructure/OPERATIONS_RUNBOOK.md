# Operations Runbook

## Architecture Overview

Sangathan is a multi-tenant civic governance platform built on Next.js (App Router) deployed to Vercel. Supabase provides the database (PostgreSQL), authentication (built-in auth with Row Level Security), and file storage. Upstash Redis handles rate limiting and background job queues. Error monitoring is provided by Sentry across client, server, and edge runtimes. Payment processing is handled by Razorpay (primary, for Indian market) with Stripe as a secondary integration. Push notifications are delivered via the Web Push API using VAPID keys. The application uses a service worker (Serwist) for offline caching and PWA capabilities.

## Required Services

| Service | Purpose | Plan Recommendation | Criticality |
|---|---|---|---|
| **Supabase** | Database, Auth, Storage, Realtime | Pro (for row-level security, daily backups) | Critical |
| **Upstash Redis** | Rate limiting, job queues, session cache | Pay-as-you-go | High |
| **Sentry** | Error tracking (client, server, edge) | Team plan for alert rules | High |
| **Stripe** | Payment processing (secondary) | Pay-as-you-go | Low |
| **Razorpay** | Payment processing (primary, India) | Pay-as-you-go | Medium |
| **Vercel** | Hosting, CI/CD, Edge Functions, Cron Jobs | Pro (for cron, team features) | Critical |
| **Serwist** | Service worker / PWA | Free (open source) | Low |

## Local Development

### Prerequisites

- Node.js >= 18
- npm
- Supabase CLI (`npm install -g supabase`)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Fill in .env.local with your values (see .env.example for descriptions)

# 4. Start Supabase locally (optional, for local DB)
supabase start
supabase status

# 5. Start Next.js dev server
npm run dev
```

### Environment File

The project uses `.env.local` for local development. See `.env.example` for the complete list of variables with descriptions. Missing optional variables will cause the relevant feature to gracefully degrade (e.g., Redis falls back to a mock client; push notifications throw a descriptive error).

### Supabase Local Development

```bash
# Start local Supabase stack
supabase start

# Apply migrations
supabase db push

# Generate TypeScript types from local DB
supabase gen types typescript --local > src/types/database.ts

# Create a new migration
supabase migration new migration_name

# Reset local DB
supabase db reset
```

### Verification

```bash
npm run lint
npm run build
npm run audit
npm run secrets:scan
```

## Database Management

### Applying Migrations

Migrations are run with the Supabase CLI against the remote project:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

### Rolling Back a Migration

Supabase does not natively support rollbacks. To revert:

1. Create a new migration that reverses the changes.
2. Apply it via `supabase db push`.
3. If the database is in a broken state, restore from a backup.

### Backup

Supabase Pro plans include daily automated backups with 7-day retention. For manual backups:

```bash
# Via Supabase CLI
supabase db dump -f backup_$(date +%Y%m%d).sql

# Via pg_dump directly (requires connection string)
pg_dump --no-owner --no-acl "postgresql://..." > backup_$(date +%Y%m%d).sql
```

For project-level configuration, use the Supabase dashboard to download a backup or trigger an on-demand backup.

## Monitoring

### Sentry Error Tracking

Sentry is configured for three runtimes:

- **Client** (`sentry.client.config.ts`): Browser errors, uses `NEXT_PUBLIC_SENTRY_DSN`.
- **Server** (`sentry.server.config.ts`): Node.js server errors, uses `SENTRY_DSN`.
- **Edge** (`sentry.edge.config.ts`): Edge runtime errors, uses `SENTRY_DSN`.

Source maps are uploaded during `next build` for readable stack traces. Configure `SENTRY_ORG` and `SENTRY_PROJECT` in environment variables.

### Health Check Endpoint

`GET /api/health` returns:

```json
{ "ok": true, "latency": 42, "timestamp": "2026-06-27T..." }
```

or `503` with `{ "ok": false, "error": "database_unhealthy" }` if the database query fails.

Set up external monitoring (e.g., Pingdom, Better Uptime) to hit this endpoint every minute.

### Logging

Structured logging is available via `@/lib/logger` and writes to `console`. In production, these logs are captured by Vercel's log drain. Configure a log drain to forward to your observability platform.

## Deployment

### CI/CD Pipeline

The CI pipeline (`npm run ci`) runs:

1. `npm run lint` - ESLint
2. `npm run build` - Production build (also uploads Sentry source maps)
3. `npm run audit` - Dependency vulnerability audit

### Vercel Deployment

1. Push to the `main` branch (or configured production branch).
2. Vercel automatically detects the Next.js project and builds.
3. Set all required environment variables in the Vercel project dashboard.
4. Configure the following Vercel Cron Jobs:

| Cron Expression | Endpoint | Purpose |
|---|---|---|
| `*/5 * * * *` | `GET /api/cron/process-jobs` | Process background job queue |

The cron endpoint is authenticated via the `x-cron-secret` header, which must match the `CRON_SECRET` environment variable.

### Environment Variable Management

- **Vercel**: Set in Project Settings > Environment Variables. Mark sensitive vars as "Encrypted".
- **Local**: `.env.local` (never committed).
- Never commit secrets to the repository. The pre-commit hook (`npm run precommit`) runs `scripts/scan-secrets.mjs` to detect leaks.

## Incident Response

### Health Check Failure

**Symptoms**: `/api/health` returns non-200 status, monitoring alert fires.

**Response**:

1. Check Vercel dashboard for deployment status and recent builds.
2. Check Supabase dashboard for database status (region health, connection pool usage).
3. Check Sentry for a spike in errors.
4. If database-related: verify Supabase connectivity, check for active incidents on status.supabase.com.
5. If deployment-related: roll back to the last known good deployment in Vercel.

### High Error Rate

**Symptoms**: Sentry alert fires for error rate spike.

**Response**:

1. Open Sentry and identify the affected error(s).
2. Determine if the error is client-side (browser/environment specific) or server-side.
3. For client-side: check for recent frontend changes, browser version issues.
4. For server-side: check logs in Vercel, check for recent deployment or env var changes.
5. If caused by a third-party service degradation, switch to fallback or feature-flag disable.

### Database Issues

**Symptoms**: Slow queries, connection pool exhaustion, query timeouts.

**Response**:

1. Check Supabase dashboard for database metrics (connections, CPU, IOPS).
2. Identify slow queries via Supabase Query Performance.
3. Check the circuit breaker in `@/lib/circuit-breaker` logs for repeated failures.
4. If connection pool is exhausted: scale up on Supabase, or reduce connection usage (check for unclosed clients).
5. If query performance: add missing indexes, optimize queries, or increase resources.

### Redis (Upstash) Outage

**Symptoms**: Rate limiting stops working, job queue stalls.

**Response**:

1. Check Upstash dashboard for service status.
2. The Redis client in `@/lib/redis.ts` falls back to a mock client if env vars are missing, but the app will lose rate limiting and job queuing.
3. If extended outage: consider failing open for rate limiting (allow traffic) or shutting off specific features.
4. No data loss concern: Upstash handles persistence and replication.

## Backup Strategy

### Database

- **Automatic**: Supabase Pro plan includes daily backups with 7-day retention.
- **Manual**: Run `supabase db dump` or pg_dump before major migrations.
- **Point-in-time recovery**: Available on Supabase Pro plan (configure retention window in dashboard).

### Application State

- Redis data (rate limit counters, queue state) is ephemeral and managed by Upstash. Upstash handles persistence.
- File storage (Supabase Storage) is managed by Supabase and backed up with the project.
- Source code is in Git (GitHub).
- Environment variables are stored in Vercel dashboard (with fallback to local `.env.local`).

## Security Checklist

- [ ] **Environment Variables**: All secrets use Vercel Encrypted environment variables. Never committed to Git.
- [ ] **RLS Policies**: All Supabase tables have Row Level Security enabled. Service client used only where necessary.
- [ ] **CSP Headers**: Content Security Policy is applied in middleware (see `middleware.ts`). Covers script-src, style-src, connect-src, frame-src, object-src, form-action, base-uri, and worker-src.
- [ ] **Security Headers**: X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Strict-Transport-Security (2 years), Permissions-Policy, Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy are all set in middleware.
- [ ] **CORS**: API routes restrict Access-Control-Allow-Origin to `NEXT_PUBLIC_APP_URL`.
- [ ] **Audit Logging**: Admin actions are logged via `@/lib/audit/log.ts`.
- [ ] **Request Body Size**: Middleware rejects requests larger than 100KB.
- [ ] **Service Client IP Whitelist**: `ALLOWED_SERVICE_IPS` restricts which IPs can use the service client. Falls back to localhost-only.
- [ ] **Webhook Verification**: Stripe and GitHub webhooks verify signatures before processing.
- [ ] **Cron Authentication**: Cron endpoints require `x-cron-secret` header matching `CRON_SECRET`.
- [ ] **Pre-commit Hooks**: `npm run precommit` runs secrets scan + lint before each commit.
- [ ] **Cookie Security**: Auth cookies are HTTP-only. Secure flag enabled in production.
- [ ] **Dependency Audits**: `npm run audit` checks for high-severity vulnerabilities in CI.

## Scaling Considerations

- **Redis for Rate Limiting**: The Upstash Redis client (`@/lib/redis.ts`) and rate limiter (`@/lib/ratelimit.ts`) use sliding window rate limiting. As traffic grows, monitor Upstash request limits and upgrade the plan as needed.
- **Supabase Connection Pooling**: Supabase enforces connection limits based on plan. Use the built-in PgBouncer connection pooling. The server client uses a 15-second timeout and circuit breaker to prevent connection hanging.
- **Database Indexing**: Monitor query performance in Supabase dashboard. Add composite indexes for frequently queried patterns (organisation_id + created_at, user_id + resource_table, etc.).
- **Edge Functions**: Consider moving compute-heavy operations (report generation, bulk notification sending) to Supabase Edge Functions deployed close to the database.
- **CDN Caching**: Static assets are served via Vercel's Edge Network. API responses can be cached at the edge for public endpoints (health check, public forms).
- **Job Queue**: Background jobs are processed via the queue in `@/lib/queue.ts` and triggered by Vercel Cron Jobs. For higher throughput, consider dedicated queue workers or Supabase Edge Functions.
