import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const report = [];
for (const [page, low, high, sections] of [['index.html',900,1100,8],['about.html',850,1000,5]]) {
  const html = await fs.readFile(path.join(root,'dist',page),'utf8');
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0];
  assert(main, `${page}: missing main`);
  const words = main.replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' ').trim().split(/\s+/).length;
  assert(words >= low && words <= high, `${page}: ${words} words outside ${low}–${high}`);
  assert.equal((main.match(/<section\b/g)||[]).length,sections);
  assert(html.includes('noindex,nofollow'), 'Preview must not be indexed');
  assert(!main.includes('campus'), 'Campus content belongs off these pages');
  assert(!/eight weeks|8 weeks|Circles are forming|Space is limited/i.test(main));
  assert(main.includes('four-week') && main.includes('three-session'));
  assert(main.includes('We gather to remember.'));
  assert(!html.includes('googletagmanager.com'), 'Staging analytics must stay disabled');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,'Duplicate IDs');
  for (const ref of html.matchAll(/(?:src|href)=["'](\/assets\/[^"'#?]+)["']/g)) {
    await fs.access(path.join(root,'dist',ref[1].slice(1)));
  }
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = match[1];
    if (/^https?:/.test(href)) continue;
    const [file,fragment] = href.split('#');
    const target = !file ? page : file === '/' ? 'index.html' : file.replace(/^\//,'');
    const content = await fs.readFile(path.join(root,'dist',target),'utf8');
    if (fragment) assert(content.includes(`id="${fragment}"`),`Broken link: ${href}`);
  }
  if (page === 'about.html') {
    assert.equal((main.match(/\/assets\/our-story\/family-seated.jpg/g)||[]).length,1);
    assert(!main.includes('homeward-family.jpg') && !main.includes('family-beach'));
  }
  report.push({page,mainWords:words,sections});
}
console.log(JSON.stringify(report,null,2));
console.log('Simplified review content, links, images, and staging checks passed.');
