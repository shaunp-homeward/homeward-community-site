import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const textExtensions = new Set(['.html','.css','.js','.json','.svg','.xml','.txt']);

const replacements = [
  [/#B35A2A/g, '#B53A2A'],
  [/#b35a2a/g, '#b53a2a'],
  [/rgba\(179\s*,\s*90\s*,\s*42\s*,/g, 'rgba(181,58,42,'],
  [/rgb\(179\s*,\s*90\s*,\s*42\s*\)/g, 'rgb(181,58,42)'],
];

let filesChanged = 0;
let replacementsMade = 0;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    let content = await fs.readFile(full, 'utf8');
    const before = content;
    for (const [pattern, value] of replacements) {
      const matches = content.match(pattern);
      if (matches) replacementsMade += matches.length;
      content = content.replace(pattern, value);
    }
    if (content !== before) {
      await fs.writeFile(full, content);
      filesChanged += 1;
    }
  }
}

await walk(dist);
console.log(`Normalized Homeward copper in ${filesChanged} generated files (${replacementsMade} replacements).`);
