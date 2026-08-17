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

const isPublicHtml = (name) => {
  const normalized = String(name).replaceAll('\\', '/');
  return normalized.includes('/dist/') && normalized.endsWith('.html')
    && !normalized.includes('/dist/admin/') && !normalized.includes('/dist/drafts/');
};

fs.writeFile = async (file, data, ...rest) => {
  const name = String(file);
  if (name.endsWith('/dist/index.html') || name.endsWith('\\dist\\index.html')) {
    // Homepage images are rendered directly from content/v8.json. The CMS-selected
    // paths are the source of truth; do not substitute different images after render.
    data = renderHomeConceptV1(String(data));
  } else if (name.endsWith('/dist/circles.html') || name.endsWith('\\dist\\circles.html')) {
    data = applyCmsInlineFormatting(renderCirclesPrimary(String(data)));
    data = replaceImages(data, [[
      '/assets/review/practices/BP-G.jpg',
      '/assets/living-awake/contemplative-room.webp',
    ]]);
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=3');
  } else if (name.endsWith('/dist/practices.html') || name.endsWith('\\dist\\practices.html')) {
    // Practices images now come directly from content/practices-v8.json so CMS image
    // selections are the rendered source of truth. Do not substitute them after render.
    data = applyCmsInlineFormatting(renderPracticesPrimary(String(data)));
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=3');
  } else if (name.endsWith('/dist/about.html') || name.endsWith('\\dist\\about.html')) {
    data = applyCmsInlineFormatting(renderAboutPrimary(String(data)));
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=3');
  }

  if (isPublicHtml(name)) data = applySharedShell(String(data), name);
  return originalWriteFile(file, data, ...rest);
};
