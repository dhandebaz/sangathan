-- 1. Platform Actions Table (Audit for System Admins)
CREATE TABLE public.platform_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL CHECK (action_type IN ('warning', 'restriction', 'suspension', 'legal_hold', 'termination', 'resolve_appeal')),
  target_org_id uuid REFERENCES public.organisations(id) ON DELETE SET NULL,
  severity text CHECK (severity IN ('level_1', 'level_2', 'level_3', 'level_4', 'level_5')),
  reason text NOT NULL,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- System Admin ID
  created_at timestamptz DEFAULT now()
);

-- 2. Appeals Table
CREATE TABLE public.appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  reason text NOT NULL,
  supporting_docs_url text,
  status text CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected')) DEFAULT 'pending',
  resolution_note text,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Indexes
CREATE INDEX idx_platform_actions_org ON public.platform_actions(target_org_id);
CREATE INDEX idx_appeals_org ON public.appeals(organisation_id);
CREATE INDEX idx_appeals_status ON public.appeals(status);

-- 4. RLS Policies

ALTER TABLE public.platform_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;

-- Platform Actions
-- Public can view count/stats via secure aggregation function, but rows are restricted
CREATE POLICY "System admins view actions"
  ON public.platform_actions FOR SELECT
  USING (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and organisation_id = '00000000-0000-0000-0000-000000000000')
  );

-- Org admins can view actions against their own org
CREATE POLICY "Org admins view own actions"
  ON public.platform_actions FOR SELECT
  USING (target_org_id = public.get_auth_org_id());

-- Appeals
-- Org admins can create appeals
CREATE POLICY "Org admins create appeals"
  ON public.appeals FOR INSERT
  WITH CHECK (organisation_id = public.get_auth_org_id());

-- Org admins can view own appeals
CREATE POLICY "Org admins view own appeals"
  ON public.appeals FOR SELECT
  USING (organisation_id = public.get_auth_org_id());

-- System admins can manage all
CREATE POLICY "System admins manage appeals"
  ON public.appeals FOR ALL
  USING (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and organisation_id = '00000000-0000-0000-0000-000000000000')
  );
