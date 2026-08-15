const https = require('https');

const ACCESS_TOKEN = 'sbp_b2e20c6463b60c57f93f4f4715c113acbaa74906';
const PROJECT_REF = 'isddyfisvxpoyglkyzfw';

function supabaseSqlRaw(query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/sql`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ query });

    const req = https.request(options, (res) => {
      let data = '';
      let fullHeaders = res.headers;
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: fullHeaders,
          body: data,
          parsed: (() => { try { return JSON.parse(data); } catch { return data; } })()
        });
      });
    });

    req.on('error', (e) => resolve({ error: e.message }));
    req.write(body);
    req.end();
  });
}

async function test() {
  console.log('=== Testing SQL API authentication ===\n');
  
  const result = await supabaseSqlRaw('SELECT 1 as test');
  console.log('Status:', result.statusCode);
  console.log('Body:', result.body);
  console.log('');
  
  // Also check what the API expects
  console.log('=== Checking API docs ===');
  const docs = await supabaseSqlRaw(`
-- Simple test query
SELECT current_database() as db_name;
  `);
  console.log('Simple query status:', docs.statusCode);
  console.log('Simple query body:', docs.body);
}

test();
