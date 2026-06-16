const fs = require('fs');
const path = require('path');

const components = [
  { file: 'MasterSwitchDashboard.tsx', route: 'master-switch' },
  { file: 'SecurityDashboard.tsx', route: 'security' },
  { file: 'DigitalTwinDashboard.tsx', route: 'digital-twin' },
  { file: 'DroneDashboard.tsx', route: 'drones' },
  { file: 'EnergyDashboard.tsx', route: 'energy' },
  { file: 'OmniStreamDashboard.tsx', route: 'omnistream' },
  { file: 'StrategyDashboard.tsx', route: 'strategy' },
  { file: 'AethelredDashboard.tsx', route: 'aethelred' },
  { file: 'AcademyDashboard.tsx', route: 'academy' },
  { file: 'BoutiqueDashboard.tsx', route: 'boutique' },
  { file: 'PoolDashboard.tsx', route: 'pool' },
  { file: 'ValetDashboard.tsx', route: 'valet' },
  { file: 'ConciergeDashboard.tsx', route: 'concierge' },
  { file: 'ArrivalsDashboard.tsx', route: 'arrivals' },
  { file: 'MaintenanceDashboard.tsx', route: 'maintenance' },
  { file: 'MinibarDashboard.tsx', route: 'minibar' }
];

const sourceDir = path.join(__dirname, 'src', 'components');
const targetDirBase = path.join(__dirname, 'frontend', 'src', 'app', '[locale]', '(app)');

components.forEach(({ file, route }) => {
  const sourcePath = path.join(sourceDir, file);
  const targetDir = path.join(targetDirBase, route);
  const targetPath = path.join(targetDir, 'page.tsx');

  if (fs.existsSync(sourcePath)) {
    // Read source
    let content = fs.readFileSync(sourcePath, 'utf8');
    
    // Add use client if missing
    if (!content.includes("'use client'") && !content.includes('"use client"')) {
      content = `'use client';\n\n` + content;
    }

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log(`Migrated ${file} to /${route}/page.tsx`);
  } else {
    console.warn(`Source file not found: ${sourcePath}`);
  }
});
