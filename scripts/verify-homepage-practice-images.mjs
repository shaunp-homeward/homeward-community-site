import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = await fs.readFile(path.join(root, 'dist', 'index.html'), 'utf8');
const v8 = JSON.parse(await fs.readFile(path.join(root, 'content', 'v8.json'), 'utf8'));
const hook = await fs.readFile(path.join(root, 'scripts', 'v8-build-hook.mjs'), 'utf8');
const assert = (ok, message) => { if (!ok) throw new Error(message); };

const match = index.match(/<section\b[^>]*class=["'][^"']*\bhome-practices\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i);
assert(match, 'Homepage practice section is missing');
const section = match[0];
const gifts = (v8.homepage?.gifts?.items || []).filter((item) => item && item.enabled !== false).slice(0, 4);
assert(gifts.length === 4, 'Homepage CMS must provide four enabled practice cards');
assert(!hook.includes('homepagePracticeImageMap'), 'Homepage still contains a hidden post-render practice image map');
assert(!hook.includes("replaceImagesInSection(data, 'home-practices'"), 'Homepage still replaces CMS-selected practice images after render');

const validImage = (bytes) => {
  const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.length >= 8 && bytes.subarray(1, 4).toString('ascii') === 'PNG';
  const webp = bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  return jpeg || png || webp;
};

for (const item of gifts) {
  const title = item.title || item.id || 'unnamed practice';
  const src = item.image || '';
  assert(src.startsWith('/assets/'), `Homepage CMS image path is invalid: ${title}`);
  assert(section.includes(title), `Homepage practice card missing: ${title}`);
  assert(section.includes(`src="${src}"`), `Rendered homepage does not use the CMS-selected image for: ${title}`);

  const relative = src.replace(/^\//, '');
  const asset = path.join(root, 'dist', relative);
  const bytes = await fs.readFile(asset).catch(() => { throw new Error(`CMS-selected homepage image is missing from deploy: ${src}`); });
  assert(bytes.length > 10000, `CMS-selected homepage image is suspiciously small and may pixelate: ${src}`);
  assert(validImage(bytes), `CMS-selected homepage image is not a valid JPEG, PNG, or WebP file: ${src}`);
}

console.log('Homepage practice image verification passed: rendered card images match CMS selections directly and use valid production-size assets.');
