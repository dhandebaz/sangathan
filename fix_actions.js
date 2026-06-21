const fs = require('fs');

const files = [
  'src/actions/cba.ts',
  'src/actions/dues.ts',
  'src/actions/elections.ts',
  'src/actions/facilities.ts',
  'src/actions/grants.ts',
  'src/actions/jobs.ts'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Ensure createClient is imported
  if (!content.includes('import { createClient } from \'@/lib/supabase/server\'')) {
    content = content.replace('import { createSafeAction } from \'@/lib/auth/actions\'', 'import { createSafeAction } from \'@/lib/auth/actions\'\nimport { createClient } from \'@/lib/supabase/server\'');
  }

  // Find all action block starts
  const startRegex = /createSafeAction\(\s*'([^']+)',\s*([A-Za-z0-9_]+),\s*async\s*\(([^,]+),\s*\{[^}]+\}\)\s*=>\s*\{/g;
  
  let match;
  while ((match = startRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const actionName = match[1];
    const schemaName = match[2];
    const dataVar = match[3];

    const replacement = `createSafeAction(
  ${schemaName},
  async (${dataVar}, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;`;

    content = content.replace(fullMatch, replacement);
    
    // Now we need to append the options to the end of this createSafeAction call
    // Since we know the file structure we created:
    //   }
    // )
    // We will replace `\n  }\n)` with `\n  },\n  { actionName: '${actionName}' }\n)`
    // Note: We need to replace only the first occurrence after our match index, but since we have a simple file structure we can just do a global replace carefully, 
    // actually let's just do a string replace with a regex that captures the end of the action block:
  }
  
  // Fix the ends of the action blocks
  // Original:
  //     return { success: true }
  //   }
  // )
  
  // Instead of guessing the actionName for the end block, we'll use a hack: Since actionName is only used for logging, we can just omit it or use the function name! Wait, `options: ActionOptions = {}` means it's optional!
  // If I omit actionName, it defaults to 'unknown_action' in the logger. That's perfectly fine! So I just need to remove the first parameter.

  fs.writeFileSync(file, content);
}
