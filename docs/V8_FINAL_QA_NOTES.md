# V8 Final QA Notes — 2026-08-11

## Responsive review targets

The launch candidate is designed and verified against the requested viewport classes:

- Phone: 360, 375, 390, 430 px
- Tablet: ~768 px
- Desktop: 1280 and 1440 px

The shared navigation shell preserves the Homeward mark, HOMEWARD wordmark, `A SPIRITUAL COMMUNITY`, compact `Let’s Talk` action, and hamburger at mobile widths. Active major sections are marked with `aria-current="page"` and copper emphasis.

## Image handling

- Homepage hero: responsive QA removes forced-height behavior at mobile/tablet widths and preserves the group photograph without a broken partial-render appearance.
- Circles hero: responsive QA removes the desktop gradient crop at narrow widths and allows the full image frame to display.
- Practices hero: responsive QA prevents large forced crops at narrow widths.
- Practices review thumbnails: launch rendering substitutes larger existing site imagery for the tiny files in `assets/review/practices/`.
- Our Story: archival/history images use contained framing where important context would otherwise be lost. Low-resolution historical images are not presented as high-resolution masters.

## Color handling

The canonical V8 shared shell is loaded after page/legacy CSS and locks primary action copper to `#B53A2A`. Calendly's embedded primary color also uses `b53a2a`. The old redder `#B35A2A` is not used by the shared launch shell.

## Human final review still required

Automated build verification can prove paths, content, shared navigation structure, CTA labels, and absence of review-thumbnail references. Shaun's final real-device review remains the acceptance step for subjective crop, type-size, and visual-balance decisions before production promotion.
