# V8 CMS architecture

## Canonical content and the legacy model

`content/home.json` is the V7.1 source consumed by `scripts/build.mjs`. It still supplies the shared site shell and a small set of structurally sensitive homepage features (the lead form, FAQ, and the existing Practice Bears Fruit section). Those sections keep their proven markup, integrations, tracking attributes, and form field names.

`content/v8.json` is the canonical editorial source for the V8 homepage. `scripts/v8-build-hook.mjs` intercepts the V7.1 homepage write and passes that complete, functional HTML to `scripts/render-v8-home-v6.mjs`. The V8 renderer replaces the `<main>` presentation while deliberately retaining protected V7.1 fragments where duplicating their form or behavior would create risk. The Circles comparison continues through `scripts/render-v8-front-door.mjs`.

The deployed Decap configuration appends `admin/v8-collection.yml`. Editors should use **Homepage (V8) → Homepage Builder** for homepage work. The old Homepage entry remains only for compatibility with protected legacy fragments and other shared build inputs; it is not the canonical V8 homepage editor.

## Migration safety

The migration is additive: every original V8 value remains in `content/v8.json`. Repeatable values gained stable IDs and `enabled` flags, and the initial `section_order` exactly matches the approved public V8 sequence. The renderer provides its own safe default order, ignores duplicate or unknown order entries, appends omitted structural sections, and skips hidden items. An empty custom-section list produces no markup, so the initial public presentation is unchanged.

A pre-change Git snapshot is available at `backup/v8-cms-before-flexible-builder-20260810`.

## Editor model

Purpose-built V8 sections remain structured objects to protect art direction. `homepage.section_order` is the draggable visibility/order control. `homepage.custom_sections` is a controlled component library; each optional component has a stable ID and is added to the order by choosing that same ID. If a custom component is not yet in the ordered list, it is safely appended rather than lost.

Repeatable hero facts, Finding Home logistics, recognition prompts/authors, practice outcomes, gift cards, Circle differentiators/questions, Journey benefits, custom cards, and Circles comparison rows support ordering and item visibility. Lists can also be added to or deleted through Decap.

## Protected areas

The lead form, Netlify function connection, Airtable/Resend field contract, FAQ behavior, Fit / Not Fit content source, and Practice Bears Fruit markup are retained from the V7.1 build. They can be reordered or hidden from the V8 section-order list, but their internal structures are intentionally not generalized. This avoids breaking analytics, accessibility, form submission, and integrations while the V8 CMS becomes canonical.

## Component and style presets

Optional components: Text + Image, Image + Text, Full-width Image, Editorial Content, Callout, Quote/Testimonial, Card Grid, Icon/Benefit Grid, CTA Band, Comparison, Video, Divider, and Spacer.

Style controls are semantic presets only: approved Homeward background/heading/body/accent colors; small/standard/large heading and body size; left/center alignment; Playfair Display/Inter headings; compact/standard/spacious spacing; and center/top/bottom image focus. No arbitrary CSS is stored.
