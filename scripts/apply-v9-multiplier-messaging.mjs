import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applySharedShell } from './render-v8-shared-shell.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const sectionPattern = (className) => new RegExp(
  `<section\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/section>`,
  'i',
);

const addStylesheet = (html) => {
  if (html.includes('/assets/v9-multiplier-messaging.css')) return html;
  return html.replace('</head>', '<link rel="stylesheet" href="/assets/v9-multiplier-messaging.css?v=2">\n</head>');
};

const addChurchNav = (html, isChurchPage = false) => {
  const link = `<a href="/churches.html"${isChurchPage ? ' class="is-active" aria-current="page"' : ''}>For Churches &amp; Communities</a>`;
  const inject = (navClass, source) => source.replace(
    new RegExp(`(<nav\\b[^>]*class=["'][^"']*\\b${navClass}\\b[^"']*["'][^>]*>)([\\s\\S]*?)(<\\/nav>)`, 'i'),
    (match, open, inner, close) => inner.includes('/churches.html') ? match : `${open}${inner}${link}${close}`,
  );
  let output = inject('v8-desktop-nav', html);
  output = inject('v8-mobile-nav', output);
  return output;
};

const updateHero = (html) => html.replace(sectionPattern('hero'), (section) => {
  let output = section;
  output = output.replace(
    /<h1>[\s\S]*?<\/h1>/i,
    '<h1>A deeper spiritual life takes practice.<br/><span class="hero-accent">And people to practice with.</span></h1>',
  );
  output = output.replace(
    /<p class="hero-lead">[\s\S]*?<\/p>/i,
    '<p class="hero-lead">Homeward Circles are small, guided, Jesus-centered communities where contemplative prayer, meditation, Scripture, silence, reflection, and honest conversation become practices we learn together. Over time, these spiritual exercises help us learn to become more present to God, ourselves, and one another—more peaceful, less reactive, more connected, and increasingly able to carry the love and way of Jesus into ordinary life. Begin with one free four-week season.</p>',
  );
  return output;
});

const updatePractices = (html) => html.replace(sectionPattern('home-practices'), (section) => {
  let output = section;
  output = output.replace(/<p class="eyebrow">[\s\S]*?<\/p>/i, '<p class="eyebrow">WHY PRACTICE MATTERS</p>');
  output = output.replace(/<h2>[\s\S]*?<\/h2>/i, '<h2>Spiritual exercises for the heart and mind.</h2>');
  output = output.replace(
    /<p class="practices-subhead">[\s\S]*?<\/p>/i,
    '<p class="practices-subhead"><strong>Ancient practices for everyday life.</strong></p>',
  );
  output = output.replace(
    /<p class="practices-lead">[\s\S]*?<\/p>/i,
    '<p class="practices-lead"><strong>We exercise our bodies to grow stronger through repeated practice. The heart and mind are formed through practice, too.</strong> Contemplative prayer, meditation, Scripture, gratitude, silence, and reflection train our attention, deepen awareness, and help us return to God in the middle of ordinary life. Over time, these ancient Christian practices can help us become more present and less reactive, more peaceful and steady, more connected and joyful, and increasingly able to love and serve.</p>',
  );
  output = output.replace(
    /<p>The goal is formation:[\s\S]*?<\/p>/i,
    '<p><strong>The goal is not to master a technique. It is formation:</strong> becoming more attentive to God, more free in how we respond, and more able to carry presence, compassion, and love into the places we actually live.</p>',
  );
  output = output.replace(
    /<p>The point is not to become good at meditation\.[\s\S]*?<\/p>/i,
    '<p><strong>The goal is not to master a technique. It is formation:</strong> becoming more attentive to God, more free in how we respond, and more able to carry presence, compassion, and love into the places we actually live.</p>',
  );
  return output;
});

const partnerSection = `
<section class="v9-partner-section section" id="for-churches">
  <div class="shell">
    <div class="v9-partner-grid">
      <div class="v9-partner-copy">
        <p class="eyebrow">FOR CHURCHES &amp; COMMUNITIES</p>
        <h2>Give your people another way to grow.</h2>
        <p class="v9-partner-lead">Homeward is designed to complement the formation your church or community already offers. We’ll facilitate a <strong>free four-week Homeward Circle</strong> for your leaders or an existing group so you can experience the model from the inside.</p>
        <p>Your people will encounter contemplative prayer, meditation, Scripture, deeper listening, and simple practices they can carry into everyday life. You do not need to buy a curriculum or launch a new ministry.</p>
        <p class="v9-partner-callout"><strong>Experience it first. Tell us what serves your people. Help us make it better.</strong></p>
        <p>If the experience bears fruit, we can explore helping one of your leaders learn to carry a Homeward Circle forward.</p>
        <div class="v9-partner-actions">
          <a class="button button-ivory" href="/churches.html">Explore a Circle for Your Community</a>
          <a class="text-link light" href="/connect.html">Talk with Shaun <span>→</span></a>
        </div>
        <p class="v9-partner-meta">Free · Four weeks · Homeward-facilitated · Minimal staff preparation</p>
      </div>
      <div class="v9-partner-cards">
        <article><span>01</span><h3>Experience it</h3><p>Let Homeward facilitate the first Circle so leaders can participate rather than manage another program.</p></article>
        <article><span>02</span><h3>See what serves</h3><p>Notice what deepens practice, connection, listening, and everyday spiritual formation for your people.</p></article>
        <article><span>03</span><h3>Carry it forward</h3><p>If the experience is life-giving, explore a simple pathway for one of your leaders to apprentice and lead.</p></article>
      </div>
    </div>
  </div>
</section>`;

const injectPartnerSection = (html) => {
  if (html.includes('id="for-churches"')) return html;
  return html.replace(sectionPattern('season-wrap'), (section) => `${section}\n${partnerSection}`);
};

const processHtml = async (filePath) => {
  let html = await fs.readFile(filePath, 'utf8');
  const base = path.basename(filePath).toLowerCase();
  if (base === 'churches.html') html = applySharedShell(html, filePath);
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

console.log('Applied Homeward V9 multiplier messaging test overlay.');
