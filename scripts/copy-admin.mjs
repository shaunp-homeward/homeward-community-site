import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'admin');
const dist = path.join(root, 'dist', 'admin');

await fs.rm(dist, { recursive: true, force: true });
await fs.cp(source, dist, { recursive: true });

// Keep the committed YAML safe for the existing staging workflow, but make the
// deployed CMS preview explicit and enabled. The browser also enables preview
// at runtime so the setting remains resilient if the copied config changes.
const configPath = path.join(dist, 'config.yml');
const config = await fs.readFile(configPath, 'utf8');
const enabledConfig = config.replace(/editor:\n  preview: false/, 'editor:\n  preview: true');
await fs.writeFile(configPath, enabledConfig);

// Netlify exposes BRANCH during builds. Production is intentionally prevented
// from becoming a direct main-branch CMS: it falls back to staging. The admin
// page also checks its hostname so branch deploy URLs remain self-describing.
const context = process.env.CONTEXT || '';
const requestedBranch = process.env.BRANCH || '';
const cmsBranch = context === 'production' || requestedBranch === 'main'
  ? 'staging'
  : (requestedBranch || 'staging');

await fs.writeFile(
  path.join(dist, 'runtime-config.js'),
  `window.__HOMEWARD_CMS_BRANCH = ${JSON.stringify(cmsBranch)};\n`,
);

console.log(`CMS admin copied to dist/admin (CMS branch: ${cmsBranch}).`);
