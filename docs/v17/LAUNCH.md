# v1.7 launch preparation

Shaun authorized work needed to go live in this chat. This document records the
concrete target, tested preparation, access still needed, and rollback.

## Destination

- Repository: `shaunp-homeward/homeward-community-site`.
- Candidate branch: `feature/homeward-v17`; production source branch: `main`.
- Existing Netlify site from repository documentation and matching public page:
  `homeward-community-dfw` / `homeward-community-dfw.netlify.app`.
- Intended primary website: `https://homewardcharities.org`.
- Keep `homewardcommunity.com` and its mail delivery. Redirect its web URLs
  only after the new domain serves the verified release over HTTPS.
- No extra plugin or paid service is required for the current implementation.

GitHub API permissions were verified for pull/push/admin. Netlify CLI reports
`NOT_LOGGED_IN`; the existing hosting account must authorize the CLI before
site settings, previous deployment ID, hosted environment metadata or account
ownership can be verified. A Netlify browser-authorization ticket was supplied
in chat. Do not put tokens in chat, source, commits or this document.

## Tested build paths

```sh
npm run build:v17:preview && npm run verify:v17:preview
npm run build:v17:release && npm run verify:v17:release
CONTEXT=deploy-preview npm run build:v17:netlify
CONTEXT=production npm run build:v17:netlify
```

The Netlify wrapper builds and verifies the appropriate output, then copies it
to `dist-v17/`. Preview contexts are noindex. Production has canonical URLs and
a sitemap for the .org domain. Do not deploy production until the intended
domain and TLS are ready. `npm run build:v17` preserves the reference candidate
with the original unverified figures; it is not the release command.

The four public Practices panels keep the supplied category order and palette,
but use qualitative invitations rather than unsupported percentages. The
reference figures and visible verification caveat remain in the reference
candidate. Public panel copy is in `content/v17/public-practices.json`; public
Practices page copy is separate from reference-only fields. No research
percentages were fabricated or declared validated.

The existing privacy policy and six guide PDFs are retained. Existing QR and
lead-function routes remain configured. No live form submission, scan counter
increment, email send, or calendar booking is part of verification. Verify
hosted function environment-variable names/presence after account access.

## DNS evidence and proposed changes

Public DNS was captured before launch in
`/workspace/.cloud-setup/evidence/dns-before-launch.json`.

| Host | Observed current configuration | Proposed website change |
| --- | --- | --- |
| `homewardcharities.org` | A: `15.197.148.33`, `3.33.130.190`; GoDaddy nameservers `ns53`/`ns54.domaincontrol.com` | Replace only apex web A records with the exact target shown by the verified Netlify site's domain setup |
| `www.homewardcharities.org` | CNAME: `homewardcharities.org` | Point CNAME to verified Netlify site target; enable HTTPS and redirect to apex |
| `homewardcommunity.com` | A: `75.2.60.5`; GoDaddy `ns43`/`ns44.domaincontrol.com` | Keep DNS/hosting attachment; add web redirect after .org validation |
| `homewardcommunity.com` mail | MX: `1 smtp.google.com` | Preserve MX, TXT, SPF, DKIM, DMARC and Workspace identity |

The .org apex returned an empty page and its www host returned HTTP 503 during
inspection. It is not established as a functioning new Homeward site.
No .org MX records were returned. A new email domain/mailbox is not a prerequisite
for launching the website, and none will be invented or created implicitly.
Do not replace nameservers or Google Workspace records to configure web hosting.
GoDaddy account access or a user-applied DNS edit is still required.

## Deployment sequence

1. Authorize Netlify, verify owning account and exact existing site ID, inspect
   production branch/build settings and capture the current deployment ID.
2. Publish a nonindexable deploy preview from this candidate. Verify page links,
   responsive rendering, booking UI, CMS login and source/content behavior.
3. Integrate the candidate into the existing CMS `staging` branch without
   discarding any unique changes; verify authenticated CMS edit, draft, preview,
   publish-to-staging and Git-backed rollback.
4. Add .org apex/www to the verified existing site, apply only the web DNS
   changes above, and verify domain ownership, certificate and HTTPS responses.
5. Merge the reviewed source to main or deploy the exact verified production
   artifact using the existing site. Record the commit and Netlify deploy ID.
6. Verify canonical URLs, sitemap, robots, custom 404, page assets, Calendly
   date/time/details states and CMS. Do not submit a real booking.
7. Enable path-preserving 301 redirects from .com/www to the new verified apex.
   Test old URLs and legacy-page mappings; leave mail records unchanged.

## Rollback

The pre-v1.7 Git bundle was verified and restored at
`b26f2d4f59ad8dff11604b6b3819b8233dd0bf89`. Its location is documented in
IMPLEMENTATION.md. It preserves source/history, not hosted account settings.

Before deployment, capture Netlify's current published deployment ID and domain
settings. Roll back by republishing that exact deployment and reverting the
release source commit if necessary. If DNS changed, restore the captured web
record values and remove only the newly introduced web redirects. Never reset
mail records, remove the old domain, or delete/recreate the Google account.
Hosted rollback is not claimed tested until the corresponding account operations
have actually been exercised.
