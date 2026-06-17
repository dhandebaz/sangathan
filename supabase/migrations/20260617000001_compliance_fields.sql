-- 20260617000001_compliance_fields.sql

-- Create the registration status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM ('registered', 'unregistered', 'in_progress');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add compliance fields to organisations
ALTER TABLE public.organisations 
ADD COLUMN IF NOT EXISTS registration_status registration_status DEFAULT 'unregistered'::registration_status,
ADD COLUMN IF NOT EXISTS registration_number text,
ADD COLUMN IF NOT EXISTS incorporation_date date,
ADD COLUMN IF NOT EXISTS tax_id text,
ADD COLUMN IF NOT EXISTS darpan_id text,
ADD COLUMN IF NOT EXISTS compliance_documents jsonb DEFAULT '[]'::jsonb;

-- Create the compliance docs storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compliance_docs',
  'compliance_docs',
  false,
  10485760, -- 10MB
  '{"application/pdf", "image/jpeg", "image/png"}'
) ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS for compliance_docs storage bucket
-- Only organisation admins/executives should be able to upload or read these documents.
-- Because storage RLS is tricky with the `organisations` table directly without an org_id in the storage.objects,
-- we'll rely on the folder structure where the path is `[orgId]/[filename]`.
-- E.g. `storage.objects.name` like 'org_1234/trust_deed.pdf'

CREATE POLICY "Org admins can manage their compliance docs"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'compliance_docs' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.organisation_id::text = (string_to_array(storage.objects.name, '/'))[1]
      AND profiles.role IN ('admin', 'executive')
  )
)
WITH CHECK (
  bucket_id = 'compliance_docs' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.organisation_id::text = (string_to_array(storage.objects.name, '/'))[1]
      AND profiles.role IN ('admin', 'executive')
  )
);
