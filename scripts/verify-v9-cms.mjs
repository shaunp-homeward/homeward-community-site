import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const v9 = JSON.parse(await fs.readFile(path.join(root, 'content', 'v9-live.json'), 'utf8'));
const [home, churches, admin] = await Promise.all([
  fs.readFile(path.join(dist, 'index.html'), 'utf8'),
  fs.readFile(path.join(dist, 'churches.html'), 'utf8'),
  fs.readFile(path.join(dist, 'admin', 'config.yml'), 'utf8'),
]);

const checks = [
  [home.includes(v9.homepage.hero.headline), 'Homepage hero is not rendering from V9 CMS copy.'],
  [home.includes(v9.homepage.partner.heading), 'Homepage church section is not rendering from V9 CMS copy.'],
  [home.includes(v9.homepage.partner.primary_label), 'Homepage church CTA is not rendering from V9 CMS copy.'],
  [churches.includes(v9.churches.hero.heading), 'Churches hero is not rendering from V9 CMS copy.'],
  [churches.includes(v9.churches.interest.form.submit_label), 'Churches form CTA is not rendering from V9 CMS copy.'],
  [churches.includes('name="organization"') && churches.includes('name="role"'), 'Churches form is missing organization/role fields.'],
  [churches.includes('/assets/v9-partner-form.js'), 'Churches form script is missing.'],
  [admin.includes('name: v9_live_copy'), 'V9 CMS collection was not injected into deployed Decap config.'],
  [admin.includes('file: content/v9-live.json'), 'V9 CMS source file is not connected in deployed Decap config.'],
];

const failures = checks.filter(([ok]) => !ok).map(([, message]) => message);
if (failures.length) {
  console.error('V9 CMS parity verification failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('V9 CMS parity verification passed.');
