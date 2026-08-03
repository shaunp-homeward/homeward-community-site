# V6.2.24 staging upload

## Base version

Apply `Homeward_Website_V6_2_24_Targeted_Update.zip` over V6.2.23 while preserving paths.

## Files changed

- `netlify/functions/lead.mjs`
- `package.json`
- `V6_2_24_CHANGELOG.md`
- `V6_2_24_STAGING_UPLOAD.md`

## Deploy and test

1. Commit the targeted update to the `staging` branch.
2. Wait for the Netlify branch deploy to finish.
3. Confirm `mail.homewardcommunity.com` is Verified in Resend.
4. Submit the staging homepage interest form using `shaun@homewardcommunity.com`.
5. Confirm a contact appears in Airtable with `Environment: staging branch test` in Notes.
6. Confirm Resend shows a `[STAGING TEST] New Homeward interest` email.
7. Complete the staging assessment and request the guide.
8. Confirm Resend shows a `[STAGING TEST] Your Homeward guide` email containing the online-guide and PDF links.

Temporary deploy previews remain sandboxed. Only the named `staging` branch writes to Airtable by default.
