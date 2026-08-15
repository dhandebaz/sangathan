const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://isddyfisvxpoyglkyzfw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGR5Zmlzdnhwb3lnbGt5emZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM3MTY5NCwiZXhwIjoyMDg2OTQ3Njk0fQ._L_PwGXzWlylNrAsc4F3H07l7GPI8fGEFwqadd65udo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEverything() {
  console.log('=== Full Live Database Check ===\n');

  // Check compliance_filings table
  console.log('1. Checking compliance_filings table...');
  try {
    const { data, error } = await supabase
      .from('compliance_filings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('  Error:', error.message);
    } else {
      console.log('  ✓ Table exists');
    }
  } catch (e) {
    console.log('  Exception:', e.message);
  }

  // Check organisations table columns
  console.log('\n2. Checking organisations table for all new columns...');
  const columns = [
    'legal_entity_type', 'governing_law', 'registrar_authority', 'registration_state',
    'tan', 'gstin', 'cin', 'fcra_registration', 'certificate_12a', 
    'certificate_12a_valid_till', 'certificate_80g', 'certificate_80g_valid_till',
    'csr_registration', 'trade_union_registration', 'cooperative_registration',
    'society_registration', 'trust_registration', 'epfo_code', 'esic_code', 'udyam_registration'
  ];

  let existsCount = 0;
  let missingColumns = [];
  
  for (const col of columns) {
    try {
      const { error } = await supabase.from('organisations').select(col).limit(0);
      if (error && error.message.includes(`column "${col}" does not exist`)) {
        missingColumns.push(col);
      } else {
        existsCount++;
      }
    } catch (e) {
      missingColumns.push(col);
    }
  }

  console.log(`  ✓ ${existsCount} columns already exist`);
  console.log(`  ✗ ${missingColumns.length} columns missing: ${missingColumns.join(', ')}`);

  console.log('\n=== Status ===');
  if (existsCount === columns.length && missingColumns.length === 0) {
    console.log('All statutory columns are present in the live database.');
    console.log('Only compliance_filings table needs to be created.');
  } else {
    console.log('Some columns are missing - full migration needed.');
  }
}

checkEverything().catch(console.error);
