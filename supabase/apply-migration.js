// Direct migration runner using Supabase JS client
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.');
  process.exit(1);
}

console.log('Connecting to Supabase at:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' },
  auth: { storage: undefined, autoRefreshToken: false, persistSession: false },
  global: { headers: { 'x-connection-pooling': 'true' } }
});

// Read the migration file
const migrationFile = path.join(__dirname, 'migrations', '20260617000002_legal_entity_statutory.sql');
const migrationSql = fs.readFileSync(migrationFile, 'utf8');

async function runMigration() {
  console.log('\n=== Checking current database state ===');
  
  // Check if legal_entity_type column exists
  const { data: colCheck, error: colError } = await supabase
    .from('organisations')
    .select('legal_entity_type')
    .limit(1);

  if (colError && colError.message.includes('column "legal_entity_type" does not exist')) {
    console.log('legal_entity_type column: NOT FOUND (migration needed)');
  } else if (colError) {
    console.log('Column check error:', colError.message);
  } else {
    console.log('legal_entity_type column: EXISTS (migration may already be applied)');
  }

  // Check if compliance_filings table exists
  const { data: filingsCheck, error: filingsError } = await supabase
    .from('compliance_filings')
    .select('id')
    .limit(1);

  if (filingsError && filingsError.message.includes('relation "compliance_filings" does not exist')) {
    console.log('compliance_filings table: NOT FOUND');
  } else if (filingsError) {
    console.log('Filings check error:', filingsError.message);
  } else {
    console.log('compliance_filings table: EXISTS');
  }

  console.log('\n=== Migration SQL ===');
  console.log(migrationSql.split(';').filter(q => q.trim()).length, 'statements found');

  console.log('\n=== Running migration via Supabase SQL endpoint ===');
  
  // Use the Supabase Management API to run the SQL
  // First, try using the supabase CLI push command
  console.log('Migration file ready to apply:');
  console.log(`- File: ${migrationFile}`);
  console.log(`- Path: supabase/migrations/20260617000002_legal_entity_statutory.sql`);
  console.log('\nTo apply this migration run: npx supabase db push --linked');
}

runMigration().catch(err => {
  console.error('Migration check failed:', err);
  process.exit(1);
});
