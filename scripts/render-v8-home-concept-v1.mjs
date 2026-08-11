import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const approvedHomepage = readFileSync(path.join(root, 'content', 'homepage-concept-v1.html'), 'utf8');

export function renderHomeConceptV1(_sourceHtml) {
  let html = approvedHomepage;

  // Keep the approved Concept V1 intact and layer targeted polish separately so
  // future revisions remain easy to compare and roll back.
  if (!html.includes('/assets/homepage-concept-v1-polish.css')) {
    html = html.replace('</head>', '<link href="/assets/homepage-concept-v1-polish.css?v=3" rel="stylesheet"/>\n</head>');
  }

  // Header should invite conversation rather than compete with the main interest CTA.
  html = html.replace(
    '<a class="button button-copper header-cta" href="#interest">Tell us you’re interested</a>',
    '<a class="button button-copper header-cta" href="connect.html">Let\'s Talk</a>',
  );
  html = html.replace(
    '<a href="#interest">Tell us you’re interested</a></div></header>',
    '<a href="connect.html">Let\'s Talk</a></div></header>',
  );

  return html;
}
