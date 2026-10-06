import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cssHref = '/assets/sacred-listening-preview-v2.css?v=2';

const read = (name) => fs.readFile(path.join(dist, name), 'utf8');
const write = (name, value) => fs.writeFile(path.join(dist, name), value, 'utf8');
const injectCss = (html) => html.includes(cssHref) ? html : html.replace('</head>', `<link rel="stylesheet" href="${cssHref}">\n</head>`);

const workshopHome = `
<section class="sl2-home section" id="sacred-listening">
  <div class="shell">
    <div class="sl2-heading">
      <div>
        <p class="eyebrow">AVAILABLE NOW · SACRED LISTENING WORKSHOP</p>
        <h2>Listen well. Love deeper.<br/><em>See Christ in each other.</em></h2>
      </div>
      <div class="sl2-heading-copy">
        <p class="sl2-lead">A three-session experiential workshop where participants practice contemplative presence, learn practical listening tools, and experience what it feels like to help another person feel seen, heard, and loved.</p>
        <p>You won't only talk about listening. You'll slow down, practice it with real people, reflect on what happens, and leave with tools you can use in your very next conversation.</p>
      </div>
    </div>

    <div class="sl2-triad" aria-label="Sacred Listening: Pause, See, Listen">
      <article class="sl2-card pause"><div class="sl2-icon">Ⅱ</div><p class="eyebrow">01 · CONTEMPLATIVE PRESENCE</p><h3>PAUSE</h3><p>Notice what's happening inside. Breathe. Make space. Become present rather than reactive.</p></article>
      <article class="sl2-card see"><div class="sl2-icon">◉</div><p class="eyebrow">02 · SACRED REGARD</p><h3>SEE</h3><p>See the light of Christ in yourself and in others. Approach with curiosity, compassion, and humility.</p></article>
      <article class="sl2-card listen"><div class="sl2-icon">♡</div><p class="eyebrow">03 · DEEP LISTENING</p><h3>LISTEN</h3><p>Give your full attention. Be with, not fix. Listen for what's in the heart and what God may be saying.</p></article>
    </div>

    <div class="sl2-home-bottom">
      <blockquote>“Everyone should be quick to listen, slow to speak…”<cite>James 1:19</cite></blockquote>
      <div><strong>3 sessions · 90 minutes each · Practice-based · Jesus-centered</strong><p>Guided contemplative practice · real listening exercises · reflection · practical tools</p></div>
      <div class="sl2-actions"><a class="button button-copper" href="/sacred-listening.html">Explore the Workshop</a><a class="button button-outline" href="/connect.html">Bring It to Your Group</a></div>
    </div>
  </div>
</section>`;

const workshopMain = `
<main class="sacred-page sl2-page">
  <section class="sl2-hero">
    <div class="shell sl2-hero-grid">
      <div class="sl2-hero-copy">
        <p class="eyebrow">SACRED LISTENING WORKSHOP</p>
        <h1>Listen well.<br/><em>Love deeper.</em><br/>See Christ in each other.</h1>
        <p class="lead">A contemplative way of helping people feel seen, heard, and loved.</p>
        <p>Sacred Listening is a <strong>three-session experiential workshop</strong> that combines contemplative practice with practical listening skills. Participants don't simply learn about presence and listening—they practice them with one another, notice what happens, and learn tools they can carry into real conversations.</p>
        <div class="sl2-facts"><span>3 sessions</span><span>90 minutes each</span><span>Experiential</span><span>Jesus-centered</span></div>
        <div class="sl2-actions"><button class="button button-copper" type="button" data-calendar-open data-event="sacred_listening_conversation_click">Bring the Workshop to Your Group</button><a class="button button-outline sl2-light-outline" href="/#interest">I’m Interested</a></div>
      </div>
      <div class="sl2-hero-visual">
        <div class="sl2-circle-diagram">
          <div class="sl2-petal petal-pause"><span>PAUSE</span><small>Contemplative<br/>Presence</small></div>
          <div class="sl2-petal petal-see"><span>SEE</span><small>Sacred<br/>Regard</small></div>
          <div class="sl2-petal petal-listen"><span>LISTEN</span><small>Deep<br/>Listening</small></div>
          <div class="sl2-center">Sacred<br/>Listening</div>
        </div>
        <blockquote>“Be quick to listen, slow to speak, slow to anger.”<cite>James 1:19</cite></blockquote>
      </div>
    </div>
  </section>

  <section class="section sl2-experience"><div class="shell narrow">
    <p class="eyebrow">AN EXPERIENTIAL WORKSHOP</p>
    <h2>You don't just learn about Sacred Listening.<br/><em>You practice it.</em></h2>
    <p class="lead">Each gathering moves between guided contemplation, simple teaching, reflection, and real listening practice. Participants take turns listening and being listened to, then reflect on what helped another person feel safe, known, and heard.</p>
    <div class="sl2-experience-grid">
      <article><strong>Experience</strong><p>Guided prayer, silence, breath, reflection, and embodied presence.</p></article>
      <article><strong>Practice</strong><p>Real conversations where participants try the tools, not simply hear about them.</p></article>
      <article><strong>Reflect</strong><p>Notice what opened connection, what got in the way, and what changed when you stopped trying to fix.</p></article>
      <article><strong>Carry it home</strong><p>Leave with repeatable tools for ministry, friendship, family, leadership, and everyday care.</p></article>
    </div>
  </div></section>

  <section class="section section-white sl2-framework"><div class="shell">
    <div class="section-heading centered"><p class="eyebrow">THE CORE PRACTICE</p><h2>Pause. See. Listen.</h2><p class="lead">Three movements that turn listening from a technique into a way of being with another person.</p></div>
    <div class="sl2-triad sl2-triad-page">
      <article class="sl2-card pause"><div class="sl2-icon">Ⅱ</div><p class="eyebrow">CONTEMPLATIVE PRESENCE</p><h3>PAUSE</h3><p>Notice what's happening within you. Make space through silence, breath, or prayer. Become present rather than reactive.</p><div class="sl2-feels"><strong>Feels like</strong><span>Grounded · calm · open</span></div></article>
      <article class="sl2-card see"><div class="sl2-icon">◉</div><p class="eyebrow">SACRED REGARD</p><h3>SEE</h3><p>Remember that each person is sacred. Listen for grace, longing, pain, and invitation. Ask: <em>How is God meeting this person here?</em></p><div class="sl2-feels"><strong>Feels like</strong><span>Reverent · compassionate · hopeful</span></div></article>
      <article class="sl2-card listen"><div class="sl2-icon">♡</div><p class="eyebrow">DEEP LISTENING</p><h3>LISTEN</h3><p>Offer full attention. Reflect back what you hear. Ask open, gentle questions. Resist fixing, judging, or taking over.</p><div class="sl2-feels"><strong>Feels like</strong><span>Attentive · safe · connected</span></div></article>
    </div>
  </div></section>

  <section class="section sl2-sessions"><div class="shell">
    <div class="section-heading centered"><p class="eyebrow">A SIMPLE THREE-SESSION FOUNDATION</p><h2>Learn it by living it.</h2></div>
    <div class="sl2-session-grid">
      <article><span>1</span><p class="eyebrow">SESSION ONE</p><h3>Becoming Present</h3><p>Slow down and notice what is happening inside you. Experience contemplative practices that help create enough inner space to truly be with another person.</p><strong>Practice:</strong><p>Presence, breath, silence, noticing reactivity, returning attention.</p></article>
      <article><span>2</span><p class="eyebrow">SESSION TWO</p><h3>Listening With Care</h3><p>Practice sacred regard and learn how curiosity, compassion, and humility change what we notice in another person's story.</p><strong>Practice:</strong><p>Open questions, reflecting, clarifying, noticing emotion, listening without deciding.</p></article>
      <article><span>3</span><p class="eyebrow">SESSION THREE</p><h3>Responding With Love</h3><p>Bring presence and listening together in real conversation. Learn how to stay with another person without rescuing, correcting, or taking over.</p><strong>Practice:</strong><p>Empathy, summarizing, compassionate response, boundaries, knowing when to refer.</p></article>
    </div>
  </div></section>

  <section class="section section-white sl2-tools"><div class="shell sl2-tools-grid">
    <div><p class="eyebrow">TOOLS YOU'LL LEARN</p><h2>Simple practices that make a big difference.</h2><p class="lead">Sacred Listening combines contemplative formation with practical listening skills participants can use immediately.</p></div>
    <div class="sl2-tools-list">
      <article><b>01</b><div><strong>Be fully present</strong><p>Set aside distractions. Give your full attention.</p></div></article>
      <article><b>02</b><div><strong>Let them speak</strong><p>Don't interrupt. Allow space and silence.</p></div></article>
      <article><b>03</b><div><strong>Reflect & clarify</strong><p>“What I'm hearing is…” · “Tell me more…”</p></div></article>
      <article><b>04</b><div><strong>Honor their story</strong><p>Don't rush to fix. Each story matters.</p></div></article>
      <article><b>05</b><div><strong>Hold with compassion</strong><p>Stay with them, even in hard emotions.</p></div></article>
      <article><b>06</b><div><strong>Trust God's presence</strong><p>You do not have to have the answers.</p></div></article>
    </div>
  </div></section>

  <section class="sl2-possibility"><div class="shell">
    <p class="eyebrow">WHAT SACRED LISTENING MAKES POSSIBLE</p>
    <div class="sl2-possibility-grid"><article>More grounded presence</article><article>Greater confidence in caring for others</article><article>Deeper, more meaningful conversations</article><article>The joy of helping people feel seen, heard, and loved</article></div>
  </div></section>

  <section class="section sl2-audiences"><div class="shell">
    <div class="section-heading centered"><p class="eyebrow">FOR CHURCHES, CARE GROUPS & LEADERS</p><h2>A workshop people can use on Tuesday.</h2><p class="lead">Sacred Listening can strengthen the relational life already happening inside a church or community without requiring a new program or structure.</p></div>
    <div class="sl2-audience-grid"><article><h3>Care groups & pastoral care</h3><p>Help people accompany grief, change, doubt, pain, and vulnerable stories with greater presence.</p></article><article><h3>Small groups & discipleship</h3><p>Create more honest conversation and less fixing, debating, or performing.</p></article><article><h3>Staff & ministry leaders</h3><p>Build a shared language for presence, curiosity, compassion, and listening before acting.</p></article><article><h3>Recovery & support spaces</h3><p>Help people feel safe enough to tell the truth while respecting role boundaries and referral needs.</p></article><article><h3>Everyday relationships</h3><p>Carry the same practices into parenting, marriage, friendship, leadership, and ordinary care.</p></article></div>
  </div></section>

  <section class="sl2-taste"><div class="shell narrow"><p class="eyebrow">EXPERIENCE BEFORE EXPLANATION</p><h2>You can describe the taste of an orange.<br/>Or you can take a bite.</h2><p>Sacred Listening is built around the same idea. Presence, compassion, and deep listening make more sense when you experience them than when someone merely explains them.</p><p class="sl2-taste-line">Practice it. Feel the difference. Then carry it into life.</p></div></section>

  <section class="sl2-final"><div class="shell narrow centered"><p class="eyebrow">SACRED LISTENING WORKSHOP</p><h2>Three 90-minute sessions.<br/>Less lecture. More practice.</h2><p class="lead">Homeward can facilitate the workshop for an existing church, staff team, care group, small group, or community.</p><div class="sl2-actions sl2-actions-center"><button class="button button-copper" type="button" data-calendar-open data-event="sacred_listening_conversation_click">Bring Sacred Listening to Your Group</button><a class="button button-outline" href="/">Explore Homeward</a></div></div></section>
</main>`;

let home = injectCss(await read('index.html'));
home = home.replace(/<section\b[^>]*id=["']sacred-listening["'][^>]*>[\s\S]*?<\/section>/i, workshopHome);
await write('index.html', home);

let sacred = injectCss(await read('sacred-listening.html'));
sacred = sacred.replace(/<main\b[^>]*class=["'][^"']*sacred-page[^"']*["'][^>]*>[\s\S]*?<\/main>/i, workshopMain);
await write('sacred-listening.html', sacred);

const css = `
.sl2-home{background:#FAF6EF}.sl2-heading{display:grid;grid-template-columns:.9fr 1.1fr;gap:64px;align-items:end;margin-bottom:42px}.sl2-heading h2,.sl2-page h2{letter-spacing:-.03em}.sl2-heading h2 em{font-weight:400;color:#6D7D6A}.sl2-heading-copy{max-width:700px}.sl2-lead{font-size:1.28rem;line-height:1.6;color:#153A2E}.sl2-triad{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.sl2-card{border-radius:20px;padding:34px 28px 30px;min-height:330px;border:1px solid rgba(21,58,46,.08)}.sl2-card.pause{background:#e9eee4}.sl2-card.see{background:#f2ead8}.sl2-card.listen{background:#f1e5df}.sl2-card .sl2-icon{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:#6D7D6A;color:white;font-size:28px;margin-bottom:28px}.sl2-card.see .sl2-icon{background:#E0A443}.sl2-card.listen .sl2-icon{background:#B35A2A}.sl2-card h3{font-family:Georgia,serif;font-size:2.7rem;letter-spacing:.02em;color:#153A2E;margin:6px 0 14px}.sl2-card p{line-height:1.65}.sl2-home-bottom{display:grid;grid-template-columns:.75fr 1fr auto;gap:34px;align-items:center;margin-top:34px;border-top:1px solid rgba(21,58,46,.18);padding-top:30px}.sl2-home-bottom blockquote{font-family:Georgia,serif;font-size:1.15rem;color:#153A2E;margin:0}.sl2-home-bottom cite{display:block;font-size:.72rem;letter-spacing:.12em;color:#6D7D6A;margin-top:8px;font-style:normal}.sl2-home-bottom strong{color:#153A2E}.sl2-home-bottom p{font-size:.92rem;margin:5px 0 0}.sl2-actions{display:flex;gap:12px;flex-wrap:wrap}
.sl2-hero{background:#153A2E;color:#FAF6EF;padding:100px 0 90px}.sl2-hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:72px;align-items:center}.sl2-hero .eyebrow{color:#E0A443}.sl2-hero h1{font-size:clamp(3.4rem,6.3vw,6.1rem);line-height:.96;color:#FAF6EF;letter-spacing:-.035em;margin:16px 0 28px}.sl2-hero h1 em{font-weight:400;color:#d8c9b2}.sl2-hero .lead{font-size:1.45rem;max-width:700px;color:#FAF6EF}.sl2-hero p{color:rgba(250,246,239,.86)}.sl2-facts{display:flex;gap:9px;flex-wrap:wrap;margin:28px 0}.sl2-facts span{border:1px solid rgba(250,246,239,.25);border-radius:999px;padding:8px 12px;font-size:.77rem;letter-spacing:.07em;text-transform:uppercase}.sl2-light-outline{border-color:rgba(250,246,239,.55)!important;color:#FAF6EF!important}.sl2-hero-visual{display:flex;flex-direction:column;align-items:center;gap:28px}.sl2-circle-diagram{position:relative;width:min(480px,100%);aspect-ratio:1/1}.sl2-petal{position:absolute;width:58%;height:58%;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:white;border:5px solid #153A2E}.sl2-petal span{font-family:Georgia,serif;font-size:2rem}.sl2-petal small{margin-top:5px;line-height:1.25}.petal-pause{background:#123f34;left:21%;top:0}.petal-see{background:#D8A13B;left:0;bottom:2%}.petal-listen{background:#6D7D6A;right:0;bottom:2%}.sl2-center{position:absolute;z-index:4;left:50%;top:50%;transform:translate(-50%,-50%);width:31%;height:31%;border-radius:50%;background:#FAF6EF;color:#153A2E;display:grid;place-items:center;text-align:center;font-family:Georgia,serif;font-size:1.45rem;line-height:1.05;border:5px solid #153A2E}.sl2-hero-visual blockquote{font-family:Georgia,serif;font-size:1.15rem;max-width:360px;text-align:center;margin:0;color:#FAF6EF}.sl2-hero-visual cite{display:block;font-size:.72rem;letter-spacing:.15em;font-style:normal;margin-top:8px;color:rgba(250,246,239,.62)}
.sl2-experience{text-align:center}.sl2-experience h2 em{font-weight:400;color:#6D7D6A}.sl2-experience-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:38px;text-align:left}.sl2-experience-grid article{border-top:1px solid rgba(21,58,46,.22);padding-top:18px}.sl2-experience-grid strong{font-family:Georgia,serif;color:#153A2E;font-size:1.2rem}.sl2-triad-page{margin-top:42px}.sl2-feels{border-top:1px solid rgba(21,58,46,.16);margin-top:22px;padding-top:16px;display:flex;flex-direction:column;gap:4px;font-size:.9rem}.sl2-feels strong{color:#153A2E}.sl2-session-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:42px}.sl2-session-grid article{padding:34px;border:1px solid rgba(21,58,46,.12);border-radius:18px;background:#FAF6EF}.sl2-session-grid>article>span{width:48px;height:48px;border:1px solid #6D7D6A;border-radius:50%;display:grid;place-items:center;color:#153A2E;font-family:Georgia,serif;font-size:1.25rem;margin-bottom:22px}.sl2-session-grid h3{font-size:1.55rem;margin:5px 0 14px}.sl2-session-grid strong{color:#153A2E}.sl2-tools-grid{display:grid;grid-template-columns:.78fr 1.22fr;gap:72px}.sl2-tools-list{border-top:1px solid rgba(21,58,46,.18)}.sl2-tools-list article{display:grid;grid-template-columns:42px 1fr;gap:16px;padding:17px 0;border-bottom:1px solid rgba(21,58,46,.12)}.sl2-tools-list b{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#6D7D6A;color:white;font-size:.74rem}.sl2-tools-list strong{color:#153A2E}.sl2-tools-list p{margin:3px 0 0;font-size:.92rem}.sl2-possibility{background:#FAF6EF;padding:58px 0}.sl2-possibility-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:20px;border-top:1px solid rgba(21,58,46,.18);border-bottom:1px solid rgba(21,58,46,.18)}.sl2-possibility-grid article{padding:28px 24px;border-right:1px solid rgba(21,58,46,.14);font-family:Georgia,serif;font-size:1.16rem;color:#153A2E}.sl2-possibility-grid article:last-child{border-right:0}.sl2-audience-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-top:40px}.sl2-audience-grid article{border-top:1px solid rgba(21,58,46,.2);padding-top:18px}.sl2-audience-grid h3{font-size:1.05rem}.sl2-taste{background:#153A2E;color:#FAF6EF;text-align:center;padding:84px 0}.sl2-taste .eyebrow{color:#E0A443}.sl2-taste h2{color:#FAF6EF}.sl2-taste p{color:rgba(250,246,239,.84);font-size:1.08rem;line-height:1.7}.sl2-taste-line{font-family:Georgia,serif!important;color:#FAF6EF!important;font-size:1.5rem!important;margin-top:26px}.sl2-final{background:#FAF6EF;padding:88px 0}.sl2-actions-center{justify-content:center}
@media(max-width:980px){.sl2-heading,.sl2-hero-grid,.sl2-tools-grid{grid-template-columns:1fr}.sl2-triad,.sl2-session-grid{grid-template-columns:1fr}.sl2-home-bottom{grid-template-columns:1fr}.sl2-experience-grid,.sl2-possibility-grid{grid-template-columns:repeat(2,1fr)}.sl2-audience-grid{grid-template-columns:repeat(2,1fr)}.sl2-circle-diagram{max-width:440px}}
@media(max-width:640px){.sl2-heading{gap:20px}.sl2-experience-grid,.sl2-possibility-grid,.sl2-audience-grid{grid-template-columns:1fr}.sl2-possibility-grid article{border-right:0;border-bottom:1px solid rgba(21,58,46,.12)}.sl2-card{min-height:auto}.sl2-hero{padding:72px 0}.sl2-hero h1{font-size:3.45rem}.sl2-circle-diagram{max-width:330px}.sl2-petal span{font-size:1.35rem}.sl2-center{font-size:1.05rem}.sl2-actions .button{width:100%;text-align:center}}
`;

await fs.writeFile(path.join(dist, 'assets', 'sacred-listening-preview-v2.css'), css, 'utf8');
console.log('Applied Sacred Listening staging workshop refinement v2.');
