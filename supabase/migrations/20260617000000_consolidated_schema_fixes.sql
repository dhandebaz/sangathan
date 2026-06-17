CREATE OR REPLACE FUNCTION public.get_auth_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT organisation_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;
-- 1. CLEANUP OBSOLETE TABLES
DROP TABLE IF EXISTS public.meeting_attendance CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;

-- 2. ORGANISATIONS SCHEMA
ALTER TABLE public.organisations 
ADD COLUMN IF NOT EXISTS org_type TEXT NOT NULL DEFAULT 'ngo'
CHECK (org_type IN ('student_union', 'ngo', 'workers_union', 'rwa', 'other')),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS address TEXT;

-- 3. PROFILES SCHEMA (migrated from members)
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS firebase_uid,
ADD COLUMN IF NOT EXISTS designation TEXT,
ADD COLUMN IF NOT EXISTS area TEXT,
ADD COLUMN IF NOT EXISTS joining_date TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 4. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_platform_admin FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION get_my_organisation_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organisation_id FROM profiles WHERE id = auth.uid();
$$;

-- 5. ATOMIC ORG CREATION FUNCTION
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

  INSERT INTO organisations (name, slug, org_type, capabilities)
  VALUES (p_org_name, p_org_slug, p_org_type, v_capabilities)
  RETURNING id INTO v_org_id;

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

  RETURN json_build_object(
    'success', true,
    'organisation_id', v_org_id,
    'profile_id', p_user_id
  );
END;
$$;

-- 6. CREATE NEW TABLES
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('grievance', 'complaint', 'maintenance')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  goal_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'private')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.appeals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    type text NOT NULL,
    reason text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    metadata jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organisation_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_org_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    responder_org_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending',
    created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (requester_org_id, responder_org_id)
);

CREATE TABLE IF NOT EXISTS public.joint_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE (event_id, organisation_id)
);

CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_name text,
    guest_email text,
    status text NOT NULL CHECK (status IN ('registered', 'attended', 'cancelled')) DEFAULT 'registered',
    checked_in_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 7. UPDATE EXISTING TABLES
ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
ADD COLUMN IF NOT EXISTS expires_at timestamptz,
ADD COLUMN IF NOT EXISTS email_sent_at timestamptz,
ADD COLUMN IF NOT EXISTS email_stats jsonb;

ALTER TABLE public.polls
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS visibility_level text,
ADD COLUMN IF NOT EXISTS quorum_percentage numeric,
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS final_results jsonb;

-- 8. FIX FOREIGN KEYS (redirect to profiles)
ALTER TABLE public.announcements DROP CONSTRAINT IF EXISTS announcements_created_by_fkey;
ALTER TABLE public.announcements ADD CONSTRAINT announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_actor_member_id_fkey;
ALTER TABLE public.audit_logs ADD CONSTRAINT audit_logs_actor_member_id_fkey FOREIGN KEY (actor_member_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_created_by_fkey;
ALTER TABLE public.events ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.join_requests DROP CONSTRAINT IF EXISTS join_requests_reviewed_by_fkey;
ALTER TABLE public.join_requests ADD CONSTRAINT join_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.notification_queue DROP CONSTRAINT IF EXISTS notification_queue_member_id_fkey;
ALTER TABLE public.notification_queue ADD CONSTRAINT notification_queue_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.org_invites DROP CONSTRAINT IF EXISTS org_invites_invited_by_fkey;
ALTER TABLE public.org_invites ADD CONSTRAINT org_invites_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.polls DROP CONSTRAINT IF EXISTS polls_created_by_fkey;
ALTER TABLE public.polls ADD CONSTRAINT polls_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.task_assignments DROP CONSTRAINT IF EXISTS task_assignments_member_id_fkey;
ALTER TABLE public.task_assignments ADD CONSTRAINT task_assignments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_created_by_fkey;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'poll_votes' AND column_name = 'member_id') THEN
    ALTER TABLE public.poll_votes RENAME COLUMN member_id TO user_id;
  END IF;
END $$;
ALTER TABLE public.poll_votes DROP CONSTRAINT IF EXISTS poll_votes_member_id_fkey;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'poll_votes_user_id_fkey') THEN
    ALTER TABLE public.poll_votes ADD CONSTRAINT poll_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
ALTER TABLE public.poll_votes ADD COLUMN IF NOT EXISTS ip_hash text;

-- 9. INDEXES
CREATE INDEX IF NOT EXISTS idx_tickets_org_type ON public.tickets(organisation_id, type);
CREATE INDEX IF NOT EXISTS idx_tickets_org_type_status ON public.tickets (organisation_id, type, status);
CREATE INDEX IF NOT EXISTS idx_tickets_title_desc_gin ON public.tickets USING GIN (to_tsvector('english', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_campaigns_org ON public.campaigns(organisation_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_org_status ON public.campaigns (organisation_id, status);
CREATE INDEX IF NOT EXISTS idx_forms_org ON public.forms(organisation_id);
CREATE INDEX IF NOT EXISTS idx_submissions_form_date ON public.form_submissions(form_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_org ON public.form_submissions(organisation_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_updated_at ON public.rate_limits (updated_at);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_event ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user ON public.event_rsvps(user_id);

-- 10. STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES ('organisation_assets', 'organisation_assets', true) ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Org admins can upload assets" ON storage.objects;
DROP POLICY IF EXISTS "Org admins can update assets" ON storage.objects;
DROP POLICY IF EXISTS "Org admins can delete assets" ON storage.objects;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'organisation_assets' );
DROP POLICY IF EXISTS "Org admins can upload assets" ON storage.objects;
CREATE POLICY "Org admins can upload assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'organisation_assets' AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active' AND p.organisation_id::text = (string_to_array(name, '/'))[1])
);
DROP POLICY IF EXISTS "Org admins can update assets" ON storage.objects;
CREATE POLICY "Org admins can update assets" ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'organisation_assets' AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active' AND p.organisation_id::text = (string_to_array(name, '/'))[1])
);
DROP POLICY IF EXISTS "Org admins can delete assets" ON storage.objects;
CREATE POLICY "Org admins can delete assets" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'organisation_assets' AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active' AND p.organisation_id::text = (string_to_array(name, '/'))[1])
);

-- 11. ENABLE RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.joint_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- 12. RLS POLICIES (Consolidated using Profiles)

-- Profiles
DROP POLICY IF EXISTS "Platform admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organisation" ON public.profiles;

DROP POLICY IF EXISTS "Platform admins can view all profiles" ON public.profiles;
CREATE POLICY "Platform admins can view all profiles" ON public.profiles FOR SELECT USING (is_platform_admin());
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
DROP POLICY IF EXISTS "Users can view profiles in their organisation" ON public.profiles;
CREATE POLICY "Users can view profiles in their organisation" ON public.profiles FOR SELECT USING (organisation_id = get_my_organisation_id());

-- Organisations
DROP POLICY IF EXISTS "org members can view organisation" ON public.organisations;
DROP POLICY IF EXISTS "org admins manage organisation" ON public.organisations;
DROP POLICY IF EXISTS "Platform admins can view all organisations" ON public.organisations;
DROP POLICY IF EXISTS "Platform admins can view organisations" ON public.organisations;
DROP POLICY IF EXISTS "Platform admins manage organisations" ON public.organisations;

DROP POLICY IF EXISTS "org members can view organisation" ON public.organisations;
CREATE POLICY "org members can view organisation" ON public.organisations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.organisation_id = organisations.id) OR is_platform_admin()
);
DROP POLICY IF EXISTS "org admins manage organisation" ON public.organisations;
CREATE POLICY "org admins manage organisation" ON public.organisations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.organisation_id = organisations.id AND p.role IN ('admin', 'executive', 'editor')) OR is_platform_admin()
);

-- Tickets
DROP POLICY IF EXISTS "Org members can view their tickets" ON public.tickets;
CREATE POLICY "Org members can view their tickets" ON public.tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = tickets.organisation_id AND profiles.id = auth.uid() AND profiles.status = 'active')
);
DROP POLICY IF EXISTS "Org members can create tickets" ON public.tickets;
CREATE POLICY "Org members can create tickets" ON public.tickets FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = tickets.organisation_id AND profiles.id = auth.uid() AND profiles.status = 'active')
);
DROP POLICY IF EXISTS "Org admins can update tickets" ON public.tickets;
CREATE POLICY "Org admins can update tickets" ON public.tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = tickets.organisation_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive', 'editor'))
);
DROP POLICY IF EXISTS "Org admins can delete tickets" ON public.tickets;
CREATE POLICY "Org admins can delete tickets" ON public.tickets FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = tickets.organisation_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive', 'editor'))
);

-- Campaigns
DROP POLICY IF EXISTS "Org members can view campaigns" ON public.campaigns;
CREATE POLICY "Org members can view campaigns" ON public.campaigns FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = campaigns.organisation_id AND profiles.id = auth.uid() AND profiles.status = 'active')
);
DROP POLICY IF EXISTS "Org admins can manage campaigns" ON public.campaigns;
CREATE POLICY "Org admins can manage campaigns" ON public.campaigns FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = campaigns.organisation_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive', 'editor'))
);

-- Forms
DROP POLICY IF EXISTS "allow_public_select" ON public.forms;
CREATE POLICY "allow_public_select" ON public.forms FOR SELECT USING (visibility = 'public' AND is_active = true AND deleted_at IS NULL);
DROP POLICY IF EXISTS "allow_members_select" ON public.forms;
CREATE POLICY "allow_members_select" ON public.forms FOR SELECT USING (
  visibility = 'members' AND is_active = true AND deleted_at IS NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = forms.organisation_id AND profiles.id = auth.uid() AND profiles.status = 'active')
);
DROP POLICY IF EXISTS "allow_staff_select" ON public.forms;
CREATE POLICY "allow_staff_select" ON public.forms FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = forms.organisation_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive', 'editor') AND profiles.status = 'active')
);
DROP POLICY IF EXISTS "allow_staff_all" ON public.forms;
CREATE POLICY "allow_staff_all" ON public.forms FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = forms.organisation_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive', 'editor') AND profiles.status = 'active')
);

-- Form Submissions
DROP POLICY IF EXISTS "allow_public_insert_submissions" ON public.form_submissions;
CREATE POLICY "allow_public_insert_submissions" ON public.form_submissions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = form_submissions.form_id AND forms.visibility = 'public' AND forms.is_active = true AND forms.deleted_at IS NULL)
);
DROP POLICY IF EXISTS "allow_members_insert_submissions" ON public.form_submissions;
CREATE POLICY "allow_members_insert_submissions" ON public.form_submissions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = form_submissions.form_id AND forms.visibility = 'members' AND forms.is_active = true AND forms.deleted_at IS NULL)
  AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = form_submissions.organisation_id AND profiles.id = auth.uid() AND profiles.status = 'active' AND EXISTS (SELECT 1 FROM public.forms WHERE forms.id = form_submissions.form_id AND forms.organisation_id = profiles.organisation_id))
);
DROP POLICY IF EXISTS "allow_staff_insert_submissions" ON public.form_submissions;
CREATE POLICY "allow_staff_insert_submissions" ON public.form_submissions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = form_submissions.form_id AND forms.visibility = 'private' AND forms.is_active = true AND forms.deleted_at IS NULL)
  AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = form_submissions.organisation_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive', 'editor') AND profiles.status = 'active' AND EXISTS (SELECT 1 FROM public.forms WHERE forms.id = form_submissions.form_id AND forms.organisation_id = profiles.organisation_id))
);
DROP POLICY IF EXISTS "allow_staff_select_submissions" ON public.form_submissions;
CREATE POLICY "allow_staff_select_submissions" ON public.form_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = form_submissions.organisation_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive', 'editor') AND profiles.status = 'active')
);
DROP POLICY IF EXISTS "allow_users_select_own_submissions" ON public.form_submissions;
CREATE POLICY "allow_users_select_own_submissions" ON public.form_submissions FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "allow_staff_delete_submissions" ON public.form_submissions;
CREATE POLICY "allow_staff_delete_submissions" ON public.form_submissions FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = form_submissions.organisation_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive', 'editor') AND profiles.status = 'active')
);

-- Events
DROP POLICY IF EXISTS "org members can view events" ON public.events;
DROP POLICY IF EXISTS "org members view events" ON public.events;
DROP POLICY IF EXISTS "admins and editors manage events" ON public.events;

DROP POLICY IF EXISTS "org members view events" ON public.events;
CREATE POLICY "org members view events" ON public.events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = events.organisation_id AND p.status = 'active') OR is_platform_admin()
);
DROP POLICY IF EXISTS "admins and editors manage events" ON public.events;
CREATE POLICY "admins and editors manage events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = events.organisation_id AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active') OR is_platform_admin()
);

-- Tasks
DROP POLICY IF EXISTS "org members view tasks" ON public.tasks;
DROP POLICY IF EXISTS "admins and editors manage tasks" ON public.tasks;

DROP POLICY IF EXISTS "org members view tasks" ON public.tasks;
CREATE POLICY "org members view tasks" ON public.tasks FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = tasks.organisation_id AND p.status = 'active') OR is_platform_admin()
);
DROP POLICY IF EXISTS "admins and editors manage tasks" ON public.tasks;
CREATE POLICY "admins and editors manage tasks" ON public.tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = tasks.organisation_id AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active') OR is_platform_admin()
);

-- Task Assignments
DROP POLICY IF EXISTS "org members view assignments" ON public.task_assignments;
DROP POLICY IF EXISTS "org members view assignments" ON public.task_assignments;
CREATE POLICY "org members view assignments" ON public.task_assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM tasks t JOIN profiles p ON p.organisation_id = t.organisation_id WHERE t.id = task_assignments.task_id AND p.id = auth.uid() AND p.status = 'active') OR is_platform_admin()
);

-- Polls
DROP POLICY IF EXISTS "org members view polls" ON public.polls;
DROP POLICY IF EXISTS "admins and editors manage polls" ON public.polls;

DROP POLICY IF EXISTS "org members view polls" ON public.polls;
CREATE POLICY "org members view polls" ON public.polls FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = polls.organisation_id AND p.status = 'active') OR is_platform_admin()
);
DROP POLICY IF EXISTS "admins and editors manage polls" ON public.polls;
CREATE POLICY "admins and editors manage polls" ON public.polls FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = polls.organisation_id AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active') OR is_platform_admin()
);

-- Poll Votes
DROP POLICY IF EXISTS "members vote in own org" ON public.poll_votes;
DROP POLICY IF EXISTS "org members view votes" ON public.poll_votes;

DROP POLICY IF EXISTS "org members view votes" ON public.poll_votes;
CREATE POLICY "org members view votes" ON public.poll_votes FOR SELECT USING (
  EXISTS (SELECT 1 FROM polls p JOIN profiles pr ON pr.organisation_id = p.organisation_id WHERE p.id = poll_votes.poll_id AND pr.id = auth.uid() AND pr.status = 'active') OR is_platform_admin()
);
DROP POLICY IF EXISTS "members vote in own org" ON public.poll_votes;
CREATE POLICY "members vote in own org" ON public.poll_votes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM polls p JOIN profiles pr ON pr.organisation_id = p.organisation_id WHERE p.id = poll_votes.poll_id AND pr.id = auth.uid() AND pr.status = 'active')
);

-- Announcements
DROP POLICY IF EXISTS "org members view announcements" ON public.announcements;
DROP POLICY IF EXISTS "admins and editors manage announcements" ON public.announcements;

DROP POLICY IF EXISTS "org members view announcements" ON public.announcements;
CREATE POLICY "org members view announcements" ON public.announcements FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = announcements.organisation_id AND p.status = 'active') OR is_platform_admin()
);
DROP POLICY IF EXISTS "admins and editors manage announcements" ON public.announcements;
CREATE POLICY "admins and editors manage announcements" ON public.announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = announcements.organisation_id AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active') OR is_platform_admin()
);

-- Audit Logs
DROP POLICY IF EXISTS "admins view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "admins view audit logs" ON public.audit_logs;
CREATE POLICY "admins view audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = audit_logs.organisation_id AND p.role IN ('admin', 'executive') AND p.status = 'active') OR is_platform_admin()
);

-- Networks & Memberships
DROP POLICY IF EXISTS "network visible to members of participating orgs" ON public.networks;
DROP POLICY IF EXISTS "network visible to members of participating orgs" ON public.networks;
CREATE POLICY "network visible to members of participating orgs" ON public.networks FOR SELECT USING (
  EXISTS (SELECT 1 FROM network_memberships nm JOIN profiles p ON p.organisation_id = nm.organisation_id WHERE nm.network_id = networks.id AND p.id = auth.uid() AND p.status = 'active') OR is_platform_admin()
);

DROP POLICY IF EXISTS "network memberships visible to org members" ON public.network_memberships;
DROP POLICY IF EXISTS "network memberships visible to org members" ON public.network_memberships;
CREATE POLICY "network memberships visible to org members" ON public.network_memberships FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = network_memberships.organisation_id AND p.status = 'active') OR is_platform_admin()
);

-- Event RSVPs
DROP POLICY IF EXISTS "Public can rsvp" ON public.event_rsvps;
CREATE POLICY "Public can rsvp" ON public.event_rsvps FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users view own rsvps" ON public.event_rsvps;
CREATE POLICY "Users view own rsvps" ON public.event_rsvps FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Org members view rsvps" ON public.event_rsvps;
CREATE POLICY "Org members view rsvps" ON public.event_rsvps FOR SELECT USING (
  EXISTS (select 1 from public.events e join public.profiles pr on pr.organisation_id = e.organisation_id where e.id = event_rsvps.event_id and pr.id = auth.uid() and pr.status = 'active')
);
DROP POLICY IF EXISTS "Manage rsvps (Admin/Editor)" ON public.event_rsvps;
CREATE POLICY "Manage rsvps (Admin/Editor)" ON public.event_rsvps FOR ALL USING (
  EXISTS (select 1 from public.events e join public.profiles pr on pr.organisation_id = e.organisation_id where e.id = event_rsvps.event_id and pr.id = auth.uid() and pr.role in ('admin', 'editor', 'executive'))
);

-- Appeals
DROP POLICY IF EXISTS "Appeals are viewable by admins" ON public.appeals;
CREATE POLICY "Appeals are viewable by admins" ON public.appeals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = appeals.organisation_id AND profiles.id = auth.uid() AND profiles.role = 'admin')
);
DROP POLICY IF EXISTS "Appeals can be inserted by anyone" ON public.appeals;
CREATE POLICY "Appeals can be inserted by anyone" ON public.appeals FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Appeals can be updated by admins" ON public.appeals;
CREATE POLICY "Appeals can be updated by admins" ON public.appeals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = appeals.organisation_id AND profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Organisation Links
DROP POLICY IF EXISTS "Organisation links viewable by involved orgs" ON public.organisation_links;
CREATE POLICY "Organisation links viewable by involved orgs" ON public.organisation_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE (profiles.organisation_id = organisation_links.requester_org_id OR profiles.organisation_id = organisation_links.responder_org_id) AND profiles.id = auth.uid())
);
DROP POLICY IF EXISTS "Organisation links can be created by admins" ON public.organisation_links;
CREATE POLICY "Organisation links can be created by admins" ON public.organisation_links FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = organisation_links.requester_org_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive'))
);
DROP POLICY IF EXISTS "Organisation links can be updated by involved admins" ON public.organisation_links;
CREATE POLICY "Organisation links can be updated by involved admins" ON public.organisation_links FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE (profiles.organisation_id = organisation_links.requester_org_id OR profiles.organisation_id = organisation_links.responder_org_id) AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive'))
);

-- Joint Events
DROP POLICY IF EXISTS "Joint events are viewable by public" ON public.joint_events;
CREATE POLICY "Joint events are viewable by public" ON public.joint_events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Joint events can be created by admins" ON public.joint_events;
CREATE POLICY "Joint events can be created by admins" ON public.joint_events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.events JOIN public.profiles ON profiles.organisation_id = events.organisation_id WHERE events.id = joint_events.event_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'editor'))
);
DROP POLICY IF EXISTS "Joint events can be deleted by admins" ON public.joint_events;
CREATE POLICY "Joint events can be deleted by admins" ON public.joint_events FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.events JOIN public.profiles ON profiles.organisation_id = events.organisation_id WHERE events.id = joint_events.event_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'editor'))
);
