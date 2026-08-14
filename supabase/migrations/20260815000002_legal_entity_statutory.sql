-- 20260815000002_legal_entity_statutory.sql
-- Legal Entity Sub-Classification & Statutory Registration Framework
-- Adds legal_entity_type sub-classification, structured statutory ID fields,
-- and compliance_filings table for periodic statutory filings.
--
-- IMPORTANT: This does NOT change the org_type enum or column.
-- The 5 org types (civic_collective, ngo, student_union, workers_union, rwa) remain as-is.

-- ============================================================================
-- 1. Add legal entity sub-classification columns to organisations
-- ============================================================================
ALTER TABLE public.organisations
  ADD COLUMN IF NOT EXISTS legal_entity_type TEXT,
  ADD COLUMN IF NOT EXISTS governing_law TEXT,
  ADD COLUMN IF NOT EXISTS registrar_authority TEXT,
  ADD COLUMN IF NOT EXISTS registration_state TEXT;

-- Add a comment for documentation
COMMENT ON COLUMN public.organisations.legal_entity_type IS 
  'Legal sub-classification within org_type (e.g., society/trust/section_8_company for NGO). See src/lib/legal-entity-types.ts for valid values.';
COMMENT ON COLUMN public.organisations.registration_state IS 
  'Indian state/UT where the organisation is registered (for state-specific compliance rules).';

-- ============================================================================
-- 2. Add structured statutory ID fields to organisations
-- ============================================================================
-- These are separate columns (not JSONB) for:
--   a) Direct SQL querying and indexing
--   b) Future government API integration (each ID can be verified independently)
--   c) Regulatory reporting
--
-- NOTE: `tax_id` (PAN) and `darpan_id` already exist from migration 20260617000001

ALTER TABLE public.organisations
  ADD COLUMN IF NOT EXISTS tan TEXT,
  ADD COLUMN IF NOT EXISTS gstin TEXT,
  ADD COLUMN IF NOT EXISTS cin TEXT,
  ADD COLUMN IF NOT EXISTS fcra_registration TEXT,
  ADD COLUMN IF NOT EXISTS certificate_12a TEXT,
  ADD COLUMN IF NOT EXISTS certificate_12a_valid_till DATE,
  ADD COLUMN IF NOT EXISTS certificate_80g TEXT,
  ADD COLUMN IF NOT EXISTS certificate_80g_valid_till DATE,
  ADD COLUMN IF NOT EXISTS csr_registration TEXT,
  ADD COLUMN IF NOT EXISTS trade_union_registration TEXT,
  ADD COLUMN IF NOT EXISTS cooperative_registration TEXT,
  ADD COLUMN IF NOT EXISTS society_registration TEXT,
  ADD COLUMN IF NOT EXISTS trust_registration TEXT,
  ADD COLUMN IF NOT EXISTS epfo_code TEXT,
  ADD COLUMN IF NOT EXISTS esic_code TEXT,
  ADD COLUMN IF NOT EXISTS udyam_registration TEXT;

-- ============================================================================
-- 3. Create compliance_filings table for periodic statutory filings
-- ============================================================================
-- Tracks periodic filings like ITR-7, Form FC-4, Form H, AGM minutes, etc.
-- This is DIFFERENT from compliance_items (which tracks registration status).
-- compliance_filings tracks PERIODIC recurring regulatory submissions.

CREATE TABLE IF NOT EXISTS public.compliance_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  filing_type TEXT NOT NULL,          -- e.g., 'itr_7', 'form_fc4', 'aoc_4' (matches ComplianceFilingType)
  filing_name TEXT NOT NULL,          -- Human-readable name
  authority TEXT NOT NULL,            -- Issuing/receiving authority
  financial_year TEXT,                -- e.g., '2025-26'
  due_date DATE NOT NULL,
  filed_date DATE,                    -- When actually filed
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'filed', 'overdue', 'exempt', 'not_applicable')),
  filing_reference TEXT,              -- Acknowledgement/receipt number from authority
  document_url TEXT,                  -- Link to filed document in storage
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast org-level queries
CREATE INDEX IF NOT EXISTS idx_compliance_filings_org 
  ON public.compliance_filings(organisation_id);
CREATE INDEX IF NOT EXISTS idx_compliance_filings_status 
  ON public.compliance_filings(organisation_id, status);
CREATE INDEX IF NOT EXISTS idx_compliance_filings_due 
  ON public.compliance_filings(due_date) WHERE status IN ('pending', 'overdue');

-- ============================================================================
-- 4. RLS Policies for compliance_filings
-- ============================================================================
ALTER TABLE public.compliance_filings ENABLE ROW LEVEL SECURITY;

-- Org members can view their compliance filings
CREATE POLICY "Members can view org compliance filings"
  ON public.compliance_filings FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.organisation_id = compliance_filings.organisation_id
    )
  );

-- Only admins/executives can manage compliance filings
CREATE POLICY "Admins can manage org compliance filings"
  ON public.compliance_filings FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.organisation_id = compliance_filings.organisation_id
        AND profiles.role IN ('admin', 'executive')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.organisation_id = compliance_filings.organisation_id
        AND profiles.role IN ('admin', 'executive')
    )
  );

-- ============================================================================
-- 5. Auto-update updated_at trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_compliance_filings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_compliance_filings_updated_at ON public.compliance_filings;
CREATE TRIGGER trg_compliance_filings_updated_at
  BEFORE UPDATE ON public.compliance_filings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_compliance_filings_updated_at();
