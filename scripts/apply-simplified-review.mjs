import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const branch = process.env.BRANCH || '';
const context = process.env.CONTEXT || 'local';
const reviewBranch = 'staging-simplified-home-story-2026-10-07';
// Defense in depth: this overlay must never run in a production build.
if (context === 'production' || (context !== 'local' && branch !== reviewBranch)) {
  console.log('Simplified review overlay skipped outside its staging branch.');
} else {
  const banner = '<div class="hs-review-banner" role="note">Staging review · Simplified Homeward pages · Production is unchanged · Interest form is a preview</div>';
  const descriptions = {
    'index.html': 'Homeward helps existing Christian groups deepen their life with God through a four-week group experience or three-session Sacred Listening workshop.',
    'about.html': 'Shaun Pennington’s journey of contemplative practice and returning to Jesus, and the story behind Homeward’s work with existing Christian groups.',
  };
  for (const [page, source] of [['index.html', 'simplified-home.html'], ['about.html', 'simplified-story.html']]) {
    const target = path.join(root, 'dist', page);
    let html = await fs.readFile(target, 'utf8');
    const main = await fs.readFile(path.join(root, 'content', source), 'utf8');
    html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
    // Remove obsolete page-specific overlays; retain canonical shared navigation.
    html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
    html = html.replace(/<link\b[^>]*href=["'][^"']*(?:homepage-concept|v8-home|v8-about|v9-multiplier|homeward-group-experience|sacred-listening-preview)[^"']*["'][^>]*>/gi, '');
    html = html.replace(/<script\b[^>]*src=["'][^"']*(?:homepage-concept-v1|v9-partner-form)[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<meta\b(?=[^>]*(?:name=["']description["']|property=["']og:description["']))[^>]*>/gi, (tag) => tag.replace(/content=["'][^"']*["']/i, `content="${descriptions[page]}"`));
    html = html.replace('</head>', '<meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="/assets/simplified-review.css?v=1"></head>');
    html = html.replace(/<body\b[^>]*>/i, '<body class="simplified-review">' + banner);
    html = html.replace(/<aside\b[^>]*id=["']interestPrompt["'][^>]*>[\s\S]*?<\/aside>/gi, '');
    // Keep deeper material in its own pages; simplify the footer on this review.
    html = html.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/i, `<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><strong>HOMEWARD</strong><p>Journeying Toward God. Together.</p><p>Belong. Grow. Become.</p></div><nav class="footer-nav" aria-label="Explore"><a href="/circles.html">For Groups</a><a href="/sacred-listening.html">Sacred Listening</a><a href="/practices.html">Practices</a><a href="/about.html">Our Story</a></nav><nav class="footer-nav" aria-label="Connect"><a href="/#interest">Let’s Talk About Your Group</a><a href="/privacy.html">Privacy</a></nav></div><div class="footer-bottom">© 2026 Homeward</div></div></footer>`);
    html = html.replace(/href=["']\/#journey["']/g, 'href="/assessment.html"');
    html = html.replace(/<header\b[^>]*>[\s\S]*?<\/header>/i, header => header.replace(/(<a\b[^>]*href=["']\/circles\.html["'][^>]*>)[\s\S]*?(<\/a>)/g, '$1For Groups$2'));
    html = html.replace('</body>', '<script src="/assets/simplified-review.js" defer></script></body>');
    await fs.writeFile(target, html);
  }
  for (const name of ['simplified-review.css', 'simplified-review.js']) {
    await fs.copyFile(path.join(root, 'assets', name), path.join(root, 'dist', 'assets', name));
  }
  console.log('Applied staging-only simplified homepage and Our Story review.');
  await import('./verify-simplified-review.mjs');
}
