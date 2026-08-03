# Homeward Website V6.2.23

## Email delivery and notifications

- Added an automatic email to `shaun@homewardcommunity.com` when the homepage interest form is submitted.
- The notification includes contact details, ZIP/city, preferred Circle format, interest selection, notes, source/campaign, and a reply button.
- Preserved the assessment-result email with both the online guide and printable PDF links.
- Consolidated email configuration under shared Homeward environment variables while retaining compatibility with the earlier assessment-only variable names.
- Added safe staging-email testing: staging never writes to Airtable by default, and emails are sent only when the submitted address appears in `PREVIEW_EMAIL_RECIPIENTS` and `ALLOW_PREVIEW_EMAIL=true`.
- Email failure does not erase a successfully saved Airtable submission. Delivery failures are logged in the Netlify function logs.

## No visual changes

No page copy, assessment scoring, CMS fields, layout, styles, routing, Airtable field mapping, or PDF files changed in this release.
