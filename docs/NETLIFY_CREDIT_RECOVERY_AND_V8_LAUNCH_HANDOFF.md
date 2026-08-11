# Netlify Credit Recovery and V8 Launch Handoff

Date: 2026-08-11

## Current state

- Repository: `shaunp-homeward/homeward-community-site`
- Approved V8 launch commit: `a1706a10a13b56b050ba619c3d166ba98fec8198`
- Current `main`: `23b12cd0eed89e2a745c003f1181bc5f902e36fa`
  - This is a documentation-only deploy-trigger commit whose parent is the approved V8 launch commit.
  - No approved V8 website content was changed by this trigger commit.
- Pre-V8 production rollback branch: `backup/main-pre-v8-launch-2026-08-11`
- Approved V8 backup branch: `backup/v8-final-approved-2026-08-11`
- Additional pre-deploy-trigger backup: `backup/main-approved-v8-before-deploy-trigger-2026-08-11`
- V8 QA GitHub Actions run for `a1706a10...` completed successfully.

## Netlify state before credit upgrade

Homeward project:
- Project name: `homeward-community-dfw`
- Site ID: `8e94a52c-8f1f-4f6e-9f75-8f9f233c6c22`
- Production domain: `https://homewardcommunity.com`
- Netlify was still reporting old production deploy `6a76ba8c87fb24f2ac33baa5` from commit `9eff77c325a046f149146d49da8374a9af5b7a77` because the team ran out of Netlify credits before the V8 production publish could complete.

Old project the owner intends to disable:
- Project name: `dfw-spiritual-community`
- Site ID: `cd082a32-773e-495b-b0ad-6e6d556ccb92`

## User actions before resuming

1. Disable `dfw-spiritual-community` in Netlify:
   - Project configuration
   - General
   - Danger zone
   - Disable project

2. Add Netlify credits / upgrade plan in:
   - Usage & billing
   - Plan details
   - Change team plan

Recommended starting point for Homeward at current scale:
- Personal: 1,000 credits/month at current published pricing, with auto recharge left OFF initially.
- If several active sites will share the same team or traffic grows materially, consider Pro instead.

## Actions for ChatGPT immediately after user says the upgrade is complete

1. Re-read Netlify project `homeward-community-dfw` and confirm the team is no longer credit-paused.
2. Confirm GitHub `main` still points to `23b12cd0eed89e2a745c003f1181bc5f902e36fa` (or another explicitly approved descendant) and that its parent contains approved V8 commit `a1706a10a13b56b050ba619c3d166ba98fec8198`.
3. Trigger a production deployment for Netlify site ID `8e94a52c-8f1f-4f6e-9f75-8f9f233c6c22` using the connected Netlify deployment path.
4. Confirm the production deploy reaches `ready` and no build error is reported.
5. Confirm the production deploy is sourced from current `main`, not the old `9eff77c...` V7.1 deploy.
6. Verify `https://homewardcommunity.com` visually/content-wise against the approved V8 launch candidate, especially:
   - V8 hero and four-week Finding Home framing
   - dark forest-green `Three simple steps. No pressure.` join section
   - `Ancient practices. Everyday change.` section
   - founder section
   - interest form
   - Journey Reflection
   - FAQ
7. Verify `/admin/` loads and that production CMS behavior is understood before making any production edits. Do not change CMS branch policy during launch verification unless specifically approved.
8. Verify lead form/function behavior after the deployment without exposing secrets.
9. Report final GO status and preserve rollback branches.

## Security follow-up after launch is stable

- Rotate the Airtable token currently present in Netlify environment variables and store the replacement as a secret.
- Do not do this during the launch itself unless required, to avoid introducing a new integration risk.
