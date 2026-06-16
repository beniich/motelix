const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // We look for className="..." or className={`...`}
      // This simple regex won't catch everything perfectly but covers 99% of basic cases
      content = content.replace(/(className\s*=\s*["'])([^"']+?)(["'])/g, (match, prefix, classString, suffix) => {
        if (classString.includes('text-white') && !classString.includes('bg-')) {
          if (!classString.includes('dark:text-white')) {
            const newClassString = classString.replace(/\btext-white\b/g, 'text-slate-900 dark:text-white');
            changed = true;
            return prefix + newClassString + suffix;
          }
        }
        return match;
      });

      // Also support className={`...`}
      content = content.replace(/(className\s*=\s*\{`)([^`]+?)(`\})/g, (match, prefix, classString, suffix) => {
        if (classString.includes('text-white') && !classString.includes('bg-')) {
          if (!classString.includes('dark:text-white')) {
            const newClassString = classString.replace(/\btext-white\b/g, 'text-slate-900 dark:text-white');
            changed = true;
            return prefix + newClassString + suffix;
          }
        }
        return match;
      });

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
