import { promises as fs } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const read = async (name) => fs.readFile(new URL(name, dist), 'utf8');
const write = async (name, html) => fs.writeFile(new URL(name, dist), html);

const v8Styles = `
<style id="homeward-v8-front-door">
.v8-editorial{padding:clamp(72px,10vw,132px) 0;background:var(--ivory,#faf6ef);}
.v8-editorial .v8-inner{max-width:820px;margin:0 auto;text-align:center;}
.v8-editorial .eyebrow{margin-bottom:18px;}
.v8-editorial h2{max-width:760px;margin:0 auto;font-family:var(--serif,Georgia,serif);font-size:clamp(2.3rem,5vw,4.5rem);line-height:1.02;letter-spacing:-.035em;color:var(--forest,#153a2e);}
.v8-editorial .v8-body{max-width:720px;margin:26px auto 0;font-size:clamp(1.05rem,1.6vw,1.25rem);line-height:1.75;color:var(--forest,#153a2e);}
.v8-outcomes{margin-top:38px;padding-top:22px;border-top:1px solid rgba(21,58,46,.18);font-size:.88rem;letter-spacing:.12em;text-transform:uppercase;color:var(--copper,#b35a2a);}
.v8-gifts{padding:clamp(68px,8vw,110px) 0;background:#fff;}
.v8-gifts-head{max-width:780px;margin:0 auto 46px;text-align:center;}
.v8-gifts-head h2{font-family:var(--serif,Georgia,serif);font-size:clamp(2rem,4vw,3.5rem);color:var(--forest,#153a2e);margin:.2em 0;}
.v8-gift-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid rgba(21,58,46,.16);border-bottom:1px solid rgba(21,58,46,.16);}
.v8-gift{padding:34px 28px 38px;border-right:1px solid rgba(21,58,46,.14);}
.v8-gift:last-child{border-right:0;}
.v8-gift h3{font-family:var(--serif,Georgia,serif);font-size:1.55rem;color:var(--forest,#153a2e);margin:0 0 10px;}
.v8-gift p{margin:0;line-height:1.65;color:var(--forest,#153a2e);}
.v8-gift-note{max-width:720px;margin:28px auto 0;text-align:center;font-size:1rem;line-height:1.65;color:var(--forest,#153a2e);}
.v8-different{padding:clamp(72px,9vw,120px) 0;background:var(--ivory,#faf6ef);}
.v8-different .v8-inner{max-width:820px;margin:0 auto;}
.v8-different h2{font-family:var(--serif,Georgia,serif);font-size:clamp(2.1rem,4vw,3.6rem);line-height:1.05;color:var(--forest,#153a2e);margin:0 0 22px;}
.v8-different p{font-size:1.08rem;line-height:1.75;color:var(--forest,#153a2e);margin:0 0 18px;}
.v8-questions{margin:28px 0;padding:22px 0;border-top:1px solid rgba(21,58,46,.16);border-bottom:1px solid rgba(21,58,46,.16);font-family:var(--serif,Georgia,serif);font-size:1.35rem;line-height:1.65;color:var(--forest,#153a2e);}
.v8-questions strong{font-weight:600;}
.v8-signature{margin-top:30px;font-size:.9rem!important;letter-spacing:.12em;text-transform:uppercase;color:var(--copper,#b35a2a)!important;}
.v8-final-note{margin-top:28px;font-size:1rem!important;}
.v8-circle-comparison{padding:clamp(72px,9vw,120px) 0;background:#fff;}
.v8-circle-comparison .container{max-width:1040px;}
.v8-comparison-intro{max-width:780px;margin:0 auto 42px;text-align:center;}
.v8-comparison-intro h2{font-family:var(--serif,Georgia,serif);font-size:clamp(2.2rem,4vw,3.6rem);line-height:1.05;color:var(--forest,#153a2e);}
.v8-comparison{border-top:1px solid rgba(21,58,46,.16);}
.v8-comparison-row{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid rgba(21,58,46,.16);}
.v8-comparison-row>div{padding:26px 30px;}
.v8-comparison-row>div+div{border-left:1px solid rgba(21,58,46,.16);background:var(--ivory,#faf6ef);}
.v8-comparison-label{font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--copper,#b35a2a);margin-bottom:8px;}
.v8-comparison p{margin:0;line-height:1.65;color:var(--forest,#153a2e);}
.v8-comparison-quote{font-family:var(--serif,Georgia,serif);font-size:1.15rem;margin-top:7px!important;}
.v8-comparison-close{max-width:760px;margin:36px auto 0;text-align:center;font-size:1.05rem;line-height:1.7;color:var(--forest,#153a2e);}
@media (max-width:800px){.v8-gift-grid{grid-template-columns:1fr 1fr}.v8-gift:nth-child(2){border-right:0}.v8-gift:nth-child(-n+2){border-bottom:1px solid rgba(21,58,46,.14)}.v8-comparison-row{grid-template-columns:1fr}.v8-comparison-row>div+div{border-left:0;border-top:1px solid rgba(21,58,46,.12)}}
@media (max-width:560px){.v8-gift-grid{grid-template-columns:1fr}.v8-gift{border-right:0!important;border-bottom:1px solid rgba(21,58,46,.14)}.v8-gift:last-child{border-bottom:0}}
</style>`;

const hero = `
<section class="hero hero-v4 v8-hero">
  <div aria-hidden="true" class="hero-bg"></div>
  <div class="container">
    <div class="hero-content reveal">
      <p class="eyebrow">HOMEWARD CIRCLES</p>
      <h1>You learned what to believe.<br><em>But were you ever taught how to practice?</em></h1>
      <p class="hero-copy">Homeward Circles are free, four-week gatherings where people practice the way of Jesus together—through prayer, silence, Scripture, reflection, and honest conversation. No church membership or settled beliefs required.</p>
      <div class="hero-actions">
        <a class="button" href="#interest" data-event="interest_hero_click">Tell Us You’re Interested</a>
        <a class="button button-ghost-light" href="circles.html" data-event="circle_details_view">See How a Circle Works</a>
      </div>
      <p class="v8-hero-logistics">Fort Worth + online <span>·</span> Six to eight people <span>·</span> Four weeks <span>·</span> No cost<br><strong>No church membership or settled beliefs required.</strong></p>
    </div>
  </div>
</section>`;

const bridge = `
<section class="v8-editorial">
  <div class="container v8-inner">
    <p class="eyebrow">SPIRITUAL PRACTICES</p>
    <h2>Exercises for the heart and mind.</h2>
    <div class="v8-body">
      <p>We exercise our bodies to become stronger, healthier, and more capable. Spiritual practices train our inner life in much the same way—strengthening attention, opening the heart, and helping us return to God in the middle of ordinary life.</p>
      <p>Over time, the hope is a life marked by greater focus, more peace and steadiness, deeper connection, more joy and happiness, and a growing capacity to love and serve.</p>
    </div>
    <div class="v8-outcomes">Focus · Peace · Joy · Happiness · Connection · Love</div>
  </div>
</section>`;

const gifts = `
<section class="v8-gifts" id="practices">
  <div class="container">
    <div class="v8-gifts-head">
      <p class="eyebrow">FOUR GIFTS</p>
      <h2>In four weeks, you’ll experience four gifts.</h2>
      <p class="lead">The practices are the training. A more peaceful, joyful, loving—and ultimately happier—life is the hope.</p>
    </div>
    <div class="v8-gift-grid">
      <article class="v8-gift"><h3>Breath Prayer</h3><p>More peace. Less reactivity.</p></article>
      <article class="v8-gift"><h3>Gratitude</h3><p>More joy, appreciation, and happiness in ordinary life.</p></article>
      <article class="v8-gift"><h3>Light of Christ</h3><p>More love, openness, and connection with God and others.</p></article>
      <article class="v8-gift"><h3>Scripture as Encounter</h3><p>More wisdom, meaning, and a deeper connection with God.</p></article>
    </div>
  </div>
</section>`;

const difference = `
<section class="v8-different">
  <div class="container v8-inner">
    <p class="eyebrow">WHY A CIRCLE IS DIFFERENT</p>
    <h2>Not your ordinary small group.</h2>
    <p>Many Christian small groups naturally center on understanding Scripture and faith: <em>What does this passage teach? What do Christians believe? How should we understand this?</em></p>
    <p>Homeward adds another layer. We gather around practice, personal reflection, lived experience, and honest conversation.</p>
    <p>Scripture remains important and Jesus remains at the center. Understanding matters. But spiritual formation asks another question: how does what we encounter in Scripture and prayer actually become part of the way we live?</p>
    <div class="v8-questions"><strong>What are you noticing?</strong><br><strong>What is this stirring in you?</strong><br><strong>Where might God be inviting you?</strong><br><strong>What could you actually practice this week?</strong></div>
    <p>A facilitator guides the experience, but does not function primarily as the person with the correct answer. People speak from their own experience, listen deeply to one another, and are not expected to debate, fix, correct, or force agreement. Anyone may pass.</p>
    <p>We practice together during the gathering, then carry a simple practice into ordinary life and return to reflect on what we noticed.</p>
    <p class="v8-signature">Practice the way. Explore honestly. Carry it into life.</p>
    <p class="v8-final-note">Homeward doesn't replace church or traditional small groups. It offers another dimension many people have been missing: a place to actually practice the inner life with others.</p>
  </div>
</section>`;

const circleComparison = `
<section class="v8-circle-comparison">
  <div class="container">
    <div class="v8-comparison-intro">
      <p class="eyebrow">A DEEPER LOOK</p>
      <h2>Understanding matters. Homeward adds encounter, practice, and formation.</h2>
      <p class="lead">This isn't a judgment on traditional groups. Many offer meaningful friendship, teaching, and Scripture study. A Homeward Circle builds on that foundation by making spiritual practice part of the experience.</p>
    </div>
    <div class="v8-comparison">
      <div class="v8-comparison-row"><div><div class="v8-comparison-label">May emphasize</div><p>Understanding doctrine and beliefs.</p><p class="v8-comparison-quote"><em>What is sin? Who is Jesus? What does this passage teach?</em></p></div><div><div class="v8-comparison-label">Homeward emphasizes</div><p>Practice, personal reflection, and spiritual formation.</p><p class="v8-comparison-quote"><em>What am I noticing? What is God inviting? How might I practice this?</em></p></div></div>
      <div class="v8-comparison-row"><div><div class="v8-comparison-label">May emphasize</div><p>Discussing Scripture primarily to understand or interpret it.</p></div><div><div class="v8-comparison-label">Homeward</div><p>Engaging Scripture as both wisdom to understand and an encounter that can shape how we live.</p></div></div>
      <div class="v8-comparison-row"><div><div class="v8-comparison-label">May emphasize</div><p>A leader teaching, explaining, or helping the group reach answers.</p></div><div><div class="v8-comparison-label">Homeward</div><p>A facilitator who participates, guides the process, and protects the quality of listening.</p></div></div>
      <div class="v8-comparison-row"><div><div class="v8-comparison-label">May emphasize</div><p>Sharing ideas, interpretations, and opinions.</p></div><div><div class="v8-comparison-label">Homeward</div><p>Speaking from lived experience, listening deeply, and reflecting personally.</p></div></div>
      <div class="v8-comparison-row"><div><div class="v8-comparison-label">May emphasize</div><p>Prayer primarily through words, requests, or discussion.</p></div><div><div class="v8-comparison-label">Homeward</div><p>Prayer that can also include meditation, silence, breath, attention, imagination, and receptive listening.</p></div></div>
      <div class="v8-comparison-row"><div><div class="v8-comparison-label">May emphasize</div><p>Much of the experience happening during the meeting.</p></div><div><div class="v8-comparison-label">Homeward</div><p>A simple practice carried into everyday life and brought back for reflection the following week.</p></div></div>
      <div class="v8-comparison-row"><div><div class="v8-comparison-label">May emphasize</div><p>Shared beliefs or reaching similar conclusions as an important part of belonging.</p></div><div><div class="v8-comparison-label">Homeward</div><p>People exploring honestly without pressure to reach identical conclusions.</p></div></div>
    </div>
    <p class="v8-comparison-close"><strong>We speak from experience. We listen without fixing. We make room for silence. We practice together. And anyone may pass.</strong></p>
    <p class="v8-comparison-close">Homeward doesn't replace church or traditional small groups. It offers another dimension many people have been missing: a place to actually practice the inner life with others.</p>
  </div>
</section>`;

let home = await read('index.html');
home = home.replace('</head>', `${v8Styles}\n</head>`);
home = home.replace(/<section class="hero hero-v4[\s\S]*?<\/section>/i, hero);
home = home.replace(/<section class="rooted-line"[\s\S]*?<\/section>/i, '');
home = home.replace(/<section class="section section-white circles-feature"[\s\S]*?<\/section>/i, '');
home = home.replace(/<section class="section video-module"[\s\S]*?<\/section>/i, '');
home = home.replace(/<section class="section"[^>]*id="what-is-homeward"[\s\S]*?<\/section>/i, '');
home = home.replace(/<section class="section practice-section"[\s\S]*?<\/section>/i, `${bridge}${gifts}${difference}`);
home = home.replace('</head>', '</head>');
await write('index.html', home);

let circles = await read('circles.html');
circles = circles.replace('</head>', `${v8Styles}\n</head>`);
const rhythmMarker = /<section class="section"><div class="container"><div class="center reveal"><p class="eyebrow">[^<]*<\/p><h2>[^<]*<\/h2><p class="lead"[\s\S]*?<\/section>/i;
circles = circles.replace(rhythmMarker, circleComparison);
circles = circles.replace(/Eight weeks/g, 'Four weeks').replace(/eight-week/g, 'four-week').replace(/eight weeks/g, 'four weeks');
await write('circles.html', circles);
`;

const v8HeroCss = `
<style id="homeward-v8-hero">
.v8-hero .hero-bg{background-image:linear-gradient(90deg,rgba(10,34,27,.78) 0%,rgba(10,34,27,.48) 48%,rgba(10,34,27,.18) 100%),url('assets/circles-home-v62.webp');background-size:cover;background-position:center;}
.v8-hero-logistics{margin:28px 0 0;color:rgba(255,255,255,.9);font-size:.78rem;line-height:1.8;letter-spacing:.08em;text-transform:uppercase;}
.v8-hero-logistics span{padding:0 .35em;color:rgba(255,255,255,.55)}
.v8-hero-logistics strong{font-weight:600;letter-spacing:.04em;text-transform:none;}
</style>`;

// Insert the hero-specific rules alongside the shared V8 editorial styles.
home = (await read('index.html')).replace('</head>', `${v8HeroCss}\n</head>`);
await write('index.html', home);
