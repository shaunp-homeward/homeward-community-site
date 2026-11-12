# Homeward Charities website

**Repository purpose:** this is the public Homeward website. The separate
`homeward-command-center` repository is the Airtable CRM app, not an older copy
of this site.

**v1.7 candidate:** implementation is on `feature/homeward-v17`.
Use Node 22+, `npm run build:v17:preview`, `npm run verify:v17:preview`, and
`npm run test:v17` for the release preview in `dist-v17-preview/`.
Use `npm run build:v17:release` and `npm run verify:v17:release` for production
output in `dist-v17-production/`. Neither command deploys the site.
Netlify uses `build:v17:netlify`, which selects production or nonindexable preview
output from the deployment context. See the [launch plan](docs/v17/LAUNCH.md)
and [implementation evidence](docs/v17/IMPLEMENTATION.md).

## Legacy V7.1 workflow

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
