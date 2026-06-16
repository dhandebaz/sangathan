-- Add profile fields to organisations table
ALTER TABLE public.organisations 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS address TEXT;

-- Create storage bucket for organisation assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('organisation_assets', 'organisation_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
-- 1. Public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'organisation_assets' );

-- 2. Authenticated users can upload to their org folder
-- The folder structure will be: organisation_assets/{orgId}/logo.png
CREATE POLICY "Org admins can upload assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'organisation_assets' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'executive', 'editor')
    AND p.status = 'active'
    -- We extract the UUID from the start of the path (e.g. "org_id/file.png")
    AND p.organisation_id::text = (string_to_array(name, '/'))[1]
  )
);

CREATE POLICY "Org admins can update assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'organisation_assets' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'executive', 'editor')
    AND p.status = 'active'
    AND p.organisation_id::text = (string_to_array(name, '/'))[1]
  )
);

CREATE POLICY "Org admins can delete assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'organisation_assets' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'executive', 'editor')
    AND p.status = 'active'
    AND p.organisation_id::text = (string_to_array(name, '/'))[1]
  )
);
