import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const globalCopy = JSON.parse(readFileSync(path.join(root, 'content', 'global.json'), 'utf8'));

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const journeyPages = new Set([
  'assessment.html',
  'inherited-faith.html',
  'honest-questions.html',
  'sacred-search.html',
  'new-foundations.html',
  'embodied-faith.html',
  'living-awake.html',
]);

const currentSectionFor = (filename = '') => {
  const normalized = String(filename).replaceAll('\\', '/').toLowerCase();
  const base = normalized.split('/').at(-1) || '';
  if (base === 'index.html') return 'home';
  if (base === 'circles.html') return 'circles';
  if (base === 'practices.html') return 'practices';
  if (base === 'about.html') return 'story';
  if (journeyPages.has(base) || normalized.includes('/journey/') || base.includes('assessment') || base.includes('journey')) return 'journey';
  return '';
};

const navItems = [
  ['home', '/', () => globalCopy.navigation.home],
  ['circles', '/circles.html', () => globalCopy.navigation.circles],
  ['practices', '/practices.html', () => globalCopy.navigation.practices],
  ['journey', '/#journey', () => globalCopy.navigation.journey],
  ['story', '/about.html', () => globalCopy.navigation.story],
];

const navLink = ([id, href, label], active) => {
  const isActive = id === active;
  const cls = isActive ? ' class="is-active"' : '';
  const current = isActive ? ' aria-current="page"' : '';
  return `<a href="${href}"${cls}${current}>${esc(label())}</a>`;
};

const headerHtml = (active) => `
<header class="v8-site-header" data-v8-shared-header>
  <div class="v8-header-inner">
    <a class="v8-brand" href="/" aria-label="Homeward home">
      <img class="v8-brand-mark" src="/assets/mark-forest.png" alt="">
      <span class="v8-brand-copy"><strong>${esc(globalCopy.brand.name)}</strong><small>${esc(globalCopy.brand.subline)}</small></span>
    </a>
    <nav class="v8-desktop-nav" aria-label="Primary navigation">
      ${navItems.map((item) => navLink(item, active)).join('')}
    </nav>
    <a class="v8-header-cta" href="/connect.html" data-event="start_conversation_click">${esc(globalCopy.navigation.mobile_conversation)}</a>
    <button class="v8-menu-button" type="button" aria-expanded="false" aria-label="Open navigation" data-v8-menu-button><span></span><span></span><span></span></button>
  </div>
  <nav class="v8-mobile-nav" aria-label="Mobile navigation" data-v8-mobile-menu hidden>
    ${navItems.map((item) => navLink(item, active)).join('')}
    <div class="v8-mobile-actions">
      <a class="v8-mobile-primary" href="/#interest" data-event="circle_interest_click">${esc(globalCopy.navigation.interest)}</a>
      <a class="v8-mobile-secondary" href="/connect.html" data-event="start_conversation_click">${esc(globalCopy.navigation.conversation)}</a>
    </div>
  </nav>
</header>`;

export function applySharedShell(sourceHtml, filename = '') {
  let html = String(sourceHtml);
  if (!/<header\b/i.test(html)) return html;
  const active = currentSectionFor(filename);
  html = html.replace(/<header\b[\s\S]*?<\/header>/i, headerHtml(active));
  if (!html.includes('/assets/v8-shared-shell.css')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="/assets/v8-shared-shell.css?v=1">\n</head>');
  }
  if (!html.includes('/assets/v8-shared-shell.js')) {
    html = html.replace('</body>', '<script src="/assets/v8-shared-shell.js?v=1" defer></script>\n</body>');
  }
  html = html.replace(/<body([^>]*)>/i, (match, attrs) => {
    if (/class=["']/.test(attrs)) return match.replace(/class=["']([^"']*)["']/, (_m, cls) => `class="${cls} v8-shared-shell"`);
    return `<body${attrs} class="v8-shared-shell">`;
  });
  return html;
}
