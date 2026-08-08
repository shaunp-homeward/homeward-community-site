import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const v8 = JSON.parse(await fs.readFile(path.join(root, 'content', 'v8.json'), 'utf8'));

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const inline = (value = '') => esc(value)
  .replaceAll('&lt;strong&gt;', '<strong>').replaceAll('&lt;/strong&gt;', '</strong>')
  .replaceAll('&lt;em&gt;', '<em>').replaceAll('&lt;/em&gt;', '</em>')
  .replaceAll('&lt;br&gt;', '<br>').replaceAll('&lt;br/&gt;', '<br/>');
const attr = esc;

const styles = `<style id="homeward-v8-front-door">
.v8-hero .hero-bg{background-image:linear-gradient(90deg,rgba(10,34,27,.78),rgba(10,34,27,.38)),url('${attr(v8.homepage.hero.image)}');background-size:cover;background-position:center}.v8-hero-logistics{margin:28px 0 0;color:rgba(255,255,255,.9);font-size:.78rem;line-height:1.8;letter-spacing:.08em;text-transform:uppercase}.v8-hero-logistics span{padding:0 .35em;color:rgba(255,255,255,.55)}.v8-hero-logistics strong{font-weight:600;letter-spacing:.04em;text-transform:none}
.v8-finding-home{padding:clamp(68px,8vw,108px) 0;background:#fff}.v8-finding-home .v8-inner{max-width:900px;margin:0 auto;text-align:center}.v8-finding-home h2{font-family:var(--serif,Georgia,serif);font-size:clamp(2rem,4.5vw,3.8rem);line-height:1.05;color:var(--forest,#153a2e);margin:.2em auto}.v8-finding-home p{max-width:720px;margin:22px auto;line-height:1.75;color:var(--forest,#153a2e)}
.v8-editorial{padding:clamp(72px,10vw,132px) 0;background:var(--ivory,#faf6ef)}.v8-editorial .v8-inner{max-width:820px;margin:0 auto;text-align:center}.v8-editorial h2{max-width:760px;margin:0 auto;font-family:var(--serif,Georgia,serif);font-size:clamp(2.3rem,5vw,4.5rem);line-height:1.02;letter-spacing:-.035em;color:var(--forest,#153a2e)}.v8-body{max-width:720px;margin:26px auto 0;font-size:clamp(1.05rem,1.6vw,1.25rem);line-height:1.75;color:var(--forest,#153a2e)}.v8-body p{margin:0 0 18px}.v8-outcomes{margin-top:38px;padding-top:22px;border-top:1px solid rgba(21,58,46,.18);font-size:.88rem;letter-spacing:.12em;text-transform:uppercase;color:var(--copper,#b35a2a)}
.v8-gifts{padding:clamp(68px,8vw,110px) 0;background:#fff}.v8-gifts-head{max-width:780px;margin:0 auto 46px;text-align:center}.v8-gifts-head h2{font-family:var(--serif,Georgia,serif);font-size:clamp(2rem,4vw,3.5rem);color:var(--forest,#153a2e);margin:.2em 0}.v8-gifts-head .lead{max-width:700px;margin:20px auto 0}.v8-gift-grid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(21,58,46,.16);border-bottom:1px solid rgba(21,58,46,.16)}.v8-gift{padding:34px 28px 38px;border-right:1px solid rgba(21,58,46,.14)}.v8-gift:last-child{border-right:0}.v8-gift h3{font-family:var(--serif,Georgia,serif);font-size:1.55rem;color:var(--forest,#153a2e);margin:0 0 10px}.v8-gift p{margin:0;line-height:1.65;color:var(--forest,#153a2e)}
.v8-different{padding:clamp(72px,9vw,120px) 0;background:var(--ivory,#faf6ef)}.v8-different .v8-inner{max-width:820px;margin:0 auto;text-align:left}.v8-different h2{font-family:var(--serif,Georgia,serif);font-size:clamp(2.1rem,4vw,3.6rem);line-height:1.05;color:var(--forest,#153a2e);margin:0 0 22px}.v8-different p{font-size:1.08rem;line-height:1.75;color:var(--forest,#153a2e);margin:0 0 18px}.v8-questions{margin:28px 0;padding:22px 0;border-top:1px solid rgba(21,58,46,.16);border-bottom:1px solid rgba(21,58,46,.16);font-family:var(--serif,Georgia,serif);font-size:1.35rem;line-height:1.65;color:var(--forest,#153a2e)}.v8-signature{margin-top:30px;font-size:.9rem!important;letter-spacing:.12em;text-transform:uppercase;color:var(--copper,#b35a2a)!important}.v8-final-note{margin-top:28px;font-size:1rem!important}
.v8-circle-comparison{padding:clamp(72px,9vw,120px) 0;background:#fff}.v8-circle-comparison .container{max-width:1040px}.v8-comparison-intro{max-width:780px;margin:0 auto 42px;text-align:center}.v8-comparison-intro h2{font-family:var(--serif,Georgia,serif);font-size:clamp(2.2rem,4vw,3.6rem);line-height:1.05;color:var(--forest,#153a2e)}.v8-comparison{border-top:1px solid rgba(21,58,46,.16)}.v8-comparison-row{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid rgba(21,58,46,.16)}.v8-comparison-row>div{padding:26px 30px}.v8-comparison-row>div+div{border-left:1px solid rgba(21,58,46,.16);background:var(--ivory,#faf6ef)}.v8-comparison-label{font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--copper,#b35a2a);margin-bottom:8px}.v8-comparison p{margin:0;line-height:1.65;color:var(--forest,#153a2e)}.v8-comparison-quote{font-family:var(--serif,Georgia,serif);font-size:1.15rem;margin-top:7px!important}.v8-comparison-close{max-width:760px;margin:36px auto 0;text-align:center;font-size:1.05rem;line-height:1.7;color:var(--forest,#153a2e)}
@media(max-width:800px){.v8-gift-grid{grid-template-columns:1fr 1fr}.v8-gift:nth-child(2){border-right:0}.v8-gift:nth-child(-n+2){border-bottom:1px solid rgba(21,58,46,.14)}.v8-comparison-row{grid-template-columns:1fr}.v8-comparison-row>div+div{border-left:0;border-top:1px solid rgba(21,58,46,.12)}}@media(max-width:560px){.v8-gift-grid{grid-template-columns:1fr}.v8-gift{border-right:0!important;border-bottom:1px solid rgba(21,58,46,.14)}.v8-gift:last-child{border-bottom:0}}
</style>`;

const sectionContaining = (html, needle) => {
  const index = html.indexOf(needle);
  if (index < 0) return null;
  const start = html.lastIndexOf('<section', index);
  const end = html.indexOf('</section>', index);
  if (start < 0 || end < 0) return null;
  return { start, end: end + '</section>'.length };
};
const replaceContaining = (html, needle, replacement) => {
  const range = sectionContaining(html, needle);
  if (!range) return html;
  return html.slice(0, range.start) + replacement + html.slice(range.end);
};
const paragraphs = (items) => items.map((p) => `<p>${inline(p)}</p>`).join('');

export function renderHomeV8(sourceHtml) {
  const h = v8.homepage;
  let html = sourceHtml;
  html = html.replace('</head>', `${styles}\n</head>`);
  const hero = `<section class="hero hero-v4 v8-hero"><div aria-hidden="true" class="hero-bg"></div><div class="container"><div class="hero-content reveal"><p class="eyebrow">${esc(h.hero.eyebrow)}</p><h1>${esc(h.hero.headline)}<br><em>${esc(h.hero.emphasis)}</em></h1><p class="hero-copy">${esc(h.hero.description)}</p><div class="hero-actions"><a class="button" href="${attr(h.hero.primary_url)}" data-event="interest_hero_click">${esc(h.hero.primary_label)}</a><a class="button button-ghost-light" href="${attr(h.hero.secondary_url)}" data-event="circle_details_view">${esc(h.hero.secondary_label)}</a></div><p class="v8-hero-logistics">${esc(h.hero.logistics).replaceAll(' · ', ' <span>·</span> ')}<br><strong>${esc(h.hero.requirements)}</strong></p></div></div></section>`;
  html = replaceContaining(html, '<section class="hero hero-v4', hero);
  const finding = h.finding_home.enabled === false ? '' : `<section class="v8-finding-home"><div class="container v8-inner"><p class="eyebrow">${esc(h.finding_home.eyebrow)}</p><h2>${esc(h.finding_home.heading)}</h2><p>${inline(h.finding_home.body)}</p><a class="button button-secondary" href="${attr(h.finding_home.link_url)}">${esc(h.finding_home.link_label)}</a></div></section>`;
  html = replaceContaining(html, '<section class="section section-white circles-feature', finding);
  const recognition = h.recognition.enabled === false ? '' : `<section class="recognition" id="invitation"><div class="container"><div class="center reveal"><p class="eyebrow">${esc(h.recognition.eyebrow)}</p><h2>${esc(h.recognition.heading)}</h2><p class="lead" style="margin:20px auto 0;max-width:800px">${esc(h.recognition.intro)}</p></div><div class="question-grid-v4 reveal">${h.recognition.questions.map((q,i)=>`<div class="question-v4"><div class="question-icon">${i+1}</div><p>${esc(q)}</p></div>`).join('')}</div><div class="honest-beginning reveal">${esc(h.recognition.honest_line)}</div></div></section>`;
  html = replaceContaining(html, '<section class="recognition"', recognition);
  const bridge = h.practice_bridge.enabled === false ? '' : `<section class="v8-editorial"><div class="container v8-inner"><p class="eyebrow">${esc(h.practice_bridge.eyebrow)}</p><h2>${esc(h.practice_bridge.heading)}</h2><div class="v8-body">${paragraphs(String(h.practice_bridge.body).split(/\n\s*\n/))}</div><div class="v8-outcomes">${esc(h.practice_bridge.outcomes)}</div></div></section>`;
  const gifts = h.gifts.enabled === false ? '' : `<section class="v8-gifts" id="practices"><div class="container"><div class="v8-gifts-head"><p class="eyebrow">${esc(h.gifts.eyebrow)}</p><h2>${esc(h.gifts.heading)}</h2><p class="lead">${esc(h.gifts.bridge)}</p></div><div class="v8-gift-grid">${h.gifts.items.map((item)=>`<article class="v8-gift"><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></article>`).join('')}</div></div></section>`;
  const d = h.difference;
  const difference = d.enabled === false ? '' : `<section class="v8-different"><div class="container v8-inner"><p class="eyebrow">${esc(d.eyebrow)}</p><h2>${esc(d.heading)}</h2>${paragraphs(d.paragraphs)}<div class="v8-questions">${d.questions.map((q)=>`<strong>${esc(q)}</strong>`).join('<br>')}</div><p class="v8-signature">${esc(d.signature)}</p><p class="v8-final-note">${esc(d.closing)}</p></div></section>`;
  html = replaceContaining(html, '<section class="section practice-section', `${bridge}${gifts}${difference}`);
  return html;
}

export function renderCirclesV8(sourceHtml) {
  const c = v8.circles.comparison;
  if (!c.enabled) return sourceHtml;
  const rows = c.rows.map((row) => `<div class="v8-comparison-row"><div><div class="v8-comparison-label">${esc(row.typical_label)}</div><p>${esc(row.typical)}</p>${row.typical_quote ? `<p class="v8-comparison-quote"><em>${esc(row.typical_quote)}</em></p>` : ''}</div><div><div class="v8-comparison-label">${esc(row.homeward_label)}</div><p>${esc(row.homeward)}</p>${row.homeward_quote ? `<p class="v8-comparison-quote"><em>${esc(row.homeward_quote)}</em></p>` : ''}</div></div>`).join('');
  const comparison = `<section class="v8-circle-comparison"><div class="container"><div class="v8-comparison-intro"><p class="eyebrow">${esc(c.eyebrow)}</p><h2>${esc(c.heading)}</h2><p class="lead">${esc(c.intro)}</p></div><div class="v8-comparison">${rows}</div><p class="v8-comparison-close"><strong>${esc(c.close)}</strong></p><p class="v8-comparison-close">${esc(c.final)}</p></div></section>`;
  let html = sourceHtml;
  html = html.replace('</head>', `${styles}\n</head>`);
  return replaceContaining(html, 'A simple rhythm with room to breathe.', comparison);
}
