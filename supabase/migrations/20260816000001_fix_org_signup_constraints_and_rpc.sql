-- 20260816000001_fix_org_signup_constraints_and_rpc.sql
-- Fixes check constraints on organisations, adds unique constraint on org_roles,
-- and updates create_organisation_and_admin stored procedure to safely support all 5 org types.

-- ============================================================================
-- 1. Fix organisations.org_type check constraint
-- ============================================================================
ALTER TABLE public.organisations 
  DROP CONSTRAINT IF EXISTS organisations_org_type_check;

ALTER TABLE public.organisations 
  ADD CONSTRAINT organisations_org_type_check 
  CHECK (org_type IN ('civic_collective', 'ngo', 'student_union', 'workers_union', 'rwa', 'other'));

-- ============================================================================
-- 2. Drop obsolete plan_registration_check constraint
-- ============================================================================
ALTER TABLE public.organisations 
  DROP CONSTRAINT IF EXISTS plan_registration_check;

-- ============================================================================
-- 3. Add unique constraint on org_roles for ON CONFLICT resolution
-- ============================================================================
ALTER TABLE public.org_roles 
  DROP CONSTRAINT IF EXISTS uq_org_roles_org_name;

ALTER TABLE public.org_roles 
  ADD CONSTRAINT uq_org_roles_org_name UNIQUE (organisation_id, name);

-- ============================================================================
-- 4. Update create_organisation_and_admin function with defaults and safe casts
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_organisation_and_admin(
  p_org_name TEXT,
  p_org_slug TEXT,
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_org_type TEXT DEFAULT 'civic_collective',
  p_registration_status TEXT DEFAULT 'unregistered'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id UUID;
  v_capabilities JSONB;
  v_reg_status public.registration_status;
BEGIN
  IF p_org_type = 'student_union' THEN
    v_capabilities := '{"basic_governance": true, "campaigns": true, "student_ids": true, "events": true}'::jsonb;
  ELSIF p_org_type = 'ngo' THEN
    v_capabilities := '{"basic_governance": true, "donations": true, "volunteers": true, "events": true}'::jsonb;
  ELSIF p_org_type = 'workers_union' THEN
    v_capabilities := '{"basic_governance": true, "grievances": true, "memberships": true}'::jsonb;
  ELSIF p_org_type = 'rwa' THEN
    v_capabilities := '{"basic_governance": true, "complaints": true, "maintenance": true}'::jsonb;
  ELSIF p_org_type = 'civic_collective' THEN
    v_capabilities := '{"basic_governance": true, "campaigns": true, "events": true, "volunteers": true}'::jsonb;
  ELSE
    v_capabilities := '{"basic_governance": true}'::jsonb;
  END IF;

  -- Safe enum cast
  BEGIN
    v_reg_status := COALESCE(p_registration_status, 'unregistered')::public.registration_status;
  EXCEPTION WHEN OTHERS THEN
    v_reg_status := 'unregistered'::public.registration_status;
  END;

  INSERT INTO organisations (name, slug, org_type, capabilities, registration_status)
  VALUES (p_org_name, p_org_slug, p_org_type, v_capabilities, v_reg_status)
  RETURNING id INTO v_org_id;

  -- Seed system roles
  PERFORM seed_system_roles(v_org_id);

  INSERT INTO profiles (
    id,
    organisation_id,
    full_name,
    email,
    role,
    phone,
    phone_verified,
    is_primary_admin
  )
  VALUES (
    p_user_id,
    v_org_id,
    p_full_name,
    p_email,
    'admin',
    p_phone,
    TRUE,
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    organisation_id = EXCLUDED.organisation_id,
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    phone_verified = EXCLUDED.phone_verified,
    is_primary_admin = EXCLUDED.is_primary_admin;

  RETURN json_build_object(
    'success', true,
    'organisation_id', v_org_id,
    'profile_id', p_user_id
  );
END;
$$;
