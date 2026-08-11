# V8 Image QA — Launch Candidate

Pages reviewed at source/layout level: Homepage, Circles, Practices, Our Story.

## Issues addressed

- Removed rendered launch references to the tiny `assets/review/practices/*` review thumbnails on Homepage, Circles, and Practices. Those slots now resolve to existing full-size Homeward image assets.
- Added `assets/v8-launch-image-qa.css` to the four redesigned primary pages.
- Homepage, Circles, and Practices hero images no longer force aggressive mobile crops; mobile/tablet rendering preserves the photograph's frame.
- Our Story archival photographs use contained framing at mobile sizes so people, monastery/retreat scenes, and hall edges are not cut away. This is preferable to enlarging inherently low-resolution historical photographs.
- Practice-library and supporting images retain predictable aspect ratios without stretching.

## Full-size launch mappings

- Contemplative / breath imagery -> `assets/living-awake/contemplative-room.webp`
- Light / prayer imagery -> `assets/honest-questions/opening-light.webp`
- Quiet meditation -> `assets/honest-questions/quiet-room.webp`
- Inspired Reading -> `assets/new-foundations/quiet-reading-room.webp`
- Daily Reflection -> `assets/embodied-faith/embodied-life.webp`
- Gratitude -> `assets/sacred-search/path-sunrise.webp`
- Community practice -> `assets/embodied-faith/community.webp`

## Final human review

Before promotion to `main`, visually review at least one real phone and one desktop browser. Source-level QA removes the known broken/blurry asset references and crop rules, but final visual composition should still be approved on the deployed branch before production promotion.
