import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const data = JSON.parse(await fs.readFile(path.join(root, 'content', 'about-v8.json'), 'utf8'));
const css = await fs.readFile(path.join(root, 'assets', 'v8-about-primary.css'), 'utf8');
const layoutCss = `
.ap-hero-after{margin-top:14px}.ap-search-gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:38px}.ap-search-gallery .ap-photo{margin:0;min-width:0;flex:none}.ap-search-gallery .ap-photo-frame{height:250px}.ap-search-gallery .ap-photo figcaption{min-height:128px}.ap-search-note{margin-top:26px;padding:24px 28px;background:#fff;border:1px solid var(--ap-line);border-left:4px solid var(--ap-copper);border-radius:10px;line-height:1.7;color:#4f5953}.ap-search-note strong{color:var(--ap-forest)}.ap-trust-grid.compact{grid-template-columns:repeat(3,1fr);gap:14px}.ap-trust-grid.compact .ap-trust-card{min-height:0;padding:22px 20px;display:grid;grid-template-columns:42px 1fr;grid-template-rows:auto auto;column-gap:14px;align-items:center}.ap-trust-grid.compact .ap-trust-num{grid-row:1/3;margin:0}.ap-trust-grid.compact h3{margin:0 0 5px}.ap-trust-grid.compact p{margin:0}.ap-founder{margin-top:46px}.ap-founder figure{align-self:start}.ap-founder figure img{display:block}.ap-founder-copy-quote{font-family:var(--serif,Georgia,serif);font-size:1.3rem!important;line-height:1.55!important;color:var(--ap-forest)!important}.ap-trust-actions.inline{justify-content:flex-start;margin-top:18px}.ap-homeward-summary{margin-top:34px;padding:22px 26px;background:var(--ap-ivory);border:1px solid var(--ap-line);border-left:4px solid var(--ap-copper);font-size:1rem;line-height:1.7;color:#4f5953}.ap-homeward-summary strong{color:var(--ap-forest)}.ap-final .ap-steps{max-width:900px}.ap-final .ap-step{display:grid;grid-template-columns:48px 1fr;grid-template-rows:auto auto;column-gap:14px;min-height:0;padding:24px}.ap-final .ap-step b{grid-row:1/3;align-self:start}.ap-final .ap-step h3{margin:0 0 6px}.ap-final .ap-step p{margin:0}@media(max-width:900px){.ap-search-gallery{grid-template-columns:repeat(2,1fr)}.ap-trust-grid.compact{grid-template-columns:1fr}.ap-final .ap-steps{grid-template-columns:1fr}}@media(max-width:640px){.ap-search-gallery{grid-template-columns:1fr}.ap-search-gallery .ap-photo-frame{height:260px}.ap-search-gallery .ap-photo figcaption{min-height:0}.ap-search-note{padding:20px}.ap-trust-grid.compact .ap-trust-card{grid-template-columns:38px 1fr}.ap-final .ap-step{grid-template-columns:42px 1fr}}
`;

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const attr = esc;
const btn = (label, url, secondary = false) => `<a class="ap-btn ${secondary ? 'ap-btn-ghost' : 'ap-btn-primary'}" href="${attr(url)}">${esc(label)}</a>`;
const p = (value) => `<p>${esc(value)}</p>`;
const sentenceLead = (text='') => { const parts=String(text).split('. '); return `<strong>${esc(parts[0])}${parts[0].endsWith('.')?'':'.'}</strong>${parts.length>1?' '+esc(parts.slice(1).join('. ')):''}`; };

const main = `
<main>
<section class="ap-hero"><div class="ap-shell ap-hero-grid">
  <div class="ap-hero-copy"><p class="ap-eyebrow">${esc(data.hero.eyebrow)}</p><h1>${esc(data.hero.heading)}</h1><p class="ap-lead">${esc(data.hero.lead)}</p><blockquote class="ap-hero-question">${esc(data.hero.question)}</blockquote><p class="ap-hero-support"><strong>${esc(data.hero.support)}</strong></p><p class="ap-hero-support ap-hero-after">${esc(data.hero.after_support)}</p><div class="ap-actions">${btn('Read the Story','#our-story-journey')}${btn("Who’s Behind Homeward?",'#trust',true)}</div></div>
  <div class="ap-mosaic">${data.hero.images.map((it)=>`<figure class="ap-tile ${attr(it.class || '')}"><img src="${attr(it.src)}" alt="${attr(it.alt)}"></figure>`).join('')}</div>
</div></section>

<section class="ap-questions ap-section" id="our-story-journey"><div class="ap-shell"><div class="ap-two"><div><p class="ap-eyebrow">${esc(data.questions.eyebrow)}</p><h2>${esc(data.questions.heading)}</h2></div><div class="ap-story-card">${data.questions.paragraphs.map(p).join('')}</div></div></div></section>

<section class="ap-search ap-section"><div class="ap-shell"><div class="ap-search-head"><p class="ap-eyebrow">${esc(data.search.eyebrow)}</p><h2>${esc(data.search.heading)}</h2>${data.search.paragraphs.map((text)=>`<p class="ap-lead">${esc(text)}</p>`).join('')}</div><div class="ap-search-gallery" aria-label="Photos from Shaun's spiritual journey">${data.search.photos.map((it)=>`<figure class="ap-photo ${it.contain ? 'contain' : ''}"><div class="ap-photo-frame"><img src="${attr(it.src)}" alt="${attr(it.alt)}"></div><figcaption>${esc(it.caption)}</figcaption></figure>`).join('')}</div><div class="ap-search-note">${sentenceLead(data.search.note)}</div></div></section>

<section class="ap-return ap-section"><div class="ap-shell ap-return-grid"><div class="ap-return-copy"><p class="ap-eyebrow">${esc(data.return.eyebrow)}</p><h2>${esc(data.return.heading)}</h2>${data.return.paragraphs.map(p).join('')}</div><aside class="ap-book"><p class="ap-eyebrow">${esc(data.return.book_eyebrow)}</p><div class="ap-book-title">${esc(data.return.book_title)}</div><p>${esc(data.return.book_body)}</p><p class="ap-book-quote">“${esc(data.return.quote)}”</p></aside></div></section>

<section class="ap-missing ap-section"><div class="ap-shell"><div class="ap-missing-card"><p class="ap-eyebrow">${esc(data.missing.eyebrow)}</p><h2>${esc(data.missing.heading)}</h2>${data.missing.paragraphs.map((text)=>`<p class="ap-missing-body">${esc(text)}</p>`).join('')}<p class="ap-missing-signature">${esc(data.missing.signature)}</p></div></div></section>

<section class="ap-trust ap-section" id="trust"><div class="ap-shell"><div class="ap-trust-head"><p class="ap-eyebrow">${esc(data.trust.eyebrow)}</p><h2>${esc(data.trust.heading)}</h2><p class="ap-lead">${esc(data.trust.lead)}</p></div><div class="ap-trust-grid compact">${data.trust.cards.map((it,i)=>`<article class="ap-trust-card"><div class="ap-trust-num">${i+1}</div><h3>${esc(it.title)}</h3><p>${esc(it.body)}</p></article>`).join('')}</div>
<div class="ap-founder"><figure><img src="${attr(data.trust.founder_image)}" alt="${attr(data.trust.founder_alt)}"></figure><div><p class="ap-eyebrow">${esc(data.trust.founder_eyebrow)}</p><h2>${esc(data.trust.founder_heading)}</h2>${data.trust.founder_paragraphs.slice(0,2).map(p).join('')}<p class="ap-founder-copy-quote">${esc(data.trust.founder_quote)}</p>${data.trust.founder_paragraphs.slice(2).map(p).join('')}<div class="ap-trust-actions inline">${btn(data.trust.linkedin_label,data.trust.linkedin_url,true)}</div></div></div>
<div class="ap-homeward-summary">${sentenceLead(data.trust.summary)}</div><p class="ap-disclaimer">${esc(data.trust.disclaimer)}</p></div></section>

<section class="ap-final ap-section"><div class="ap-shell"><p class="ap-eyebrow">${esc(data.final.eyebrow)}</p><h2>${esc(data.final.heading)}</h2><p class="ap-lead">${esc(data.final.lead)}</p><div class="ap-steps">${data.final.steps.map((it,i)=>`<article class="ap-step"><b>${String(i+1).padStart(2,'0')}</b><h3>${esc(it.title)}</h3><p>${esc(it.body)}</p></article>`).join('')}</div><div class="ap-actions">${btn(data.final.primary_label,data.final.primary_url)}${btn(data.final.secondary_label,data.final.secondary_url,true)}</div></div></section>
</main>`;

export function renderAboutPrimary(sourceHtml){
  let html = String(sourceHtml);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Our Story — Homeward</title>');
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, '<meta name="description" content="Meet Shaun Pennington and learn how questions, study, contemplative retreat, and a return to Christ led to Homeward.">');
  if(!html.includes('v8-about-primary-css')) html = html.replace('</head>', `<style id="v8-about-primary-css">${css}${layoutCss}</style></head>`);
  html = html.replace(/<body([^>]*)>/i, (m, attrs) => /class=/.test(attrs) ? m.replace(/class=["']([^"']*)["']/, (_, cls) => `class="${cls} v8-about-primary"`) : `<body${attrs} class="v8-about-primary">`);
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  return html;
}
