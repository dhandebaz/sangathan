-- Migration: Superadmin system tables and policies
-- Ensures all tables required by the admin panel exist with proper RLS policies

-- 1. Ensure system_settings has all required columns
ALTER TABLE IF EXISTS public.system_settings
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Ensure data_requests has details column
ALTER TABLE IF EXISTS public.data_requests
  ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}';

-- 3. Ensure appeals has all required columns
ALTER TABLE IF EXISTS public.appeals
  ADD COLUMN IF NOT EXISTS resolution_note TEXT,
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 4. Add broadcast_restricted to organisations if not exists
ALTER TABLE IF EXISTS public.organisations
  ADD COLUMN IF NOT EXISTS broadcast_restricted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT,
  ADD COLUMN IF NOT EXISTS risk_score NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 5. Platform admin policies for all system tables
-- These allow platform admins (where profiles.is_platform_admin = true) to read/write system tables

-- Helper function to check platform admin status
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND is_platform_admin = true
  );
$$;

-- system_settings RLS
DROP POLICY IF EXISTS "Platform admins can manage system_settings" ON public.system_settings;
CREATE POLICY "Platform admins can manage system_settings"
  ON public.system_settings
  FOR ALL
  USING (public.is_platform_admin());

-- system_logs RLS
DROP POLICY IF EXISTS "Platform admins can view system_logs" ON public.system_logs;
CREATE POLICY "Platform admins can view system_logs"
  ON public.system_logs
  FOR SELECT
  USING (public.is_platform_admin());

-- system_jobs RLS
DROP POLICY IF EXISTS "Platform admins can view system_jobs" ON public.system_jobs;
CREATE POLICY "Platform admins can view system_jobs"
  ON public.system_jobs
  FOR SELECT
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admins can update system_jobs" ON public.system_jobs;
CREATE POLICY "Platform admins can update system_jobs"
  ON public.system_jobs
  FOR UPDATE
  USING (public.is_platform_admin());

-- platform_actions RLS
DROP POLICY IF EXISTS "Platform admins can view platform_actions" ON public.platform_actions;
CREATE POLICY "Platform admins can view platform_actions"
  ON public.platform_actions
  FOR SELECT
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admins can insert platform_actions" ON public.platform_actions;
CREATE POLICY "Platform admins can insert platform_actions"
  ON public.platform_actions
  FOR INSERT
  WITH CHECK (public.is_platform_admin());

-- webhook_events RLS
DROP POLICY IF EXISTS "Platform admins can view webhook_events" ON public.webhook_events;
CREATE POLICY "Platform admins can view webhook_events"
  ON public.webhook_events
  FOR SELECT
  USING (public.is_platform_admin());

-- risk_events RLS
DROP POLICY IF EXISTS "Platform admins can manage risk_events" ON public.risk_events;
CREATE POLICY "Platform admins can manage risk_events"
  ON public.risk_events
  FOR ALL
  USING (public.is_platform_admin());

-- data_access_logs RLS
DROP POLICY IF EXISTS "Platform admins can view data_access_logs" ON public.data_access_logs;
CREATE POLICY "Platform admins can view data_access_logs"
  ON public.data_access_logs
  FOR SELECT
  USING (public.is_platform_admin());

-- data_requests RLS - platform admins can view all
DROP POLICY IF EXISTS "Platform admins can view all data_requests" ON public.data_requests;
CREATE POLICY "Platform admins can view all data_requests"
  ON public.data_requests
  FOR SELECT
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admins can update data_requests" ON public.data_requests;
CREATE POLICY "Platform admins can update data_requests"
  ON public.data_requests
  FOR UPDATE
  USING (public.is_platform_admin());

-- organisations RLS - platform admins can read all
DROP POLICY IF EXISTS "Platform admins can view all organisations" ON public.organisations;
CREATE POLICY "Platform admins can view all organisations"
  ON public.organisations
  FOR SELECT
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admins can update organisations" ON public.organisations;
CREATE POLICY "Platform admins can update organisations"
  ON public.organisations
  FOR UPDATE
  USING (public.is_platform_admin());

-- Ensure announcements table has created_by column
ALTER TABLE IF EXISTS public.announcements
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS send_email BOOLEAN DEFAULT false;

-- Platform admins can view all announcements
DROP POLICY IF EXISTS "Platform admins can view all announcements" ON public.announcements;
CREATE POLICY "Platform admins can view all announcements"
  ON public.announcements
  FOR SELECT
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admins can manage announcements" ON public.announcements;
CREATE POLICY "Platform admins can manage announcements"
  ON public.announcements
  FOR ALL
  USING (public.is_platform_admin());

-- Profile policy: platform admins can view all profiles
DROP POLICY IF EXISTS "Platform admins can view all profiles" ON public.profiles;
CREATE POLICY "Platform admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_platform_admin());

-- billing_plans: platform admins can view all
DROP POLICY IF EXISTS "Platform admins can view billing_plans" ON public.billing_plans;
CREATE POLICY "Platform admins can view billing_plans"
  ON public.billing_plans
  FOR SELECT
  USING (public.is_platform_admin());

-- invoices: platform admins can view all
DROP POLICY IF EXISTS "Platform admins can view invoices" ON public.invoices;
CREATE POLICY "Platform admins can view invoices"
  ON public.invoices
  FOR SELECT
  USING (public.is_platform_admin());

-- Ensure admin_list_users function exists (idempotent)
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE(
  id UUID,
  email TEXT,
  full_name TEXT,
  is_platform_admin BOOLEAN,
  status TEXT,
  organisation_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow platform admins to execute this
  IF NOT public.is_platform_admin() THEN
    RAISE EXCEPTION 'Only platform admins can list all users';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.email::TEXT,
    p.full_name::TEXT,
    p.is_platform_admin,
    p.status::TEXT,
    COUNT(*) OVER (PARTITION BY p.id)::BIGINT AS organisation_count
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- Update the get_modified_columns function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add platform admins to audit_logs selector
DROP POLICY IF EXISTS "Platform admins can view audit_logs" ON public.audit_logs;
CREATE POLICY "Platform admins can view audit_logs"
  ON public.audit_logs
  FOR SELECT
  USING (public.is_platform_admin());

-- Row level security for rate_limits view (platform admins)
DROP POLICY IF EXISTS "Platform admins can view rate_limits" ON public.rate_limits;
CREATE POLICY "Platform admins can view rate_limits"
  ON public.rate_limits
  FOR SELECT
  USING (public.is_platform_admin());

-- Create incident_logs table if not exists
CREATE TABLE IF NOT EXISTS public.incident_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'monitoring')),
  detected_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

ALTER TABLE public.incident_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admins can manage incident_logs" ON public.incident_logs;
CREATE POLICY "Platform admins can manage incident_logs"
  ON public.incident_logs
  FOR ALL
  USING (public.is_platform_admin());

-- Add indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at);
CREATE INDEX IF NOT EXISTS idx_organisations_deleted_at ON public.organisations(deleted_at);
CREATE INDEX IF NOT EXISTS idx_organisations_status ON public.organisations(status);
CREATE INDEX IF NOT EXISTS idx_organisations_org_type ON public.organisations(org_type);
CREATE INDEX IF NOT EXISTS idx_organisations_legal_hold ON public.organisations(legal_hold);
CREATE INDEX IF NOT EXISTS idx_organisations_broadcast_restricted ON public.organisations(broadcast_restricted);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_jobs_status ON public.system_jobs(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON public.webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON public.webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_appeals_status ON public.appeals(status);
CREATE INDEX IF NOT EXISTS idx_platform_actions_target_org ON public.platform_actions(target_org_id);
CREATE INDEX IF NOT EXISTS idx_risk_events_severity ON public.risk_events(severity);
CREATE INDEX IF NOT EXISTS idx_data_requests_status ON public.data_requests(status);
CREATE INDEX IF NOT EXISTS idx_announcements_org ON public.announcements(organisation_id);
