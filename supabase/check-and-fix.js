const https = require('https');

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'isddyfisvxpoyglkyzfw';

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
        console.log('Raw response:', data);
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch(e) {
          console.log('Parse error, raw data:', data);
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function checkAndFix() {
  console.log('=== Checking what was actually applied ===\n');
  
  // Check if the ENUM type was created
  console.log('1. Checking legal_entity_type type...');
  try {
    await supabaseSql(`SELECT typname FROM pg_type WHERE typname = 'legal_entity_type'`);
  } catch(e) {
    console.log('Type check error:', e);
  }
  
  // Check if the table exists
  console.log('\n2. Checking compliance_filings table...');
  try {
    await supabaseSql(`SELECT * FROM information_schema.tables WHERE table_name = 'compliance_filings'`);
  } catch(e) {
    console.log('Table check error:', e);
  }
  
  // Check columns on organisations table
  console.log('\n3. Checking organisations columns...');
  try {
    await supabaseSql(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'organisations' AND column_name IN ('legal_entity_type', 'governing_law', 'registrar_authority', 'registration_state')`);
  } catch(e) {
    console.log('Columns check error:', e);
  }
  
  // Now let's try to create the table
  console.log('\n4. Creating compliance_filings table...');
  try {
    await supabaseSql(`
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
);`);
    console.log('Table created successfully');
  } catch(e) {
    console.log('Table creation error:', e);
  }
  
  // Add RLS policy
  console.log('\n5. Adding RLS policy...');
  try {
    await supabaseSql(`
ALTER TABLE compliance_filings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org admins can manage compliance filings" ON compliance_filings;

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
);`);
    console.log('RLS policy added successfully');
  } catch(e) {
    console.log('RLS error:', e);
  }
  
  console.log('\n=== Done ===');
}

checkAndFix();
