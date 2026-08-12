/* V8 Decap preview aligned to the staging homepage hierarchy refinement. */
(function () {
  const CMS = window.CMS;
  const createClass = window.createClass;
  const h = window.h;
  if (!CMS || !createClass || !h) return;

  CMS.registerPreviewStyle('/assets/homepage-concept-v1.css?v=1');
  CMS.registerPreviewStyle('/assets/homepage-concept-v1-polish.css?v=6');
  CMS.registerPreviewStyle('/assets/v8-launch-image-qa.css?v=2');
  CMS.registerPreviewStyle('/assets/homepage-v8-hierarchy-refinement.css?v=1');

  const list = (value) => Array.isArray(value) ? value : [];
  const enabled = (value) => list(value).filter((item) => item && item.enabled !== false);
  const text = (value) => String(value || '');
  const asset = (value, getAsset) => {
    if (!value) return '';
    try {
      const resolved = getAsset && getAsset(value);
      if (resolved) return resolved.toString();
    } catch (_) {}
    const raw = String(value);
    if (/^(https?:|data:|blob:|\/)/i.test(raw)) return raw;
    return '/' + raw.replace(/^\.\//, '');
  };
  const richText = (value) => text(value)
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1');

  const iconPath = {
    location: [['path',{d:'M24 43s12-11.5 12-24a12 12 0 1 0-24 0c0 12.5 12 24 12 24Z'}],['circle',{cx:24,cy:19,r:4.5}]],
    pin: [['path',{d:'M24 43s12-11.5 12-24a12 12 0 1 0-24 0c0 12.5 12 24 12 24Z'}],['circle',{cx:24,cy:19,r:4.5}]],
    wifi: [['path',{d:'M8 18c9-8 23-8 32 0M14 25c6-5 14-5 20 0M20 32c2.5-2 5.5-2 8 0'}],['circle',{cx:24,cy:38,r:2,fill:'currentColor',stroke:'none'}]],
    person: [['circle',{cx:24,cy:15,r:7}],['path',{d:'M11 40c1-9 6-14 13-14s12 5 13 14'}]],
    heart: [['path',{d:'M24 40 8.5 24.8C1.5 17.8 11.2 7.6 18.5 13L24 18l5.5-5c7.3-5.4 17 4.8 10 11.8L24 40Z'}]],
    coin: [['circle',{cx:24,cy:24,r:18}],['path',{d:'M29.5 16.5c-2-1.7-8.7-2-10.7 1.8-2.6 5 9.6 4.3 10.4 9.1.6 4.1-6.9 6.4-11.7 2.2M24 11v26'}]],
    dollar: [['circle',{cx:24,cy:24,r:18}],['path',{d:'M29.5 16.5c-2-1.7-8.7-2-10.7 1.8-2.6 5 9.6 4.3 10.4 9.1.6 4.1-6.9 6.4-11.7 2.2M24 11v26'}]],
    people: [['circle',{cx:24,cy:14,r:6}],['circle',{cx:10,cy:19,r:5}],['circle',{cx:38,cy:19,r:5}],['path',{d:'M14 40c1-9 5-14 10-14s9 5 10 14M2 39c1-7 4-11 9-11 3 0 5 2 7 5m28 6c-1-7-4-11-9-11-3 0-5 2-7 5'}]],
    calendar: [['rect',{x:7,y:10,width:34,height:31,rx:3}],['path',{d:'M7 19h34M16 6v8M32 6v8M14 26h5m5 0h5m5 0h1M14 33h5m5 0h5'}]],
    leaf: [['path',{d:'M39 8C21 8 10 17 10 31c11 3 25-3 29-23Z'}],['path',{d:'M10 40c6-10 13-17 25-25'}]],
    chat: [['path',{d:'M8 9h32v25H22L12 42v-8H8V9Z'}],['path',{d:'M16 20h16M16 26h11'}]],
    cross: [['path',{d:'M24 5v38M13 16h22'}]],
    question: [['circle',{cx:24,cy:24,r:18}],['path',{d:'M18.5 18c.8-4 3.7-6 7.5-6 4.3 0 7.5 2.8 7.5 6.7 0 5.4-6.8 5.9-8 10.2'}]],
    sunrise: [['path',{d:'M6 35h36M11 29a13 13 0 0 1 26 0M24 5v8M8 13l6 6m26-6-6 6'}]],
    brain: [['path',{d:'M22 9c-4-5-10-2-10 3-5 0-7 6-3 9-5 4-1 11 4 10 0 5 6 8 9 4V9Zm4 0c4-5 10-2 10 3 5 0 7 6 3 9 5 4 1 11-4 10 0 5-6 8-9 4V9Z'}]],
    sun: [['circle',{cx:24,cy:24,r:8}],['path',{d:'M24 4v8m0 24v8M4 24h8m24 0h8M10 10l6 6m16 16 6 6m0-28-6 6M16 32l-6 6'}]],
  };
  const icon = (name) => h('svg', {viewBox:'0 0 48 48','aria-hidden':'true'}, ...(iconPath[name] || iconPath.leaf).map(([tag,props],i)=>h(tag,{...props,key:i})));

  const findingWeeks = [
    {number:'01',movement:'ARRIVE',title:'The Invitation Home',description:'Arrive without needing to perform or have everything figured out.',practice:'Arrival silence + guided breath prayer'},
    {number:'02',movement:'BELONG',title:'Belonging Before Certainty',description:'Experience belonging without pretending, fixing, or agreeing on everything.',practice:'Attentive listening without fixing or correcting'},
    {number:'03',movement:'AWAKEN',title:'Becoming Present',description:'Notice hurry, distraction, and inner noise—and practice becoming present to God.',practice:'Centering prayer or silent prayer'},
    {number:'04',movement:'TELL THE TRUTH',title:'The Courage to Be Honest',description:'Bring doubt, grief, longing, failure, and unanswered questions into honest reflection.',practice:'Honest reflection + spiritual journaling'},
  ];
  const circlePillars = [
    {icon:'leaf',title:'Practice together',description:'Meditation, prayer, Scripture, silence, gratitude, and reflection—guided, not just discussed.'},
    {icon:'chat',title:'Explore honestly',description:'Speak from experience. Listen without fixing. Questions are welcome; agreement is not required.'},
    {icon:'calendar',title:'Carry it into life',description:'Try the practice in ordinary life, notice what changes, then return and reflect together.'},
  ];

  const V8Preview = createClass({
    render: function () {
      const entry = this.props && this.props.entry;
      const getAsset = this.props && this.props.getAsset;
      const data = entry && entry.get && entry.get('data') && entry.get('data').toJS ? entry.get('data').toJS() : {};
      const page = data.homepage || {};
      const customs = Object.fromEntries(list(page.custom_sections).filter(x=>x&&x.id).map(x=>[x.id,x]));

      const hero = page.hero || {};
      const recognition = page.recognition || {};
      const difference = page.difference || {};
      const finding = page.finding_home || {};
      const join = customs.join_process || {};
      const practice = page.practice_bridge || {};
      const gifts = page.gifts || {};
      const founder = page.founder || {};
      const journey = page.journey || {};

      const heroFacts = enabled(hero.facts);
      const recognitionItems = enabled(recognition.items);
      const logistics = enabled(finding.logistics);
      const joinItems = enabled(join.items);
      const giftItems = enabled(gifts.items).slice(0,4);
      const outcomeItems = enabled(practice.outcome_items).slice(0,4);
      const effectiveJoinItems = joinItems.length ? joinItems.slice(0,3) : [
        {title:'Tell us you’re interested.',body:'Complete a short form. It takes a couple of minutes and there is no commitment.'},
        {title:'Have a short conversation.',body:'Ask questions, hear what a Circle feels like, and tell us what you’re looking for.'},
        {title:'We’ll help find your Circle.',body:'We’ll look at location, schedule, online or in-person format, and fit.'},
      ];

      const heroSection = h('section',{className:'hero',key:'hero'},
        h('div',{className:'hero-copy-panel'},h('div',{className:'hero-copy-inner'},
          h('p',{className:'eyebrow'}, hero.eyebrow || 'THE MISSING HOW-TO OF SPIRITUAL LIFE'),
          h('h1',{}, hero.headline || 'You learned what to believe.', h('br'), 'But were you ever taught', h('br'), h('span',{className:'hero-accent'}, richText(hero.emphasis).replace(/^But were you ever taught\s*/i,'') || 'how to practice?')),
          h('p',{className:'hero-lead'}, richText(hero.description)),
          h('div',{className:'hero-icon-row'}, heroFacts.map((it,i)=>h('div',{key:it.id||i},icon(it.icon),h('span',{},it.line1||'',h('br'),it.line2||'')))),
          h('div',{className:'hero-actions'}, h('span',{className:'button button-copper'},hero.primary_label||'Tell Us You’re Interested'),h('span',{className:'button button-outline'},hero.secondary_label||'See How a Circle Works')),
          h('p',{className:'hero-note'},'Fall Circles are forming now. You can begin curious, uncertain, or simply ready to practice.')
        )),
        h('div',{className:'hero-image-wrap'}, hero.image ? h('img',{src:asset(hero.image,getAsset),alt:hero.image_alt||''}) : null)
      );

      const recognitionSection = h('section',{className:'recognition section',key:'recognition'},h('div',{className:'shell narrow-wide'},
        h('div',{className:'section-heading centered recognition-heading'},h('p',{className:'eyebrow'},recognition.eyebrow||'The Invitation'),h('h2',{},recognition.heading||'Does any of this feel familiar?'),h('p',{},'Maybe you know a lot about spiritual life—or maybe you simply want something deeper. Either way, understanding faith and actually living it are not quite the same thing.')),
        h('div',{className:'recognition-grid recognition-grid-four'},recognitionItems.map((it,i)=>h('article',{key:it.id||i},icon(it.icon||'question'),h('p',{},h('strong',{},it.text||''))))),
        h('p',{className:'recognition-close'},recognition.honest_line||'You do not need settled beliefs—only an honest desire to explore, practice, and grow.')
      ));

      const practiceSection = h('section',{className:'home-practices section',key:'practice_bridge'},h('div',{className:'shell practices-home-grid'},
        h('div',{className:'practices-home-copy'},
          h('p',{className:'eyebrow'},'PRACTICES FOR THE MIND AND HEART'),
          h('h2',{},'Ancient practices. Everyday change.'),
          h('p',{className:'practices-subhead'},h('strong',{},'Spiritual practices: exercises for the heart and mind.')),
          h('p',{className:'practices-lead'},'We exercise our bodies because strength does not appear simply because we understand it. Spiritual practices work in a similar way: repeated prayer, meditation, gratitude, Scripture, and reflection train attention, openness, presence, and love.'),
          h('p',{},'The point is not to become good at meditation. The point is to become more present, peaceful, joyful, resilient, loving—and rooted in God.'),
          h('div',{className:'practice-benefit-grid'},outcomeItems.map((it,i)=>h('div',{key:it.id||i},icon(it.icon||'heart'),h('strong',{},it.label||'',h('br'),it.detail||'')))),
          h('div',{className:'research-teaser'},h('span',{className:'research-number'},'10'),h('div',{},h('b',{},'MINUTES A DAY'),h('p',{},'One eight-week randomized trial found that a modest daily meditation rhythm reduced perceived stress. The broader research also points to benefits for attention, gratitude, well-being, and connection.'))),
          h('p',{className:'research-note'},'Prayer is more than a wellness technique, and science cannot measure God. The Practices page shows the research carefully—and how Homeward brings these tools into a Jesus-centered spiritual life.'),
          h('div',{className:'practice-cta-row'},h('span',{className:'button button-copper'},'Explore Practices + Research'),h('span',{className:'text-link'},'See the Practice Library ',h('span',{},'→')))
        ),
        h('div',{className:'practice-collage'},giftItems.map((it,i)=>h('figure',{className:'practice-tile tile-'+String.fromCharCode(97+i),key:it.id||i},it.image?h('img',{src:asset(it.image,getAsset),alt:it.image_alt||''}):null,h('figcaption',{},h('b',{},it.title||''),h('span',{},it.description||'')))))
      ));

      const differenceSection = h('section',{className:'circle-different section',key:'difference'},h('div',{className:'shell narrow-wide'},
        h('div',{className:'section-heading centered circle-different-heading'},h('p',{className:'eyebrow'},difference.eyebrow||'Not Your Ordinary Small Group'),h('h2',{},'Not just another small group. A place to practice.'),h('p',{className:'circle-subhead'},'A Circle is a guided community of practice—not a class and not a debate.')),
        h('div',{className:'circle-icon-grid v9-circle-grid'},circlePillars.map((it,i)=>h('article',{key:i},icon(it.icon),h('h3',{},it.title),h('p',{},it.description)))),
        h('div',{className:'circle-different-note'},h('p',{},'Rooted in Jesus, Homeward adds another layer to meaningful friendship and Scripture: ',h('strong',{},'guided practice, lived experience, and a rhythm that continues between gatherings.')),h('p',{className:'circle-signature'},difference.signature||'Practice the way. Explore honestly. Carry it into life.'),h('span',{className:'button button-outline circle-page-cta'},'See How Circles Work'))
      ));

      const findingSection = h('section',{className:'season-wrap section-tight',key:'finding_home'},h('div',{className:'shell'},h('div',{className:'season-card v9-season-card'},
        h('div',{className:'season-intro v9-season-intro'},
          h('div',{className:'season-art'},h('img',{src:'/assets/homepage-finding-home-emblem.svg',alt:''})),
          h('div',{},h('p',{className:'eyebrow'},finding.eyebrow||'YOUR FIRST SEASON · FALL 2026'),h('h2',{},finding.title||'Finding Home'),h('p',{className:'season-tagline'},'Four weeks to arrive, belong, awaken, and tell the truth.'),h('p',{className:'v9-season-lead'},'Finding Home is your first taste of a Homeward Circle: four gatherings designed to help you experience belonging, honest conversation, contemplative practice, and a more lived way of following Jesus.'))
        ),
        h('div',{className:'finding-weeks'},findingWeeks.map((week)=>h('article',{className:'finding-week',key:week.number},h('div',{className:'finding-week-top'},h('span',{className:'finding-week-number'},week.number),h('span',{className:'finding-week-movement'},week.movement)),h('h3',{},week.title),h('p',{},week.description),h('small',{},h('strong',{},'Practice: '),week.practice)))),
        h('p',{className:'season-reassurance v9-season-reassurance'},'The first four weeks are a beginning—not a graduation or finish line. If the rhythm is life-giving, future seasons keep deepening the journey.'),
        h('div',{className:'season-facts v9-season-facts'},...logistics.map((it,i)=>h('div',{className:'fact',key:it.id||i},icon(it.icon||'calendar'),h('div',{},h('strong',{},it.label||''),h('small',{},it.detail||'')))),h('p',{className:'season-availability'},h('strong',{},finding.availability||'Evening Circles are forming now.'),' Exact days and times will be shared as groups form.'))
      )));

      const fitSection = h('section',{className:'fit section-tight',key:'fit'},h('div',{className:'shell fit-intro'},h('p',{className:'eyebrow'},'COULD HOMEWARD BE A FIT?'),h('h2',{},'Openness matters more than certainty.'),h('p',{},'You do not have to arrive with settled beliefs. You do need a willingness to participate respectfully, practice, and listen.')),h('div',{className:'shell fit-shell'},h('div',{className:'fit-column fit-yes'},h('h2',{},'You may feel at home if…'),h('ul',{},h('li',{},'You are seeking depth, connection, and a more lived spiritual life.'),h('li',{},'You are willing to explore Jesus and Scripture respectfully, even if your beliefs are unsettled.'),h('li',{},'You can speak from your own experience, listen without fixing, and practice between gatherings.'))),h('div',{className:'fit-column fit-no'},h('h2',{},'A Circle may not be the best fit if…'),h('ul',{},h('li',{},'Your primary purpose is to debate, disprove, convert, or require agreement.'),h('li',{},'You want a class built around one expert supplying the correct answers.'),h('li',{},'You are not willing to respect confidentiality or the lived experience of other participants.')))),h('div',{className:'fit-link-row'},h('span',{className:'text-link'},'See the full Circle fit + FAQ ',h('span',{},'→'))));

      const founderSection = h('section',{className:'founder founder-feature section',key:'founder'},h('div',{className:'shell founder-row'},
        h('div',{className:'founder-image'},founder.image?h('img',{src:asset(founder.image,getAsset),alt:founder.image_alt||''}):null),
        h('div',{className:'founder-copy'},h('p',{className:'eyebrow'},'WHY HOMEWARD EXISTS'),h('h2',{},'I came home with practices. I didn’t have people to practice with.'),h('p',{},richText(founder.body)),h('p',{className:'founder-trust'},'Religious Studies + Anthropology · decades of contemplative practice · husband, father, and business leader'),h('span',{className:'text-link'},'Read Shaun’s Story ',h('span',{},'→')))
      ));

      const interestSection = h('section',{className:'interest section v9-interest',key:'interest'},h('div',{className:'shell'},
        h('div',{className:'interest-join'},h('div',{className:'section-heading centered'},h('p',{className:'eyebrow'},'HOW JOINING A CIRCLE WORKS'),h('h2',{},'Three simple steps. No pressure.'),h('p',{},'Interest starts a conversation—not a commitment.')),h('div',{className:'join-grid v9-join-grid'},effectiveJoinItems.map((it,i)=>h('article',{key:i},h('span',{className:'join-number'},String(i+1).padStart(2,'0')),h('h3',{},(it.title||'').replace(/^\d+\.\s*/,'')),h('p',{},it.body||it.description||''))))),
        h('div',{className:'interest-grid'},h('div',{className:'interest-copy'},h('p',{className:'eyebrow'},'READY TO EXPLORE A CIRCLE?'),h('h2',{},'Tell us you’re interested.'),h('p',{},'You do not need to choose a group or make a commitment. Share a little about what you’re looking for and we’ll follow up personally as Fall Circles form.'),h('div',{className:'interest-note'},h('strong',{},'Prefer to talk first?'),h('p',{},'Have a short conversation about Homeward. No pressure, no pitch—just a chance to ask questions and see whether a Circle feels right.'),h('span',{className:'text-link'},'Have a Short Conversation ',h('span',{},'→')))),h('div',{className:'interest-form'},h('label',{},'First name',h('input',{disabled:true})),h('label',{},'Email',h('input',{disabled:true})),h('label',{},'What are you hoping to find?',h('textarea',{disabled:true,rows:4})),h('span',{className:'button button-copper form-submit'},'Tell Us You’re Interested')))
      ));

      const journeySection = h('section',{className:'journey',key:'journey'},h('div',{className:'shell journey-grid'},h('div',{className:'journey-art'},journey.image?h('img',{src:asset(journey.image,getAsset),alt:''}):null),h('div',{className:'journey-copy'},h('p',{className:'eyebrow gold'},journey.eyebrow||'Spiritual Journey Reflection'),h('h2',{},journey.heading||'Where are you on your spiritual journey?'),h('p',{},journey.description||''),h('div',{className:'journey-benefits-card'},h('h3',{},journey.benefit_heading||'What you’ll receive in about five minutes'),h('div',{className:'benefit-grid'},...list(journey.benefit_items).slice(0,4).map((it,i)=>h('div',{key:i},h('b',{},'✓'),h('span',{},typeof it==='string'?it:(it.text||''))))),h('p',{className:'journey-reassurance'},journey.benefit_text||'')),h('span',{className:'button button-ivory journey-cta'},journey.cta_label||'Take the 5-Minute Spiritual Journey Reflection'))));

      const faqSection = h('section',{className:'warm-section section',key:'faq'},h('div',{className:'shell faq-shell'},h('div',{className:'section-heading centered'},h('p',{className:'eyebrow'},'QUESTIONS'),h('h2',{},'A few things people often ask.')),h('div',{className:'faq-list'},['Do I need to be a Christian?','What happens in a Circle?','Is there a cost?','Can I participate online?'].map((q,i)=>h('details',{key:i},h('summary',{},q),h('p',{},'This section uses the protected live FAQ structure on the published site.'))))));

      return h('div',{className:'v8-home-launch v8-hierarchy-refinement'},heroSection,recognitionSection,practiceSection,differenceSection,findingSection,fitSection,founderSection,interestSection,journeySection,faqSection);
    }
  });

  const GenericPreview = createClass({render:function(){return h('div',{style:{padding:'40px',fontFamily:'Inter, Arial, sans-serif'}},h('p',{},'Use Homepage (V8) — USE THIS for the staging homepage preview.'));}});
  CMS.registerPreviewTemplate('v8_front_door', V8Preview);
  CMS.registerPreviewTemplate('v8', V8Preview);
  ['home','global','circles','practices','about','connect','vision','assessment'].forEach((name)=>CMS.registerPreviewTemplate(name,GenericPreview));
}());
