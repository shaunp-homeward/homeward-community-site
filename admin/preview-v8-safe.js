/* Safe V8-aware Decap preview. Keeps legacy content previews generic and never assumes getAsset exists. */
(function () {
  const CMS = window.CMS;
  const createClass = window.createClass;
  const h = window.h;
  if (!CMS || !createClass || !h) return;

  CMS.registerPreviewStyle('/styles.css');
  CMS.registerPreviewStyle('/assets/v8-home-v6.css');
  CMS.registerPreviewStyle('/admin/preview.css');

  const palette = {
    forest: '#153A2E', ivory: '#FAF6EF', sage: '#6D7D6A', copper: '#B53A2A',
    gold: '#E0A443', charcoal: '#333333', white: '#FFFFFF', black: '#000000', gray: '#EEEAE4'
  };
  const list = (value) => Array.isArray(value) ? value : [];
  const enabled = (value) => list(value).filter((item) => item && item.enabled !== false);
  const asset = (value, getAsset) => {
    if (!value) return '';
    if (typeof getAsset !== 'function') return String(value);
    try { return getAsset(value).toString(); } catch (_) { return String(value); }
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
  const bodyText = (value) => String(value || '').replace(/\*\*|__|\*|_/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  const V8Preview = createClass({
    render: function () {
      const entry = this.props && this.props.entry;
      const getAsset = this.props && this.props.getAsset;
      const data = entry && entry.get && entry.get('data') && entry.get('data').toJS ? entry.get('data').toJS() : {};
      const page = data.homepage || {};
      const custom = Object.fromEntries(list(page.custom_sections).filter((x) => x && x.id).map((x) => [x.id, x]));
      const defaults = ['hero','recognition','practice_bridge','gifts','difference','finding_home','journey','practice_bears_fruit','founder','fit','interest','faq'];
      const configured = list(page.section_order);
      const seen = {};
      const order = [];
      configured.forEach((item) => {
        if (!item || !item.id || seen[item.id]) return;
        seen[item.id] = true;
        order.push(item);
      });
      defaults.forEach((id) => { if (!seen[id]) { seen[id] = true; order.push({ id, enabled: true }); } });
      Object.keys(custom).forEach((id) => { if (!seen[id]) order.push({ id, enabled: true }); });

      const section = (id, title, body, opts) => {
        const o = opts || {};
        const style = o.style || {};
        const image = asset(o.image, getAsset);
        return h('section', { className: 'cms-section', key: id, style: styleFor(style) },
          h('div', { className: 'cms-shell' },
            h('span', { className: 'cms-pill' }, o.protected ? id + ' · protected' : id),
            image ? h('img', { className: 'cms-image', src: image, alt: o.alt || '' }) : null,
            title ? h('h2', { style: headingStyle(style) }, title) : null,
            body ? h('p', {}, bodyText(body)) : null,
            o.items ? h('div', { className: 'cms-grid' }, enabled(o.items).map((item, index) => {
              const scalar = typeof item === 'string';
              const img = !scalar ? asset(item.image, getAsset) : '';
              return h('article', { className: 'cms-card', key: scalar ? index : (item.id || index) },
                img ? h('img', { className: 'cms-image', src: img, alt: item.image_alt || '' }) : null,
                h('h3', {}, bodyText(scalar ? item : (item.title || item.label || item.line1 || item.text || ''))),
                !scalar && (item.description || item.detail || item.line2) ? h('p', {}, bodyText(item.description || item.detail || item.line2)) : null
              );
            })) : null
          )
        );
      };

      const renderers = {
        hero: () => section('hero', page.hero?.headline, page.hero?.description || page.hero?.emphasis, { image: page.hero?.image, alt: page.hero?.image_alt, items: page.hero?.facts, style: page.hero?.style }),
        recognition: () => section('recognition', page.recognition?.heading, page.recognition?.intro, { items: page.recognition?.items, style: page.recognition?.style }),
        practice_bridge: () => section('practice_bridge', page.practice_bridge?.heading, page.practice_bridge?.body, { image: page.practice_bridge?.image, alt: page.practice_bridge?.image_alt, items: page.practice_bridge?.outcome_items, style: page.practice_bridge?.style }),
        gifts: () => section('gifts', page.gifts?.heading, page.gifts?.bridge, { items: page.gifts?.items, style: page.gifts?.style }),
        difference: () => section('difference', page.difference?.heading, page.difference?.closing, { items: page.difference?.features, style: page.difference?.style }),
        finding_home: () => section('finding_home', page.finding_home?.title, page.finding_home?.body || page.finding_home?.heading, { items: page.finding_home?.logistics, style: page.finding_home?.style }),
        journey: () => section('journey', page.journey?.heading, page.journey?.description, { image: page.journey?.image, items: page.journey?.benefit_items, style: page.journey?.style }),
        founder: () => section('founder', page.founder?.heading, page.founder?.body, { image: page.founder?.image, alt: page.founder?.image_alt, style: page.founder?.style }),
        practice_bears_fruit: () => section('practice_bears_fruit', 'Practice Bears Fruit', 'Protected inherited section. It can be reordered or hidden.', { protected: true }),
        fit: () => section('fit', 'Fit / Not Fit', 'Protected inherited section. It can be reordered or hidden.', { protected: true }),
        interest: () => section('interest', 'Interest / Lead Form', 'Protected form and integration structure.', { protected: true }),
        faq: () => section('faq', 'Frequently Asked Questions', 'Protected FAQ interaction and accessibility structure.', { protected: true })
      };

      return h('div', { className: 'cms-preview' }, order.filter((x) => x.enabled !== false).map((item) => {
        if (renderers[item.id]) return renderers[item.id]();
        const c = custom[item.id];
        if (!c || c.enabled === false) return null;
        return section(c.id, c.heading || c.type, c.body || c.quote || '', { image: c.image, alt: c.image_alt, items: c.items, style: c.style });
      }));
    }
  });

  const GenericPreview = createClass({
    render: function () {
      const entry = this.props && this.props.entry;
      const data = entry && entry.get && entry.get('data') && entry.get('data').toJS ? entry.get('data').toJS() : {};
      const title = data.meta?.title || data.hero?.heading || data.heading || data.title || 'Homeward content';
      const lead = data.hero?.lead || data.hero?.description || data.description || data.intro?.lead || '';
      return h('div', { className: 'cms-preview' }, h('section', { className: 'cms-section' }, h('div', { className: 'cms-shell' }, h('h1', {}, title), lead ? h('p', {}, bodyText(lead)) : null)));
    }
  });

  CMS.registerPreviewTemplate('v8_front_door', V8Preview);
  CMS.registerPreviewTemplate('v8', V8Preview);
  ['home','global','circles','practices','about','connect','vision','assessment'].forEach((name) => CMS.registerPreviewTemplate(name, GenericPreview));
}());
