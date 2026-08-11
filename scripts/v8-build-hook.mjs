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

fs.writeFile = async (file, data, ...rest) => {
  const name = String(file);
  if (name.endsWith('/dist/index.html') || name.endsWith('\\dist\\index.html')) {
    data = renderHomeConceptV1(String(data));
  } else if (name.endsWith('/dist/circles.html') || name.endsWith('\\dist\\circles.html')) {
    data = applyCmsInlineFormatting(renderCirclesPrimary(String(data)));
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=1');
  } else if (name.endsWith('/dist/practices.html') || name.endsWith('\\dist\\practices.html')) {
    data = applyCmsInlineFormatting(renderPracticesPrimary(String(data)));
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=1');
  } else if (name.endsWith('/dist/about.html') || name.endsWith('\\dist\\about.html')) {
    data = applyCmsInlineFormatting(renderAboutPrimary(String(data)));
    data = ensureStylesheet(data, '/assets/v8-launch-image-qa.css?v=1');
  }
  return originalWriteFile(file, data, ...rest);
};
