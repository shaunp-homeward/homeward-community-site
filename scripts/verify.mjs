import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFile(path.join(root, p), 'utf8');
const exists = async (p) => { try { await fs.stat(path.join(root, p)); return true; } catch { return false; } };
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const pkg = JSON.parse(await read('package.json'));
const v8 = JSON.parse(await read('content/v8.json'));
const index = await read('dist/index.html');
const circles = await read('dist/circles.html');
const resources = await read('dist/resources.html');
const lead = await read('netlify/functions/lead.mjs');
const redirects = await read('_redirects');

assert(pkg.scripts.build.includes('scripts/build.mjs'), 'Build script must continue through scripts/build.mjs');
assert(pkg.scripts.build.includes('v8-build-hook.mjs'), 'Build script must include the V8 source renderer hook');
assert(!pkg.scripts.build.includes('apply-v8-front-door.mjs'), 'Legacy post-build V8 override is still wired into the build');
assert(v8.homepage.hero.primary_label === 'Tell Us You’re Interested', 'V8 hero primary CTA is incorrect');
assert(v8.homepage.hero.primary_url === '#interest', 'V8 hero primary CTA must target #interest');
assert(v8.homepage.hero.secondary_label === 'See How a Circle Works', 'V8 hero secondary CTA is incorrect');
assert(v8.homepage.hero.logistics.includes('Four weeks'), 'V8 hero logistics must say Four weeks');
assert(v8.homepage.practice_bridge.outcomes.includes('Happiness'), 'V8 outcome line must include Happiness');
assert(v8.homepage.gifts.items.length === 4, 'V8 Four Gifts must contain exactly four practices');
assert(v8.homepage.difference.questions.length === 4, 'V8 Circle differentiation must contain four reflection questions');
assert(v8.circles.comparison.rows.length === 7, 'V8 Circles comparison must contain seven comparison rows');
assert(index.includes(v8.homepage.hero.headline), 'Generated homepage is missing the V8 hero headline from source');
assert(index.includes(v8.homepage.hero.primary_label), 'Generated homepage is missing the V8 primary CTA from source');
assert(index.includes(v8.homepage.finding_home.heading), 'Generated homepage is missing Finding Home source content');
assert(index.includes(v8.homepage.practice_bridge.heading), 'Generated homepage is missing practice bridge source content');
assert(index.includes('Happiness'), 'Generated homepage is missing the happiness outcome');
assert(index.includes(v8.homepage.gifts.items[3].title), 'Generated homepage is missing the fourth V8 gift');
assert(index.includes(v8.homepage.difference.heading), 'Generated homepage is missing Circle differentiation source content');
assert(circles.includes(v8.circles.comparison.heading), 'Generated Circles page is missing the source-driven comparison');
assert(await exists('dist/resources.html'), 'Resources page was not built');
assert(resources.length > 5000, 'Resources page appears incomplete');
assert(resources.includes('href="styles.css"') && resources.includes('src="assets/'), 'Resources page is not portable for a static preview');
assert(index.includes('data-endpoint="/api/lead"'), 'Homepage form is not connected to /api/lead');
for (const field of ['firstName','lastName','email','zip','interest','gathering_preference','draw','newsletter']) {
  assert(index.includes(`name="${field}"`), `Homepage form field ${field} is missing`);
}
for (const key of ['AIRTABLE_TOKEN','AIRTABLE_BASE_ID','AIRTABLE_TABLE_ID','RESEND_API_KEY']) {
  assert(lead.includes(key), `Lead function is missing ${key}`);
}
assert(lead.includes('https://api.airtable.com/v0/'), 'Lead function does not post to Airtable');
assert(redirects.includes('/api/lead /.netlify/functions/lead 200'), 'Lead function redirect is missing');
assert(!await exists('scripts/apply-v8-front-door.mjs'), 'Obsolete post-build V8 override script still exists');
assert(!await exists('scripts/v8-front-door.mjs'), 'Duplicate legacy V8 renderer still exists');
console.log('Homeward V8 source/CMS verification passed.');
