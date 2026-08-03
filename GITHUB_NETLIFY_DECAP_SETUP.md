# Homeward — GitHub, Netlify Staging, and Decap CMS

## Current architecture

- GitHub repository: `shaunp-homeward/homeward-community-site`
- Production branch: `main`
- CMS publication branch: `staging`
- Netlify project: `homeward-community-dfw`
- Live domain: `https://homewardcommunity.com`
- Staging domain: `https://staging--homeward-community-dfw.netlify.app`
- Staging editor: `https://staging--homeward-community-dfw.netlify.app/admin/`

## Decap authentication

The site uses Decap’s direct GitHub backend, not Git Gateway:

```yaml
backend:
  name: github
  repo: shaunp-homeward/homeward-community-site
  branch: staging
  squash_merges: true
  use_graphql: true
publish_mode: editorial_workflow
```

Editors log in with GitHub and must have write access to the repository.

### One-time OAuth setup, if login is not already working

1. In GitHub, create an OAuth App.
2. Use `https://api.netlify.com/auth/done` as the Authorization callback URL.
3. Copy the GitHub Client ID and Client Secret.
4. In Netlify, open **Project configuration → Access & security → OAuth**.
5. Install the GitHub authentication provider and enter the credentials.
6. Return to the staging `/admin/` page and log in with GitHub.

## Editorial workflow

Saving a draft creates a CMS branch and pull request. Publishing merges it into `staging`. Netlify then rebuilds the staging branch site. Once the change is reviewed, merge `staging` into `main` to update the live website.

The configured branch controls where Decap writes. Therefore, even the live-domain `/admin/` page continues to write to `staging`. This is intentional and keeps the live site behind a review step.

## Build settings

The repository already contains the Netlify settings:

- Build command: `npm run build`
- Publish directory: `dist`
- Node: 20+

## Scope of the CMS

V6.2.18 exposes most copy, button labels, core button destinations, form wording, assessment wording, metadata, and 22 additional static pages. Technical logic and visual structure remain protected.
