// Invokes the Supabase MCP server's apply_migration tool via stdio JSON-RPC
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'isddyfisvxpoyglkyzfw';
const ACCESS_TOKEN = 'sbp_b2e20c6463b60c57f93f4f4715c113acbaa74906';
const MIGRATION_FILE = path.join(__dirname, 'migrations', '20260617000002_legal_entity_statutory.sql');

// Read migration SQL
const migrationSql = fs.readFileSync(MIGRATION_FILE, 'utf8');

// Spawn MCP server
const MCP_PATH = 'C:\\Users\\hudav\\AppData\\Roaming\\npm\\node_modules\\@supabase\\mcp-server-supabase\\dist\\transports\\stdio.js';
const child = spawn('node', [MCP_PATH], {
  env: { ...process.env, SUPABASE_ACCESS_TOKEN: ACCESS_TOKEN },
  stdio: ['pipe', 'pipe', 'pipe']
});

let buffer = '';
let pendingResolvers = new Map();
let nextId = 1;

child.stdout.on('data', (chunk) => {
  buffer += chunk.toString();
  // Try to parse complete JSON messages (newline-delimited)
  let idx;
  while ((idx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id && pendingResolvers.has(msg.id)) {
        pendingResolvers.get(msg.id)(msg);
        pendingResolvers.delete(msg.id);
      }
    } catch (e) {
      console.error('Parse error:', e.message, 'Raw:', line.slice(0, 200));
    }
  }
});

child.stderr.on('data', (chunk) => {
  // Only log non-stdio noise
  const text = chunk.toString();
  if (!text.startsWith('{') && !text.includes('jsonrpc')) {
    console.error('STDERR:', text);
  }
});

function send(method, params) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params });
    pendingResolvers.set(id, resolve);
    child.stdin.write(msg + '\n');
    // Safety timeout
    setTimeout(() => {
      if (pendingResolvers.has(id)) {
        pendingResolvers.delete(id);
        reject(new Error(`Timeout waiting for ${method}`));
      }
    }, 60000);
  });
}

async function main() {
  console.log('Connecting to Supabase MCP server...');

  // Initialize
  const init = await send('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'migration-runner', version: '1.0' }
  });
  console.log('Initialized. Server:', init.result?.serverInfo?.name, init.result?.serverInfo?.version);

  // Send initialized notification
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

  // Check existing migration status first
  console.log('\n=== Checking existing migrations ===');
  const migrations = await send('tools/call', {
    name: 'list_migrations',
    arguments: { project_id: PROJECT_ID }
  });
  const migContent = migrations.result?.content?.[0]?.text || JSON.stringify(migrations);
  console.log(migContent.slice(0, 2000));

  // Apply the migration
  console.log('\n=== Applying migration: legal_entity_statutory ===');
  const result = await send('tools/call', {
    name: 'apply_migration',
    arguments: {
      project_id: PROJECT_ID,
      name: 'legal_entity_statutory_filings',
      query: migrationSql
    }
  });

  console.log('Migration result:', JSON.stringify(result, null, 2));

  child.stdin.end();
  child.kill();
}

main().catch((e) => {
  console.error('Error:', e.message);
  child.kill();
  process.exit(1);
});
