-- Remove legacy Firebase fields from the schema completely
ALTER TABLE public.profiles DROP COLUMN IF EXISTS firebase_uid;

DROP FUNCTION IF EXISTS public.create_organisation_and_admin(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION create_organisation_and_admin(
  p_org_name TEXT,
  p_org_slug TEXT,
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_org_type TEXT DEFAULT 'ngo'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id UUID;
  v_profile_id UUID;
  v_capabilities JSONB;
BEGIN
  -- Validate org_type and set strict capabilities based on the type
  IF p_org_type = 'student_union' THEN
    v_capabilities := '{"basic_governance": true, "campaigns": true, "student_ids": true, "events": true}'::jsonb;
  ELSIF p_org_type = 'ngo' THEN
    v_capabilities := '{"basic_governance": true, "donations": true, "volunteers": true, "events": true}'::jsonb;
  ELSIF p_org_type = 'workers_union' THEN
    v_capabilities := '{"basic_governance": true, "grievances": true, "memberships": true}'::jsonb;
  ELSIF p_org_type = 'rwa' THEN
    v_capabilities := '{"basic_governance": true, "complaints": true, "maintenance": true}'::jsonb;
  ELSE
    v_capabilities := '{"basic_governance": true}'::jsonb;
  END IF;

  -- 1. Create Organisation
  INSERT INTO organisations (name, slug, org_type, capabilities)
  VALUES (p_org_name, p_org_slug, p_org_type, v_capabilities)
  RETURNING id INTO v_org_id;

  -- 2. Create or Update Profile
  INSERT INTO profiles (
    id,
    organisation_id,
    full_name,
    email,
    role,
    phone,
    phone_verified
  )
  VALUES (
    p_user_id,
    v_org_id,
    p_full_name,
    p_email,
    'admin',
    p_phone,
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    organisation_id = EXCLUDED.organisation_id,
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    phone_verified = EXCLUDED.phone_verified;

  -- Return success object
  RETURN json_build_object(
    'success', true,
    'organisation_id', v_org_id,
    'profile_id', p_user_id
  );

EXCEPTION WHEN OTHERS THEN
  -- The transaction will automatically roll back on error
  RAISE;
END;
$$;
