import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cssHref = '/assets/sacred-listening-preview-v3.css?v=3';

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

const homeWorkshop = `
<section class="sl2-home section" id="sacred-listening">
  <div class="shell">
    <div class="sl3-workshop-title">
      <p class="eyebrow">AVAILABLE NOW · EXPERIENTIAL WORKSHOP</p>
      <h2>Sacred Listening Workshop</h2>
      <p class="sl3-tagline">Listen well. Love deeper. <em>See Christ in each other.</em></p>
      <p class="sl2-lead">A three-session experience where participants practice contemplative presence, learn practical listening tools, and discover what it feels like to help another person feel seen, heard, and loved.</p>
      <p>You won't only talk about listening. You'll slow down, practice it with real people, reflect on what happens, and leave with tools you can use in your very next conversation.</p>
    </div>

    <div class="sl2-triad sl3-triad" aria-label="Sacred Listening: Pause, See, Listen">
      <article class="sl2-card pause">
        <div class="sl3-card-head"><div class="sl2-icon">Ⅱ</div><div><p class="sl3-action">PAUSE</p><h3>Contemplative Presence</h3></div></div>
        <p>Notice what's happening inside. Breathe. Make space. Become present rather than reactive.</p>
      </article>
      <article class="sl2-card see">
        <div class="sl3-card-head"><div class="sl2-icon">◉</div><div><p class="sl3-action">SEE</p><h3>Sacred Regard</h3></div></div>
        <p>See the light of Christ in yourself and in others. Approach with curiosity, compassion, and humility.</p>
      </article>
      <article class="sl2-card listen">
        <div class="sl3-card-head"><div class="sl2-icon">♡</div><div><p class="sl3-action">LISTEN</p><h3>Deep Listening</h3></div></div>
        <p>Give your full attention. Be with, not fix. Listen for what's in the heart and what God may be saying.</p>
      </article>
    </div>

    <div class="sl2-home-bottom">
      <blockquote>“Everyone should be quick to listen, slow to speak…”<cite>James 1:19</cite></blockquote>
      <div><strong>3 sessions · 90 minutes each · Practice-based · Jesus-centered</strong><p>Guided contemplative practice · real listening exercises · reflection · practical tools</p></div>
      <div class="sl2-actions"><a class="button button-copper" href="/sacred-listening.html">Explore the Workshop</a><a class="button button-outline" href="/connect.html">Bring It to Your Group</a></div>
    </div>
  </div>
</section>`;

let home = injectCss(await read('index.html'));
home = removeSection(home, 'sl2-home');
home = removeSection(home, 'season-wrap');
const circleSection = getSection(home, 'circle-different');
if (circleSection) {
  home = home.replace(circleSection, `${circleSection}\n${homeWorkshop}`);
} else {
  const journey = getSection(home, 'journey');
  home = journey ? home.replace(journey, `${homeWorkshop}\n${journey}`) : home.replace('</main>', `${homeWorkshop}\n</main>`);
}
await write('index.html', home);

let sacred = injectCss(await read('sacred-listening.html'));

sacred = sacred.replace(
  /<div class="sl2-triad sl2-triad-page">[\s\S]*?<\/div>\s*<\/div><\/section>/i,
  `<div class="sl2-triad sl2-triad-page sl3-framework-cards">
    <article class="sl2-card pause">
      <div class="sl3-card-head"><div class="sl2-icon">Ⅱ</div><div><p class="sl3-action">PAUSE</p><h3>Contemplative Presence</h3></div></div>
      <p>Notice what's happening within you. Make space through silence, breath, or prayer. Become present rather than reactive.</p>
      <div class="sl2-feels"><strong>Feels like</strong><span>Grounded · calm · open</span></div>
    </article>
    <article class="sl2-card see">
      <div class="sl3-card-head"><div class="sl2-icon">◉</div><div><p class="sl3-action">SEE</p><h3>Sacred Regard</h3></div></div>
      <p>Remember that each person is sacred. Listen for grace, longing, pain, and invitation. Ask: <em>How is God meeting this person here?</em></p>
      <div class="sl2-feels"><strong>Feels like</strong><span>Reverent · compassionate · hopeful</span></div>
    </article>
    <article class="sl2-card listen">
      <div class="sl3-card-head"><div class="sl2-icon">♡</div><div><p class="sl3-action">LISTEN</p><h3>Deep Listening</h3></div></div>
      <p>Offer full attention. Reflect back what you hear. Ask open, gentle questions. Resist fixing, judging, or taking over.</p>
      <div class="sl2-feels"><strong>Feels like</strong><span>Attentive · safe · connected</span></div>
    </article>
  </div>
  </div></section>`
);

sacred = sacred.replace(
  /<div class="sl2-session-grid">[\s\S]*?<\/div>\s*<\/div><\/section>/i,
  `<div class="sl2-session-grid sl3-session-grid">
    <article>
      <div class="sl3-session-head"><span>1</span><div><p class="eyebrow">SESSION ONE</p><h3>Becoming Present</h3></div></div>
      <p>Slow down and notice what is happening inside you. Experience contemplative practices that help create enough inner space to truly be with another person.</p>
      <strong>Practice:</strong><p>Presence, breath, silence, noticing reactivity, returning attention.</p>
    </article>
    <article>
      <div class="sl3-session-head"><span>2</span><div><p class="eyebrow">SESSION TWO</p><h3>Listening With Care</h3></div></div>
      <p>Practice sacred regard and learn how curiosity, compassion, and humility change what we notice in another person's story.</p>
      <strong>Practice:</strong><p>Open questions, reflecting, clarifying, noticing emotion, listening without deciding.</p>
    </article>
    <article>
      <div class="sl3-session-head"><span>3</span><div><p class="eyebrow">SESSION THREE</p><h3>Responding With Love</h3></div></div>
      <p>Bring presence and listening together in real conversation. Learn how to stay with another person without rescuing, correcting, or taking over.</p>
      <strong>Practice:</strong><p>Empathy, summarizing, compassionate response, boundaries, knowing when to refer.</p>
    </article>
  </div>
  </div></section>`
);

// Lead with benefits immediately after the hero.
const benefits = getSection(sacred, 'sl2-possibility');
if (benefits) {
  sacred = removeSection(sacred, 'sl2-possibility');
  const experience = getSection(sacred, 'sl2-experience');
  if (experience) sacred = sacred.replace(experience, `${benefits}\n${experience}`);
}

await write('sacred-listening.html', sacred);

const css = `
/* Staging refinement v3: hierarchy, spacing, and workshop flow */
.sl2-home .shell,.sl2-page .shell{width:min(1180px,calc(100% - 56px));margin-inline:auto}
.sl2-page .shell.narrow{width:min(860px,calc(100% - 56px))}
.sacred-listening-page .site-header .container{width:min(1220px,calc(100% - 48px));margin-inline:auto}
.sacred-listening-page .site-header .brand{flex-shrink:0}
.sacred-listening-page .site-header .brand-mark{width:48px;height:48px;object-fit:contain}
.sacred-listening-page .site-header .brand-copy strong{letter-spacing:.08em}
.sacred-listening-page .desktop-nav{gap:18px}
.sl3-workshop-title{max-width:920px;margin-bottom:42px}
.sl3-workshop-title h2{font-size:clamp(2.9rem,5vw,4.8rem);line-height:1.02;color:#153A2E;font-weight:700;margin:8px 0 14px}
.sl3-tagline{font-family:Georgia,serif;font-size:clamp(1.45rem,2.4vw,2rem);line-height:1.35;color:#153A2E;margin:0 0 18px}
.sl3-tagline em{font-weight:400;color:#6D7D6A}
.sl3-triad .sl2-card{min-height:285px;padding:30px}
.sl3-card-head{display:flex;align-items:center;gap:16px;margin-bottom:20px}
.sl3-card-head .sl2-icon{margin:0;flex:0 0 58px;width:58px;height:58px}
.sl3-card-head h3{font-family:Georgia,serif;font-size:clamp(1.65rem,2.1vw,2.15rem);line-height:1.08;margin:2px 0 0;color:#153A2E}
.sl3-action{font-size:.73rem!important;letter-spacing:.16em!important;font-weight:800!important;color:#B35A2A!important;margin:0!important}
.sl2-card.pause{background:#DCE7DC!important;border-color:rgba(21,58,46,.16)!important;box-shadow:0 8px 22px rgba(21,58,46,.06)}
.sl2-card.see,.sl2-card.listen{box-shadow:0 8px 22px rgba(21,58,46,.045)}
.sl2-framework{background:#F8F3EA!important}
.sl3-framework-cards .sl2-card{background:#fff}
.sl3-framework-cards .sl2-card.pause{background:#D7E4D6!important}
.sl3-framework-cards .sl3-card-head h3{font-size:clamp(1.8rem,2.35vw,2.35rem)}
.sl2-hero{overflow:hidden}
.sl2-hero-visual{padding-inline:8px}
.sl2-circle-diagram{width:min(450px,92%)}
.sl2-petal{border-color:rgba(250,246,239,.7)!important;overflow:visible}
.petal-pause{background:#4E725F!important}
.petal-see{background:#D8A13B!important}
.petal-listen{background:#718878!important}
.sl2-petal span,.sl2-petal small{position:relative;z-index:3}
.petal-pause span,.petal-pause small{transform:translateY(-22px)}
.petal-see span,.petal-see small{transform:translate(-34px,34px)}
.petal-listen span,.petal-listen small{transform:translate(34px,34px)}
.sl2-petal span{font-size:1.75rem!important}
.sl2-petal small{font-size:.94rem;line-height:1.18}
.sl2-center{border-color:#FAF6EF!important;box-shadow:0 0 0 3px rgba(21,58,46,.25)}
.sl2-possibility{padding:62px 0!important;background:#F3ECE1!important}
.sl2-possibility .eyebrow{text-align:center;color:#B35A2A}
.sl2-possibility-grid{margin-top:26px}
.sl3-session-head{display:flex;align-items:center;gap:16px;margin-bottom:20px}
.sl3-session-head>span{width:48px;height:48px;border:1px solid #6D7D6A;border-radius:50%;display:grid;place-items:center;color:#153A2E;font-family:Georgia,serif;font-size:1.25rem;flex:0 0 48px}
.sl3-session-head .eyebrow{margin:0 0 3px}
.sl3-session-head h3{font-size:1.65rem;margin:0;line-height:1.12}
.sl3-session-grid article{padding:28px 30px!important}
.sl3-session-grid>article>span{display:none!important}
@media(max-width:980px){
  .sacred-listening-page .desktop-nav{gap:12px;font-size:.92rem}
  .sl2-home .shell,.sl2-page .shell,.sl2-page .shell.narrow{width:min(100% - 36px,1180px)}
}
@media(max-width:700px){
  .sl2-home .shell,.sl2-page .shell,.sl2-page .shell.narrow{width:calc(100% - 28px)}
  .sacred-listening-page .site-header .container{width:calc(100% - 24px)}
  .sl3-card-head{align-items:flex-start}
  .sl3-card-head .sl2-icon{width:52px;height:52px;flex-basis:52px}
  .sl2-circle-diagram{width:min(330px,94%)}
  .petal-pause span,.petal-pause small{transform:translateY(-14px)}
  .petal-see span,.petal-see small{transform:translate(-20px,26px)}
  .petal-listen span,.petal-listen small{transform:translate(20px,26px)}
}`;

await fs.writeFile(path.join(dist, 'assets', 'sacred-listening-preview-v3.css'), css, 'utf8');
console.log('Applied Sacred Listening staging refinement v3.');
