-- Fix organisations RLS policies to use profiles instead of deprecated members table
-- Also prevent infinite recursion with is_platform_admin helper

DROP POLICY IF EXISTS "org members can view organisation" ON public.organisations;
DROP POLICY IF EXISTS "org admins manage organisation" ON public.organisations;
DROP POLICY IF EXISTS "Platform admins can view all organisations" ON public.organisations;
DROP POLICY IF EXISTS "Platform admins can view organisations" ON public.organisations;
DROP POLICY IF EXISTS "Platform admins manage organisations" ON public.organisations;

CREATE POLICY "org members can view organisation"
  ON public.organisations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.organisation_id = organisations.id
    )
    OR
    is_platform_admin()
  );

CREATE POLICY "org admins manage organisation"
  ON public.organisations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() 
      AND p.organisation_id = organisations.id 
      AND p.role IN ('admin', 'executive', 'editor')
    )
    OR
    is_platform_admin()
  );
