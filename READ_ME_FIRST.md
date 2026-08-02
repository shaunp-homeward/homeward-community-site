# Homeward V6.2.13

This is a narrow mobile-header hotfix built on V6.2.12.

## Recommended deployment

Upload the contents of `Homeward_Website_V6_2_13_Targeted_Update.zip` to the current staging branch, preserving folder structure. Netlify should run the existing build command automatically.

The patch changes only:

- `src/index.template.html`
- `styles.css`
- `package.json`
- V6.2.13 documentation

Desktop continues to show **Have a Conversation**. The compact mobile homepage header shows **Let’s Talk** and has corrected sizing to prevent horizontal overflow.
