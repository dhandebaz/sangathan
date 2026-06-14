-- Add DELETE policies for tickets and campaigns

-- Tickets: Admins and editors can delete
CREATE POLICY "Org admins can delete tickets" ON public.tickets
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = tickets.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'executive', 'editor')
    )
  );

-- Campaigns: Admins and editors can delete
CREATE POLICY "Org admins can delete campaigns" ON public.campaigns
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = campaigns.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'executive', 'editor')
    )
  );
