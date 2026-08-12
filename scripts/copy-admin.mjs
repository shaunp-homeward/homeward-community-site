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
  .replace('label: Additional Page Copy', 'label: Other Pages (legacy structured editor)');

// V8 homepage fields live in a separate collection.
const v8CollectionPath = path.join(source, 'v8-collection.yml');
let v8Collection = await fs.readFile(v8CollectionPath, 'utf8');

v8Collection = v8Collection.replace('label: Homepage (V8)', 'label: Homepage (V8) — EDIT THIS');

v8Collection = v8Collection.replace(
  '      - label: Homepage section order\n        name: section_order\n        widget: list\n        collapsed: false',
  '      - label: Homepage Section Order — Drag to Reorder\n        name: section_order\n        widget: list\n        collapsed: true\n        minimize_collapsed: false'
);

v8Collection = v8Collection.replace(
  '          label: Design options\n          name: style\n          widget: object\n          collapsed: true',
  '          label: Design — Colors, Font & Spacing\n          name: style\n          widget: object\n          collapsed: false'
);

// Convert V8 multiline text inputs into Decap richtext while keeping the layout constrained.
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

// Circles, Practices, Our Story, and the Photo Guide are maintained in their own V8 collection.
const v8PagesCollectionPath = path.join(source, 'v8-pages-collection.yml');
let v8PagesCollection = await fs.readFile(v8PagesCollectionPath, 'utf8');
v8PagesCollection = v8PagesCollection.split('\n').flatMap((line) => {
  if (line.trim() !== 'widget: text') return [line];
  const indent = line.match(/^\s*/)?.[0] || '';
  return richTextLines.map((entry) => indent + entry);
}).join('\n');

// Put the current V8 editors first. Legacy content remains below them for compatibility only.
if (!config.includes('name: v8_front_door')) {
  config = config.replace('collections:\n', `collections:\n${v8Collection.trim()}\n${v8PagesCollection.trim()}\n`);
}
await fs.writeFile(configPath, config);

// Production CMS writes to a dedicated V8 staging branch so content can be reviewed
// on a branch deploy before promotion to main. Branch-deploy CMS instances write to
// their own branch, which keeps previews self-contained.
const context = process.env.CONTEXT || '';
const requestedBranch = process.env.BRANCH || '';
const cmsBranch = context === 'production' || requestedBranch === 'main'
  ? 'cms-staging-v8'
  : (requestedBranch || 'cms-staging-v8');

await fs.writeFile(
  path.join(dist, 'runtime-config.js'),
  `window.__HOMEWARD_CMS_BRANCH = ${JSON.stringify(cmsBranch)};\n`,
);

console.log(`CMS admin copied to dist/admin (CMS branch: ${cmsBranch}).`);
