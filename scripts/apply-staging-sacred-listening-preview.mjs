import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cssHref = '/assets/sacred-listening-preview.css?v=1';

const read = (name) => fs.readFile(path.join(dist, name), 'utf8');
const write = (name, value) => fs.writeFile(path.join(dist, name), value, 'utf8');

const injectCss = (html) => html.includes(cssHref)
  ? html
  : html.replace('</head>', `<link rel="stylesheet" href="${cssHref}">\n</head>`);

const addSacredNav = (html) => {
  if (html.includes('href="/sacred-listening.html"') || html.includes('href="sacred-listening.html"')) return html;
  return html.replace(
    /(<a\b[^>]*href=["']\/?practices\.html["'][^>]*>Practices<\/a>)/g,
    '$1<a href="/sacred-listening.html">Sacred Listening</a>',
  );
};

const replaceAll = (html, pairs) => pairs.reduce((out, [from, to]) => out.split(from).join(to), html);

const sacredHomeSection = `
<section class="sacred-listening-home section" id="sacred-listening">
  <div class="shell sacred-home-grid">
    <div class="sacred-home-copy">
      <p class="eyebrow">AVAILABLE NOW · SACRED LISTENING</p>
      <h2>What if helping someone began with listening?</h2>
      <p class="sacred-home-lead">Sacred Listening is a three-session, Jesus-centered workshop that helps people become more present, see one another with love, and listen without rushing to fix, advise, or supply the answer.</p>
      <p>Participants experience contemplative practices and practical listening skills they can carry into friendships, marriage, parenting, small groups, pastoral care, leadership, and everyday conversations.</p>
      <div class="sacred-home-pillars">
        <article><span>01</span><h3>Contemplative Presence</h3><p>Notice what is happening within you. Become still enough to make room for the person in front of you.</p></article>
        <article><span>02</span><h3>Seeing With Love</h3><p>Practice seeing the person, not simply the problem—without judgment, fixing, or assumption.</p></article>
        <article><span>03</span><h3>Sacred Listening</h3><p>Ask better questions, reflect what you hear, and let another person's story unfold without taking it over.</p></article>
      </div>
      <div class="sacred-actions"><a class="button button-copper" href="/sacred-listening.html">Explore Sacred Listening</a><a class="button button-outline" href="/connect.html">Bring It to Your Group</a></div>
    </div>
    <div class="sacred-home-visual" aria-label="Sacred Listening: Be present, see with love, listen deeply">
      <div class="sacred-orbit sacred-orbit-one"><span>BE PRESENT</span></div>
      <div class="sacred-orbit sacred-orbit-two"><span>SEE WITH LOVE</span></div>
      <div class="sacred-orbit sacred-orbit-three"><span>LISTEN DEEPLY</span></div>
      <div class="sacred-center-mark">H</div>
      <blockquote>“Everyone should be quick to listen, slow to speak…”<cite>James 1:19</cite></blockquote>
      <p class="sacred-format-chip">3 sessions · 90 minutes each · Experiential</p>
    </div>
  </div>
</section>`;

function patchHomepage(html) {
  html = injectCss(addSacredNav(html));

  html = html.replace(/<section\b[^>]*class=["'][^"']*\bhero\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i, (section) => {
    let out = section;
    out = out.replace(/<p class="eyebrow">[\s\S]*?<\/p>/i, '<p class="eyebrow">HOMEWARD</p>');
    out = out.replace(/<p class="hero-lead">[\s\S]*?<\/p>/i,
      '<p class="hero-lead">Homeward is a Jesus-centered community of practice helping people experience God more deeply through contemplative practice, honest conversation, and everyday formation. Sacred Listening workshops can be hosted now; Homeward Circles are planned to begin in 2027.</p>');
    out = out.replace(/<div class="hero-actions">[\s\S]*?<\/div>/i,
      '<div class="hero-actions"><a class="button button-copper" href="/sacred-listening.html">Explore Sacred Listening</a><a class="button button-outline" href="/circles.html">Explore Homeward Circles</a></div>');
    return out;
  });

  html = replaceAll(html, [
    ['YOUR FIRST SEASON · FALL 2026', 'HOMEWARD CIRCLES · BEGINNING 2027'],
    ['SEASON ONE · FALL 2026', 'HOMEWARD CIRCLES · BEGINNING 2027'],
    ['Evening Circles are forming now.', 'The first Homeward Circles are planned for 2027.'],
    ['Exact days and times will be shared as groups form.', 'Join the interest list and we’ll share details as the first groups take shape.'],
    ['Circles are forming · Space is limited', 'Homeward Circles · Beginning in 2027'],
    ['CURIOUS ABOUT A CIRCLE?', 'HOMEWARD CIRCLES · 2027'],
    ['Here’s what happens if you want to explore one.', 'Interested in the first Homeward Circles?'],
    ["I'm interested in joining a Circle", "I'm interested in joining a 2027 Circle"],
    ['We’ll help find your Circle.', 'We’ll keep you informed.'],
    ['We’ll look at location, schedule, online or in-person format, and fit.', 'We’ll share timing, location, and format as the first 2027 Circles take shape.'],
  ]);

  html = html.replace(
    '<option>I\'d like to learn more about Homeward</option>',
    '<option>I\'d like to learn more about Homeward</option><option>I\'m interested in a Sacred Listening workshop</option>',
  );

  if (!html.includes('id="sacred-listening"')) {
    if (/<section\b[^>]*class=["'][^"']*\bcircle-different\b/i.test(html)) {
      html = html.replace(/<section\b([^>]*class=["'][^"']*\bcircle-different\b)/i, `${sacredHomeSection}\n<section$1`);
    } else {
      html = html.replace(/<section\b([^>]*class=["'][^"']*\bjourney\b)/i, `${sacredHomeSection}\n<section$1`);
    }
  }
  return html;
}

function patchCircles(html) {
  html = addSacredNav(html);
  return replaceAll(html, [
    ['Evening Circles are forming now in Fort Worth and online.', 'The first Homeward Circles are planned for 2027. Join the interest list and we’ll keep you informed as the first groups take shape.'],
    ['Evening Circles are forming now.', 'The first Homeward Circles are planned for 2027.'],
    ['Tell Us You’re Interested', 'Join the 2027 Interest List'],
    ["Tell Us You're Interested", 'Join the 2027 Interest List'],
    ['We’ll help find the right Circle', 'We’ll keep you informed as Circles take shape'],
    ['We’ll consider location, schedule, online or in-person format, and fit as we form the next Circle.', 'We’ll share location, schedule, and format as the first 2027 Circles take shape.'],
  ]).replace(
    /(<section\b[^>]*class=["'][^"']*\bpage-hero\b[^"']*["'][^>]*>[\s\S]*?<div class="container[^>]*>)/i,
    '$1<p class="circle-2027-kicker">CIRCLES BEGINNING IN 2027</p>',
  );
}

const sacredPageMain = `
<main class="sacred-page">
  <section class="sacred-page-hero">
    <div class="shell sacred-page-hero-grid">
      <div class="sacred-page-hero-copy">
        <p class="eyebrow">SACRED LISTENING WORKSHOP</p>
        <h1>Be present.<br/><em>See with love.</em><br/>Listen deeply.</h1>
        <p class="lead">Some of the most important moments in another person’s life do not require us to have the answer. They require us to be there.</p>
        <p>Sacred Listening is a three-session experiential workshop that helps us become more present to God, more aware of what is happening within ourselves, and more capable of offering another person the rare gift of being deeply heard.</p>
        <div class="sacred-facts"><span>3 sessions</span><span>90 minutes each</span><span>Jesus-centered</span><span>Practice-based</span></div>
        <div class="sacred-actions"><button class="button button-copper" type="button" data-calendar-open data-event="sacred_listening_conversation_click">Have a Conversation</button><a class="button button-outline sacred-light-outline" href="/#interest">I’m Interested</a></div>
      </div>
      <div class="sacred-page-visual">
        <div class="sacred-orbit sacred-orbit-one"><span>BE PRESENT</span></div>
        <div class="sacred-orbit sacred-orbit-two"><span>SEE WITH LOVE</span></div>
        <div class="sacred-orbit sacred-orbit-three"><span>LISTEN DEEPLY</span></div>
        <div class="sacred-center-mark">H</div>
        <blockquote>“Everyone should be quick to listen, slow to speak…”<cite>James 1:19</cite></blockquote>
      </div>
    </div>
  </section>

  <section class="section sacred-intro"><div class="shell narrow"><p class="eyebrow">WHY IT MATTERS</p><h2>Most of us were never taught how to listen.</h2><p class="lead">We know how to respond. We know how to give advice. We know how to tell someone what happened to us. But listening deeply asks something more of us.</p><p>It asks us to quiet the conversation happening inside ourselves long enough to become genuinely present to the person in front of us. That is why Sacred Listening begins with contemplation. Before we learn what to say, we practice how to be.</p></div></section>

  <section class="section section-white sacred-sessions"><div class="shell"><div class="section-heading centered"><p class="eyebrow">THE WORKSHOP</p><h2>Three sessions. One movement toward deeper presence.</h2></div><div class="sacred-session-grid">
    <article><span class="sacred-session-number">01</span><p class="eyebrow">CONTEMPLATIVE PRESENCE</p><h3>Becoming present before trying to help.</h3><p>We begin by noticing what is happening inside us and creating space around it. Simple contemplative practices help us slow down, return to the present, and become more available to God and the person in front of us.</p><p class="sacred-practice-line"><strong>You’ll practice:</strong> stillness, noticing internal reactions, returning attention, and making space before responding.</p><p class="sacred-movement">From reacting → to presence.</p></article>
    <article><span class="sacred-session-number">02</span><p class="eyebrow">SEEING WITH LOVE</p><h3>Learning to see the person—not the problem.</h3><p>We practice recognizing assumptions and judgment, becoming curious about another person’s experience, and remembering that the person across from us carries a story and sacred worth larger than what we can immediately see.</p><p class="sacred-practice-line"><strong>You’ll practice:</strong> compassion, curiosity, noticing judgment, and holding another person’s story with humility.</p><p class="sacred-movement">From evaluating → to seeing.</p></article>
    <article><span class="sacred-session-number">03</span><p class="eyebrow">SACRED LISTENING</p><h3>Helping another person feel genuinely heard.</h3><p>Presence becomes practical. We learn to listen beneath the surface—hearing information, emotion, meaning, longing, and what may still be difficult to put into words.</p><p class="sacred-practice-line"><strong>You’ll practice:</strong> open questions, reflective listening, listening for feeling and meaning, staying curious, and knowing when not to fix.</p><p class="sacred-movement">From answering → to listening.</p></article>
  </div></div></section>

  <section class="section sacred-outcomes"><div class="shell"><div class="section-heading centered"><p class="eyebrow">WHAT YOU CARRY WITH YOU</p><h2>A practice for real relationships.</h2></div><div class="sacred-outcome-grid">
    <article><h3>More presence</h3><p>Notice your own reactions without letting them control the conversation.</p></article>
    <article><h3>Deeper connection</h3><p>Help the people you care about feel known rather than managed.</p></article>
    <article><h3>Better questions</h3><p>Ask questions that invite reflection rather than interrogation or advice.</p></article>
    <article><h3>A contemplative foundation</h3><p>Use silence, attention, prayer, and awareness in ordinary relationships.</p></article>
    <article><h3>A repeatable way to listen</h3><p>Carry the practice into small groups, marriage, parenting, friendship, leadership, pastoral care, and recovery.</p></article>
  </div></div></section>

  <section class="sacred-taste"><div class="shell narrow"><p class="eyebrow">EXPERIENCE BEFORE EXPLANATION</p><h2>Some things have to be practiced.</h2><p>You could read a hundred pages about silence and still not know silence. You could study listening techniques and still find yourself planning your response while another person is talking.</p><p class="sacred-orange-line">It is a little like trying to explain the taste of an orange to someone who has never tasted one. At some point, you take a bite.</p><p>Sacred Listening is designed that way. We practice contemplation. We practice listening. We notice what happens. Then we practice again.</p></div></section>

  <section class="section section-white sacred-audiences"><div class="shell"><div class="section-heading centered"><p class="eyebrow">FOR CHURCHES, GROUPS & LEADERS</p><h2>A simple practice with many places to live.</h2><p class="lead">Sacred Listening can stand on its own as a workshop or become an introduction to the deeper formation practices behind Homeward.</p></div><div class="sacred-audience-grid">
    <article><h3>Small groups & discipleship</h3><p>Create conversations with greater honesty, presence, and trust.</p></article>
    <article><h3>Pastoral care & care teams</h3><p>Accompany people without immediately trying to solve their pain.</p></article>
    <article><h3>Church staff & ministry leaders</h3><p>Listen to people, one another, and God before acting.</p></article>
    <article><h3>Recovery & support communities</h3><p>Build spaces where people can tell the truth without shame, fixing, or judgment.</p></article>
    <article><h3>Parents, couples & friendships</h3><p>Practice the kind of attention that helps another person feel genuinely known.</p></article>
  </div></div></section>

  <section class="sacred-final"><div class="shell narrow centered"><p class="eyebrow">THE FORMAT</p><h2>Three 90-minute sessions. Less lecture. More practice.</h2><p class="lead">Homeward can facilitate the workshop directly and help a church or group carry what serves into its existing ministry rather than asking it to become something new.</p><div class="sacred-actions sacred-actions-center"><button class="button button-copper" type="button" data-calendar-open data-event="sacred_listening_conversation_click">Bring Sacred Listening to Your Group</button><a class="button button-outline" href="/">Explore Homeward</a></div></div></section>
</main>`;

function buildSacredPage(base) {
  const header = base.match(/<header\b[\s\S]*?<\/header>/i)?.[0] || '';
  const tailIndex = base.search(/<footer\b/i);
  const tail = tailIndex >= 0 ? base.slice(tailIndex) : '</body></html>';
  const head = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sacred Listening Workshop — Homeward</title><meta name="description" content="Sacred Listening is a three-session, Jesus-centered workshop from Homeward that combines contemplative presence, seeing with love, and practical deep-listening skills."><meta property="og:title" content="Sacred Listening Workshop — Homeward"><meta property="og:description" content="Be present. See with love. Listen deeply. A three-session experiential workshop for churches, groups, leaders, and everyday relationships."><meta property="og:type" content="website"><meta name="theme-color" content="#153A2E"><link rel="icon" href="/assets/mark-forest.png"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="${cssHref}"></head><body class="sacred-listening-page">`;
  return addSacredNav(`${head}${header}${sacredPageMain}${tail}`);
}

const css = `
:root{--sacred-forest:#153A2E;--sacred-ivory:#FAF6EF;--sacred-sage:#6D7D6A;--sacred-copper:#B35A2A;--sacred-gold:#E0A443;--sacred-charcoal:#2C2C2C}
.sacred-listening-home{background:var(--sacred-ivory);overflow:hidden}.sacred-home-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(320px,.85fr);gap:64px;align-items:center}.sacred-home-copy h2,.sacred-page h1,.sacred-page h2{letter-spacing:-.025em}.sacred-home-lead{font-size:1.25rem;line-height:1.65}.sacred-home-pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:34px 0}.sacred-home-pillars article{border-top:1px solid rgba(21,58,46,.22);padding-top:18px}.sacred-home-pillars span,.sacred-session-number{display:block;color:var(--sacred-copper);font-weight:700;letter-spacing:.12em;font-size:.78rem;margin-bottom:9px}.sacred-home-pillars h3{font-size:1.05rem;margin-bottom:8px}.sacred-home-pillars p{font-size:.95rem}.sacred-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.sacred-home-visual,.sacred-page-visual{position:relative;min-height:520px;display:flex;align-items:center;justify-content:center}.sacred-orbit{position:absolute;border:1px solid rgba(21,58,46,.25);border-radius:50%;display:flex;align-items:flex-start;justify-content:center}.sacred-orbit span{background:var(--sacred-ivory);padding:0 10px;transform:translateY(-8px);font-size:.72rem;letter-spacing:.16em;font-weight:700;color:var(--sacred-forest)}.sacred-orbit-one{width:390px;height:390px}.sacred-orbit-two{width:300px;height:300px}.sacred-orbit-three{width:210px;height:210px}.sacred-center-mark{width:68px;height:68px;border-radius:50%;background:var(--sacred-forest);color:var(--sacred-ivory);display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:28px;z-index:2}.sacred-home-visual blockquote,.sacred-page-visual blockquote{position:absolute;bottom:46px;max-width:310px;text-align:center;font-family:Georgia,serif;font-size:1.2rem;line-height:1.5;color:var(--sacred-charcoal);margin:0}.sacred-home-visual cite,.sacred-page-visual cite{display:block;font-family:inherit;font-style:normal;font-size:.72rem;letter-spacing:.14em;color:var(--sacred-sage);margin-top:8px}.sacred-format-chip{position:absolute;bottom:0;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--sacred-sage)}
.sacred-page-hero{background:var(--sacred-forest);color:var(--sacred-ivory);padding:96px 0 88px}.sacred-page-hero-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,.8fr);gap:72px;align-items:center}.sacred-page-hero .eyebrow{color:var(--sacred-gold)}.sacred-page-hero h1{font-size:clamp(3rem,6vw,5.8rem);line-height:.98;color:var(--sacred-ivory);margin:16px 0 28px}.sacred-page-hero h1 em{color:#d9cdb9;font-weight:400}.sacred-page-hero .lead{font-size:1.35rem;line-height:1.55;max-width:680px}.sacred-page-hero p{color:rgba(250,246,239,.86)}.sacred-facts{display:flex;gap:10px;flex-wrap:wrap;margin:28px 0}.sacred-facts span{border:1px solid rgba(250,246,239,.28);border-radius:999px;padding:8px 12px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase}.sacred-page-hero .sacred-orbit{border-color:rgba(250,246,239,.26)}.sacred-page-hero .sacred-orbit span{background:var(--sacred-forest);color:var(--sacred-ivory)}.sacred-page-hero .sacred-center-mark{background:var(--sacred-ivory);color:var(--sacred-forest)}.sacred-page-hero .sacred-page-visual blockquote{color:var(--sacred-ivory)}.sacred-page-hero .sacred-page-visual cite{color:rgba(250,246,239,.68)}.sacred-light-outline{border-color:rgba(250,246,239,.55)!important;color:var(--sacred-ivory)!important}.sacred-intro{text-align:center}.sacred-intro .lead{max-width:850px;margin:22px auto}.sacred-sessions{background:#fff}.sacred-session-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:42px}.sacred-session-grid article{background:var(--sacred-ivory);padding:34px;border-radius:18px;border:1px solid rgba(21,58,46,.09)}.sacred-session-grid h3{font-size:1.5rem;line-height:1.25;margin:8px 0 18px}.sacred-practice-line{font-size:.94rem}.sacred-movement{color:var(--sacred-copper);font-weight:700;margin-top:22px}.sacred-outcome-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:40px}.sacred-outcome-grid article,.sacred-audience-grid article{border-top:1px solid rgba(21,58,46,.22);padding-top:20px}.sacred-outcome-grid h3,.sacred-audience-grid h3{font-size:1.05rem}.sacred-taste{background:var(--sacred-forest);color:var(--sacred-ivory);padding:84px 0;text-align:center}.sacred-taste .eyebrow{color:var(--sacred-gold)}.sacred-taste h2{color:var(--sacred-ivory)}.sacred-taste p{color:rgba(250,246,239,.84);font-size:1.08rem;line-height:1.75}.sacred-orange-line{font-family:Georgia,serif;font-size:1.5rem!important;color:var(--sacred-ivory)!important;margin:28px auto;max-width:830px}.sacred-audience-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:18px;margin-top:42px}.sacred-final{background:var(--sacred-ivory);padding:88px 0}.sacred-actions-center{justify-content:center}.circle-2027-kicker{display:inline-block;margin:0 0 18px;padding:7px 11px;border-radius:999px;background:rgba(224,164,67,.16);color:#FAF6EF;font-size:.72rem;letter-spacing:.12em;font-weight:700}.centered{text-align:center}
@media(max-width:980px){.sacred-home-grid,.sacred-page-hero-grid{grid-template-columns:1fr}.sacred-home-visual,.sacred-page-visual{min-height:460px}.sacred-session-grid{grid-template-columns:1fr}.sacred-outcome-grid,.sacred-audience-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:680px){.sacred-home-grid{gap:30px}.sacred-home-pillars{grid-template-columns:1fr}.sacred-home-visual,.sacred-page-visual{min-height:390px}.sacred-orbit-one{width:310px;height:310px}.sacred-orbit-two{width:235px;height:235px}.sacred-orbit-three{width:160px;height:160px}.sacred-home-visual blockquote,.sacred-page-visual blockquote{bottom:18px;font-size:1.05rem}.sacred-page-hero{padding:72px 0}.sacred-page-hero h1{font-size:3.3rem}.sacred-outcome-grid,.sacred-audience-grid{grid-template-columns:1fr}.sacred-actions .button{width:100%;text-align:center}}
`;

await fs.mkdir(path.join(dist, 'assets'), { recursive: true });
await fs.writeFile(path.join(dist, 'assets', 'sacred-listening-preview.css'), css, 'utf8');

let home = await read('index.html');
home = patchHomepage(home);
await write('index.html', home);

let circles = await read('circles.html');
circles = patchCircles(circles);
await write('circles.html', circles);

const base = await read('practices.html');
await write('sacred-listening.html', buildSacredPage(base));

const rootFiles = await fs.readdir(dist, { withFileTypes: true });
for (const entry of rootFiles) {
  if (!entry.isFile() || !entry.name.endsWith('.html') || ['index.html','circles.html','sacred-listening.html'].includes(entry.name)) continue;
  const filePath = path.join(dist, entry.name);
  const html = await fs.readFile(filePath, 'utf8');
  if (/<header\b/i.test(html)) await fs.writeFile(filePath, addSacredNav(html), 'utf8');
}

console.log('Applied staging Sacred Listening + 2027 Circles preview.');
