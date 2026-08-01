# Upload Homeward V6.1 to the staging branch

1. In GitHub, open `shaunp-homeward/homeward-community-site`.
2. Confirm the branch dropdown says `staging` — not `main`.
3. Choose **Add file → Upload files**.
4. Extract the V6.1 update ZIP on your computer.
5. Drag everything inside the extracted folder into GitHub. Keep the folders (`admin`, `assets`, `content`, `scripts`, and `src`) intact.
6. Use commit message: `Update staging to Homeward V6.1`.
7. Choose **Commit directly to the staging branch** and commit.
8. Netlify should rebuild the staging site automatically within a few minutes.
9. Review: `https://staging--homeward-community-dfw.netlify.app`
10. Open the expanded editor: `https://staging--homeward-community-dfw.netlify.app/admin/`

The live `main` branch is not changed by this upload.
