/* Homeward's Decap previews intentionally reuse the site's visual language rather than the CMS admin chrome. */
(function () {
  const CMS = window.CMS;
  const createClass = window.createClass;
  const h = window.h;
  if (!CMS || !createClass || !h) return;

  CMS.registerPreviewStyle('/styles.css');
  CMS.registerPreviewStyle('/admin/preview.css');

  const text = (entry, path, fallback = '') => entry.getIn(['data'].concat(path)) || fallback;
  const asset = (value, getAsset) => {
    if (!value) return '';
    try { return getAsset(value).toString(); } catch (_) { return String(value); }
  };
  const children = (items, renderer) => (items || []).map((item, index) => renderer(item, index));

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
              h('p', {}, question)
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
          h('p', {}, journey.description || ''),
          journey.benefit_heading ? h('div', { className: 'cms-card' },
            h('h3', {}, journey.benefit_heading),
            h('ul', { className: 'cms-list' }, children(journey.benefit_items, function (item, index) { return h('li', { key: index }, item); })),
            journey.benefit_text ? h('p', {}, journey.benefit_text) : null
          ) : null
        ))
      );
    }
  });

  const V8Preview = createClass({
    render: function () {
      const entry = this.props.entry;
      const data = entry.get('data')?.toJS ? entry.get('data').toJS() : {};
      const page = data.homepage || {};
      const custom = Object.fromEntries((page.custom_sections || []).filter(function (item) { return item?.id; }).map(function (item) { return [item.id, item]; }));
      const defaults = ['hero', 'recognition', 'practice_bridge', 'gifts', 'difference', 'finding_home', 'journey', 'practice_bears_fruit', 'founder', 'fit', 'interest', 'faq'];
      const configured = Array.isArray(page.section_order) ? page.section_order : [];
      const order = configured.concat(defaults.filter(function (id) { return !configured.some(function (item) { return item?.id === id; }); }).map(function (id) { return { id: id, enabled: true }; }));
      const visible = function (items) { return (items || []).filter(function (item) { return item?.enabled !== false; }); };
      const itemText = function (item, key) { return typeof item === 'string' ? item : item?.[key || 'text'] || ''; };
      const cards = function (items) {
        return h('div', { className: 'cms-grid' }, visible(items).map(function (item, index) {
          return h('article', { className: 'cms-card', key: item.id || index },
            item.image ? h('img', { className: 'cms-image', src: asset(item.image, this.props.getAsset), alt: item.image_alt || '' }) : null,
            h('h3', {}, item.title || item.heading || item.label || itemText(item)),
            item.description || item.body || item.detail ? h('p', {}, item.description || item.body || item.detail) : null
          );
        }, this));
      }.bind(this);
      const render = function (entryItem, index) {
        if (!entryItem?.id || entryItem.enabled === false) return null;
        const id = entryItem.id;
        const section = page[id] || custom[id] || {};
        if (section.enabled === false) return null;
        if (id === 'hero') return h('section', { className: 'cms-hero', key: id }, h('div', { className: 'cms-shell' },
          h('p', { className: 'cms-eyebrow' }, section.eyebrow || ''), h('h1', {}, section.headline || ''),
          h('h1', {}, h('em', {}, section.emphasis || '')), h('p', {}, section.description || ''),
          section.image ? h('img', { className: 'cms-image', src: asset(section.image, this.props.getAsset), alt: section.image_alt || '' }) : null
        ));
        const items = section.items || section.logistics || section.questions || section.benefit_items || [];
        return h('section', { className: 'cms-section ' + (section.style?.background === 'forest' ? 'forest' : ''), key: id || index }, h('div', { className: 'cms-shell' },
          h('p', { className: 'cms-eyebrow' }, section.eyebrow || id.replaceAll('_', ' ')),
          h('h2', {}, section.heading || section.title || id.replaceAll('_', ' ')),
          section.intro || section.body || section.description ? h('p', {}, section.intro || section.body || section.description) : null,
          section.image ? h('img', { className: 'cms-image', src: asset(section.image, this.props.getAsset), alt: section.image_alt || '' }) : null,
          items.length ? cards(items) : h('div', { className: 'cms-note' }, ['practice_bears_fruit', 'fit', 'interest', 'faq'].includes(id) ? 'Protected V8 structural section; public rendering remains the source of truth.' : 'Section is visible.')
        ));
      }.bind(this);
      return h('div', { className: 'cms-preview' }, order.map(render));
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
  ['global', 'circles', 'practices', 'about', 'connect', 'vision', 'assessment'].forEach(function (name) {
    CMS.registerPreviewTemplate(name, GenericPreview);
  });
}());
