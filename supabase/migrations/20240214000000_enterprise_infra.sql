-- Phase 2: Enterprise Infrastructure

-- 1. System Jobs (Queue System)
CREATE TABLE IF NOT EXISTS system_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  last_error TEXT,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for finding pending jobs quickly
CREATE INDEX IF NOT EXISTS idx_system_jobs_status_locked ON system_jobs(status, locked_until);

-- 2. System Logs (Structured Logging)
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'security', 'critical')),
  source TEXT NOT NULL, -- e.g., 'auth', 'payment', 'api'
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id),
  organisation_id UUID REFERENCES organisations(id),
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering logs
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_org_id ON system_logs(organisation_id);

-- 3. Rate Limits (Persistent Store)
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY, -- e.g., 'ip:127.0.0.1:login'
  points INT NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Webhook Events (Idempotency & Audit)
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL, -- 'razorpay', 'firebase', etc.
  event_id TEXT NOT NULL, -- External ID for idempotency
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processed', 'failed', 'ignored')),
  processing_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, event_id)
);

-- 5. System Settings (Maintenance Mode & Config)
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default maintenance mode setting
INSERT INTO system_settings (key, value, description)
VALUES ('maintenance_mode', '{"enabled": false, "message": "System is under maintenance. Please check back later."}'::jsonb, 'Global maintenance mode switch')
ON CONFLICT (key) DO NOTHING;

-- RLS Policies

-- System Jobs: Only accessible by service role (admin functions)
ALTER TABLE system_jobs ENABLE ROW LEVEL SECURITY;
-- No policies means only service role can access

-- System Logs: Viewable by System Admins only
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System admins can view all logs" ON system_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_platform_admin = true
    )
  );

-- Rate Limits: Service role only
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Webhook Events: Service role for insert, System Admin for view
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System admins can view webhooks" ON webhook_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_platform_admin = true
    )
  );

-- System Settings: Public read (for maintenance check), System Admin write
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read system settings" ON system_settings
  FOR SELECT
  USING (true);

CREATE POLICY "System admins can update settings" ON system_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_platform_admin = true
    )
  );
