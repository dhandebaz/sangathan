const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://isddyfisvxpoyglkyzfw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGR5Zmlzdnhwb3lnbGt5emZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM3MTY5NCwiZXhwIjoyMDg2OTQ3Njk0fQ._L_PwGXzWlylNrAsc4F3H07l7GPI8fGEFwqadd65udo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
  console.log('=== Verifying Migration on Live Supabase ===\n');

  // Check 1: legal_entity_type column exists
  const { data: colData, error: colError } = await supabase
    .from('organisations')
    .select('id, name, legal_entity_type, governing_law, registrar_authority, registration_state')
    .limit(5);
    
  if (colError) {
    console.log('Column check:', colError.message);
  } else {
    console.log('✓ organisatons table has new columns');
    console.log('  Sample rows:', colData?.length || 0);
    if (colData && colData.length > 0) {
      colData.forEach((row, i) => {
        console.log(`  Row ${i+1}: id=${row.id?.substring(0,8)}... legal_entity_type=${row.legal_entity_type || 'null'}`);
      });
    }
  }

  // Check 2: compliance_filings table
  const { data: filingsData, error: filingsError } = await supabase
    .from('compliance_filings')
    .select('id')
    .limit(1);
    
  if (filingsError) {
    console.log('Table check:', filingsError.message);
  } else {
    console.log('✓ compliance_filings table exists');
  }

  // Check 3: Test inserting and reading
  console.log('\n=== Testing Data Operations ===');
  
  // Try to update an organization with legal_entity_type
  const testOrg = colData?.[0];
  if (testOrg && testOrg.id) {
    try {
      const updateRes = await supabase
        .from('organisations')
        .update({ 
          legal_entity_type: testOrg.legal_entity_type || 'unregistered',
          governing_law: 'Societies Registration Act, 1860',
          registrar_authority: 'Registrar of Societies'
        })
        .eq('id', testOrg.id)
        .select();
      
      if (updateRes.error) {
        console.log('Update test (may be expected):', updateRes.error.message);
      } else {
        console.log('✓ Update test passed');
      }
    } catch(e) {
      console.log('Update test error:', e.message);
    }
  }

  // Check statutory ID columns
  console.log('\n=== Checking Statutory ID Columns ===');
  const statColumns = ['tan', 'gstin', 'cin', 'fcra_registration', 'certificate_12a', 
    'certificate_80g', 'csr_registration', 'trade_union_registration', 
    'cooperative_registration', 'society_registration', 'trust_registration', 
    'epfo_code', 'esic_code', 'udyam_registration'];
    
  for (const col of statColumns) {
    const { error } = await supabase.from('organisations').select(col).limit(0);
    if (error && error.message.includes(`column "${col}" does not exist`)) {
      console.log(`  ✗ ${col}: MISSING`);
    } else {
      console.log(`  ✓ ${col}: OK`);
    }
  }

  console.log('\n=== Migration Verification Complete ===');
}

verifyMigration().catch(console.error);
