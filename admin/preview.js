/* Homeward Decap previews reuse the site's visual language rather than the CMS admin chrome. */
(function () {
  const CMS = window.CMS;
  const createClass = window.createClass;
  const h = window.h;
  if (!CMS || !createClass || !h) return;

  CMS.registerPreviewStyle('/styles.css');
  CMS.registerPreviewStyle('/admin/preview.css');

  const asset = (value, getAsset) => {
    if (!value) return '';
    try { return getAsset(value).toString(); } catch (_) { return String(value); }
  };
  const children = (items, renderer) => (items || []).map((item, index) => renderer(item, index));
  const enabled = (items) => (items || []).filter(function (item) { return item && item.enabled !== false; });
  const palette = {
    forest: '#153A2E', ivory: '#FAF6EF', sage: '#6D7D6A', copper: '#B53A2A',
    gold: '#E0A443', charcoal: '#333333', white: '#FFFFFF', black: '#000000', gray: '#EEEAE4'
  };
  const bgClass = () => '';
  const bgStyle = (style) => {
    const value = style && style.background;
    if (!value || value === 'default' || !palette[value]) return undefined;
    return { background: palette[value], color: ['forest','copper','charcoal','black'].includes(value) ? '#FAF6EF' : '#333333' };
  };

  const HomePreview = createClass({
    render: function () {
      const entry = this.props.entry;
      const data = entry.get('data')?.toJS ? entry.get('data').toJS() : {};
      const hero = data.hero || {};
      const recognition = data.recognition || {};
      const circles = data.circles || {};
      const values = data.values || {};
      const practices = data.practices || {};
      const journey = data.journey || {};
      const image = asset(circles.image || journey.image, this.props.getAsset);

      return h('div', { className: 'cms-preview' },
        h('section', { className: 'cms-hero' }, h('div', { className: 'cms-shell' },
          h('span', { className: 'cms-pill' }, 'Homeward · Live content preview'),
          h('h1', {}, hero.headline || 'Your spiritual journey is yours.'),
          hero.emphasis ? h('h1', {}, h('em', {}, hero.emphasis)) : null,
          h('p', {}, hero.description || ''),
          h('div', { className: 'cms-actions' },
            hero.primary_label ? h('span', { className: 'cms-button' }, hero.primary_label) : null,
            hero.secondary_label ? h('span', { className: 'cms-button secondary' }, hero.secondary_label) : null
          )
        )),
        h('section', { className: 'cms-section' }, h('div', { className: 'cms-shell' },
          h('p', { className: 'cms-eyebrow' }, recognition.eyebrow || 'Invitation'),
          h('h2', {}, recognition.heading || 'You do not have to have it all figured out.'),
          h('p', {}, recognition.intro || ''),
          h('div', { className: 'cms-grid' }, children(recognition.questions, function (question, index) {
            return h('article', { className: 'cms-card', key: index },
              h('div', { className: 'cms-number' }, String(index + 1).padStart(2, '0')),
              h('p', {}, typeof question === 'string' ? question : question?.text || '')
            );
          })),
          recognition.honest_line ? h('div', { className: 'cms-note' }, recognition.honest_line) : null
        )),
        h('section', { className: 'cms-section forest' }, h('div', { className: 'cms-shell' },
          h('p', { className: 'cms-eyebrow' }, circles.eyebrow || 'Homeward Circles'),
          h('h2', {}, [circles.heading_line1, circles.heading_line2].filter(Boolean).join(' ')),
          circles.description ? h('p', {}, circles.description) : null,
          circles.differentiator_line ? h('div', { className: 'cms-note' }, circles.differentiator_line) : null,
          image ? h('img', { className: 'cms-image', src: image, alt: circles.quote || 'Homeward Circle' }) : null,
          h('div', { className: 'cms-grid' }, children(circles.steps, function (step, index) {
            return h('article', { className: 'cms-card dark', key: index },
              h('div', { className: 'cms-number' }, String(index + 1).padStart(2, '0')),
              h('h3', {}, step.title || ''),
              h('p', {}, step.description || '')
            );
          }))
        )),
        h('section', { className: 'cms-section' }, h('div', { className: 'cms-shell' },
          h('p', { className: 'cms-eyebrow' }, values.eyebrow || 'Belong · Grow · Become'),
          h('h2', {}, values.heading || ''),
          h('p', {}, values.intro || ''),
          h('div', { className: 'cms-grid' }, children(values.items, function (item, index) {
            return h('article', { className: 'cms-card', key: index }, h('h3', {}, item.title || ''), h('p', {}, item.description || ''));
          }))
        )),
        h('section', { className: 'cms-section' }, h('div', { className: 'cms-shell' },
          h('p', { className: 'cms-eyebrow' }, practices.eyebrow || 'Practices'),
          h('h2', {}, practices.heading || ''),
          h('p', {}, practices.intro || ''),
          h('div', { className: 'cms-grid' }, children(practices.items, function (item, index) {
            if (item.show_on_homepage === false) return null;
            return h('article', { className: 'cms-card', key: index }, h('h3', {}, item.title || ''), item.subtitle ? h('p', { className: 'cms-eyebrow' }, item.subtitle) : null, h('p', {}, item.description || ''));
          }))
        )),
        h('section', { className: 'cms-section' }, h('div', { className: 'cms-shell' },
          h('p', { className: 'cms-eyebrow' }, journey.eyebrow || 'Journey'),
          h('h2', {}, journey.heading || ''),
          h('p', {}, journey.description || '')
        ))
      );
    }
  });

  const V8Preview = createClass({
    render: function () {
      const entry = this.props.entry;
      const data = entry.get('data')?.toJS ? entry.get('data').toJS() : {};
      const page = data.homepage || {};
      const custom = Object.fromEntries((page.custom_sections || []).filter(function (item) { return item && item.id; }).map(function (item) { return [item.id, item]; }));
      const defaults = ['hero', 'recognition', 'practice_bridge', 'gifts', 'difference', 'finding_home', 'journey', 'practice_bears_fruit', 'founder', 'fit', 'interest', 'faq'];
      const configured = Array.isArray(page.section_order) ? page.section_order : [];
      const seen = {};
      const order = [];

      configured.forEach(function (item) {
        const id = typeof item === 'string' ? item : item && item.id;
        if (!id || seen[id]) return;
        seen[id] = true;
        order.push({ id: id, enabled: typeof item === 'string' ? true : item.enabled !== false });
      });
      defaults.forEach(function (id) {
        if (!seen[id]) {
          seen[id] = true;
          order.push({ id: id, enabled: true });
        }
      });
      Object.keys(custom).forEach(function (id) {
        if (!seen[id]) order.push({ id: id, enabled: true });
      });

      const section = (id, title, body, opts) => {
        const options = opts || {};
        const cls = 'cms-section' + (options.forest ? ' forest' : '') + bgClass(options.style);
        return h('section', { className: cls, key: id, style: bgStyle(options.style) },
          h('div', { className: 'cms-shell' },
            h('span', { className: 'cms-pill' }, options.protected ? id + ' · protected structure' : id),
            options.image ? h('img', { className: 'cms-image', src: asset(options.image, this.props.getAsset), alt: options.alt || '' }) : null,
            title ? h('h2', {}, title) : null,
            body ? h('p', {}, body) : null,
            options.items ? h('div', { className: 'cms-grid' }, enabled(options.items).map(function (item, index) {
              const scalar = typeof item === 'string';
              const key = scalar ? index : (item.id || index);
              const titleText = scalar ? item : (item.title || item.label || item.line1 || item.text || '');
              const detailText = scalar ? '' : (item.description || item.detail || item.line2 || '');
              return h('article', { className: 'cms-card', key: key },
                !scalar && item.image ? h('img', { className: 'cms-image', src: asset(item.image, this.props.getAsset), alt: item.image_alt || '' }) : null,
                h('h3', {}, titleText),
                detailText ? h('p', {}, detailText) : null
              );
            })) : null
          )
        );
      };

      const renderers = {
        hero: () => section('hero', page.hero?.headline, page.hero?.emphasis || page.hero?.description, { image: page.hero?.image, alt: page.hero?.image_alt, items: page.hero?.facts, style: page.hero?.style }),
        recognition: () => section('recognition', page.recognition?.heading, page.recognition?.intro, { items: page.recognition?.items, style: page.recognition?.style }),
        practice_bridge: () => section('practice_bridge', page.practice_bridge?.heading, page.practice_bridge?.body, { items: page.practice_bridge?.outcome_items, style: page.practice_bridge?.style }),
        gifts: () => section('gifts', page.gifts?.heading, page.gifts?.bridge, { items: page.gifts?.items, style: page.gifts?.style }),
        difference: () => section('difference', page.difference?.heading, page.difference?.closing, { items: page.difference?.features, style: page.difference?.style }),
        finding_home: () => section('finding_home', page.finding_home?.title, page.finding_home?.heading, { items: page.finding_home?.logistics, style: page.finding_home?.style }),
        journey: () => section('journey', page.journey?.heading, page.journey?.description, { image: page.journey?.image, items: page.journey?.benefit_items, style: page.journey?.style, forest: true }),
        founder: () => section('founder', page.founder?.heading, page.founder?.body, { image: page.founder?.image, alt: page.founder?.image_alt, style: page.founder?.style }),
        practice_bears_fruit: () => section('practice_bears_fruit', 'Practice Bears Fruit', 'Protected inherited section. Public markup remains controlled by the site renderer.', { protected: true }),
        fit: () => section('fit', 'Fit / Not Fit', 'Protected inherited section. It can be reordered or hidden without generalizing its internal markup.', { protected: true }),
        interest: () => section('interest', 'Interest / Lead Form', 'Protected inherited form and integration structure.', { protected: true }),
        faq: () => section('faq', 'Frequently Asked Questions', 'Protected inherited FAQ behavior and accessibility structure.', { protected: true }),
      };

      return h('div', { className: 'cms-preview' },
        order.filter(function (item) { return item.enabled !== false; }).map(function (item) {
          if (renderers[item.id]) return renderers[item.id]();
          const c = custom[item.id];
          if (!c || c.enabled === false) return null;
          return section(c.id, c.heading || c.type, c.body || c.quote || '', { image: c.image, alt: c.image_alt, items: c.items, style: c.style });
        })
      );
    }
  });

  const GenericPreview = createClass({
    render: function () {
      const entry = this.props.entry;
      const data = entry.get('data')?.toJS ? entry.get('data').toJS() : {};
      const title = data.meta?.title || data.hero?.heading || data.heading || data.title || 'Homeward content';
      const lead = data.hero?.lead || data.hero?.description || data.description || data.intro?.lead || '';
      const sections = Object.keys(data).filter((key) => !['meta'].includes(key)).slice(0, 8);
      return h('div', { className: 'cms-preview' },
        h('section', { className: 'cms-hero' }, h('div', { className: 'cms-shell' },
          h('span', { className: 'cms-pill' }, 'Homeward · Content preview'),
          h('h1', {}, title),
          lead ? h('p', {}, lead) : null
        )),
        h('section', { className: 'cms-section' }, h('div', { className: 'cms-shell' },
          h('div', { className: 'cms-grid' }, sections.map(function (key) {
            const value = data[key];
            let body = '';
            if (typeof value === 'string') body = value;
            else if (Array.isArray(value)) body = value.map(function (item) { return typeof item === 'string' ? item : item?.title || item?.heading || item?.description || ''; }).filter(Boolean).join('\n');
            else if (value && typeof value === 'object') body = Object.values(value).filter((item) => typeof item === 'string').slice(0, 4).join('\n');
            return h('article', { className: 'cms-card', key: key },
              h('p', { className: 'cms-eyebrow' }, key.replaceAll('_', ' ')),
              h('p', {}, body || 'Structured content')
            );
          }))
        ))
      );
    }
  });

  CMS.registerPreviewTemplate('home', HomePreview);
  CMS.registerPreviewTemplate('v8_front_door', V8Preview);
  CMS.registerPreviewTemplate('v8', V8Preview);
  ['global', 'circles', 'practices', 'about', 'connect', 'vision', 'assessment'].forEach(function (name) {
    CMS.registerPreviewTemplate(name, GenericPreview);
  });
}());
