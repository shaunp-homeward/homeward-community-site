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

const groupsPageMainV5 = "<main class=\"groups-page-v5\">\n<section class=\"groups-hero-v5\"><div class=\"container groups-hero-grid-v5\">\n<div>\n<p class=\"eyebrow\">FOR EXISTING CHRISTIAN SMALL GROUPS</p>\n<h1>Keep your group.<br><em>Deepen the experience.</em></h1>\n<p class=\"lead\">Give your group four weeks to slow down, experience God in new ways, and deepen the way you pray and listen together.</p>\n<p>Homeward comes alongside a community that already exists with guided contemplative practices, meaningful conversation, and simple tools your group can continue using long after the four weeks end.</p>\n<div class=\"groups-facts-v5\"><span>4 gatherings</span><span>~90 minutes</span><span>Experiential</span><span>Jesus-centered</span></div>\n<div class=\"page-actions\"><a class=\"button\" href=\"connect.html\">Bring Homeward to Your Group</a><a class=\"button button-ghost-light\" href=\"#four-weeks\">See the Four Weeks</a></div>\n</div>\n<div class=\"groups-hero-card-v5\">\n<p class=\"eyebrow\">NOT ANOTHER PROGRAM</p>\n<h2>Homeward joins the group you already have.</h2>\n<p>Your people stay together. Your leader stays the leader. Your church stays the church. Homeward simply facilitates a short season of practice and conversation designed to help the group experience something new together.</p>\n<ul><li>No new group to recruit</li><li>No long-term commitment</li><li>No curriculum to master beforehand</li><li>Practices your group can keep using</li></ul>\n</div>\n</div></section>\n\n<section class=\"section groups-desire-v5\"><div class=\"container\">\n<div class=\"center\"><p class=\"eyebrow\">WHEN A GOOD GROUP WANTS TO GO DEEPER</p><h2>Sometimes the next step is not more content.<br>It is a different kind of experience.</h2></div>\n<div class=\"groups-desire-grid-v5\">\n<article><strong>Experience prayer together</strong><p>Move beyond talking about prayer and actually practice silence, Centering Prayer, breath prayer, and receptive presence together.</p></article>\n<article><strong>Create deeper conversations</strong><p>Help more people feel safe enough to speak honestly—and heard without being quickly advised, corrected, or fixed.</p></article>\n<article><strong>Try something fresh</strong><p>Give the group a meaningful reset without introducing another permanent program, curriculum, or commitment to maintain.</p></article>\n<article><strong>Take it into Monday</strong><p>Leave with simple rhythms people can use at home, at work, in relationships, and in the group long after Homeward steps out.</p></article>\n</div></div></section>\n\n<section class=\"section section-white groups-weeks-v5\" id=\"four-weeks\"><div class=\"container\">\n<div class=\"center\"><p class=\"eyebrow\">THE 4-WEEK GROUP EXPERIENCE</p><h2>Four gatherings. Four movements toward a deeper shared life with God.</h2><p class=\"lead\" style=\"margin:22px auto 0;max-width:800px\">Each week combines experience, brief teaching, Scripture or reflection, honest conversation, and a simple practice to carry into daily life.</p></div>\n<div class=\"groups-week-grid-v5\">\n<article><span>01</span><div><p class=\"eyebrow\">BECOME PRESENT</p><h3>Slow down and notice</h3><p>Experience contemplative practices that help people settle, become more aware of what is happening within them, and become more present to God and one another.</p><b>Experience:</b><p>Breath prayer · silence · noticing · presence</p></div></article>\n<article><span>02</span><div><p class=\"eyebrow\">DEEPEN PRAYER</p><h3>Discover silence, Centering Prayer &amp; breath prayer</h3><p>Experience time-tested Christian practices that create space to listen, receive, and rest in God rather than only speak.</p><b>Experience:</b><p>Centering Prayer · contemplative prayer · receptive silence</p></div></article>\n<article><span>03</span><div><p class=\"eyebrow\">LISTEN WITH LOVE</p><h3>Help people feel seen, heard, and known</h3><p>Practice Sacred Listening and discover how curiosity, reflection, and less fixing can transform the quality of a group’s conversations.</p><b>Experience:</b><p>Sacred Listening · open questions · reflection · compassion</p></div></article>\n<article><span>04</span><div><p class=\"eyebrow\">CARRY IT INTO LIFE</p><h3>Build a rhythm your group can keep</h3><p>Reflect on what was life-giving and choose a few practices, questions, and rhythms that can continue after the guided experience ends.</p><b>Experience:</b><p>Integration · daily practice · shared commitments · next steps</p></div></article>\n</div></div></section>\n\n<section class=\"section groups-flow-v5\"><div class=\"container groups-flow-grid-v5\">\n<div><p class=\"eyebrow\">WHAT A GATHERING FEELS LIKE</p><h2>Less lecture.<br>More experience.</h2><p class=\"lead\">The goal is not to turn your group into a meditation class. It is to create enough space for people to experience a practice, reflect honestly, listen to one another, and notice how God may be meeting them.</p></div>\n<div class=\"groups-flow-list-v5\">\n<article><b>01</b><div><strong>Arrive</strong><p>Settle in and reconnect as the group normally would.</p></div></article>\n<article><b>02</b><div><strong>Experience</strong><p>Practice prayer, silence, Scripture, or another contemplative rhythm together.</p></div></article>\n<article><b>03</b><div><strong>Reflect</strong><p>Notice what happened internally rather than rushing to explain or evaluate it.</p></div></article>\n<article><b>04</b><div><strong>Listen</strong><p>Share honestly and practice listening without fixing, debating, or taking over.</p></div></article>\n<article><b>05</b><div><strong>Carry it home</strong><p>Choose one simple practice for ordinary life before the group gathers again.</p></div></article>\n</div></div></section>\n\n<section class=\"section section-white groups-practices-v5\"><div class=\"container\">\n<div class=\"center\"><p class=\"eyebrow\">PRACTICES YOUR GROUP MAY EXPERIENCE</p><h2>Ancient Christian practices, made approachable.</h2><p class=\"lead\" style=\"margin:22px auto 0;max-width:800px\">We introduce practices gently, explain where they come from, experience them together, and make room to talk honestly about what people notice.</p></div>\n<div class=\"groups-practice-grid-v5\">\n<article><h3>Centering Prayer</h3><p>A simple practice of consenting to God’s presence and action within, using silence and a sacred word as a gentle return.</p></article>\n<article><h3>Breath Prayer</h3><p>Short prayer phrases joined to the natural breath as a way of returning to presence, trust, and God.</p></article>\n<article><h3>Contemplative Scripture</h3><p>Reading slowly enough to notice the word, image, question, or invitation that seems alive in the passage.</p></article>\n<article><h3>Sacred Listening</h3><p>Learning to be fully present, ask open questions, reflect what we hear, and resist the reflex to fix.</p></article>\n<article><h3>Daily Reflection</h3><p>Looking back over ordinary life with gratitude and honesty to notice consolation, resistance, longing, and invitation.</p></article>\n<article><h3>Silence &amp; Presence</h3><p>Practicing stillness not as an escape from life, but as a way of becoming more available to God and the people around us.</p></article>\n</div></div></section>\n\n<section class=\"section section-forest groups-church-v5\"><div class=\"container groups-church-grid-v5\">\n<div><p class=\"eyebrow\">DESIGNED TO SERVE THE CHURCH YOU ALREADY HAVE</p><h2>Homeward adds a layer of practice—not a competing community.</h2></div>\n<div><p class=\"lead\">The aim is to strengthen an existing Christian group, not pull people away from it.</p><p>We can work with a small-group leader, pastor, care ministry, recovery group, staff team, or other established community. Before beginning, we have a short conversation about the group, its tradition, and what would genuinely serve its people.</p><p>At the end of four weeks, Homeward steps back. The group keeps what was useful and continues in its own life together.</p></div>\n</div></section>\n\n<section class=\"section section-white groups-two-offers-v5\"><div class=\"container\">\n<div class=\"center\"><p class=\"eyebrow\">TWO WAYS TO BEGIN</p><h2>Choose the experience that best fits your group.</h2></div>\n<div class=\"groups-offer-grid-v5\">\n<article><p class=\"eyebrow\">BROADER FORMATION</p><h3>4-Week Group Experience</h3><p>A guided introduction to contemplative prayer, Centering Prayer, Sacred Listening, reflection, and everyday spiritual practice.</p><a class=\"button\" href=\"connect.html\">Ask About the 4-Week Experience</a></article>\n<article><p class=\"eyebrow\">FOCUSED WORKSHOP</p><h3>Sacred Listening</h3><p>Three experiential sessions that help people become more present, listen with compassion, and help others feel seen, heard, and loved.</p><a class=\"button button-secondary\" href=\"sacred-listening.html\">Explore Sacred Listening</a></article>\n</div></div></section>\n\n<section class=\"final-cta\"><div class=\"container reveal\"><p class=\"eyebrow\">A SIMPLE FIRST STEP</p><h2>Tell us about the group you already have.</h2><p class=\"lead\">We’ll learn a little about your community, what you hope to deepen, and whether a four-week Homeward experience—or Sacred Listening—might serve it well.</p><div class=\"final-actions\"><a class=\"button\" href=\"connect.html\">Have a Conversation</a><a class=\"button button-secondary\" href=\"sacred-listening.html\">Explore Sacred Listening</a></div></div></section>\n</main>";
const groupsPageCssV5 = "\n.groups-hero-v5{background:#153A2E;color:#FAF6EF;padding:96px 0}.groups-hero-grid-v5{display:grid;grid-template-columns:1.08fr .92fr;gap:72px;align-items:center}.groups-hero-v5 .eyebrow{color:#E0A443}.groups-hero-v5 h1{font-size:clamp(3.3rem,6vw,5.8rem);line-height:.98;letter-spacing:-.035em;color:#FAF6EF;margin:14px 0 26px}.groups-hero-v5 h1 em{font-weight:400;color:#d9cdb9}.groups-hero-v5 .lead{font-size:1.4rem;line-height:1.5;color:#FAF6EF}.groups-hero-v5 p{color:rgba(250,246,239,.86)}.groups-facts-v5{display:flex;gap:9px;flex-wrap:wrap;margin:28px 0}.groups-facts-v5 span{border:1px solid rgba(250,246,239,.27);border-radius:999px;padding:8px 12px;font-size:.77rem;letter-spacing:.07em;text-transform:uppercase}.groups-hero-card-v5{background:#FAF6EF;color:#153A2E;border-radius:22px;padding:38px}.groups-hero-card-v5 .eyebrow{color:#B35A2A}.groups-hero-card-v5 h2{font-size:2rem;line-height:1.15;color:#153A2E}.groups-hero-card-v5 p{color:#4b514e}.groups-hero-card-v5 li{margin:10px 0}.groups-desire-v5{background:#FAF6EF}.groups-desire-grid-v5{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:1020px;margin:38px auto 0}.groups-desire-grid-v5 article{background:#fff;border:1px solid rgba(21,58,46,.09);border-radius:16px;padding:28px}.groups-desire-grid-v5 strong{font-family:Georgia,serif;color:#153A2E;font-size:1.28rem}.groups-week-grid-v5{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:42px}.groups-week-grid-v5 article{display:grid;grid-template-columns:52px 1fr;gap:18px;background:#FAF6EF;border:1px solid rgba(21,58,46,.1);border-radius:18px;padding:28px}.groups-week-grid-v5 article>span{width:48px;height:48px;border-radius:50%;background:#153A2E;color:#FAF6EF;display:grid;place-items:center;font-family:Georgia,serif}.groups-week-grid-v5 .eyebrow{margin:0 0 4px;color:#B35A2A}.groups-week-grid-v5 h3{font-size:1.5rem;line-height:1.15;margin:0 0 12px;color:#153A2E}.groups-flow-v5{background:#F3ECE1}.groups-flow-grid-v5{display:grid;grid-template-columns:.82fr 1.18fr;gap:72px}.groups-flow-list-v5{border-top:1px solid rgba(21,58,46,.2)}.groups-flow-list-v5 article{display:grid;grid-template-columns:42px 1fr;gap:16px;padding:17px 0;border-bottom:1px solid rgba(21,58,46,.13)}.groups-flow-list-v5 b{width:34px;height:34px;border-radius:50%;background:#6D7D6A;color:#fff;display:grid;place-items:center;font-size:.72rem}.groups-practice-grid-v5{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:40px}.groups-practice-grid-v5 article{border-top:1px solid rgba(21,58,46,.2);padding-top:20px}.groups-practice-grid-v5 h3{font-size:1.2rem;color:#153A2E}.groups-church-grid-v5{display:grid;grid-template-columns:.85fr 1.15fr;gap:72px}.groups-church-v5 h2{color:#FAF6EF}.groups-offer-grid-v5{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:38px}.groups-offer-grid-v5 article{border:1px solid rgba(21,58,46,.11);border-radius:20px;padding:34px;background:#FAF6EF}.groups-offer-grid-v5 h3{font-size:1.8rem;color:#153A2E}@media(max-width:980px){.groups-hero-grid-v5,.groups-flow-grid-v5,.groups-church-grid-v5{grid-template-columns:1fr}.groups-week-grid-v5,.groups-practice-grid-v5{grid-template-columns:1fr 1fr}}@media(max-width:720px){.groups-desire-grid-v5,.groups-week-grid-v5,.groups-practice-grid-v5,.groups-offer-grid-v5{grid-template-columns:1fr}.groups-hero-v5{padding:72px 0}.groups-hero-v5 h1{font-size:3.2rem}.groups-hero-card-v5{padding:28px}.groups-week-grid-v5 article{grid-template-columns:46px 1fr;padding:22px}}\n";

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

let groupsPage = injectCss(await read('circles.html'));
groupsPage = groupsPage
  .replace(/<title>[\s\S]*?<\/title>/i, '<title>4-Week Group Experience — Homeward</title>')
  .replace(/<meta name="description" content="[^"]*">/i, '<meta name="description" content="A four-week Homeward experience for existing Christian small groups, introducing contemplative prayer, Centering Prayer, Sacred Listening, reflection, and practices for everyday life.">')
  .replace(/<main\b[\s\S]*?<\/main>/i, groupsPageMainV5);
await write('circles.html', groupsPage);

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

await fs.writeFile(path.join(dist, 'assets', 'homeward-group-experience-preview-v4.css'), css + '\n' + groupsPageCssV5, 'utf8');
console.log('Applied Homeward existing-group experience + Sacred Listening shared header v4.');
