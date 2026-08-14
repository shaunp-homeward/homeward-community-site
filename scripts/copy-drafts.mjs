import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const draftsDir = path.join(root, 'drafts');
const distDir = path.join(root, 'dist');

await fs.mkdir(distDir, { recursive: true });

for (const name of ['index-draft1.html', 'index-draft2.html', 'index-draft2-1.html', 'circles-draft1.html', 'about-draft1.html', 'about-draft2.html', 'about-draft3.html']) {
  const source = path.join(draftsDir, name);
  const target = path.join(distDir, name);
  await fs.copyFile(source, target);
}

// Draft 4 is a surgical tightening pass built from Draft 3. Keeping Draft 3 intact
// gives us a clean rollback/comparison point while we review the final copy density.
let about4 = await fs.readFile(path.join(draftsDir, 'about-draft3.html'), 'utf8');
about4 = about4
  .replace('<title>Our Story Draft 3 — Homeward</title>', '<title>Our Story Draft 4 — Homeward</title>')
  .replace('Our Story · Draft 3 · Original V8 design preserved · Review only', 'Our Story · Draft 4 · Final tightening review · Current V8 page unchanged')
  .replace('I grew up evangelical and genuinely loved Jesus. But some of the answers I was given stopped making sense to me, and I wasn’t sure what to do with them.', 'For years, I carried questions about God, salvation, other religions, and the Christianity I had inherited that I couldn’t seem to resolve. I wanted answers that could hold together both intellectually and spiritually—but I couldn’t find them.')
  .replace('<p><strong>I could not find answers that satisfied both my mind and my heart. So I kept asking. Then I went looking.</strong></p><p>I wasn’t trying to lose my faith.', '<p>I wasn’t trying to lose my faith.')
  .replace('Over the years I spent months in retreat environments, including extended silent practice, monasteries and retreat centers, and communities shaped by Christian meditation, Buddhist mindfulness, contemplative prayer, and other traditions. This wasn’t casual curiosity. I wanted to understand what sustained practice actually does to a life.', 'Over the years I spent months in retreat environments—monasteries, retreat centers, extended silent practice, and communities shaped by Christian meditation, Buddhist mindfulness, contemplative prayer, and other traditions. This wasn’t casual curiosity. I wanted to understand what sustained practice actually does to a life.')
  .replace('His expansive, Christ-centered reframing gave me a vision of Christianity I had been missing—one spacious enough for mystery and honest questions while bringing me more deeply back toward Jesus.', 'His expansive, Christ-centered reframing gave me a vision of Christianity I had been missing—spacious enough for mystery and honest questions, yet deeply rooted in Christ.')
  .replace('So much of what has shaped my life was freely given to me by teachers, mentors, retreat leaders, writers, spiritual communities, and people who simply made space for me to learn.', 'So much of what has shaped my life was freely given to me by teachers, mentors, retreat leaders, spiritual communities, and people who made space for me to learn.')
  .replace('Over time I began to feel that keeping all of that for myself would miss something important. The best way I know to honor the people who taught me is to pass forward what I can of what they gave me.', 'Over time I began to feel that simply keeping all of that for myself would miss something important. The best way I know to honor the people who taught me is to pass forward what I can of what they gave me.')
  .replace('My hope is to open a doorway into practices that can sometimes feel hidden away in monasteries, retreat centers, or specialized communities—and help people carry them into ordinary life, make them their own, and eventually pass them on to others.', 'My hope is to open a doorway into practices that can sometimes feel hidden away in monasteries or retreat centers—and help people carry them into ordinary life.')
  .replace(/<div class="ap-plain">[\s\S]*?<\/div><\/div><p class="ap-disclaimer">/, '<div class="ap-homeward-summary"><strong>Homeward is Jesus-centered, practice-centered, and built for honest conversation—not agreement on every question.</strong> Circles are currently offered at no cost.</div><p class="ap-disclaimer">')
  .replace('IF THIS RESONATES WITH YOU', 'IF SOMETHING HERE FEELS FAMILIAR')
  .replace('Maybe your faith has changed. Maybe you still feel at home in church. Maybe you’re not sure what you believe anymore. Or maybe you simply want to experience God more deeply. You do not need to have the answers settled to begin.', 'Maybe your faith has changed. Maybe you have questions you haven’t known where to bring. Or maybe you simply want to experience God more deeply. You do not need to have the answers settled to begin.')
  .replace('</style>', '.ap-homeward-summary{margin-top:34px;padding:22px 26px;background:var(--ap-ivory);border:1px solid var(--ap-line);border-left:4px solid var(--ap-copper);font-size:1rem;line-height:1.7;color:#4f5953}.ap-homeward-summary strong{color:var(--ap-forest)}\n</style>');

await fs.writeFile(path.join(distDir, 'about-draft4.html'), about4);

console.log('Copied review drafts to dist and generated about-draft4.html.');