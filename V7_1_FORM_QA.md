# V7.1 Form and Resources QA

## Verified in the source build

- Homepage interest form posts to `/api/lead`.
- Journey Reflection uses the same Netlify lead function.
- Field names match the function inputs.
- The function maps interest submissions to Airtable contact fields, including ZIP, derived city, Circle interest, contact type, gathering preference, newsletter consent, and attribution.
- The function maps assessment results to the six established stage names and sends the corresponding guide email through Resend.
- Mocked end-to-end tests returned successful Airtable and Resend responses for both form types.
- `resources.html` is generated, exceeds the minimum integrity threshold, and uses portable paths for both static preview and Netlify.

## Required after staging deployment

Environment-variable values are intentionally not included in source packages. Submit one clearly labeled staging test through each form to confirm the deployed Netlify environment still has valid Airtable and Resend credentials.
