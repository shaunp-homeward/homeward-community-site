# Homeward Website V6.2.24

## Staging end-to-end email and CRM testing

- The named `staging` branch now behaves as a true end-to-end test environment.
- Staging interest-form and assessment submissions write to the existing Homeward Airtable CRM.
- Staging interest notifications and assessment-guide emails are sent through Resend.
- Staging email subjects are prefixed with `[STAGING TEST]`.
- Airtable notes clearly identify records created from the staging branch.
- Temporary deploy previews and local development remain sandboxed by default.
- Added safe default values for the Homeward sender, reply-to address, and notification recipient, so only `RESEND_API_KEY` is required in Netlify.

## No visual changes

No page copy, design, assessment scoring, CMS fields, routes, PDFs, or Airtable field mappings changed.
