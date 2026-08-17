import { promises as fs } from 'node:fs';
import { renderHomeConceptV1 } from './render-v8-home-concept-v1.mjs';
import { renderCirclesPrimary } from './render-v8-circles-primary.mjs';
import { renderPracticesPrimary } from './render-v8-practices-primary.mjs';
import { renderAboutPrimary } from './render-v8-about-primary.mjs';
import { applyCmsInlineFormatting } from './render-v8-inline-formatting.mjs';
import { applySharedShell } from './render-v8-shared-shell.mjs';

const originalWriteFile = fs.writeFile.bind(fs);
const ensureStylesheet = (html, href) => {
  if (html.includes(`href="${href}`) || html.includes(`href='${href}`)) return html;
  return html.replace('</head>', `<link rel="stylesheet" href="${href}">\n</head>`);
};
const replaceImages = (html, entries) => {
  let output = String(html);
  for (const [from, to] of entries) output = output.replaceAll(from, to);
  return output;
};
const replaceImagesInSection = (html, className, entries) => {
  const pattern = new RegExp(
    `<section\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/section>`,
    'i',
  );
  return String(html).replace(pattern, (section) => replaceImages(section, entries));
};
const replaceSectionContent = (html, className, transform) => {
  const pattern = new RegExp(
    `<section\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/section>`,
    'i',
  );
  return String(html).replace(pattern, (section) => transform(section));
};
const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const publicPath = (value = '') => {
  const src = String(value || '');
  if (!src) return '';
  return src.startsWith('/') ? src : `/${src}`;
};
const legacyOr = (value, legacyValue, launchValue) => {
  if (value == null || value === '' || value === legacyValue) return launchValue;
  return value;
};

// Final homepage practice-card compatibility. render-v8-home-concept-v1 still contains
// an older QA substitution map, so catch both the legacy CMS thumbnails and those
// intermediate QA paths here and resolve them to the approved production masters.
const homepagePracticeImageMap = [
  ['/assets/review/practices/BP-A.jpg', '/assets/practices/home-breath-prayer.webp'],
  ['/assets/review/practices/BP-H.jpg', '/assets/practices/home-gratitude.webp'],
  ['/assets/review/practices/LC-B.jpg', '/assets/practices/home-light-of-christ.webp'],
  ['/assets/review/practices/SE-G.jpg', '/assets/practices/home-scripture-encounter.webp'],
  ['/assets/living-awake/contemplative-room.webp', '/assets/practices/home-breath-prayer.webp'],
  ['/assets/sacred-search/path-sunrise.webp', '/assets/practices/home-gratitude.webp'],
  ['/assets/honest-questions/opening-light.webp', '/assets/practices/home-light-of-christ.webp'],
  ['/assets/new-foundations/quiet-reading-room.webp', '/assets/practices/home-scripture-encounter.webp'],
];

const updateHomepageHero = async (html) => {
  const v8 = JSON.parse(await fs.readFile(new URL('../content/v8.json', import.meta.url), 'utf8'));
  const hero = v8.homepage?.hero || {};

  const headline = legacyOr(
    hero.headline,
    'You learned what to believe.',
    'Spiritual life is more than belief.',
  );
  const emphasis = legacyOr(
    hero.emphasis,
    'But were you ever taught how to practice?',
    'It’s something we practice—together.',
  );
  const description = legacyOr(
    hero.description,
    'Homeward Circles are small, Jesus-centered communities where people practice the way of Jesus together through prayer, silence, Scripture, reflection, and honest conversation. Begin with one four-week season, then keep journeying as the practices and friendships deepen.',
    'Homeward Circles are small, guided communities for people who want a deeper spiritual life. Through contemplative prayer, meditation, scripture, silence, reflection, and honest conversation, we practice the way of Jesus together—learning to become more present to God, ourselves, and one another, and to carry that presence into everyday life. Begin with one four-week season.',
  );

  const prefix = 'It’s something ';
  const emphasisMarkup = emphasis.startsWith(prefix)
    ? `${esc(prefix)}<span class="hero-accent">${esc(emphasis.slice(prefix.length))}</span>`
    : `<span class="hero-accent">${esc(emphasis)}</span>`;

  return replaceSectionContent(html, 'hero', (section) => {
    let output = section;
    output = output.replace(/<p class="eyebrow">[\s\S]*?<\/p>/i, `<p class="eyebrow">${esc(hero.eyebrow || 'HOMEWARD CIRCLES')}</p>`);
    output = output.replace(/<h1>[\s\S]*?<\/h1>/i, `<h1>${esc(headline)}<br/>${emphasisMarkup}</h1>`);
    output = output.replace(/<p class="hero-lead">[\s\S]*?<\/p>/i, `<p class="hero-lead">${esc(description)}</p>`);

    if (hero.primary_label || hero.primary_url || hero.secondary_label || hero.secondary_url) {
      const primaryLabel = esc(hero.primary_label || 'Tell Us You’re Interested');
      const primaryUrl = esc(hero.primary_url || '#interest');
      const secondaryLabel = esc(hero.secondary_label || 'See How a Circle Works');
      const secondaryUrl = esc(hero.secondary_url || 'circles.html');
      output = output.replace(
        /<div class="hero-actions">[\s\S]*?<\/div>/i,
        `<div class="hero-actions"><a class="button button-copper" href="${primaryUrl}">${primaryLabel}</a><a class="button button-outline" href="${secondaryUrl}">${secondaryLabel}</a></div>`,
      );
    }

    if (hero.image) {
      output = output.replace(
        /<div class="hero-image-wrap"><img[^>]*><\/div>/i,
        `<div class="hero-image-wrap"><img src="${esc(publicPath(hero.image))}" alt="${esc(hero.image_alt || 'Adults gathered together in a warm Homeward Circle conversation')}"/></div>`,
      );
    }
    return output;
  });
};

const isPublicHtml = (name) => {
  const normalized = String(name).replaceAll('\\', '/');
  return normalized.includes('/dist/') && normalized.endsWith('.html')
    && !normalized.includes('/dist/admin/') && !normalized.includes('/dist/drafts/');
};

fs.writeFile = async (file, data, ...rest) => {
  const name = String(file);
  if (name.endsWith('/dist/index.html') || name.endsWith('\\dist\\index.html')) {
    data = renderHomeConceptV1(String(data));
    data = replaceImagesInSection(data, 'home-practices', homepagePracticeImageMap);
    data = await updateHomepageHero(String(data));
    data = ensureStylesheet(data, '/assets/v8-hero-no-underline.css?v=1');
  } else if (name.endsWith('/dist/circles.html') || name.endsWith('\\dist\\circles.html')) {
    data = applyCmsInlineFormatting(renderCirclesPrimary(String(data)));
    data = replaceImages(data, [[
      '/assets/review/practices/BP-G.jpg',
      '/assets/living-awake/contemplative-room.webp',
    ]]);
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=3');
  } else if (name.endsWith('/dist/practices.html') || name.endsWith('\\dist\\practices.html')) {
    // Practices images come directly from content/practices-v8.json. CMS image
    // selections are the rendered source of truth; do not substitute them after render.
    data = applyCmsInlineFormatting(renderPracticesPrimary(String(data)));
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=3');
  } else if (name.endsWith('/dist/about.html') || name.endsWith('\\dist\\about.html')) {
    data = applyCmsInlineFormatting(renderAboutPrimary(String(data)));
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=3');
  }

  if (isPublicHtml(name)) data = applySharedShell(String(data), name);
  return originalWriteFile(file, data, ...rest);
};
