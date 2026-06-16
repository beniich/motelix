// fix-imports.js — Fix remaining broken imports after DDD migration
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../backend/src');

// Canonical map: resolved src-relative path (no ext) => new src-relative path (no ext)
const canonicals = {
  'utils/asyncHandler': 'shared/errors/asyncHandler',
  'utils/pagination': 'shared/utils/pagination',
  'services/reference.service': 'services/reference.service',
};

function relFrom(fileRel, targetRel) {
  const rel = path.relative(path.dirname(fileRel), targetRel).replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : './' + rel;
}

let totalFixed = 0;

function scanAndFix(dir, relDir) {
  fs.readdirSync(dir).forEach((f) => {
    const fullPath = path.join(dir, f);
    const rel = relDir ? relDir + '/' + f : f;
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndFix(fullPath, rel);
    } else if (f.endsWith('.ts')) {
      let c = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Match relative imports
      c = c.replace(/from '(\.\.?\/[^']+)'/g, (match, importPath) => {
        const fileDir = path.dirname(rel);
        // Resolve to src-relative canonical
        const joined = path.join(fileDir, importPath).replace(/\\/g, '/').replace(/\.js$/, '');

        for (const [old, canon] of Object.entries(canonicals)) {
          // Match if the resolved path ends with the old canonical
          if (joined === old || joined.endsWith('/' + old)) {
            const newRel = relFrom(rel, canon) + '.js';
            if (newRel !== importPath) {
              changed = true;
              return `from '${relFrom(rel, canon)}.js'`;
            }
          }
        }
        return match;
      });

      if (changed) {
        fs.writeFileSync(fullPath, c);
        console.log('Fixed: ' + rel);
        totalFixed++;
      }
    }
  });
}

scanAndFix(root, '');
console.log(`\nDone. ${totalFixed} files fixed.`);
