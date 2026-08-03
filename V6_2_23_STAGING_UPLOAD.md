# V6.2.23 staging upload

## Base version

Apply `Homeward_Website_V6_2_23_Targeted_Update.zip` over V6.2.22 while preserving paths.

## Files changed

- `netlify/functions/lead.mjs`
- `package.json`
- `V6_2_23_CHANGELOG.md`
- `V6_2_23_STAGING_UPLOAD.md`
- `EMAIL_SETUP.md`

## Deploy sequence

1. Upload/commit the targeted update to the `staging` branch.
2. Confirm Netlify completes the build.
3. Complete the Resend/DNS steps in `EMAIL_SETUP.md`.
4. Add `RESEND_API_KEY` in Netlify and redeploy after the variable is saved.
5. Run both staging tests using `shaun@homewardcommunity.com`.
6. Promote to production only after both emails arrive.

## Expected behavior

- Staging submissions do not write to Airtable unless `ALLOW_PREVIEW_AIRTABLE=true` is intentionally configured.
- Staging email is restricted to the allowlisted test recipient.
- Production interest submissions write to Airtable and email Shaun.
- Production assessment submissions write to Airtable and email the participant their online guide and PDF link.
