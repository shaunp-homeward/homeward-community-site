# Homeward Website V6.2.4

## Sacred Search finalization

- Added hidden responsive result guide at `/journey/sacred-search`.
- Added hidden focused resource shelf at `/resources/sacred-search`.
- Added public global Resources page at `/resources`.
- Added downloadable eight-page PDF at `/downloads/Homeward_Sacred_Search_Guide.pdf`.
- Replaced the obsolete `guide-sacred-search.html` with a redirect to the new online guide.
- Added Amazon book links, official podcast pages, Guided Centering Prayer, and the requested Universal Christ video.
- Added a low-risk Resources link to the footer only; existing header navigation is unchanged.

## Assessment delivery

- Sacred Search results now receive immediate guide links after submitting the email form.
- Other stages are handled honestly as coming soon until their guides are completed.
- The lead function still writes to Airtable exactly as before.
- Optional email delivery uses Resend only when `RESEND_API_KEY` and `ASSESSMENT_FROM_EMAIL` are configured. Missing email settings do not break lead capture.
