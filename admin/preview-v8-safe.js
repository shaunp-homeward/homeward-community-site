/* High-fidelity V8 Decap preview using the same public V8 component classes. */
(function () {
  const CMS = window.CMS;
  const createClass = window.createClass;
  const h = window.h;
  if (!CMS || !createClass || !h) return;

  CMS.registerPreviewStyle('/styles.css');
  CMS.registerPreviewStyle('/assets/v8-home-v6.css');
  CMS.registerPreviewStyle('/assets/v8-mobile-fix.css');
  CMS.registerPreviewStyle('/admin/preview.css');

  const palette = {
    forest: '#153A2E', ivory: '#FAF6EF', sage: '#6D7D6A', copper: '#B53A2A',
    gold: '#E0A443', charcoal: '#333333', white: '#FFFFFF', black: '#000000', gray: '#EEEAE4'
  };

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

  const styleFor = (style) => {
    const out = {};
    if (!style) return out;
    if (palette[style.background] && style.background !== 'default') out.background = palette[style.background];
    if (palette[style.text_color] && style.text_color !== 'default') out.color = palette[style.text_color];
    if (style.alignment && style.alignment !== 'default') out.textAlign = style.alignment;
    return out;
  };

  const headingStyle = (style) => {
    const out = {};
    if (!style) return out;
    if (palette[style.heading_color] && style.heading_color !== 'default') out.color = palette[style.heading_color];
    if (style.heading_font === 'inter') out.fontFamily = 'Inter, Arial, sans-serif';
    if (style.heading_font === 'playfair') out.fontFamily = 'Playfair Display, Georgia, serif';
    if (style.heading_size === 'small') out.fontSize = '2rem';
    if (style.heading_size === 'large') out.fontSize = '4rem';
    return out;
  };

  const richHtml = (value) => {
    let html = text(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
    html = html
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/\n\s*\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    return '<p>' + html + '</p>';
  };

  const rich = (value, className) => value
    ? h('div', { className: className || '', dangerouslySetInnerHTML: { __html: richHtml(value) } })
    : null;

  const factIcon = (name) => {
    const labels = {
      pin: '⌖', wifi: '⌁', person: '○', heart: '♡', coin: '$', calendar: '□',
      people: '◯', chat: '…', cross: '✝', brain: '◌', sun: '☼', leaf: '⌁',
      prayer: '⌒', book: '▤', question: '?', sunrise: '☀', headHeart: '♡'
    };
    return labels[name] || '•';
  };

  const V8Preview = createClass({
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
        if (!item || !item.id || seen[item.id]) return;
        seen[item.id] = true;
        order.push(item);
      });
      defaults.forEach((id) => {
        if (!seen[id]) {
          seen[id] = true;
          order.push({ id: id, enabled: true });
        }
      });
      Object.keys(custom).forEach((id) => {
        if (!seen[id]) order.push({ id: id, enabled: true });
      });

      const hero = () => {
        const d = page.hero || {};
        const img = asset(d.image, getAsset);
        const facts = enabled(d.facts);
        return h('section', { className: 'v6-hero', key: 'hero', style: styleFor(d.style) },
          img ? h('div', { className: 'v6-hero-media' }, h('img', { src: img, alt: d.image_alt || '' })) : null,
          h('div', { className: 'v6-shell v6-hero-grid' },
            h('div', { className: 'v6-hero-copy' },
              h('p', { className: 'v6-eyebrow' }, d.eyebrow || 'THE MISSING HOW-TO OF SPIRITUAL LIFE'),
              h('h1', { style: headingStyle(d.style) },
                d.headline || '',
                h('br'),
                'But were you ever taught ',
                h('span', { className: 'accent' }, cleanEmphasis(d.emphasis))
              ),
              rich(d.description, 'hero-desc'),
              facts.length ? h('div', { className: 'v6-hero-facts' }, facts.map((item, index) =>
                h('div', { className: 'v6-hero-fact', key: item.id || index },
                  h('div', { style: { fontSize: '1.55rem', lineHeight: 1, marginBottom: '8px' } }, factIcon(item.icon)),
                  h('span', {}, item.line1 || '', h('br'), h('strong', {}, item.line2 || ''))
                )
              )) : null,
              h('div', { className: 'v6-hero-actions' },
                d.primary_label ? h('span', { className: 'button' }, d.primary_label) : null,
                d.secondary_label ? h('span', { className: 'button button-secondary' }, d.secondary_label) : null
              )
            )
          )
        );
      };

      const recognition = () => {
        const d = page.recognition || {};
        const items = enabled(d.items);
        return h('section', { className: 'v6-recognition v6-section', key: 'recognition', style: styleFor(d.style) },
          h('div', { className: 'v6-shell' },
            h('div', { className: 'v6-recognition-head v6-center' },
              h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''),
              h('h2', { style: headingStyle(d.style) }, d.heading || ''),
              rich(d.intro, 'v6-lead')
            ),
            h('div', { className: 'v6-recognition-grid' }, items.map((item, index) =>
              h('div', { className: 'v6-recognition-item', key: item.id || index },
                h('div', { style: { fontSize: '2rem', color: '#788a76', marginBottom: '12px' } }, factIcon(item.icon)),
                h('p', {}, item.text || '')
              )
            )),
            h('p', { className: 'v6-recognition-end v6-center' }, d.honest_line || '')
          )
        );
      };

      const practice = () => {
        const d = page.practice_bridge || {};
        const outcomes = enabled(d.outcome_items);
        return h('section', { className: 'v6-practice v6-section', key: 'practice_bridge', style: styleFor(d.style) },
          h('div', { className: 'v6-shell' },
            h('div', { className: 'v6-practice-grid' },
              h('div', {},
                h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''),
                h('h2', { className: 'v6-practice-title', style: headingStyle(d.style) },
                  'Spiritual Practices:', h('span', {}, d.heading || 'Exercises for the Heart and Mind')
                )
              ),
              rich(d.body, 'v6-practice-copy'),
              h('div', { className: 'v6-outcome-grid' }, outcomes.map((item, index) =>
                h('div', { className: 'v6-outcome', key: item.id || index },
                  h('div', { style: { fontSize: '2rem', color: '#B53A2A', marginBottom: '8px' } }, factIcon(item.icon)),
                  h('div', {}, item.label || '', h('br'), item.detail || '')
                )
              ))
            )
          )
        );
      };

      const gifts = () => {
        const d = page.gifts || {};
        const items = enabled(d.items);
        return h('section', { className: 'v6-gifts v6-section', key: 'gifts', style: styleFor(d.style) },
          h('div', { className: 'v6-shell' },
            h('div', { className: 'v6-gifts-head v6-center' },
              h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''),
              h('h2', { style: headingStyle(d.style) }, d.heading || ''),
              rich(d.bridge, 'v6-lead')
            ),
            h('div', { className: 'v6-gift-grid' }, items.map((item, index) => {
              const img = asset(item.image, getAsset);
              return h('article', { className: 'v6-gift', key: item.id || index },
                img ? h('div', { className: 'v6-gift-img' },
                  h('img', { src: img, alt: item.image_alt || '' }),
                  h('span', { className: 'v6-gift-badge' }, String(index + 1))
                ) : null,
                h('div', { className: 'v6-gift-copy' },
                  h('h3', {}, item.title || ''),
                  rich(item.description)
                )
              );
            }))
          )
        );
      };

      const difference = () => {
        const d = page.difference || {};
        const items = enabled(d.features);
        return h('section', { className: 'v6-circle v6-section', key: 'difference', style: styleFor(d.style) },
          h('div', { className: 'v6-shell' },
            h('div', { className: 'v6-circle-head v6-center' },
              h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''),
              h('h2', { style: headingStyle(d.style) }, d.heading || ''),
              h('p', { className: 'v6-circle-sub' }, "It's not a class. It's a guided experience.")
            ),
            h('div', { className: 'v6-circle-grid' }, items.map((item, index) =>
              h('div', { className: 'v6-circle-item', key: item.id || index },
                h('div', { style: { fontSize: '1.8rem', color: '#70826f', marginBottom: '8px' } }, factIcon(item.icon)),
                h('strong', {}, item.title || ''),
                h('span', {}, item.description || '')
              )
            )),
            h('div', { className: 'v6-circle-body' },
              h('p', { className: 'v6-signature' }, d.signature || ''),
              rich(d.closing)
            )
          )
        );
      };

      const finding = () => {
        const d = page.finding_home || {};
        const items = enabled(d.logistics);
        return h('section', { className: 'v6-finding', key: 'finding_home', style: styleFor(d.style) },
          h('div', { className: 'v6-shell' },
            h('div', { className: 'v6-finding-card' },
              h('div', { className: 'v6-finding-title' },
                h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''),
                h('h2', { style: headingStyle(d.style) }, d.title || ''),
                h('p', {}, d.heading || '')
              ),
              h('div', { className: 'v6-finding-right' },
                h('div', { className: 'v6-finding-facts' }, items.map((item, index) =>
                  h('div', { className: 'v6-finding-fact', key: item.id || index },
                    h('div', { style: { fontSize: '1.5rem', color: '#667a67' } }, factIcon(item.icon)),
                    h('strong', {}, item.label || ''),
                    h('small', {}, item.detail || '')
                  )
                )),
                h('div', { className: 'v6-finding-footer' },
                  h('p', {}, h('strong', {}, d.availability || '')),
                  d.link_label ? h('span', { className: 'button' }, d.link_label) : null
                )
              )
            )
          )
        );
      };

      const journey = () => {
        const d = page.journey || {};
        const img = asset(d.image, getAsset);
        const items = enabled(d.benefit_items).map((item) => typeof item === 'string' ? item : item.text);
        return h('section', { className: 'v6-journey v6-section', key: 'journey', style: styleFor(d.style) },
          h('div', { className: 'v6-shell' },
            h('div', { className: 'v6-journey-grid' },
              img ? h('div', { className: 'v6-journey-art' }, h('img', { src: img, alt: 'Spiritual journey spiral' })) : null,
              h('div', {},
                h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''),
                h('h2', { style: headingStyle(d.style) }, d.heading || ''),
                rich(d.description, 'v6-lead'),
                h('aside', { className: 'v6-journey-benefit' },
                  h('h3', {}, d.benefit_heading || ''),
                  h('ul', {}, items.map((item, index) => h('li', { key: index }, h('span', { className: 'v6-check' }, '✓'), h('span', {}, item || '')))),
                  h('p', { className: 'v6-journey-note' }, d.benefit_text || '')
                ),
                d.cta_label ? h('div', { className: 'v6-journey-actions' }, h('span', { className: 'button' }, d.cta_label)) : null
              )
            )
          )
        );
      };

      const founder = () => {
        const d = page.founder || {};
        const img = asset(d.image, getAsset);
        return h('section', { className: 'v6-founder', key: 'founder', style: styleFor(d.style) },
          h('div', { className: 'v6-shell' },
            h('div', { className: 'v6-founder-grid' },
              img ? h('img', { src: img, alt: d.image_alt || '' }) : null,
              h('div', {},
                h('p', { className: 'v6-eyebrow' }, d.eyebrow || ''),
                h('h2', { style: headingStyle(d.style) }, d.heading || ''),
                rich(d.body),
                h('span', { style: { color: '#B53A2A', fontWeight: 700 } }, d.link_label || '')
              )
            )
          )
        );
      };

      const protectedSection = (id, title, body) => h('section', { className: 'cms-section', key: id },
        h('div', { className: 'cms-shell' },
          h('span', { className: 'cms-pill' }, id + ' · protected structure'),
          h('h2', {}, title),
          h('p', {}, body),
          h('p', { style: { fontSize: '.82rem', opacity: .7 } }, 'Use View Live for the exact inherited form/interaction rendering.')
        )
      );

      const customSection = (d) => {
        const img = asset(d.image, getAsset);
        return h('section', { className: 'cms-section', key: d.id, style: styleFor(d.style) },
          h('div', { className: 'cms-shell' },
            d.eyebrow ? h('p', { className: 'v6-eyebrow' }, d.eyebrow) : null,
            d.heading ? h('h2', { style: headingStyle(d.style) }, d.heading) : null,
            img ? h('img', { className: 'cms-image', src: img, alt: d.image_alt || '' }) : null,
            rich(d.body || d.quote || ''),
            enabled(d.items).length ? h('div', { className: 'cms-grid' }, enabled(d.items).map((item, index) => {
              const itemImg = asset(item.image, getAsset);
              return h('article', { className: 'cms-card', key: item.id || index },
                itemImg ? h('img', { className: 'cms-image', src: itemImg, alt: item.image_alt || '' }) : null,
                h('h3', {}, item.title || item.label || ''),
                rich(item.body || item.description || item.detail || '')
              );
            })) : null
          )
        );
      };

      const renderers = {
        hero: hero,
        recognition: recognition,
        practice_bridge: practice,
        gifts: gifts,
        difference: difference,
        finding_home: finding,
        journey: journey,
        founder: founder,
        practice_bears_fruit: () => protectedSection('practice_bears_fruit', 'Practice Bears Fruit', 'This inherited V7.1 section remains protected but can be moved or hidden.'),
        fit: () => protectedSection('fit', 'Fit / Not Fit', 'This inherited V7.1 section remains protected but can be moved or hidden.'),
        interest: () => protectedSection('interest', 'Interest / Lead Form', 'The real lead form is protected so Airtable, Resend, tracking, and validation remain stable.'),
        faq: () => protectedSection('faq', 'Frequently Asked Questions', 'The real FAQ interaction is protected so accessibility and behavior remain stable.')
      };

      return h('div', { className: 'v8-v6-home cms-preview-stage' },
        order.filter((item) => item.enabled !== false).map((item) => {
          if (renderers[item.id]) return renderers[item.id]();
          const d = custom[item.id];
          return d && d.enabled !== false ? customSection(d) : null;
        })
      );
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
