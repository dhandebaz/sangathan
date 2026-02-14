-- 1. Tasks Table
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status text CHECK (status IN ('open', 'in_progress', 'completed', 'archived')) DEFAULT 'open',
  visibility_level text CHECK (visibility_level IN ('members', 'volunteer', 'core', 'executive')) DEFAULT 'volunteer',
  due_date timestamptz,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Task Assignments Table
CREATE TABLE public.task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, -- Assuming member is a profile
  assigned_at timestamptz DEFAULT now(),
  accepted boolean DEFAULT false,
  completed_at timestamptz,
  
  CONSTRAINT unique_assignment UNIQUE (task_id, member_id)
);

-- 3. Task Logs (Hours) Table
CREATE TABLE public.task_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hours_logged numeric(5, 2) NOT NULL CHECK (hours_logged > 0),
  note text,
  created_at timestamptz DEFAULT now()
);

-- 4. Engagement Scores Table (Can be a view or a materialized table)
-- We'll add columns to profiles for performance
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS engagement_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reliability_score numeric(5, 2) DEFAULT 100.00;

-- 5. Indexes
CREATE INDEX idx_tasks_org ON public.tasks(organisation_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_assignments_task ON public.task_assignments(task_id);
CREATE INDEX idx_assignments_member ON public.task_assignments(member_id);
CREATE INDEX idx_logs_task ON public.task_logs(task_id);
CREATE INDEX idx_logs_member ON public.task_logs(member_id);

-- 6. RLS Policies

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_logs ENABLE ROW LEVEL SECURITY;

-- Tasks Policies

-- View Tasks (Based on Org and Role Visibility)
CREATE POLICY "Org members view eligible tasks"
  ON public.tasks FOR SELECT
  USING (
    organisation_id = public.get_auth_org_id() 
    AND (
      visibility_level = 'members' OR
      (visibility_level = 'volunteer' AND exists (select 1 from public.profiles where id = auth.uid() and role in ('volunteer', 'core', 'executive', 'admin', 'editor'))) OR
      (visibility_level = 'core' AND exists (select 1 from public.profiles where id = auth.uid() and role in ('core', 'executive', 'admin', 'editor'))) OR
      (visibility_level = 'executive' AND exists (select 1 from public.profiles where id = auth.uid() and role in ('executive', 'admin', 'editor'))) OR
      exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')) -- Admins see all
    )
  );

-- Manage Tasks (Admin/Editor)
CREATE POLICY "Manage tasks (Admin/Editor)"
  ON public.tasks FOR ALL
  USING (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  ));

-- Assignments Policies

-- View Assignments
CREATE POLICY "View assignments in org"
  ON public.task_assignments FOR SELECT
  USING (exists (
    select 1 from public.tasks t
    where t.id = task_assignments.task_id
    and t.organisation_id = public.get_auth_org_id()
  ));

-- Users manage their own assignments (Accept/Complete)
CREATE POLICY "Users update own assignments"
  ON public.task_assignments FOR UPDATE
  USING (member_id = auth.uid());

-- Admins manage all assignments
CREATE POLICY "Admins manage assignments"
  ON public.task_assignments FOR ALL
  USING (exists (
    select 1 from public.tasks t
    where t.id = task_assignments.task_id
    and t.organisation_id = public.get_auth_org_id()
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  ));

-- Logs Policies

-- View Logs
CREATE POLICY "View logs in org"
  ON public.task_logs FOR SELECT
  USING (exists (
    select 1 from public.tasks t
    where t.id = task_logs.task_id
    and t.organisation_id = public.get_auth_org_id()
  ));

-- Users create logs for their tasks
CREATE POLICY "Users log hours"
  ON public.task_logs FOR INSERT
  WITH CHECK (member_id = auth.uid());

-- Admins manage logs
CREATE POLICY "Admins manage logs"
  ON public.task_logs FOR ALL
  USING (exists (
    select 1 from public.tasks t
    where t.id = task_logs.task_id
    and t.organisation_id = public.get_auth_org_id()
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  ));
