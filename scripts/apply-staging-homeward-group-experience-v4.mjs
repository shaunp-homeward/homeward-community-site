import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cssHref = '/assets/homeward-group-experience-preview-v4.css?v=4';

const read = (name) => fs.readFile(path.join(dist, name), 'utf8');
const write = (name, value) => fs.writeFile(path.join(dist, name), value, 'utf8');
const injectCss = (html) => html.includes(cssHref) ? html : html.replace('</head>', `<link rel="stylesheet" href="${cssHref}">\n</head>`);

const getSection = (html, className) => {
  const re = new RegExp(`<section\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/section>`, 'i');
  return html.match(re)?.[0] || '';
};
const removeSection = (html, className) => {
  const re = new RegExp(`<section\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/section>\\s*`, 'i');
  return html.replace(re, '');
};

const workshopHeader = `
<header class="v8-site-header" data-v8-shared-header>
  <div class="v8-header-inner">
    <a class="v8-brand" href="/" aria-label="Homeward home">
      <img class="v8-brand-mark" src="/assets/mark-forest.png" alt="">
      <span class="v8-brand-copy"><strong>HOMEWARD</strong><small>A SPIRITUAL COMMUNITY</small></span>
    </a>
    <nav class="v8-desktop-nav" aria-label="Primary navigation">
      <a href="/">Home</a>
      <a href="/circles.html">Circles</a>
      <a href="/practices.html">Practices</a>
      <a href="/sacred-listening.html" class="is-active" aria-current="page">Sacred Listening</a>
      <a href="/#journey">Journey</a>
      <a href="/about.html">Our Story</a>
    </nav>
    <a class="v8-header-cta v8-header-cta-desktop" href="/connect.html" data-event="start_conversation_click">Let’s Talk</a>
    <a class="v8-header-cta v8-header-cta-mobile" href="/connect.html" data-event="start_conversation_click">Let’s Talk</a>
    <button class="v8-menu-button" type="button" aria-expanded="false" aria-label="Open navigation" data-v8-menu-button><span></span><span></span><span></span></button>
  </div>
  <nav class="v8-mobile-nav" aria-label="Mobile navigation" data-v8-mobile-menu hidden>
    <a href="/">Home</a>
    <a href="/circles.html">Circles</a>
    <a href="/practices.html">Practices</a>
    <a href="/sacred-listening.html" class="is-active" aria-current="page">Sacred Listening</a>
    <a href="/#journey">Journey</a>
    <a href="/about.html">Our Story</a>
    <div class="v8-mobile-actions">
      <a class="v8-mobile-primary" href="/#interest">I’m Interested</a>
      <a class="v8-mobile-secondary" href="/connect.html" data-event="start_conversation_click">Have a Conversation</a>
    </div>
  </nav>
</header>`;

const groupExperience = `
<section class="hw-group-experience section" id="group-experience">
  <div class="shell">
    <div class="hw-group-heading">
      <div>
        <p class="eyebrow">FOR EXISTING SMALL GROUPS</p>
        <h2>Keep your group.<br/><em>Deepen the experience.</em></h2>
      </div>
      <div class="hw-group-intro">
        <p class="lead">Homeward can join an existing church small group, care group, or community for a four-week guided experience—introducing contemplative practices and new ways of listening, reflecting, and talking together.</p>
        <p>You do not need to start another program or recruit a new community. We come alongside the group you already have, help people experience a few practices together, and leave the group with tools it can continue using on its own.</p>
      </div>
    </div>

    <div class="hw-group-weeks">
      <article>
        <span>01</span>
        <div><p class="eyebrow">BECOME PRESENT</p><h3>Slow down & notice</h3><p>Experience simple contemplative prayer and practices that help people settle, become present, and notice God in ordinary life.</p></div>
      </article>
      <article>
        <span>02</span>
        <div><p class="eyebrow">PRAY DIFFERENTLY</p><h3>Practice silence & Centering Prayer</h3><p>Explore Centering Prayer, breath prayer, silence, and other Christian contemplative practices in a guided, approachable way.</p></div>
      </article>
      <article>
        <span>03</span>
        <div><p class="eyebrow">LISTEN DEEPLY</p><h3>Change the conversation</h3><p>Practice Sacred Listening and learn how curiosity, reflection, and less fixing can create safer and more meaningful group conversations.</p></div>
      </article>
      <article>
        <span>04</span>
        <div><p class="eyebrow">CARRY IT INTO LIFE</p><h3>Build a rhythm your group can keep</h3><p>Reflect on what was life-giving and choose a few practices, questions, and rhythms your group can continue after the four weeks end.</p></div>
      </article>
    </div>

    <div class="hw-group-bottom">
      <div>
        <strong>A four-week taste—not a new church program.</strong>
        <p>Homeward facilitates the experience inside the community you already have. Your group keeps its identity, relationships, leadership, and rhythm.</p>
      </div>
      <div class="hw-group-benefits">
        <span>4 guided gatherings</span><span>~90 minutes</span><span>Experiential</span><span>Jesus-centered</span>
      </div>
      <div class="sl2-actions">
        <a class="button button-copper" href="/connect.html">Bring Homeward to Your Group</a>
        <a class="button button-outline" href="/practices.html">Explore the Practices</a>
      </div>
    </div>
  </div>
</section>`;

let home = injectCss(await read('index.html'));

// Remove standalone-Circle framing and related legacy blocks.
for (const cls of ['circle-different','season-wrap','v9-interest']) home = removeSection(home, cls);

// Replace hero Circle language with broader current offer.
home = home.replace(
  /<p class="hero-lead">[\s\S]*?<\/p>/i,
  '<p class="hero-lead">Homeward helps existing groups go deeper through short, experiential workshops and guided formation experiences. Explore contemplative prayer, Centering Prayer, Sacred Listening, Scripture, reflection, and honest conversation—without needing to start another program.</p>'
);
home = home.replace(
  /<div class="hero-actions">[\s\S]*?<\/div>/i,
  '<div class="hero-actions"><a class="button button-copper" href="/sacred-listening.html">Explore Sacred Listening</a><a class="button button-outline" href="#group-experience">4-Week Group Experience</a></div>'
);

// Insert the new group experience just before Sacred Listening.
const workshop = getSection(home, 'sl2-home');
if (workshop) home = home.replace(workshop, `${groupExperience}\n${workshop}`);
else {
  const journey = getSection(home, 'journey');
  home = journey ? home.replace(journey, `${groupExperience}\n${journey}`) : home.replace('</main>', `${groupExperience}\n</main>`);
}

// Tighten Sacred Listening homepage cards.
home = home.replaceAll('class="sl2-triad sl3-triad"', 'class="sl2-triad sl3-triad sl4-tight-triad"');

await write('index.html', home);

let sacred = injectCss(await read('sacred-listening.html'));

// Use the exact shared-shell classes and behavior instead of the legacy header.
sacred = sacred.replace(/<header\b[\s\S]*?<\/header>/i, workshopHeader);
if (!sacred.includes('/assets/v8-shared-shell.css')) {
  sacred = sacred.replace('</head>', '<link rel="stylesheet" href="/assets/v8-shared-shell.css?v=2">\n</head>');
}
if (!sacred.includes('/assets/v8-shared-shell.js')) {
  sacred = sacred.replace('</body>', '<script src="/assets/v8-shared-shell.js?v=1" defer></script>\n</body>');
}
sacred = sacred.replace(/<body([^>]*)>/i, (match, attrs) => {
  if (/class=["']/.test(attrs)) return match.replace(/class=["']([^"']*)["']/, (_m, cls) => `class="${cls} v8-shared-shell"`);
  return `<body${attrs} class="v8-shared-shell sacred-listening-page">`;
});

await write('sacred-listening.html', sacred);

const css = `
/* v4 staging: existing-group positioning + shared Sacred Listening header */
.sl4-tight-triad .sl2-card{min-height:0!important;padding:22px 24px!important}
.sl4-tight-triad .sl3-card-head{margin-bottom:12px!important}
.sl4-tight-triad .sl3-card-head .sl2-icon{width:48px!important;height:48px!important;flex-basis:48px!important;font-size:23px!important}
.sl4-tight-triad .sl3-card-head h3{font-size:1.72rem!important}
.sl4-tight-triad .sl2-card>p:last-child{margin:0!important;line-height:1.5!important}
.hw-group-experience{background:#fff}
.hw-group-heading{display:grid;grid-template-columns:.82fr 1.18fr;gap:64px;align-items:start;margin-bottom:42px}
.hw-group-heading h2{font-size:clamp(2.7rem,4.7vw,4.5rem);line-height:1.02;letter-spacing:-.03em;color:#153A2E;margin:8px 0 0}
.hw-group-heading h2 em{font-weight:400;color:#6D7D6A}
.hw-group-intro .lead{font-size:1.25rem;line-height:1.6;color:#153A2E;margin-top:0}
.hw-group-weeks{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.hw-group-weeks article{display:grid;grid-template-columns:52px 1fr;gap:18px;padding:26px 28px;background:#FAF6EF;border:1px solid rgba(21,58,46,.09);border-radius:16px}
.hw-group-weeks article>span{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#153A2E;color:#FAF6EF;font-family:Georgia,serif}
.hw-group-weeks .eyebrow{margin:0 0 4px;color:#B35A2A}
.hw-group-weeks h3{font-size:1.4rem;line-height:1.15;margin:0 0 10px;color:#153A2E}
.hw-group-weeks p{margin-bottom:0}
.hw-group-bottom{display:grid;grid-template-columns:1.05fr .8fr auto;gap:30px;align-items:center;border-top:1px solid rgba(21,58,46,.15);margin-top:30px;padding-top:28px}
.hw-group-bottom strong{color:#153A2E;font-size:1.08rem}
.hw-group-bottom p{font-size:.94rem;margin:6px 0 0}
.hw-group-benefits{display:flex;flex-wrap:wrap;gap:8px}
.hw-group-benefits span{border:1px solid rgba(21,58,46,.18);border-radius:999px;padding:7px 10px;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:#153A2E}
.sacred-listening-page .v8-site-header{position:relative;z-index:100}
.sacred-listening-page .v8-header-inner{width:min(1220px,calc(100% - 48px));margin:0 auto}
.sacred-listening-page .v8-brand-mark{display:block}
.sacred-listening-page .v8-desktop-nav{gap:16px}
@media(max-width:980px){
  .hw-group-heading{grid-template-columns:1fr;gap:20px}
  .hw-group-bottom{grid-template-columns:1fr}
  .sacred-listening-page .v8-desktop-nav{display:none}
}
@media(max-width:720px){
  .hw-group-weeks{grid-template-columns:1fr}
  .hw-group-weeks article{grid-template-columns:46px 1fr;padding:22px}
  .hw-group-weeks article>span{width:42px;height:42px}
  .sl4-tight-triad .sl2-card{padding:20px!important}
}`;

await fs.writeFile(path.join(dist, 'assets', 'homeward-group-experience-preview-v4.css'), css, 'utf8');
console.log('Applied Homeward existing-group experience + Sacred Listening shared header v4.');
