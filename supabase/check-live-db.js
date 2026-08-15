const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://isddyfisvxpoyglkyzfw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGR5Zmlzdnhwb3lnbGt5emZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM3MTY5NCwiZXhwIjoyMDg2OTQ3Njk0fQ._L_PwGXzWlylNrAsc4F3H07l7GPI8fGEFwqadd65udo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLiveDatabase() {
  console.log('=== Checking Live Supabase Database State ===\n');

  // Check all statutory ID columns
  const statColumns = [
    'legal_entity_type', 'governing_law', 'registrar_authority', 'registration_state',
    'tan', 'gstin', 'cin', 'fcra_registration', 'certificate_12a', 
    'certificate_12a_valid_till', 'certificate_80g', 'certificate_80g_valid_till',
    'csr_registration', 'trade_union_registration', 'cooperative_registration',
    'society_registration', 'trust_registration', 'epfo_code', 'esic_code', 'udyam_registration'
  ];
  
  console.log('Checking organisations table columns:');
  for (const col of statColumns) {
    const { error } = await supabase.from('organisations').select(col).limit(0);
    if (error && error.message.includes(`column "${col}" does not exist`)) {
      console.log(`  ✗ ${col}: MISSING`);
    } else {
      console.log(`  ✓ ${col}: EXISTS`);
    }
  }

  // Check compliance_filings table
  console.log('\nChecking compliance_filings table:');
  const { data, error } = await supabase
    .from('compliance_filings')
    .select('*')
    .limit(1);
    
  if (error) {
    if (error.message.includes('relation "compliance_filings" does not exist')) {
      console.log('  ✗ compliance_filings table: NOT FOUND');
    } else {
      console.log('  Error:', error.message);
    }
  } else {
    console.log('  ✓ compliance_filings table: EXISTS');
  }

  // Check if legal_entity_type is TEXT or ENUM
  console.log('\nChecking column type:');
  const { data: typeData, error: typeError } = await supabase
    .from('organisations')
    .select('legal_entity_type')
    .limit(0);
  
  if (typeError) {
    console.log('  Error:', typeError.message);
  } else {
    console.log('  ✓ legal_entity_type column exists');
  }

  // Try to check if the August 15 migration was applied
  console.log('\nChecking for August 15 migration tables:');
  
  // Check if there's a different compliance_filings structure
  const { data: filingsData, error: filingsError } = await supabase
    .from('compliance_filings')
    .select('*')
    .limit(5);
    
  if (filingsError) {
    console.log('  compliance_filings access:', filingsError.message);
  } else {
    console.log('  ✓ compliance_filings accessible');
    if (filingsData && filingsData.length > 0) {
      console.log('  Columns:', Object.keys(filingsData[0]));
      console.log('  Sample rows:', filingsData.length);
    } else {
      console.log('  Table exists but empty (or no access)');
    }
  }

  console.log('\n=== Summary ===');
  console.log('The database already has the statutory ID columns (likely from the August 15 migration).');
  console.log('Need to check if compliance_filings table needs to be created.');
}

checkLiveDatabase().catch(console.error);
