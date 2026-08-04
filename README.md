# Homeward Website V7.1

Canonical source for the Homeward Community website.

## Open the site immediately

The root-level `index.html` is synchronized with the current V7.1 build and can be opened directly.

## Rebuild after CMS or source edits

Run:

```bash
npm run build
```

The build writes the deployable site to `dist/` **and** refreshes the root-level preview files so `index.html` never remains on an older version.

Netlify should continue publishing the generated `dist/` directory.

See `READ_ME_FIRST.md`, `V7_1_CHANGELOG.md`, and `V7_1_FORM_QA.md`.
