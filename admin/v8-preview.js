/* V8/V6 visual preview for the branch-aware Decap CMS. */
(function () {
  const CMS = window.CMS;
  const createClass = window.createClass;
  const h = window.h;
  if (!CMS || !createClass || !h) return;

  CMS.registerPreviewStyle('/assets/v8-home-v6.css');

  const asset = (value, getAsset) => {
    if (!value) return '';
    try { return getAsset(value).toString(); } catch (_) { return String(value); }
  };
  const list = (value) => Array.isArray(value) ? value : [];

  const V8Preview = createClass({
    render: function () {
      const entry = this.props.entry;
      const data = entry.get('data')?.toJS ? entry.get('data').toJS() : {};
      const home = data.homepage || {};
      const hero = home.hero || {};
      const recognition = home.recognition || {};
      const practice = home.practice_bridge || {};
      const gifts = home.gifts || {};
      const difference = home.difference || {};
      const finding = home.finding_home || {};
      const journey = home.journey || {};
      const founder = home.founder || {};
      const heroImage = asset(hero.image, this.props.getAsset);
      const journeyImage = asset(journey.image, this.props.getAsset);
      const founderImage = asset(founder.image, this.props.getAsset);

      return h('div', { className: 'v8-v6-home' },
        h('section', { className: 'v6-hero' },
          heroImage ? h('div', { className: 'v6-hero-media' }, h('img', { src: heroImage, alt: hero.image_alt || '' })) : null,
          h('div', { className: 'v6-shell v6-hero-grid' }, h('div', { className: 'v6-hero-copy' },
            h('p', { className: 'v6-eyebrow' }, 'THE MISSING HOW-TO OF SPIRITUAL LIFE'),
            h('h1', {}, hero.headline || '', h('br'), 'But were you ever taught ', h('span', { className: 'accent' }, (hero.emphasis || '').replace(/^But were you ever taught\s*/i, ''))),
            h('p', { className: 'hero-desc' }, hero.description || ''),
            h('div', { className: 'v6-hero-actions' },
              h('span', { className: 'button' }, hero.primary_label || ''),
              h('span', { className: 'button button-secondary' }, hero.secondary_label || '')
            )
          ))
        ),
        h('section', { className: 'v6-recognition v6-section' }, h('div', { className: 'v6-shell' },
          h('div', { className: 'v6-recognition-head v6-center' },
            h('p', { className: 'v6-eyebrow' }, recognition.eyebrow || ''),
            h('h2', {}, recognition.heading || ''),
            h('p', { className: 'v6-lead' }, recognition.intro || '')
          ),
          h('div', { className: 'v6-recognition-grid' },
            list(recognition.questions).map((q, i) => h('div', { className: 'v6-recognition-item', key: `q-${i}` }, h('p', {}, q))),
            recognition.authors?.length ? h('div', { className: 'v6-recognition-item', key: 'authors' }, h('p', {}, `You may have read ${recognition.authors.join(', ')}—and still wish you had people to actually practice with.`)) : null
          ),
          h('p', { className: 'v6-recognition-end v6-center' }, recognition.honest_line || '')
        )),
        h('section', { className: 'v6-practice v6-section' }, h('div', { className: 'v6-shell' }, h('div', { className: 'v6-practice-grid' },
          h('div', {}, h('p', { className: 'v6-eyebrow' }, practice.eyebrow || ''), h('h2', { className: 'v6-practice-title' }, 'Spiritual Practices:', h('span', {}, 'Exercises for the Heart and Mind'))),
          h('div', { className: 'v6-practice-copy' }, h('p', {}, practice.body || '')),
          practice.outcomes ? h('div', { className: 'v6-outcome-grid', style: { gridTemplateColumns: '1fr' } }, h('p', {}, practice.outcomes)) : null
        )))),
        h('section', { className: 'v6-gifts v6-section' }, h('div', { className: 'v6-shell' },
          h('div', { className: 'v6-gifts-head v6-center' }, h('p', { className: 'v6-eyebrow' }, gifts.eyebrow || ''), h('h2', {}, gifts.heading || ''), h('p', { className: 'v6-lead' }, gifts.bridge || '')),
          h('div', { className: 'v6-gift-grid' }, list(gifts.items).map((item, i) => {
            const img = asset(item.image, this.props.getAsset);
            return h('article', { className: 'v6-gift', key: `gift-${i}` },
              img ? h('div', { className: 'v6-gift-img' }, h('img', { src: img, alt: item.image_alt || '' })) : null,
              h('div', { className: 'v6-gift-copy' }, h('h3', {}, item.title || ''), h('p', {}, item.description || ''))
            );
          }))
        )),
        h('section', { className: 'v6-circle v6-section' }, h('div', { className: 'v6-shell' }, h('div', { className: 'v6-circle-head v6-center' },
          h('p', { className: 'v6-eyebrow' }, difference.eyebrow || ''), h('h2', {}, difference.heading || ''), h('p', { className: 'v6-circle-sub' }, "It's not a class. It's a guided experience."),
          h('p', { className: 'v6-signature' }, difference.signature || ''), h('p', {}, difference.closing || '')
        )))),
        finding.enabled === false ? null : h('section', { className: 'v6-finding' }, h('div', { className: 'v6-shell' }, h('div', { className: 'v6-finding-card' },
          h('div', { className: 'v6-finding-title' }, h('p', { className: 'v6-eyebrow' }, finding.eyebrow || ''), h('h2', {}, finding.title || ''), h('p', {}, finding.heading || '')),
          h('div', { className: 'v6-finding-right' }, h('div', { className: 'v6-finding-facts' }, list(finding.logistics).map((item, i) => h('div', { className: 'v6-finding-fact', key: `fact-${i}` }, h('strong', {}, item.label || ''), h('small', {}, item.detail || '')))), h('p', {}, finding.availability || ''))
        ))),
        h('section', { className: 'v6-journey v6-section' }, h('div', { className: 'v6-shell' }, h('div', { className: 'v6-journey-grid' },
          journeyImage ? h('div', { className: 'v6-journey-art' }, h('img', { src: journeyImage, alt: '' })) : null,
          h('div', {}, h('p', { className: 'v6-eyebrow' }, journey.eyebrow || ''), h('h2', {}, journey.heading || ''), h('p', { className: 'v6-lead' }, journey.description || ''),
            h('aside', { className: 'v6-journey-benefit' }, h('h3', {}, journey.benefit_heading || ''), h('ul', {}, list(journey.benefit_items).map((item, i) => h('li', { key: `benefit-${i}` }, h('span', { className: 'v6-check' }, '✓'), h('span', {}, item)))), h('p', { className: 'v6-journey-note' }, journey.benefit_text || '')),
            h('span', { className: 'button' }, journey.cta_label || '')
          )
        )))),
        h('section', { className: 'v6-founder' }, h('div', { className: 'v6-shell' }, h('div', { className: 'v6-founder-grid' },
          founderImage ? h('img', { src: founderImage, alt: founder.image_alt || '' }) : null,
          h('div', {}, h('p', { className: 'v6-eyebrow' }, founder.eyebrow || ''), h('h2', {}, founder.heading || ''), h('p', {}, founder.body || ''), h('span', {}, founder.link_label || ''))
        )))
      );
    }
  });

  // Decap file collections can resolve previews by file name or collection name.
  CMS.registerPreviewTemplate('v8', V8Preview);
  CMS.registerPreviewTemplate('v8_front_door', V8Preview);
}());
