-- Phase 4: High-Scale Performance & Security Optimization

-- 1. Optimizing Member Queries
-- Partial index for active members (excludes soft-deleted rows from index, smaller & faster)
CREATE INDEX IF NOT EXISTS idx_members_active_org ON members(organisation_id) WHERE deleted_at IS NULL;
-- Support email lookups
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
-- Support fast role filtering
CREATE INDEX IF NOT EXISTS idx_members_role ON members(organisation_id, role);

-- 2. Optimizing Form Submissions
-- Composite index for dashboard stats: "Show submissions for this form, newest first"
CREATE INDEX IF NOT EXISTS idx_submissions_form_date ON form_submissions(form_id, created_at DESC);
-- Optimizing RLS checks and org-wide aggregation
CREATE INDEX IF NOT EXISTS idx_submissions_org ON form_submissions(organisation_id);

-- 3. Audit Log Performance (Partitioning Preparation)
-- For now, just indexing time for date-range queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
-- Index resource_id for "Show history of this member"
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_table, resource_id);

-- 4. Webhook & System Logs Cleanup
-- Index for finding old events to prune
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at);
-- Index for checking idempotency quickly (already has UNIQUE constraint but index helps)
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(provider, event_id);

-- 5. Soft Delete Support for other tables
CREATE INDEX IF NOT EXISTS idx_orgs_active ON organisations(id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_forms_active ON forms(organisation_id) WHERE deleted_at IS NULL;

-- 6. Rate Limiting Cleanup
-- Index for finding expired rate limits
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- 7. Full Text Search (Optional but recommended for Members)
-- Enable pg_trgm extension if not enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- GIN Index for fuzzy search on member names
CREATE INDEX IF NOT EXISTS idx_members_name_trgm ON members USING GIN (full_name gin_trgm_ops);

-- 8. OTP Abuse Tracking
CREATE TABLE IF NOT EXISTS otp_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  ip_address TEXT,
  success BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Index for finding recent attempts by phone or IP
CREATE INDEX IF NOT EXISTS idx_otp_phone_recent ON otp_attempts(phone, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_otp_ip_recent ON otp_attempts(ip_address, created_at DESC);
