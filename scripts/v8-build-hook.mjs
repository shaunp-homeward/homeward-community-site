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

// Compatibility only for the four legacy thumbnail paths already stored in the
// homepage CMS. They resolve to the same approved images at production resolution.
// Any new image selected in the CMS is not in this map and therefore renders exactly
// as selected, so future CMS image edits flow through without a hidden override.
const homepageLegacyPracticeImageMap = [
  ['/assets/review/practices/BP-A.jpg', '/assets/practices/home-breath-prayer.webp'],
  ['/assets/review/practices/BP-H.jpg', '/assets/practices/home-gratitude.webp'],
  ['/assets/review/practices/LC-B.jpg', '/assets/practices/home-light-of-christ.webp'],
  ['/assets/review/practices/SE-G.jpg', '/assets/practices/home-scripture-encounter.webp'],
];

const isPublicHtml = (name) => {
  const normalized = String(name).replaceAll('\\', '/');
  return normalized.includes('/dist/') && normalized.endsWith('.html')
    && !normalized.includes('/dist/admin/') && !normalized.includes('/dist/drafts/');
};

fs.writeFile = async (file, data, ...rest) => {
  const name = String(file);
  if (name.endsWith('/dist/index.html') || name.endsWith('\\dist\\index.html')) {
    data = renderHomeConceptV1(String(data));
    data = replaceImagesInSection(data, 'home-practices', homepageLegacyPracticeImageMap);
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
