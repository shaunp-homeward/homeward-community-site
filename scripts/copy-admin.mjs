import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'admin');
const dist = path.join(root, 'dist', 'admin');

await fs.rm(dist, { recursive: true, force: true });
await fs.cp(source, dist, { recursive: true });

const configPath = path.join(dist, 'config.yml');
let config = await fs.readFile(configPath, 'utf8');
config = config.replace(/editor:\n  preview: false/, 'editor:\n  preview: true');

// Make legacy content unmistakable on V8. The underlying files remain available
// because V8 still inherits a few protected structures from V7.1.
config = config
  .replace('label: Main Site Content', 'label: Shared / Legacy Site Content')
  .replace('    label: Homepage\n    file: content/home.json', '    label: Legacy V7 Homepage Structure (not V8)\n    file: content/home.json')
  .replace('label: Additional Page Copy', 'label: Other Pages (structured editor)');

// V8's editable source fields live in a separate collection. Enhance the
// deployed editor without mutating the canonical source schema in-place.
const v8CollectionPath = path.join(source, 'v8-collection.yml');
let v8Collection = await fs.readFile(v8CollectionPath, 'utf8');

// Put V8 first and make its purpose obvious.
v8Collection = v8Collection.replace('label: Homepage (V8)', 'label: Homepage (V8) — USE THIS');

// Make the section-order list compact so drag/reorder is practical.
v8Collection = v8Collection.replace(
  '      - label: Homepage section order\n        name: section_order\n        widget: list\n        collapsed: false',
  '      - label: Homepage Section Order — Drag to Reorder\n        name: section_order\n        widget: list\n        collapsed: true\n        minimize_collapsed: false'
);

// Surface the controls the editor asked for instead of burying them.
v8Collection = v8Collection.replace(
  '          label: Design options\n          name: style\n          widget: object\n          collapsed: true',
  '          label: Design — Colors, Font & Spacing\n          name: style\n          widget: object\n          collapsed: false'
);

// Convert V8 multiline text inputs into the current Decap richtext editor.
// Keep built-in sections intentionally constrained to bold/italic/links so the
// approved layouts stay resilient; custom sections already expose richer tools.
const richTextLines = [
  'widget: richtext',
  'minimal: true',
  'buttons:',
  '- bold',
  '- italic',
  '- link',
  'editor_components: []',
  'modes:',
  '- rich_text',
  '- raw',
  'sanitize_preview: true',
];
v8Collection = v8Collection.split('\n').flatMap((line) => {
  if (line.trim() !== 'widget: text') return [line];
  const indent = line.match(/^\s*/)?.[0] || '';
  return richTextLines.map((entry) => indent + entry);
}).join('\n');

// Prepend V8 to the collections list so it is the first CMS choice.
if (!config.includes('name: v8_front_door')) {
  config = config.replace('collections:\n', `collections:\n${v8Collection.trim()}\n`);
}
await fs.writeFile(configPath, config);

// Netlify exposes BRANCH during builds. Production/main intentionally falls
// back to staging; a branch deploy writes to its own branch.
const context = process.env.CONTEXT || '';
const requestedBranch = process.env.BRANCH || '';
const cmsBranch = context === 'production' || requestedBranch === 'main'
  ? 'staging'
  : (requestedBranch || 'staging');

await fs.writeFile(
  path.join(dist, 'runtime-config.js'),
  `window.__HOMEWARD_CMS_BRANCH = ${JSON.stringify(cmsBranch)};\n`,
);

console.log(`CMS admin copied to dist/admin (CMS branch: ${cmsBranch}).`);
