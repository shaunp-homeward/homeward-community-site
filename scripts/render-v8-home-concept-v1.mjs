import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const approvedHomepage = readFileSync(path.join(root, 'content', 'homepage-concept-v1.html'), 'utf8');

export function renderHomeConceptV1(_sourceHtml) {
  return approvedHomepage;
}
