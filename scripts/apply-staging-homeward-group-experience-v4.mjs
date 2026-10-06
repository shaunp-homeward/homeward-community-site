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
      <span class="v8-brand-copy"><strong>HOMEWARD</strong><small>SPIRITUAL FORMATION FOR GROUPS</small></span>
    </a>
    <nav class="v8-desktop-nav" aria-label="Primary navigation">
      <a href="/">Home</a>
      <a href="/circles.html">For Groups</a>
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
    <a href="/circles.html">For Groups</a>
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
        <p class="lead">Give your group four weeks to slow down, experience God in new ways, and deepen the way you pray and listen together.</p>
        <p>Homeward comes alongside the community you already have with guided contemplative practices, meaningful conversation, and simple tools your group can continue using on its own.</p>
      </div>
    </div>

    <div class="hw-group-weeks">
      <article>
        <span>01</span>
        <div><p class="eyebrow">BECOME PRESENT</p><h3>Slow down & notice</h3><p>Experience simple contemplative prayer and practices that help people settle, become present, and notice God in ordinary life.</p></div>
      </article>
      <article>
        <span>02</span>
        <div><p class="eyebrow">DEEPEN PRAYER</p><h3>Discover silence, Centering Prayer & breath prayer</h3><p>Experience time-tested Christian practices that create space to listen, receive, and rest in God rather than only speak.</p></div>
      </article>
      <article>
        <span>03</span>
        <div><p class="eyebrow">LISTEN WITH LOVE</p><h3>Help people feel seen, heard, and known</h3><p>Practice Sacred Listening and discover how curiosity, reflection, and less fixing can transform the quality of a group’s conversations.</p></div>
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


const groupRecognition = `
<section class="recognition section hw-recognition">
  <div class="shell narrow-wide">
    <div class="section-heading centered recognition-heading">
      <p class="eyebrow">WHEN A GOOD GROUP WANTS TO GO DEEPER</p>
      <h2>Your group may not need more content.<br/>It may need more practice.</h2>
      <p>Many groups already have good teaching, caring people, and meaningful conversation. What can be harder is creating room to slow down, experience God together, listen deeply, and carry spiritual practices into ordinary life.</p>
    </div>
    <div class="recognition-grid recognition-grid-four hw-recognition-grid">
      <article><p><strong>You talk about prayer.</strong> What if your group could actually practice silence, contemplation, and listening together?</p></article>
      <article><p><strong>Your conversations are meaningful.</strong> What if more people left feeling deeply heard instead of quickly advised?</p></article>
      <article><p><strong>You want something fresh.</strong> But not another curriculum, program, or commitment to manage.</p></article>
      <article><p><strong>You want something that lasts.</strong> Practices people can carry into Monday, relationships, work, and ordinary life.</p></article>
    </div>
    <p class="recognition-close">Homeward comes alongside the group you already have and adds guided practice, deeper listening, and a few new rhythms you can keep.</p>
  </div>
</section>`;

const groupFit = `
<section class="fit section-tight hw-fit">
  <div class="shell fit-intro">
    <p class="eyebrow">COULD HOMEWARD HELP YOUR GROUP?</p>
    <h2>A good fit for groups that want to practice—not just discuss.</h2>
    <p>Homeward works best when a group already has relationships and a rhythm together, and wants a guided way to deepen prayer, presence, and conversation.</p>
  </div>
  <div class="shell fit-shell">
    <div class="fit-column fit-yes">
      <h2>This may be a strong fit if…</h2>
      <ul>
        <li>Your group wants a four-week experience rather than another ongoing program.</li>
        <li>You are open to silence, contemplative prayer, Centering Prayer, Scripture, and reflection.</li>
        <li>People are willing to participate and practice—not simply listen to a teacher.</li>
        <li>You want tools and rhythms the group can continue using after Homeward steps out.</li>
      </ul>
    </div>
    <div class="fit-column fit-no">
      <h2>It may not be the right fit if…</h2>
      <ul>
        <li>Your group is mainly looking for a lecture, sermon series, or content-heavy Bible study.</li>
        <li>The primary goal is doctrinal debate, persuasion, or getting everyone to the same answer.</li>
        <li>There is little room for silence, participation, reflection, or honest conversation.</li>
        <li>You are looking for Homeward to permanently take over leadership of the group.</li>
      </ul>
    </div>
  </div>
</section>`;

const founderReframe = `
<section class="founder founder-feature section" id="founder">
  <div class="shell founder-row">
    <div class="founder-image"><img src="/assets/founder-headshot.jpg" alt="Shaun, founder of Homeward"/></div>
    <div class="founder-copy">
      <p class="eyebrow">WHY HOMEWARD EXISTS</p>
      <h2>I found practices that changed my spiritual life. I kept wondering why they were so hard to find in ordinary community.</h2>
      <p>After years of spiritual study, retreats, monasteries, and contemplative practice, I kept returning to Jesus—and to practices that helped me experience God more deeply. But many of those experiences lived outside everyday church and small-group life.</p>
      <p class="founder-second">Homeward grew from a simple question: <strong>What if we could bring some of these practices into communities that already exist?</strong> Not asking people to leave their church. Not creating another program to maintain. Just helping groups experience new ways to pray, listen, reflect, and become more available to God and one another.</p>
      <p class="founder-trust">Religious Studies + Anthropology · decades of contemplative practice · husband, father, and business leader</p>
      <a class="text-link" href="/about.html">Read Shaun’s Story <span>→</span></a>
    </div>
  </div>
</section>`;

let home = injectCss(await read('index.html'));

// Remove standalone-Circle framing and related legacy blocks.
for (const cls of ['circle-different','season-wrap','v9-interest']) home = removeSection(home, cls);
const oldRecognition = getSection(home, 'recognition');
if (oldRecognition) home = home.replace(oldRecognition, groupRecognition);
const oldFit = getSection(home, 'fit');
if (oldFit) home = home.replace(oldFit, groupFit);
const oldFounder = getSection(home, 'founder-feature');
if (oldFounder) home = home.replace(oldFounder, founderReframe);

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

// The current offer should appear before the explanation of why practices matter.
home = removeSection(home, 'hw-group-experience');
const practiceSection = getSection(home, 'home-practices');
if (practiceSection) home = home.replace(practiceSection, `${groupExperience}\n${practiceSection}`);

// Clean up remaining standalone-Circle language in the homepage shell.
home = home
  .replace(/<p class="hero-note">[\s\S]*?<\/p>/i, '')
  .replace('Homeward is forming as a Jesus-centered spiritual community, beginning with Circles. You do not need to leave an existing church, and you do not need previous church involvement to participate.',
    'Homeward is a Jesus-centered spiritual formation initiative that comes alongside existing groups through workshops, guided practices, and short formation experiences. The aim is to deepen the community you already have—not ask people to leave it.')
  .replace('Why is a conversation required before joining a Circle?', 'How does Homeward work with an existing group?')
  .replace('The conversation gives you a chance to ask questions and understand the experience before committing. It also helps us learn what you are seeking, confirm that the Circle posture is a good fit, and thoughtfully match people into groups. We are looking for openness and a desire to grow—not doctrinal certainty.',
    'We begin with a short conversation with the group leader to understand the people, rhythm, and needs of the group. Then we shape a simple four-week experience that introduces practices without replacing the group’s identity, leadership, or existing relationships.')
  .replace('<h4>Fall 2026</h4><p>Finding Home begins this fall in Fort Worth and online—the first four-week season in an ongoing Homeward journey.</p>',
    '<h4>FOR EXISTING GROUPS</h4><p>Bring a four-week Homeward experience into the community you already have—guided practice, deeper conversation, and tools your group can keep.</p>');

// Lock the new narrative order.
const orderedClasses = ['hero','recognition','hw-group-experience','home-practices','sl2-home','founder-feature','fit','journey','faq'];
const orderedSections = orderedClasses.map((className) => getSection(home, className)).filter(Boolean);
home = home.replace(/<main id="top">[\s\S]*?<\/main>/i, `<main id="top">\n${orderedSections.join('\n')}\n</main>`);

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

sacred = sacred
  .replace('A SPIRITUAL COMMUNITY', 'SPIRITUAL FORMATION FOR GROUPS')
  .replace(/(<a[^>]*href="\/circles\.html"[^>]*>)Circles(<\/a>)/g, '$1For Groups$2')
  .replace('Sacred Listening is a <strong>three-session experiential workshop</strong> that combines contemplative practice with practical listening skills. Participants don\'t simply learn about presence and listening—they practice them with one another, notice what happens, and learn tools they can carry into real conversations.',
    'Sacred Listening is a <strong>three-session experiential workshop for Christian groups, care teams, and leaders</strong> that combines contemplative presence with practical listening skills. Participants do not simply learn techniques—they practice with one another, notice what creates safety and connection, and leave with tools they can use in ministry and everyday relationships.')
  .replace('<a class="button button-outline sl2-light-outline" href="/#interest">I’m Interested</a>',
    '<a class="button button-outline sl2-light-outline" href="/connect.html">Have a Conversation</a>')
  .replace('FOR CHURCHES, CARE GROUPS & LEADERS', 'FOR CHRISTIAN GROUPS, CARE TEAMS & LEADERS')
  .replace('A workshop people can use on Tuesday.', 'A workshop that changes how people show up for one another.')
  .replace('Sacred Listening can strengthen the relational life already happening inside a church or community without requiring a new program or structure.',
    'Bring Sacred Listening into a community that already exists. The workshop strengthens the way people listen, care, and respond without asking the church or group to adopt another ongoing program.')
  .replace('Homeward can facilitate the workshop for an existing church, staff team, care group, small group, or community.',
    'Homeward facilitates the workshop inside the community you already have—small groups, care teams, staff teams, recovery ministries, and other Christian communities.');
await write('sacred-listening.html', sacred);

const css = `
/* v4 staging: existing-group positioning + shared Sacred Listening header */
.hw-recognition-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:18px!important;max-width:1040px;margin:34px auto 0!important}
.hw-recognition-grid article{min-width:0!important;padding:24px 26px!important;height:auto!important}
.hw-recognition-grid article p{margin:0!important;line-height:1.55!important}
.hw-recognition-grid article strong{display:inline!important}
.hero-icon-row{display:none!important}
.sl4-tight-triad{align-items:start!important;gap:14px!important}
.sl4-tight-triad .sl2-card{min-height:0!important;height:auto!important;padding:18px 22px!important}
.sl4-tight-triad .sl3-card-head{margin-bottom:8px!important}
.sl4-tight-triad .sl3-card-head .sl2-icon{width:44px!important;height:44px!important;flex-basis:44px!important;font-size:21px!important}
.sl4-tight-triad .sl3-card-head h3{font-size:1.58rem!important}
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
  .hw-recognition-grid{grid-template-columns:1fr!important}
  .hw-group-weeks{grid-template-columns:1fr}
  .hw-group-weeks article{grid-template-columns:46px 1fr;padding:22px}
  .hw-group-weeks article>span{width:42px;height:42px}
  .sl4-tight-triad .sl2-card{padding:20px!important}
}`;

await fs.writeFile(path.join(dist, 'assets', 'homeward-group-experience-preview-v4.css'), css, 'utf8');
console.log('Applied Homeward existing-group experience + Sacred Listening shared header v4.');
