import { promises as fs } from 'node:fs';
import { renderHomeConceptV1 } from './render-v8-home-concept-v1.mjs';
import { renderCirclesPrimary } from './render-v8-circles-primary.mjs';
import { renderPracticesPrimary } from './render-v8-practices-primary.mjs';
import { renderAboutPrimary } from './render-v8-about-primary.mjs';
import { applyCmsInlineFormatting } from './render-v8-inline-formatting.mjs';

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

const practiceImageMap = [
  ['/assets/review/practices/LC-F.jpg', '/assets/honest-questions/opening-light.webp'],
  ['/assets/review/practices/BP-G.jpg', '/assets/living-awake/contemplative-room.webp'],
  ['/assets/review/practices/BP-A.jpg', '/assets/honest-questions/quiet-room.webp'],
  ['/assets/review/practices/SE-G.jpg', '/assets/new-foundations/quiet-reading-room.webp'],
  ['/assets/review/practices/BP-H.jpg', '/assets/embodied-faith/embodied-life.webp'],
  ['/assets/review/practices/GR-D.jpg', '/assets/sacred-search/path-sunrise.webp'],
  ['/assets/review/practices/SE-H.jpg', '/assets/embodied-faith/community.webp'],
];

fs.writeFile = async (file, data, ...rest) => {
  const name = String(file);
  if (name.endsWith('/dist/index.html') || name.endsWith('\\dist\\index.html')) {
    data = renderHomeConceptV1(String(data));
  } else if (name.endsWith('/dist/circles.html') || name.endsWith('\\dist\\circles.html')) {
    data = applyCmsInlineFormatting(renderCirclesPrimary(String(data)));
    data = replaceImages(data, [[
      '/assets/review/practices/BP-G.jpg',
      '/assets/living-awake/contemplative-room.webp',
    ]]);
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=2');
  } else if (name.endsWith('/dist/practices.html') || name.endsWith('\\dist\\practices.html')) {
    data = applyCmsInlineFormatting(renderPracticesPrimary(String(data)));
    data = replaceImages(data, practiceImageMap);
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=2');
  } else if (name.endsWith('/dist/about.html') || name.endsWith('\\dist\\about.html')) {
    data = applyCmsInlineFormatting(renderAboutPrimary(String(data)));
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=2');
  }
  return originalWriteFile(file, data, ...rest);
};
