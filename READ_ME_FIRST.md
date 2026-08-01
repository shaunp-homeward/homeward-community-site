# Homeward Website V6.2.5 — Stage One + Journey Explorer

## Recommended upload

Use `Homeward_Website_V6_2_5_Targeted_Update.zip` against the existing V6.2.4 staging branch. Preserve the included folder structure and allow Netlify to run the existing `npm run build` process.

The targeted package does not replace the rest of the site. It adds or updates only the files required for Stage One, the shared Journey explorer, the expanded Resources page, and the assessment delivery flow.

## New routes

- `/journey/inherited-faith`
- `/resources/inherited-faith`
- `/practice-remembering`
- `/guide/inherited-faith` redirects to the Stage One guide
- `/downloads/Homeward_Inherited_Faith_Guide.pdf`

## Updated routes

- `/journey/sacred-search` — now includes the interactive six-stage explorer
- `/resources` — now shows all available books, podcasts, videos, and practices inline
- `/assessment` — Stage One and Stage Three now receive online-guide and PDF links

## Test after staging deploy

1. Take the assessment and force/check an Inherited Faith result.
2. Submit an email and confirm the response contains:
   - `/journey/inherited-faith`
   - `/downloads/Homeward_Inherited_Faith_Guide.pdf`
3. Open `/journey/inherited-faith` and click all six stage tabs.
4. Open `/journey/sacred-search` and confirm the same explorer works with Stage Three selected.
5. Open `/resources` and confirm both complete shelves are visible without another click.
6. Test every external book, podcast, and video link.
7. Test `/practice-remembering` on desktop and mobile.
8. Confirm existing Calendly, Airtable capture, navigation, and other pages still work.

## Important behavior

- Stage One and Stage Three result pages remain hidden from the main navigation and use `noindex,follow`.
- The global Resources page remains public.
- Stages Two, Four, Five, and Six are explorable in the interactive component, but their full guides remain labeled as in development.
