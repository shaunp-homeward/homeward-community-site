import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const approvedHomepage = readFileSync(path.join(root, 'content', 'homepage-concept-v1.html'), 'utf8');
const v8 = JSON.parse(readFileSync(path.join(root, 'content', 'v8.json'), 'utf8'));

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const enabled = (items = []) => Array.isArray(items) ? items.filter((item) => item && item.enabled !== false) : [];
const customMap = new Map((v8.homepage?.custom_sections || []).filter(Boolean).map((item) => [item.id, item]));
const sectionPattern = (className) => new RegExp(
  `<section\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/section>`,
  'i',
);
const replaceSection = (html, className, replacement) => html.replace(sectionPattern(className), replacement);
const getSection = (html, className) => html.match(sectionPattern(className))?.[0] || '';
const legacyOr = (value, legacyValue, launchValue) => {
  if (value == null || value === '' || value === legacyValue) return launchValue;
  return value;
};
const iconId = (name = '') => ({
  pin: 'i-location', location: 'i-location', wifi: 'i-wifi', person: 'i-person', heart: 'i-heart',
  coin: 'i-dollar', dollar: 'i-dollar', book: 'i-book', question: 'i-question', chat: 'i-chat',
  sunrise: 'i-sunrise', brain: 'i-brain', sun: 'i-sun', leaf: 'i-leaf', people: 'i-people',
  calendar: 'i-calendar', cross: 'i-cross',
}[name] || 'i-leaf');
const icon = (name) => `<svg><use href="#${iconId(name)}"/></svg>`;

const renderRecognition = () => {
  const r = v8.homepage?.recognition || {};
  const intro = legacyOr(
    r.intro,
    'Many of us have heard meaningful teachings about God, a Higher Power, love, and transformation. What we were missing was a way to practice them—and people to walk with us.',
    'Maybe you know a lot about spiritual life—or maybe you simply want something deeper. Either way, understanding faith and actually living it are not quite the same thing.',
  );
  const items = enabled(r.items);
  return `<section class="recognition section"><div class="shell narrow-wide"><div class="section-heading centered recognition-heading"><p class="eyebrow">${esc(r.eyebrow || 'The Invitation')}</p><h2>${esc(r.heading || 'Does any of this feel familiar?')}</h2><p>${esc(intro)}</p></div><div class="recognition-grid recognition-grid-four">${items.map((it)=>`<article>${icon(it.icon || 'question')}<p><strong>${esc(it.text || '')}</strong></p></article>`).join('')}</div><p class="recognition-close">${esc(r.honest_line || 'You do not need settled beliefs—only an honest desire to explore, practice, and grow.')}</p></div></section>`;
};

const renderPractices = () => {
  const p = v8.homepage?.practice_bridge || {};
  const g = v8.homepage?.gifts || {};
  const outcomes = enabled(p.outcome_items).slice(0,4);
  const gifts = enabled(g.items).slice(0,4);
  const heading = legacyOr(g.heading, 'Ancient practices. Everyday gifts.', 'Ancient practices. Everyday change.');
  const body = legacyOr(
    p.body,
    'We exercise our bodies to become stronger, healthier, and more capable. Spiritual practices train our inner life in much the same way—strengthening attention, opening the heart, and helping us return to God in the middle of ordinary life.\n\nOver time, the hope is a life marked by greater focus, more peace and steadiness, deeper connection, more joy and happiness, and a growing capacity to love and serve.\n\nModern research gives us another lens on the value of consistent practice: studies of meditation, gratitude, attention, and compassion suggest benefits for stress, focus, well-being, and connection. The deeper Christian aim is formation—becoming more available to God and love.',
    'We exercise our bodies because strength does not appear simply because we understand it. Spiritual practices work in a similar way: repeated prayer, meditation, gratitude, Scripture, and reflection train attention, openness, presence, and love.',
  );
  return `<section class="home-practices section" id="home-practices"><div class="shell practices-home-grid"><div class="practices-home-copy"><p class="eyebrow">PRACTICES FOR THE MIND AND HEART</p><h2>${esc(heading)}</h2><p class="practices-subhead"><strong>Spiritual practices: exercises for the heart and mind.</strong></p><p class="practices-lead">${esc(body)}</p><p>The point is not to become good at meditation. The point is to become more present, peaceful, joyful, resilient, loving—and rooted in God.</p><div class="practice-benefit-grid">${outcomes.map((it)=>`<div>${icon(it.icon || 'heart')}<strong>${esc(it.label || '')}<br/>${esc(it.detail || '')}</strong></div>`).join('')}</div><div class="research-teaser"><span class="research-number">10</span><div><b>MINUTES A DAY</b><p>One eight-week randomized trial found that a modest daily meditation rhythm reduced perceived stress. The broader research also points to benefits for attention, gratitude, well-being, and connection.</p></div></div><p class="research-note">Prayer is more than a wellness technique, and science cannot measure God. The Practices page shows the research carefully—and how Homeward brings these tools into a Jesus-centered spiritual life.</p><div class="practice-cta-row"><a class="button button-copper" href="practices.html">Explore Practices + Research</a><a class="text-link" href="practices.html#practice-library">See the Practice Library <span>→</span></a></div></div><div class="practice-collage">${gifts.map((it,index)=>`<figure class="practice-tile tile-${String.fromCharCode(97+index)}"><img src="${esc(it.image || '')}" alt="${esc(it.image_alt || '')}"/><figcaption><b>${esc(it.title || '')}</b><span>${esc(it.description || '')}</span></figcaption></figure>`).join('')}</div></div></section>`;
};

const renderDifference = () => {
  const d = v8.homepage?.difference || {};
  const heading = legacyOr(d.heading, 'A Circle is different.', 'Not just another small group. A place to practice.');
  const pillars = [
    { icon: 'leaf', title: 'Practice together', description: 'Meditation, prayer, Scripture, silence, gratitude, and reflection—guided, not just discussed.' },
    { icon: 'chat', title: 'Explore honestly', description: 'Speak from experience. Listen without fixing. Questions are welcome; agreement is not required.' },
    { icon: 'calendar', title: 'Carry it into life', description: 'Try the practice in ordinary life, notice what changes, then return and reflect together.' },
  ];
  return `<section class="circle-different section" id="circle-difference"><div class="shell narrow-wide"><div class="section-heading centered circle-different-heading"><p class="eyebrow">${esc(d.eyebrow || 'Not Your Ordinary Small Group')}</p><h2>${esc(heading)}</h2><p class="circle-subhead">A Circle is a guided community of practice—not a class and not a debate.</p></div><div class="circle-icon-grid v9-circle-grid">${pillars.map((it)=>`<article>${icon(it.icon)}<h3>${esc(it.title)}</h3><p>${esc(it.description)}</p></article>`).join('')}</div><div class="circle-different-note"><p>Rooted in Jesus, Homeward adds another layer to meaningful friendship and Scripture: <strong>guided practice, lived experience, and a rhythm that continues between gatherings.</strong></p><p class="circle-signature">${esc(d.signature || 'Practice the way. Explore honestly. Carry it into life.')}</p><a class="button button-outline circle-page-cta" href="circles.html">See How Circles Work</a></div></div></section>`;
};

const renderFinding = () => {
  const f = v8.homepage?.finding_home || {};
  const logistics = enabled(f.logistics);
  return `<section class="season-wrap section-tight"><div class="shell"><div class="season-card v9-season-card"><div class="season-intro v9-season-intro"><div class="season-art"><img src="/assets/homepage-finding-home-emblem.svg" alt=""/></div><div><p class="eyebrow">${esc(legacyOr(f.eyebrow, 'SEASON ONE · FALL 2026', 'YOUR FIRST SEASON · FALL 2026'))}</p><h2>${esc(f.title || 'Finding Home')}</h2><p class="season-tagline">A four-week beginning. An ongoing community.</p><p class="v9-season-lead">Finding Home is the first four-week season of Homeward Circles—a simple way to experience the rhythm before deciding whether you want to continue. You’ll practice together, engage Scripture reflectively, share honestly, and carry simple practices into everyday life.</p></div></div><p class="season-reassurance v9-season-reassurance">Four weeks is a beginning, not a graduation. We guide you through the details inside the Circle; if the experience is life-giving, future seasons deepen the practices and relationships.</p><div class="season-facts v9-season-facts">${logistics.map((it)=>`<div class="fact">${icon(it.icon || 'calendar')}<div><strong>${esc(it.label || '')}</strong><small>${esc(it.detail || '')}</small></div></div>`).join('')}<p class="season-availability"><strong>${esc(f.availability || 'Evening Circles are forming now.')}</strong> Exact days and times will be shared as groups form.</p></div><div class="season-learn-more"><a class="text-link" href="circles.html">Learn more about Finding Home and Circles <span>→</span></a></div></div></div></section>`;
};

const renderFounder = () => {
  const f = v8.homepage?.founder || {};
  const heading = legacyOr(f.heading, 'Why Homeward exists.', 'I came home with practices. I didn’t have people to practice with.');
  return `<section class="founder founder-feature section" id="founder"><div class="shell founder-row"><div class="founder-image"><img src="${esc(f.image || '/assets/founder-headshot.jpg')}" alt="${esc(f.image_alt || 'Shaun, founder of Homeward')}"/></div><div class="founder-copy"><p class="eyebrow">WHY HOMEWARD EXISTS</p><h2>${esc(heading)}</h2><p>${esc(f.body || '')}</p><p class="founder-trust">Religious Studies + Anthropology · decades of contemplative practice · husband, father, and business leader</p><a class="text-link" href="about.html">Read Shaun’s Story <span>→</span></a></div></div></section>`;
};

const renderInterest = () => {
  const j = customMap.get('join_process') || {};
  const items = enabled(j.items);
  const joinItems = items.length ? items : [
    { title: 'Tell us you’re interested.', body: 'Complete a short form. It takes a couple of minutes and there is no commitment.' },
    { title: 'Have a short conversation.', body: 'Ask questions, hear what a Circle feels like, and tell us what you’re looking for.' },
    { title: 'We’ll help find your Circle.', body: 'We’ll look at location, schedule, online or in-person format, and fit.' },
  ];
  return `<section class="interest section v9-interest" id="interest"><div class="shell"><div class="interest-join"><div class="section-heading centered"><p class="eyebrow">CURIOUS ABOUT A CIRCLE?</p><h2>Here’s what happens if you want to explore one.</h2><p>Sharing interest is not a commitment. We start with a real conversation.</p></div><div class="join-grid v9-join-grid">${joinItems.slice(0,3).map((it,index)=>`<article><span class="join-number">${String(index+1).padStart(2,'0')}</span><h3>${esc(String(it.title || '').replace(/^[0-9]+[.]\s*/,''))}</h3><p>${esc(it.body || it.description || '')}</p></article>`).join('')}</div></div><div class="interest-grid"><div class="interest-copy"><p class="eyebrow">START WHERE YOU ARE</p><h2>Tell us what interests you.</h2><p>Maybe you’re curious about a Circle, want to explore the practices, or would rather begin with a conversation. Raise your hand here and we’ll follow up personally—no pressure and no assumption that you are signing up for anything.</p><div class="interest-note"><strong>Prefer to talk first?</strong><p>Have a short conversation about Homeward. No pressure, no pitch—just a chance to ask questions and see what feels useful.</p><a class="text-link" href="connect.html">Have a Short Conversation <span>→</span></a></div></div><form class="interest-form" id="interest-form"><input type="hidden" name="form_type" value="interest"/><input type="hidden" name="landing_page" id="landing-page-field" value=""/><input type="hidden" name="referrer" id="referrer-field" value=""/><div class="form-row"><label>First name<input name="firstName" required/></label><label>Last name<input name="lastName" required/></label></div><label>Email<input name="email" type="email" required/></label><label>What are you interested in?<select name="interest" required><option value="" selected disabled>Select an option</option><option>I'm interested in joining a Circle</option><option>I'd like to learn more about Homeward</option><option>I'm interested in spiritual practices and resources</option><option>I'm not sure — let's start with a conversation</option></select></label><div class="form-row"><label>ZIP code<input name="zip"/></label><label>If you join a Circle, what format could work?<select name="gathering_preference"><option value="" selected>Select an option</option><option>In person in Fort Worth</option><option>Online</option><option>Either in person in Fort Worth or online</option><option>Not sure — let's start with a conversation</option></select></label></div><label>What are you hoping to find?<textarea name="draw" rows="4" placeholder="A deeper connection with God, community, honest conversation, practices for everyday life..."></textarea></label><label class="checkbox"><input name="newsletter" type="checkbox" value="yes"/><span>Keep me updated about upcoming Circles and Homeward resources.</span></label><button class="button button-copper form-submit" type="submit">Share My Interest</button><p class="form-privacy">No spam. No pressure. We’ll only use this information to follow up about Homeward.</p><p class="form-message" role="status" aria-live="polite" hidden></p></form></div></div></section>`;
};

const renderJourney = () => {
  const j = v8.homepage?.journey || {};
  const benefits = (j.benefit_items || []).slice(0,4).map((item)=>typeof item === 'string' ? item : item?.text || '');
  return `<section class="journey" id="journey"><div class="shell journey-grid"><div class="journey-art">${j.image ? `<img src="${esc(j.image)}" alt="A spiral illustrating recurring movements in the spiritual journey"/>` : ''}</div><div class="journey-copy"><p class="eyebrow gold">${esc(j.eyebrow || 'Spiritual Journey Reflection')}</p><h2>${esc(j.heading || 'Where are you on your spiritual journey?')}</h2><p>${esc(j.description || '')}</p><div class="journey-benefits-card"><h3>${esc(j.benefit_heading || 'What you’ll receive in about five minutes')}</h3><div class="benefit-grid">${benefits.map((x)=>`<div><b>✓</b><span>${esc(x)}</span></div>`).join('')}</div><p class="journey-reassurance">${esc(j.benefit_text || '')}</p></div><a class="button button-ivory journey-cta" href="${esc(j.cta_url || 'assessment.html')}">${esc(j.cta_label || 'Take the 5-Minute Spiritual Journey Reflection')}</a></div></div></section>`;
};

const reorderHomepage = (html) => {
  const ordered = [
    'hero',
    'recognition',
    'home-practices',
    'circle-different',
    'season-wrap',
    'fit',
    'founder-feature',
    'interest',
    'journey',
    'faq',
  ].map((className) => getSection(html, className)).filter(Boolean);
  return html.replace(/<main id="top">[\s\S]*?<\/main>/i, `<main id="top">\n${ordered.join('\n')}\n</main>`);
};

export function renderHomeConceptV1(_sourceHtml) {
  let html = approvedHomepage;

  if (!html.includes('/assets/homepage-concept-v1-polish.css')) {
    html = html.replace('</head>', '<link href="/assets/homepage-concept-v1-polish.css?v=6" rel="stylesheet"/>\n</head>');
  }
  if (!html.includes('/assets/v8-launch-image-qa.css')) {
    html = html.replace('</head>', '<link href="/assets/v8-launch-image-qa.css?v=2" rel="stylesheet"/>\n</head>');
  }
  if (!html.includes('/assets/homepage-v8-hierarchy-refinement.css')) {
    html = html.replace('</head>', '<link href="/assets/homepage-v8-hierarchy-refinement.css?v=3" rel="stylesheet"/>\n</head>');
  }

  html = html.replace('<body>', '<body class="v8-home-launch v8-hierarchy-refinement">');
  html = replaceSection(html, 'recognition', renderRecognition());
  html = replaceSection(html, 'home-practices', renderPractices());
  html = replaceSection(html, 'circle-different', renderDifference());
  html = replaceSection(html, 'season-wrap', renderFinding());
  html = replaceSection(html, 'join-path', '');
  html = replaceSection(html, 'founder-feature', renderFounder());
  html = replaceSection(html, 'interest', renderInterest());
  html = replaceSection(html, 'journey', renderJourney());

  html = reorderHomepage(html);
  html = html.replace(/<a class="mobile-sticky"[\s\S]*?<\/a>/, '');

  const imageMap = new Map([
    ['/assets/review/practices/BP-A.jpg', '/assets/living-awake/contemplative-room.webp'],
    ['/assets/review/practices/BP-H.jpg', '/assets/sacred-search/path-sunrise.webp'],
    ['/assets/review/practices/LC-B.jpg', '/assets/honest-questions/opening-light.webp'],
    ['/assets/review/practices/LC-F.jpg', '/assets/honest-questions/opening-light.webp'],
    ['/assets/review/practices/SE-G.jpg', '/assets/new-foundations/quiet-reading-room.webp'],
  ]);
  for (const [from, to] of imageMap) html = html.replaceAll(from, to);

  return html;
}
