# Homeward Website V6

## What this package contains

- Circle-first homepage based on the annotated V5 screenshots
- Full Circles page with a sample Season One gathering
- Practices, Breath Prayer, Journey Reflection, Our Story, Connect, and Future Vision pages
- Airtable lead capture through a Netlify Function
- Calendly opening after form submission when a conversation is requested
- Google Analytics enabled only on production builds
- Safe preview behavior: staging and Deploy Preview forms do not write to the live CRM by default
- Decap CMS homepage editor at `/admin/`
- Git/Netlify build system for staging, previews, and controlled publishing

## Build locally

```bash
npm run build
```

The finished website is written to `dist/`.

For a Netlify-style local environment with Functions:

```bash
npm run dev
```

## Recommended deployment

Do not keep uploading ZIPs for each revision. Connect the existing Netlify project to a private GitHub repository, then use:

- `main` for the live site
- `staging` for the stable review sandbox
- pull requests for one-off Deploy Previews

See `GITHUB_NETLIFY_DECAP_SETUP.md` for the few account-level steps that must be completed manually.

## Important integrations preserved

- Google Analytics: `G-EDK2LGMJZG`
- Airtable base: configured through Netlify environment variables
- Lead endpoint: `/api/lead`
- QR redirect endpoint: preserved in `netlify/functions/redirect.mjs`
- Calendly: existing Homeward conversation calendar

Never place Airtable tokens in the repository. Keep them as secret Netlify environment variables.
