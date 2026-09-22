-- 20260922000000_remove_discontinued_org_types.sql
-- Retires student_union, workers_union and rwa.
-- From here on only civic_collective and ngo (plus legacy 'other') are valid.
-- Existing rows of retired types are preserved but remapped to 'other' so no
-- data is lost; the app treats 'other' with the default (ngo-style) workspace.
-- Feature tables of retired modules are intentionally NOT dropped (audit history).

-- ============================================================================
-- 1. Remap existing rows BEFORE tightening the CHECK constraint
-- ============================================================================
UPDATE public.organisations
SET org_type = 'other'
WHERE org_type IN ('student_union', 'workers_union', 'rwa');

-- ============================================================================
-- 2. Tighten organisations.org_type check constraint
-- ============================================================================
ALTER TABLE public.organisations
  DROP CONSTRAINT IF EXISTS organisations_org_type_check;

ALTER TABLE public.organisations
  ADD CONSTRAINT organisations_org_type_check
  CHECK (org_type IN ('civic_collective', 'ngo', 'other'));

-- ============================================================================
-- 3. Update create_organisation_and_admin (latest signature wins)
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
  IF p_org_type = 'ngo' THEN
    v_capabilities := '{"basic_governance": true, "donations": true, "volunteers": true, "events": true}'::jsonb;
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

-- ============================================================================
-- 4. Update seed_compliance_items (drop retired-type seeds)
-- ============================================================================
CREATE OR REPLACE FUNCTION seed_compliance_items(p_org_id UUID, p_org_type TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM compliance_items WHERE organisation_id = p_org_id LIMIT 1) THEN
    RETURN;
  END IF;

  IF p_org_type = 'ngo' THEN
    INSERT INTO compliance_items (organisation_id, category, title, description, status) VALUES
      (p_org_id, 'Tax Exemption', '12A Registration', 'Tax exemption status under Section 12A of the Income Tax Act.', 'not_started'),
      (p_org_id, 'Tax Exemption', '80G Certification', 'Tax deduction certification for donors under Section 80G. Apply only if your org holds its own 80G registration.', 'not_started'),
      (p_org_id, 'Foreign Funding', 'FCRA Registration', 'Clearance to receive foreign contributions under FCRA.', 'not_started'),
      (p_org_id, 'Audit', 'Annual Financial Audit', 'Submission of audited financial statements for the previous fiscal year.', 'not_started');
  ELSIF p_org_type = 'civic_collective' THEN
    INSERT INTO compliance_items (organisation_id, category, title, description, status) VALUES
      (p_org_id, 'Records', 'Complaint Diary Upkeep', 'Keep stamped receiving copies with dates in the complaint diary.', 'not_started'),
      (p_org_id, 'Records', 'Meeting Minutes File', 'Keep dated minutes of every general meeting.', 'not_started');
  END IF;
END;
$$;
