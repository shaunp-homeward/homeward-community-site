import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const about = await fs.readFile(path.join(dist, 'about.html'), 'utf8');
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const exists = async (file) => { try { await fs.stat(file); return true; } catch { return false; } };

const hrefs = [...about.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((m) => m[1]);
assert(hrefs.length > 0, 'Our Story contains no links');
assert(!hrefs.some((href) => /about-draft\d/i.test(href)), 'Our Story still links to a retired draft page');

for (const href of hrefs) {
  if (/^(mailto:|tel:)/i.test(href)) continue;
  if (/^https?:\/\//i.test(href)) {
    const u = new URL(href);
    assert(['http:','https:'].includes(u.protocol) && Boolean(u.hostname), `Invalid external URL: ${href}`);
    continue;
  }

  const [rawPath, fragment] = href.split('#');
  let targetHtml;
  if (!rawPath || rawPath === '/') targetHtml = 'index.html';
  else if (rawPath.endsWith('/')) targetHtml = `${rawPath.replace(/^\//,'')}index.html`;
  else targetHtml = rawPath.replace(/^\//,'');

  const targetPath = path.join(dist, targetHtml);
  assert(await exists(targetPath), `Broken Our Story link target: ${href} -> ${targetHtml}`);

  if (fragment) {
    const target = await fs.readFile(targetPath, 'utf8');
    const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert(new RegExp(`id=["']${escaped}["']`, 'i').test(target), `Broken Our Story anchor: ${href}`);
  }
}

assert(hrefs.includes('/#interest'), 'Our Story primary interest CTA is missing');
assert(hrefs.includes('/connect.html'), 'Our Story conversation CTA is missing');
assert(hrefs.some((href) => href.includes('linkedin.com/in/shaun-pennington')), 'Our Story LinkedIn link is missing');

console.log(`Our Story link verification passed (${hrefs.length} links checked).`);
