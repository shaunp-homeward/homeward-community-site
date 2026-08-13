import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const data = JSON.parse(await fs.readFile(path.join(root, 'content', 'circles-v8.json'), 'utf8'));

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const attr = esc;
const inline = (value = '') => esc(value)
  .replaceAll('&lt;strong&gt;', '<strong>').replaceAll('&lt;/strong&gt;', '</strong>')
  .replaceAll('&lt;em&gt;', '<em>').replaceAll('&lt;/em&gt;', '</em>')
  .replaceAll('&lt;br&gt;', '<br>').replaceAll('&lt;br/&gt;', '<br/>');

const btn = (label, url, secondary = false) => `<a class="cp-btn ${secondary ? 'cp-btn-ghost' : 'cp-btn-primary'}" href="${attr(url)}">${esc(label)}</a>`;
const lightBtn = (label, url) => `<a class="cp-btn cp-btn-light" href="${attr(url)}">${esc(label)}</a>`;
const picture = (desktop, mobile, alt) => mobile
  ? `<picture><source media="(max-width: 900px)" srcset="${attr(mobile)}"><img src="${attr(desktop)}" alt="${attr(alt)}"></picture>`
  : `<img src="${attr(desktop)}" alt="${attr(alt)}">`;
const cards = (items = [], className) => items.map((item) => `<article class="${className}"><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('');

const factIcons = [
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12v8H4v-8"/><path d="M2 7h20v5H2z"/><path d="M12 7v13"/><path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5L12 7Z"/><path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5L12 7Z"/></svg>'
];

const heroFacts = (data.hero.facts || []).map((fact, i) => `<div class="cp-logistic"><span class="cp-logistic-icon">${factIcons[i] || factIcons[0]}</span><span class="cp-logistic-label">${esc(fact)}</span></div>`).join('');
const fitItems = (data.fit.fit_items || []).map((item) => `<li>${esc(item)}</li>`).join('');
const notFitItems = (data.fit.not_items || []).map((item) => `<li>${esc(item)}</li>`).join('');
const differenceItems = (data.comparison.right_items || []).map((item) => `<article class="cp-difference-card"><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('');
const loopItems = (data.loop.items || []).map((item, i) => `<article class="cp-loop-step"><b>${String(i + 1).padStart(2, '0')}</b><div><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></div></article>`).join('');

const main = `
<main>
<section class="cp-hero"><div class="cp-hero-grid">
  <div class="cp-hero-copy"><div class="cp-hero-copy-inner"><p class="cp-eyebrow">${esc(data.hero.eyebrow)}</p><h1>${esc(data.hero.heading)}<em>${esc(data.hero.emphasis)}</em></h1><p class="cp-lead">${esc(data.hero.lead)}</p><p class="cp-season-line">${inline(data.hero.season_line)}</p><div class="cp-actions">${btn(data.hero.primary_label,data.hero.primary_url)}${btn(data.hero.secondary_label,data.hero.secondary_url,true)}</div><div class="cp-logistics">${heroFacts}</div></div></div>
  <div class="cp-hero-image">${picture(data.hero.image, data.hero.image_mobile, data.hero.image_alt)}</div>
</div></section>

<section class="cp-compare cp-section"><div class="cp-shell"><div class="cp-section-head"><p class="cp-eyebrow">${esc(data.comparison.eyebrow)}</p><h2>${esc(data.comparison.heading)}</h2><p class="cp-lead">${esc(data.comparison.lead)}</p></div><h3 class="cp-difference-heading">${esc(data.comparison.right_heading)}</h3><div class="cp-difference-grid">${differenceItems}</div><div class="cp-difference-context"><p>${esc(data.comparison.note)}</p></div></div></section>

<section class="cp-practice cp-section"><div class="cp-shell"><div class="cp-practice-grid"><figure class="cp-practice-image"><img src="${attr(data.practice.image)}" alt="${attr(data.practice.image_alt)}"></figure><div class="cp-practice-copy"><p class="cp-eyebrow">${esc(data.practice.eyebrow)}</p><h2>${esc(data.practice.heading)}</h2><p class="cp-lead">${esc(data.practice.lead)}</p><p>${esc(data.practice.body)}</p></div></div><div class="cp-benefits">${data.practice.benefits.map((item)=>`<article class="cp-benefit"><span>✓</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('')}</div><div class="cp-practice-actions"><a class="cp-text-link" href="/practices.html">Explore Practices + Research →</a></div></div></section>

<section class="cp-talk cp-section"><div class="cp-shell cp-talk-grid"><div><p class="cp-eyebrow">${esc(data.conversation.eyebrow)}</p><h2>${esc(data.conversation.heading)}</h2><p class="cp-lead">${esc(data.conversation.lead)}</p><blockquote>${esc(data.conversation.quote)}</blockquote></div><div class="cp-principles">${data.conversation.principles.map((item,i)=>`<article class="cp-principle"><b>${i+1}</b><div><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></div></article>`).join('')}</div></div></section>

<section class="cp-loop cp-section"><div class="cp-shell"><div class="cp-section-head cp-center"><p class="cp-eyebrow">${esc(data.loop.eyebrow)}</p><h2>${esc(data.loop.heading)}</h2><p class="cp-lead">${esc(data.loop.lead)}</p></div><div class="cp-loop-flow">${loopItems}</div></div></section>

<section class="cp-fit cp-section"><div class="cp-shell"><div class="cp-section-head cp-center"><p class="cp-eyebrow">${esc(data.fit.eyebrow)}</p><h2>${esc(data.fit.heading)}</h2><p class="cp-lead">${esc(data.fit.lead)}</p></div><div class="cp-fit-grid"><article class="cp-fit-card"><div class="cp-fit-kicker"><div class="cp-fit-icon">✓</div><h3>${esc(data.fit.fit_heading)}</h3></div><ul>${fitItems}</ul></article><article class="cp-fit-card cp-fit-no"><div class="cp-fit-kicker"><div class="cp-fit-icon">—</div><h3>${esc(data.fit.not_heading)}</h3></div><ul>${notFitItems}</ul></article></div></div></section>

<section class="cp-agenda cp-section"><div class="cp-shell"><div class="cp-section-head"><p class="cp-eyebrow">${esc(data.agenda.eyebrow)}</p><h2>${esc(data.agenda.heading)}</h2><p class="cp-lead">${esc(data.agenda.lead)}</p></div><div class="cp-agenda-list">${data.agenda.items.map((item)=>`<article class="cp-agenda-row"><time>${esc(item.time)}</time><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('')}</div></div></section>

<section class="cp-season cp-section"><div class="cp-shell"><div class="cp-section-head cp-center"><p class="cp-eyebrow">${esc(data.season.eyebrow)}</p><h2>${esc(data.season.heading)}</h2><p class="cp-lead">${esc(data.season.lead)}</p></div><div class="cp-season-grid">${cards(data.season.items,'cp-season-card')}</div></div></section>

<section class="cp-tools cp-section"><div class="cp-shell"><div class="cp-section-head cp-center"><p class="cp-eyebrow">${esc(data.tools.eyebrow)}</p><h2>${esc(data.tools.heading)}</h2><p class="cp-lead">${esc(data.tools.lead)}</p></div><div class="cp-tools-grid">${cards(data.tools.items,'cp-tool')}</div><div class="cp-tools-actions"><a class="cp-text-link" href="/practices.html#practice-library">See the Practice Library →</a></div></div></section>

<section class="cp-join cp-section" id="join"><div class="cp-shell"><div class="cp-section-head cp-center"><p class="cp-eyebrow">${esc(data.join.eyebrow)}</p><h2>${esc(data.join.heading)}</h2><p class="cp-lead">${esc(data.join.lead)}</p></div><div class="cp-join-grid">${data.join.items.map((item,i)=>`<article class="cp-join-card"><b>${i+1}</b><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p>${item.link_label ? `<a href="${attr(item.link_url)}">${esc(item.link_label)}</a>` : ''}</article>`).join('')}</div></div></section>

<section class="cp-final cp-section"><div class="cp-shell"><p class="cp-eyebrow">${esc(data.final.eyebrow)}</p><h2>${esc(data.final.heading)}</h2><p class="cp-lead">${esc(data.final.lead)}</p><div class="cp-actions">${btn(data.final.primary_label,data.final.primary_url)}${lightBtn(data.final.secondary_label,data.final.secondary_url)}</div><p class="cp-final-note">${esc(data.final.note)}</p></div></section>
</main>`;

export function renderCirclesPrimary(sourceHtml = '') {
  let html = String(sourceHtml);
  if (!/<main\b/i.test(html)) return html;
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  html = html.replace(/<body([^>]*)>/i, (m, attrs) => {
    if (/\bclass=["']/i.test(m)) return m.replace(/class=["']([^"']*)["']/, (mm, cls) => `class="${cls} v8-circles-primary"`);
    return `<body${attrs} class="v8-circles-primary">`;
  });
  if (!html.includes('v8-circles-primary.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/assets/v8-circles-primary.css"><link rel="stylesheet" href="/assets/v8-circles-hierarchy-tightening.css?v=2"></head>');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(data.meta.title)}</title>`);
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${attr(data.meta.description)}">`);
  return html;
}
