import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const draftsDir = path.join(root, 'drafts');
const distDir = path.join(root, 'dist');

await fs.mkdir(distDir, { recursive: true });

// Keep only active non-Our-Story review artifacts in the published V8 build.
// Historical Our Story drafts remain in /drafts as rollback/reference source,
// while content/about-v8.json is now the canonical Draft 4 primary page.
for (const name of ['index-draft1.html', 'index-draft2.html', 'index-draft2-1.html', 'circles-draft1.html']) {
  const source = path.join(draftsDir, name);
  const target = path.join(distDir, name);
  await fs.copyFile(source, target);
}

console.log('Copied active review drafts to dist. Our Story is canonical via about-v8.json.');
