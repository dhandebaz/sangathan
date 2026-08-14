-- 20260617000002_legal_entity_statutory.sql

-- 1. Add legal_entity_type and governance fields to organisations
DO $$ BEGIN
    CREATE TYPE legal_entity_type AS ENUM (
      'society',
      'trust',
      'section_8_company',
      'registered_trade_union',
      'informal_collective',
      'registered_society',
      'cooperative_housing',
      'apartment_association',
      'university_body',
      'independent_front',
      'unregistered',
      'bqf_recognized'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.organisations
ADD COLUMN IF NOT EXISTS legal_entity_type legal_entity_type,
ADD COLUMN IF NOT EXISTS governing_law text,
ADD COLUMN IF NOT EXISTS registrar_authority text,
ADD COLUMN IF NOT EXISTS registration_state text;

-- 2. Add structured statutory ID fields to organisations
ALTER TABLE public.organisations
ADD COLUMN IF NOT EXISTS tan text,
ADD COLUMN IF NOT EXISTS gstin text,
ADD COLUMN IF NOT EXISTS cin text,
ADD COLUMN IF NOT EXISTS fcra_registration text,
ADD COLUMN IF NOT EXISTS certificate_12a text,
ADD COLUMN IF NOT EXISTS certificate_12a_valid_till date,
ADD COLUMN IF NOT EXISTS certificate_80g text,
ADD COLUMN IF NOT EXISTS certificate_80g_valid_till date,
ADD COLUMN IF NOT EXISTS csr_registration text,
ADD COLUMN IF NOT EXISTS trade_union_registration text,
ADD COLUMN IF NOT EXISTS cooperative_registration text,
ADD COLUMN IF NOT EXISTS society_registration text,
ADD COLUMN IF NOT EXISTS trust_registration text,
ADD COLUMN IF NOT EXISTS epfo_code text,
ADD COLUMN IF NOT EXISTS esic_code text,
ADD COLUMN IF NOT EXISTS udyam_registration text;

-- 3. Create compliance_filings table for periodic statutory filings
CREATE TABLE IF NOT EXISTS compliance_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  filing_type TEXT NOT NULL,
  filing_name TEXT NOT NULL,
  authority TEXT NOT NULL,
  financial_year TEXT,
  due_date DATE NOT NULL,
  filed_date DATE,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','filed','overdue','exempt','not_applicable')),
  filing_reference text,
  document_url text,
  notes text,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS policies for compliance_filings (similar to compliance_items)
CREATE POLICY "Org admins can manage compliance filings"
ON compliance_filings FOR ALL TO authenticated
USING (
  org_id IN (
    SELECT organisation_id FROM public.profiles WHERE public.profiles.id = auth.uid()
  )
  AND public.profiles.role IN ('admin', 'executive')
)
WITH CHECK (
  org_id IN (
    SELECT organisation_id FROM public.profiles WHERE public.profiles.id = auth.uid()
  )
  AND public.profiles.role IN ('admin', 'executive')
);

-- 5. Update existing organisations without legal_entity_type to 'unregistered'
-- This ensures backward compatibility - existing orgs default to unregistered
UPDATE public.organisations
SET legal_entity_type = 'unregistered'::legal_entity_type
WHERE legal_entity_type IS NULL;