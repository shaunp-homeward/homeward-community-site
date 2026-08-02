# Homeward V6.2.12 — Circles Copy and Conversation Labels

Apply the targeted ZIP to the current V6.2.11 staging branch, preserving the folder structure. Netlify should continue using the existing `npm run build` command.

## Included changes

- Exact user-supplied Circles copy updates in `content/circles.json`.
- About-page community button updated in `content/about.json`.
- Calendar-opening call buttons standardized to **Have a Conversation** across the site.
- Safe support for the supplied `<em>` and `<br>` markup in the Circle sample session.
- Version/build metadata advanced to V6.2.12.

## Not changed

- Colors
- Fonts
- Layouts
- Section order
- Calendar behavior or URL
- Forms, Airtable, Netlify functions, Journey guides, PDFs, or resource content

## Test after deployment

1. Open `/circles` and verify the revised eight-week description, gathering rhythm, and sample session.
2. Confirm the italicized words in the sample session render correctly.
3. Confirm the new “Commit beyond eight weeks…” item appears under “You do not need to…”.
4. Open `/about` and verify the community CTA reads “Have a Conversation.”
5. Check the desktop nav, mobile menu, footer, and interest prompt on several pages. Calendar buttons should all read “Have a Conversation.”
