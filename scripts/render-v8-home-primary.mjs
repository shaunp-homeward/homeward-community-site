import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHomeV6 } from './render-v8-home-v6.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const v8 = JSON.parse(await fs.readFile(path.join(root, 'content', 'v8.json'), 'utf8'));

const extractSection = (html, id) => {
  const re = new RegExp(`<section\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>[\\s\\S]*?<\\/section>`, 'i');
  return html.match(re)?.[0] || '';
};

const markSection = (html, id) => html
  ? html.replace(/<section\b/i, `<section data-v8-section="${id}"`)
  : '';

export function renderHomePrimary(sourceHtml) {
  let html = renderHomeV6(sourceHtml);

  // Keep the legacy "We gather to remember" section available as a CMS/source toggle,
  // while leaving it hidden in the approved homepage hierarchy by default.
  const rememberingSetting = Array.isArray(v8.homepage?.section_order)
    ? v8.homepage.section_order.find((item) => item?.id === 'remembering')
    : null;

  if (rememberingSetting?.enabled !== true) return html;
  if (html.includes('data-v8-section="remembering"')) return html;

  const remembering = markSection(extractSection(sourceHtml, 'remembering'), 'remembering');
  if (!remembering) return html;

  const interestMarker = '<section data-v8-section="interest"';
  const index = html.indexOf(interestMarker);
  if (index >= 0) {
    html = `${html.slice(0, index)}${remembering}${html.slice(index)}`;
  } else {
    html = html.replace('</main>', `${remembering}</main>`);
  }
  return html;
}
