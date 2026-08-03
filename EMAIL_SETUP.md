# Homeward email setup

V6.2.23 uses one Resend account for two transactional-email jobs:

1. Send a participant their assessment guide, including both the online guide and PDF link.
2. Notify Shaun when someone submits the homepage interest form.

## Netlify variables

The code uses these variables:

- `RESEND_API_KEY` — secret; create this in Resend.
- `HOMEWARD_FROM_EMAIL` — recommended: `Homeward <hello@mail.homewardcommunity.com>`.
- `HOMEWARD_REPLY_TO` — `shaun@homewardcommunity.com`.
- `HOMEWARD_NOTIFICATION_EMAIL` — `shaun@homewardcommunity.com`.
- `ALLOW_PREVIEW_EMAIL` — `true` to allow controlled staging tests.
- `PREVIEW_EMAIL_RECIPIENTS` — comma-separated allowed staging test addresses, currently `shaun@homewardcommunity.com`.

The site remains compatible with the older variable names `ASSESSMENT_FROM_EMAIL` and `ASSESSMENT_REPLY_TO`, but the new shared names are preferred.

## Resend setup

1. Create a Resend account.
2. Add the sending domain `mail.homewardcommunity.com`.
3. Add the DNS records Resend displays at the company that manages DNS for `homewardcommunity.com`.
4. Wait until Resend shows the domain as **Verified**.
5. Create a **Sending access** API key named `Homeward Website Production`.
6. In Netlify, add the API key as `RESEND_API_KEY`, mark it secret, and scope it to Functions/Runtime.
7. Trigger a new deploy. Netlify Functions use the environment variables available at deploy time.

## Staging test

After the V6.2.23 patch and environment variables are deployed:

- Submit the interest form on staging using `shaun@homewardcommunity.com`. Airtable is not changed, but Shaun should receive a notification with `[STAGING TEST]` in the subject.
- Complete the assessment on staging and enter `shaun@homewardcommunity.com`. The result email should contain both **Read your guide online** and **Download the printable PDF**.
- Using another address on staging intentionally suppresses email unless it is added to `PREVIEW_EMAIL_RECIPIENTS`.

## Production test

After staging passes and the release is promoted:

- Submit one real interest-form test and confirm a contact is created in Airtable and the notification reaches Shaun.
- Complete one assessment and confirm the contact is created in Airtable and the participant receives both guide links.
- Review Netlify → Logs & Metrics → Functions → `lead` and Resend → Emails if either message is missing.
