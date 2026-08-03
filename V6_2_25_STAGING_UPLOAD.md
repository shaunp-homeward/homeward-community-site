# V6.2.25 staging upload

## Base version

Apply `Homeward_Website_V6_2_25_Targeted_Update.zip` over V6.2.24 while preserving paths.

## Files changed

- `journey-sacred-search.html`
- `resources-sacred-search.html`
- `resources.html`
- `assets/sacred-search/book_universal_christ.svg` (included to guarantee the asset is present)
- `package.json`
- `V6_2_25_CHANGELOG.md`
- `V6_2_25_STAGING_UPLOAD.md`

## Test

1. Commit the update to the `staging` branch.
2. Wait for Netlify to publish the branch deploy.
3. Open `/resources/sacred-search` and confirm *The Universal Christ* cover displays.
4. Also spot-check `/journey/sacred-search` and `/resources`.
5. No email or form retesting is required for this image-only change.
