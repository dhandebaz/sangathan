-- Fix integration policies for storage and audit_logs (2026-08-20 consolidation)
-- This patch is idempotent and can be run on already-provisioned projects.

-- 1. Audit logs: allow authenticated inserts (service client bypasses anyway, but RLS client needs it)
DROP POLICY IF EXISTS "authenticated can insert audit logs" ON public.audit_logs;
CREATE POLICY "authenticated can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (
  auth.uid() IS NOT NULL
);

-- 2. Organisation assets: fix fragile string_to_array -> split_part and ensure editor role
DROP POLICY IF EXISTS "Org admins can upload assets" ON storage.objects;
CREATE POLICY "Org admins can upload assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'organisation_assets' AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active' AND p.organisation_id::text = split_part(name, '/', 1))
);
DROP POLICY IF EXISTS "Org admins can update assets" ON storage.objects;
CREATE POLICY "Org admins can update assets" ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'organisation_assets' AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active' AND p.organisation_id::text = split_part(name, '/', 1))
);
DROP POLICY IF EXISTS "Org admins can delete assets" ON storage.objects;
CREATE POLICY "Org admins can delete assets" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'organisation_assets' AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'executive', 'editor') AND p.status = 'active' AND p.organisation_id::text = split_part(name, '/', 1))
);

-- 3. Compliance docs: same split_part fix
DROP POLICY IF EXISTS "Org admins can manage their compliance docs" ON storage.objects;
CREATE POLICY "Org admins can manage their compliance docs"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'compliance_docs' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.organisation_id::text = split_part(storage.objects.name, '/', 1)
      AND profiles.role IN ('admin', 'executive')
  )
)
WITH CHECK (
  bucket_id = 'compliance_docs' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.organisation_id::text = split_part(storage.objects.name, '/', 1)
      AND profiles.role IN ('admin', 'executive')
  )
);
