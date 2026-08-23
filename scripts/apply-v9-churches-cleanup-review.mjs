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
  html = html.replace('</head>', '<link rel="stylesheet" href="/assets/v9-churches-cleanup-review.css?v=6">\n</head>');
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

// HERO — return to the original, confident text-first opening.
replaceSectionContaining('class="partner-hero"', `
<section class="partner-hero">
  <div class="shell">
    <p class="eyebrow">${esc(c.hero.eyebrow)}</p>
    <h1>${esc(c.hero.heading)}</h1>
    <p class="lead">${esc(c.hero.lead)}</p>
    <div class="partner-hero-actions">
      <a class="button button-copper" href="#partner-interest">${esc(c.hero.primary_label)}</a>
      <a class="button button-outline" href="/connect.html">${esc(c.hero.secondary_label)}</a>
    </div>
    <p class="partner-meta">${esc(c.hero.meta)}</p>
  </div>
</section>`);

// EXPERIENCE — preserve the original rhythm, then add one warm visual moment and a clear secondary CTA.
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
    <figure class="partner-visual-break">
      <img src="/assets/churches-circle-warm-v9.webp" alt="A small group gathered around Scripture in warm conversation"/>
    </figure>
    <div class="partner-section-cta">
      <a class="button button-outline" href="/circles.html">See How a Circle Works</a>
    </div>
  </div>
</section>`);

// HOW HOMEWARD FITS intentionally remains the original V9 section.

// PRACTICE — keep the original composition and make the research/practices action unmistakably clickable.
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
        <div class="practice-review-cta">
          <a class="button button-outline" href="/practices.html">Explore the Practices &amp; Research</a>
        </div>
      </div>
      <aside class="partner-benefit-panel">
        <p class="eyebrow">${esc(c.practice.benefits_eyebrow)}</p>
        <div class="partner-benefit-list">${benefits}</div>
      </aside>
    </div>
  </div>
</section>`);

// PASTOR / LEADER RENEWAL — keep the original copy and add the seated pastor/leader image here, where it carries meaning.
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
          <img src="/assets/churches-pastor-renewal-v9.webp" alt="A pastor or ministry leader seated as a participant, listening with others"/>
        </figure>
      </div>
      <div class="leader-renewal-points">${renewalPoints}</div>
    </div>
  </div>
</section>`);

// PILOT — preserve the original strong invitation and give both actions proper button treatment.
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
      <a class="button button-outline" href="/connect.html">Talk with Shaun</a>
    </div>
  </div>
</section>`);

// AFTER FOUR WEEKS — retain the original clarity, reduce four choices to the three that matter most.
replaceSectionContaining(c.after.eyebrow, `
<section class="partner-section alt">
  <div class="shell">
    <div class="section-heading centered">
      <p class="eyebrow">AFTER FOUR WEEKS</p>
      <h2>Pause. Notice what served. Decide what comes next.</h2>
      <p>The practices remain useful whether the group continues or not. If there is energy for more, the next step can stay simple.</p>
    </div>
    <div class="after-card-grid">
      <article class="partner-card after-card">
        <span class="number">01</span>
        <h3>Carry it forward</h3>
        <p>Use the practices personally or bring them into existing groups, staff rhythms, retreats, pastoral care, and prayer.</p>
      </article>
      <article class="partner-card after-card">
        <span class="number">02</span>
        <h3>Continue together</h3>
        <p>Join another Homeward season if the experience is serving the group.</p>
      </article>
      <article class="partner-card after-card">
        <span class="number">03</span>
        <h3>Host another Circle</h3>
        <p>Offer the experience to another group in your church or community when there is genuine interest.</p>
      </article>
    </div>
  </div>
</section>`);

// LEADERSHIP — restore the strongest original line, then simplify the path to two movements.
replaceSectionContaining(c.leadership.eyebrow, `
<section class="partner-section">
  <div class="shell">
    <div class="section-heading centered">
      <p class="eyebrow">LEADING A CIRCLE</p>
      <h2>The best way to understand a Circle is to experience one.</h2>
      <p><strong>Experience it first. Then learn to lead.</strong> For people who feel drawn to facilitate, Homeward provides a simple path to learn the practices, leader posture, and guardrails that protect the experience.</p>
    </div>
    <div class="leader-two-step">
      <article>
        <span class="number">01</span>
        <h3>Experience it first</h3>
        <p>Participate fully in a Circle and learn the rhythm from the inside.</p>
      </article>
      <div class="leader-arrow" aria-hidden="true">→</div>
      <article>
        <span class="number">02</span>
        <h3>Learn to lead</h3>
        <p>Learn the facilitation rhythm and practices, lead with support, and stay connected to Homeward as you create this kind of space for others.</p>
      </article>
    </div>
  </div>
</section>`);

// OUR POSTURE intentionally remains the original clean V9 treatment.

// FAQ — retain the highest-value questions and remove apprenticeship terminology.
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
  .map((item) => {
    const answer = item.question === 'Can one of our people eventually lead it?'
      ? 'Yes. The best path is to experience a Circle first, then learn the facilitation rhythm, practices, leader posture, and guardrails with support from Homeward.'
      : item.answer;
    return `<details><summary>${esc(item.question)}</summary><p>${esc(answer)}</p></details>`;
  })
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

// Make the final conversational action visually intentional rather than an inline text link.
html = html.replace(
  '<a class="text-link" href="/connect.html">Prefer to talk first? Talk with Shaun <span>→</span></a>',
  '<a class="button button-outline partner-final-talk-button" href="/connect.html">Prefer to talk first? Talk with Shaun</a>'
);

await fs.writeFile(filePath, html, 'utf8');
console.log('Applied V9 Churches & Communities creative-director review v6 overlay.');
