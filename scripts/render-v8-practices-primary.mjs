import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const data = JSON.parse(await fs.readFile(path.join(root, 'content', 'practices-v8.json'), 'utf8'));
const css = await fs.readFile(path.join(root, 'assets', 'v8-practices-primary.css'), 'utf8');

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const attr = esc;

const btn = (label, url, secondary = false) => `<a class="pp-btn ${secondary ? 'pp-btn-ghost' : 'pp-btn-primary'}" href="${attr(url)}">${esc(label)}</a>`;

const main = `
<main>
<section class="pp-hero"><div class="pp-hero-grid">
  <div class="pp-hero-copy"><div class="pp-hero-copy-inner"><p class="pp-eyebrow">${esc(data.hero.eyebrow)}</p><h1>${esc(data.hero.heading)}<em>${esc(data.hero.emphasis)}</em></h1><p class="pp-lead">${esc(data.hero.lead)}</p><p class="pp-hero-promise">${esc(data.hero.promise)}</p><div class="pp-actions">${btn(data.hero.primary_label,data.hero.primary_url)}${btn(data.hero.secondary_label,data.hero.secondary_url,true)}</div></div></div>
  <div class="pp-hero-image"><img src="${attr(data.hero.image)}" alt="${attr(data.hero.image_alt)}"></div>
</div></section>

<section class="pp-why pp-section"><div class="pp-shell"><div class="pp-why-grid"><figure class="pp-why-image"><img src="${attr(data.why.image)}" alt="${attr(data.why.image_alt)}"></figure><div class="pp-why-copy"><p class="pp-eyebrow">${esc(data.why.eyebrow)}</p><h2>${esc(data.why.heading)}</h2><p class="pp-lead">${esc(data.why.body)}</p><p class="pp-why-signature">${esc(data.why.signature)}</p></div></div><div class="pp-benefits">${data.why.benefits.map((b)=>`<article class="pp-benefit"><span>✓</span><h3>${esc(b.title)}</h3><p>${esc(b.body)}</p></article>`).join('')}</div></div></section>

<section class="pp-research pp-section"><div class="pp-shell"><div class="pp-section-head pp-center"><p class="pp-eyebrow">${esc(data.research.eyebrow)}</p><h2>${esc(data.research.heading)}</h2><p class="pp-lead">${esc(data.research.intro)}</p></div>
<div class="pp-daily-card"><div class="pp-ten"><strong>${esc(data.research.daily.number)}</strong><span>${esc(data.research.daily.unit)}</span></div><div class="pp-daily-copy"><p class="pp-kicker">${esc(data.research.daily.kicker)}</p><h3>${esc(data.research.daily.body)}</h3><p>${esc(data.research.daily.note)}</p><a class="pp-source" href="${attr(data.research.daily.source)}" target="_blank" rel="noopener">Read the study ↗</a></div><div class="pp-daily-facts">${data.research.daily.facts.map((f)=>`<span>${esc(f)}</span>`).join('')}</div></div>
<div class="pp-research-grid">${data.research.cards.map((c)=>`<article class="pp-research-card"><div class="pp-stat">${esc(c.stat)}</div><h3>${esc(c.title)}</h3><p>${esc(c.body)}</p><div class="pp-tags">${c.tags.map((t)=>`<span>${esc(t)}</span>`).join('')}</div><a class="pp-source" href="${attr(c.source)}" target="_blank" rel="noopener">View research ↗</a></article>`).join('')}</div>
<div class="pp-research-band"><strong>WHAT THIS CAN LOOK LIKE IN REAL LIFE</strong><div class="pp-research-benefits">${data.research.benefits.map((b)=>`<span>${esc(b)}</span>`).join('')}</div></div><p class="pp-research-translation">${esc(data.research.translation)}</p><div class="pp-research-actions"><a href="${attr(data.research.resources_url)}">${esc(data.research.resources_label)} →</a></div></div></section>

<section class="pp-formation pp-section"><div class="pp-shell"><div class="pp-section-head pp-center"><p class="pp-eyebrow">${esc(data.formation.eyebrow)}</p><h2>${esc(data.formation.heading)}</h2><p class="pp-lead">${esc(data.formation.intro)}</p></div><div class="pp-formation-grid">${data.formation.steps.map((s,i)=>`<article class="pp-formation-step"><b>${String(i+1).padStart(2,'0')}</b><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></article>`).join('')}</div></div></section>

<section class="pp-library pp-section" id="practice-library"><div class="pp-shell"><div class="pp-section-head"><p class="pp-eyebrow">${esc(data.library.eyebrow)}</p><h2>${esc(data.library.heading)}</h2><p class="pp-lead">${esc(data.library.intro)}</p></div><div class="pp-library-grid">${data.library.items.map((it)=>`<article class="pp-practice-card"><img src="${attr(it.image)}" alt="${attr(it.image_alt)}"><div class="pp-practice-copy"><p class="pp-practice-tradition">${esc(it.tradition)}</p><h3>${esc(it.title)}</h3><p>${esc(it.snapshot)}</p><p class="pp-growth-label">WHAT IT CAN GROW</p><p class="pp-growth">${esc(it.growth)}</p></div></article>`).join('')}</div></div></section>

<section class="pp-community pp-section"><div class="pp-shell"><div class="pp-community-grid"><figure class="pp-community-image"><img src="${attr(data.community.image)}" alt="${attr(data.community.image_alt)}"></figure><div><p class="pp-eyebrow">${esc(data.community.eyebrow)}</p><h2>${esc(data.community.heading)}</h2><p class="pp-lead">${esc(data.community.lead)}</p><div class="pp-community-points">${data.community.points.map((p,i)=>`<article class="pp-community-point"><b>${i+1}</b><div><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></div></article>`).join('')}</div></div></div><p class="pp-community-signature">${esc(data.community.signature)}</p></div></section>

<section class="pp-final pp-section"><div class="pp-shell"><p class="pp-eyebrow">${esc(data.final.eyebrow)}</p><h2>${esc(data.final.heading)}</h2><p class="pp-lead">${esc(data.final.lead)}</p><div class="pp-actions">${btn(data.final.primary_label,data.final.primary_url,true)}${btn(data.final.secondary_label,data.final.secondary_url)}</div></div></section>
</main>`;

export function renderPracticesPrimary(sourceHtml){
  let html = String(sourceHtml);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Practices — Homeward</title>');
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, '<meta name="description" content="Explore ancient Christian practices for greater peace, joy, focus, connection, resilience, and a deeper life with God.">');
  if(!html.includes('v8-practices-primary-css')) html = html.replace('</head>', `<style id="v8-practices-primary-css">${css}</style></head>`);
  html = html.replace(/<body([^>]*)>/i, (m, attrs) => /class=/.test(attrs) ? m.replace(/class=["']([^"']*)["']/, (_, cls) => `class="${cls} v8-practices-primary"`) : `<body${attrs} class="v8-practices-primary">`);
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  return html;
}
