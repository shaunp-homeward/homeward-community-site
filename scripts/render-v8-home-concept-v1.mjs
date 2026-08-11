import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const approvedHomepage = readFileSync(path.join(root, 'content', 'homepage-concept-v1.html'), 'utf8');

const recognition = `<section class="recognition section"><div class="shell narrow-wide"><div class="section-heading centered recognition-heading"><p class="eyebrow">The Invitation</p><h2>Does any of this feel familiar?</h2><p>Maybe you know a lot about spiritual life—or maybe you simply want something deeper. Either way, understanding faith and actually living it are not quite the same thing.</p></div><div class="recognition-grid recognition-grid-four"><article><svg><use href="#i-question"/></svg><p><strong>You still feel drawn to God—or to the life and way of Jesus—but carry questions or doubts you have never been able to resolve?</strong></p></article><article><svg><use href="#i-heart"/></svg><p><strong>You long to experience God—or a Higher Power—more deeply, not simply gather more religious information?</strong></p></article><article><svg><use href="#i-sunrise"/></svg><p><strong>You want spiritual practices that help you become more present, peaceful, loving, and awake in everyday life?</strong></p></article><article><svg><use href="#i-people"/></svg><p><strong>You are looking for a community where people learn from one another without being required to reach all the same conclusions?</strong></p></article></div><p class="recognition-close">You do not need settled beliefs—only an honest desire to explore, practice, and grow.</p></div></section>`;

export function renderHomeConceptV1(_sourceHtml) {
  let html = approvedHomepage;

  if (!html.includes('/assets/homepage-concept-v1-polish.css')) {
    html = html.replace('</head>', '<link href="/assets/homepage-concept-v1-polish.css?v=5" rel="stylesheet"/>\n</head>');
  }
  if (!html.includes('/assets/v8-launch-image-qa.css')) {
    html = html.replace('</head>', '<link href="/assets/v8-launch-image-qa.css?v=1" rel="stylesheet"/>\n</head>');
  }

  html = html.replace('<body>', '<body class="v8-home-launch">');
  html = html.replace(/<section class="recognition section">[\s\S]*?<\/section>/, recognition);

  // Match the current Homeward header posture: conversation in the header,
  // interest invitations in the page itself, and no persistent bottom bar.
  html = html.replace(
    '<a class="button button-copper header-cta" href="#interest">Tell us you’re interested</a>',
    '<a class="button button-copper header-cta" href="connect.html">Let\'s Talk</a>',
  );
  html = html.replace(
    '<a href="#interest">Tell us you’re interested</a></div></header>',
    '<a href="connect.html">Let\'s Talk</a></div></header>',
  );
  html = html.replace(/<a class="mobile-sticky"[\s\S]*?<\/a>/, '');

  // The original V1 concept referenced review thumbnails. Use existing full-size
  // Homeward imagery for the homepage practice collage so desktop and mobile do
  // not upscale thumbnail assets.
  const imageMap = new Map([
    ['/assets/review/practices/BP-A.jpg', '/assets/living-awake/contemplative-room.webp'],
    ['/assets/review/practices/BP-H.jpg', '/assets/sacred-search/path-sunrise.webp'],
    ['/assets/review/practices/LC-B.jpg', '/assets/honest-questions/opening-light.webp'],
    ['/assets/review/practices/LC-F.jpg', '/assets/honest-questions/opening-light.webp'],
    ['/assets/review/practices/SE-G.jpg', '/assets/new-foundations/quiet-reading-room.webp'],
  ]);
  for (const [from, to] of imageMap) html = html.replaceAll(from, to);

  return html;
}
