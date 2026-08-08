import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const draftsDir = path.join(root, 'drafts');
const distDir = path.join(root, 'dist');

await fs.mkdir(distDir, { recursive: true });

for (const name of ['index-draft1.html', 'index-draft2.html']) {
  const source = path.join(draftsDir, name);
  const target = path.join(distDir, name);
  await fs.copyFile(source, target);
}

console.log('Copied homepage review drafts to dist.');
