const fs = require('fs');

const dbText = fs.readFileSync('src/types/database.ts', 'utf8');

const fkRegex = /foreignKeyName:\s*"([^"]+)"[\s\S]*?columns:\s*\["([^"]+)"\][\s\S]*?referencedRelation:\s*"([^"]+)"/g;

let match;
while ((match = fkRegex.exec(dbText)) !== null) {
  if (match[3] === 'members') {
    console.log(`FK: ${match[1]} (${match[2]}) -> ${match[3]}`);
  }
}
