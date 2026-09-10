import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const target = path.join(root, 'dist', 'assessment.html');

let html = await fs.readFile(target, 'utf8');
if (html.includes("gtag('event','journey_reflection_result'")) {
  console.log('Journey Reflection result analytics already present.');
  process.exit(0);
}

const needle = "  var S=STAGES[stage];\n";
const eventLine = "  if(typeof gtag==='function'){gtag('event','journey_reflection_result',{assessment_stage:S.title});}\n";
if (!html.includes(needle)) {
  throw new Error('Could not find Journey Reflection result render hook in dist/assessment.html');
}

html = html.replace(needle, needle + eventLine);
await fs.writeFile(target, html, 'utf8');
console.log('Injected journey_reflection_result analytics into dist/assessment.html.');
