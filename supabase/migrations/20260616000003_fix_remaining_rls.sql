-- Fix remaining RLS policies that were still using the deprecated 'members' table
-- Switch them to use 'profiles' instead

-- 1. Events
DROP POLICY IF EXISTS "org members can view events" ON public.events;
DROP POLICY IF EXISTS "org members view events" ON public.events;
DROP POLICY IF EXISTS "admins and editors manage events" ON public.events;

CREATE POLICY "org members view events" ON public.events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = events.organisation_id AND p.status = 'active')
  OR is_platform_admin()
);

CREATE POLICY "admins and editors manage events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = events.organisation_id AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active')
  OR is_platform_admin()
);

-- 2. Tasks
DROP POLICY IF EXISTS "org members view tasks" ON public.tasks;
DROP POLICY IF EXISTS "admins and editors manage tasks" ON public.tasks;

CREATE POLICY "org members view tasks" ON public.tasks FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = tasks.organisation_id AND p.status = 'active')
  OR is_platform_admin()
);

CREATE POLICY "admins and editors manage tasks" ON public.tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = tasks.organisation_id AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active')
  OR is_platform_admin()
);

-- 3. Task Assignments
DROP POLICY IF EXISTS "org members view assignments" ON public.task_assignments;

CREATE POLICY "org members view assignments" ON public.task_assignments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM tasks t 
    JOIN profiles p ON p.organisation_id = t.organisation_id 
    WHERE t.id = task_assignments.task_id AND p.id = auth.uid() AND p.status = 'active'
  )
  OR is_platform_admin()
);

-- 4. Polls
DROP POLICY IF EXISTS "org members view polls" ON public.polls;
DROP POLICY IF EXISTS "admins and editors manage polls" ON public.polls;

CREATE POLICY "org members view polls" ON public.polls FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = polls.organisation_id AND p.status = 'active')
  OR is_platform_admin()
);

CREATE POLICY "admins and editors manage polls" ON public.polls FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = polls.organisation_id AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active')
  OR is_platform_admin()
);

-- 5. Poll Votes
DROP POLICY IF EXISTS "members vote in own org" ON public.poll_votes;
DROP POLICY IF EXISTS "org members view votes" ON public.poll_votes;

CREATE POLICY "org members view votes" ON public.poll_votes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM polls p
    JOIN profiles pr ON pr.organisation_id = p.organisation_id
    WHERE p.id = poll_votes.poll_id AND pr.id = auth.uid() AND pr.status = 'active'
  )
  OR is_platform_admin()
);

CREATE POLICY "members vote in own org" ON public.poll_votes FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM polls p
    JOIN profiles pr ON pr.organisation_id = p.organisation_id
    WHERE p.id = poll_votes.poll_id AND pr.id = auth.uid() AND pr.status = 'active'
  )
);

-- 6. Announcements
DROP POLICY IF EXISTS "org members view announcements" ON public.announcements;
DROP POLICY IF EXISTS "admins and editors manage announcements" ON public.announcements;

CREATE POLICY "org members view announcements" ON public.announcements FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = announcements.organisation_id AND p.status = 'active')
  OR is_platform_admin()
);

CREATE POLICY "admins and editors manage announcements" ON public.announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = announcements.organisation_id AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active')
  OR is_platform_admin()
);

-- 7. Audit Logs
DROP POLICY IF EXISTS "admins view audit logs" ON public.audit_logs;

CREATE POLICY "admins view audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = audit_logs.organisation_id AND p.role IN ('admin', 'executive') AND p.status = 'active')
  OR is_platform_admin()
);

-- 8. Networks
DROP POLICY IF EXISTS "network visible to members of participating orgs" ON public.networks;

CREATE POLICY "network visible to members of participating orgs" ON public.networks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM network_memberships nm
    JOIN profiles p ON p.organisation_id = nm.organisation_id
    WHERE nm.network_id = networks.id AND p.id = auth.uid() AND p.status = 'active'
  )
  OR is_platform_admin()
);

-- 9. Network Memberships
DROP POLICY IF EXISTS "network memberships visible to org members" ON public.network_memberships;

CREATE POLICY "network memberships visible to org members" ON public.network_memberships FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organisation_id = network_memberships.organisation_id AND p.status = 'active')
  OR is_platform_admin()
);
