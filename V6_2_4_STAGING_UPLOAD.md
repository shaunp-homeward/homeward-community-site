# V6.2.4 Staging Upload

## Safest deployment

Deploy the complete source through the same Git/Netlify workflow used for V6.2.3. The build command and publish directory are unchanged:

- Build: `npm run build`
- Publish: `dist`

A prebuilt staging ZIP is also provided for Netlify drag-and-drop testing.

## Routes to verify

- `/assessment`
- `/journey/sacred-search`
- `/resources`
- `/resources/sacred-search`
- `/downloads/Homeward_Sacred_Search_Guide.pdf`

## Email delivery

The assessment continues to capture Airtable leads without any new settings. To send the Sacred Search guide automatically, add these Netlify environment variables:

- `RESEND_API_KEY`
- `ASSESSMENT_FROM_EMAIL` — an address on a domain verified in Resend
- `ASSESSMENT_REPLY_TO` — optional

Deploy previews do not write to Airtable or send email unless the existing preview override is deliberately enabled.

## Important

Do not add the hidden result pages to the main navigation or sitemap. They already include `noindex,follow` and are intended to be shared through the assessment result flow.
