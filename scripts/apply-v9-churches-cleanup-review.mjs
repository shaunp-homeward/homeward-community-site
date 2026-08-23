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
  html = html.replace('</head>', '<link rel="stylesheet" href="/assets/v9-churches-cleanup-review.css?v=3">\n</head>');
}

const locateSection = (marker) => {
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) {
    console.warn(`Churches cleanup review: marker not found, leaving section unchanged: ${marker}`);
    return null;
  }
  const start = html.lastIndexOf('<section', markerIndex);
  const close = html.indexOf('</section>', markerIndex);
  if (start < 0 || close < 0) {
    console.warn(`Churches cleanup review: section bounds not found, leaving unchanged: ${marker}`);
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

const removeSectionContaining = (marker) => replaceSectionContaining(marker, '');

const experienceCards = c.experience.items.map((item) => `<article class="partner-card"><span class="number">${esc(item.number)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></article>`).join('');
replaceSectionContaining(c.experience.eyebrow, `
<section class="partner-section">
  <div class="shell">
    <div class="section-heading centered">
      <p class="eyebrow">${esc(c.experience.eyebrow)}</p>
      <h2>${esc(c.experience.heading)}</h2>
      <p>${esc(c.experience.intro)}</p>
    </div>
    <div class="partner-grid-3">${experienceCards}</div>
    <div class="partner-section-cta"><a class="text-link" href="/circles.html">See How a Circle Works <span>→</span></a></div>
  </div>
</section>`);

replaceSectionContaining('class="partner-hero"', `
<section class="partner-hero">
  <div class="shell partner-hero-review-grid">
    <div class="partner-hero-review-copy">
      <p class="eyebrow">${esc(c.hero.eyebrow)}</p>
      <h1>${esc(c.hero.heading)}</h1>
      <p class="lead">${esc(c.hero.lead)}</p>
      <div class="partner-hero-actions">
        <a class="button button-copper" href="#partner-interest">${esc(c.hero.primary_label)}</a>
        <a class="button button-outline" href="/connect.html">${esc(c.hero.secondary_label)}</a>
      </div>
      <p class="partner-meta">${esc(c.hero.meta)}</p>
    </div>
    <figure class="partner-hero-review-media"><img src="/assets/circle-community.jpg" alt="A small Homeward Circle gathered in warm conversation"/></figure>
  </div>
</section>`);

const benefits = c.practice.benefits.map((item) => `<div><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></div>`).join('');
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
        <p class="practice-review-cta"><a class="text-link" href="/practices.html">Explore the Practices &amp; Research <span>→</span></a></p>
      </div>
      <div class="practice-side">
        <aside class="partner-benefit-panel">
          <p class="eyebrow">${esc(c.practice.benefits_eyebrow)}</p>
          <div class="partner-benefit-list">${benefits}</div>
        </aside>
        <div class="practice-image-strip" aria-label="Examples of Homeward spiritual practices">
          <img src="/assets/practices/home-light-of-christ.webp" alt="Light of Christ practice"/>
          <img src="/assets/practices/home-scripture-encounter.webp" alt="Scripture as Encounter practice"/>
          <img src="/assets/practices/home-breath-prayer.webp" alt="Breath Prayer practice"/>
        </div>
      </div>
    </div>
  </div>
</section>`);

const renewalPoints = c.renewal.points.map((item) => `<div><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></div>`).join('');
replaceSectionContaining(c.renewal.eyebrow, `
<section class="partner-section alt">
  <div class="shell">
    <div class="partner-dark-card">
      <div class="leader-renewal-review-grid">
        <div>
          <p class="eyebrow">${esc(c.renewal.eyebrow)}</p>
          <h2>${esc(c.renewal.heading)}</h2>
          <p class="leader-renewal-intro"><strong>${esc(c.renewal.intro)}</strong></p>
          <p>${esc(c.renewal.body)}</p>
          <p class="leader-renewal-review-cta"><a class="button-outline-light" href="#partner-interest">Explore a Circle for Your Leaders</a></p>
        </div>
        <figure class="leader-renewal-review-media"><img src="/assets/remembering-community.jpg" alt="A leader receiving, listening, and participating in community"/></figure>
      </div>
      <div class="leader-renewal-points">${renewalPoints}</div>
    </div>
  </div>
</section>`);

const pilotFacts = c.pilot.facts.map((item) => `<div class="pilot-fact"><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></div>`).join('');
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
      <a class="text-link" href="/connect.html">Talk with Shaun <span>→</span></a>
    </div>
  </div>
</section>`);

replaceSectionContaining(c.after.eyebrow, `
<section class="partner-section alt">
  <div class="shell">
    <div class="section-heading centered">
      <p class="eyebrow">AFTER FOUR WEEKS</p>
      <h2>Keep what helps. Build on what comes alive.</h2>
      <p>Every participant leaves with practices they can carry into ordinary life and ministry. From there, the next step can stay simple.</p>
    </div>
    <div class="after-four-grid">
      <article class="after-four-card">
        <p class="eyebrow">CARRY IT FORWARD</p>
        <h3>Bring the practices into what you already do.</h3>
        <p>Use them personally or weave them naturally into staff gatherings, existing groups, retreats, pastoral care, prayer, and everyday life.</p>
      </article>
      <article class="after-four-card">
        <p class="eyebrow">CONTINUE TOGETHER</p>
        <h3>When there’s energy for more, keep going.</h3>
        <p>A group can continue into another Homeward season or host another Circle when people genuinely want to keep practicing together.</p>
      </article>
    </div>
    <div class="leader-invitation">
      <p class="eyebrow">FOR PEOPLE DRAWN TO LEAD</p>
      <h3>Experience it first. Then learn to lead.</h3>
      <p>Some participants will feel drawn to create this kind of space for others. Homeward can help them learn the simple facilitation rhythm, practices, and guardrails needed to lead a Circle in a way that stays participatory, grounded, and Jesus-centered.</p>
    </div>
  </div>
</section>`);
removeSectionContaining(c.leadership.eyebrow);

replaceSectionContaining(c.posture.eyebrow, `
<section class="partner-section alt">
  <div class="shell partner-narrow">
    <p class="eyebrow">${esc(c.posture.eyebrow)}</p>
    <h2>${esc(c.posture.heading)}</h2>
    <p class="lead"><strong>${esc(c.posture.lead)}</strong></p>
    <p>${esc(c.posture.body)}</p>
    <p class="posture-fruit"><strong>The goal is not agreement for its own sake. The hoped-for fruit is greater love of God and neighbor.</strong></p>
  </div>
</section>`);

const faqKeep = new Set([
  'Will this replace our current small groups?',
  'Is Homeward Christian?',
  'How much work will this create for our staff?',
  'Can one of our people eventually lead it?',
  'Does Homeward compete with our church?',
]);
const faqItems = c.faq.items.filter((item) => faqKeep.has(item.question));
const faqs = faqItems.map((item) => `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('');
replaceSectionContaining(c.faq.eyebrow, `
<section class="partner-section">
  <div class="shell partner-narrow">
    <div class="section-heading centered">
      <p class="eyebrow">${esc(c.faq.eyebrow)}</p>
      <h2>${esc(c.faq.heading)}</h2>
    </div>
    <div class="partner-faq">${faqs}</div>
  </div>
</section>`);

await fs.writeFile(filePath, html, 'utf8');
console.log('Applied V9 Churches & Communities cleanup review v4 overlay.');
