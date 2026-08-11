import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFile(path.join(root, p), 'utf8');
const exists = async (p) => { try { await fs.stat(path.join(root, p)); return true; } catch { return false; } };
const assert = (ok, message) => { if (!ok) throw new Error(message); };

const [index,circles,practices,about,lead,deployedCms,runtimeConfig] = await Promise.all([
  read('dist/index.html'), read('dist/circles.html'), read('dist/practices.html'), read('dist/about.html'),
  read('netlify/functions/lead.mjs'), read('dist/admin/config.yml'), read('dist/admin/runtime-config.js'),
]);

const questions = [
  'You still feel drawn to God—or to the life and way of Jesus—but carry questions or doubts you have never been able to resolve?',
  'You long to experience God—or a Higher Power—more deeply, not simply gather more religious information?',
  'You want spiritual practices that help you become more present, peaceful, loving, and awake in everyday life?',
  'You are looking for a community where people learn from one another without being required to reach all the same conclusions?',
];
for (const q of questions) assert(index.includes(q), `Homepage recognition question missing: ${q}`);
assert(index.includes('recognition-grid-four'), 'Homepage is missing the four-question recognition layout');
assert(index.includes("Let's Talk"), 'Homepage header is missing Let’s Talk');
assert(!index.includes('class="mobile-sticky"'), 'Persistent mobile interest bar should not be present');
assert(index.includes('menu-button'), 'Homepage mobile menu button is missing');
assert(index.includes('Not just another small group. A place to practice.'), 'Homepage Circle framing is missing');
assert(index.includes('Three simple steps. No pressure.'), 'Homepage joining process is missing');
assert(index.includes('Spiritual practices: exercises for the heart and mind.'), 'Homepage practice framing is missing');
assert(index.includes('Tell us you’re interested.'), 'Homepage interest form heading is missing');
assert(index.includes('Where are you on your spiritual journey?'), 'Homepage Journey Reflection is missing');

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

// The tiny review thumbnails caused soft/broken-looking renders on phones. Launch pages
// should resolve to full-size site imagery instead.
for (const html of [index,circles,practices]) {
  assert(!html.includes('/assets/review/practices/'), 'A launch page still references a low-resolution practice review thumbnail');
}

const pages = { index, circles, practices, about };
for (const [page, html] of Object.entries(pages)) {
  const refs = [...html.matchAll(/(?:src|href)=["'](\/assets\/[^"'#?]+|assets\/[^"'#?]+)["']/g)].map((m)=>m[1].replace(/^\//,''));
  for (const ref of new Set(refs)) assert(await exists(ref), `${page} references missing asset: ${ref}`);
}

assert(deployedCms.includes('name: v8_front_door'), 'Generated CMS is missing the V8 collection');
assert(runtimeConfig.includes('window.__HOMEWARD_CMS_BRANCH'), 'CMS runtime branch selection is missing');
assert(await exists('admin/v8-collection.yml'), 'V8 CMS schema is missing');
assert(await exists('docs/V8_LAUNCH_READINESS.md'), 'Launch-readiness handoff is missing');

console.log('Homeward V8 launch-candidate verification passed.');
