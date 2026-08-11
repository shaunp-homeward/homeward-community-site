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
  const enabled = (items) => (items || []).filter(function (item) { return item && item.enabled !== false; });
  const text = (value) => String(value || '');
  const rich = (value) => {
    if (!value) return null;
    return h('div', { className: 'hw-preview-rich' }, text(value).split(/\n\s*\n/).filter(Boolean).map(function (p, i) {
      return h('p', { key: i }, p.replace(/\*\*|__|\*|_/g, ''));
    }));
  };
  const iconGlyph = (name) => ({
    pin: '⌖', wifi: '⌁', person: '○', heart: '♡', coin: '◌', calendar: '□', people: '◎', leaf: '⌁', chat: '◇',
    prayer: '◇', book: '▤', question: '?', sunrise: '☼', brain: '◉', sun: '☀', cross: '†', headHeart: '♡'
  }[name] || '•');

  const shell = (children, className) => h('div', { className: 'hw-shell ' + (className || '') }, children);
  const eyebrow = (value) => value ? h('p', { className: 'hw-eyebrow' }, value) : null;
  const button = (label, secondary) => label ? h('span', { className: 'button ' + (secondary ? 'button-secondary' : '') }, label) : null;
  const cards = (items, render) => h('div', { className: 'hw-card-grid' }, enabled(items).map(render));

  const HomePreview = createClass({
    render: function () {
      const data = this.props.entry.get('data')?.toJS ? this.props.entry.get('data').toJS() : {};
      const hero = data.hero || {};
      return h('div', { className: 'cms-preview' },
        h('section', { className: 'hw-hero hw-hero-simple' }, shell([
          eyebrow('Homeward'), h('h1', {}, hero.headline || 'Homeward'), hero.emphasis ? h('h1', {}, h('em', {}, hero.emphasis)) : null,
          h('p', { className: 'hw-lead' }, hero.description || '')
        ]))
      );
    }
  });

  const V8Preview = createClass({
    render: function () {
      const data = this.props.entry.get('data')?.toJS ? this.props.entry.get('data').toJS() : {};
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
      defaults.forEach(function (id) { if (!seen[id]) { seen[id] = true; order.push({ id: id, enabled: true }); } });
      Object.keys(custom).forEach(function (id) { if (!seen[id]) order.push({ id: id, enabled: true }); });

      const hero = () => {
        const s = page.hero || {};
        const facts = enabled(s.fact_items || s.facts || []);
        return h('section', { className: 'hw-hero', 'data-v8-section': 'hero' },
          h('div', { className: 'hw-hero-media' }, [
            s.image ? h('img', { src: asset(s.image, this.props.getAsset), alt: s.image_alt || '' }) : null,
            h('div', { className: 'hw-hero-shade' })
          ]),
          shell(h('div', { className: 'hw-hero-copy' }, [
            eyebrow(s.eyebrow),
            h('h1', {}, [text(s.headline), s.emphasis ? h('em', {}, ' ' + s.emphasis) : null]),
            rich(s.description),
            h('div', { className: 'hw-actions' }, [button(s.primary_label), button(s.secondary_label, true)]),
            facts.length ? h('div', { className: 'hw-facts' }, facts.map(function (item, i) {
              return h('div', { className: 'hw-fact', key: item.id || i }, [
                h('span', { className: 'hw-fact-icon' }, iconGlyph(item.icon)),
                h('span', {}, [h('strong', {}, item.line1 || ''), item.line2 ? h('small', {}, item.line2) : null])
              ]);
            })) : null
          ]))
        );
      };

      const recognition = () => {
        const s = page.recognition || {};
        const qs = enabled(s.questions || s.items || []);
        return h('section', { className: 'hw-section hw-invitation', 'data-v8-section': 'recognition' }, shell([
          eyebrow(s.eyebrow), h('h2', {}, s.heading || ''), rich(s.intro),
          qs.length ? h('div', { className: 'hw-question-list' }, qs.map(function (q, i) {
            const body = typeof q === 'string' ? q : (q.text || q.question || '');
            return h('div', { className: 'hw-question', key: q.id || i }, [h('span', {}, String(i + 1).padStart(2, '0')), h('p', {}, body)]);
          })) : null,
          s.honest_line ? h('p', { className: 'hw-closing-line' }, s.honest_line) : null
        ]));
      };

      const practiceBridge = () => {
        const s = page.practice_bridge || {};
        const outcomes = enabled(s.outcome_items || []);
        return h('section', { className: 'hw-section hw-practice-bridge', 'data-v8-section': 'practice_bridge' }, shell([
          h('div', { className: 'hw-split' }, [
            h('div', {}, [eyebrow(s.eyebrow), h('h2', {}, s.heading || ''), rich(s.body), s.outcomes ? h('p', { className: 'hw-closing-line' }, s.outcomes) : null]),
            s.image ? h('figure', { className: 'hw-figure' }, [h('img', { src: asset(s.image, this.props.getAsset), alt: s.image_alt || '' }), s.image_caption ? h('figcaption', {}, s.image_caption) : null]) : null
          ]),
          outcomes.length ? cards(outcomes, function (item, i) { return h('article', { className: 'hw-card', key: item.id || i }, [h('h3', {}, item.title || item.label || ''), h('p', {}, item.description || item.detail || '')]); }) : null
        ]));
      };

      const gifts = () => {
        const s = page.gifts || {};
        return h('section', { className: 'hw-section hw-gifts', 'data-v8-section': 'gifts' }, shell([
          eyebrow(s.eyebrow), h('h2', {}, s.heading || ''), rich(s.bridge || s.intro),
          cards(s.items, function (item, i) { return h('article', { className: 'hw-gift-card', key: item.id || i }, [
            item.image ? h('img', { src: asset(item.image, this.props.getAsset), alt: item.image_alt || '' }) : null,
            h('div', {}, [h('span', { className: 'hw-card-icon' }, iconGlyph(item.icon)), h('h3', {}, item.title || ''), h('p', {}, item.description || item.detail || '')])
          ]); })
        ]));
      };

      const difference = () => {
        const s = page.difference || {};
        return h('section', { className: 'hw-section hw-difference', 'data-v8-section': 'difference' }, shell([
          eyebrow(s.eyebrow), h('h2', {}, s.heading || ''), rich(s.intro || s.body),
          cards(s.features || s.items, function (item, i) { return h('article', { className: 'hw-card', key: item.id || i }, [h('h3', {}, item.title || item.label || ''), h('p', {}, item.description || item.detail || '')]); }),
          s.closing ? h('p', { className: 'hw-closing-line' }, s.closing) : null
        ]));
      };

      const findingHome = () => {
        const s = page.finding_home || {};
        return h('section', { className: 'hw-section hw-season', 'data-v8-section': 'finding_home' }, shell(h('div', { className: 'hw-season-panel' }, [
          eyebrow(s.eyebrow), h('p', { className: 'hw-season-title' }, s.title || ''), h('h2', {}, s.heading || ''), rich(s.body),
          h('div', { className: 'hw-logistics' }, enabled(s.logistics).map(function (item, i) { return h('div', { className: 'hw-logistic', key: item.id || i }, [h('span', {}, iconGlyph(item.icon)), h('div', {}, [h('strong', {}, item.label || ''), h('small', {}, item.detail || '')])]); })),
          s.availability ? h('p', { className: 'hw-availability' }, s.availability) : null,
          button(s.link_label)
        ])));
      };

      const journey = () => {
        const s = page.journey || {};
        return h('section', { className: 'hw-section hw-journey', 'data-v8-section': 'journey' }, shell(h('div', { className: 'hw-split' }, [
          h('div', {}, [eyebrow(s.eyebrow), h('h2', {}, s.heading || ''), rich(s.description || s.body), s.cta_label ? button(s.cta_label) : null]),
          s.image ? h('figure', { className: 'hw-figure' }, h('img', { src: asset(s.image, this.props.getAsset), alt: s.image_alt || '' })) : null
        ])));
      };

      const founder = () => {
        const s = page.founder || {};
        return h('section', { className: 'hw-section hw-founder', 'data-v8-section': 'founder' }, shell(h('div', { className: 'hw-split' }, [
          s.image ? h('figure', { className: 'hw-founder-photo' }, h('img', { src: asset(s.image, this.props.getAsset), alt: s.image_alt || '' })) : null,
          h('div', {}, [eyebrow(s.eyebrow), h('h2', {}, s.heading || ''), rich(s.body), s.link_label ? button(s.link_label) : null])
        ])));
      };

      const protectedSection = (id, title, body) => h('section', { className: 'hw-section hw-protected', 'data-v8-section': id }, shell([
        h('span', { className: 'hw-protected-label' }, 'Live-site structure'), h('h2', {}, title), h('p', {}, body),
        h('p', { className: 'hw-protected-note' }, 'This section keeps its production form/FAQ/integration markup when the site builds. Its position and visibility still follow the Homepage Builder.')
      ]));

      const customSection = (c) => {
        if (!c || c.enabled === false) return null;
        const type = c.type || 'content';
        return h('section', { className: 'hw-section hw-custom hw-custom-' + type, 'data-v8-section': c.id }, shell([
          eyebrow(c.eyebrow), h('h2', {}, c.heading || ''), rich(c.body || c.quote || ''),
          c.image ? h('figure', { className: 'hw-figure' }, h('img', { src: asset(c.image, this.props.getAsset), alt: c.image_alt || '' })) : null,
          c.items ? cards(c.items, function (item, i) { return h('article', { className: 'hw-card', key: item.id || i }, [h('h3', {}, item.title || item.label || ''), h('p', {}, item.description || item.detail || '')]); }) : null
        ]));
      };

      const renderers = {
        hero: hero, recognition: recognition, practice_bridge: practiceBridge, gifts: gifts, difference: difference,
        finding_home: findingHome, journey: journey, founder: founder,
        practice_bears_fruit: () => protectedSection('practice_bears_fruit', 'Practice Bears Fruit', 'The launch candidate keeps this established section from the public renderer.'),
        fit: () => protectedSection('fit', 'Is Homeward a fit?', 'The launch candidate keeps the established fit / not-fit structure.'),
        interest: () => protectedSection('interest', 'Tell us you’re interested', 'The launch candidate keeps the production lead form and integrations.'),
        faq: () => protectedSection('faq', 'Frequently Asked Questions', 'The launch candidate keeps the production FAQ behavior and accessibility structure.')
      };

      return h('div', { className: 'cms-preview hw-launch-preview' },
        order.filter(function (item) { return item.enabled !== false; }).map(function (item) {
          const sectionData = page[item.id];
          if (sectionData && sectionData.enabled === false) return null;
          return renderers[item.id] ? renderers[item.id]() : customSection(custom[item.id]);
        })
      );
    }
  });

  const GenericPreview = createClass({
    render: function () {
      const data = this.props.entry.get('data')?.toJS ? this.props.entry.get('data').toJS() : {};
      const title = data.meta?.title || data.hero?.heading || data.heading || data.title || 'Homeward content';
      return h('div', { className: 'cms-preview' }, h('section', { className: 'hw-section' }, shell([h('h1', {}, title)])));
    }
  });

  CMS.registerPreviewTemplate('home', HomePreview);
  CMS.registerPreviewTemplate('v8_front_door', V8Preview);
  CMS.registerPreviewTemplate('v8', V8Preview);
  ['global', 'circles', 'practices', 'about', 'connect', 'vision', 'assessment'].forEach(function (name) { CMS.registerPreviewTemplate(name, GenericPreview); });
}());