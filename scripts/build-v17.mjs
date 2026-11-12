import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPublicPractices } from '../src/v17/production-benefits.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const production = process.argv.includes('--production');
const releasePreview = process.argv.includes('--release-preview');
const release = production || releasePreview;
const origin = 'https://homewardcharities.org';
const out = path.join(root, production ? 'dist-v17-production' : releasePreview ? 'dist-v17-preview' : 'dist-v17');
const read = (p) => fs.readFile(path.join(root, p), 'utf8');
const json = async (p) => JSON.parse(await read(p));
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const routes = await json('src/v17/routes.json');
const shared = await json('src/v17/shared.json');
const imageSizes = await json('src/v17/image-sizes.json');
const templates = {};
await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(path.join(out, 'assets/v17'), { recursive: true });
await fs.cp(path.join(root, 'assets/v17'), path.join(out, 'assets/v17'), { recursive: true });
await fs.copyFile(path.join(root, 'src/v17/site.css'), path.join(out, 'assets/v17/site.css'));
await fs.copyFile(path.join(root, 'src/v17/site.js'), path.join(out, 'assets/v17/site.js'));
await fs.cp(path.join(root, 'downloads'), path.join(out, 'downloads'), { recursive: true, filter: (p) => !p.endsWith('desktop.ini') });
// Retain the existing published privacy policy; update navigation only.
const privacy = (await read('privacy.html'))
  .replace('href="index.html#interest"', 'href="/lets-talk/"')
  .replace('contact form on our website', 'contact page on our website')
  .replaceAll('href="index.html#interest"', 'href="/lets-talk/"')
  .replace('<script defer="" src="edit-mode.js"></script>', '');
await fs.writeFile(path.join(out, 'privacy.html'), privacy);
await fs.mkdir(path.join(out, 'img'), { recursive: true });
for (const image of ['icon-forest.png', 'logo-ivory.png']) await fs.copyFile(path.join(root, 'img', image), path.join(out, 'img', image));

for (const { id, route } of routes) {
  const content = await json(`content/v17/${release && id === 'practices' ? 'practices-public-page' : id}.json`);
  let template = await read(`src/v17/pages/${id}.html`);
  if (release && id === 'practices') {
    const marker = '<section class="section benefit-section">';
    const start = template.indexOf(marker);
    const end = template.indexOf('</section>', start);
    if (start < 0 || end < 0) throw new Error('Cannot locate reference-only Practices section.');
    template = template.slice(0, start) + renderPublicPractices(await json('content/v17/public-practices.json')) + template.slice(end + '</section>'.length);
  }
  templates[id] = template;
  const values = Object.fromEntries(content.copy.map(({ key, html }) => [key, html]));
  for (const image of content.images) {
    values[`${image.key}_src`] = escape(image.src);
    values[`${image.key}_alt`] = escape(image.alt);
  }
  let body = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Missing ${id}.${key}`);
    return values[key];
  }).replace(/<img\b[^>]*>/g, (tag) => {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    const image = imageSizes[src];
    if (!image) return tag;
    const fallback = image.variants.find((v) => v.width >= 960) || image.variants.at(-1);
    return tag.replace(`src="${src}"`, `src="${fallback.src}" srcset="${image.variants.map((v) => `${v.src} ${v.width}w`).join(', ')}" sizes="(max-width: 720px) 100vw, 60vw" width="${image.width}" height="${image.height}"`);
  });
  body = body.replace('loading="lazy"', 'loading="eager" fetchpriority="high"');
  const header = shared.header.replaceAll(`href="${route}"`, `href="${route}" aria-current="page"`).replace('loading="lazy"', 'loading="eager"');
  const indexing = production ? `<meta name="robots" content="index,follow"><link rel="canonical" href="${origin}${route}"><meta property="og:type" content="website"><meta property="og:url" content="${origin}${route}"><meta property="og:title" content="${escape(content.title)}"><meta property="og:description" content="${escape(content.description)}">` : '<meta name="robots" content="noindex,nofollow">';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${indexing}<title>${escape(content.title)}</title><meta name="description" content="${escape(content.description)}"><link rel="icon" href="/assets/v17/image-14.png"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap"><link rel="stylesheet" href="/assets/v17/site.css"><script defer src="/assets/v17/site.js"></script></head><body><a href="#main" class="skip-link">Skip to content</a>${header}<main id="main">${body}</main>${shared.footer}<p class="illustration-note">Workshop images are AI-generated illustrations. Homeward’s original logo and Shaun’s original portrait are retained. <a href="/privacy.html">Privacy</a></p></body></html>`;
  const dest = path.join(out, route, 'index.html');
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, html);
}

await fs.writeFile(path.join(out, '404.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Page not found | Homeward</title><h1>Page not found</h1><p><a href="/">Return to Homeward</a></p></html>');
await fs.writeFile(path.join(out, 'robots.txt'), production ? `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
if (production) await fs.writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(({ route }) => `<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>`);
await fs.writeFile(path.join(out, '_headers'), `/*\n${production ? '' : '  X-Robots-Tag: noindex, nofollow\n'}  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/admin/*\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store\n`);
await fs.writeFile(path.join(out, '_redirects'), '/api/lead /.netlify/functions/lead 200\n/m/* /.netlify/functions/redirect 200\n/about /our-story/ 301\n/about.html /our-story/ 301\n/churches.html /for-leaders/ 301\n/connect /lets-talk/ 301\n/connect.html /lets-talk/ 301\n/circles /experiences/ 301\n/circles.html /experiences/ 301\n/practices.html /practices/ 301\n/vision /our-story/ 301\n/vision.html /our-story/ 301\n/resources /practices/ 301\n/resources.html /practices/ 301\n/* /404.html 404\n');

const fields = [
  { name: 'title', label: 'Search title', widget: 'string' },
  { name: 'description', label: 'Page description', widget: 'text' },
  { name: 'copy', label: 'Page copy', widget: 'list', allow_add: false, summary: '{{fields.label}}', fields: [
    { name: 'key', widget: 'hidden' }, { name: 'label', widget: 'hidden' },
    { name: 'html', label: 'Copy (preserve inline formatting)', widget: 'text' },
  ] },
  { name: 'images', label: 'Page images', widget: 'list', allow_add: false, required: false, summary: '{{fields.alt}}', fields: [
    { name: 'key', widget: 'hidden' }, { name: 'src', label: 'Image', widget: 'image' },
    { name: 'alt', label: 'Image description', widget: 'string' },
  ] },
];
const config = {
  backend: { name: 'github', repo: 'shaunp-homeward/homeward-community-site', branch: release ? 'staging' : 'feature/homeward-v17', squash_merges: true },
  local_backend: false, publish_mode: 'editorial_workflow', media_folder: 'assets/v17/uploads', public_folder: '/assets/v17/uploads',
  collections: [{ name: 'v17_pages', label: 'Homeward v1.7 pages', delete: false, files: routes.map(({ id, route }) => ({ name: id, label: id.charAt(0).toUpperCase() + id.slice(1), file: `content/v17/${release && id === 'practices' ? 'practices-public-page' : id}.json`, format: 'json', preview_path: route, fields })) }],
};
config.collections.push({
  name: 'public_practices', label: 'Public Practices panels', delete: false,
  files: [{ name: 'public_practices', label: 'Public Practices panels (release)', file: 'content/v17/public-practices.json', format: 'json', fields: [
    { name: 'heading', widget: 'string' }, { name: 'introduction', widget: 'text' },
    { name: 'panels', widget: 'list', allow_add: false, fields: [
      { name: 'title', widget: 'string' }, { name: 'theme', widget: 'hidden' },
      { name: 'heading', widget: 'string' }, { name: 'description', widget: 'text' },
    ] },
    { name: 'note', label: 'Research context', widget: 'text' },
  ] }],
});
await fs.mkdir(path.join(out, 'admin'), { recursive: true });
await fs.writeFile(path.join(out, 'admin/config.yml'), JSON.stringify(config, null, 2));
await fs.writeFile(path.join(out, 'admin/index.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Homeward v1.7 editor</title></head><body><script src="https://unpkg.com/decap-cms@3.9.0/dist/decap-cms.js"></script><script src="/admin/preview.js"></script></body></html>');
await fs.writeFile(path.join(out, 'admin/preview.js'), `const templates=${JSON.stringify(templates)};\nCMS.registerPreviewStyle('/assets/v17/site.css');\nfor(const id of Object.keys(templates))CMS.registerPreviewTemplate(id,({entry,getAsset})=>{const data=entry.get('data').toJS();const values=Object.fromEntries((data.copy||[]).map(x=>[x.key,x.html]));for(const i of data.images||[]){values[i.key+'_src']=String(getAsset(i.src));values[i.key+'_alt']=String(i.alt).replaceAll('"','&quot;');}const html=(templates[id]||'').replace(/\\{\\{(\\w+)\\}\\}/g,(_,k)=>values[k]||'');return window.h('main',{dangerouslySetInnerHTML:{__html:html}});});\n`);
console.log(`Built ${routes.length} v1.7 ${production ? 'production' : 'staging'} routes into ${path.basename(out)}; existing site previews unchanged.`);
