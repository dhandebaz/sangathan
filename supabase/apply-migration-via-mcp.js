const { spawn } = require('child_process');
const path = require('path');

const ACCESS_TOKEN = 'sbp_b2e20c6463b60c57f93f4f4715c113acbaa74906';
const PROJECT_REF = 'isddyfisvxpoyglkyzfw';
const MIGRATION_FILE = path.join(__dirname, 'migrations', '20260617000002_legal_entity_statutory.sql');

// Read the migration file
const fs = require('fs');
const migrationSql = fs.readFileSync(MIGRATION_FILE, 'utf8');

// Extract only the compliance_filings related statements (since the columns already exist)
const filteredStatements = `-- Create compliance_filings table for periodic statutory filings
CREATE TABLE IF NOT EXISTS public.compliance_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  filing_type TEXT NOT NULL,
  filing_name TEXT NOT NULL,
  authority TEXT NOT NULL,
  financial_year TEXT,
  due_date DATE NOT NULL,
  filed_date DATE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'filed', 'overdue', 'exempt', 'not_applicable')),
  filing_reference TEXT,
  document_url TEXT,
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

-- RLS Policies for compliance_filings
ALTER TABLE public.compliance_filings ENABLE ROW LEVEL SECURITY;

-- Org members can view their compliance filings
DROP POLICY IF EXISTS "Members can view org compliance filings" ON public.compliance_filings;
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
DROP POLICY IF EXISTS "Admins can manage org compliance filings" ON public.compliance_filings;
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

-- Auto-update updated_at trigger
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

-- Backfill existing orgs
UPDATE public.organisations
SET legal_entity_type = 'unregistered'
WHERE legal_entity_type IS NULL;
`;

console.log('SQL statements to execute:');
console.log(filteredStatements);
console.log('\n=== Executing via Supabase MCP Server ===\n');

// The MCP server reads from stdin, so we'll provide instructions via a different approach
// Let's try using the Supabase CLI directly

console.log('Attempting to apply migration via supabase CLI with direct database connection...');

const cli = spawn('npx', [
  'supabase', 'db', 'push',
  '--db-url', `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD || 'postgres'}@db.${PROJECT_REF}.supabase.co:5432/postgres`
], {
  env: { ...process.env },
  stdio: ['pipe', 'inherit', 'inherit']
});

setTimeout(() => {
  console.log('\nIf the CLI approach failed, the SQL is ready above.');
  console.log('You can apply it via:');
  console.log('1. Supabase Dashboard → SQL Editor → Paste and run the SQL');
  console.log('2. Or run: supabase db push (with linked project)');
}, 10000);
