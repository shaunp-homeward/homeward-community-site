# Homeward V6.2.13 — Mobile Header Width Hotfix

## Changed

- Kept the desktop header CTA as **Have a Conversation**.
- Changed only the compact homepage mobile-header label to **Let’s Talk**.
- Reduced mobile CTA, logo, and menu sizing to prevent the header from exceeding the viewport.
- Added shrink-safe grid and `min-width: 0` behavior to the mobile header.
- Added a narrow-screen refinement for phones at 390px and below.
- Added `overflow-x: clip` as a defensive mobile safeguard after correcting the actual header sizing.

## Not changed

- Desktop header wording or layout.
- Mobile-menu button wording.
- Calendar behavior, tracking event, forms, routes, content, colors, or page sections.
