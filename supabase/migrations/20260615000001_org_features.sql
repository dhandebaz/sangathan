-- 1. Create Tickets Table (for Grievances, Complaints, Maintenance)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('grievance', 'complaint', 'maintenance')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries by organisation and type
CREATE INDEX IF NOT EXISTS idx_tickets_org_type ON public.tickets(organisation_id, type);

-- RLS for Tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view their tickets" ON public.tickets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.organisation_id = tickets.organisation_id
      AND members.user_id = auth.uid()
      AND members.status = 'active'
    )
  );

CREATE POLICY "Org members can create tickets" ON public.tickets
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.organisation_id = tickets.organisation_id
      AND members.user_id = auth.uid()
      AND members.status = 'active'
    )
  );

CREATE POLICY "Org admins can update tickets" ON public.tickets
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.organisation_id = tickets.organisation_id
      AND members.user_id = auth.uid()
      AND members.role IN ('admin', 'executive')
    )
  );

-- 2. Create Campaigns Table (for Student Unions)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  goal_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_campaigns_org ON public.campaigns(organisation_id);

-- RLS for Campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view campaigns" ON public.campaigns
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.organisation_id = campaigns.organisation_id
      AND members.user_id = auth.uid()
      AND members.status = 'active'
    )
  );

CREATE POLICY "Org admins can manage campaigns" ON public.campaigns
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.organisation_id = campaigns.organisation_id
      AND members.user_id = auth.uid()
      AND members.role IN ('admin', 'executive')
    )
  );
