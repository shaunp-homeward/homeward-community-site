import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const filePath = path.join(root, 'dist', 'churches.html');
const v9 = JSON.parse(await fs.readFile(path.join(root, 'content', 'v9-live.json'), 'utf8'));
const c = v9.churches;

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

let html = await fs.readFile(filePath, 'utf8');

if (!html.includes('/assets/v9-churches-cleanup-review.css')) {
  html = html.replace('</head>', '<link rel="stylesheet" href="/assets/v9-churches-cleanup-review.css?v=9">\n</head>');
}

const locateSection = (marker) => {
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) {
    console.warn(`Churches creative pass: marker not found, leaving section unchanged: ${marker}`);
    return null;
  }
  const start = html.lastIndexOf('<section', markerIndex);
  const close = html.indexOf('</section>', markerIndex);
  if (start < 0 || close < 0) {
    console.warn(`Churches creative pass: section bounds not found, leaving unchanged: ${marker}`);
    return null;
  }
  return { start, end: close + '</section>'.length };
};

const replaceSectionContaining = (marker, replacement) => {
  const range = locateSection(marker);
  if (!range) return false;
  html = `${html.slice(0, range.start)}${replacement}${html.slice(range.end)}`;
  return true;
};

replaceSectionContaining('class="partner-hero"', `
<section class="partner-hero">
  <div class="shell">
    <p class="eyebrow">${esc(c.hero.eyebrow)}</p>
    <h1>${esc(c.hero.heading)}</h1>
    <p class="lead">${esc(c.hero.lead)}</p>
    <div class="partner-hero-actions">
      <a class="button button-copper" href="#partner-interest">${esc(c.hero.primary_label)}</a>
      <a class="button button-outline secondary-cta" href="/connect.html">${esc(c.hero.secondary_label)}</a>
    </div>
    <p class="partner-meta">${esc(c.hero.meta)}</p>
  </div>
</section>`);

const experienceCards = c.experience.items
  .map((item) => `<article class="partner-card"><span class="number">${esc(item.number)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></article>`)
  .join('');
replaceSectionContaining(c.experience.eyebrow, `
<section class="partner-section">
  <div class="shell">
    <div class="section-heading centered">
      <p class="eyebrow">${esc(c.experience.eyebrow)}</p>
      <h2>${esc(c.experience.heading)}</h2>
      <p>${esc(c.experience.intro)}</p>
    </div>
    <div class="partner-grid-3">${experienceCards}</div>
    <figure class="churches-wide-image">
      <img src="/assets/circle-community.jpg" alt="A small group gathered in warm conversation" loading="lazy"/>
    </figure>
    <div class="partner-section-cta">
      <a class="button button-outline secondary-cta" href="/circles.html">See How a Circle Works</a>
    </div>
  </div>
</section>`);

const benefits = c.practice.benefits
  .map((item) => `<div><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></div>`)
  .join('');
replaceSectionContaining(c.practice.eyebrow, `
<section class="partner-section">
  <div class="shell">
    <div class="partner-exercise-grid">
      <div class="partner-exercise-copy">
        <p class="eyebrow">${esc(c.practice.eyebrow)}</p>
        <h2>${esc(c.practice.heading)}</h2>
        <p class="lead"><strong>${esc(c.practice.lead)}</strong></p>
        <p>${esc(c.practice.body)}</p>
        <div class="practice-callout"><strong>${esc(c.practice.callout_bold)}</strong> ${esc(c.practice.callout_body)}</div>
        <p>${esc(c.practice.closing)}</p>
      </div>
      <div class="practice-side">
        <aside class="partner-benefit-panel">
          <p class="eyebrow">${esc(c.practice.benefits_eyebrow)}</p>
          <div class="partner-benefit-list">${benefits}</div>
          <div class="practice-review-cta">
            <a class="button button-outline secondary-cta" href="/practices.html">Explore the Practices &amp; Research</a>
          </div>
        </aside>
        <figure class="practice-editorial-image">
          <img src="/assets/practices/home-scripture-encounter.webp" alt="Scripture and reflection as shared practice" loading="lazy"/>
        </figure>
      </div>
    </div>
  </div>
</section>`);

const renewalPoints = c.renewal.points
  .map((item) => `<div><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></div>`)
  .join('');
replaceSectionContaining(c.renewal.eyebrow, `
<section class="partner-section alt">
  <div class="shell">
    <div class="partner-dark-card">
      <div class="leader-renewal-review-grid">
        <div class="leader-renewal-review-copy">
          <p class="eyebrow">${esc(c.renewal.eyebrow)}</p>
          <h2>${esc(c.renewal.heading)}</h2>
          <p class="leader-renewal-intro"><strong>${esc(c.renewal.intro)}</strong></p>
          <p>${esc(c.renewal.body)}</p>
          <div class="leader-renewal-review-cta">
            <a class="button-outline-light" href="#partner-interest">Explore a Circle for Your Leaders</a>
          </div>
        </div>
        <figure class="leader-renewal-review-media">
          <img src="/assets/embodied-faith/circle-conversation.webp" alt="A ministry leader seated as a participant in conversation with others" loading="lazy"/>
        </figure>
      </div>
      <div class="leader-renewal-points">${renewalPoints}</div>
    </div>
  </div>
</section>`);

const pilotFacts = c.pilot.facts
  .map((item) => `<div class="pilot-fact"><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></div>`)
  .join('');
replaceSectionContaining(c.pilot.eyebrow, `
<section class="partner-section">
  <div class="shell">
    <div class="section-heading centered">
      <p class="eyebrow">${esc(c.pilot.eyebrow)}</p>
      <h2>${esc(c.pilot.heading)}</h2>
      <p>${esc(c.pilot.intro)}</p>
    </div>
    <div class="pilot-facts">${pilotFacts}</div>
    <div class="partner-narrow">
      <p>${esc(c.pilot.body)}</p>
      <p><strong>${esc(c.pilot.emphasis)}</strong></p>
    </div>
    <div class="pilot-review-actions">
      <a class="button button-copper" href="#partner-interest">Explore a Free Pilot</a>
      <a class="button button-outline secondary-cta" href="/connect.html">Talk with Shaun</a>
    </div>
  </div>
</section>`);

const afterOptions = c.after.items
  .map((item) => `<div class="after-option"><span class="number">${esc(item.number)}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></div></div>`)
  .join('');
replaceSectionContaining(c.after.eyebrow, `
<section class="partner-section alt">
  <div class="shell">
    <div class="section-heading centered">
      <p class="eyebrow">${esc(c.after.eyebrow)}</p>
      <h2>${esc(c.after.heading)}</h2>
      <p>${esc(c.after.intro)}</p>
    </div>
    <div class="after-options">${afterOptions}</div>
  </div>
</section>`);

const leadershipCards = c.leadership.items
  .map((item) => `<article><span class="number">${esc(item.number)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></article>`);
replaceSectionContaining(c.leadership.eyebrow, `
<section class="partner-section leader-section">
  <div class="shell">
    <div class="section-heading centered">
      <p class="eyebrow">${esc(c.leadership.eyebrow)}</p>
      <h2>${esc(c.leadership.heading)}</h2>
      <p>${esc(c.leadership.intro)}</p>
    </div>
    <div class="leader-two-step">
      ${leadershipCards[0] ?? ''}
      <div class="leader-arrow" aria-hidden="true">→</div>
      ${leadershipCards[1] ?? ''}
    </div>
    <div class="leader-cta">
      <a class="button button-outline secondary-cta" href="#partner-interest">Explore Leading a Circle</a>
    </div>
  </div>
</section>`);

const faqWanted = [
  'Is Homeward Christian?',
  'Will this replace our current small groups?',
  'Do participants have to agree doctrinally?',
  'How much work will this create for our staff?',
  'Can one of our people eventually lead it?',
];
const faqByQuestion = new Map(c.faq.items.map((item) => [item.question, item]));
const faqItems = faqWanted
  .map((q) => faqByQuestion.get(q))
  .filter(Boolean)
  .map((item) => `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`)
  .join('');
replaceSectionContaining(c.faq.eyebrow, `
<section class="partner-section">
  <div class="shell partner-narrow">
    <div class="section-heading centered">
      <p class="eyebrow">${esc(c.faq.eyebrow)}</p>
      <h2>${esc(c.faq.heading)}</h2>
    </div>
    <div class="partner-faq">${faqItems}</div>
  </div>
</section>`);

html = html.replace(
  '<a class="text-link" href="/connect.html">Prefer to talk first? Talk with Shaun <span>→</span></a>',
  '<a class="button button-outline secondary-cta partner-final-talk-button" href="/connect.html">Prefer to talk first? Talk with Shaun</a>'
);

await fs.writeFile(filePath, html, 'utf8');
console.log('Applied V9 Churches & Communities CMS-linked live overlay.');
