// Load environment variables
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
const env = {};
envLines.forEach(line => {
  const match = line.match(/^(\w+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].replace(/"/g, '');
  }
});

// Now use Supabase JS client
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service key length:', supabaseKey.length);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMigrationStatus() {
  // Check if legal_entity_type column exists
  const { data, error } = await supabase
    .from('organisations')
    .select('legal_entity_type')
    .limit(1);

  if (error) {
    if (error.message.includes('column "legal_entity_type" does not exist')) {
      console.log('STATUS: legal_entity_type column does not exist');
      console.log('STATUS: MIGRATION_NEEDED');
    } else {
      console.log('ERROR:', error.message);
    }
  } else {
    console.log('STATUS: legal_entity_type column exists');
    console.log('STATUS: MIGRATION_ALREADY_APPLIED');
  }

  // Also check compliance_filings table
  const { data: filingData, error: filingError } = await supabase
    .from('compliance_filings')
    .select('id')
    .limit(1);

  if (filingError) {
    if (filingError.message.includes('relation "compliance_filings" does not exist')) {
      console.log('STATUS: compliance_filings table does not exist');
    } else {
      console.log('FILINGS_ERROR:', filingError.message);
    }
  } else {
    console.log('STATUS: compliance_filings table exists');
  }
}

checkMigrationStatus().catch(console.error);
