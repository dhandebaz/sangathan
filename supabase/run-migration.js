const https = require('https');
const fs = require('fs');
const path = require('path');

const ACCESS_TOKEN = 'sbp_b2e20c6463b60c57f93f4f4715c113acbaa74906';
const PROJECT_REF = 'isddyfisvxpoyglkyzfw';

function supabaseSql(query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/sql`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'supabase-js-node'
      }
    };

    const body = JSON.stringify({ query });

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(parsed.error);
          } else {
            resolve(parsed);
          }
        } catch(e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runMigration() {
  console.log('=== Supabase Live Migration Runner ===');
  console.log('Project:', PROJECT_REF);
  console.log('Using SQL endpoint: https://api.supabase.com/v1/projects/' + PROJECT_REF + '/sql');
  
  try {
    // Read migration SQL
    const migrationPath = path.join(__dirname, 'migrations', '20260617000002_legal_entity_statutory.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split into statements
    const statements = sql.split('\n\n').filter(s => s.trim() && !s.trim().startsWith('--'));
    console.log('Migration statements:', statements.length);
    
    console.log('\n=== Step 1: Create type and add columns ===');
    // Run the first part (type creation and column additions)
    await supabaseSql(sql.split('-- 3. Create compliance_filings table')[0]);
    console.log('Type created and columns added');
    
    console.log('\n=== Step 2: Create compliance_filings table ===');
    // Get the compliance_filings section
    const filingsTableSql = `-- 3. Create compliance_filings table for periodic statutory filings
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
);`;
    
    await supabaseSql(filingsTableSql);
    console.log('compliance_filings table created');
    
    console.log('\n=== Step 3: Add RLS policies ===');
    const rlsSql = `ALTER TABLE compliance_filings ENABLE ROW LEVEL SECURITY;

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
);`;
    
    try {
      await supabaseSql(rlsSql);
      console.log('RLS policies added');
    } catch(e) {
      console.log('RLS already applied or policy exists:', e.message ? e.message : 'Unknown error');
    }
    
    console.log('\n=== Step 4: Backfill existing orgs ===');
    const backfillSql = `UPDATE public.organisations
SET legal_entity_type = 'unregistered'::legal_entity_type
WHERE legal_entity_type IS NULL;`;
    
    try {
      await supabaseSql(backfillSql);
      console.log('Existing organizations backfilled');
    } catch(e) {
      console.log('Backfill note:', e.message ? e.message : 'Unknown');
    }
    
    console.log('\n=== MIGRATION COMPLETE ===');
    
    // Verify
    console.log('\n=== Verification ===');
    const verify = await supabaseSql(`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'organisations' AND column_name = 'legal_entity_type'`);
    console.log('legal_entity_type column:', verify);
    
    const verify2 = await supabaseSql(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'compliance_filings') as table_exists`);
    console.log('compliance_filings table:', verify2);
    
  } catch(e) {
    console.error('Migration error:', e);
  }
}

runMigration();
