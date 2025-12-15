import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('node_modules/@astrojs/starlight/utils/head.ts');
if (!fs.existsSync(file)) {
  console.warn('[patch-starlight-head] file not found, skipping');
  process.exit(0);
}

const src = fs.readFileSync(file, 'utf8');
if (src.includes('if (!next) continue; // skip undefined head configs')) {
  console.log('[patch-starlight-head] already patched');
  process.exit(0);
}

const needle = 'for (const next of heads) {';
const replacement = `for (const next of heads) {\n\t\tif (!next) continue; // skip undefined head configs`;

if (!src.includes(needle)) {
  console.warn('[patch-starlight-head] needle not found, skipping');
  process.exit(0);
}

const patched = src.replace(needle, replacement);
fs.writeFileSync(file, patched, 'utf8');
console.log('[patch-starlight-head] patched');
