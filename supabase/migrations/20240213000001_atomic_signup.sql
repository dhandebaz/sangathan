-- Create a function to handle the atomic creation of an organisation and admin profile
CREATE OR REPLACE FUNCTION create_organisation_and_admin(
  p_org_name TEXT,
  p_org_slug TEXT,
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_firebase_uid TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with the privileges of the creator (postgres/service role)
AS $$
DECLARE
  v_org_id UUID;
  v_profile_id UUID;
BEGIN
  -- 1. Create Organisation
  INSERT INTO organisations (name, slug)
  VALUES (p_org_name, p_org_slug)
  RETURNING id INTO v_org_id;

  -- 2. Create Profile
  INSERT INTO profiles (
    id,
    organisation_id,
    full_name,
    email,
    role,
    phone,
    phone_verified,
    firebase_uid
  )
  VALUES (
    p_user_id,
    v_org_id,
    p_full_name,
    p_email,
    'admin',
    p_phone,
    TRUE,
    p_firebase_uid
  )
  RETURNING id INTO v_profile_id;

  -- Return success object
  RETURN json_build_object(
    'success', true,
    'organisation_id', v_org_id,
    'profile_id', v_profile_id
  );

EXCEPTION WHEN OTHERS THEN
  -- The transaction will automatically roll back on error
  RAISE;
END;
$$;
