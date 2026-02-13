-- Phase 3: Governance & Compliance Layer

-- 1. Soft Delete Infrastructure
-- Add deleted_at to core tables (except audit/system logs which are immutable)
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE forms ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Legal Hold & Governance
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN DEFAULT FALSE;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMPTZ;

-- 3. Data Privacy Requests (GDPR/DPDP)
CREATE TABLE IF NOT EXISTS data_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES organisations(id),
  user_id UUID REFERENCES auth.users(id),
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'deletion', 'correction', 'access')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected', 'failed')),
  details JSONB DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Immutable Audit Logs (Enforcement)
-- Revoke update/delete permissions from everyone (even service role should ideally not delete, but we need retention policies)
REVOKE UPDATE, DELETE ON audit_logs FROM authenticated, anon;

-- Create a rule to prevent updates (Postgres Rule is stronger than RLS)
CREATE OR REPLACE RULE no_update_audit_logs AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;

-- 5. Data Access Logs (Sensitive Access Tracking)
CREATE TABLE IF NOT EXISTS data_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  organisation_id UUID REFERENCES organisations(id),
  resource_type TEXT NOT NULL, -- 'member_list', 'donation_export', 'audit_export'
  action_type TEXT NOT NULL, -- 'view', 'export', 'search'
  query_details JSONB, -- what filters were used
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies

-- Data Requests: Users can see their own, Org Admins see orgs, System Admin see all
ALTER TABLE data_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own requests" ON data_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Org admins view org requests" ON data_requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.organisation_id = data_requests.organisation_id 
    AND profiles.role = 'admin'
  )
);
CREATE POLICY "System admins view all requests" ON data_requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_platform_admin = true
  )
);

-- Data Access Logs: Only System Admins can view (Security Audit)
ALTER TABLE data_access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System admins view access logs" ON data_access_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_platform_admin = true
  )
);

-- Soft Delete Views (Optional, but usually handled in Application Layer queries)
-- We will handle filtering `where deleted_at is null` in the application code.
