-- 1. Add missing columns to public.members
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS designation TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS joining_date TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Drop old policies on public.tickets and public.campaigns
DROP POLICY IF EXISTS "Org members can view their tickets" ON public.tickets;
DROP POLICY IF EXISTS "Org members can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Org admins can update tickets" ON public.tickets;

DROP POLICY IF EXISTS "Org members can view campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Org admins can manage campaigns" ON public.campaigns;

-- 3. Recreate policies checking public.profiles for tickets
CREATE POLICY "Org members can view their tickets" ON public.tickets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = tickets.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.status = 'active'
    )
  );

CREATE POLICY "Org members can create tickets" ON public.tickets
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = tickets.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.status = 'active'
    )
  );

CREATE POLICY "Org admins can update tickets" ON public.tickets
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = tickets.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'executive', 'editor')
    )
  );

-- 4. Recreate policies checking public.profiles for campaigns
CREATE POLICY "Org members can view campaigns" ON public.campaigns
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = campaigns.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.status = 'active'
    )
  );

CREATE POLICY "Org admins can manage campaigns" ON public.campaigns
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = campaigns.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'executive', 'editor')
    )
  );
