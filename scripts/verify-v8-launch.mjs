import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFile(path.join(root, p), 'utf8');
const exists = async (p) => { try { await fs.stat(path.join(root, p)); return true; } catch { return false; } };
const assert = (ok, message) => { if (!ok) throw new Error(message); };

const [index,circles,practices,about,lead,deployedCms,runtimeConfig,sharedCss,globalCopy] = await Promise.all([
  read('dist/index.html'), read('dist/circles.html'), read('dist/practices.html'), read('dist/about.html'),
  read('netlify/functions/lead.mjs'), read('dist/admin/config.yml'), read('dist/admin/runtime-config.js'),
  read('dist/assets/v8-shared-shell.css'), read('content/global.json'),
]);

const questions = [
  'You still feel drawn to God—or to the life and way of Jesus—but carry questions or doubts you have never been able to resolve?',
  'You long to experience God—or a Higher Power—more deeply, not simply gather more religious information?',
  'You want spiritual practices that help you become more present, peaceful, loving, and awake in everyday life?',
  'You are looking for a community where people learn from one another without being required to reach all the same conclusions?',
];
for (const q of questions) assert(index.includes(q), `Homepage recognition question missing: ${q}`);
assert(index.includes('recognition-grid-four'), 'Homepage is missing the four-question recognition layout');
assert(index.includes('You do not need settled beliefs—only an honest desire to explore, practice, and grow.'), 'Homepage recognition closing line is missing');

const pages = { index, circles, practices, about };
for (const [page, html] of Object.entries(pages)) {
  assert(html.includes('v8-site-header'), `${page} is missing the canonical shared header`);
  assert(html.includes('/assets/v8-shared-shell.css'), `${page} is missing shared-shell CSS`);
  assert(html.includes('/assets/v8-shared-shell.js'), `${page} is missing shared-shell JS`);
  assert(html.includes('Have a Conversation'), `${page} mobile navigation is missing the full conversation CTA`);
  assert(html.includes('Tell Us You’re Interested'), `${page} mobile navigation is missing the primary interest CTA`);
}
assert(index.includes('class="v8-header-cta" href="/#interest"'), 'Homepage header is not using interest as the primary conversion CTA');
for (const html of [circles,practices,about]) assert(html.includes('Let’s Talk'), 'Secondary page header is missing the compact Let’s Talk CTA');
assert(index.includes('href="/" class="is-active" aria-current="page"'), 'Homepage Home navigation is not active');
assert(circles.includes('href="/circles.html" class="is-active" aria-current="page"'), 'Circles navigation is not active');
assert(practices.includes('href="/practices.html" class="is-active" aria-current="page"'), 'Practices navigation is not active');
assert(about.includes('href="/about.html" class="is-active" aria-current="page"'), 'Our Story navigation is not active');

assert(sharedCss.includes('--hw-copper:#B53A2A'), 'Shared brand shell is missing exact Homeward copper #B53A2A');
assert(!sharedCss.toLowerCase().includes('#b35a2a'), 'Shared brand shell contains the obsolete redder copper #B35A2A');
assert(!globalCopy.toLowerCase().includes('primary_color=b35a2a'), 'Calendly still contains the obsolete copper');
assert(globalCopy.toLowerCase().includes('primary_color=b53a2a'), 'Calendly does not use approved copper');

const generatedTextExtensions = new Set(['.html','.css','.js','.json','.svg','.xml','.txt']);
const obsoleteColorHits = [];
async function scanGenerated(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { await scanGenerated(full); continue; }
    if (!generatedTextExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const text = await fs.readFile(full, 'utf8');
    if (/#b35a2a/i.test(text) || /rgba\(179\s*,\s*90\s*,\s*42\s*,/i.test(text) || /rgb\(179\s*,\s*90\s*,\s*42\s*\)/i.test(text)) {
      obsoleteColorHits.push(path.relative(path.join(root,'dist'), full));
    }
  }
}
await scanGenerated(path.join(root,'dist'));
assert(obsoleteColorHits.length === 0, `Generated site still contains obsolete copper in: ${obsoleteColorHits.join(', ')}`);

assert(!index.includes('class="mobile-sticky"'), 'Persistent mobile interest bar should not be present');
assert(index.includes('Ancient practices. Everyday change.'), 'Homepage practice framing is missing');
assert(index.includes('Explore Practices + Research'), 'Homepage practices CTA is missing');
assert(index.includes('See the Practice Library'), 'Homepage practice-library CTA is missing');
assert(index.includes('Not just another small group. A place to practice.'), 'Homepage Circle framing is missing');
assert(index.includes('Practice together') && index.includes('Explore honestly') && index.includes('Carry it into life'), 'Homepage three-pillar Circle framing is incomplete');
assert(!index.includes('class="join-path section"'), 'Standalone joining section should have been removed from the homepage');
assert(index.includes('Three simple steps. No pressure.'), 'Joining process is missing from the final interest section');
assert(index.includes('Spiritual practices: exercises for the heart and mind.'), 'Homepage practice framing is missing');
assert(index.includes('Where are you on your spiritual journey?'), 'Homepage Journey Reflection is missing');

const weekChecks = [
  ['Learn to Return','Luke 15:1–7','Breath Prayer → Light of Christ'],
  ['Share the Journey','John 4:4–26','Maranatha → Gratitude Meditation'],
  ['Open to Presence','John 1:1–15','Breath Prayer → Inspired Reading → Light of Christ'],
  ['Carry It Into Life','John 15:1–17','Centering Prayer + Daily Reflection'],
];
for (const [title, scripture, practice] of weekChecks) {
  assert(index.includes(title), `Finding Home week missing: ${title}`);
  assert(index.includes(scripture), `Finding Home scripture missing: ${scripture}`);
  assert(index.includes(practice), `Finding Home practice missing: ${practice}`);
}

const hierarchy = [
  'class="recognition section"',
  'class="home-practices section"',
  'class="circle-different section"',
  'class="season-wrap section-tight"',
  'class="fit section-tight"',
  'class="founder founder-feature section"',
  'class="interest section v9-interest"',
  'class="journey"',
  'class="faq section warm-section"',
];
let last = -1;
for (const marker of hierarchy) {
  const pos = index.indexOf(marker);
  assert(pos > last, `Homepage hierarchy is out of order at ${marker}`);
  last = pos;
}

for (const field of ['firstName','lastName','email','zip','gathering_preference','draw','newsletter']) {
  assert(index.includes(`name="${field}"`), `Homepage form field ${field} is missing`);
}
for (const key of ['AIRTABLE_TOKEN','AIRTABLE_BASE_ID','AIRTABLE_TABLE_ID','RESEND_API_KEY']) {
  assert(lead.includes(key), `Lead function is missing ${key}`);
}

assert(circles.includes('Not just another small group.'), 'Circles primary page is missing');
assert(circles.includes('How joining a Circle works'), 'Circles joining flow is missing');
assert(circles.includes('/assets/v8-launch-image-qa.css'), 'Circles image QA stylesheet is missing');
assert(practices.includes('Train the inner life.'), 'Practices primary page is missing');
assert(practices.includes('10</strong><span>MINUTES A DAY'), 'Practices research section is missing');
assert(practices.includes('/assets/v8-launch-image-qa.css'), 'Practices image QA stylesheet is missing');
assert(about.includes('I went looking for a faith I could actually live.'), 'Our Story primary page is missing');
assert(about.includes('/assets/v8-launch-image-qa.css'), 'Our Story image QA stylesheet is missing');

for (const html of [index,circles,practices]) {
  assert(!html.includes('/assets/review/practices/'), 'A launch page still references a low-resolution practice review thumbnail');
}

for (const [page, html] of Object.entries(pages)) {
  const refs = [...html.matchAll(/(?:src|href)=["'](\/assets\/[^"'#?]+|assets\/[^"'#?]+)["']/g)].map((m)=>m[1].replace(/^\//,''));
  for (const ref of new Set(refs)) assert(await exists(ref), `${page} references missing asset: ${ref}`);
}

assert(await exists('assets/library'), 'Reusable image library folder is missing');
assert(await exists('assets/library/IMAGE_LIBRARY.md'), 'Image library inventory is missing');
assert(deployedCms.includes('name: v8_front_door'), 'Generated CMS is missing the V8 collection');
assert(runtimeConfig.includes('window.__HOMEWARD_CMS_BRANCH'), 'CMS runtime branch selection is missing');
assert(await exists('admin/v8-collection.yml'), 'V8 CMS schema is missing');
assert(await exists('docs/V8_LAUNCH_READINESS.md'), 'Launch-readiness handoff is missing');
assert(await exists('FINAL_LAUNCH_CANDIDATE_MANIFEST.md'), 'Final launch-candidate manifest is missing');

console.log('Homeward V8 staging hierarchy verification passed.');
