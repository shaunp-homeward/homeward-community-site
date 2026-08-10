import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const v8 = JSON.parse(await fs.readFile(path.join(root, 'content', 'v8.json'), 'utf8'));
const circles = JSON.parse(await fs.readFile(path.join(root, 'content', 'circles.json'), 'utf8'));

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const attr = esc;
const paras = (value = '') => String(value).split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');
const enabledItems = (items = []) => Array.isArray(items) ? items.filter((item) => item && item.enabled !== false) : [];

const svg = {
  pin: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 43s13-12 13-25a13 13 0 1 0-26 0c0 13 13 25 13 25Z"/><circle cx="24" cy="18" r="4"/></svg>',
  wifi: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 18c10-9 24-9 34 0M13 25c7-6 15-6 22 0M19 32c3-3 7-3 10 0"/><circle cx="24" cy="39" r="1.8" fill="currentColor" stroke="none"/></svg>',
  person: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="15" r="7"/><path d="M10 42c1-11 6-17 14-17s13 6 14 17"/></svg>',
  heart: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 41S8 32 8 19c0-6 4-10 10-10 4 0 6 2 6 5 1-3 3-5 7-5 6 0 10 4 10 10 0 13-17 22-17 22Z"/></svg>',
  coin: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><path d="M28 16c-2-2-8-2-9 2-2 6 11 3 10 10-1 5-8 5-11 2M24 11v26"/></svg>',
  headHeart: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 43v-8c-5-3-8-8-8-14C10 11 16 5 24 5s14 6 14 15c0 4-2 7-5 10v13"/><path d="M19 19c1.5-2.5 5.3-2.6 7 0 1.7-2.6 5.5-2.4 7 .1 2.3 4-3 7.7-7 10.6-4.2-3-9.3-6.7-7-10.7Z"/></svg>',
  prayer: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 35c4-7 8-11 12-13 2-1 4 1 3 3l-4 7 5-3 7-9c1-2 4-2 5 0 1 1 1 3 0 5l-8 13c-1 2-4 3-7 3H11"/><path d="M14 12c2 2 3 4 3 7M24 7v9M34 12c-2 2-3 4-3 7"/></svg>',
  book: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 10c7-2 13 0 19 5v26c-6-5-12-7-19-5ZM43 10c-7-2-13 0-19 5v26c6-5 12-7 19-5Z"/></svg>',
  question: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path d="M18 18c1-4 4-6 8-6 4 0 7 3 7 7 0 5-7 6-8 10"/><circle cx="25" cy="36" r="1.7" fill="currentColor" stroke="none"/></svg>',
  sunrise: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 36h34M12 31a12 12 0 0 1 24 0M24 6v8M8 18l6 4M40 18l-6 4"/></svg>',
  brain: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 40c-5 0-8-4-7-8-5-2-5-9 0-11-2-5 2-10 7-9 2-5 9-5 11-1 5-1 9 4 7 9 5 2 5 9 0 11 1 5-3 9-8 9"/><path d="M24 10v30M18 16c4 1 6 4 6 8M30 16c-4 1-6 4-6 8M16 29c4 0 7 2 8 6M32 29c-4 0-7 2-8 6"/></svg>',
  sun: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="8"/><path d="M24 3v9M24 36v9M3 24h9M36 24h9M9 9l7 7M32 32l7 7M39 9l-7 7M16 32l-7 7"/></svg>',
  leaf: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 38c16-2 25-11 28-28-16 2-25 11-28 28Z"/><path d="M14 34 34 14"/></svg>',
  people: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="19" cy="17" r="6"/><circle cx="33" cy="19" r="5"/><path d="M6 42c1-11 6-17 13-17s12 6 13 17M29 28c7-2 12 4 13 14"/></svg>',
  calendar: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="10" width="34" height="31" rx="3"/><path d="M14 5v10M34 5v10M7 19h34M14 26h6M26 26h6M14 33h6"/></svg>',
  chat: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 8h34v25H23l-10 8v-8H7Z"/><circle cx="17" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="24" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="31" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  cross: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M21 5h6v13h10v6H27v19h-6V24H11v-6h10Z"/></svg>',
};

const icon = (name, fallback = 'leaf') => svg[name] || svg[fallback];

const extractSection = (html, id) => {
  const re = new RegExp(`<section\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>[\\s\\S]*?<\\/section>`, 'i');
  return html.match(re)?.[0] || '';
};
const markSection = (html, id) => html ? html.replace(/<section\b/i, `<section data-v8-section="${attr(id)}"`) : '';

const button = (label, url, secondary = false, extra = '') =>
  `<a class="button ${secondary ? 'button-secondary' : ''}" href="${attr(url)}" ${extra}>${esc(label)}</a>`;

const safeToken = (value = '') => /^[a-z0-9-]+$/i.test(String(value)) ? String(value).toLowerCase() : '';
const styleClasses = (style = {}) => {
  const classes = [];
  for (const [key, prefix] of [
    ['background','hw-bg-'], ['heading_color','hw-heading-'], ['text_color','hw-text-'],
    ['accent_color','hw-accent-'], ['heading_size','hw-heading-size-'], ['body_size','hw-body-size-'],
    ['alignment','hw-align-'], ['heading_font','hw-font-'], ['spacing','hw-spacing-'],
  ]) {
    const token = safeToken(style?.[key]);
    if (token && token !== 'default') classes.push(prefix + token);
  }
  return classes.join(' ');
};

const safeHref = (value = '') => {
  const href = String(value).trim();
  return /^(https?:\/\/|mailto:|\/|#)/i.test(href) ? href : '#';
};
const renderInlineMarkdown = (raw = '') => {
  const links = [];
  let value = String(raw).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const token = `@@HWLINK${links.length}@@`;
    links.push(`<a href="${attr(safeHref(url))}">${esc(label)}</a>`);
    return token;
  });
  value = esc(value)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>');
  links.forEach((link, index) => { value = value.replace(`@@HWLINK${index}@@`, link); });
  return value;
};
const renderRichText = (raw = '') => {
  const lines = String(raw).replace(/\r/g, '').split('\n');
  const chunks = [];
  let list = [];
  const flushList = () => {
    if (!list.length) return;
    chunks.push(`<ul>${list.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`);
    list = [];
  };
  for (const line of lines) {
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) { list.push(bullet[1]); continue; }
    flushList();
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = Math.min(4, heading[1].length + 1);
      chunks.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
    } else if (line.trim()) {
      chunks.push(`<p>${renderInlineMarkdown(line.trim())}</p>`);
    }
  }
  flushList();
  return chunks.join('');
};

const productionCss = await fs.readFile(path.join(root, 'assets', 'v8-home-v6.css'), 'utf8');
const builderCss = `
.v8-v6-home .v6-hero-facts,.v8-v6-home .v6-finding-facts,.v8-v6-home .v6-recognition-grid,
.v8-v6-home .v6-outcome-grid,.v8-v6-home .v6-gift-grid,.v8-v6-home .v6-circle-grid{
  grid-template-columns:repeat(auto-fit,minmax(145px,1fr))!important;
}
.hw-bg-forest{background:#153A2E!important;color:#FAF6EF}.hw-bg-ivory{background:#FAF6EF!important}
.hw-bg-sage{background:#6D7D6A!important}.hw-bg-copper{background:#B53A2A!important;color:#fff}
.hw-bg-gold{background:#E0A443!important}.hw-bg-charcoal{background:#333!important;color:#fff}
.hw-bg-white{background:#fff!important}.hw-bg-black{background:#000!important;color:#fff}.hw-bg-gray{background:#eeeae4!important}
.hw-heading-forest h1,.hw-heading-forest h2,.hw-heading-forest h3{color:#153A2E!important}
.hw-heading-ivory h1,.hw-heading-ivory h2,.hw-heading-ivory h3{color:#FAF6EF!important}
.hw-heading-sage h1,.hw-heading-sage h2,.hw-heading-sage h3{color:#6D7D6A!important}
.hw-heading-copper h1,.hw-heading-copper h2,.hw-heading-copper h3{color:#B53A2A!important}
.hw-heading-gold h1,.hw-heading-gold h2,.hw-heading-gold h3{color:#E0A443!important}
.hw-heading-charcoal h1,.hw-heading-charcoal h2,.hw-heading-charcoal h3{color:#333!important}
.hw-heading-white h1,.hw-heading-white h2,.hw-heading-white h3{color:#fff!important}
.hw-heading-black h1,.hw-heading-black h2,.hw-heading-black h3{color:#000!important}
.hw-text-forest p,.hw-text-forest li{color:#153A2E!important}.hw-text-ivory p,.hw-text-ivory li{color:#FAF6EF!important}
.hw-text-sage p,.hw-text-sage li{color:#6D7D6A!important}.hw-text-copper p,.hw-text-copper li{color:#B53A2A!important}
.hw-text-gold p,.hw-text-gold li{color:#E0A443!important}.hw-text-charcoal p,.hw-text-charcoal li{color:#333!important}
.hw-text-white p,.hw-text-white li{color:#fff!important}.hw-text-black p,.hw-text-black li{color:#000!important}
.hw-accent-copper .v6-eyebrow,.hw-accent-copper .hw-eyebrow{color:#B53A2A!important}
.hw-accent-gold .v6-eyebrow,.hw-accent-gold .hw-eyebrow{color:#E0A443!important}
.hw-accent-sage .v6-eyebrow,.hw-accent-sage .hw-eyebrow{color:#6D7D6A!important}
.hw-heading-size-small h1,.hw-heading-size-small h2{font-size:clamp(2rem,3.4vw,3.2rem)!important}
.hw-heading-size-large h1,.hw-heading-size-large h2{font-size:clamp(3rem,5vw,5rem)!important}
.hw-body-size-small p,.hw-body-size-small li{font-size:.92rem!important}.hw-body-size-large p,.hw-body-size-large li{font-size:1.18rem!important}
.hw-align-center{text-align:center}.hw-align-right{text-align:right}.hw-font-inter h1,.hw-font-inter h2,.hw-font-inter h3{font-family:Inter,Arial,sans-serif!important}
.hw-font-playfair h1,.hw-font-playfair h2,.hw-font-playfair h3{font-family:"Playfair Display",Georgia,serif!important}
.hw-spacing-compact{padding-top:40px!important;padding-bottom:40px!important}.hw-spacing-spacious{padding-top:120px!important;padding-bottom:120px!important}
.hw-custom-section{padding:72px 0}.hw-custom-shell{width:min(1120px,calc(100% - 40px));margin:0 auto}
.hw-custom-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:32px;align-items:center}
.hw-custom-section img{display:block;width:100%;height:auto;border-radius:6px}.hw-custom-section h2{font-family:var(--serif,Georgia,serif);color:var(--forest,#153A2E);font-size:clamp(2rem,4vw,3.8rem);line-height:1.05}
.hw-custom-section p,.hw-custom-section li{line-height:1.7}.hw-custom-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-top:28px}
.hw-custom-card{padding:24px;border:1px solid rgba(21,58,46,.12);background:rgba(255,255,255,.72)}
.hw-custom-quote{font-family:var(--serif,Georgia,serif);font-size:clamp(1.6rem,3vw,2.6rem);line-height:1.35}
.hw-custom-cta{display:flex;gap:24px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.hw-custom-comparison{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(21,58,46,.15);margin-top:24px}
.hw-custom-comparison>div{padding:24px;background:#fff}.hw-custom-divider{border:0;border-top:1px solid rgba(21,58,46,.18)}
.hw-custom-spacer-small{height:32px}.hw-custom-spacer-medium{height:64px}.hw-custom-spacer-large{height:112px}
@media(max-width:720px){.hw-custom-section{padding:52px 0}.hw-custom-comparison{grid-template-columns:1fr}.hw-custom-cta{align-items:flex-start}}
`;
const styles = `<style id="homeward-v8-v6-production">${productionCss}\n${builderCss}</style>`;

const renderRecognition = () => {
  const r = v8.homepage.recognition || {};
  const legacyItems = [
    { icon: 'headHeart', text: r.questions?.[0] || '' },
    { icon: 'prayer', text: r.questions?.[1] || '' },
    { icon: 'book', text: r.authors?.length ? `You may have read ${r.authors.slice(0,-1).join(', ')}, or ${r.authors.at(-1)}—and still wish you had people to actually practice with.` : '' },
    { icon: 'question', text: r.questions?.[2] || '' },
    { icon: 'sunrise', text: r.questions?.[3] || '' },
  ];
  const items = enabledItems(r.items?.length ? r.items : legacyItems);
  return `<section data-v8-section="recognition" class="v6-recognition v6-section ${styleClasses(r.style)}"><div class="v6-shell"><div class="v6-recognition-head v6-center"><p class="v6-eyebrow">${esc(r.eyebrow)}</p><h2>${esc(r.heading)}</h2><p class="v6-lead">${esc(r.intro)}</p></div><div class="v6-recognition-grid">${items.map((it)=>`<div class="v6-recognition-item">${icon(it.icon,'question')}<p>${esc(it.text)}</p></div>`).join('')}</div><p class="v6-recognition-end v6-center">${esc(r.honest_line)}</p></div></section>`;
};

const renderPractice = () => {
  const p = v8.homepage.practice_bridge || {};
  const legacy = [
    {icon:'brain',label:'Better Focus',detail:'& Clarity'}, {icon:'heart',label:'More Peace',detail:'& Steadiness'},
    {icon:'sun',label:'More Joy',detail:'& Happiness'}, {icon:'person',label:'Closer to God',detail:'& Others'},
    {icon:'leaf',label:'Ready to Love',detail:'& Serve'},
  ];
  const outcomes = enabledItems(p.outcome_items?.length ? p.outcome_items : legacy);
  return `<section data-v8-section="practice_bridge" class="v6-practice v6-section ${styleClasses(p.style)}"><div class="v6-shell"><div class="v6-practice-grid"><div><p class="v6-eyebrow">${esc(p.eyebrow)}</p><h2 class="v6-practice-title">Spiritual Practices:<span>Exercises for the Heart and Mind</span></h2></div><div class="v6-practice-copy">${paras(p.body)}</div><div class="v6-outcome-grid">${outcomes.map((it)=>`<div class="v6-outcome">${icon(it.icon,'leaf')}<div>${esc(it.label)}<br>${esc(it.detail)}</div></div>`).join('')}</div></div></div></section>`;
};

const renderGifts = () => {
  const g = v8.homepage.gifts || {};
  const items = enabledItems(g.items);
  return `<section data-v8-section="gifts" class="v6-gifts v6-section ${styleClasses(g.style)}"><div class="v6-shell"><div class="v6-gifts-head v6-center"><p class="v6-eyebrow">${esc(g.eyebrow)}</p><h2>${esc(g.heading)}</h2><p class="v6-lead">${esc(g.bridge)}</p></div><div class="v6-gift-grid">${items.map((it,idx)=>`<article class="v6-gift"><div class="v6-gift-img">${it.image ? `<img src="${attr(it.image)}" alt="${attr(it.image_alt)}">` : ''}<span class="v6-gift-badge">${idx+1}</span></div><div class="v6-gift-copy"><h3>${esc(it.title)}</h3><p>${esc(it.description)}</p></div></article>`).join('')}</div></div></section>`;
};

const renderCircle = () => {
  const d = v8.homepage.difference || {};
  const legacy = [
    {icon:'people',title:'Six to eight people',description:'Small enough for everyone to be known.'},
    {icon:'calendar',title:'Four weeks',description:'Short enough to say yes, long enough to go deep.'},
    {icon:'leaf',title:'Ancient practices',description:'Meditation, prayer, Scripture, and silence.'},
    {icon:'chat',title:'Honest conversation',description:'No fixing, no debating—just real listening.'},
    {icon:'cross',title:'Jesus at the center',description:'We practice to grow in love of God and neighbor.'},
  ];
  const features = enabledItems(d.features?.length ? d.features : legacy);
  return `<section data-v8-section="difference" class="v6-circle v6-section ${styleClasses(d.style)}"><div class="v6-shell"><div class="v6-circle-head v6-center"><p class="v6-eyebrow">${esc(d.eyebrow)}</p><h2>${esc(d.heading)}</h2><p class="v6-circle-sub">It's not a class. It's a guided experience.</p></div><div class="v6-circle-grid">${features.map((it)=>`<div class="v6-circle-item">${icon(it.icon,'leaf')}<strong>${esc(it.title)}</strong><span>${esc(it.description)}</span></div>`).join('')}</div><div class="v6-circle-body"><p>Understanding matters. Homeward adds encounter, personal reflection, practice, and formation—so Scripture and prayer become part of the way we actually live.</p><p class="v6-signature">${esc(d.signature)}</p><p>${esc(d.closing)}</p></div></div></section>`;
};

const renderFinding = () => {
  const f = v8.homepage.finding_home || {};
  const items = enabledItems(f.logistics);
  return `<section data-v8-section="finding_home" class="v6-finding ${styleClasses(f.style)}"><div class="v6-shell"><div class="v6-finding-card"><div class="v6-finding-title"><div class="botanical"><svg viewBox="0 0 80 92" aria-hidden="true"><path d="M40 88V18M40 30C30 21 19 20 9 24c7 10 18 15 31 13M40 42c11-10 23-12 34-8-7 12-19 17-34 15M40 56c-12-9-25-9-34-4 8 10 19 15 34 12M40 68c10-9 21-10 32-6-7 10-18 15-32 13"/><path d="M22 20c5-10 11-15 18-18 7 4 13 10 17 19"/><path d="M19 88h42"/></svg></div><p class="v6-eyebrow">${esc(f.eyebrow)}</p><h2>${esc(f.title)}</h2><p>${esc(f.heading)}</p></div><div class="v6-finding-right"><div class="v6-finding-facts">${items.map((it)=>`<div class="v6-finding-fact">${icon(it.icon,'calendar')}<strong>${esc(it.label)}</strong><small>${esc(it.detail)}</small></div>`).join('')}</div><div class="v6-finding-footer"><p><strong>${esc(f.availability)}</strong> Exact days and times will be shared after your conversation.</p>${button(f.link_label,f.link_url,false,'data-event="circle_interest_click"')}</div></div></div></div></section>`;
};

const renderJourney = () => {
  const j = v8.homepage.journey || {};
  const benefits = enabledItems(j.benefit_items).map((item) => typeof item === 'string' ? item : item.text);
  return `<section data-v8-section="journey" class="v6-journey v6-section ${styleClasses(j.style)}" id="journey"><div class="v6-shell"><div class="v6-journey-grid"><div class="v6-journey-art">${j.image ? `<img src="${attr(j.image)}" alt="A spiral illustrating recurring movements in the spiritual journey">` : ''}</div><div><p class="v6-eyebrow">${esc(j.eyebrow)}</p><h2>${esc(j.heading)}</h2><p class="v6-lead">${esc(j.description)}</p><aside class="v6-journey-benefit"><h3>${esc(j.benefit_heading)}</h3><ul>${benefits.map((x)=>`<li><span class="v6-check">✓</span><span>${esc(x)}</span></li>`).join('')}</ul><p class="v6-journey-note">${esc(j.benefit_text)}</p></aside><div class="v6-journey-actions">${button(j.cta_label,j.cta_url,false,'data-event="journey_reflection_start"')}</div></div></div></div></section>`;
};

const renderFounder = () => {
  const f = v8.homepage.founder || {};
  return `<section data-v8-section="founder" class="v6-founder ${styleClasses(f.style)}"><div class="v6-shell"><div class="v6-founder-grid">${f.image ? `<img src="${attr(f.image)}" alt="${attr(f.image_alt)}">` : ''}<div><p class="v6-eyebrow">${esc(f.eyebrow)}</p><h2>${esc(f.heading)}</h2><p>${esc(f.body)}</p><a href="${attr(f.link_url)}">${esc(f.link_label)}</a></div></div></div></section>`;
};

const renderFit = () => {
  const f = circles.fit || {};
  const fit = (f.fit_items || []).slice(0,4);
  const no = (f.not_items || []).slice(0,4).map((x)=>x.replace(/eight-week/gi,'four-week'));
  return `<section data-v8-section="fit" class="v6-fit"><div class="v6-shell"><div class="v6-fit-grid"><div class="v6-fit-col"><h3>${esc(f.fit_heading || 'You may feel at home if...')}</h3><ul class="v6-fit-list">${fit.map(x=>`<li><span class="v6-fit-symbol">✓</span><span>${esc(x)}</span></li>`).join('')}</ul></div><div class="v6-fit-col negative"><h3>${esc((f.not_heading || 'A Circle may not be the best fit if...').replace('probably not the right fit','may not be the best fit'))}</h3><ul class="v6-fit-list">${no.map(x=>`<li><span class="v6-fit-symbol">×</span><span>${esc(x)}</span></li>`).join('')}</ul></div></div></div></section>`;
};

const renderHero = () => {
  const h = v8.homepage.hero || {};
  const emphasis = esc(h.emphasis).replace(/^But were you ever taught\s*/i,'');
  const legacyFacts = [
    {icon:'pin',line1:'In person in',line2:'Fort Worth'}, {icon:'wifi',line1:'Online',line2:'Circles'},
    {icon:'person',line1:'No church',line2:'membership'}, {icon:'heart',line1:'No settled beliefs',line2:'required'},
    {icon:'coin',line1:'No',line2:'cost'},
  ];
  const facts = enabledItems(h.facts?.length ? h.facts : legacyFacts);
  return `<section data-v8-section="hero" class="v6-hero ${styleClasses(h.style)}"><div class="v6-hero-media">${h.image ? `<img src="${attr(h.image)}" alt="${attr(h.image_alt)}">` : ''}</div><div class="v6-shell v6-hero-grid"><div class="v6-hero-copy"><p class="v6-eyebrow">THE MISSING HOW-TO OF SPIRITUAL LIFE</p><h1>${esc(h.headline)}<br>But were you ever taught <span class="accent">${emphasis}</span></h1><p class="hero-desc">${esc(h.description)}</p><div class="v6-hero-facts">${facts.map((it)=>`<div class="v6-hero-fact">${icon(it.icon,'leaf')}<span>${esc(it.line1)}<br><strong>${esc(it.line2)}</strong></span></div>`).join('')}</div><div class="v6-hero-actions">${button(h.primary_label,h.primary_url,false,'data-event="circle_interest_click"')} ${button(h.secondary_label,h.secondary_url,true,'data-event="circle_details_view"')}</div><p class="v6-hero-micro">Fall Circles are forming now. You can begin curious, uncertain, or simply ready to practice.</p></div></div></section>`;
};

const renderCustomSection = (section = {}) => {
  if (!section || section.enabled === false) return '';
  const id = section.id || `custom-${Math.random().toString(36).slice(2,8)}`;
  const classes = `hw-custom-section ${styleClasses(section.style)}`.trim();
  const eyebrow = section.eyebrow ? `<p class="hw-eyebrow v6-eyebrow">${esc(section.eyebrow)}</p>` : '';
  const heading = section.heading ? `<h2>${esc(section.heading)}</h2>` : '';
  const body = section.body ? `<div class="hw-custom-body">${renderRichText(section.body)}</div>` : '';
  const image = section.image ? `<figure><img src="${attr(section.image)}" alt="${attr(section.image_alt || '')}">${section.caption ? `<figcaption>${esc(section.caption)}</figcaption>` : ''}</figure>` : '';
  const cta = section.button_label ? button(section.button_label, section.button_url || '#', false) : '';
  switch (section.type) {
    case 'text_image':
      return `<section data-v8-section="${attr(id)}" class="${classes}"><div class="hw-custom-shell"><div class="hw-custom-grid"><div>${eyebrow}${heading}${body}${cta}</div>${image}</div></div></section>`;
    case 'image_text':
      return `<section data-v8-section="${attr(id)}" class="${classes}"><div class="hw-custom-shell"><div class="hw-custom-grid">${image}<div>${eyebrow}${heading}${body}${cta}</div></div></div></section>`;
    case 'full_width_image':
      return `<section data-v8-section="${attr(id)}" class="${classes}"><div class="hw-custom-shell">${eyebrow}${heading}${image}${body}</div></section>`;
    case 'quote':
      return `<section data-v8-section="${attr(id)}" class="${classes}"><div class="hw-custom-shell"><blockquote class="hw-custom-quote">${renderInlineMarkdown(section.quote || section.body || '')}</blockquote>${section.attribution ? `<p>— ${esc(section.attribution)}</p>` : ''}</div></section>`;
    case 'card_grid':
    case 'icon_grid': {
      const items = enabledItems(section.items);
      return `<section data-v8-section="${attr(id)}" class="${classes}"><div class="hw-custom-shell">${eyebrow}${heading}${body}<div class="hw-custom-cards">${items.map((item)=>`<article class="hw-custom-card">${section.type === 'icon_grid' ? icon(item.icon,'leaf') : (item.image ? `<img src="${attr(item.image)}" alt="${attr(item.image_alt || '')}">` : '')}<h3>${esc(item.title)}</h3>${item.body ? renderRichText(item.body) : ''}</article>`).join('')}</div></div></section>`;
    }
    case 'cta':
    case 'callout':
      return `<section data-v8-section="${attr(id)}" class="${classes}"><div class="hw-custom-shell hw-custom-cta"><div>${eyebrow}${heading}${body}</div>${cta}</div></section>`;
    case 'comparison': {
      const rows = enabledItems(section.rows);
      return `<section data-v8-section="${attr(id)}" class="${classes}"><div class="hw-custom-shell">${eyebrow}${heading}${body}<div class="hw-custom-comparison"><div><h3>${esc(section.left_heading || '')}</h3>${rows.map((r)=>`<p>${esc(r.left || '')}</p>`).join('')}</div><div><h3>${esc(section.right_heading || '')}</h3>${rows.map((r)=>`<p>${esc(r.right || '')}</p>`).join('')}</div></div></div></section>`;
    }
    case 'video': {
      const url = safeHref(section.video_url || '');
      const frame = /^https?:\/\//i.test(url) ? `<div class="video-frame"><iframe src="${attr(url)}" title="${attr(section.video_title || section.heading || 'Homeward video')}" loading="lazy" allowfullscreen></iframe></div>` : '';
      return `<section data-v8-section="${attr(id)}" class="${classes}"><div class="hw-custom-shell">${eyebrow}${heading}${body}${frame}</div></section>`;
    }
    case 'divider':
      return `<section data-v8-section="${attr(id)}" class="${classes}"><div class="hw-custom-shell"><hr class="hw-custom-divider"></div></section>`;
    case 'spacer': {
      const size = ['small','medium','large'].includes(section.spacer_size) ? section.spacer_size : 'medium';
      return `<section data-v8-section="${attr(id)}" class="hw-custom-spacer-${size}" aria-hidden="true"></section>`;
    }
    case 'editorial':
    default:
      return `<section data-v8-section="${attr(id)}" class="${classes}"><div class="hw-custom-shell">${eyebrow}${heading}${body}${cta}</div></section>`;
  }
};

const DEFAULT_SECTION_ORDER = ['hero','recognition','practice_bridge','gifts','difference','finding_home','journey','practice_bears_fruit','founder','fit','interest','faq'];
const resolveOrder = () => {
  const configured = Array.isArray(v8.homepage.section_order) ? v8.homepage.section_order : [];
  const custom = enabledItems(v8.homepage.custom_sections);
  const customIds = new Set(custom.map((item) => item.id).filter(Boolean));
  const known = new Set([...DEFAULT_SECTION_ORDER, ...customIds]);
  const seen = new Set();
  const order = [];
  for (const item of configured) {
    const id = typeof item === 'string' ? item : item?.id;
    if (!id || !known.has(id) || seen.has(id)) continue;
    seen.add(id);
    order.push({ id, enabled: typeof item === 'string' ? true : item.enabled !== false });
  }
  for (const id of DEFAULT_SECTION_ORDER) {
    if (!seen.has(id)) {
      seen.add(id);
      order.push({ id, enabled: true });
    }
  }
  for (const section of custom) {
    if (section.id && !seen.has(section.id)) {
      seen.add(section.id);
      order.push({ id: section.id, enabled: true });
    }
  }
  return order;
};

export function renderHomeV6(sourceHtml) {
  const inherited = {
    remembering: markSection(extractSection(sourceHtml, 'remembering'), 'remembering'),
    interest: markSection(extractSection(sourceHtml, 'interest'), 'interest'),
    faq: markSection(extractSection(sourceHtml, 'faq'), 'faq'),
    practice_bears_fruit:
      markSection(extractSection(sourceHtml, 'practice-bears-fruit'), 'practice_bears_fruit') ||
      markSection(extractSection(sourceHtml, 'practice_bears_fruit'), 'practice_bears_fruit'),
  };
  const customMap = new Map((v8.homepage.custom_sections || []).filter(Boolean).map((section) => [section.id, section]));
  const renderers = {
    hero: () => v8.homepage.hero?.enabled === false ? '' : renderHero(),
    recognition: () => v8.homepage.recognition?.enabled === false ? '' : renderRecognition(),
    practice_bridge: () => v8.homepage.practice_bridge?.enabled === false ? '' : renderPractice(),
    gifts: () => v8.homepage.gifts?.enabled === false ? '' : renderGifts(),
    difference: () => v8.homepage.difference?.enabled === false ? '' : renderCircle(),
    finding_home: () => v8.homepage.finding_home?.enabled === false ? '' : renderFinding(),
    journey: () => v8.homepage.journey?.enabled === false ? '' : renderJourney(),
    founder: () => v8.homepage.founder?.enabled === false ? '' : renderFounder(),
    fit: renderFit,
    remembering: () => inherited.remembering,
    interest: () => inherited.interest,
    faq: () => inherited.faq,
    practice_bears_fruit: () => inherited.practice_bears_fruit,
  };

  const pieces = [];
  for (const item of resolveOrder()) {
    if (item.enabled === false) continue;
    const renderer = renderers[item.id];
    if (renderer) {
      const html = renderer();
      if (html) pieces.push(html);
      continue;
    }
    const custom = customMap.get(item.id);
    if (custom?.enabled !== false) {
      const html = renderCustomSection(custom);
      if (html) pieces.push(html);
    }
  }

  const newMain = `<main>${pieces.join('')}</main>`;
  let html = sourceHtml.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, newMain);
  html = html.replace('</head>', `${styles}</head>`);
  html = html.replace(/<body(\s[^>]*)?>/i, (m, attrs='') => `<body${attrs} class="v8-v6-home">`);
  html = html.replace(/<meta content="7\.1\.0" name="homeward-version"\/>/i, '<meta content="8.0.0" name="homeward-version"/>');
  return html;
}
