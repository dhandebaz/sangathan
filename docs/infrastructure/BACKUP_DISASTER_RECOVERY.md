# Backup and Disaster Recovery

## Database Backup Procedure

### Automated Backups (Supabase Pro)

Supabase Pro plans include daily automated backups with 7-day retention. Point-in-time recovery (PITR) is available as an add-on. Configure retention and PITR in the Supabase dashboard under Database > Backups.

### Manual Backup (pg_dump via Supabase CLI)

Before any major migration or schema change, take a manual backup:

```bash
# Full database dump including all schemas
supabase db dump \
  --project-ref your-project-ref \
  -f backup_$(date +%Y%m%d_%H%M%S).sql

# Schema-only dump (no data)
supabase db dump \
  --project-ref your-project-ref \
  --schema-only \
  -f schema_$(date +%Y%m%d).sql

# Data-only dump (no schema)
supabase db dump \
  --project-ref your-project-ref \
  --data-only \
  -f data_$(date +%Y%m%d).sql
```

### Manual Backup (pg_dump via Connection String)

```bash
# Requires a connection string from Supabase dashboard
pg_dump \
  --no-owner \
  --no-acl \
  --format=custom \
  --file=backup_$(date +%Y%m%d).dump \
  "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Restore from custom format dump
pg_restore \
  --no-owner \
  --no-acl \
  --dbname=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres \
  backup_20260627.dump
```

### Backup Verification

After creating a backup, verify integrity:

```bash
# Check that the dump file is not empty
ls -lh backup_*.sql

# Try restoring to a temporary local database
supabase db start
supabase db restore --file backup_20260627.sql
```

## Redis Data

Upstash Redis handles persistence automatically:

- **Daily snapshots** are taken by Upstash and retained for 24 hours.
- **AOF (Append-Only File)** persistence logs every write operation.
- No manual backup is required. In the event of data loss, rate limit counters and queue state will reset harmlessly (rate limits re-throttle, queued jobs can be re-queued).

## Recovery Procedures

### Database Corruption

**Scenario**: Data inconsistency, missing rows, or corrupted records detected.

**Steps**:

1. **Isolate**: Place the app in maintenance mode.
2. **Assess**: Identify the scope and timing of the corruption.
3. **Restore**: Use the Supabase dashboard to restore the database to the most recent backup before the corruption occurred.
4. **Verify**: Run data integrity checks (referential integrity, constraint violations, orphaned records).
5. **Replay**: If any transactions occurred between the backup and the corruption, re-apply them from application logs (if available).
6. **Resume**: Disable maintenance mode and monitor for recurrence.

### Deployment Failure

**Scenario**: A new deployment introduces errors, breaks functionality, or causes a CI failure.

**Steps**:

1. **Immediate**: In the Vercel dashboard, navigate to Deployments and promote the last known good deployment.
2. **Verify**: Check `/api/health` and Sentry for error rates.
3. **Investigate**: Review the failing deployment's build logs and environment changes (new env vars, dependency upgrades).
4. **Fix**: Address the root cause in a new PR.
5. **Redeploy**: Merge the fix and deploy to production.

### Environment Variable Leak

**Scenario**: A secret (API key, service role key, signing secret) is accidentally committed to Git, exposed in logs, or leaked through a third party.

**Steps**:

1. **Rotate immediately**:

   | Leaked Variable | Rotation Action |
   |---|---|
   | `SUPABASE_SERVICE_ROLE_KEY` | Rotate in Supabase dashboard (Project Settings > API) |
   | `SUPABASE_ACCESS_TOKEN` | Revoke in Supabase dashboard (Account > Access Tokens) |
   | `UPSTASH_REDIS_REST_TOKEN` | Rotate in Upstash dashboard |
   | `COOKIE_SIGNING_SECRET` | Generate new secret and update env var. All signed cookies will be invalidated (users must re-login). |
   | `QR_TOKEN_SECRET` | Generate new secret. Existing QR tickets become invalid. |
   | `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Rotate in Stripe dashboard |
   | `RAZORPAY_KEY_SECRET` | Rotate in Razorpay dashboard |
   | `OPENAI_API_KEY` | Rotate in OpenAI dashboard |
   | `GITHUB_TOKEN` | Revoke in GitHub (Settings > Developer Settings) |
   | `VAPID_PRIVATE_KEY` | Generate new VAPID keys. Push subscriptions will need re-subscription. |
   | `CRON_SECRET` | Generate new secret. Update all cron job configurations. |

2. **Update env vars**: Set the new values in Vercel project settings and in local `.env.local`.
3. **Redeploy**: Trigger a fresh deployment so all instances pick up the new secrets.
4. **Audit**: Check Git history for the leaked secret. If found in a commit, follow GitHub's guide for removing sensitive data (BFG Repo-Cleaner or git filter-branch). Notify the team.
5. **Prevent recurrence**: The pre-commit hook (`scripts/scan-secrets.mjs`) should detect future leaks. Verify it is active.

### Full Outage (Multi-Service Failure)

**Scenario**: Multiple services are down (e.g., Vercel + Supabase region outage).

**Steps**:

1. **Declare incident**: Notify the team and stakeholders. Use the status page.
2. **Assess**: Check status pages for Vercel (vercel-status.com), Supabase (status.supabase.com), Upstash (status.upstash.com), and Sentry (status.sentry.io).
3. **Mitigate**: If only one region is affected, consider a DNS-level failover to a secondary deployment region. If no cross-region setup exists, wait for provider recovery.
4. **Communicate**: Provide regular updates via the status page.
5. **Post-incident**: Review SLAs, consider multi-region architecture if outages are frequent.

## Recovery Runbook

### Restoring from a Supabase Backup

```bash
# 1. Verify the backup file exists and is recent
ls -la backup_20260627.sql

# 2. Stop the application (optional - set maintenance mode)
# Set NEXT_PUBLIC_MAINTENANCE_MODE=true and redeploy

# 3. Restore using Supabase CLI
supabase db restore \
  --project-ref your-project-ref \
  --file backup_20260627.sql

# 4. Or restore via the Supabase dashboard:
#    - Go to Database > Backups
#    - Click "Restore" on the desired backup
#    - Confirm the restore operation

# 5. Verify database integrity
supabase db push  # Re-apply any pending migrations

# 6. Verify application health
curl https://sangathan.app/api/health

# 7. Disable maintenance mode
# Set NEXT_PUBLIC_MAINTENANCE_MODE=false and redeploy

# 8. Run smoke tests
npm run build  # Verify the build succeeds
```

### Emergency Migration Rollback

If a migration causes issues and you cannot immediately create a rollback migration:

1. Access the Supabase dashboard SQL editor.
2. Run the inverse of the broken migration manually.
3. Verify the schema returns to the previous state.
4. Create a proper rollback migration file and apply it to keep migration history consistent.
5. Investigate why the migration caused issues and fix the source.
