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
  output = output.replace(/<h1>[\s\S]*?<\/h1>/i, `<h1>${esc(hero.headline)}<br/><span class="hero-accent">${esc(hero.emphasis)}</span></h1>`);
  output = output.replace(/<p class="hero-lead">[\s\S]*?<\/p>/i, `<p class="hero-lead">${esc(hero.description)}</p>`);
  return output;
});

const updatePractices = (html) => html.replace(sectionPattern('home-practices'), (section) => {
  const p = v9.homepage.practices;
  let output = section;
  output = output.replace(/<p class="eyebrow">[\s\S]*?<\/p>/i, `<p class="eyebrow">${esc(p.eyebrow)}</p>`);
  output = output.replace(/<h2>[\s\S]*?<\/h2>/i, `<h2>${esc(p.heading)}</h2>`);
  output = output.replace(/<p class="practices-subhead">[\s\S]*?<\/p>/i, `<p class="practices-subhead"><strong>${esc(p.subhead)}</strong></p>`);
  output = output.replace(/<p class="practices-lead">[\s\S]*?<\/p>/i, `<p class="practices-lead"><strong>${esc(p.lead_bold)}</strong> ${esc(p.lead_body)}</p>`);
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

const numberedCards = (items, className = 'partner-grid-4') => `<div class="${className}">${items.map((item) => `<article class="partner-card"><span class="number">${esc(item.number)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></article>`).join('')}</div>`;

const renderChurchMain = () => {
  const c = v9.churches;
  const experienceCards = numberedCards(c.experience.items, 'partner-grid-3');
  const afterCards = numberedCards(c.after.items);
  const leadershipCards = numberedCards(c.leadership.items);
  const benefits = c.practice.benefits.map((item) => `<div><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></div>`).join('');
  const renewalPoints = c.renewal.points.map((item) => `<div><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></div>`).join('');
  const pilotFacts = c.pilot.facts.map((item) => `<div class="pilot-fact"><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></div>`).join('');
  const faqs = c.faq.items.map((item) => `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('');
  const f = c.interest.form;
  return `<main>
  <section class="partner-hero"><div class="shell">
    <p class="eyebrow">${esc(c.hero.eyebrow)}</p><h1>${esc(c.hero.heading)}</h1><p class="lead">${esc(c.hero.lead)}</p>
    <div class="partner-hero-actions"><a class="button button-copper" href="#partner-interest">${esc(c.hero.primary_label)}</a><a class="button button-outline" href="/connect.html">${esc(c.hero.secondary_label)}</a></div>
    <p class="partner-meta">${esc(c.hero.meta)}</p>
  </div></section>

  <section class="partner-section"><div class="shell"><div class="section-heading centered"><p class="eyebrow">${esc(c.experience.eyebrow)}</p><h2>${esc(c.experience.heading)}</h2><p>${esc(c.experience.intro)}</p></div>${experienceCards}</div></section>

  <section class="partner-section alt"><div class="shell partner-narrow"><p class="eyebrow">${esc(c.fit.eyebrow)}</p><h2>${esc(c.fit.heading)}</h2><p class="lead">${esc(c.fit.lead)}</p><p>${esc(c.fit.body)}</p><p><strong>${esc(c.fit.emphasis)}</strong></p></div></section>

  <section class="partner-section"><div class="shell"><div class="partner-exercise-grid"><div class="partner-exercise-copy"><p class="eyebrow">${esc(c.practice.eyebrow)}</p><h2>${esc(c.practice.heading)}</h2><p class="lead"><strong>${esc(c.practice.lead)}</strong></p><p>${esc(c.practice.body)}</p><div class="practice-callout"><strong>${esc(c.practice.callout_bold)}</strong> ${esc(c.practice.callout_body)}</div><p>${esc(c.practice.closing)}</p></div><aside class="partner-benefit-panel"><p class="eyebrow">${esc(c.practice.benefits_eyebrow)}</p><div class="partner-benefit-list">${benefits}</div></aside></div></div></section>

  <section class="partner-section alt"><div class="shell"><div class="partner-dark-card"><p class="eyebrow">${esc(c.renewal.eyebrow)}</p><h2>${esc(c.renewal.heading)}</h2><p class="leader-renewal-intro">${esc(c.renewal.intro)}</p><p>${esc(c.renewal.body)}</p><div class="leader-renewal-points">${renewalPoints}</div></div></div></section>

  <section class="partner-section"><div class="shell"><div class="section-heading centered"><p class="eyebrow">${esc(c.pilot.eyebrow)}</p><h2>${esc(c.pilot.heading)}</h2><p>${esc(c.pilot.intro)}</p></div><div class="pilot-facts">${pilotFacts}</div><div class="partner-narrow"><p>${esc(c.pilot.body)}</p><p><strong>${esc(c.pilot.emphasis)}</strong></p></div></div></section>

  <section class="partner-section alt"><div class="shell"><div class="section-heading centered"><p class="eyebrow">${esc(c.after.eyebrow)}</p><h2>${esc(c.after.heading)}</h2></div>${afterCards}</div></section>

  <section class="partner-section"><div class="shell"><div class="section-heading centered"><p class="eyebrow">${esc(c.leadership.eyebrow)}</p><h2>${esc(c.leadership.heading)}</h2><p>${esc(c.leadership.intro)}</p></div>${leadershipCards}</div></section>

  <section class="partner-section alt"><div class="shell partner-narrow"><p class="eyebrow">${esc(c.posture.eyebrow)}</p><h2>${esc(c.posture.heading)}</h2><p class="lead">${esc(c.posture.lead)}</p><p>${esc(c.posture.body)}</p></div></section>

  <section class="partner-section"><div class="shell partner-narrow"><div class="section-heading centered"><p class="eyebrow">${esc(c.faq.eyebrow)}</p><h2>${esc(c.faq.heading)}</h2></div><div class="partner-faq">${faqs}</div></div></section>

  <section class="partner-final-cta" id="partner-interest"><div class="shell partner-interest-grid"><div class="partner-interest-copy"><p class="eyebrow">${esc(c.interest.eyebrow)}</p><h2>${esc(c.interest.heading)}</h2><p>${esc(c.interest.body)}</p><p class="partner-form-reassurance"><strong>${esc(c.interest.reassurance_bold)}</strong> ${esc(c.interest.reassurance_body)}</p><a class="text-link" href="/connect.html">${esc(c.interest.secondary_link)} <span>→</span></a></div>
    <form class="partner-interest-form" id="partner-interest-form"><input type="hidden" name="form_type" value="interest"/><input type="hidden" name="interest" value="${esc(c.interest.hidden_interest)}"/><input type="hidden" name="landing_page" id="partner-landing-page" value=""/><input type="hidden" name="referrer" id="partner-referrer" value=""/>
      <div class="form-row"><label>${esc(f.first_name_label)}<input name="firstName" required/></label><label>${esc(f.last_name_label)}<input name="lastName" required/></label></div>
      <label>${esc(f.email_label)}<input name="email" type="email" required/></label>
      <div class="form-row"><label>${esc(f.organization_label)}<input name="organization" placeholder="${esc(f.organization_placeholder)}"/></label><label>${esc(f.role_label)}<input name="role" placeholder="${esc(f.role_placeholder)}"/></label></div>
      <label>${esc(f.zip_label)}<input name="zip" inputmode="numeric"/></label>
      <label>${esc(f.draw_label)}<textarea name="draw" rows="4" placeholder="${esc(f.draw_placeholder)}"></textarea></label>
      <label class="checkbox"><input name="newsletter" type="checkbox" value="yes"/><span>${esc(f.newsletter_label)}</span></label>
      <button class="button button-copper form-submit" type="submit">${esc(f.submit_label)}</button><p class="form-privacy">${esc(f.privacy)}</p><p class="form-message" role="status" aria-live="polite" hidden></p>
    </form></div></section>
</main>`;
};

const hydrateChurchPage = (html) => {
  const c = v9.churches;
  let output = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(c.meta.title)}</title>`);
  output = output.replace(/<meta name="description" content="[^"]*"\/>/i, `<meta name="description" content="${esc(c.meta.description)}"/>`);
  output = output.replace(/<main>[\s\S]*?<\/main>/i, renderChurchMain());
  return output;
};

const processHtml = async (filePath) => {
  let html = await fs.readFile(filePath, 'utf8');
  const base = path.basename(filePath).toLowerCase();
  if (base === 'churches.html') {
    html = applySharedShell(html, filePath);
    html = hydrateChurchPage(html);
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
