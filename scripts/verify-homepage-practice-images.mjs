import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = await fs.readFile(path.join(root, 'dist', 'index.html'), 'utf8');
const assert = (ok, message) => { if (!ok) throw new Error(message); };

const match = index.match(/<section\b[^>]*class=["'][^"']*\bhome-practices\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i);
assert(match, 'Homepage practice section is missing');
const section = match[0];

const expected = [
  ['Breath Prayer', '/assets/practices/home-breath-prayer.webp'],
  ['Gratitude', '/assets/practices/home-gratitude.webp'],
  ['Light of Christ', '/assets/practices/home-light-of-christ.webp'],
  ['Scripture as Encounter', '/assets/practices/home-scripture-encounter.webp'],
];

for (const [title, src] of expected) {
  assert(section.includes(title), `Homepage practice card missing: ${title}`);
  assert(section.includes(src), `Homepage practice card is not using production master: ${title}`);
  const asset = path.join(root, src.replace(/^\//, ''));
  await fs.stat(asset).catch(() => { throw new Error(`Production practice image is missing: ${src}`); });
}

for (const obsolete of [
  '/assets/living-awake/contemplative-room.webp',
  '/assets/sacred-search/path-sunrise.webp',
  '/assets/honest-questions/opening-light.webp',
  '/assets/new-foundations/quiet-reading-room.webp',
]) {
  assert(!section.includes(obsolete), `Homepage practice section still contains obsolete QA substitution: ${obsolete}`);
}

console.log('Homepage practice image verification passed: CMS-selected visuals use production masters.');
