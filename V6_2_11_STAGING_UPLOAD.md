# V6.2.11 staging upload

Apply the targeted update to the current V6.2.10 staging branch, preserving the folder structure, then allow Netlify to run the existing `npm run build` command.

## Changed files

- `content/home.json`
- `src/index.template.html`
- `styles.css`
- `assets/founder-headshot.jpg`
- `package.json`
- `scripts/build.mjs`
- `V6_2_11_CHANGELOG.md`
- `V6_2_11_STAGING_UPLOAD.md`

## Staging checks

1. Hero background, headline, subheadline, and Reflection outline button are unchanged.
2. Hero copper button says **Have a Conversation** and opens Calendly.
3. The six recognition questions are unchanged.
4. The new Deep Forest invitation strip appears immediately below those questions and stacks on mobile.
5. Circle badge says **Registration is open · Space is limited** and both original Circle buttons remain.
6. Founder note appears after **We gather to remember** and before the interest form.
7. FAQ appears before Future Vision.
8. Final CTA contains exactly two buttons.
9. Homepage nav, mobile menu, footer, and mobile-header CTA use **Have a Conversation**.
10. Interest form, assessment pages, Journey pages, redirects, and Netlify functions still work.
