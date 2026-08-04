import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFile(path.join(root, p), 'utf8');
const exists = async (p) => { try { await fs.stat(path.join(root,p)); return true; } catch { return false; } };
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const pkg = JSON.parse(await read('package.json'));
const home = JSON.parse(await read('content/home.json'));
const index = await read('dist/index.html');
const resources = await read('dist/resources.html');
const lead = await read('netlify/functions/lead.mjs');
const redirects = await read('_redirects');

assert(pkg.version === '7.1.0', 'package.json is not version 7.1.0');
assert(home.recognition.questions.length === 4, 'Homepage must contain exactly four recognition questions');
assert(home.journey.benefit_items.length === 4, 'Journey benefit panel must contain exactly four benefits');
assert(index.includes('content="7.1.0" name="homeward-version"'), 'Generated homepage version metadata is incorrect');
assert(index.includes('God, a Higher Power, love, and transformation'), 'Higher Power invitation language is missing');
assert(index.includes('Eight weeks · No cost'), 'Circle logistics do not end with No cost');
assert(index.includes('spiritual-journey-spiral-v71.svg'), 'V7.1 journey spiral is missing');
assert((index.match(/class="question-v4"/g) || []).length === 4, 'Generated homepage does not show four questions');
assert((index.match(/journey-benefit-list/g) || []).length >= 1, 'Journey benefit bullets are missing');
assert(await exists('dist/resources.html'), 'Resources page was not built');
assert(resources.length > 5000, 'Resources page appears incomplete');
assert(resources.includes('href="styles.css"') && resources.includes('src="assets/'), 'Resources page is not portable for a static preview');
assert(index.includes('data-endpoint="/api/lead"'), 'Homepage form is not connected to /api/lead');
for (const field of ['firstName','lastName','email','zip','interest','gathering_preference','draw','newsletter']) {
  assert(index.includes(`name="${field}"`), `Homepage form field ${field} is missing`);
}
for (const key of ['AIRTABLE_TOKEN','AIRTABLE_BASE_ID','AIRTABLE_TABLE_ID','RESEND_API_KEY']) {
  assert(lead.includes(key), `Lead function is missing ${key}`);
}
assert(lead.includes('https://api.airtable.com/v0/'), 'Lead function does not post to Airtable');
assert(redirects.includes('/api/lead /.netlify/functions/lead 200'), 'Lead function redirect is missing');
console.log('Homeward V7.1 verification passed.');
