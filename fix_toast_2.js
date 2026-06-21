const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = /toast\(\{\s*title:\s*([^,]+),\s*description:\s*([^,}]+)(?:,\s*variant:\s*'destructive')?\s*\}\)/g;
      
      let changed = false;
      content = content.replace(regex, (match, title, desc) => {
        changed = true;
        if (match.includes('destructive')) {
          return `toast.error(${title}, { description: ${desc} })`;
        }
        return `toast.success(${title}, { description: ${desc} })`;
      });
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir('c:/Users/hudav/Documents/trae_projects/sangathan/src/components/dashboard');
