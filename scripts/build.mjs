import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const content = JSON.parse(await fs.readFile(path.join(root, 'content', 'home.json'), 'utf8'));
const globalCopy = JSON.parse(await fs.readFile(path.join(root, 'content', 'global.json'), 'utf8'));
const assessmentCopy = JSON.parse(await fs.readFile(path.join(root, 'content', 'assessment.json'), 'utf8'));
const advancedPagesDir = path.join(root, 'content', 'advanced-pages');
const readJson = async (name) => JSON.parse(await fs.readFile(path.join(root, 'content', `${name}.json`), 'utf8'));
const template = await fs.readFile(path.join(root, 'src', 'index.template.html'), 'utf8');

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const richText = (value = '') => escapeHtml(value).replaceAll('\n', '<br/>');
const inlineRichText = (value = '') => escapeHtml(value)
  .replaceAll('&lt;strong&gt;', '<strong>')
  .replaceAll('&lt;/strong&gt;', '</strong>')
  .replaceAll('&lt;em&gt;', '<em>')
  .replaceAll('&lt;/em&gt;', '</em>')
  .replaceAll('&lt;br&gt;', '<br>')
  .replaceAll('&lt;br/&gt;', '<br/>');
const paragraphRichText = (value = '') => String(value)
  .split(/\n\s*\n/)
  .map((paragraph) => paragraph.trim())
  .filter(Boolean)
  .map((paragraph) => `<p>${inlineRichText(paragraph).replaceAll('\n', '<br/>')}</p>`)
  .join('');
const attr = (value = '') => escapeHtml(value);
const escapeRegExp = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hiddenAttr = (section) => section?.enabled === false ? 'hidden' : '';

const buttonHtml = (label, url, classes = 'button', extra = '') => {
  const safeLabel = escapeHtml(label);
  if (String(url || '').toLowerCase() === 'calendar') {
    const eventAttribute = String(extra).includes('data-event=') ? '' : 'data-event="start_conversation_click"';
    return `<button class="${attr(classes)}" type="button" data-calendar-open ${eventAttribute} ${extra}>${safeLabel}</button>`;
  }
  return `<a class="${attr(classes)}" href="${attr(url || '#')}" ${extra}>${safeLabel}</a>`;
};

function replaceSectionCopy(html, sectionPattern, replacements) {
  return html.replace(sectionPattern, (section) => {
    let updated = section;
    for (const [from, to] of replacements) {
      const escaped = escapeRegExp(from);
      updated = updated.replace(new RegExp(`(>\\s*)${escaped}(\\s*<)`, 'g'), (_m, before, after) => `${before}${escapeHtml(to)}${after}`);
    }
    return updated;
  });
}

function applyGlobalCopy(html) {
  const g = globalCopy;
  let output = html;

  // Brand lockup and conversation labels are intentionally shared site-wide.
  output = output
    .replaceAll('A SPIRITUAL COMMUNITY', escapeHtml(g.brand.subline))
    .replaceAll('HOMEWARD', escapeHtml(g.brand.name))
    .replaceAll('Have a Conversation', escapeHtml(g.navigation.conversation))
    .replaceAll('Let’s Talk', escapeHtml(g.navigation.mobile_conversation))
    .replaceAll("I'm Interested", escapeHtml(g.navigation.interest));

  output = replaceSectionCopy(output, /<header\b[\s\S]*?<\/header>/gi, [
    ['Home', g.navigation.home], ['Circles', g.navigation.circles], ['Practices', g.navigation.practices],
    ['Journey', g.navigation.journey], ['Our Story', g.navigation.story],
  ]);
  output = replaceSectionCopy(output, /<footer\b[\s\S]*?<\/footer>/gi, [
    ['Explore', g.footer.explore_heading], ['Homeward Circles', g.footer.circles], ['Practices', g.footer.practices],
    ['Journey Reflection', g.footer.journey], ['Resources', g.footer.resources], ['Our Story', g.footer.story],
    ['Future Vision', g.footer.vision], ['Connect', g.footer.connect_heading],
    ["Tell Us You're Interested", g.footer.interest], [g.navigation.conversation, g.footer.conversation],
    ['Conversation Details', g.footer.conversation_details], ['Privacy', g.footer.privacy],
    ['Rooted in the life and way of Jesus, Homeward is open to all who genuinely seek God in love. We welcome faith, questions, hope, doubt, and uncertainty.', g.brand.footer_description],
    ['Journeying Toward God. Together.', g.brand.mission],
    ['© 2026 Homeward Community · Belong. Grow. Become.', g.brand.copyright],
  ]);
  output = replaceSectionCopy(output, /<aside\b[^>]*class=["'][^"']*interest-prompt[^"']*["'][\s\S]*?<\/aside>/gi, [
    ['Does Homeward resonate with you?', g.interest_prompt.heading],
    ['Let us know what interests you. No commitment required.', g.interest_prompt.text],
    [g.navigation.interest, g.interest_prompt.interest_button],
    [g.navigation.conversation, g.interest_prompt.conversation_button],
  ]);

  output = output
    .replaceAll('aria-label="Homeward interest invitation"', `aria-label="${attr(g.interest_prompt.aria_label)}"`)
    .replaceAll('aria-label="Dismiss"', `aria-label="${attr(g.interest_prompt.dismiss_label)}"`)
    .replaceAll('aria-label="Schedule a short Homeward conversation"', `aria-label="${attr(g.calendar.modal_label)}"`)
    .replaceAll('aria-label="Close calendar"', `aria-label="${attr(g.calendar.close_label)}"`)
    .replaceAll('aria-label="Future vision image viewer"', `aria-label="${attr(g.lightbox.dialog_label)}"`)
    .replaceAll('aria-label="Close image"', `aria-label="${attr(g.lightbox.close_label)}"`)
    .replaceAll('aria-label="Previous image"', `aria-label="${attr(g.lightbox.previous_label)}"`)
    .replaceAll('aria-label="Next image"', `aria-label="${attr(g.lightbox.next_label)}"`)
    .replaceAll('Enlarge image ↗', escapeHtml(g.lightbox.expand_label));
  output = output.replace(/href="https:\/\/calendly\.com\/s-pennington\/30-min-discovery-call"/g, `href="${attr(g.calendar.external_url)}"`);
  output = output.replace(/(?:data-src|src)="https:\/\/calendly\.com\/s-pennington\/30-min-discovery-call\?[^\"]*"/g, (m) => `${m.startsWith('data-src') ? 'data-src' : 'src'}="${attr(g.calendar.embed_url)}"`);
  output = output.replace(/title="Schedule a (?:short|30-minute) Homeward conversation"/g, `title="${attr(g.calendar.iframe_title)}"`);
  return output;
}

function applyAdvancedCopy(html, pageData) {
  let output = html;
  if (pageData?.meta_title) output = output.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageData.meta_title)}</title>`);
  if (Object.prototype.hasOwnProperty.call(pageData || {}, 'meta_description')) {
    // Match the description tag regardless of whether name or content appears first.
    output = output.replace(
      /<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i,
      `<meta name="description" content="${attr(pageData.meta_description)}"/>`,
    );
  }
  for (const block of pageData?.blocks || []) {
    const key = escapeRegExp(block.key);
    const pattern = new RegExp(`(<([a-zA-Z0-9:-]+)\\b[^>]*\\bdata-cms-key=["']${key}["'][^>]*>)[\\s\\S]*?(<\\/\\2>)`, 'i');
    output = output.replace(pattern, (_match, open, _tag, close) => `${open}${escapeHtml(block.value)}${close}`);
    if (Object.prototype.hasOwnProperty.call(block, 'url')) {
      const anchorPattern = new RegExp(`(<a\\b[^>]*\\bdata-cms-key=["']${key}["'][^>]*\\bhref=["'])[^"']*(["'])`, 'i');
      output = output.replace(anchorPattern, (_match, before, quote) => `${before}${attr(block.url)}${quote}`);
    }
  }
  return output.replace(/\sdata-cms-key=("[^"]*"|'[^']*')/g, '');
}


const analyticsTag = (() => {
  const isProduction = process.env.CONTEXT === 'production' || process.env.HOMEWARD_ENABLE_ANALYTICS === 'true';
  if (!isProduction) return '<!-- Analytics intentionally disabled for local, branch, and deploy-preview builds. -->';
  const id = process.env.HOMEWARD_GA_ID || 'G-EDK2LGMJZG';
  return `<!-- Google tag (gtag.js) -->\n  <script async src="https://www.googletagmanager.com/gtag/js?id=${attr(id)}"></script>\n  <script>\n    window.dataLayer = window.dataLayer || [];\n    function gtag(){dataLayer.push(arguments);}\n    gtag('js', new Date());\n    gtag('config', '${attr(id)}');\n  </script>`;
})();

const icons = {
  values: [
    '<svg viewBox="0 0 48 48"><path d="M8 23 24 9l16 14v17H28V29h-8v11H8Z"></path><path d="M18 40V27h12v13"></path></svg>',
    '<svg viewBox="0 0 48 48"><path d="M24 40V22"></path><path d="M24 27C16 27 10 21 10 13c8 0 14 6 14 14Z"></path><path d="M24 22c0-8 6-14 14-14 0 8-6 14-14 14Z"></path></svg>',
    '<svg viewBox="0 0 48 48"><path d="M24 41S8 32 8 19c0-6 4-10 10-10 4 0 6 2 6 5 0-3 3-5 7-5 6 0 10 4 10 10 0 13-17 22-17 22Z"></path></svg>'
  ],
  practices: {
    light: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="8"></circle><path d="M24 3v8M24 37v8M3 24h8M37 24h8M9 9l6 6M33 33l6 6M39 9l-6 6M15 33l-6 6"></path></svg>',
    breath: '<svg viewBox="0 0 48 48"><path d="M11 25c6-9 10-9 13 0s7 9 13 0"></path><path d="M11 17c6-7 10-7 13 0s7 7 13 0"></path><path d="M11 33c6-7 10-7 13 0s7 7 13 0"></path></svg>',
    maranatha: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16"></circle><path d="M24 10v28M16 18h16"></path></svg>',
    reading: '<svg viewBox="0 0 48 48"><path d="M9 8h23a7 7 0 0 1 7 7v25H16a7 7 0 0 1-7-7Z"></path><path d="M16 8v32M22 17h10M22 24h10"></path></svg>',
    reflection: '<svg viewBox="0 0 48 48"><path d="M10 11h28v28H10Z"></path><path d="M16 19h16M16 26h16M16 33h9"></path><path d="M16 7v8M32 7v8"></path></svg>',
    gratitude: '<svg viewBox="0 0 48 48"><path d="M24 39S10 31 10 20c0-5 4-9 9-9 3 0 5 2 5 5 0-3 3-5 6-5 5 0 9 4 9 9 0 11-15 19-15 19Z"></path><path d="M24 8v7M20.5 11.5h7"></path></svg>'
  }
};

const journeyBenefitItems = (items = []) => items.map((item) => `<li><span aria-hidden="true">✓</span><p>${escapeHtml(item)}</p></li>`).join('');

const questionHtml = content.recognition.questions.map((question, index) => `
      <div class="question-v4">
       <div class="question-icon">${index + 1}</div>
       <p>${escapeHtml(question)}</p>
      </div>`).join('');

const circlesStepsHtml = content.circles.steps.map((step, index) => `
       <div class="rhythm-card">
        <div class="rhythm-card-heading"><span>${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(step.title)}</h3></div>
        <p>${escapeHtml(step.description)}</p>
       </div>`).join('');

const valuesHtml = content.values.items.map((item, index) => `
      <div class="value-card reveal">
       <div aria-hidden="true" class="value-icon">${icons.values[index] || icons.values[0]}</div>
       <h3>${escapeHtml(item.title)}</h3>
       <p>${escapeHtml(item.description)}</p>
      </div>`).join('');

const practicesHtml = content.practices.items.filter((item) => item.show_on_homepage !== false).map((item) => `
      <article class="practice-card reveal">
       <div class="practice-icon">${icons.practices[item.key] || icons.practices.light}</div>
       <h3>${escapeHtml(item.title)}</h3>
       ${item.subtitle ? `<span class="practice-subtitle">${escapeHtml(item.subtitle)}</span>` : ''}
       <p>${escapeHtml(item.description)}</p>
      </article>`).join('');

const journeyStagesHtml = content.journey.stages.map((stage, index) => `
         <div class="stage">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <strong>${escapeHtml(stage.title)}</strong>
          <p>${escapeHtml(stage.description)}</p>
         </div>`).join('');

const rememberingItemsHtml = content.remembering.items.map((item, index) => {
  const symbols = ['◌', '✦', '○', '◇', '♡', '∞'];
  const safe = escapeHtml(item);
  const prefix = 'Remembering';
  const formatted = safe.startsWith(prefix)
    ? `<p><strong>${prefix}</strong>${safe.slice(prefix.length)}</p>`
    : `<p>${safe}</p>`;
  return `
         <li><span aria-hidden="true">${symbols[index] || '•'}</span>${formatted}</li>`;
}).join('');

async function embeddableAsset(value = '') {
  const source = String(value || '');
  if (!source || source.startsWith('data:') || /^https?:\/\//i.test(source)) return attr(source);
  const relativePath = source.replace(/^\/+/, '');
  const filePath = path.join(root, relativePath);
  try {
    const bytes = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.webp': 'image/webp',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
    };
    const mime = mimeTypes[extension] || 'application/octet-stream';
    return `data:${mime};base64,${bytes.toString('base64')}`;
  } catch {
    return attr(source.startsWith('/') ? source : `/${source}`);
  }
}

const rememberingCommunityImage = await embeddableAsset(content.remembering.community_image);

const founderParagraphsHtml = (content.founder.paragraphs || []).map((x) => `<p>${escapeHtml(x)}</p>`).join('');
const faqItemsHtml = (content.faq.items || []).map((x) => `<div class="faq-item"><button aria-expanded="false" class="faq-question">${escapeHtml(x.question)}<span class="faq-symbol">+</span></button><div class="faq-answer">${escapeHtml(x.answer)}</div></div>`).join('');
const homeVisionCards = (content.vision.items || []).map((x, index) => {
  const wide = index === 0 ? ' vision-feature-wide' : '';
  return `<article class="vision-feature${wide} reveal"><button class="vision-image-button" data-lightbox="${attr(x.image)}" data-title="${attr(x.lightbox_title)}" type="button"><img alt="${attr(x.alt)}" src="${attr(x.image)}"/><span class="image-expand">${escapeHtml(globalCopy.lightbox.expand_label)}</span></button><div class="vision-feature-copy"><span>${escapeHtml(x.label)}</span><h3>${escapeHtml(x.heading)}</h3><p>${escapeHtml(x.description)}</p></div></article>`;
});
const homeVisionItemsHtml = homeVisionCards.length
  ? `${homeVisionCards[0]}${homeVisionCards.length > 1 ? `<div class="vision-pair">${homeVisionCards.slice(1).join('')}</div>` : ''}`
  : '';

const replacements = {
  ANALYTICS_TAG: analyticsTag,
  META_TITLE: escapeHtml(content.meta.title), META_DESCRIPTION: attr(content.meta.description), OG_TITLE: attr(content.meta.og_title), OG_DESCRIPTION: attr(content.meta.og_description), OG_IMAGE: attr(content.meta.og_image),
  HERO_HEADLINE: escapeHtml(content.hero.headline),
  HERO_EMPHASIS: escapeHtml(content.hero.emphasis),
  HERO_DESCRIPTION: escapeHtml(content.hero.description),
  HERO_PRIMARY_LABEL: escapeHtml(content.hero.primary_label),
  HERO_PRIMARY_URL: attr(content.hero.primary_url),
  HERO_PRIMARY_HTML: buttonHtml(content.hero.primary_label, content.hero.primary_url, 'button', 'data-event="start_conversation_click"'),
  HERO_SECONDARY_LABEL: escapeHtml(content.hero.secondary_label),
  HERO_SECONDARY_URL: attr(content.hero.secondary_url),
  ROOTED_LINE: escapeHtml(content.rooted_line),
  RECOGNITION_HIDDEN: hiddenAttr(content.recognition),
  RECOGNITION_EYEBROW: escapeHtml(content.recognition.eyebrow),
  RECOGNITION_HEADING: escapeHtml(content.recognition.heading),
  RECOGNITION_INTRO: escapeHtml(content.recognition.intro),
  RECOGNITION_QUESTIONS_HTML: questionHtml,
  RECOGNITION_HONEST_LINE: escapeHtml(content.recognition.honest_line),
  RECOGNITION_CONVERSATION_HEADING: escapeHtml(content.recognition.conversation.heading), RECOGNITION_CONVERSATION_TEXT: escapeHtml(content.recognition.conversation.text), RECOGNITION_CONVERSATION_BUTTON: escapeHtml(content.recognition.conversation.button), RECOGNITION_CONVERSATION_BUTTON_HTML: buttonHtml(content.recognition.conversation.button, content.recognition.conversation.button_url, 'button', 'data-event="recognition_conversation_click"'),
  CIRCLES_HIDDEN: hiddenAttr(content.circles),
  CIRCLES_EYEBROW: escapeHtml(content.circles.eyebrow),
  CIRCLES_HEADING_HTML: `${escapeHtml(content.circles.heading_line1)}<br/><em>${escapeHtml(content.circles.heading_line2)}</em>`,
  CIRCLES_BADGE_HTML: `<span aria-hidden="true"></span>${escapeHtml(content.circles.badge)}`,
  CIRCLES_DESCRIPTION: paragraphRichText(content.circles.description),
  CIRCLES_DIFFERENTIATOR: escapeHtml(content.circles.differentiator_line || ''),
  CIRCLES_QUOTE: escapeHtml(content.circles.quote),
  CIRCLES_IMAGE: attr(content.circles.image),
  CIRCLES_STEPS_HTML: circlesStepsHtml,
  CIRCLES_PRIMARY_LABEL: escapeHtml(content.circles.primary_label),
  CIRCLES_PRIMARY_URL: attr(content.circles.primary_url),
  CIRCLES_SECONDARY_LABEL: escapeHtml(content.circles.secondary_label),
  CIRCLES_SECONDARY_URL: attr(content.circles.secondary_url),
  CIRCLES_CAPACITY_NOTE: escapeHtml(content.circles.capacity_note),
  CIRCLES_LOGISTICS_LINE: escapeHtml(content.circles.logistics_line),
  VIDEO_HIDDEN: content.video.enabled ? '' : 'hidden', VIDEO_EYEBROW: escapeHtml(content.video.eyebrow), VIDEO_HEADING: escapeHtml(content.video.heading), VIDEO_DESCRIPTION: escapeHtml(content.video.description), VIDEO_EMBED_URL: attr(content.video.embed_url), VIDEO_IFRAME_TITLE: attr(content.video.iframe_title),
  VALUES_HIDDEN: hiddenAttr(content.values),
  VALUES_EYEBROW: escapeHtml(content.values.eyebrow),
  VALUES_HEADING_HTML: richText(content.values.heading),
  VALUES_INTRO: escapeHtml(content.values.intro),
  VALUES_HTML: valuesHtml,
  PRACTICES_HIDDEN: hiddenAttr(content.practices),
  PRACTICES_EYEBROW: escapeHtml(content.practices.eyebrow),
  PRACTICES_HEADING: escapeHtml(content.practices.heading),
  PRACTICES_INTRO: escapeHtml(content.practices.intro),
  PRACTICES_HTML: practicesHtml,
  PRACTICES_MORE_HTML: content.practices.more_text ? `<p class="practice-more reveal">${escapeHtml(content.practices.more_text)}</p>` : '',
  PRACTICES_PRIMARY_LABEL: escapeHtml(content.practices.primary_label),
  PRACTICES_PRIMARY_URL: attr(content.practices.primary_url),
  PRACTICES_SECONDARY_LABEL: escapeHtml(content.practices.secondary_label),
  PRACTICES_SECONDARY_URL: attr(content.practices.secondary_url),
  JOURNEY_HIDDEN: hiddenAttr(content.journey),
  JOURNEY_EYEBROW: escapeHtml(content.journey.eyebrow),
  JOURNEY_HEADING: escapeHtml(content.journey.heading),
  JOURNEY_DESCRIPTION: escapeHtml(content.journey.description),
  JOURNEY_IMAGE: attr(content.journey.image),
  JOURNEY_STAGES_HTML: journeyStagesHtml,
  JOURNEY_BENEFIT_HEADING: escapeHtml(content.journey.benefit_heading),
  JOURNEY_BENEFIT_ITEMS_HTML: journeyBenefitItems(content.journey.benefit_items),
  JOURNEY_BENEFIT_TEXT: escapeHtml(content.journey.benefit_text),
  JOURNEY_CTA_LABEL: escapeHtml(content.journey.cta_label),
  JOURNEY_CTA_URL: attr(content.journey.cta_url),
  REMEMBERING_HIDDEN: hiddenAttr(content.remembering),
  REMEMBERING_EYEBROW: escapeHtml(content.remembering.eyebrow),
  REMEMBERING_HEADING_HTML: `${escapeHtml(content.remembering.heading)}<br/><em>${escapeHtml(content.remembering.emphasis)}</em>`,
  REMEMBERING_INTRO1: escapeHtml(content.remembering.intro1),
  REMEMBERING_INTRO2_HTML: escapeHtml(content.remembering.intro2).replace('remember what matters most', '<strong>remember what matters most</strong>'),
  REMEMBERING_ITEMS_HTML: rememberingItemsHtml,
  REMEMBERING_COMMUNITY_IMAGE: rememberingCommunityImage,
  REMEMBERING_WONDER_IMAGE: attr(content.remembering.wonder_image),
  REMEMBERING_WHY_HEADING: escapeHtml(content.remembering.why_heading),
  REMEMBERING_WHY_TEXT: escapeHtml(content.remembering.why_text),
  REMEMBERING_FOOTER_TEXT: escapeHtml(content.remembering.footer_text),
  REMEMBERING_PRIMARY_LABEL: escapeHtml(content.remembering.primary_label),
  REMEMBERING_PRIMARY_URL: attr(content.remembering.primary_url),
  REMEMBERING_SECONDARY_LABEL: escapeHtml(content.remembering.secondary_label),
  REMEMBERING_SECONDARY_URL: attr(content.remembering.secondary_url),
  FOUNDER_HIDDEN: hiddenAttr(content.founder),
  FOUNDER_EYEBROW: escapeHtml(content.founder.eyebrow), FOUNDER_HEADING: escapeHtml(content.founder.heading), FOUNDER_IMAGE: attr(content.founder.image), FOUNDER_IMAGE_ALT: attr(content.founder.image_alt), FOUNDER_PARAGRAPHS_HTML: founderParagraphsHtml, FOUNDER_DISCLAIMER: escapeHtml(content.founder.disclaimer), FOUNDER_BUTTON_LABEL: escapeHtml(content.founder.button_label), FOUNDER_BUTTON_URL: attr(content.founder.button_url),
  INTEREST_HIDDEN: hiddenAttr(content.interest),
  INTEREST_EYEBROW: escapeHtml(content.interest.eyebrow),
  INTEREST_HEADING: escapeHtml(content.interest.heading),
  INTEREST_DESCRIPTION: escapeHtml(content.interest.description),
  INTEREST_CALENDAR_HTML: `<h3>${escapeHtml(content.interest.calendar_heading)}</h3><p>${escapeHtml(content.interest.calendar_text)}</p>`,
  INTEREST_CALENDAR_BUTTON: escapeHtml(content.interest.calendar_button),
  INTEREST_CALENDAR_BUTTON_HTML: buttonHtml(content.interest.calendar_button, content.interest.calendar_button_url, 'button button-secondary', 'data-event="start_conversation_click"'),
  FORM_FIRST_NAME_LABEL: escapeHtml(content.interest.form.first_name_label), FORM_FIRST_NAME_PLACEHOLDER: attr(content.interest.form.first_name_placeholder), FORM_LAST_NAME_LABEL: escapeHtml(content.interest.form.last_name_label), FORM_LAST_NAME_PLACEHOLDER: attr(content.interest.form.last_name_placeholder), FORM_EMAIL_LABEL: escapeHtml(content.interest.form.email_label), FORM_EMAIL_PLACEHOLDER: attr(content.interest.form.email_placeholder), FORM_ZIP_LABEL: escapeHtml(content.interest.form.zip_label), FORM_ZIP_PLACEHOLDER: attr(content.interest.form.zip_placeholder), FORM_ZIP_HELP: escapeHtml(content.interest.form.zip_help), FORM_INTEREST_LABEL: escapeHtml(content.interest.form.interest_label), FORM_INTEREST_PLACEHOLDER: escapeHtml(content.interest.form.interest_placeholder), FORM_INTEREST_OPTION_1: escapeHtml(content.interest.form.interest_options[0]), FORM_INTEREST_OPTION_2: escapeHtml(content.interest.form.interest_options[1]), FORM_INTEREST_OPTION_3: escapeHtml(content.interest.form.interest_options[2]), FORM_INTEREST_OPTION_4: escapeHtml(content.interest.form.interest_options[3]), FORM_INTEREST_OPTION_5: escapeHtml(content.interest.form.interest_options[4]), FORM_GATHERING_LABEL: escapeHtml(content.interest.form.gathering_label), FORM_GATHERING_PLACEHOLDER: escapeHtml(content.interest.form.gathering_placeholder), FORM_GATHERING_OPTION_1: escapeHtml(content.interest.form.gathering_options[0]), FORM_GATHERING_OPTION_2: escapeHtml(content.interest.form.gathering_options[1]), FORM_GATHERING_OPTION_3: escapeHtml(content.interest.form.gathering_options[2]), FORM_GATHERING_OPTION_4: escapeHtml(content.interest.form.gathering_options[3]), FORM_OPTIONAL_LABEL: escapeHtml(content.interest.form.optional_label), FORM_DRAW_LABEL: escapeHtml(content.interest.form.draw_label), FORM_DRAW_PLACEHOLDER: attr(content.interest.form.draw_placeholder), FORM_NEWSLETTER_LABEL: escapeHtml(content.interest.form.newsletter_label), FORM_SUBMIT_BUTTON: escapeHtml(content.interest.form.submit_button), FORM_PRIVACY_NOTE: escapeHtml(content.interest.form.privacy_note), FORM_SUCCESS_HEADING: escapeHtml(content.interest.form.success_heading), FORM_SUCCESS_TEXT: escapeHtml(content.interest.form.success_text), FORM_SUCCESS_CALENDAR_BUTTON: escapeHtml(content.interest.form.success_calendar_button), FORM_SUCCESS_CALENDAR_BUTTON_HTML: buttonHtml(content.interest.form.success_calendar_button, content.interest.form.success_calendar_url, 'button'), FORM_SUCCESS_PRACTICE_BUTTON: escapeHtml(content.interest.form.success_practice_button), FORM_SUCCESS_PRACTICE_URL: attr(content.interest.form.success_practice_url),
  FINAL_HIDDEN: hiddenAttr(content.final),
  FINAL_EYEBROW: escapeHtml(content.final.eyebrow),
  FINAL_HEADING: escapeHtml(content.final.heading),
  FINAL_DESCRIPTION: escapeHtml(content.final.description),
  FAQ_HIDDEN: hiddenAttr(content.faq),
  FAQ_EYEBROW: escapeHtml(content.faq.eyebrow), FAQ_HEADING: escapeHtml(content.faq.heading), FAQ_ITEMS_HTML: faqItemsHtml,
  VISION_HIDDEN: hiddenAttr(content.vision),
  HOME_VISION_EYEBROW: escapeHtml(content.vision.eyebrow), HOME_VISION_HEADING: escapeHtml(content.vision.heading), HOME_VISION_DESCRIPTION: escapeHtml(content.vision.description), HOME_VISION_ITEMS_HTML: homeVisionItemsHtml, HOME_VISION_BUTTON_LABEL: escapeHtml(content.vision.button_label), HOME_VISION_BUTTON_URL: attr(content.vision.button_url), HOME_VISION_HELPER_TEXT: escapeHtml(content.vision.helper_text),
  FINAL_PRIMARY_HTML: buttonHtml(content.final.primary_label, content.final.primary_url), FINAL_SECONDARY_LABEL: escapeHtml(content.final.secondary_label), FINAL_SECONDARY_URL: attr(content.final.secondary_url),
};

function applyReplacements(source, map) {
  let output = source;
  for (const [key, value] of Object.entries(map)) {
    output = output.replaceAll(`{{${key}}}`, value);
  }
  const unresolved = [...output.matchAll(/{{[A-Z0-9_]+}}/g)].map((match) => match[0]);
  if (unresolved.length) throw new Error(`Unresolved template markers: ${[...new Set(unresolved)].join(', ')}`);
  return output;
}

function stripAnalytics(html) {
  return html
    .replace(/\s*<!-- Google tag \(gtag\.js\) -->[\s\S]*?gtag\('config',\s*'[^']+'\);[\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script[^>]*src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]+"[^>]*><\/script>[\s\S]*?gtag\('config',\s*'[^']+'\);[\s\S]*?<\/script>/gi, '');
}

function injectHead(html, snippet) {
  if (!snippet || html.includes('googletagmanager.com')) return html;
  return html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}\n  ${snippet}`);
}

function injectIdentityRedirect(html) {
  if (html.includes('identity-redirect.js')) return html;
  return html.replace(/<\/body>/i, '  <script src="/identity-redirect.js" defer></script>\n </body>');
}

function makeRootPagePortable(html, pageName) {
  if (pageName !== 'resources.html') return html;
  const routeMap = new Map([
    ['/', 'index.html'],
    ['/circles', 'circles.html'],
    ['/practices', 'practices.html'],
    ['/#journey', 'index.html#journey'],
    ['/about', 'about.html'],
    ['/#interest', 'index.html#interest'],
    ['/resources', 'resources.html'],
    ['/vision', 'vision.html'],
    ['/connect', 'connect.html'],
    ['/privacy.html', 'privacy.html'],
    ['/practice-remembering', 'practice-remembering.html'],
    ['/practice-honest-prayer', 'practice-honest-prayer.html'],
    ['/practice-breath.html', 'practice-breath.html'],
    ['/practice-inspired-reading', 'practice-inspired-reading.html'],
    ['/practice-daily-reflection', 'practice-daily-reflection.html'],
    ['/practice-contemplative-presence', 'practice-contemplative-presence.html'],
    ['/journey/inherited-faith', 'journey-inherited-faith.html'],
    ['/journey/honest-questions', 'journey-honest-questions.html'],
    ['/journey/sacred-search', 'journey-sacred-search.html'],
    ['/journey/new-foundations', 'journey-new-foundations.html'],
    ['/journey/embodied-faith', 'journey-embodied-faith.html'],
    ['/journey/living-awake', 'journey-living-awake.html'],
  ]);
  let output = html
    .replaceAll('href="/styles.css"', 'href="styles.css"')
    .replaceAll('href="/sacred-search.css"', 'href="sacred-search.css"')
    .replaceAll('href="/assets/', 'href="assets/')
    .replaceAll('src="/assets/', 'src="assets/')
    .replaceAll('src="/script.js"', 'src="script.js"')
    .replaceAll('src="/journey-explorer.js"', 'src="journey-explorer.js"')
    .replaceAll('src="/identity-redirect.js"', 'src="identity-redirect.js"');
  for (const [from, to] of routeMap) output = output.replaceAll(`href="${from}"`, `href="${to}"`);
  return output;
}

async function copyRecursive(src, dest) {
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    for (const entry of await fs.readdir(src)) {
      await copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
  }
}

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

let homeHtml = applyReplacements(template, replacements);
homeHtml = applyGlobalCopy(homeHtml);
homeHtml = injectIdentityRedirect(homeHtml);
await fs.writeFile(path.join(dist, 'index.html'), homeHtml);


const listItems = (items = []) => items.map((item) => `<li>${item}</li>`).join('');
const pageData = {
  circles: await readJson('circles'),
  practices: await readJson('practices'),
  about: await readJson('about'),
  connect: await readJson('connect'),
  vision: await readJson('vision'),
};


const circleDistinctivesHtml = (items = []) => items.map((item, index) => `
      <article class="circle-distinctive-card reveal">
       <span class="circle-distinctive-number">${String(index + 1).padStart(2, '0')}</span>
       <h3>${escapeHtml(item.title)}</h3>
       <p>${escapeHtml(item.description)}</p>
      </article>`).join('');

const circlePracticeStepsHtml = (items = []) => items.map((item, index) => `
        <li>
         <span>${String(index + 1).padStart(2, '0')}</span>
         <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p></div>
        </li>`).join('');

const pageReplacementMaps = {
  circles: (d) => ({
    META_TITLE: escapeHtml(d.meta.title), META_DESCRIPTION: attr(d.meta.description), OG_TITLE: attr(d.meta.og_title || d.meta.title), OG_DESCRIPTION: attr(d.meta.og_description || d.meta.description), OG_IMAGE: attr(d.meta.og_image || 'assets/hero-community.jpg'),
    HERO_EYEBROW: escapeHtml(d.hero.eyebrow), HERO_HEADING: escapeHtml(d.hero.heading), HERO_LEAD: inlineRichText(d.hero.lead), HERO_LOGISTICS: escapeHtml(d.hero.logistics || ""), HERO_PRIMARY: escapeHtml(d.hero.primary), HERO_SECONDARY: escapeHtml(d.hero.secondary), HERO_PRIMARY_URL: attr(d.hero.primary_url), HERO_SECONDARY_URL: attr(d.hero.secondary_url),
    HEART_IMAGE: attr(d.heart.image), HEART_IMAGE_ALT: attr(d.heart.image_alt), HEART_CAPTION: escapeHtml(d.heart.caption), HEART_EYEBROW: escapeHtml(d.heart.eyebrow), HEART_HEADING: escapeHtml(d.heart.heading), HEART_LEAD: escapeHtml(d.heart.lead), HEART_BODY: escapeHtml(d.heart.body), HEART_URGENCY_HEADING: escapeHtml(d.heart.urgency_heading), HEART_URGENCY_TEXT: escapeHtml(d.heart.urgency_text), HEART_PRIMARY: escapeHtml(d.heart.primary), HEART_SECONDARY: escapeHtml(d.heart.secondary), HEART_PRIMARY_URL: attr(d.heart.primary_url), HEART_SECONDARY_HTML: buttonHtml(d.heart.secondary, d.heart.secondary_url, 'button button-secondary'),
    DISTINCTIVES_HIDDEN: hiddenAttr(d.distinctives), DISTINCTIVES_EYEBROW: escapeHtml(d.distinctives?.eyebrow), DISTINCTIVES_HEADING: escapeHtml(d.distinctives?.heading), DISTINCTIVES_INTRO: escapeHtml(d.distinctives?.intro), DISTINCTIVES_HTML: circleDistinctivesHtml(d.distinctives?.items),
    RHYTHM_EYEBROW: escapeHtml(d.rhythm.eyebrow), RHYTHM_HEADING: escapeHtml(d.rhythm.heading), RHYTHM_INTRO: escapeHtml(d.rhythm.intro), RHYTHM_HTML: d.rhythm.steps.map((x,i)=>`<div class="rhythm-card"><div class="rhythm-card-heading"><span>${String(i+1).padStart(2,'0')}</span><h3>${escapeHtml(x.title)}</h3></div><p>${escapeHtml(x.description)}</p></div>`).join(''),
    PRACTICE_EXAMPLE_HIDDEN: hiddenAttr(d.practice_example), PRACTICE_EXAMPLE_EYEBROW: escapeHtml(d.practice_example?.eyebrow), PRACTICE_EXAMPLE_HEADING: escapeHtml(d.practice_example?.heading), PRACTICE_EXAMPLE_LEAD: escapeHtml(d.practice_example?.lead), PRACTICE_EXAMPLE_STEPS_HTML: circlePracticeStepsHtml(d.practice_example?.steps), PRACTICE_EXAMPLE_CLOSING: escapeHtml(d.practice_example?.closing), PRACTICE_EXAMPLE_BUTTON_HTML: buttonHtml(d.practice_example?.button, d.practice_example?.button_url, 'button button-secondary'),
    SAMPLE_EYEBROW: escapeHtml(d.sample.eyebrow), SAMPLE_HEADING: escapeHtml(d.sample.heading), SAMPLE_INTRO: escapeHtml(d.sample.intro), SAMPLE_WEEK: escapeHtml(d.sample.week), SAMPLE_TITLE: escapeHtml(d.sample.title), SAMPLE_DESCRIPTION: escapeHtml(d.sample.description), SESSION_HTML: d.sample.items.map(x=>`<div class="session-time">${escapeHtml(x.time)}</div><div class="session-content"><h4>${escapeHtml(x.title)}</h4>${x.questions?`<ul>${listItems(x.questions.map(inlineRichText))}</ul>`:`<p>${inlineRichText(x.body)}</p>`}</div>`).join(''),
    FIT_EYEBROW: escapeHtml(d.fit.eyebrow), FIT_HEADING: escapeHtml(d.fit.heading), FIT_CARD_HEADING: escapeHtml(d.fit.fit_heading), FIT_ITEMS_HTML: listItems(d.fit.fit_items.map(escapeHtml)), NOT_CARD_HEADING: escapeHtml(d.fit.not_heading), NOT_ITEMS_HTML: listItems(d.fit.not_items.map(escapeHtml)),
    FINAL_EYEBROW: escapeHtml(d.final.eyebrow), FINAL_HEADING: escapeHtml(d.final.heading), FINAL_LEAD: escapeHtml(d.final.lead), FINAL_PRIMARY: escapeHtml(d.final.primary), FINAL_SECONDARY: escapeHtml(d.final.secondary), FINAL_PRIMARY_URL: attr(d.final.primary_url), FINAL_SECONDARY_HTML: buttonHtml(d.final.secondary, d.final.secondary_url, 'button button-secondary'),
  }),
  practices: (d) => ({
    META_TITLE: escapeHtml(d.meta.title), META_DESCRIPTION: attr(d.meta.description), OG_TITLE: attr(d.meta.og_title), OG_DESCRIPTION: attr(d.meta.og_description), OG_IMAGE: attr(d.meta.og_image),
    HERO_EYEBROW: escapeHtml(d.hero.eyebrow), HERO_HEADING: escapeHtml(d.hero.heading), HERO_LEAD: escapeHtml(d.hero.lead), HERO_PRIMARY: escapeHtml(d.hero.primary), HERO_SECONDARY: escapeHtml(d.hero.secondary), HERO_PRIMARY_URL: attr(d.hero.primary_url), HERO_SECONDARY_URL: attr(d.hero.secondary_url),
    INTRO_EYEBROW: escapeHtml(d.intro.eyebrow), INTRO_HEADING: escapeHtml(d.intro.heading), INTRO_LEAD: escapeHtml(d.intro.lead),
    PRACTICES_HTML: d.items.map(x=>`<article class="practice-detail reveal" id="${attr(x.id)}"><div class="tradition">${escapeHtml(x.tradition)}</div><h3>${escapeHtml(x.title)}</h3><p>${x.description}</p><ol class="practice-steps">${listItems(x.steps)}</ol>${x.button?`<a class="button" href="${attr(x.button_url || 'practice-breath.html')}" data-event="practice_start">${escapeHtml(x.button)}</a>`:''}</article>`).join(''),
    FAQ_EYEBROW: escapeHtml(d.faq.eyebrow), FAQ_HEADING: escapeHtml(d.faq.heading), FAQ_ITEMS_HTML: d.faq.items.map(x=>`<div class="faq-item"><button class="faq-question" type="button" aria-expanded="false"><span>${escapeHtml(x.question)}</span><span class="faq-symbol">+</span></button><div class="faq-answer"><p>${escapeHtml(x.answer)}</p></div></div>`).join(''),
    COMMUNITY_EYEBROW: escapeHtml(d.community.eyebrow), COMMUNITY_HEADING: escapeHtml(d.community.heading), COMMUNITY_LEAD: escapeHtml(d.community.lead), COMMUNITY_PRIMARY: escapeHtml(d.community.primary), COMMUNITY_SECONDARY: escapeHtml(d.community.secondary), COMMUNITY_PRIMARY_URL: attr(d.community.primary_url), COMMUNITY_SECONDARY_URL: attr(d.community.secondary_url),
  }),
  about: (d) => ({
    META_TITLE: escapeHtml(d.meta.title), META_DESCRIPTION: attr(d.meta.description), OG_TITLE: attr(d.meta.og_title), OG_DESCRIPTION: attr(d.meta.og_description), OG_IMAGE: attr(d.meta.og_image),
    HERO_EYEBROW: escapeHtml(d.hero.eyebrow), HERO_HEADING: escapeHtml(d.hero.heading), HERO_LEAD: escapeHtml(d.hero.lead),
    ORIGIN_IMAGE: attr(d.origin.image), ORIGIN_IMAGE_ALT: attr(d.origin.image_alt), ORIGIN_CAPTION: escapeHtml(d.origin.caption), ORIGIN_EYEBROW: escapeHtml(d.origin.eyebrow), ORIGIN_HEADING: escapeHtml(d.origin.heading), ORIGIN_LEAD: escapeHtml(d.origin.lead), ORIGIN_PARAGRAPHS_HTML: d.origin.paragraphs.map(x=>`<p>${escapeHtml(x)}</p>`).join(''),
    FORMATION_EYEBROW: escapeHtml(d.formation.eyebrow), FORMATION_HEADING: escapeHtml(d.formation.heading), FORMATION_LEAD: escapeHtml(d.formation.lead), FORMATION_CARDS_HTML: d.formation.cards.map(c=>`<div class="compare-card reveal"><h3>${escapeHtml(c.title)}</h3><ul class="check-list">${listItems(c.items.map(escapeHtml))}</ul></div>`).join(''),
    COMMUNITY_EYEBROW: escapeHtml(d.community.eyebrow), COMMUNITY_HEADING: escapeHtml(d.community.heading), COMMUNITY_LEAD: escapeHtml(d.community.lead), COMMUNITY_BUTTON: escapeHtml(d.community.button), COMMUNITY_BUTTON_HTML: buttonHtml(d.community.button, d.community.button_url),
  }),
  connect: (d) => ({
    META_TITLE: escapeHtml(d.meta.title), META_DESCRIPTION: attr(d.meta.description), OG_TITLE: attr(d.meta.og_title), OG_DESCRIPTION: attr(d.meta.og_description), OG_IMAGE: attr(d.meta.og_image),
    HERO_EYEBROW: escapeHtml(d.hero.eyebrow), HERO_HEADING: escapeHtml(d.hero.heading), HERO_LEAD: escapeHtml(d.hero.lead), EXPECT_EYEBROW: escapeHtml(d.expect.eyebrow), EXPECT_HEADING: escapeHtml(d.expect.heading), EXPECT_ITEMS_HTML: listItems(d.expect.items.map(escapeHtml)), EXPECT_NOT_READY_HTML: `${escapeHtml(d.expect.not_ready.replace('Tell us you are interested instead.',''))}<a href="index.html#interest" style="color:var(--copper);font-weight:700">Tell us you are interested instead.</a>`, CALENDAR_EMBED_URL: attr(d.calendar.embed_url), CALENDAR_EXTERNAL_URL: attr(d.calendar.external_url), CALENDAR_IFRAME_TITLE: attr(d.calendar.iframe_title), CALENDAR_FALLBACK_TEXT: escapeHtml(d.calendar.fallback_text), CALENDAR_FALLBACK_LINK: escapeHtml(d.calendar.fallback_link),
  }),
  vision: (d) => ({
    META_TITLE: escapeHtml(d.meta.title), META_DESCRIPTION: attr(d.meta.description), OG_TITLE: attr(d.meta.og_title), OG_DESCRIPTION: attr(d.meta.og_description), OG_IMAGE: attr(d.meta.og_image),
    HERO_EYEBROW: escapeHtml(d.hero.eyebrow), HERO_HEADING: escapeHtml(d.hero.heading), HERO_LEAD: escapeHtml(d.hero.lead), VISION_ITEMS_HTML: d.items.map(x=>`<article class="vision-page-item reveal"><button class="vision-image-button vision-page-image" type="button" data-lightbox="${attr(x.image)}" data-title="${attr(x.lightbox_title)}"><img src="${attr(x.image)}" alt="${attr(x.alt)}"><span class="image-expand">Enlarge image ↗</span></button><div><p class="eyebrow">${escapeHtml(x.eyebrow)}</p><h2>${escapeHtml(x.heading)}</h2><p class="lead">${escapeHtml(x.lead)}</p></div></article>`).join(''), VISION_NOTE: escapeHtml(d.note),
  }),
};

const generatedPages = new Set();
for (const [name, data] of Object.entries(pageData)) {
  const source = await fs.readFile(path.join(root, 'src', 'pages', `${name}.template.html`), 'utf8');
  let html = applyReplacements(source, pageReplacementMaps[name](data));
  html = stripAnalytics(html);
  html = injectHead(html, analyticsTag);
  html = applyGlobalCopy(html);
  html = injectIdentityRedirect(html);
  await fs.writeFile(path.join(dist, `${name}.html`), html);
  generatedPages.add(`${name}.html`);
}

const advancedPages = new Map();
try {
  for (const file of await fs.readdir(advancedPagesDir)) {
    if (!file.endsWith('.json')) continue;
    const data = JSON.parse(await fs.readFile(path.join(advancedPagesDir, file), 'utf8'));
    if (data.source) advancedPages.set(data.source, data);
  }
} catch {}

const assessmentReplacements = {
  ASSESS_META_TITLE: escapeHtml(assessmentCopy.meta.title), ASSESS_META_DESCRIPTION: attr(assessmentCopy.meta.description), ASSESS_OG_TITLE: attr(assessmentCopy.meta.og_title), ASSESS_OG_DESCRIPTION: attr(assessmentCopy.meta.og_description), ASSESS_OG_IMAGE: attr(assessmentCopy.meta.og_image),
  ASSESS_BACK: escapeHtml(assessmentCopy.intro.back), ASSESS_EYEBROW: escapeHtml(assessmentCopy.intro.eyebrow), ASSESS_HEADING: escapeHtml(assessmentCopy.intro.heading), ASSESS_DESCRIPTION: escapeHtml(assessmentCopy.intro.description), ASSESS_INCLUSION_NOTE: escapeHtml(assessmentCopy.intro.inclusion_note), ASSESS_META_LINE: escapeHtml(assessmentCopy.intro.meta), ASSESS_START_BUTTON: escapeHtml(assessmentCopy.intro.button),
  ASSESS_BACK_BUTTON: escapeHtml(assessmentCopy.quiz.back), ASSESS_CONTINUE_BUTTON: escapeHtml(assessmentCopy.quiz.continue),
  ASSESS_MOVING_LABEL: escapeHtml(assessmentCopy.result.moving_label), ASSESS_SPIRAL_NOTE: escapeHtml(assessmentCopy.result.spiral_note), ASSESS_CAPTURE_HEADING: escapeHtml(assessmentCopy.result.capture_heading), ASSESS_CAPTURE_LEAD_BEFORE: escapeHtml(assessmentCopy.result.capture_lead_before), ASSESS_CAPTURE_LEAD_AFTER: escapeHtml(assessmentCopy.result.capture_lead_after), ASSESS_FIRST_PLACEHOLDER: attr(assessmentCopy.result.first_placeholder), ASSESS_EMAIL_PLACEHOLDER: attr(assessmentCopy.result.email_placeholder), ASSESS_NO_SPAM: escapeHtml(assessmentCopy.result.no_spam), ASSESS_SUBNOTE: escapeHtml(assessmentCopy.result.subnote), ASSESS_NEWSLETTER: escapeHtml(assessmentCopy.result.newsletter), ASSESS_SUBMIT: escapeHtml(assessmentCopy.result.submit), ASSESS_DONE_HEADING: escapeHtml(assessmentCopy.result.done_heading), ASSESS_DONE_TEXT: escapeHtml(assessmentCopy.result.done_text), ASSESS_ONLINE_BUTTON: escapeHtml(assessmentCopy.result.online_button), ASSESS_PDF_BUTTON: escapeHtml(assessmentCopy.result.pdf_button), ASSESS_SHARE: escapeHtml(assessmentCopy.result.share), ASSESS_INTEREST_BUTTON: escapeHtml(assessmentCopy.result.interest_button), ASSESS_ABOUT_BUTTON: escapeHtml(assessmentCopy.result.about_button), ASSESS_RETAKE_NOTE: escapeHtml(assessmentCopy.result.retake_note), ASSESS_RETAKE_BUTTON: escapeHtml(assessmentCopy.result.retake_button), ASSESS_COPY_JSON: JSON.stringify(assessmentCopy).replaceAll('<', '\\u003c'),
};

const rootFiles = await fs.readdir(root, { withFileTypes: true });
const skipNames = new Set(['dist', 'src', 'content', 'scripts', 'netlify', 'node_modules', '.git', '.gitignore', 'index.html', 'index.pretty.html', 'package.json', 'netlify.toml']);
for (const entry of rootFiles) {
  if (skipNames.has(entry.name) || generatedPages.has(entry.name)) continue;
  const source = path.join(root, entry.name);
  const destination = path.join(dist, entry.name);
  if (entry.name.endsWith('.md')) continue;
  if (entry.isDirectory()) {
    await copyRecursive(source, destination);
    continue;
  }
  if (entry.name.endsWith('.html')) {
    let html = await fs.readFile(source, 'utf8');
    if (entry.name === 'assessment.html') html = applyReplacements(html, assessmentReplacements);
    if (advancedPages.has(entry.name)) html = applyAdvancedCopy(html, advancedPages.get(entry.name));
    html = stripAnalytics(html);
    html = injectHead(html, analyticsTag);
    html = applyGlobalCopy(html);
    html = injectIdentityRedirect(html);
    html = makeRootPagePortable(html, entry.name);
    await fs.writeFile(destination, html);
  } else {
    await fs.copyFile(source, destination);
  }
}

const resourcesOutput = path.join(dist, 'resources.html');
const resourcesStat = await fs.stat(resourcesOutput).catch(() => null);
if (!resourcesStat || resourcesStat.size < 5000) {
  throw new Error('Resources page was not generated correctly.');
}

const buildMeta = {
  version: '7.1.0',
  builtAt: new Date().toISOString(),
  context: process.env.CONTEXT || 'local',
  analyticsEnabled: analyticsTag.includes('googletagmanager.com'),
};
await fs.writeFile(path.join(dist, 'build-meta.json'), JSON.stringify(buildMeta, null, 2));

/*
 * Keep the root-level generated preview synchronized with dist.
 * Netlify deploys dist/, but many collaborators open index.html directly
 * from the source package. Without this sync, the root preview can silently
 * remain on an older version even though the canonical dist build is current.
 */
for (const entry of await fs.readdir(dist, { withFileTypes: true })) {
  const source = path.join(dist, entry.name);
  const destination = path.join(root, entry.name);
  if (entry.isDirectory()) {
    await fs.cp(source, destination, { recursive: true, force: true });
  } else {
    await fs.copyFile(source, destination);
  }
}

console.log(`Built Homeward V7.1 into ${dist} and synchronized the root preview`);
