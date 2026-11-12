# Homeward v1.7 implementation and repository decision

Prepared by Marty (Codex engineering role), 2026-11-11. Local candidate only.

**Released subsequently:** v1.7 is live at https://homewardcommunity.com .
See DEPLOYMENT.md for production evidence and the outstanding .org DNS work.
The initial preparation sections below are historical and do not describe
the latest production status.

## Latest launch preparation

Shaun authorized work needed to go live. Production and release-preview builds
now exist, with canonical URLs/sitemap/indexing for production and noindex for
previews. Netlify's checked-in configuration selects the context-aware v1.7
wrapper. The previous `npm run build` remains available for rollback.
The public Practices variant excludes unsupported numerical claims; the
reference candidate retains them with its caveat. Privacy policy, guide PDFs
and existing serverless routes are preserved. See LAUNCH.md for exact commands,
domain observations, remaining authorization, and rollback steps.

The environment was published successfully and all local files survived.
Unrestricted network access is now applied. Real CDN CMS login and Calendly
date selection load in Chromium with certificate verification enabled when it
can open the NSS trust database outside the read-only filesystem sandbox.
Production pages passed 27 route/viewport checks with fonts loaded. Calendar
form tests exposed a resize bug: page_height carries CSS pixel strings, not
plain numbers. That parsing is corrected and regression-tested. The live event
still lacks the requested `Your organization` question. No booking was submitted.
Netlify authorization, GoDaddy web DNS changes and authenticated CMS operations
remain outstanding. No public deployment or domain change has been performed.

The sections below preserve the initial onboarding findings; later observations
above and LAUNCH.md supersede the initial network restrictions and build config.

## Correct repository

`shaunp-homeward/homeward-community-site` is the website. Starting commit:
`b26f2d4f59ad8dff11604b6b3819b8233dd0bf89`, matching remote `main` on inspection.
The checkout was clean. Implementation branch: `feature/homeward-v17`.
The historical `v8-four-week-front-door` points at
`34fc4ad1750fda64bda173c3dcfc57542a5f66b8`; main includes later October 8 website changes.
The README's V7.1 label is older than its actual content and is not a freshness indicator.

`shaunp-homeward/homeward-command-center` is a separate Airtable CRM application,
not an obsolete website. Its README and AGENTS.md explicitly separate it from
the public website. Do not delete or archive it as a duplicate. The AI command
center stores role instructions and shared work context, not public website code.
No redundant repository was identified among the three selected repositories.

## Source and commands

The supplied `Homeward_v1.7_Codex_Handoff.zip` is the design/copy reference.
All 21 checksums in its SHA256SUMS.txt passed. Original supplied assets are
retained under `assets/v17/`; responsive WebP derivatives live in `responsive/`.
The attachment's source hashes describe the attachment, not generated output.

From `/workspace/homeward-community-site`:

```sh
npm run build:v17
npm run verify:v17
python3 -m http.server 8017 --bind 127.0.0.1 --directory dist-v17
```

Node 22+ is available; these commands need no npm dependencies. Builds replace
only ignored `dist-v17/`, not tracked root previews or the previous site.
Nine real routes are defined in `src/v17/routes.json`. Shared header/footer,
page layouts, copy/image content, and client behavior are separated under
`src/v17/` and `content/v17/`. The prototype chooser and review page are excluded.
Navigation uses normal anchors and browser history. Research status remains visible.
All output is deliberately noindex. This output is not a production release.

The existing `npm run build` still selects the previous site. Netlify's local
configuration now selects `build:v17:netlify` and `dist-v17`; this will take
effect only when that source is deployed. Do not use the reference-only
`build:v17` output as the public release. No public deployment, domain change,
email send, or Calendly account change has been performed.

## CMS

The candidate reuses Decap and the existing GitHub repository, with editorial
workflow targeting `feature/homeward-v17`. `/admin/` is generated with the site.
Copy, page metadata, images and alt text are editable through JSON-backed fields.
Copy fields preserve inline HTML formatting; this is an initial editing model,
not a polished page builder. An iframe preview is registered for the page collection.
Existing authenticated GitHub/Netlify CMS authorization must be verified on the
actual staging host. Local-backend mode must never be exposed publicly.

Local content-file edit/build checks establish that heading and image changes
reach output. They do not establish authenticated CMS login, editorial draft,
remote preview, publish, or rollback. Those remain pending actual access and a
reviewed staging destination. Existing production CMS files are unchanged.
The actual pinned Decap 3.9.0 bundle was fetched through the allowed npm registry
and substituted for the blocked CDN request in a local browser check. Its GitHub
login screen loaded without page errors, all nine page preview callbacks
registered, and a heading/image preview rendered. This verifies the editor shell
and preview code, not CDN access or authenticated repository operations.

## Validation and limitations

- AI command center: 217 verification checks, six behavioral tests and offline
  demonstration passed; no external actions.
- Historical website build passed in a scratch copy. Its existing verification
  suite failed on recognition copy, Our Story CTA, a small breath-prayer image,
  and final V9 CMS parity after later overlays. These are pre-existing repository
  content/build inconsistencies, not dependency installation failures.
- New v1.7 build and route/assets/CMS configuration checks pass.
- Heading and image edits were made in a temporary copy, built, checked in the
  generated HTML and reverted; rebuilding restored the baseline output.
- Browser checks cover nine routes at 390, 768 and 1440 pixels, loaded page
  images, no horizontal overflow, no page-script errors, mobile menu and
  back/forward. Screenshots and JSON evidence are in
  `/workspace/.cloud-setup/evidence/`. External fonts and embedded services were
  blocked by network policy; full visual parity and booking interactions are pending.
- CRM function's documented missing-configuration response was exercised directly
  with the Netlify environment API adapter. Live Airtable access was not tested.
- Netlify CLI 27.17.0 was installed outside the repositories. Emulator startup
  fails while fetching its Edge runtime; a fresh HTTPS probe to `edge.netlify.com`
  returned a proxy 403. This is distinct from a running application's response.

Required environment domain additions were saved for review:
`fonts.googleapis.com`, `fonts.gstatic.com`, `calendly.com`,
`assets.calendly.com`, `unpkg.com`, `edge.netlify.com`.
Saving does not apply them. Retry fresh requests after settings are applied;
allow only further observed required destinations. No secret values were requested.
Live CRM additionally needs securely configured AIRTABLE_TOKEN, APP_PIN and
access to api.airtable.com, but is separate from static website development.

Remaining website acceptance work: exact typography with external fonts loaded;
Calendly date/time/form states and resize behavior; authenticated CMS workflow;
research claim validation or approved corrections; verified email/contact and
CRM requirements; final CSS consolidation and accessibility/performance review;
staging deployment receipt and production cutover/redirect plan. No contact
recipient, account configuration or research evidence was invented from the ZIP.

## Backup and rollback

Before implementation a full Git bundle was created at
`/workspace/.cloud-setup/backups/homeward-community-site-before-v17.bundle`.
`git bundle verify` passed, and a fresh clone restored the exact starting commit
with `git fsck --full` passing. This preserves tracked source/history, not hosted
Netlify settings, DNS, secrets or external CMS/account configuration.

The previous build remains available from the original starting commit and
existing production configuration. Preserve the backup and candidate edits
before any checkout/reset. Do not delete mailboxes, change DNS or publish this
candidate as a shortcut to testing. Public cutover needs a concrete reviewed
hosting/redirect/account plan and separate user authorization.
