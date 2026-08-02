# Homeward V6.2.11 — Staging handoff

This update applies the requested homepage polish to the corrected V6.2.10 full source.

## Recommended deployment

Use `Homeward_Website_V6_2_11_Targeted_Update.zip` against the current V6.2.10 staging branch, preserving the folder structure. Netlify should run the existing:

```bash
npm run build
```

The build has already been run locally and passed.

## Changes included

- Hero copper CTA: **Have a Conversation**, opening the existing calendar.
- New Deep Forest **Let's talk** strip below the six recognition questions.
- Circle badge: **Registration is open · Space is limited**.
- Added the optional 6–8 person capacity note.
- Added a compact **Meet Shaun** founder note after “We gather to remember.”
- FAQ moved before Future Vision.
- Final CTA reduced to two buttons.
- Homepage nav, mobile menu, mobile header, and footer conversation labels standardized.
- Supplied founder portrait optimized for the website.

## Files changed

- `content/home.json`
- `src/index.template.html`
- `styles.css`
- `assets/founder-headshot.jpg`
- `index.html` (built homepage copy for direct preview only)
- `package.json`
- `scripts/build.mjs`
- `V6_2_11_CHANGELOG.md`
- `V6_2_11_STAGING_UPLOAD.md`

## QA completed

- `npm run build` passed.
- All six existing recognition questions remain unchanged.
- Both existing Circle buttons remain unchanged.
- FAQ is before Vision.
- Final CTA contains exactly two buttons.
- All local homepage assets and links resolve in the built output.
- No template markers remain unresolved.

## Important

The targeted update is intended for the GitHub staging branch. The static preview ZIP can be used for visual review, but it does not replace the source-based Netlify deployment workflow.
