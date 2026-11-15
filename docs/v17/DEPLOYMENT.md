# Verified v1.7 release

The website is live at **https://homewardcommunity.com**. Shaun authorized
launch and completed Netlify authorization. This is a website deployment,
separate from publishing the development environment.

- Repository: `shaunp-homeward/homeward-community-site`.
- Merged PR: https://github.com/shaunp-homeward/homeward-community-site/pull/44 .
- Release source: `670e7023b11fa21479aa21ee40f91745faece99b`.
- Netlify site: `homeward-community-dfw`, ID `8e94a52c-8f1f-4f6e-9f75-8f9f233c6c22`.
- Initial production deploy: `6af50dd3d2124ed29f2ae3e8`, published November 11,
  2026 at 6:52:48 p.m. America/Chicago (`2026-11-12T00:52:48.157Z`).
- Previous deploy retained: `6ac86159cdb8b80008d871f4`. Its immutable deployed
  URL was fetched successfully and shows the previous website. Rollback was
  not performed on the live site.

## Verified behavior

All nine production routes passed browser checks at 390, 768 and 1440 pixels,
with fonts loaded, no horizontal overflow, broken page images or page-script
errors. Navigation and browser history passed. Live homepage, Practices,
scheduling, CMS login, robots, sitemap, old About redirect and unknown-route
404 were checked. Production canonical URLs and sitemap use the working .com
address; the editor remains noindex. All unsupported outcome percentages are
excluded from the public Practices panels.

Calendly date/time selection and details form passed at all three widths,
including visibility of the entire submission button after automatic resizing.
No real booking or email was submitted. The live CMS login reaches GitHub's
sign-in for Homeward Content Editor. Authenticated content editing, editorial
publishing and rollback through that UI remain untested.

The production source was merged into CMS staging without losing its unique
existing changes: staging commit `f9366ba24ef27f266c99f52ef9fecbd8cc34de65`.
Existing hosted Airtable and Resend bindings were verified by names/scopes and
preserved; their values were not copied into source or logs. Existing Google
MX remains `1 smtp.google.com`.

## Finish the .org domain transition

Netlify has accepted `homewardcharities.org` and `www.homewardcharities.org`
as aliases. GoDaddy DNS still points them at their previous targets. Registrar
access or a user-applied DNS edit is required; no credential should be pasted
into chat.

In GoDaddy DNS for **homewardcharities.org**:

| Type | Name | Required value | Change |
| --- | --- | --- | --- |
| A | @ | `75.2.60.5` | Replace both old apex A records, `3.33.130.190` and `15.197.148.33`, with this one Netlify load-balancer record |
| CNAME | www | `homeward-community-dfw.netlify.app` | Replace the current `homewardcharities.org` target |

The apex fallback address is documented by Netlify:
https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/ .
Keep existing nameservers, MX, TXT, SPF, DKIM, DMARC and Google Workspace
settings. No mailbox migration or new address is necessary for this website step.

After DNS changes propagate: verify apex/www HTTPS and Netlify certificate;
make .org primary in the same Netlify site; change the build-only production
variable HOMEWARD_SITE_URL from `https://homewardcommunity.com` to
`https://homewardcharities.org`; rebuild and verify canonical/sitemap; then
enable and test permanent path-preserving .com/www redirects. Until then keep
the working .com address and its correct canonical URLs.

The shared Calendly event still lacks the optional `Your organization`
question. An authenticated account edit is needed; preserve the existing
meeting title and preparation question. No new plugin is required.
