-- Migration: RBAC System, Authority Contacts, Complaint Enhancements
-- Date: 2026-08-12

-- 1. Create authority_contacts table
CREATE TABLE IF NOT EXISTS authority_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    authority_name TEXT NOT NULL,
    designation TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    jurisdiction TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_authority_contacts_org ON authority_contacts(organisation_id);
CREATE INDEX IF NOT EXISTS idx_authority_contacts_dept ON authority_contacts(department);
CREATE INDEX IF NOT EXISTS idx_authority_contacts_active ON authority_contacts(is_active);

-- 2. Enhance tickets table for complaints
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS authority_id UUID REFERENCES authority_contacts(id);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS ai_analysis JSONB;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS printed_at TIMESTAMPTZ;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS delivery_method TEXT CHECK (delivery_method IN ('hand', 'post', 'email', 'portal'));

-- 3. Add constraint: Community plan ONLY for unregistered orgs
ALTER TABLE organisations DROP CONSTRAINT IF EXISTS plan_registration_check;
ALTER TABLE organisations ADD CONSTRAINT plan_registration_check 
CHECK (
    (plan_name = 'Community' AND registration_status = 'unregistered') OR
    (plan_name = 'Institution' AND registration_status IN ('registered', 'in_progress')) OR
    (plan_name IS NULL)
);

-- 4. Add is_primary_admin flag to profiles for identifying the org creator
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_primary_admin BOOLEAN DEFAULT false;

-- 5. RLS Policies for authority_contacts
ALTER TABLE authority_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view active authority contacts" ON authority_contacts;
CREATE POLICY "Members can view active authority contacts" ON authority_contacts
    FOR SELECT USING (
        organisation_id = public.get_auth_org_id()
        AND is_active = true
    );

DROP POLICY IF EXISTS "Admins can manage authority contacts" ON authority_contacts;
CREATE POLICY "Admins can manage authority contacts" ON authority_contacts
    FOR ALL USING (
        organisation_id IN (
            SELECT organisation_id FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'executive', 'can_manage', 'second_admin', 'owner', 'convenor', 'president', 'general_secretary')
        )
    ) WITH CHECK (
        organisation_id IN (
            SELECT organisation_id FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'executive', 'can_manage', 'second_admin', 'owner', 'convenor', 'president', 'general_secretary')
        )
    );

-- 6. Function to get system role permissions
CREATE OR REPLACE FUNCTION get_system_role_permissions(role_name TEXT)
RETURNS JSONB AS $$
DECLARE
    perms JSONB;
BEGIN
    CASE role_name
        WHEN 'can_edit' THEN
            perms := jsonb_build_object(
                'create_complaint', true,
                'edit_own_complaint', true,
                'edit_any_complaint', false,
                'delete_complaint', false,
                'comment_on_complaint', true,
                'vote_on_complaint', true,
                'assign_complaint', false,
                'manage_members', false,
                'manage_roles', false,
                'manage_org_settings', false,
                'change_plan', false,
                'delete_org', false,
                'remove_primary_admin', false,
                'view_analytics', true,
                'export_data', false,
                'print_complaints', true,
                'create_task', true,
                'edit_own_task', true,
                'edit_any_task', false,
                'delete_task', false,
                'create_meeting', true,
                'manage_subgroups', false,
                'manage_campaigns', false,
                'manage_financials', false
            );
        WHEN 'can_comment' THEN
            perms := jsonb_build_object(
                'create_complaint', false,
                'edit_own_complaint', false,
                'edit_any_complaint', false,
                'delete_complaint', false,
                'comment_on_complaint', true,
                'vote_on_complaint', true,
                'assign_complaint', false,
                'manage_members', false,
                'manage_roles', false,
                'manage_org_settings', false,
                'change_plan', false,
                'delete_org', false,
                'remove_primary_admin', false,
                'view_analytics', true,
                'export_data', false,
                'print_complaints', true,
                'create_task', false,
                'edit_own_task', false,
                'edit_any_task', false,
                'delete_task', false,
                'create_meeting', false,
                'manage_subgroups', false,
                'manage_campaigns', false,
                'manage_financials', false
            );
        WHEN 'can_manage' THEN
            perms := jsonb_build_object(
                'create_complaint', true,
                'edit_own_complaint', true,
                'edit_any_complaint', true,
                'delete_complaint', false,
                'comment_on_complaint', true,
                'vote_on_complaint', true,
                'assign_complaint', true,
                'manage_members', true,
                'manage_roles', false,
                'manage_org_settings', true,
                'change_plan', false,
                'delete_org', false,
                'remove_primary_admin', false,
                'view_analytics', true,
                'export_data', true,
                'print_complaints', true,
                'create_task', true,
                'edit_own_task', true,
                'edit_any_task', true,
                'delete_task', true,
                'create_meeting', true,
                'manage_subgroups', true,
                'manage_campaigns', true,
                'manage_financials', true
            );
        WHEN 'second_admin' THEN
            perms := jsonb_build_object(
                'create_complaint', true,
                'edit_own_complaint', true,
                'edit_any_complaint', true,
                'delete_complaint', true,
                'comment_on_complaint', true,
                'vote_on_complaint', true,
                'assign_complaint', true,
                'manage_members', true,
                'manage_roles', true,
                'manage_org_settings', true,
                'change_plan', false,
                'delete_org', false,
                'remove_primary_admin', false,
                'view_analytics', true,
                'export_data', true,
                'print_complaints', true,
                'create_task', true,
                'edit_own_task', true,
                'edit_any_task', true,
                'delete_task', true,
                'create_meeting', true,
                'manage_subgroups', true,
                'manage_campaigns', true,
                'manage_financials', true
            );
        ELSE
            perms := '{}'::jsonb;
    END CASE;
    RETURN perms;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. Function to seed system roles for an organisation
CREATE OR REPLACE FUNCTION seed_system_roles(p_org_id UUID)
RETURNS VOID AS $$
DECLARE
    v_role_names TEXT[] := ARRAY['can_edit', 'can_comment', 'can_manage', 'second_admin'];
    v_role_name TEXT;
    v_perms JSONB;
BEGIN
    FOREACH v_role_name IN ARRAY v_role_names
    LOOP
        v_perms := get_system_role_permissions(v_role_name);
        INSERT INTO org_roles (organisation_id, name, description, permissions, is_system)
        VALUES (
            p_org_id,
            v_role_name,
            CASE 
                WHEN v_role_name = 'can_edit' THEN 'Can create/edit content, file complaints, manage tasks'
                WHEN v_role_name = 'can_comment' THEN 'Can comment, vote, view (read-only + interact)'
                WHEN v_role_name = 'can_manage' THEN 'Can manage members, settings, view analytics (org admin)'
                WHEN v_role_name = 'second_admin' THEN 'Near-full admin but cannot: delete org, change plan, remove primary admin'
            END,
            v_perms,
            true
        )
        ON CONFLICT (organisation_id, name) DO UPDATE SET
            permissions = EXCLUDED.permissions,
            description = EXCLUDED.description,
            is_system = EXCLUDED.is_system;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. Update create_organisation_and_admin to seed system roles and set is_primary_admin
DROP FUNCTION IF EXISTS public.create_organisation_and_admin(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.create_organisation_and_admin(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION create_organisation_and_admin(
  p_org_name TEXT,
  p_org_slug TEXT,
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_org_type TEXT DEFAULT 'ngo',
  p_registration_status TEXT DEFAULT 'unregistered'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
  v_capabilities JSONB;
BEGIN
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

  INSERT INTO organisations (name, slug, org_type, capabilities, registration_status)
  VALUES (p_org_name, p_org_slug, p_org_type, v_capabilities, p_registration_status)
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