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

config = config
  .replace('label: Main Site Content', 'label: Shared / Legacy Site Content')
  .replace('    label: Homepage\n    file: content/home.json', '    label: Legacy V7 Homepage Structure (not V8)\n    file: content/home.json')
  .replace('label: Additional Page Copy', 'label: Other Pages (legacy structured editor)');

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
const makeRich = (text) => text.split('\n').flatMap((line) => {
  if (line.trim() !== 'widget: text') return [line];
  const indent = line.match(/^\s*/)?.[0] || '';
  return richTextLines.map((entry) => indent + entry);
}).join('\n');

v8Collection = makeRich(v8Collection);

const v8GlobalCollectionPath = path.join(source, 'v8-global-collection.yml');
let v8GlobalCollection = makeRich(await fs.readFile(v8GlobalCollectionPath, 'utf8'));

const v8PagesCollectionPath = path.join(source, 'v8-pages-collection.yml');
let v8PagesCollection = await fs.readFile(v8PagesCollectionPath, 'utf8');

// Retired Circles fields remain recoverable in source JSON/backups but stay out of the active editor.
v8PagesCollection = v8PagesCollection
  .replace(/\n    - label: Mid-page conversation invitation\n[\s\S]*?(?=\n    - label: Gathering agenda \+ sample)/, '')
  .replace(/\n      - \{label: Sample-session dropdown label,[\s\S]*?(?=\n    - label: Tools for the spiritual life)/, '')
  .replace(/\n      - \{label: Left-column heading,[\s\S]*?(?=\n      - \{label: Homeward-column heading)/, '')
  .replace('    - label: Gathering agenda + sample', '    - label: Gathering rhythm')
  .replace('    - label: Small-group comparison', '    - label: What makes a Circle different')
  .replace('      - {label: Homeward-column heading, name: right_heading, widget: string}', '      - {label: Distinction heading, name: right_heading, widget: string}')
  .replace('      - label: Homeward-column items', '      - label: Homeward distinctions')
  .replace('      - {label: Closing note, name: note, widget: text}', '      - {label: Respectful context note, name: note, widget: text}');

// Our Story now has its own clean canonical collection. Remove the superseded schema
// from the general V8 pages collection before injecting the dedicated editor below.
v8PagesCollection = v8PagesCollection.replace(/\n  - name: about_v8[\s\S]*$/, '');
v8PagesCollection = makeRich(v8PagesCollection);

const v8AboutCollectionPath = path.join(source, 'v8-about-collection.yml');
let v8AboutCollection = makeRich(await fs.readFile(v8AboutCollectionPath, 'utf8'));

if (!config.includes('name: v8_front_door')) {
  config = config.replace(
    'collections:\n',
    `collections:\n${v8Collection.trim()}\n${v8GlobalCollection.trim()}\n${v8AboutCollection.trim()}\n${v8PagesCollection.trim()}\n`
  );
}
await fs.writeFile(configPath, config);

const context = process.env.CONTEXT || '';
const requestedBranch = process.env.BRANCH || '';
const cmsBranch = context === 'production' || requestedBranch === 'main'
  ? 'main'
  : (requestedBranch || 'v8-four-week-front-door');

await fs.writeFile(
  path.join(dist, 'runtime-config.js'),
  `window.__HOMEWARD_CMS_BRANCH = ${JSON.stringify(cmsBranch)};\n`,
);

console.log(`CMS admin copied to dist/admin (CMS branch: ${cmsBranch}).`);
