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
const shown = (item) => item && item.enabled !== false;
const values = (items = []) => items.filter(shown);
const itemText = (item, key = 'text') => typeof item === 'string' ? item : (item?.[key] || '');
const rich = (value = '') => {
  const source = String(value).trim();
  if (!source) return '';
  const inline = (line) => esc(line)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/?[^\s)]*)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/(^|[^_])_([^_]+)_/g, '$1<em>$2</em>');
  const blocks = source.split(/\n\s*\n/);
  return blocks.map((block) => {
    const lines = block.split('\n');
    if (lines.every((line) => /^[-*]\s+/.test(line))) return `<ul>${lines.map((line) => `<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
    if (lines.every((line) => /^\d+\.\s+/.test(line))) return `<ol>${lines.map((line) => `<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`).join('')}</ol>`;
    const heading = lines[0].match(/^(#{2,4})\s+(.+)/);
    if (heading && lines.length === 1) return `<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`;
    return `<p>${lines.map(inline).join('<br>')}</p>`;
  }).join('');
};

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
  cross: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M21 5h6v13h10v6H27v19h-6V24H11v-6h10Z"/></svg>'
};

const extractSection = (html, id) => {
  const re = new RegExp(`<section\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>[\\s\\S]*?<\\/section>`, 'i');
  return html.match(re)?.[0] || '';
};

const button = (label, url, secondary = false, extra = '') =>
  `<a class="button ${secondary ? 'button-secondary' : ''}" href="${attr(url)}" ${extra}>${esc(label)}</a>`;

const heroFacts = [
  ['pin', 'In person in', 'Fort Worth'],
  ['wifi', 'Online', 'Circles'],
  ['person', 'No church', 'membership'],
  ['heart', 'No settled beliefs', 'required'],
  ['coin', 'No', 'cost'],
];

const practiceOutcomes = [
  ['brain', 'Better Focus', '& Clarity'],
  ['heart', 'More Peace', '& Steadiness'],
  ['sun', 'More Joy', '& Happiness'],
  ['person', 'Closer to God', '& Others'],
  ['leaf', 'Ready to Love', '& Serve'],
];

const circleFeatures = [
  ['people', 'Six to eight people', 'Small enough for everyone to be known.'],
  ['calendar', 'Four weeks', 'Short enough to say yes, long enough to go deep.'],
  ['leaf', 'Ancient practices', 'Meditation, prayer, Scripture, and silence.'],
  ['chat', 'Honest conversation', 'No fixing, no debating—just real listening.'],
  ['cross', 'Jesus at the center', 'We practice to grow in love of God and neighbor.'],
];

const productionCss = await fs.readFile(path.join(root, 'assets', 'v8-home-v6.css'), 'utf8');
const builderCss = `
.v6-recognition-grid,.v6-circle-grid{grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr))}
.v6-gift-grid{grid-template-columns:repeat(auto-fit,minmax(min(230px,100%),1fr))}
.v6-finding-facts{grid-template-columns:repeat(auto-fit,minmax(min(145px,100%),1fr))}
.v8-builder-section{padding:var(--builder-space,82px) 0;background:var(--builder-bg,#fff);color:var(--builder-body,#333);text-align:var(--builder-align,left)}
.v8-builder-section h2,.v8-builder-section h3{color:var(--builder-heading,#153A2E);font-family:var(--builder-font,Playfair Display,Georgia,serif)}
.v8-builder-section a:not(.button){color:var(--builder-accent,#B53A2A)}
.v8-builder-section[data-heading-size="small"] h2{font-size:clamp(1.8rem,3vw,2.7rem)}.v8-builder-section[data-heading-size="large"] h2{font-size:clamp(2.8rem,5vw,4.6rem)}
.v8-builder-section[data-body-size="small"]{font-size:.9rem}.v8-builder-section[data-body-size="large"]{font-size:1.15rem}
.v8-builder-media-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(28px,6vw,76px);align-items:center}.v8-builder-media-grid.image-right .v8-builder-media{order:2}
.v8-builder-media img,.v8-builder-full-image img{width:100%;max-height:620px;object-fit:cover;object-position:var(--builder-focus,center)}
.v8-builder-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(230px,100%),1fr));gap:20px;margin-top:34px}.v8-builder-card{padding:26px;background:rgba(255,255,255,.82);border:1px solid rgba(21,58,46,.13)}
.v8-builder-quote{max-width:850px;margin:auto;font-family:var(--serif);font-size:clamp(1.7rem,3.5vw,3rem);line-height:1.25}.v8-builder-quote cite{display:block;margin-top:20px;font:600 .8rem Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase}
.v8-builder-video{position:relative;aspect-ratio:16/9}.v8-builder-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.v8-builder-divider{height:1px;background:rgba(21,58,46,.2)}
@media(max-width:720px){.v8-builder-media-grid{grid-template-columns:1fr}.v8-builder-media-grid.image-right .v8-builder-media{order:0}.v8-builder-section{padding:calc(var(--builder-space,82px)*.7) 0}}
`;
const styles = `<style id="homeward-v8-v6-production">${productionCss}${builderCss}</style>`;

const renderRecognition = () => {
  const r = v8.homepage.recognition;
  const questions = values(r.questions).map((item) => itemText(item));
  const authors = values(r.authors).map((item) => itemText(item, 'name'));
  const items = [
    { icon: 'headHeart', text: questions[0] || '' },
    { icon: 'prayer', text: questions[1] || '' },
    { icon: 'book', text: authors.length ? `You may have read ${authors.slice(0,-1).join(', ')}${authors.length > 1 ? `, or ${authors.at(-1)}` : ''}—and still wish you had people to actually practice with.` : '' },
    { icon: 'question', text: questions[2] || '' },
    { icon: 'sunrise', text: questions[3] || '' },
  ].filter((item) => item.text);
  return `<section class="v6-recognition v6-section"><div class="v6-shell"><div class="v6-recognition-head v6-center"><p class="v6-eyebrow">${esc(r.eyebrow)}</p><h2>${esc(r.heading)}</h2><p class="v6-lead">${esc(r.intro)}</p></div><div class="v6-recognition-grid">${items.map((it)=>`<div class="v6-recognition-item">${svg[it.icon]}<p>${esc(it.text)}</p></div>`).join('')}</div><p class="v6-recognition-end v6-center">${esc(r.honest_line)}</p></div></section>`;
};

const renderPractice = () => {
  const p = v8.homepage.practice_bridge;
  const outcomes = p.outcome_items?.length ? values(p.outcome_items).map((item) => [item.icon, item.line1, item.line2]) : practiceOutcomes;
  return `<section class="v6-practice v6-section"><div class="v6-shell"><div class="v6-practice-grid"><div><p class="v6-eyebrow">${esc(p.eyebrow)}</p><h2 class="v6-practice-title">Spiritual Practices:<span>Exercises for the Heart and Mind</span></h2></div><div class="v6-practice-copy">${rich(p.body)}</div><div class="v6-outcome-grid">${outcomes.map(([i,a,b])=>`<div class="v6-outcome">${svg[i] || svg.leaf}<div>${esc(a)}<br>${esc(b)}</div></div>`).join('')}</div></div></div></section>`;
};

const renderGifts = () => {
  const g = v8.homepage.gifts;
  return `<section class="v6-gifts v6-section"><div class="v6-shell"><div class="v6-gifts-head v6-center"><p class="v6-eyebrow">${esc(g.eyebrow)}</p><h2>${esc(g.heading)}</h2><p class="v6-lead">${esc(g.bridge)}</p></div><div class="v6-gift-grid">${values(g.items).map((it,idx)=>`<article class="v6-gift">${it.image ? `<div class="v6-gift-img"><img src="${attr(it.image)}" alt="${attr(it.image_alt)}" style="object-position:${attr(it.image_focus || 'center')}"><span class="v6-gift-badge">${idx+1}</span></div>` : ''}<div class="v6-gift-copy"><h3>${esc(it.title)}</h3><p>${esc(it.description)}</p>${it.caption ? `<small>${esc(it.caption)}</small>` : ''}</div></article>`).join('')}</div></div></section>`;
};

const renderCircle = () => {
  const d = v8.homepage.difference;
  const features = d.items?.length ? values(d.items).map((item) => [item.icon, item.title, item.description]) : circleFeatures;
  return `<section class="v6-circle v6-section"><div class="v6-shell"><div class="v6-circle-head v6-center"><p class="v6-eyebrow">${esc(d.eyebrow)}</p><h2>${esc(d.heading)}</h2><p class="v6-circle-sub">It's not a class. It's a guided experience.</p></div><div class="v6-circle-grid">${features.map(([i,a,b])=>`<div class="v6-circle-item">${svg[i] || svg.leaf}<strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join('')}</div><div class="v6-circle-body"><p>Understanding matters. Homeward adds encounter, personal reflection, practice, and formation—so Scripture and prayer become part of the way we actually live.</p><p class="v6-signature">${esc(d.signature)}</p>${rich(d.closing)}</div></div></section>`;
};

const renderFinding = () => {
  const f = v8.homepage.finding_home;
  const icons = ['calendar','calendar','people','pin','coin'];
  return `<section class="v6-finding"><div class="v6-shell"><div class="v6-finding-card"><div class="v6-finding-title"><div class="botanical"><svg viewBox="0 0 80 92" aria-hidden="true"><path d="M40 88V18M40 30C30 21 19 20 9 24c7 10 18 15 31 13M40 42c11-10 23-12 34-8-7 12-19 17-34 15M40 56c-12-9-25-9-34-4 8 10 19 15 34 12M40 68c10-9 21-10 32-6-7 10-18 15-32 13"/><path d="M22 20c5-10 11-15 18-18 7 4 13 10 17 19"/><path d="M19 88h42"/></svg></div><p class="v6-eyebrow">${esc(f.eyebrow)}</p><h2>${esc(f.title)}</h2><p>${esc(f.heading)}</p></div><div class="v6-finding-right"><div class="v6-finding-facts">${values(f.logistics).map((it,idx)=>`<div class="v6-finding-fact">${svg[it.icon || icons[idx] || 'calendar'] || svg.calendar}<strong>${esc(it.label)}</strong><small>${esc(it.detail)}</small></div>`).join('')}</div><div class="v6-finding-footer"><p><strong>${esc(f.availability)}</strong> Exact days and times will be shared after your conversation.</p>${button(f.link_label,f.link_url,false,'data-event="circle_interest_click"')}</div></div></div></div></section>`;
};

const renderJourney = () => {
  const j = v8.homepage.journey;
  return `<section class="v6-journey v6-section" id="journey"><div class="v6-shell"><div class="v6-journey-grid">${j.image ? `<div class="v6-journey-art"><img src="${attr(j.image)}" alt="${attr(j.image_alt || 'A spiral illustrating recurring movements in the spiritual journey')}"></div>` : ''}<div><p class="v6-eyebrow">${esc(j.eyebrow)}</p><h2>${esc(j.heading)}</h2><p class="v6-lead">${esc(j.description)}</p><aside class="v6-journey-benefit"><h3>${esc(j.benefit_heading)}</h3><ul>${values(j.benefit_items).map((x)=>`<li><span class="v6-check">✓</span><span>${esc(itemText(x))}</span></li>`).join('')}</ul><p class="v6-journey-note">${esc(j.benefit_text)}</p></aside><div class="v6-journey-actions">${button(j.cta_label,j.cta_url,false,'data-event="journey_reflection_start"')}</div></div></div></div></section>`;
};

const renderFounder = () => {
  const f = v8.homepage.founder;
  return `<section class="v6-founder"><div class="v6-shell"><div class="v6-founder-grid"><img src="${attr(f.image)}" alt="${attr(f.image_alt)}"><div><p class="v6-eyebrow">${esc(f.eyebrow)}</p><h2>${esc(f.heading)}</h2><p>${esc(f.body)}</p><a href="${attr(f.link_url)}">${esc(f.link_label)}</a></div></div></div></section>`;
};

const renderFit = () => {
  const f = circles.fit || {};
  const fit = (f.fit_items || []).slice(0,4);
  const no = (f.not_items || []).slice(0,4).map((x)=>x.replace(/eight-week/gi,'four-week'));
  return `<section class="v6-fit"><div class="v6-shell"><div class="v6-fit-grid"><div class="v6-fit-col"><h3>${esc(f.fit_heading || 'You may feel at home if...')}</h3><ul class="v6-fit-list">${fit.map(x=>`<li><span class="v6-fit-symbol">✓</span><span>${esc(x)}</span></li>`).join('')}</ul></div><div class="v6-fit-col negative"><h3>${esc((f.not_heading || 'A Circle may not be the best fit if...').replace('probably not the right fit','may not be the best fit'))}</h3><ul class="v6-fit-list">${no.map(x=>`<li><span class="v6-fit-symbol">×</span><span>${esc(x)}</span></li>`).join('')}</ul></div></div></div></section>`;
};

const renderHero = () => {
  const h = v8.homepage.hero;
  const emphasis = esc(h.emphasis).replace(/^But were you ever taught\s*/i,'');
  const facts = h.fact_items?.length ? values(h.fact_items).map((item) => [item.icon, item.line1, item.line2]) : heroFacts;
  return `<section class="v6-hero">${h.image ? `<div class="v6-hero-media"><img src="${attr(h.image)}" alt="${attr(h.image_alt)}"></div>` : ''}<div class="v6-shell v6-hero-grid"><div class="v6-hero-copy"><p class="v6-eyebrow">THE MISSING HOW-TO OF SPIRITUAL LIFE</p><h1>${esc(h.headline)}<br>But were you ever taught <span class="accent">${emphasis}</span></h1><p class="hero-desc">${esc(h.description)}</p><div class="v6-hero-facts">${facts.map(([i,a,b])=>`<div class="v6-hero-fact">${svg[i] || svg.heart}<span>${esc(a)}<br><strong>${esc(b)}</strong></span></div>`).join('')}</div><div class="v6-hero-actions">${button(h.primary_label,h.primary_url,false,'data-event="circle_interest_click"')} ${button(h.secondary_label,h.secondary_url,true,'data-event="circle_details_view"')}</div><p class="v6-hero-micro">Fall Circles are forming now. You can begin curious, uncertain, or simply ready to practice.</p></div></div></section>`;
};

const palette = {
  forest: '#153A2E', ivory: '#FAF6EF', sage: '#6D7D6A', copper: '#B53A2A',
  gold: '#E0A443', charcoal: '#333333', white: '#fff', black: '#000', gray: '#F1F0EC',
};
const videoEmbed = (url = '') => {
  const safe = String(url);
  const youtube = safe.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/);
  const vimeo = safe.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return '';
};
const renderCustom = (section) => {
  if (!shown(section) || !section.id) return '';
  const style = section.style || {};
  const spacing = { compact: '48px', standard: '82px', spacious: '124px' }[style.spacing] || '82px';
  const css = `--builder-bg:${palette[style.background] || palette.white};--builder-heading:${palette[style.heading_color] || palette.forest};--builder-body:${palette[style.body_color] || palette.charcoal};--builder-accent:${palette[style.accent_color] || palette.copper};--builder-space:${spacing};--builder-align:${style.alignment || 'left'};--builder-font:${style.font === 'inter' ? 'Inter,Arial,sans-serif' : 'Playfair Display,Georgia,serif'};--builder-focus:${section.image_focus || 'center'}`;
  const heading = section.eyebrow || section.heading ? `<header><p class="v6-eyebrow">${esc(section.eyebrow || '')}</p><h2>${esc(section.heading || '')}</h2></header>` : '';
  const body = `<div class="v8-builder-rich">${rich(section.body)}</div>`;
  const image = section.image ? `<figure class="v8-builder-media"><img src="${attr(section.image)}" alt="${attr(section.image_alt || '')}">${section.caption ? `<figcaption>${esc(section.caption)}</figcaption>` : ''}</figure>` : '';
  let content = `${heading}${body}`;
  if (['text_image','image_text'].includes(section.type)) content = `<div class="v8-builder-media-grid ${section.type === 'text_image' ? 'image-right' : ''}">${image}<div>${heading}${body}</div></div>`;
  if (section.type === 'full_image') content = `<figure class="v8-builder-full-image">${image || ''}${section.caption ? `<figcaption>${esc(section.caption)}</figcaption>` : ''}</figure>`;
  if (section.type === 'quote') content = `<blockquote class="v8-builder-quote">${rich(section.quote || section.body)}${section.attribution ? `<cite>${esc(section.attribution)}</cite>` : ''}</blockquote>`;
  if (['card_grid','icon_grid','comparison'].includes(section.type)) content = `${heading}${body}<div class="v8-builder-card-grid">${values(section.items).map((item) => `<article class="v8-builder-card">${item.image ? `<img src="${attr(item.image)}" alt="${attr(item.image_alt || '')}">` : ''}<h3>${esc(item.heading || item.title || '')}</h3>${rich(item.body || item.description || '')}</article>`).join('')}</div>`;
  if (section.type === 'cta') content = `${heading}${body}<div class="v6-hero-actions">${section.button_label ? button(section.button_label, section.button_url || '#interest') : ''}</div>`;
  if (section.type === 'video') { const embed = videoEmbed(section.video_url); content = `${heading}${body}${embed ? `<div class="v8-builder-video"><iframe src="${attr(embed)}" title="${attr(section.video_title || section.heading || 'Video')}" loading="lazy" allowfullscreen></iframe></div>` : ''}`; }
  if (section.type === 'divider') content = '<div class="v8-builder-divider" aria-hidden="true"></div>';
  if (section.type === 'spacer') content = '';
  return `<section class="v8-builder-section" id="${attr(section.id)}" data-section-type="${attr(section.type || 'editorial')}" data-heading-size="${attr(style.heading_size || 'standard')}" data-body-size="${attr(style.body_size || 'standard')}" style="${attr(css)}"><div class="v6-shell">${content}</div></section>`;
};

export function renderHomeV6(sourceHtml) {
  const remembering = extractSection(sourceHtml, 'remembering');
  const interest = extractSection(sourceHtml, 'interest');
  const faq = extractSection(sourceHtml, 'faq');
  const fixed = {
    hero: renderHero, recognition: renderRecognition, practice_bridge: renderPractice,
    gifts: renderGifts, difference: renderCircle, finding_home: renderFinding,
    journey: renderJourney, practice_bears_fruit: () => remembering,
    founder: renderFounder, fit: renderFit, interest: () => interest, faq: () => faq,
  };
  const defaultOrder = Object.keys(fixed);
  const configured = Array.isArray(v8.homepage.section_order) ? v8.homepage.section_order : [];
  const valid = configured.filter((entry) => entry && typeof entry.id === 'string');
  const seen = new Set();
  const ordered = [...valid, ...defaultOrder.filter((id) => !valid.some((entry) => entry.id === id)).map((id) => ({ id, enabled: true }))];
  const custom = new Map(values(v8.homepage.custom_sections).map((section) => [section.id, section]));
  const sections = ordered.map((entry) => {
    if (seen.has(entry.id) || entry.enabled === false) return '';
    seen.add(entry.id);
    const source = v8.homepage[entry.id];
    if (source?.enabled === false) return '';
    return fixed[entry.id]?.() || renderCustom(custom.get(entry.id));
  }).join('');
  const unorderedCustom = [...custom.values()].filter((section) => !seen.has(section.id)).map(renderCustom).join('');
  const newMain = `<main>${sections}${unorderedCustom}</main>`;
  let html = sourceHtml.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, newMain);
  html = html.replace('</head>', `${styles}</head>`);
  html = html.replace(/<body(\s[^>]*)?>/i, (m, attrs='') => `<body${attrs} class="v8-v6-home">`);
  html = html.replace(/<meta content="7\.1\.0" name="homeward-version"\/>/i, '<meta content="8.0.0" name="homeward-version"/>');
  return html;
}
