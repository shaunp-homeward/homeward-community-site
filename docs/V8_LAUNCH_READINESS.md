# Homeward V8 Launch Readiness

Status: **final-review candidate on `v8-four-week-front-door`**. Do not merge or deploy `main` until Shaun approves the final branch review.

## Primary pages in this candidate

- `/` — approved Homepage Concept V1, with the four current Homeward invitation questions.
- `/circles.html` — primary Circles experience and four-week-season model.
- `/practices.html` — primary Practices V2 experience and research section.
- `/about.html` — expanded Our Story / founder trust page.
- Existing Journey Reflection, Resources, Connect, Privacy, forms, Airtable/Resend function, and supporting pages remain part of the normal site build.

## Launch image QA

The launch build applies `assets/v8-launch-image-qa.css` to the four primary pages. It prevents forced mobile hero crops and contains historical Our Story photography so the complete frame remains visible. Homepage, Circles, and Practices no longer ship the tiny `assets/review/practices/*` thumbnails in their rendered launch HTML; those slots are mapped to existing full-size Homeward site imagery.

## Forms and integrations to preserve

- Homepage interest form -> `/api/lead` -> `netlify/functions/lead.mjs`.
- Airtable environment variables: `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID`.
- Email: `RESEND_API_KEY` and existing Homeward email variables.
- Conversation links continue to `/connect.html` / the existing calendar flow.
- Journey Reflection scoring, guides, PDFs, and participant email flow must remain unchanged during the main-branch migration.

## CMS status and migration note

The V8 branch contains the V8 Homepage Builder schema (`admin/v8-collection.yml`) and the runtime branch-selection logic in `scripts/copy-admin.mjs`. The production CMS currently writes through the staging workflow by design.

**Important for the final main-branch migration:** the approved homepage is currently rendered from `content/homepage-concept-v1.html`, while the V8 Homepage Builder edits `content/v8.json`. Before declaring the CMS migration complete, either (a) reconnect the approved homepage renderer to the canonical V8 builder data, or (b) make the approved concept source the CMS canonical source. Do not tell editors that homepage visual changes are live-editable until this is resolved and verified.

Circles continues to read `content/circles.json`. Practices uses `content/practices-v8.json`, and Our Story uses `content/about-v8.json`; their CMS schemas/paths should be explicitly checked as part of the final CMS migration so editing the admin UI changes the same source files used by the primary renderers.

## Final review / migration sequence

1. Review the V8 branch on desktop and a real phone: homepage, Circles, Practices, Our Story, Interest form, Journey Reflection, FAQ, footer/navigation.
2. Run `npm run build`, then `node scripts/verify-v8-launch.mjs` in a clean checkout.
3. Confirm Netlify branch deploy has no build/runtime errors.
4. Confirm `/admin/` loads without Decap schema errors and identify the canonical editable source for each of the four redesigned pages.
5. Create a final immutable backup branch and ZIP/source package.
6. Only after Shaun approves: migrate the candidate files and CMS/linkage updates to `main`, preserving Netlify environment variables and functions.
7. Run the same build + launch verification on `main` before calling production complete.

## Explicit safety boundary

This document does **not** authorize a merge, reset, rebase, or deployment of `main`. The V8 branch remains the review source until final approval.
