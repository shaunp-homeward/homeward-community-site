# Netlify Post-Upgrade Deploy Status

Date: 2026-08-11

## Current GitHub state

- Repository: `shaunp-homeward/homeward-community-site`
- Approved V8 website commit: `a1706a10a13b56b050ba619c3d166ba98fec8198`
- Current `main`: `5871a8012e921bf49ab7138482ececa93da397bf`
- `main` contains only documentation-only deploy trigger commits on top of the approved V8 website commit; approved website content is unchanged.
- Rollback branches remain preserved:
  - `backup/main-pre-v8-launch-2026-08-11`
  - `backup/v8-final-approved-2026-08-11`
  - `backup/main-approved-v8-before-deploy-trigger-2026-08-11`

## Netlify state after credit upgrade

Homeward project:
- Project: `homeward-community-dfw`
- Site ID: `8e94a52c-8f1f-4f6e-9f75-8f9f233c6c22`
- Production domain: `https://homewardcommunity.com`
- Netlify still reports production deploy `6a76ba8c87fb24f2ac33baa5`, sourced from old commit `9eff77c325a046f149146d49da8374a9af5b7a77`.
- A new harmless GitHub push after the plan upgrade did not trigger a Netlify build.
- Direct Netlify MCP deployment was attempted from the exact approved V8 source artifact, but the local runtime cannot resolve external Netlify network endpoints, so the command cannot complete from this environment.

## Required Netlify UI action

Open `homeward-community-dfw` in Netlify.

1. Go to **Deploys**.
2. If you see **Activate builds**, click it first.
   - Alternate location: Project configuration > Build & deploy > Continuous deployment > Build settings > Configure > set Build status to **Active builds**.
3. Once builds are active, on Deploys choose **Trigger deploy** > **Deploy site** (or **Retry deploy with latest branch commit** if that option is presented).
4. The build must use the latest `main` HEAD (`5871a8012e921bf49ab7138482ececa93da397bf`), whose website tree descends from approved V8 commit `a1706a10...`.

## ChatGPT actions after user confirms the Netlify UI trigger

1. Query Netlify project state and identify the new production deploy ID.
2. Confirm deploy state reaches `ready` with no build error.
3. Confirm source is latest `main`, not old `9eff77c...`.
4. Verify production content against approved V8 sections.
5. Verify `/admin/` loads and document production CMS branch behavior before edits.
6. Verify lead function/form infrastructure without exposing secrets.
7. Report final GO/rollback status.
