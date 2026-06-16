// generate-icons.mjs – creates icon-192.png, icon-512.png and favicon.png from icon.svg
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svg = readFileSync(join(__dirname, '../public/icons/icon.svg'));

const sizes = [192, 512];

for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(join(__dirname, `../public/icons/icon-${size}.png`));
  console.log(`✓ icon-${size}.png`);
}

// Favicon 32x32
await sharp(svg).resize(32, 32).png().toFile(join(__dirname, '../public/favicon.png'));
console.log('✓ favicon.png');
