const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'src', 'controllers');
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.controller.ts'));

for (const file of files) {
  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace `getTenantId(req)` with `await getTenantIdOrThrow(req)`
  content = content.replace(/getTenantId\(req\)/g, 'await getTenantIdOrThrow(req)');
  
  // Replace `const hotelId = req.user!.hotelId;` with `const hotelId = await getTenantIdOrThrow(req);`
  content = content.replace(/const hotelId = req\.user!\.hotelId;/g, 'const hotelId = await getTenantIdOrThrow(req);');
  
  // Also fix cases where `req.user!.hotelId` is directly used in queries
  content = content.replace(/hotelId: req\.user!\.hotelId/g, 'hotelId: await getTenantIdOrThrow(req)');

  // Fix imports
  if (content.includes('getTenantIdOrThrow') && !content.includes("import { getTenantIdOrThrow }")) {
    if (content.includes("import { getTenantId }")) {
      content = content.replace("import { getTenantId }", "import { getTenantIdOrThrow }");
    } else {
      // Add import at the top
      content = content.replace(
        "import { prisma } from '../lib/prisma.js';",
        "import { prisma } from '../lib/prisma.js';\nimport { getTenantIdOrThrow } from '../utils/tenant.js';"
      );
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${file}`);
}
