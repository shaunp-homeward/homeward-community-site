import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const branch = process.env.HEAD || process.env.BRANCH || '';
const context = process.env.CONTEXT || 'local';
if (context !== 'production' && context !== 'local' && !['staging-homepage-layout-review-2026-10-07','staging-faith-practice-faq-2026-10-08'].includes(branch)) {
  console.log('Homepage layout review skipped outside its staging branch.');
} else {
  const dist = path.join(root,'dist');
  // Navigation stays consistent across the staging site; page-body edits are homepage-only.
  for (const file of await fs.readdir(dist)) {
    if (!file.endsWith('.html')) continue;
    const target = path.join(dist,file);
    let html = await fs.readFile(target,'utf8');
    if (!html.includes('v8-site-header')) continue;
    if (html.includes('/assets/homepage-layout-review.css')) continue;
    html = html.replace(/<header\b[\s\S]*?<\/header>/i, header => header
      .replaceAll('SPIRITUAL FORMATION FOR GROUPS','FORMATION FOR GROUPS')
      .replaceAll('For Churches &amp; Communities','For Churches')
      .replaceAll('For Churches & Communities','For Churches'));
    // The current homepage no longer has an interest section; keep the CTA actionable.
    html = html.replace(/href=["'](?:\/|index\.html)?#interest["']/g,'href="/connect.html"');
    html = html.replace(/<body\b([^>]*)>/i,(tag,attrs)=> attrs.includes('class=') ? tag.replace(/class="([^"]*)"/,(_,c)=>`class="${c} homepage-layout-review"`) : `<body${attrs} class="homepage-layout-review">`);
    const robots = context === 'production' ? '' : '<meta name="robots" content="noindex,nofollow">';
    html = html.replace('</head>',robots + '<link rel="stylesheet" href="/assets/homepage-layout-review.css?v=1"></head>');
    if (file === 'index.html') {
      const original = 'Your group may not need more content.<br/>It may need more practice.';
      if (!html.includes(original)) throw new Error('Current homepage recognition heading was not found.');
      html = html.replace(original,'<span class="hr-heading-line">Your group may not need more content.</span><span class="hr-heading-line">It may need more practice.</span>');
      html = html.replace('Keep your group.<br/><em>Deepen the experience.</em>','Keep your group. <em>Deepen the experience.</em>');
    }
    await fs.writeFile(target,html);
  }
  await fs.copyFile(path.join(root,'assets','homepage-layout-review.css'),path.join(dist,'assets','homepage-layout-review.css'));
  console.log('Applied screenshot-directed homepage layout review on staging only.');
}
