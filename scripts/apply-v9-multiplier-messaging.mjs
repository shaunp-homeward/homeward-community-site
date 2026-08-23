import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applySharedShell } from './render-v8-shared-shell.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const v9 = JSON.parse(await fs.readFile(path.join(root, 'content', 'v9-live.json'), 'utf8'));

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const sectionPattern = (className) => new RegExp(
  `<section\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/section>`,
  'i',
);

const addStylesheet = (html) => {
  if (html.includes('/assets/v9-multiplier-messaging.css')) return html;
  return html.replace('</head>', '<link rel="stylesheet" href="/assets/v9-multiplier-messaging.css?v=4">\n</head>');
};

const addChurchNav = (html, isChurchPage = false) => {
  const label = esc(v9.navigation.churches);
  const link = `<a href="/churches.html"${isChurchPage ? ' class="is-active" aria-current="page"' : ''}>${label}</a>`;
  const inject = (navClass, source) => source.replace(
    new RegExp(`(<nav\\b[^>]*class=["'][^"']*\\b${navClass}\\b[^"']*["'][^>]*>)([\\s\\S]*?)(<\\/nav>)`, 'i'),
    (match, open, inner, close) => {
      if (inner.includes('/churches.html')) return match;
      const practicesLink = /(<a\b[^>]*href=["']\/practices\.html["'][^>]*>[\s\S]*?<\/a>)/i;
      if (practicesLink.test(inner)) return `${open}${inner.replace(practicesLink, `$1${link}`)}${close}`;
      if (inner.includes('v8-mobile-actions')) {
        return `${open}${inner.replace(/(<div\b[^>]*class=["'][^"']*\bv8-mobile-actions\b)/i, `${link}$1`)}${close}`;
      }
      return `${open}${inner}${link}${close}`;
    },
  );
  let output = inject('v8-desktop-nav', html);
  output = inject('v8-mobile-nav', output);
  return output;
};

const updateHero = (html) => html.replace(sectionPattern('hero'), (section) => {
  const hero = v9.homepage.hero;
  let output = section;
  output = output.replace(
    /<h1>[\s\S]*?<\/h1>/i,
    `<h1>${esc(hero.headline)}<br/><span class="hero-accent">${esc(hero.emphasis)}</span></h1>`,
  );
  output = output.replace(
    /<p class="hero-lead">[\s\S]*?<\/p>/i,
    `<p class="hero-lead">${esc(hero.description)}</p>`,
  );
  return output;
});

const updatePractices = (html) => html.replace(sectionPattern('home-practices'), (section) => {
  const p = v9.homepage.practices;
  let output = section;
  output = output.replace(/<p class="eyebrow">[\s\S]*?<\/p>/i, `<p class="eyebrow">${esc(p.eyebrow)}</p>`);
  output = output.replace(/<h2>[\s\S]*?<\/h2>/i, `<h2>${esc(p.heading)}</h2>`);
  output = output.replace(/<p class="practices-subhead">[\s\S]*?<\/p>/i, `<p class="practices-subhead"><strong>${esc(p.subhead)}</strong></p>`);
  output = output.replace(
    /<p class="practices-lead">[\s\S]*?<\/p>/i,
    `<p class="practices-lead"><strong>${esc(p.lead_bold)}</strong> ${esc(p.lead_body)}</p>`,
  );
  const goal = `<p><strong>${esc(p.goal_bold)}</strong> ${esc(p.goal_body)}</p>`;
  output = output.replace(/<p>The goal is formation:[\s\S]*?<\/p>/i, goal);
  output = output.replace(/<p>The point is not to become good at meditation\.[\s\S]*?<\/p>/i, goal);
  return output;
});

const renderPartnerSection = () => {
  const p = v9.homepage.partner;
  const steps = p.steps.map((step) => `<article><span>${esc(step.number)}</span><h3>${esc(step.title)}</h3><p>${esc(step.description)}</p></article>`).join('');
  return `
<section class="v9-partner-section section" id="for-churches">
  <div class="shell">
    <div class="v9-partner-grid">
      <div class="v9-partner-copy">
        <p class="eyebrow">${esc(p.eyebrow)}</p>
        <h2>${esc(p.heading)}</h2>
        <p class="v9-partner-lead">${esc(p.lead)}</p>
        <p>${esc(p.body)}</p>
        <p class="v9-partner-callout"><strong>${esc(p.callout)}</strong></p>
        <p>${esc(p.after)}</p>
      </div>
      <div class="v9-partner-cards">${steps}</div>
    </div>
    <div class="v9-partner-action-row">
      <a class="button button-copper" href="/churches.html">${esc(p.primary_label)}</a>
      <a class="text-link light" href="/connect.html">${esc(p.secondary_label)} <span>→</span></a>
      <p class="v9-partner-meta">${esc(p.meta)}</p>
    </div>
  </div>
</section>`;
};

const injectPartnerSection = (html) => {
  if (html.includes('id="for-churches"')) return html;
  return html.replace(sectionPattern('season-wrap'), (section) => `${section}\n${renderPartnerSection()}`);
};

const getPath = (rootValue, key) => key.split('.').reduce((value, part) => value?.[part], rootValue);
const renderTokens = (html) => html.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_match, key) => {
  const value = getPath(v9, key.trim());
  if (value === undefined || value === null) throw new Error(`Missing V9 CMS token: ${key}`);
  return esc(value);
});

const processHtml = async (filePath) => {
  let html = await fs.readFile(filePath, 'utf8');
  const base = path.basename(filePath).toLowerCase();
  if (base === 'churches.html') {
    html = applySharedShell(html, filePath);
    html = renderTokens(html);
  }
  html = addStylesheet(html);
  html = addChurchNav(html, base === 'churches.html');
  if (base === 'index.html') {
    html = updateHero(html);
    html = updatePractices(html);
    html = injectPartnerSection(html);
  }
  await fs.writeFile(filePath, html, 'utf8');
};

const entries = await fs.readdir(dist, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
  await processHtml(path.join(dist, entry.name));
}

console.log('Applied Homeward V9 CMS-backed live copy overlay.');
