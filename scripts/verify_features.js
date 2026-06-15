/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read .env.local to parse NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found');
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};

  content.split(/\r?\n/).forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;

    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  });

  return env;
}

async function runVerification() {
  let env;
  try {
    env = loadEnv();
  } catch (err) {
    console.error('Error loading env:', err.message);
    process.exit(1);
  }

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseServiceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
    process.exit(1);
  }

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  let orgId = null;
  let ticketId = null;
  let campaignId = null;

  try {
    // 1. Create a test organisation with unique slug (e.g. test-org-[timestamp])
    const timestamp = Date.now();
    const orgSlug = `test-org-${timestamp}`;
    const orgName = `Test Org ${timestamp}`;

    console.log(`Inserting test organisation with slug: ${orgSlug}...`);
    const { data: orgData, error: orgError } = await supabase
      .from('organisations')
      .insert({
        name: orgName,
        slug: orgSlug,
        org_type: 'ngo'
      })
      .select()
      .single();

    if (orgError) {
      throw new Error(`Failed to insert test organisation: ${orgError.message}`);
    }
    if (!orgData || !orgData.id) {
      throw new Error('Test organisation inserted, but no ID was returned');
    }
    orgId = orgData.id;
    console.log(`Successfully created test organisation with ID: ${orgId}`);

    // 2. Insert a test record into public.tickets table:
    // - organisation_id = test org ID
    // - type = 'complaint'
    // - title = 'Test Complaint Title'
    // - description = 'This is a test complaint description with more than 10 characters'
    // - status = 'open'
    // - priority = 'medium'
    console.log('Inserting test ticket...');
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        organisation_id: orgId,
        type: 'complaint',
        title: 'Test Complaint Title',
        description: 'This is a test complaint description with more than 10 characters',
        status: 'open',
        priority: 'medium'
      })
      .select()
      .single();

    if (ticketError) {
      throw new Error(`Failed to insert test ticket: ${ticketError.message}`);
    }
    if (!ticketData || !ticketData.id) {
      throw new Error('Test ticket inserted, but no ID was returned');
    }
    ticketId = ticketData.id;
    console.log(`Successfully created test ticket with ID: ${ticketId}`);

    // 3. Query the inserted ticket from the database and assert that it was persisted and matches the input fields.
    console.log('Querying and asserting test ticket...');
    const { data: queriedTicket, error: queryTicketError } = await supabase
      .from('tickets')
      .select()
      .eq('id', ticketId)
      .single();

    if (queryTicketError) {
      throw new Error(`Failed to query test ticket: ${queryTicketError.message}`);
    }
    if (!queriedTicket) {
      throw new Error('Queried test ticket returned empty');
    }

    // Perform assertions
    if (queriedTicket.organisation_id !== orgId) throw new Error('Assertion failed: ticket organisation_id mismatch');
    if (queriedTicket.type !== 'complaint') throw new Error('Assertion failed: ticket type mismatch');
    if (queriedTicket.title !== 'Test Complaint Title') throw new Error('Assertion failed: ticket title mismatch');
    if (queriedTicket.description !== 'This is a test complaint description with more than 10 characters') {
      throw new Error('Assertion failed: ticket description mismatch');
    }
    if (queriedTicket.status !== 'open') throw new Error('Assertion failed: ticket status mismatch');
    if (queriedTicket.priority !== 'medium') throw new Error('Assertion failed: ticket priority mismatch');

    console.log('Ticket assertions passed.');

    // 4. Insert a test record into public.campaigns table:
    // - organisation_id = test org ID
    // - title = 'Test Campaign Title'
    // - goal_description = 'This is a test campaign goal description with more than 10 characters'
    // - status = 'draft'
    console.log('Inserting test campaign...');
    const { data: campaignData, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        organisation_id: orgId,
        title: 'Test Campaign Title',
        goal_description: 'This is a test campaign goal description with more than 10 characters',
        status: 'draft'
      })
      .select()
      .single();

    if (campaignError) {
      throw new Error(`Failed to insert test campaign: ${campaignError.message}`);
    }
    if (!campaignData || !campaignData.id) {
      throw new Error('Test campaign inserted, but no ID was returned');
    }
    campaignId = campaignData.id;
    console.log(`Successfully created test campaign with ID: ${campaignId}`);

    // 5. Query the inserted campaign from the database and assert that it was persisted and matches the input fields.
    console.log('Querying and asserting test campaign...');
    const { data: queriedCampaign, error: queryCampaignError } = await supabase
      .from('campaigns')
      .select()
      .eq('id', campaignId)
      .single();

    if (queryCampaignError) {
      throw new Error(`Failed to query test campaign: ${queryCampaignError.message}`);
    }
    if (!queriedCampaign) {
      throw new Error('Queried test campaign returned empty');
    }

    // Perform assertions
    if (queriedCampaign.organisation_id !== orgId) throw new Error('Assertion failed: campaign organisation_id mismatch');
    if (queriedCampaign.title !== 'Test Campaign Title') throw new Error('Assertion failed: campaign title mismatch');
    if (queriedCampaign.goal_description !== 'This is a test campaign goal description with more than 10 characters') {
      throw new Error('Assertion failed: campaign goal_description mismatch');
    }
    if (queriedCampaign.status !== 'draft') throw new Error('Assertion failed: campaign status mismatch');

    console.log('Campaign assertions passed.');

  } catch (err) {
    console.error('Verification failed:', err.message);
    // Attempt cleanup before exiting
    await cleanup(supabase, orgId, ticketId, campaignId);
    process.exit(1);
  }

  // 6. Clean up: Delete the inserted ticket, campaign, and the test organisation from the database.
  console.log('Starting cleanup...');
  const cleanSuccess = await cleanup(supabase, orgId, ticketId, campaignId);
  if (!cleanSuccess) {
    console.error('Cleanup encountered errors, but verification assertions had passed.');
    process.exit(1);
  }

  // 7. Log a clear message "VERIFICATION SUCCESSFUL: tickets and campaigns successfully persisted to the Supabase database."
  // and exit with code 0 on success.
  console.log('VERIFICATION SUCCESSFUL: tickets and campaigns successfully persisted to the Supabase database.');
  process.exit(0);
}

async function cleanup(supabase, orgId, ticketId, campaignId) {
  let success = true;
  if (ticketId) {
    console.log(`Deleting test ticket: ${ticketId}...`);
    const { error } = await supabase.from('tickets').delete().eq('id', ticketId);
    if (error) {
      console.error(`Failed to delete ticket during cleanup: ${error.message}`);
      success = false;
    }
  }
  if (campaignId) {
    console.log(`Deleting test campaign: ${campaignId}...`);
    const { error } = await supabase.from('campaigns').delete().eq('id', campaignId);
    if (error) {
      console.error(`Failed to delete campaign during cleanup: ${error.message}`);
      success = false;
    }
  }
  if (orgId) {
    console.log(`Deleting test organisation: ${orgId}...`);
    const { error } = await supabase.from('organisations').delete().eq('id', orgId);
    if (error) {
      console.error(`Failed to delete organisation during cleanup: ${error.message}`);
      success = false;
    }
  }
  return success;
}

runVerification();
