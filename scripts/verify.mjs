import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFile(path.join(root, p), 'utf8');
const exists = async (p) => { try { await fs.stat(path.join(root, p)); return true; } catch { return false; } };
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const pkg = JSON.parse(await read('package.json'));
const v8 = JSON.parse(await read('content/v8.json'));
const practicesV8 = JSON.parse(await read('content/practices-v8.json'));
const index = await read('dist/index.html');
const circles = await read('dist/circles.html');
const practices = await read('dist/practices.html');
const resources = await read('dist/resources.html');
const lead = await read('netlify/functions/lead.mjs');
const redirects = await read('_redirects');

assert(pkg.scripts.build.includes('scripts/build.mjs'), 'Build script must continue through scripts/build.mjs');
assert(pkg.scripts.build.includes('v8-build-hook.mjs'), 'Build script must include the V8 source renderer hook');
assert(!pkg.scripts.build.includes('apply-v8-front-door.mjs'), 'Legacy post-build V8 override is still wired into the build');
assert(await exists('scripts/render-v8-home-v6.mjs'), 'Approved V6 homepage renderer is missing');
assert(await exists('assets/v8-home-v6.css'), 'Approved V6 homepage stylesheet is missing');
assert(await exists('scripts/render-v8-circles-primary.mjs'), 'Primary V8 Circles renderer is missing');
assert(await exists('assets/v8-circles-primary.css'), 'Primary V8 Circles stylesheet is missing');
assert(await exists('scripts/render-v8-practices-primary.mjs'), 'Primary V8 Practices renderer is missing');
assert(await exists('assets/v8-practices-primary.css'), 'Primary V8 Practices stylesheet is missing');
assert(await exists('content/practices-v8.json'), 'V8 Practices content source is missing');
assert(v8.homepage.hero.primary_label === 'Tell Us You’re Interested', 'V8 hero primary CTA is incorrect');
assert(v8.homepage.hero.primary_url === '#interest', 'V8 hero primary CTA must target #interest');
assert(v8.homepage.hero.secondary_label === 'See How a Circle Works', 'V8 hero secondary CTA is incorrect');
assert(v8.homepage.hero.logistics.includes('Four weeks'), 'V8 hero logistics must say Four weeks');
assert(v8.homepage.practice_bridge.outcomes.includes('Happiness'), 'V8 outcome line must include Happiness');
assert(v8.homepage.gifts.items.length === 4, 'V8 Four Gifts must contain exactly four practices');
assert(v8.homepage.difference.questions.length === 4, 'V8 Circle differentiation must contain four reflection questions');
assert(index.includes('class="v6-hero"'), 'Generated homepage is missing the approved V6 hero');
assert(index.includes(v8.homepage.hero.headline), 'Generated homepage is missing the V8 hero headline from source');
assert(index.includes(v8.homepage.hero.primary_label), 'Generated homepage is missing the V8 primary CTA from source');
assert(index.includes(v8.homepage.finding_home.heading), 'Generated homepage is missing Finding Home source content');
assert(index.includes('Exercises for the Heart and Mind'), 'Generated homepage is missing the approved practice bridge');
assert(index.includes('Happiness'), 'Generated homepage is missing the happiness outcome');
assert(index.includes(v8.homepage.gifts.items[3].title), 'Generated homepage is missing the fourth V8 practice');
assert(index.includes(v8.homepage.difference.heading), 'Generated homepage is missing Circle differentiation source content');
assert(index.includes('Does any of this feel familiar?'), 'Generated homepage is missing the approved recognition heading');
assert(index.includes('Any one of these is enough to begin.'), 'Generated homepage is missing the recognition closing line');
assert(index.includes('v6-journey-benefit'), 'Generated homepage is missing the approved Journey benefit panel');
assert(index.includes('Take the 5-Minute Spiritual Journey Reflection'), 'Journey CTA copy is incorrect');
assert(index.includes('What are Christian meditation and contemplative prayer?'), 'Homepage FAQ is missing meditation/contemplation question');
assert(index.includes('Do you draw from traditions outside Christianity?'), 'Homepage FAQ is missing outside-traditions question');
assert(index.includes('Why is a conversation required before joining a Circle?'), 'Homepage FAQ is missing conversation question');

assert(circles.includes('v8-circles-primary.css'), 'Generated Circles page is missing the primary Circles stylesheet');
assert(circles.includes('Not just another small group.'), 'Generated Circles page is missing the approved hero');
assert(circles.includes('Practice. Live it. Come back. Go deeper.'), 'Generated Circles page is missing the Circle Loop');
assert(circles.includes('More Joy &amp; Happiness'), 'Generated Circles page is missing the joy and happiness benefit');
assert(circles.includes('Homeward is ongoing. Circles move in four-week seasons.'), 'Generated Circles page is missing the season framing');
assert(circles.includes('A guided 90 minutes with an engaging, unhurried pace.'), 'Generated Circles page is missing the agenda');
assert(circles.includes('See a full sample gathering: Week One'), 'Generated Circles page is missing the expandable sample gathering');
assert(circles.includes('Same desire for community. A different center of gravity.'), 'Generated Circles page is missing the approved small-group comparison');
assert(circles.includes('How joining a Circle works'), 'Generated Circles page is missing the three-step joining process');
assert(circles.includes('You may feel at home if'), 'Generated Circles page is missing the positive fit panel');
assert(circles.includes('A Circle may not be the best fit if'), 'Generated Circles page is missing the not-fit panel');
assert(circles.includes('href="/#interest"'), 'Circles page interest CTAs must use the existing homepage interest form');
assert(circles.includes('href="/connect.html"'), 'Circles page must link to the conversation page');
assert(circles.includes('Practice the way. Explore honestly. Carry it into life.'), 'Circles page is missing the approved closing signature');

assert(practices.includes('v8-practices-primary-css'), 'Generated Practices page is missing the primary Practices stylesheet');
assert(practices.includes(practicesV8.hero.heading), 'Generated Practices page is missing the approved hero heading');
assert(practices.includes(practicesV8.hero.emphasis), 'Generated Practices page is missing the hero emphasis');
assert(practices.includes('Spiritual practices are exercises for the heart and mind.'), 'Generated Practices page is missing Why Practice Matters');
assert(practices.includes('Joy &amp; Happiness'), 'Generated Practices page is missing the joy and happiness benefit');
assert(practices.includes('10</strong><span>MINUTES A DAY'), 'Generated Practices page is missing the 10-minutes-a-day research feature');
assert(practices.includes('47 trials'), 'Generated Practices page is missing the stress research card');
assert(practices.includes('111 RCTs'), 'Generated Practices page is missing the cognition research card');
assert(practices.includes('24,804 people'), 'Generated Practices page is missing the gratitude research card');
assert(practices.includes('22% less'), 'Generated Practices page is missing the connection research card');
assert(practices.includes('What we repeat becomes easier to return to.'), 'Generated Practices page is missing the formation progression');
assert(practicesV8.library.items.every((item) => practices.includes(item.title)), 'Generated Practices page is missing one or more practice cards');
assert(!practices.includes('Settle your body and become aware of your breathing.'), 'Practices overview should not include step-by-step practice instructions');
assert(practices.includes('You can practice alone. Community helps the practice go deeper.'), 'Generated Practices page is missing the community section');
assert(practices.includes('href="/circles.html"'), 'Practices page must link to the primary Circles page');
assert(practices.includes('href="/#interest"'), 'Practices page must link to the existing interest form');
assert(practices.includes('href="/resources.html"'), 'Practices page must link to Resources');

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
console.log('Homeward V8/V6 production verification passed.');
