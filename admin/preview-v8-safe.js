/* High-fidelity V8 Decap preview. Keep this aligned with scripts/render-v8-home-v6.mjs. */
(function () {
  const CMS = window.CMS;
  const createClass = window.createClass;
  const h = window.h;
  if (!CMS || !createClass || !h) return;

  CMS.registerPreviewStyle('/styles.css');
  CMS.registerPreviewStyle('/assets/v8-home-v6.css');
  CMS.registerPreviewStyle('/assets/v8-mobile-fix.css');
  CMS.registerPreviewStyle('/admin/preview.css');

  const list = (value) => Array.isArray(value) ? value : [];
  const enabled = (value) => list(value).filter((item) => item && item.enabled !== false);
  const text = (value) => String(value || '');
  const cleanEmphasis = (value) => text(value).replace(/^But were you ever taught\s*/i, '');

  const asset = (value, getAsset) => {
    if (!value) return '';
    if (typeof getAsset === 'function') {
      try {
        const resolved = getAsset(value);
        if (resolved) return resolved.toString();
      } catch (_) {}
    }
    const raw = String(value);
    if (/^(https?:|data:|blob:|\/)/i.test(raw)) return raw;
    return '/' + raw.replace(/^\.\//, '');
  };

  const safeToken = (value) => /^[a-z0-9-]+$/i.test(String(value || '')) ? String(value).toLowerCase() : '';
  const styleClasses = (style) => {
    const classes = [];
    [
      ['background','hw-bg-'], ['heading_color','hw-heading-'], ['text_color','hw-text-'],
      ['accent_color','hw-accent-'], ['heading_size','hw-heading-size-'], ['body_size','hw-body-size-'],
      ['alignment','hw-align-'], ['heading_font','hw-font-'], ['spacing','hw-spacing-']
    ].forEach(([key, prefix]) => {
      const token = safeToken(style && style[key]);
      if (token && token !== 'default') classes.push(prefix + token);
    });
    return classes.join(' ');
  };

  const esc = (value) => text(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const safeHref = (value) => {
    const href = text(value).trim();
    return /^(https?:\/\/|mailto:|\/|#|[a-z0-9_.-]+\.html(?:#.*)?$)/i.test(href) ? href : '#';
  };

  const inlineMarkdown = (raw) => {
    const links = [];
    let value = text(raw).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      const token = '@@HWLINK' + links.length + '@@';
      links.push('<a href="' + esc(safeHref(url)) + '">' + esc(label) + '</a>');
      return token;
    });
    value = esc(value)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>');
    links.forEach((link, i) => { value = value.replace('@@HWLINK' + i + '@@', link); });
    return value;
  };

  const richHtml = (raw) => {
    const lines = text(raw).replace(/\r/g, '').split('\n');
    const chunks = [];
    let bullets = [];
    const flush = () => {
      if (!bullets.length) return;
      chunks.push('<ul>' + bullets.map((item) => '<li>' + inlineMarkdown(item) + '</li>').join('') + '</ul>');
      bullets = [];
    };
    lines.forEach((line) => {
      const bullet = line.match(/^\s*[-*]\s+(.+)$/);
      if (bullet) { bullets.push(bullet[1]); return; }
      flush();
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        const level = Math.min(4, heading[1].length + 1);
        chunks.push('<h' + level + '>' + inlineMarkdown(heading[2]) + '</h' + level + '>');
      } else if (line.trim()) {
        chunks.push('<p>' + inlineMarkdown(line.trim()) + '</p>');
      }
    });
    flush();
    return chunks.join('');
  };

  const rich = (value, className) => value
    ? h('div', { className: className || '', dangerouslySetInnerHTML: { __html: richHtml(value) } })
    : null;

  const svg = {
    pin:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 43s13-12 13-25a13 13 0 1 0-26 0c0 13 13 25 13 25Z"/><circle cx="24" cy="18" r="4"/></svg>',
    wifi:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 18c10-9 24-9 34 0M13 25c7-6 15-6 22 0M19 32c3-3 7-3 10 0"/><circle cx="24" cy="39" r="1.8" fill="currentColor" stroke="none"/></svg>',
    person:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="15" r="7"/><path d="M10 42c1-11 6-17 14-17s13 6 14 17"/></svg>',
    heart:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 41S8 32 8 19c0-6 4-10 10-10 4 0 6 2 6 5 1-3 3-5 7-5 6 0 10 4 10 10 0 13-17 22-17 22Z"/></svg>',
    coin:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><path d="M28 16c-2-2-8-2-9 2-2 6 11 3 10 10-1 5-8 5-11 2M24 11v26"/></svg>',
    headHeart:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 43v-8c-5-3-8-8-8-14C10 11 16 5 24 5s14 6 14 15c0 4-2 7-5 10v13"/><path d="M19 19c1.5-2.5 5.3-2.6 7 0 1.7-2.6 5.5-2.4 7 .1 2.3 4-3 7.7-7 10.6-4.2-3-9.3-6.7-7-10.7Z"/></svg>',
    prayer:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 35c4-7 8-11 12-13 2-1 4 1 3 3l-4 7 5-3 7-9c1-2 4-2 5 0 1 1 1 3 0 5l-8 13c-1 2-4 3-7 3H11"/><path d="M14 12c2 2 3 4 3 7M24 7v9M34 12c-2 2-3 4-3 7"/></svg>',
    book:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 10c7-2 13 0 19 5v26c-6-5-12-7-19-5ZM43 10c-7-2-13 0-19 5v26c6-5 12-7 19-5Z"/></svg>',
    question:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path d="M18 18c1-4 4-6 8-6 4 0 7 3 7 7 0 5-7 6-8 10"/><circle cx="25" cy="36" r="1.7" fill="currentColor" stroke="none"/></svg>',
    sunrise:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 36h34M12 31a12 12 0 0 1 24 0M24 6v8M8 18l6 4M40 18l-6 4"/></svg>',
    brain:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 40c-5 0-8-4-7-8-5-2-5-9 0-11-2-5 2-10 7-9 2-5 9-5 11-1 5-1 9 4 7 9 5 2 5 9 0 11 1 5-3 9-8 9"/><path d="M24 10v30M18 16c4 1 6 4 6 8M30 16c-4 1-6 4-6 8M16 29c4 0 7 2 8 6M32 29c-4 0-7 2-8 6"/></svg>',
    sun:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="8"/><path d="M24 3v9M24 36v9M3 24h9M36 24h9M9 9l7 7M32 32l7 7M39 9l-7 7M16 32l-7 7"/></svg>',
    leaf:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 38c16-2 25-11 28-28-16 2-25 11-28 28Z"/><path d="M14 34 34 14"/></svg>',
    people:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="19" cy="17" r="6"/><circle cx="33" cy="19" r="5"/><path d="M6 42c1-11 6-17 13-17s12 6 13 17M29 28c7-2 12 4 13 14"/></svg>',
    calendar:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="10" width="34" height="31" rx="3"/><path d="M14 5v10M34 5v10M7 19h34M14 26h6M26 26h6M14 33h6"/></svg>',
    chat:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 8h34v25H23l-10 8v-8H7Z"/><circle cx="17" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="24" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="31" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
    cross:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M21 5h6v13h10v6H27v19h-6V24H11v-6h10Z"/></svg>'
  };
  const icon = (name, fallback) => h('span', { className: 'cms-svg-icon', dangerouslySetInnerHTML: { __html: svg[name] || svg[fallback || 'leaf'] } });

  const V8Preview = createClass({
    getInitialState: function () { return { inherited: {} }; },
    componentDidMount: function () {
      const self = this;
      fetch('/?cms-preview-source=' + Date.now(), { credentials: 'same-origin', cache: 'no-store' })
        .then((response) => response.ok ? response.text() : Promise.reject(new Error('preview source unavailable')))
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const inherited = {};
          ['fit','interest','faq','practice_bears_fruit','remembering'].forEach((id) => {
            const node = doc.querySelector('[data-v8-section="' + id + '"]');
            if (node) inherited[id] = node.outerHTML;
          });
          self.setState({ inherited: inherited });
        })
        .catch(() => {});
    },
    render: function () {
      const entry = this.props && this.props.entry;
      const getAsset = this.props && this.props.getAsset;
      const data = entry && entry.get && entry.get('data') && entry.get('data').toJS ? entry.get('data').toJS() : {};
      const page = data.homepage || {};
      const custom = Object.fromEntries(list(page.custom_sections).filter((item) => item && item.id).map((item) => [item.id, item]));
      const defaults = ['hero','recognition','practice_bridge','gifts','difference','finding_home','journey','practice_bears_fruit','founder','fit','interest','faq'];
      const configured = list(page.section_order);
      const seen = {};
      const order = [];
      configured.forEach((item) => {
        const id = typeof item === 'string' ? item : item && item.id;
        if (!id || seen[id]) return;
        seen[id] = true;
        order.push({ id: id, enabled: typeof item === 'string' ? true : item.enabled !== false });
      });
      defaults.forEach((id) => { if (!seen[id]) { seen[id] = true; order.push({ id: id, enabled: true }); } });
      Object.keys(custom).forEach((id) => { if (!seen[id]) order.push({ id: id, enabled: true }); });

      const hero = () => {
        const d = page.hero || {};
        const facts = enabled(d.facts);
        return h('section', { className: ('v6-hero ' + styleClasses(d.style)).trim(), key: 'hero', 'data-v8-section': 'hero' },
          h('div', { className: 'v6-hero-media' }, d.image ? h('img', { src: asset(d.image, getAsset), alt: d.image_alt || '' }) : null),
          h('div', { className: 'v6-shell v6-hero-grid' }, h('div', { className: 'v6-hero-copy' },
            h('p', { className: 'v6-eyebrow' }, 'THE MISSING HOW-TO OF SPIRITUAL LIFE'),
            h('h1', {}, d.headline || '', h('br'), 'But were you ever taught ', h('span', { className: 'accent' }, cleanEmphasis(d.emphasis))),
            h('p', { className: 'hero-desc' }, d.description || ''),
            h('div', { className: 'v6-hero-facts' }, facts.map((item, i) => h('div', { className: 'v6-hero-fact', key: item.id || i }, icon(item.icon), h('span', {}, item.line1 || '', h('br'), h('strong', {}, item.line2 || ''))))),
            h('div', { className: 'v6-hero-actions' }, d.primary_label ? h('span', { className: 'button' }, d.primary_label) : null, d.secondary_label ? h('span', { className: 'button button-secondary' }, d.secondary_label) : null),
            h('p', { className: 'v6-hero-micro' }, 'Fall Circles are forming now. You can begin curious, uncertain, or simply ready to practice.')
          ))
        );
      };

      const recognition = () => {
        const d = page.recognition || {};
        const items = enabled(d.items && d.items.length ? d.items : d.questions.map((q, i) => ({ id: 'q' + i, icon: 'question', text: q })));
        return h('section', { className: ('v6-recognition v6-section ' + styleClasses(d.style)).trim(), key: 'recognition', 'data-v8-section': 'recognition' }, h('div', { className: 'v6-shell' },
          h('div', { className: 'v6-recognition-head v6-center' }, h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''), h('h2', {}, d.heading || ''), h('p', { className: 'v6-lead' }, d.intro || '')),
          h('div', { className: 'v6-recognition-grid' }, items.map((item, i) => h('div', { className: 'v6-recognition-item', key: item.id || i }, icon(item.icon, 'question'), h('p', {}, item.text || '')))),
          h('p', { className: 'v6-recognition-end v6-center' }, d.honest_line || '')
        ));
      };

      const practice = () => {
        const d = page.practice_bridge || {};
        const outcomes = enabled(d.outcome_items);
        return h('section', { className: ('v6-practice v6-section ' + styleClasses(d.style)).trim(), key: 'practice_bridge', 'data-v8-section': 'practice_bridge' }, h('div', { className: 'v6-shell' }, h('div', { className: 'v6-practice-grid' },
          h('div', {}, h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''), h('h2', { className: 'v6-practice-title' }, 'Spiritual Practices:', h('span', {}, 'Exercises for the Heart and Mind'))),
          h('div', { className: 'v6-practice-copy' }, text(d.body).split(/\n\s*\n/).filter(Boolean).map((p, i) => h('p', { key: i }, p))),
          h('div', { className: 'v6-outcome-grid' }, outcomes.map((item, i) => h('div', { className: 'v6-outcome', key: item.id || i }, icon(item.icon), h('div', {}, item.label || '', h('br'), item.detail || ''))))
        )));
      };

      const gifts = () => {
        const d = page.gifts || {};
        const items = enabled(d.items);
        return h('section', { className: ('v6-gifts v6-section ' + styleClasses(d.style)).trim(), key: 'gifts', 'data-v8-section': 'gifts' }, h('div', { className: 'v6-shell' },
          h('div', { className: 'v6-gifts-head v6-center' }, h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''), h('h2', {}, d.heading || ''), h('p', { className: 'v6-lead' }, d.bridge || '')),
          h('div', { className: 'v6-gift-grid' }, items.map((item, i) => h('article', { className: 'v6-gift', key: item.id || i },
            h('div', { className: 'v6-gift-img' }, item.image ? h('img', { src: asset(item.image, getAsset), alt: item.image_alt || '' }) : null, h('span', { className: 'v6-gift-badge' }, i + 1)),
            h('div', { className: 'v6-gift-copy' }, h('h3', {}, item.title || ''), h('p', {}, item.description || ''))
          )))
        ));
      };

      const difference = () => {
        const d = page.difference || {};
        const items = enabled(d.features);
        return h('section', { className: ('v6-circle v6-section ' + styleClasses(d.style)).trim(), key: 'difference', 'data-v8-section': 'difference' }, h('div', { className: 'v6-shell' },
          h('div', { className: 'v6-circle-head v6-center' }, h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''), h('h2', {}, d.heading || ''), h('p', { className: 'v6-circle-sub' }, "It's not a class. It's a guided experience.")),
          h('div', { className: 'v6-circle-grid' }, items.map((item, i) => h('div', { className: 'v6-circle-item', key: item.id || i }, icon(item.icon), h('strong', {}, item.title || ''), h('span', {}, item.description || '')))),
          h('div', { className: 'v6-circle-body' }, h('p', {}, 'Understanding matters. Homeward adds encounter, personal reflection, practice, and formation—so Scripture and prayer become part of the way we actually live.'), h('p', { className: 'v6-signature' }, d.signature || ''), h('p', {}, d.closing || ''))
        ));
      };

      const finding = () => {
        const d = page.finding_home || {};
        const items = enabled(d.logistics);
        return h('section', { className: ('v6-finding ' + styleClasses(d.style)).trim(), key: 'finding_home', 'data-v8-section': 'finding_home' }, h('div', { className: 'v6-shell' }, h('div', { className: 'v6-finding-card' },
          h('div', { className: 'v6-finding-title' }, h('div', { className: 'botanical', dangerouslySetInnerHTML: { __html: '<svg viewBox="0 0 80 92" aria-hidden="true"><path d="M40 88V18M40 30C30 21 19 20 9 24c7 10 18 15 31 13M40 42c11-10 23-12 34-8-7 12-19 17-34 15M40 56c-12-9-25-9-34-4 8 10 19 15 34 12M40 68c10-9 21-10 32-6-7 10-18 15-32 13"/><path d="M22 20c5-10 11-15 18-18 7 4 13 10 17 19"/><path d="M19 88h42"/></svg>' } }), h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''), h('h2', {}, d.title || ''), h('p', {}, d.heading || '')),
          h('div', { className: 'v6-finding-right' }, h('div', { className: 'v6-finding-facts' }, items.map((item, i) => h('div', { className: 'v6-finding-fact', key: item.id || i }, icon(item.icon, 'calendar'), h('strong', {}, item.label || ''), h('small', {}, item.detail || '')))), h('div', { className: 'v6-finding-footer' }, h('p', {}, h('strong', {}, d.availability || ''), ' Exact days and times will be shared after your conversation.'), d.link_label ? h('span', { className: 'button' }, d.link_label) : null))
        )));
      };

      const journey = () => {
        const d = page.journey || {};
        const items = list(d.benefit_items).map((item) => typeof item === 'string' ? item : item && item.text).filter(Boolean);
        return h('section', { className: ('v6-journey v6-section ' + styleClasses(d.style)).trim(), key: 'journey', 'data-v8-section': 'journey' }, h('div', { className: 'v6-shell' }, h('div', { className: 'v6-journey-grid' },
          h('div', { className: 'v6-journey-art' }, d.image ? h('img', { src: asset(d.image, getAsset), alt: 'A spiral illustrating recurring movements in the spiritual journey' }) : null),
          h('div', {}, h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''), h('h2', {}, d.heading || ''), h('p', { className: 'v6-lead' }, d.description || ''), h('aside', { className: 'v6-journey-benefit' }, h('h3', {}, d.benefit_heading || ''), h('ul', {}, items.map((item, i) => h('li', { key: i }, h('span', { className: 'v6-check' }, '✓'), h('span', {}, item)))), h('p', { className: 'v6-journey-note' }, d.benefit_text || '')), h('div', { className: 'v6-journey-actions' }, d.cta_label ? h('span', { className: 'button' }, d.cta_label) : null))
        )));
      };

      const founder = () => {
        const d = page.founder || {};
        return h('section', { className: ('v6-founder ' + styleClasses(d.style)).trim(), key: 'founder', 'data-v8-section': 'founder' }, h('div', { className: 'v6-shell' }, h('div', { className: 'v6-founder-grid' },
          d.image ? h('img', { src: asset(d.image, getAsset), alt: d.image_alt || '' }) : null,
          h('div', {}, h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''), h('h2', {}, d.heading || ''), h('p', {}, d.body || ''), d.link_label ? h('span', { className: 'cms-text-link' }, d.link_label) : null)
        )));
      };

      const customSection = (d) => {
        if (!d || d.enabled === false) return null;
        const id = d.id || 'custom';
        const classes = ('hw-custom-section ' + styleClasses(d.style)).trim();
        const eye = d.eyebrow ? h('p', { className: 'hw-eyebrow v6-eyebrow' }, d.eyebrow) : null;
        const heading = d.heading ? h('h2', {}, d.heading) : null;
        const body = rich(d.body, 'hw-custom-body');
        const image = d.image ? h('figure', {}, h('img', { src: asset(d.image, getAsset), alt: d.image_alt || '' }), d.caption ? h('figcaption', {}, d.caption) : null) : null;
        const cta = d.button_label ? h('span', { className: 'button' }, d.button_label) : null;
        if (d.type === 'spacer') return h('section', { key: id, className: 'hw-custom-spacer-' + (['small','medium','large'].includes(d.spacer_size) ? d.spacer_size : 'medium'), 'data-v8-section': id });
        if (d.type === 'divider') return h('section', { key: id, className: classes, 'data-v8-section': id }, h('div', { className: 'hw-custom-shell' }, h('hr', { className: 'hw-custom-divider' })));
        if (d.type === 'quote') return h('section', { key: id, className: classes, 'data-v8-section': id }, h('div', { className: 'hw-custom-shell' }, h('blockquote', { className: 'hw-custom-quote', dangerouslySetInnerHTML: { __html: inlineMarkdown(d.quote || d.body || '') } }), d.attribution ? h('p', {}, '— ' + d.attribution) : null));
        if (d.type === 'text_image' || d.type === 'image_text') {
          const copy = h('div', {}, eye, heading, body, cta);
          const children = d.type === 'image_text' ? [image, copy] : [copy, image];
          return h('section', { key: id, className: classes, 'data-v8-section': id }, h('div', { className: 'hw-custom-shell' }, h('div', { className: 'hw-custom-grid' }, children)));
        }
        if (d.type === 'full_width_image') return h('section', { key: id, className: classes, 'data-v8-section': id }, h('div', { className: 'hw-custom-shell' }, eye, heading, image, body));
        if (d.type === 'card_grid' || d.type === 'icon_grid') {
          return h('section', { key: id, className: classes, 'data-v8-section': id }, h('div', { className: 'hw-custom-shell' }, eye, heading, body, h('div', { className: 'hw-custom-cards' }, enabled(d.items).map((item, i) => h('article', { className: 'hw-custom-card', key: item.id || i }, d.type === 'icon_grid' ? icon(item.icon) : (item.image ? h('img', { src: asset(item.image, getAsset), alt: item.image_alt || '' }) : null), h('h3', {}, item.title || ''), rich(item.body || ''))))));
        }
        if (d.type === 'cta' || d.type === 'callout') return h('section', { key: id, className: classes, 'data-v8-section': id }, h('div', { className: 'hw-custom-shell hw-custom-cta' }, h('div', {}, eye, heading, body), cta));
        if (d.type === 'comparison') {
          const rows = enabled(d.rows);
          return h('section', { key: id, className: classes, 'data-v8-section': id }, h('div', { className: 'hw-custom-shell' }, eye, heading, body, h('div', { className: 'hw-custom-comparison' }, h('div', {}, h('h3', {}, d.left_heading || ''), rows.map((r, i) => h('p', { key: i }, r.left || ''))), h('div', {}, h('h3', {}, d.right_heading || ''), rows.map((r, i) => h('p', { key: i }, r.right || ''))))));
        }
        if (d.type === 'video') return h('section', { key: id, className: classes, 'data-v8-section': id }, h('div', { className: 'hw-custom-shell' }, eye, heading, body, d.video_url ? h('div', { className: 'video-frame cms-video-placeholder' }, 'Video preview: ' + d.video_url) : null));
        return h('section', { key: id, className: classes, 'data-v8-section': id }, h('div', { className: 'hw-custom-shell' }, eye, heading, body, cta));
      };

      const inheritedSection = (id, title) => {
        const html = this.state && this.state.inherited && this.state.inherited[id];
        if (html) return h('div', { key: id, className: 'cms-live-fragment', dangerouslySetInnerHTML: { __html: html } });
        return h('section', { key: id, className: 'cms-protected-fallback', 'data-v8-section': id }, h('div', { className: 'v6-shell' }, h('p', { className: 'v6-eyebrow' }, 'LIVE-SITE STRUCTURE'), h('h2', {}, title), h('p', {}, 'This production section is inherited from the current launch candidate and will appear here when the deployed page is available.')));
      };

      const renderers = {
        hero: hero, recognition: recognition, difference: difference, finding_home: finding,
        practice_bridge: practice, gifts: gifts, founder: founder, journey: journey,
        fit: () => inheritedSection('fit', 'Is Homeward a fit?'),
        interest: () => inheritedSection('interest', 'Tell us you’re interested'),
        faq: () => inheritedSection('faq', 'Frequently Asked Questions'),
        practice_bears_fruit: () => inheritedSection('practice_bears_fruit', 'Practice Bears Fruit'),
        remembering: () => inheritedSection('remembering', 'We gather to remember')
      };

      return h('div', { className: 'v8-v6-home cms-preview-stage' }, order.filter((item) => item.enabled !== false).map((item) => {
        const sectionData = page[item.id];
        if (sectionData && sectionData.enabled === false) return null;
        if (renderers[item.id]) return renderers[item.id]();
        return customSection(custom[item.id]);
      }));
    }
  });

  const GenericPreview = createClass({
    render: function () {
      const entry = this.props && this.props.entry;
      const data = entry && entry.get && entry.get('data') && entry.get('data').toJS ? entry.get('data').toJS() : {};
      const title = data.meta?.title || data.hero?.heading || data.heading || data.title || 'Homeward content';
      const lead = data.hero?.lead || data.hero?.description || data.description || data.intro?.lead || '';
      return h('div', { className: 'cms-preview' }, h('section', { className: 'cms-section' }, h('div', { className: 'cms-shell' }, h('h1', {}, title), rich(lead))));
    }
  });

  CMS.registerPreviewTemplate('v8_front_door', V8Preview);
  CMS.registerPreviewTemplate('v8', V8Preview);
  ['home','global','circles','practices','about','connect','vision','assessment'].forEach((name) => CMS.registerPreviewTemplate(name, GenericPreview));
}());
