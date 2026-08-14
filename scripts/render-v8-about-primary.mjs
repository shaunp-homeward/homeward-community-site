import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const data = JSON.parse(await fs.readFile(path.join(root, 'content', 'about-v8.json'), 'utf8'));
const css = await fs.readFile(path.join(root, 'assets', 'v8-about-primary.css'), 'utf8');

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const attr = esc;
const btn = (label, url, secondary = false) => `<a class="ap-btn ${secondary ? 'ap-btn-ghost' : 'ap-btn-primary'}" href="${attr(url)}">${esc(label)}</a>`;
const p = (value) => `<p>${esc(value)}</p>`;

const main = `
<main>
<section class="ap-hero"><div class="ap-shell ap-hero-grid">
  <div class="ap-hero-copy"><p class="ap-eyebrow">${esc(data.hero.eyebrow)}</p><h1>${esc(data.hero.heading)}</h1><p class="ap-lead">${esc(data.hero.lead)}</p><blockquote class="ap-hero-question">${esc(data.hero.question)}</blockquote><p class="ap-hero-support"><strong>${esc(data.hero.support)}</strong></p><p class="ap-hero-support ap-hero-after">${esc(data.hero.after_support)}</p><div class="ap-actions">${btn('Read the Story','#our-story-journey')}${btn("Who’s Behind Homeward?",'#trust',true)}</div></div>
  <div class="ap-mosaic">${data.hero.images.map((it)=>`<figure class="ap-tile ${attr(it.class || '')}"><img src="${attr(it.src)}" alt="${attr(it.alt)}"></figure>`).join('')}</div>
</div></section>

<section class="ap-questions ap-section" id="our-story-journey"><div class="ap-shell"><div class="ap-two"><div><p class="ap-eyebrow">${esc(data.questions.eyebrow)}</p><h2>${esc(data.questions.heading)}</h2></div><div class="ap-story-card">${data.questions.paragraphs.map(p).join('')}</div></div></div></section>

<section class="ap-search ap-section"><div class="ap-shell"><div class="ap-search-head"><p class="ap-eyebrow">${esc(data.search.eyebrow)}</p><h2>${esc(data.search.heading)}</h2>${data.search.paragraphs.map((text)=>`<p class="ap-lead">${esc(text)}</p>`).join('')}</div><div class="ap-search-gallery" aria-label="Photos from Shaun's spiritual journey">${data.search.photos.map((it)=>`<figure class="ap-photo ${it.contain ? 'contain' : ''}"><div class="ap-photo-frame"><img src="${attr(it.src)}" alt="${attr(it.alt)}"></div><figcaption>${esc(it.caption)}</figcaption></figure>`).join('')}</div><div class="ap-search-note"><strong>${esc(data.search.note.split('. ')[0])}.</strong> ${esc(data.search.note.split('. ').slice(1).join('. '))}</div></div></section>

<section class="ap-return ap-section"><div class="ap-shell ap-return-grid"><div class="ap-return-copy"><p class="ap-eyebrow">${esc(data.return.eyebrow)}</p><h2>${esc(data.return.heading)}</h2>${data.return.paragraphs.map(p).join('')}</div><aside class="ap-book"><p class="ap-eyebrow">${esc(data.return.book_eyebrow)}</p><div class="ap-book-title">${esc(data.return.book_title)}</div><p>${esc(data.return.book_body)}</p><p class="ap-book-quote">“${esc(data.return.quote)}”</p></aside></div></section>

<section class="ap-missing ap-section"><div class="ap-shell"><div class="ap-missing-card"><p class="ap-eyebrow">${esc(data.missing.eyebrow)}</p><h2>${esc(data.missing.heading)}</h2>${data.missing.paragraphs.map((text)=>`<p class="ap-missing-body">${esc(text)}</p>`).join('')}<p class="ap-missing-signature">${esc(data.missing.signature)}</p></div></div></section>

<section class="ap-trust ap-section" id="trust"><div class="ap-shell"><div class="ap-trust-head"><p class="ap-eyebrow">${esc(data.trust.eyebrow)}</p><h2>${esc(data.trust.heading)}</h2><p class="ap-lead">${esc(data.trust.lead)}</p></div><div class="ap-trust-grid compact">${data.trust.cards.map((it,i)=>`<article class="ap-trust-card"><div class="ap-trust-num">${i+1}</div><h3>${esc(it.title)}</h3><p>${esc(it.body)}</p></article>`).join('')}</div>
<div class="ap-founder"><figure><img src="${attr(data.trust.founder_image)}" alt="${attr(data.trust.founder_alt)}"></figure><div><p class="ap-eyebrow">${esc(data.trust.founder_eyebrow)}</p><h2>${esc(data.trust.founder_heading)}</h2>${data.trust.founder_paragraphs.slice(0,2).map(p).join('')}<p class="ap-founder-copy-quote">${esc(data.trust.founder_quote)}</p>${data.trust.founder_paragraphs.slice(2).map(p).join('')}<div class="ap-trust-actions inline">${btn(data.trust.linkedin_label,data.trust.linkedin_url,true)}</div></div></div>
<div class="ap-homeward-summary"><strong>${esc(data.trust.summary.split('. Circles')[0])}.</strong>${esc(' Circles' + (data.trust.summary.split('. Circles')[1] || ''))}</div><p class="ap-disclaimer">${esc(data.trust.disclaimer)}</p></div></section>

<section class="ap-final ap-section"><div class="ap-shell"><p class="ap-eyebrow">${esc(data.final.eyebrow)}</p><h2>${esc(data.final.heading)}</h2><p class="ap-lead">${esc(data.final.lead)}</p><div class="ap-steps">${data.final.steps.map((it,i)=>`<article class="ap-step"><b>${String(i+1).padStart(2,'0')}</b><h3>${esc(it.title)}</h3><p>${esc(it.body)}</p></article>`).join('')}</div><div class="ap-actions">${btn(data.final.primary_label,data.final.primary_url)}${btn(data.final.secondary_label,data.final.secondary_url,true)}</div></div></section>
</main>`;

export function renderAboutPrimary(sourceHtml){
  let html = String(sourceHtml);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Our Story — Homeward</title>');
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, '<meta name="description" content="Meet Shaun Pennington and learn how questions, study, contemplative retreat, and a return to Christ led to Homeward.">');
  if(!html.includes('v8-about-primary-css')) html = html.replace('</head>', `<style id="v8-about-primary-css">${css}</style></head>`);
  html = html.replace(/<body([^>]*)>/i, (m, attrs) => /class=/.test(attrs) ? m.replace(/class=["']([^"']*)["']/, (_, cls) => `class="${cls} v8-about-primary"`) : `<body${attrs} class="v8-about-primary">`);
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  return html;
}
