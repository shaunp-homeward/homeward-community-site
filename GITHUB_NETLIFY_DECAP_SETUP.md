# Homeward Website — GitHub, Netlify Staging, and Decap CMS Setup

Most of V6 is already prepared. The remaining steps require account-level authorization that only the account owner can complete.

## 1. Create or choose the GitHub repository

Recommended private repository name:

`homeward-community-site`

The connected ChatGPT GitHub app currently reports **no installed repository access**, so it cannot create branches or push V6 yet.

Manual step:
1. In GitHub, create the private repository above, or choose an existing repository.
2. Open ChatGPT **Settings → Apps → GitHub** and grant the GitHub app access to that repository.
3. Return to this chat and provide the repository name in `owner/repository` format.

After that, ChatGPT can upload V6, create a `staging` branch, open pull requests, and manage revisions.

## 2. Connect the existing Netlify project to GitHub

Use the existing Netlify project:
- Project: `homeward-community-dfw`
- Live domain: `homewardcommunity.com`

Manual step in Netlify:
1. Open **Project configuration → Build & deploy → Continuous deployment**.
2. Choose **Link repository** and select the GitHub repository.
3. Production branch: `main`.
4. Build command and publish directory are already defined in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`

## 3. Create the review sandbox

In Netlify:
1. Open **Project configuration → Build & deploy → Continuous Deployment → Branches and deploy contexts**.
2. Enable branch deploys for the branch `staging`.
3. Keep Deploy Previews enabled for pull requests.
4. Under **Collaboration tools**, enable the Netlify Drawer for the `staging` branch if you want on-page comments.

This creates:
- Live: `main` → `homewardcommunity.com`
- Stable sandbox: `staging` → a Netlify branch URL
- Individual revisions: pull request → a unique Deploy Preview URL

## 4. Enable Decap CMS

In Netlify:
1. Open **Integrations → Identity → Netlify Identity** and enable it.
2. Set registration to **Invite only**.
3. Enable **Git Gateway** under Identity services.
4. Invite your email as an Identity user.
5. Open `https://homewardcommunity.com/admin/` and accept the invitation.

The CMS is configured to use editorial workflow. Saving a draft creates a branch and pull request; publishing merges it into `main`.

## 5. Airtable security and preview behavior

The live Airtable integration is preserved. V6 prevents local, staging, and Deploy Preview form tests from creating real CRM records unless `ALLOW_PREVIEW_AIRTABLE=true` is intentionally set.

Security manual step:
1. In Netlify environment variables, rotate the current Airtable personal access token because it was previously stored as a non-secret value.
2. Save the new `AIRTABLE_TOKEN` as a **secret**, scoped to Functions/Runtime.
3. Keep these existing variables:
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_TABLE_ID`
   - `AIRTABLE_QR_TABLE_ID`

## 6. Analytics

V6 keeps Google Analytics ID `G-EDK2LGMJZG`, but the build only inserts it in the production context. Branch and preview traffic will not pollute live analytics.

Optional Netlify variable:
- `HOMEWARD_GA_ID=G-EDK2LGMJZG`

The code already falls back to this ID if the variable is not set.
