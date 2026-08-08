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
let config = await fs.readFile(configPath, 'utf8');
const enabledConfig = config.replace(/editor:\n  preview: false/, 'editor:\n  preview: true');
config = enabledConfig;

// V8's editable source fields live in a separate, maintainable collection file
// so the large legacy config remains stable. The collection is merged into the
// deployed config at build time, before the admin bundle is published.
const v8CollectionPath = path.join(source, 'v8-collection.yml');
const v8Collection = await fs.readFile(v8CollectionPath, 'utf8');
if (!config.includes('name: v8_front_door')) {
  config = `${config.trimEnd()}\n${v8Collection.trim()}\n`;
}
await fs.writeFile(configPath, config);

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
