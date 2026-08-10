# V8 CMS Architecture

## Canonical source

`content/v8.json` is the canonical editorial source for the V8 homepage and the V8 Circles comparison.

The legacy `content/home.json` remains in the repository because the V7.1 build still supplies protected structural sections (including the lead form, FAQ, and other integration-sensitive markup) before the V8 renderer replaces/reorders the homepage. It is not the V8 Homepage Builder source.

## Decap collection

The V8 collection is defined in `admin/v8-collection.yml`:

- collection: `v8_front_door`
- file entry: `v8`
- source: `content/v8.json`

`scripts/copy-admin.mjs` merges that collection into the deployed `dist/admin/config.yml`.

## Branch safety

For Netlify branch deploys, `scripts/copy-admin.mjs` writes `dist/admin/runtime-config.js` from Netlify's `BRANCH` value. Production/main intentionally falls back to `staging`.

The admin page also derives the branch from a Netlify branch-deploy hostname. On the V8 branch deploy, Decap therefore targets:

- branch: `v8-four-week-front-door`
- V8 source: `content/v8.json`

## Homepage ordering

`homepage.section_order` stores stable section IDs plus an `enabled` flag. The renderer:

1. uses configured order when valid;
2. ignores duplicate/unknown entries;
3. respects explicit hidden entries;
4. appends omitted protected built-in sections in their safe default order;
5. appends enabled custom sections not yet listed in `section_order`.

Built-in IDs:

- `hero`
- `recognition`
- `practice_bridge`
- `gifts`
- `difference`
- `finding_home`
- `journey`
- `practice_bears_fruit`
- `founder`
- `fit`
- `interest`
- `faq`

Use the `enabled` switch to hide a protected section. Removing a protected item from the order list does not delete its underlying content.

## Flexible repeated content

Repeatable items use stable IDs, an `enabled` flag where useful, and Decap list controls for add/remove/reorder. The public renderer filters hidden items and uses count-flexible grids.

Examples include hero facts, Finding Home logistics, recognition prompts, practice outcomes, gift cards, Circle features, Journey benefits, and Circles comparison rows.

## Custom section library

`homepage.custom_sections` is a controlled Decap variable-type list. Supported types:

- Text + Image
- Image + Text
- Full-width Image
- Editorial Content
- Callout
- Quote / Testimonial
- Card Grid
- Icon / Benefit Grid
- CTA Band
- Comparison
- Video
- Divider
- Spacer

Each custom section has a stable ID. To place it between built-in sections, add that same ID to `homepage.section_order` and drag it into position. If it is not listed there, the renderer safely appends it after the built-in sections.

## Design controls

CMS styling is token-based, not arbitrary CSS. Supported presets use Homeward's approved palette and typography:

- Deep Forest `#153A2E`
- Warm Ivory `#FAF6EF`
- Living Sage `#6D7D6A`
- Aged Copper `#B53A2A`
- Sunrise Gold `#E0A443`
- Charcoal `#333333`
- White / Black / neutral gray
- Playfair Display
- Inter

The renderer maps presets to semantic classes. Default values preserve the existing V8 appearance.

## Protected structures

The following remain purpose-built rather than generalized because they carry integration, tracking, accessibility, or behavior risk:

- lead / interest form
- FAQ interaction
- Fit / Not Fit source
- any inherited Practice Bears Fruit markup when present

They can be reordered or hidden through the V8 section-order system without rewriting their internal contracts.

## Preview

`admin/preview.js` registers the V8 preview with:

`CMS.registerPreviewTemplate('v8_front_door', V8Preview)`

and also registers the file-entry name `v8` for compatibility with Decap file collections.

The preview reflects section order, visibility, cards, imagery, protected structures, custom sections, and basic background styling.

## Safe migration

The V8 migration is additive around the approved Draft 2.1 design:

- existing public copy is retained;
- existing form/function contracts are retained;
- default section order preserves the pre-builder renderer order;
- custom sections start empty;
- default style tokens do not change public styling.

Future editorial changes should be made through `content/v8.json` / Homepage (V8) → Homepage Builder.
