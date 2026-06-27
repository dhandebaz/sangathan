CREATE TABLE IF NOT EXISTS compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'approved', 'rejected', 'not_applicable')),
  due_date DATE,
  document_url TEXT,
  document_name TEXT,
  document_size BIGINT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_items_org ON compliance_items(organisation_id);

ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view compliance items"
  ON compliance_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = compliance_items.organisation_id)
  );

CREATE POLICY "Org admins can insert compliance items"
  ON compliance_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = compliance_items.organisation_id AND profiles.role IN ('admin', 'executive'))
  );

CREATE POLICY "Org admins can update compliance items"
  ON compliance_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = compliance_items.organisation_id AND profiles.role IN ('admin', 'executive'))
  );

CREATE POLICY "Org admins can delete compliance items"
  ON compliance_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = compliance_items.organisation_id AND profiles.role IN ('admin', 'executive'))
  );

-- Seed defaults per org type
CREATE OR REPLACE FUNCTION seed_compliance_items(p_org_id UUID, p_org_type TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM compliance_items WHERE organisation_id = p_org_id LIMIT 1) THEN
    RETURN;
  END IF;

  IF p_org_type = 'ngo' THEN
    INSERT INTO compliance_items (organisation_id, category, title, description, status) VALUES
      (p_org_id, 'Tax Exemption', '12A Registration', 'Tax exemption status under Section 12A of the Income Tax Act.', 'not_started'),
      (p_org_id, 'Tax Exemption', '80G Certification', 'Tax deduction certification for donors under Section 80G.', 'not_started'),
      (p_org_id, 'Foreign Funding', 'FCRA Registration', 'Clearance to receive foreign contributions under FCRA.', 'not_started'),
      (p_org_id, 'Audit', 'Annual Financial Audit', 'Submission of audited financial statements for the previous fiscal year.', 'not_started');
  ELSIF p_org_type = 'rwa' THEN
    INSERT INTO compliance_items (organisation_id, category, title, description, status) VALUES
      (p_org_id, 'Registration', 'Societies Registration Renewal', 'Annual renewal of RWA registration under the Societies Act.', 'not_started'),
      (p_org_id, 'Safety', 'Fire Safety Clearance', 'Annual NOC from the Fire Department.', 'not_started'),
      (p_org_id, 'Safety', 'Lift Maintenance Certificates', 'Quarterly safety inspection reports for all lifts.', 'not_started'),
      (p_org_id, 'Governance', 'AGM Minutes Submission', 'Filing of the Annual General Meeting minutes.', 'not_started');
  ELSIF p_org_type = 'workers_union' THEN
    INSERT INTO compliance_items (organisation_id, category, title, description, status) VALUES
      (p_org_id, 'Registration', 'Trade Union Act Registration', 'Main union registration certificate under the Trade Unions Act.', 'not_started'),
      (p_org_id, 'Returns', 'Annual Returns Filing', 'Submission of annual member count and financial returns.', 'not_started'),
      (p_org_id, 'Legal', 'Strike Notice Clearance', 'Legal clearance and notice periods for ongoing ballots.', 'not_started');
  ELSIF p_org_type = 'student_union' THEN
    INSERT INTO compliance_items (organisation_id, category, title, description, status) VALUES
      (p_org_id, 'Governance', 'University Charter Agreement', 'Annual signing of the university guidelines and charter.', 'not_started'),
      (p_org_id, 'Governance', 'Elections Expense Report', 'Submission of expenditure details from the last student election.', 'not_started'),
      (p_org_id, 'Governance', 'Anti-Ragging Committee Formation', 'Mandatory establishment of a grievance and anti-ragging cell.', 'not_started');
  END IF;
END;
$$;

-- Seed existing orgs
DO $$
DECLARE
  org_record RECORD;
BEGIN
  FOR org_record IN SELECT id, org_type FROM organisations WHERE org_type IS NOT NULL LOOP
    PERFORM seed_compliance_items(org_record.id, org_record.org_type);
  END LOOP;
END;
$$;
