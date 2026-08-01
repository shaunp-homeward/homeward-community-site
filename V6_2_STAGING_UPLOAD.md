# Publish Homeward V6.2 to Staging

1. Download and extract `Homeward_Website_V6_2_Update_Only.zip`.
2. In GitHub, open `shaunp-homeward/homeward-community-site`.
3. Confirm the branch selector says **staging**.
4. Choose **Add file → Upload files**.
5. Drag all files and folders from inside the extracted update folder into GitHub.
6. Use the commit message: `Update staging to Homeward V6.2`.
7. Commit directly to the **staging** branch.
8. Wait for Netlify to finish the branch deployment.
9. Review: `https://staging--homeward-community-dfw.netlify.app`
10. Hard refresh with `Ctrl + Shift + R` if the previous version is cached.

The update preserves the Netlify functions, Airtable environment variables, Google Analytics production-only configuration, attribution capture, Calendly flow, QR redirects, and Decap CMS content files.
