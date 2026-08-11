import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHomeV6 } from './render-v8-home-v6.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const v8 = JSON.parse(await fs.readFile(path.join(root, 'content', 'v8.json'), 'utf8'));

const extractSection = (html, id) => {
  const re = new RegExp(`<section\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>[\\s\\S]*?<\\/section>`, 'i');
  return html.match(re)?.[0] || '';
};

const markSection = (html, id) => html
  ? html.replace(/<section\b/i, `<section data-v8-section="${id}"`)
  : '';

const preferredRecognition = () => `
<section data-v8-section="recognition" class="v8-preferred-recognition">
  <div class="v8-pref-shell">
    <div class="v8-pref-recognition-head">
      <p class="v8-pref-eyebrow">THE INVITATION</p>
      <h2>Does any of this feel familiar?</h2>
      <p>Maybe you know a lot about spiritual life—or maybe you simply want something deeper. Either way, understanding faith and actually living it are not quite the same thing.</p>
    </div>
    <div class="v8-pref-recognition-grid">
      <article><span class="v8-pref-icon">?</span><p><strong>You still feel drawn to God—or to the life and way of Jesus—but carry questions or doubts you have never been able to resolve?</strong></p></article>
      <article><span class="v8-pref-icon">♡</span><p><strong>You long to experience God—or a Higher Power—more deeply, not simply gather more religious information?</strong></p></article>
      <article><span class="v8-pref-icon">☀</span><p><strong>You want spiritual practices that help you become more present, peaceful, loving, and awake in everyday life?</strong></p></article>
      <article><span class="v8-pref-icon">○</span><p><strong>You are looking for a community where people learn from one another without being required to reach all the same conclusions?</strong></p></article>
    </div>
    <p class="v8-pref-recognition-close">You do not need settled beliefs—only an honest desire to explore, practice, and grow.</p>
  </div>
</section>`;

const preferredPractices = () => `
<section data-v8-section="preferred_practices" class="v8-preferred-practices" id="home-practices">
  <div class="v8-pref-shell v8-pref-practice-grid">
    <div class="v8-pref-practice-copy">
      <p class="v8-pref-eyebrow">PRACTICES FOR THE MIND AND HEART</p>
      <h2>Ancient practices. Everyday change.</h2>
      <h3 class="v8-pref-practice-framing">Spiritual practices: exercises for the heart and mind.</h3>
      <p class="v8-pref-practice-lead">We exercise our bodies because strength does not appear simply because we understand it. Spiritual practices work in a similar way: repeated prayer, meditation, gratitude, Scripture, and reflection train attention, openness, presence, and love.</p>
      <p>The point is not to become good at meditation. The point is to become more present, peaceful, joyful, resilient, loving—and rooted in God.</p>
      <div class="v8-pref-benefit-grid">
        <div><strong>Less stress.<br>More steadiness.</strong></div>
        <div><strong>Better focus<br>&amp; clarity.</strong></div>
        <div><strong>More joy<br>&amp; happiness.</strong></div>
        <div><strong>More compassion<br>&amp; connection.</strong></div>
      </div>
      <div class="v8-pref-research-teaser">
        <span class="v8-pref-research-number">10</span>
        <div><b>MINUTES A DAY</b><p>One eight-week randomized trial found that a modest daily meditation rhythm reduced perceived stress. The broader research also points to benefits for attention, gratitude, well-being, and connection.</p></div>
      </div>
      <p class="v8-pref-research-note">Prayer is more than a wellness technique, and science cannot measure God. The Practices page shows the research carefully—and how Homeward brings these tools into a Jesus-centered spiritual life.</p>
      <div class="v8-pref-practice-actions"><a class="button" href="practices.html">Explore Practices + Research</a><a class="v8-pref-text-link" href="practices.html#practice-library">See the Practice Library →</a></div>
    </div>
    <div class="v8-pref-practice-collage" aria-label="Examples of Homeward spiritual practices">
      <figure><img src="/assets/review/practices/BP-A.jpg" alt="A quiet breath prayer practice"><figcaption><b>Breath Prayer</b><span>Presence · steadiness</span></figcaption></figure>
      <figure><img src="/assets/review/practices/BP-H.jpg" alt="A gratitude practice"><figcaption><b>Gratitude</b><span>Joy · appreciation</span></figcaption></figure>
      <figure><img src="/assets/review/practices/LC-B.jpg" alt="A Light of Christ meditation"><figcaption><b>Light of Christ</b><span>Love · connection</span></figcaption></figure>
      <figure><img src="/assets/review/practices/SE-G.jpg" alt="People gathered around Scripture"><figcaption><b>Scripture as Encounter</b><span>Wisdom · meaning</span></figcaption></figure>
    </div>
  </div>
</section>`;

export function renderHomePrimary(sourceHtml) {
  let html = renderHomeV6(sourceHtml);

  html = html.replace(/<section\b[^>]*data-v8-section=["']recognition["'][^>]*>[\s\S]*?<\/section>/i, preferredRecognition());

  const practicePattern = /<section\b[^>]*data-v8-section=["']practice_bridge["'][^>]*>[\s\S]*?<\/section>\s*<section\b[^>]*data-v8-section=["']gifts["'][^>]*>[\s\S]*?<\/section>(?:\s*<section\b[^>]*data-v8-section=["']practices_cta["'][^>]*>[\s\S]*?<\/section>)?/i;
  html = html.replace(practicePattern, preferredPractices());

  // Keep the legacy "We gather to remember" section available as a CMS/source toggle,
  // while leaving it hidden in the approved homepage hierarchy by default.
  const rememberingSetting = Array.isArray(v8.homepage?.section_order)
    ? v8.homepage.section_order.find((item) => item?.id === 'remembering')
    : null;

  if (rememberingSetting?.enabled !== true) return html;
  if (html.includes('data-v8-section="remembering"')) return html;

  const remembering = markSection(extractSection(sourceHtml, 'remembering'), 'remembering');
  if (!remembering) return html;

  const interestMarker = '<section data-v8-section="interest"';
  const index = html.indexOf(interestMarker);
  if (index >= 0) {
    html = `${html.slice(0, index)}${remembering}${html.slice(index)}`;
  } else {
    html = html.replace('</main>', `${remembering}</main>`);
  }
  return html;
}
