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
const v8Cms = await read('admin/v8-collection.yml');
const v8Preview = await read('admin/preview.js');
const v8Renderer = await read('scripts/render-v8-home-v6.mjs');

assert(pkg.scripts.build.includes('scripts/build.mjs'), 'Build script must continue through scripts/build.mjs');
assert(pkg.scripts.build.includes('v8-build-hook.mjs'), 'Build script must include the V8 source renderer hook');
assert(!pkg.scripts.build.includes('apply-v8-front-door.mjs'), 'Legacy post-build V8 override is still wired into the build');
assert(await exists('scripts/render-v8-home-v6.mjs'), 'Approved V6 homepage renderer is missing');
assert(await exists('assets/v8-home-v6.css'), 'Approved V6 homepage stylesheet is missing');
assert(v8.homepage.hero.primary_label === 'Tell Us You’re Interested', 'V8 hero primary CTA is incorrect');
assert(v8.homepage.hero.primary_url === '#interest', 'V8 hero primary CTA must target #interest');
assert(v8.homepage.hero.secondary_label === 'See How a Circle Works', 'V8 hero secondary CTA is incorrect');
assert(v8.homepage.hero.logistics.includes('Four weeks'), 'V8 hero logistics must say Four weeks');
assert(v8.homepage.practice_bridge.outcomes.includes('Happiness'), 'V8 outcome line must include Happiness');
assert(v8.homepage.gifts.items.length > 0, 'V8 practice list must contain the migrated content');
assert(v8.homepage.gifts.items.every((item) => item.id), 'V8 practice cards must have stable IDs');
assert(v8.homepage.finding_home.logistics.every((item) => item.id), 'Finding Home logistics must have stable IDs');
assert(v8.homepage.section_order.every((item) => item.id && typeof item.enabled === 'boolean'), 'Homepage order entries must have stable IDs and visibility');
assert(new Set(v8.homepage.section_order.map((item) => item.id)).size === v8.homepage.section_order.length, 'Homepage order contains duplicate IDs');
assert(Array.isArray(v8.homepage.custom_sections), 'V8 custom section library must be available');
assert(v8.circles.comparison.rows.length > 0, 'V8 Circles comparison must retain migrated rows');
assert(index.includes('class="v6-hero"'), 'Generated homepage is missing the approved V6 hero');
assert(index.includes(v8.homepage.hero.headline), 'Generated homepage is missing the V8 hero headline from source');
assert(index.includes(v8.homepage.hero.primary_label), 'Generated homepage is missing the V8 primary CTA from source');
assert(index.includes(v8.homepage.finding_home.heading), 'Generated homepage is missing Finding Home source content');
assert(index.includes('Exercises for the Heart and Mind'), 'Generated homepage is missing the approved practice bridge');
assert(index.includes('Happiness'), 'Generated homepage is missing the happiness outcome');
for (const item of v8.homepage.gifts.items.filter((entry) => entry.enabled !== false)) {
  assert(index.includes(item.title), `Generated homepage is missing V8 practice ${item.id}`);
}
assert(index.includes(v8.homepage.difference.heading), 'Generated homepage is missing Circle differentiation source content');
assert(index.includes('Does any of this feel familiar?'), 'Generated homepage is missing the approved recognition heading');
assert(index.includes('Any one of these is enough to begin.'), 'Generated homepage is missing the recognition closing line');
assert(index.includes('v6-journey-benefit'), 'Generated homepage is missing the approved Journey benefit panel');
assert(index.includes('Take the 5-Minute Spiritual Journey Reflection'), 'Journey CTA copy is incorrect');
assert(index.includes('What are Christian meditation and contemplative prayer?'), 'Homepage FAQ is missing meditation/contemplation question');
assert(index.includes('Do you draw from traditions outside Christianity?'), 'Homepage FAQ is missing outside-traditions question');
assert(index.includes('Why is a conversation required before joining a Circle?'), 'Homepage FAQ is missing conversation question');
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
for (const component of ['text_image','image_text','full_image','editorial','callout','quote','card_grid','icon_grid','cta','comparison','video','divider','spacer']) {
  assert(v8Cms.includes(`name: ${component}`), `V8 CMS is missing custom component ${component}`);
}
assert(v8Cms.includes('name: section_order'), 'V8 CMS is missing Homepage Section Order');
assert(v8Preview.includes("registerPreviewTemplate('v8_front_door'"), 'V8 CMS preview is not registered');
assert(v8Renderer.includes('repeat(auto-fit,minmax'), 'V8 repeatable grids are not count-flexible');
const orderedPositions = v8.homepage.section_order.filter((item) => item.enabled).map((item) => {
  const markers = { hero: 'class="v6-hero"', recognition: 'class="v6-recognition', practice_bridge: 'class="v6-practice', gifts: 'class="v6-gifts', difference: 'class="v6-circle', finding_home: 'class="v6-finding', journey: 'class="v6-journey', founder: 'class="v6-founder', fit: 'class="v6-fit', interest: 'id="interest"', faq: 'id="faq"' };
  return markers[item.id] ? index.indexOf(markers[item.id]) : -1;
}).filter((position) => position >= 0);
assert(orderedPositions.every((position, i) => i === 0 || position > orderedPositions[i - 1]), 'Generated homepage does not follow V8 section order');
assert(!await exists('scripts/apply-v8-front-door.mjs'), 'Obsolete post-build V8 override script still exists');
assert(!await exists('scripts/v8-front-door.mjs'), 'Duplicate legacy V8 renderer still exists');
console.log('Homeward V8/V6 production verification passed.');
