const navItems = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'circles', label: 'Circles', href: '/circles.html' },
  { key: 'practices', label: 'Practices', href: '/practices.html' },
  { key: 'journey', label: 'Journey', href: '/#journey' },
  { key: 'story', label: 'Our Story', href: '/about.html' },
];

const journeyPages = new Set([
  'assessment.html',
  'inherited-faith.html',
  'honest-questions.html',
  'sacred-search.html',
  'new-foundations.html',
  'embodied-faith.html',
  'living-awake.html',
]);

function pageKey(fileName = '') {
  const name = String(fileName).split(/[\\/]/).pop() || '';
  if (name === 'index.html') return 'home';
  if (name === 'circles.html') return 'circles';
  if (name === 'practices.html') return 'practices';
  if (name === 'about.html') return 'story';
  if (journeyPages.has(name)) return 'journey';
  return '';
}

function navLinks(activeKey = '', mobile = false) {
  return navItems.map((item) => {
    const active = item.key === activeKey;
    const className = active ? ' class="active"' : '';
    const current = active ? ' aria-current="page"' : '';
    return `<a${className}${current} href="${item.href}">${item.label}</a>`;
  }).join(mobile ? '\n' : '');
}

export function applySharedHeader(sourceHtml, fileName = '') {
  let html = String(sourceHtml || '');
  if (!/<header\b/i.test(html)) return html;
  const activeKey = pageKey(fileName);
  const header = `<header class="site-header shared-site-header">
  <div class="header-shell header-inner">
    <a aria-label="Homeward home" class="brand" href="/">
      <img alt="" class="brand-mark" src="/assets/mark-forest.png"/>
      <span class="brand-copy"><strong>HOMEWARD</strong><small>A SPIRITUAL COMMUNITY</small></span>
    </a>
    <nav aria-label="Primary navigation" class="desktop-nav">${navLinks(activeKey)}<a class="button button-sm header-talk" href="/connect.html">Let’s Talk</a></nav>
    <div class="mobile-header-actions">
      <a class="button mobile-header-conversation header-talk" href="/connect.html">Let’s Talk</a>
      <button aria-expanded="false" aria-label="Open navigation" class="mobile-toggle" type="button">☰</button>
    </div>
  </div>
  <nav aria-label="Mobile navigation" class="mobile-menu">${navLinks(activeKey, true)}</nav>
</header>`;
  html = html.replace(/<header\b[\s\S]*?<\/header>/i, header);
  if (!html.includes('/assets/v8-global-launch.css')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="/assets/v8-global-launch.css?v=1">\n</head>');
  }
  if (!html.includes('src="/script.js"') && !html.includes("src='/script.js'")) {
    html = html.replace('</body>', '<script src="/script.js?v=1"></script>\n</body>');
  }
  return html;
}
