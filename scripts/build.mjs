import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const content = JSON.parse(await fs.readFile(path.join(root, 'content', 'home.json'), 'utf8'));
const readJson = async (name) => JSON.parse(await fs.readFile(path.join(root, 'content', `${name}.json`), 'utf8'));
const template = await fs.readFile(path.join(root, 'src', 'index.template.html'), 'utf8');

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const richText = (value = '') => escapeHtml(value).replaceAll('\n', '<br/>');
const attr = (value = '') => escapeHtml(value);

const analyticsTag = (() => {
  const isProduction = process.env.CONTEXT === 'production' || process.env.HOMEWARD_ENABLE_ANALYTICS === 'true';
  if (!isProduction) return '<!-- Analytics intentionally disabled for local, branch, and deploy-preview builds. -->';
  const id = process.env.HOMEWARD_GA_ID || 'G-EDK2LGMJZG';
  return `<!-- Google tag (gtag.js) -->\n  <script async src="https://www.googletagmanager.com/gtag/js?id=${attr(id)}"></script>\n  <script>\n    window.dataLayer = window.dataLayer || [];\n    function gtag(){dataLayer.push(arguments);}\n    gtag('js', new Date());\n    gtag('config', '${attr(id)}');\n  </script>`;
})();

const icons = {
  values: [
    '<svg viewBox="0 0 48 48"><path d="M8 23 24 9l16 14v17H28V29h-8v11H8Z"></path><path d="M18 40V27h12v13"></path></svg>',
    '<svg viewBox="0 0 48 48"><path d="M24 40V22"></path><path d="M24 27C16 27 10 21 10 13c8 0 14 6 14 14Z"></path><path d="M24 22c0-8 6-14 14-14 0 8-6 14-14 14Z"></path></svg>',
    '<svg viewBox="0 0 48 48"><path d="M24 41S8 32 8 19c0-6 4-10 10-10 4 0 6 2 6 5 0-3 3-5 7-5 6 0 10 4 10 10 0 13-17 22-17 22Z"></path></svg>'
  ],
  practices: {
    light: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="8"></circle><path d="M24 3v8M24 37v8M3 24h8M37 24h8M9 9l6 6M33 33l6 6M39 9l-6 6M15 33l-6 6"></path></svg>',
    breath: '<svg viewBox="0 0 48 48"><path d="M11 25c6-9 10-9 13 0s7 9 13 0"></path><path d="M11 17c6-7 10-7 13 0s7 7 13 0"></path><path d="M11 33c6-7 10-7 13 0s7 7 13 0"></path></svg>',
    maranatha: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16"></circle><path d="M24 10v28M16 18h16"></path></svg>',
    reading: '<svg viewBox="0 0 48 48"><path d="M9 8h23a7 7 0 0 1 7 7v25H16a7 7 0 0 1-7-7Z"></path><path d="M16 8v32M22 17h10M22 24h10"></path></svg>',
    reflection: '<svg viewBox="0 0 48 48"><path d="M10 11h28v28H10Z"></path><path d="M16 19h16M16 26h16M16 33h9"></path><path d="M16 7v8M32 7v8"></path></svg>',
    gratitude: '<svg viewBox="0 0 48 48"><path d="M24 39S10 31 10 20c0-5 4-9 9-9 3 0 5 2 5 5 0-3 3-5 6-5 5 0 9 4 9 9 0 11-15 19-15 19Z"></path><path d="M24 8v7M20.5 11.5h7"></path></svg>'
  }
};

const questionHtml = content.recognition.questions.map((question, index) => `
      <div class="question-v4">
       <div class="question-icon">${index + 1}</div>
       <p>${escapeHtml(question)}</p>
      </div>`).join('');

const circlesStepsHtml = content.circles.steps.map((step, index) => `
       <div class="rhythm-card">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.description)}</p>
       </div>`).join('');

const valuesHtml = content.values.items.map((item, index) => `
      <div class="value-card reveal">
       <div aria-hidden="true" class="value-icon">${icons.values[index] || icons.values[0]}</div>
       <h3>${escapeHtml(item.title)}</h3>
       <p>${escapeHtml(item.description)}</p>
      </div>`).join('');

const practicesHtml = content.practices.items.map((item) => `
      <article class="practice-card reveal">
       <div class="practice-icon">${icons.practices[item.key] || icons.practices.light}</div>
       <h3>${escapeHtml(item.title)}</h3>
       ${item.subtitle ? `<span class="practice-subtitle">${escapeHtml(item.subtitle)}</span>` : ''}
       <p>${escapeHtml(item.description)}</p>
      </article>`).join('');

const journeyStagesHtml = content.journey.stages.map((stage, index) => `
         <div class="stage">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <strong>${escapeHtml(stage.title)}</strong>
          <p>${escapeHtml(stage.description)}</p>
         </div>`).join('');

const rememberingItemsHtml = content.remembering.items.map((item, index) => {
  const symbols = ['◌', '✦', '○', '◇', '♡', '∞'];
  const safe = escapeHtml(item);
  const prefix = 'Remembering';
  const formatted = safe.startsWith(prefix)
    ? `<p><strong>${prefix}</strong>${safe.slice(prefix.length)}</p>`
    : `<p>${safe}</p>`;
  return `
         <li><span aria-hidden="true">${symbols[index] || '•'}</span>${formatted}</li>`;
}).join('');

async function embeddableAsset(value = '') {
  const source = String(value || '');
  if (!source || source.startsWith('data:') || /^https?:\/\//i.test(source)) return attr(source);
  const relativePath = source.replace(/^\/+/, '');
  const filePath = path.join(root, relativePath);
  try {
    const bytes = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.webp': 'image/webp',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
    };
    const mime = mimeTypes[extension] || 'application/octet-stream';
    return `data:${mime};base64,${bytes.toString('base64')}`;
  } catch {
    return attr(source.startsWith('/') ? source : `/${source}`);
  }
}

const rememberingCommunityImage = await embeddableAsset(content.remembering.community_image);

const replacements = {
  ANALYTICS_TAG: analyticsTag,
  HERO_HEADLINE: escapeHtml(content.hero.headline),
  HERO_EMPHASIS: escapeHtml(content.hero.emphasis),
  HERO_DESCRIPTION: escapeHtml(content.hero.description),
  HERO_PRIMARY_LABEL: escapeHtml(content.hero.primary_label),
  HERO_PRIMARY_URL: attr(content.hero.primary_url),
  HERO_SECONDARY_LABEL: escapeHtml(content.hero.secondary_label),
  HERO_SECONDARY_URL: attr(content.hero.secondary_url),
  ROOTED_LINE: escapeHtml(content.rooted_line),
  RECOGNITION_EYEBROW: escapeHtml(content.recognition.eyebrow),
  RECOGNITION_HEADING: escapeHtml(content.recognition.heading),
  RECOGNITION_INTRO: escapeHtml(content.recognition.intro),
  RECOGNITION_QUESTIONS_HTML: questionHtml,
  RECOGNITION_HONEST_LINE: escapeHtml(content.recognition.honest_line),
  CIRCLES_EYEBROW: escapeHtml(content.circles.eyebrow),
  CIRCLES_HEADING_HTML: `${escapeHtml(content.circles.heading_line1)}<br/><em>${escapeHtml(content.circles.heading_line2)}</em>`,
  CIRCLES_BADGE_HTML: `<span aria-hidden="true"></span>${escapeHtml(content.circles.badge)}`,
  CIRCLES_DESCRIPTION: escapeHtml(content.circles.description),
  CIRCLES_QUOTE: escapeHtml(content.circles.quote),
  CIRCLES_IMAGE: attr(content.circles.image),
  CIRCLES_STEPS_HTML: circlesStepsHtml,
  CIRCLES_PRIMARY_LABEL: escapeHtml(content.circles.primary_label),
  CIRCLES_SECONDARY_LABEL: escapeHtml(content.circles.secondary_label),
  VALUES_EYEBROW: escapeHtml(content.values.eyebrow),
  VALUES_HEADING_HTML: richText(content.values.heading),
  VALUES_INTRO: escapeHtml(content.values.intro),
  VALUES_HTML: valuesHtml,
  PRACTICES_EYEBROW: escapeHtml(content.practices.eyebrow),
  PRACTICES_HEADING: escapeHtml(content.practices.heading),
  PRACTICES_INTRO: escapeHtml(content.practices.intro),
  PRACTICES_HTML: practicesHtml,
  PRACTICES_PRIMARY_LABEL: escapeHtml(content.practices.primary_label),
  PRACTICES_SECONDARY_LABEL: escapeHtml(content.practices.secondary_label),
  JOURNEY_EYEBROW: escapeHtml(content.journey.eyebrow),
  JOURNEY_HEADING: escapeHtml(content.journey.heading),
  JOURNEY_DESCRIPTION: escapeHtml(content.journey.description),
  JOURNEY_IMAGE: attr(content.journey.image),
  JOURNEY_STAGES_HTML: journeyStagesHtml,
  JOURNEY_BENEFIT_HEADING: escapeHtml(content.journey.benefit_heading),
  JOURNEY_BENEFIT_TEXT: escapeHtml(content.journey.benefit_text),
  JOURNEY_CTA_LABEL: escapeHtml(content.journey.cta_label),
  REMEMBERING_EYEBROW: escapeHtml(content.remembering.eyebrow),
  REMEMBERING_HEADING_HTML: `${escapeHtml(content.remembering.heading)}<br/><em>${escapeHtml(content.remembering.emphasis)}</em>`,
  REMEMBERING_INTRO1: escapeHtml(content.remembering.intro1),
  REMEMBERING_INTRO2_HTML: escapeHtml(content.remembering.intro2).replace('remember what matters most', '<strong>remember what matters most</strong>'),
  REMEMBERING_ITEMS_HTML: rememberingItemsHtml,
  REMEMBERING_COMMUNITY_IMAGE: rememberingCommunityImage,
  REMEMBERING_WONDER_IMAGE: attr(content.remembering.wonder_image),
  REMEMBERING_WHY_HEADING: escapeHtml(content.remembering.why_heading),
  REMEMBERING_WHY_TEXT: escapeHtml(content.remembering.why_text),
  REMEMBERING_FOOTER_TEXT: escapeHtml(content.remembering.footer_text),
  REMEMBERING_PRIMARY_LABEL: escapeHtml(content.remembering.primary_label),
  REMEMBERING_SECONDARY_LABEL: escapeHtml(content.remembering.secondary_label),
  INTEREST_EYEBROW: escapeHtml(content.interest.eyebrow),
  INTEREST_HEADING: escapeHtml(content.interest.heading),
  INTEREST_DESCRIPTION: escapeHtml(content.interest.description),
  INTEREST_CALENDAR_HTML: `<h3>${escapeHtml(content.interest.calendar_heading)}</h3><p>${escapeHtml(content.interest.calendar_text)}</p>`,
  INTEREST_CALENDAR_BUTTON: escapeHtml(content.interest.calendar_button),
  FINAL_EYEBROW: escapeHtml(content.final.eyebrow),
  FINAL_HEADING: escapeHtml(content.final.heading),
  FINAL_DESCRIPTION: escapeHtml(content.final.description),
};

function applyReplacements(source, map) {
  let output = source;
  for (const [key, value] of Object.entries(map)) {
    output = output.replaceAll(`{{${key}}}`, value);
  }
  const unresolved = [...output.matchAll(/{{[A-Z0-9_]+}}/g)].map((match) => match[0]);
  if (unresolved.length) throw new Error(`Unresolved template markers: ${[...new Set(unresolved)].join(', ')}`);
  return output;
}

function stripAnalytics(html) {
  return html
    .replace(/\s*<!-- Google tag \(gtag\.js\) -->[\s\S]*?gtag\('config',\s*'[^']+'\);[\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script[^>]*src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]+"[^>]*><\/script>[\s\S]*?gtag\('config',\s*'[^']+'\);[\s\S]*?<\/script>/gi, '');
}

function injectHead(html, snippet) {
  if (!snippet || html.includes('googletagmanager.com')) return html;
  return html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}\n  ${snippet}`);
}

function injectIdentityRedirect(html) {
  if (html.includes('identity-redirect.js')) return html;
  return html.replace(/<\/body>/i, '  <script src="/identity-redirect.js" defer></script>\n </body>');
}

async function copyRecursive(src, dest) {
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    for (const entry of await fs.readdir(src)) {
      await copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
  }
}

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

let homeHtml = applyReplacements(template, replacements);
homeHtml = injectIdentityRedirect(homeHtml);
await fs.writeFile(path.join(dist, 'index.html'), homeHtml);


const listItems = (items = []) => items.map((item) => `<li>${item}</li>`).join('');
const pageData = {
  circles: await readJson('circles'),
  practices: await readJson('practices'),
  about: await readJson('about'),
  connect: await readJson('connect'),
  vision: await readJson('vision'),
};

const pageReplacementMaps = {
  circles: (d) => ({
    META_TITLE: escapeHtml(d.meta.title), META_DESCRIPTION: attr(d.meta.description),
    HERO_EYEBROW: escapeHtml(d.hero.eyebrow), HERO_HEADING: escapeHtml(d.hero.heading), HERO_LEAD: escapeHtml(d.hero.lead), HERO_PRIMARY: escapeHtml(d.hero.primary), HERO_SECONDARY: escapeHtml(d.hero.secondary),
    HEART_IMAGE: attr(d.heart.image), HEART_IMAGE_ALT: attr(d.heart.image_alt), HEART_CAPTION: escapeHtml(d.heart.caption), HEART_EYEBROW: escapeHtml(d.heart.eyebrow), HEART_HEADING: escapeHtml(d.heart.heading), HEART_LEAD: escapeHtml(d.heart.lead), HEART_BODY: escapeHtml(d.heart.body), HEART_URGENCY_HEADING: escapeHtml(d.heart.urgency_heading), HEART_URGENCY_TEXT: escapeHtml(d.heart.urgency_text), HEART_PRIMARY: escapeHtml(d.heart.primary), HEART_SECONDARY: escapeHtml(d.heart.secondary),
    RHYTHM_EYEBROW: escapeHtml(d.rhythm.eyebrow), RHYTHM_HEADING: escapeHtml(d.rhythm.heading), RHYTHM_INTRO: escapeHtml(d.rhythm.intro), RHYTHM_HTML: d.rhythm.steps.map((x,i)=>`<div class="rhythm-card"><span>${String(i+1).padStart(2,'0')}</span><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.description)}</p></div>`).join(''),
    SAMPLE_EYEBROW: escapeHtml(d.sample.eyebrow), SAMPLE_HEADING: escapeHtml(d.sample.heading), SAMPLE_INTRO: escapeHtml(d.sample.intro), SAMPLE_WEEK: escapeHtml(d.sample.week), SAMPLE_TITLE: escapeHtml(d.sample.title), SAMPLE_DESCRIPTION: escapeHtml(d.sample.description), SESSION_HTML: d.sample.items.map(x=>`<div class="session-time">${escapeHtml(x.time)}</div><div class="session-content"><h4>${escapeHtml(x.title)}</h4>${x.questions?`<ul>${listItems(x.questions.map(escapeHtml))}</ul>`:`<p>${x.body}</p>`}</div>`).join(''),
    FIT_EYEBROW: escapeHtml(d.fit.eyebrow), FIT_HEADING: escapeHtml(d.fit.heading), FIT_CARD_HEADING: escapeHtml(d.fit.fit_heading), FIT_ITEMS_HTML: listItems(d.fit.fit_items.map(escapeHtml)), NOT_CARD_HEADING: escapeHtml(d.fit.not_heading), NOT_ITEMS_HTML: listItems(d.fit.not_items.map(escapeHtml)),
    FINAL_EYEBROW: escapeHtml(d.final.eyebrow), FINAL_HEADING: escapeHtml(d.final.heading), FINAL_LEAD: escapeHtml(d.final.lead), FINAL_PRIMARY: escapeHtml(d.final.primary), FINAL_SECONDARY: escapeHtml(d.final.secondary),
  }),
  practices: (d) => ({
    HERO_EYEBROW: escapeHtml(d.hero.eyebrow), HERO_HEADING: escapeHtml(d.hero.heading), HERO_LEAD: escapeHtml(d.hero.lead), HERO_PRIMARY: escapeHtml(d.hero.primary), HERO_SECONDARY: escapeHtml(d.hero.secondary),
    INTRO_EYEBROW: escapeHtml(d.intro.eyebrow), INTRO_HEADING: escapeHtml(d.intro.heading), INTRO_LEAD: escapeHtml(d.intro.lead),
    PRACTICES_HTML: d.items.map(x=>`<article class="practice-detail reveal" id="${attr(x.id)}"><div class="tradition">${escapeHtml(x.tradition)}</div><h3>${escapeHtml(x.title)}</h3><p>${x.description}</p><ol class="practice-steps">${listItems(x.steps)}</ol>${x.button?`<a class="button" href="practice-breath.html" data-event="practice_start">${escapeHtml(x.button)}</a>`:''}</article>`).join(''),
    COMMUNITY_EYEBROW: escapeHtml(d.community.eyebrow), COMMUNITY_HEADING: escapeHtml(d.community.heading), COMMUNITY_LEAD: escapeHtml(d.community.lead), COMMUNITY_PRIMARY: escapeHtml(d.community.primary), COMMUNITY_SECONDARY: escapeHtml(d.community.secondary),
  }),
  about: (d) => ({
    HERO_EYEBROW: escapeHtml(d.hero.eyebrow), HERO_HEADING: escapeHtml(d.hero.heading), HERO_LEAD: escapeHtml(d.hero.lead),
    ORIGIN_IMAGE: attr(d.origin.image), ORIGIN_IMAGE_ALT: attr(d.origin.image_alt), ORIGIN_CAPTION: escapeHtml(d.origin.caption), ORIGIN_EYEBROW: escapeHtml(d.origin.eyebrow), ORIGIN_HEADING: escapeHtml(d.origin.heading), ORIGIN_LEAD: escapeHtml(d.origin.lead), ORIGIN_PARAGRAPHS_HTML: d.origin.paragraphs.map(x=>`<p>${escapeHtml(x)}</p>`).join(''),
    FORMATION_EYEBROW: escapeHtml(d.formation.eyebrow), FORMATION_HEADING: escapeHtml(d.formation.heading), FORMATION_LEAD: escapeHtml(d.formation.lead), FORMATION_CARDS_HTML: d.formation.cards.map(c=>`<div class="compare-card reveal"><h3>${escapeHtml(c.title)}</h3><ul class="check-list">${listItems(c.items.map(escapeHtml))}</ul></div>`).join(''),
    COMMUNITY_EYEBROW: escapeHtml(d.community.eyebrow), COMMUNITY_HEADING: escapeHtml(d.community.heading), COMMUNITY_LEAD: escapeHtml(d.community.lead), COMMUNITY_BUTTON: escapeHtml(d.community.button),
  }),
  connect: (d) => ({
    HERO_EYEBROW: escapeHtml(d.hero.eyebrow), HERO_HEADING: escapeHtml(d.hero.heading), HERO_LEAD: escapeHtml(d.hero.lead), EXPECT_EYEBROW: escapeHtml(d.expect.eyebrow), EXPECT_HEADING: escapeHtml(d.expect.heading), EXPECT_ITEMS_HTML: listItems(d.expect.items.map(escapeHtml)), EXPECT_NOT_READY_HTML: `${escapeHtml(d.expect.not_ready.replace('Tell us you are interested instead.',''))}<a href="index.html#interest" style="color:var(--copper);font-weight:700">Tell us you are interested instead.</a>`,
  }),
  vision: (d) => ({
    HERO_EYEBROW: escapeHtml(d.hero.eyebrow), HERO_HEADING: escapeHtml(d.hero.heading), HERO_LEAD: escapeHtml(d.hero.lead), VISION_ITEMS_HTML: d.items.map(x=>`<article class="vision-page-item reveal"><button class="vision-image-button vision-page-image" type="button" data-lightbox="${attr(x.image)}" data-title="${attr(x.lightbox_title)}"><img src="${attr(x.image)}" alt="${attr(x.alt)}"><span class="image-expand">Enlarge image ↗</span></button><div><p class="eyebrow">${escapeHtml(x.eyebrow)}</p><h2>${escapeHtml(x.heading)}</h2><p class="lead">${escapeHtml(x.lead)}</p></div></article>`).join(''), VISION_NOTE: escapeHtml(d.note),
  }),
};

const generatedPages = new Set();
for (const [name, data] of Object.entries(pageData)) {
  const source = await fs.readFile(path.join(root, 'src', 'pages', `${name}.template.html`), 'utf8');
  let html = applyReplacements(source, pageReplacementMaps[name](data));
  html = stripAnalytics(html);
  html = injectHead(html, analyticsTag);
  html = injectIdentityRedirect(html);
  await fs.writeFile(path.join(dist, `${name}.html`), html);
  generatedPages.add(`${name}.html`);
}

const rootFiles = await fs.readdir(root, { withFileTypes: true });
const skipNames = new Set(['dist', 'src', 'content', 'scripts', 'netlify', 'node_modules', '.git', '.gitignore', 'index.html', 'index.pretty.html', 'package.json', 'netlify.toml']);
for (const entry of rootFiles) {
  if (skipNames.has(entry.name) || generatedPages.has(entry.name)) continue;
  const source = path.join(root, entry.name);
  const destination = path.join(dist, entry.name);
  if (entry.name.endsWith('.md')) continue;
  if (entry.isDirectory()) {
    await copyRecursive(source, destination);
    continue;
  }
  if (entry.name.endsWith('.html')) {
    let html = await fs.readFile(source, 'utf8');
    html = stripAnalytics(html);
    html = injectHead(html, analyticsTag);
    html = injectIdentityRedirect(html);
    await fs.writeFile(destination, html);
  } else {
    await fs.copyFile(source, destination);
  }
}

const buildMeta = {
  version: '6.2.2',
  builtAt: new Date().toISOString(),
  context: process.env.CONTEXT || 'local',
  analyticsEnabled: analyticsTag.includes('googletagmanager.com'),
};
await fs.writeFile(path.join(dist, 'build-meta.json'), JSON.stringify(buildMeta, null, 2));
console.log(`Built Homeward V6.2.2 into ${dist}`);
