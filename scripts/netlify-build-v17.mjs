import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const production = process.env.CONTEXT === 'production';
const flag = production ? '--production' : '--release-preview';
for (const script of ['build-v17.mjs', 'verify-v17.mjs']) {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts', script), flag], { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
// Netlify's publish directory is stable across production and preview contexts.
const output = path.join(root, production ? 'dist-v17-production' : 'dist-v17-preview');
const publish = path.join(root, 'dist-v17');
await fs.rm(publish, { recursive: true, force: true });
await fs.cp(output, publish, { recursive: true });
console.log(`Netlify ${production ? 'production' : 'preview'} output prepared in dist-v17.`);
