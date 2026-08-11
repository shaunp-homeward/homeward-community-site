# Homeward V8 — Final Launch Candidate Manifest

Prepared: 2026-08-11

## Review target

- Working branch: `v8-four-week-front-door`
- Review URL: `https://v8-four-week-front-door--homeward-community-dfw.netlify.app/`
- Production branch: `main` — **not modified by this pass**
- Production site: `homewardcommunity.com` — **not intentionally deployed by this pass**

## Primary launch pages

- Homepage `/`
- Circles `/circles.html`
- Practices `/practices.html`
- Journey / Journey Reflection
- Our Story `/about.html`
- Resources
- Conversation / Connect

## Locked brand system

- Forest `#153A2E`
- Ivory `#FAF6EF`
- Sage `#6D7D6A`
- Copper `#B53A2A`
- Gold `#E0A443`
- Charcoal `#333333`

Header CTA: **Let’s Talk** → Conversation / Connect.

Primary conversion CTA: **Tell Us You’re Interested** → homepage interest form.

Secondary relational CTA: **Have a Conversation** → Conversation / Connect.

## Shared navigation

The final candidate uses one build-time canonical header shell across public pages, with the same logo lockup, navigation order, compact Let’s Talk header CTA, mobile hamburger, and active-page state. Active major sections use `aria-current="page"` plus subtle copper emphasis. Journey Reflection and its six journey-stage pages are treated as part of the Journey navigation section.

## Image QA

Primary launch pages map selection/review thumbnails to full-size existing site imagery. Shared responsive QA prevents aggressive mobile hero cropping and preserves historical Our Story photography with contained framing where appropriate.

A curated reusable repository library is available under `assets/library/`.

A separate offline archive, `Homeward_All_Recoverable_Image_Library_2026-08-11.zip`, contains every byte-unique image actually recoverable from the current ChatGPT workspace plus image files recoverable inside available Homeward ZIP packages:

- 280 byte-unique images
- 437 duplicate copies collapsed
- 113.8 MB of unique image data
- 120 raster images flagged below 700 px wide or 400 px high

The offline archive is intentionally broader than the production repository library and includes an image manifest and duplicate report. Images from older conversations that are not present in the repository, current workspace, or available ZIP packages cannot be truthfully claimed as recovered.

## Integrations that must survive promotion

- Homepage interest form → `/api/lead`
- Airtable lead capture
- Resend participant/admin email flow
- ZIP, interest, gathering preference, open-response, newsletter, privacy and success-state fields
- Conversation / Calendly flow
- Journey Reflection scoring, results, resources and PDFs
- Redirects and configured tracking

## CMS status / known canonical-source alignment checkpoint

The site is visually prepared for final review, but the final production promotion must also align the CMS canonical sources deliberately:

- Approved Homepage Concept V1 currently renders from `content/homepage-concept-v1.html`, while the V8 Homepage Builder edits `content/v8.json`.
- Primary Practices renders from `content/practices-v8.json`; legacy/shared CMS definitions still include older Practices content sources.
- Primary Our Story renders from `content/about-v8.json`; legacy/shared CMS definitions still include older About content sources.

Do not call the production CMS fully migrated until the final promotion pass reconnects the approved page renderers to the intended canonical editor sources and verifies `/admin/` on `main`.

## Promotion instructions — only after Shaun explicitly approves

1. Freeze the approved V8 candidate at a final backup branch.
2. Confirm `npm run build` and `npm run verify` pass on the exact approved commit.
3. Align canonical V8 CMS sources and verify the generated `/admin/` configuration.
4. Compare approved V8 candidate against `main`.
5. Preserve Netlify functions, environment variables, redirects, Airtable, Resend, Calendly, Journey Reflection, PDFs/resources and tracking.
6. Promote only the approved candidate/CMS integration to `main`.
7. Rebuild and verify production after the promotion.

## Safety

Do not merge or deploy `main` until Shaun completes final visual review and explicitly authorizes production promotion.
