import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = await fs.readFile(path.join(root, 'dist', 'index.html'), 'utf8');
const v8 = JSON.parse(await fs.readFile(path.join(root, 'content', 'v8.json'), 'utf8'));
const assert = (ok, message) => { if (!ok) throw new Error(message); };

const match = index.match(/<section\b[^>]*class=["'][^"']*\bhome-practices\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i);
assert(match, 'Homepage practice section is missing');
const section = match[0];
const gifts = (v8.homepage?.gifts?.items || []).filter((item) => item && item.enabled !== false).slice(0, 4);
assert(gifts.length === 4, 'Homepage CMS must provide four enabled practice cards');

const legacyMap = new Map([
  ['/assets/review/practices/BP-A.jpg', '/assets/practices/home-breath-prayer.webp'],
  ['/assets/review/practices/BP-H.jpg', '/assets/practices/home-gratitude.webp'],
  ['/assets/review/practices/LC-B.jpg', '/assets/practices/home-light-of-christ.webp'],
  ['/assets/review/practices/SE-G.jpg', '/assets/practices/home-scripture-encounter.webp'],
]);

const validImage = (bytes) => {
  const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.length >= 8 && bytes.subarray(1, 4).toString('ascii') === 'PNG';
  const webp = bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  return jpeg || png || webp;
};

for (const item of gifts) {
  const title = item.title || item.id || 'unnamed practice';
  const cmsSrc = item.image || '';
  const renderedSrc = legacyMap.get(cmsSrc) || cmsSrc;
  assert(cmsSrc.startsWith('/assets/'), `Homepage CMS image path is invalid: ${title}`);
  assert(section.includes(title), `Homepage practice card missing: ${title}`);
  assert(section.includes(`src="${renderedSrc}"`), `Rendered homepage does not honor the CMS image selection/compatibility path for: ${title}`);

  const relative = renderedSrc.replace(/^\//, '');
  const asset = path.join(root, 'dist', relative);
  const bytes = await fs.readFile(asset).catch(() => { throw new Error(`Rendered homepage image is missing from deploy: ${renderedSrc}`); });
  assert(bytes.length > 10000, `Rendered homepage image is suspiciously small and may pixelate: ${renderedSrc}`);
  assert(validImage(bytes), `Rendered homepage image is not a valid JPEG, PNG, or WebP file: ${renderedSrc}`);
}

for (const obsolete of [
  '/assets/living-awake/contemplative-room.webp',
  '/assets/sacred-search/path-sunrise.webp',
  '/assets/honest-questions/opening-light.webp',
  '/assets/new-foundations/quiet-reading-room.webp',
]) {
  assert(!section.includes(obsolete), `Homepage practice section still contains an obsolete QA substitution: ${obsolete}`);
}

console.log('Homepage practice image verification passed: legacy CMS thumbnails resolve to approved production masters, and new CMS image paths pass through unchanged.');
