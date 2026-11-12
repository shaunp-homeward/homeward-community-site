import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routes = JSON.parse(await fs.readFile(path.join(root, 'src/v17/routes.json')));
const production = process.argv.includes('--production');
const releasePreview = process.argv.includes('--release-preview');
const release = production || releasePreview;
const origin = (process.env.HOMEWARD_SITE_URL || 'https://homewardcharities.org').replace(/\/$/, '');
const out = path.join(root, production ? 'dist-v17-production' : releasePreview ? 'dist-v17-preview' : 'dist-v17');
let links = 0;
for (const { id, route } of routes) {
  const html = await fs.readFile(path.join(out, route, 'index.html'), 'utf8');
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${id}: one primary heading`);
  assert(!html.includes('{{'), `${id}: unresolved content`);
  assert(!/data-page=|page-choice|page-review|history.replaceState/.test(html), `${id}: prototype navigation removed`);
  assert(html.includes(production ? 'content="index,follow"' : 'content="noindex,nofollow"'), `${id}: correct index policy`);
  if (production) assert(html.includes(`rel="canonical" href="${origin}${route}"`), `${id}: canonical URL`);
  if (release) {
    assert(!/Not approved for publication|Review draft|reference-status/.test(html), `${id}: reference-only content excluded`);
  }
  assert(html.includes('aria-controls="site-navigation"'), `${id}: mobile navigation target`);
  for (const [, attr, url] of html.matchAll(/\b(href|src)="(\/[^"#?]*)"/g)) {
    if (attr === 'href' && url === '/#main') continue;
    const target = path.join(out, url.endsWith('/') ? `${url}index.html` : url);
    await fs.access(target).catch(() => { throw new Error(`${id}: missing ${attr} target ${url}`); });
    links++;
  }
  for (const image of html.matchAll(/<img\b[^>]*>/g)) assert(/\balt="[^"]+"/.test(image[0]), `${id}: image description`);
}
const practices = await fs.readFile(path.join(out, 'practices/index.html'), 'utf8');
if (release) {
  assert(!/\d[\d–-]*%/.test(practices), 'Unsupported numerical outcome claims excluded');
  assert(practices.includes('Homeward does not promise numerical improvements'), 'Public research context');
} else {
  assert(/class="reference-status"/.test(practices) && practices.includes('remain unverified. Not approved for publication.'), 'Research status must remain visible');
  assert(practices.includes('Research details &amp; verification status'), 'Research details retained');
}
const talk = await fs.readFile(path.join(out, 'lets-talk/index.html'), 'utf8');
assert(talk.includes('calendly.com/shaunpennington/30min'), 'Correct scheduling destination');
assert(talk.includes('A few things to think about before we meet'), 'Meeting preparation retained');
const config = JSON.parse(await fs.readFile(path.join(out, 'admin/config.yml')));
assert.equal(config.backend.repo, 'shaunp-homeward/homeward-community-site');
assert.equal(config.backend.branch, release ? 'staging' : 'feature/homeward-v17');
assert.equal(config.local_backend, false, 'No unauthenticated local backend in hosted output');
assert.equal(config.publish_mode, 'editorial_workflow');
assert.equal(config.collections[0].files.length, 9);
if (production) {
  const sitemap = await fs.readFile(path.join(out, 'sitemap.xml'), 'utf8');
  for (const { route } of routes) assert(sitemap.includes(`${origin}${route}</loc>`), 'Sitemap route missing');
  const headers = await fs.readFile(path.join(out, '_headers'), 'utf8');
  assert(!headers.split('/admin/')[0].includes('noindex'), 'Production must not be noindexed');
}
console.log(`Verified ${routes.length} ${production ? 'production' : 'staging'} routes, ${links} local links/assets, research context, scheduling and CMS configuration.`);
