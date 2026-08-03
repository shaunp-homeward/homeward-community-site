# Homeward Content Editor Guide

The editor is **Decap CMS**. It stores copy changes in GitHub and lets Netlify rebuild the staging site automatically.

## Open the staging editor

`https://staging--homeward-community-dfw.netlify.app/admin/`

Log in with the GitHub account that has access to the Homeward repository.

## Main Site Content

### Global Site Copy
Edit the brand subline, navigation labels, footer wording, conversation labels, floating interest invitation, calendar accessibility wording, and image-viewer labels.

### Homepage
Edit virtually all homepage copy: hero, recognition questions, invitation banner, Circles preview, practices, faith journey, “We gather to remember,” founder note, form labels and choices, FAQ, future vision, and final calls to action. Main homepage button labels and destinations are editable.

Most major homepage groups now include **Show this section on the homepage**. Turning a section off hides it without deleting the content. Turn it back on and publish to restore it. Future Vision is initially off.

The Practices preview also gives each practice its own **Show this practice on the homepage** switch. The initial homepage shows three practices and an editable “and more” line; the full Practices page still shows the complete library.

The Circle preview includes editable logistics wording for format, cost, group size, and length.

### Interest Form
Edit the visible form labels, placeholders, options, helper text, submit button, privacy note, and success message. This includes:

- ZIP-code label, placeholder, and helper text
- Circle-format question and its four choices
- Interest choices
- Newsletter wording
- Success buttons and destinations

The Airtable field mapping and ZIP lookup stay protected in code so ordinary copy edits cannot break the CRM connection. Keep the meaning and order of the four Circle-format choices unless the code mapping is updated at the same time.

### Circles Page
Edit the full Circles narrative, the logistics line, gathering rhythm, sample session, fit lists, urgency wording, and all CTA labels/destinations.

### Practices Page
Edit the page introduction, practice cards, “how to begin” steps, the FAQ about traditions outside Christianity, community invitation, and CTA labels/destinations.

### Our Story Page
Edit the origin story, formation explanation, comparison cards, and final CTA.

### Conversation Page
Edit the page introduction, expectations, calendar wording, fallback text, and calendar URLs.

### Future Vision Page
Edit the introduction, each vision item, image descriptions, and closing note. Hiding the homepage preview does not delete or disable this full page.

### Journey Reflection / Assessment
Edit the visible assessment introduction, all eleven questions and answer wording, the six result descriptions, guide-capture messages, delivery-status messages, and button labels. Scoring remains protected so copy edits cannot break result calculation.

## Additional Page Copy

This collection exposes text and direct button/link labels across 22 existing pages:

- Six Journey result pages
- The full resource library and six stage-specific resource pages
- Six guided practice pages
- Privacy
- Sacred Search guide redirect
- 404 page

Each entry also includes the browser title and search description. Where a direct link can be safely changed, a destination field appears below its text.

## What remains protected

The editor intentionally does not expose visual layout, colors, fonts, responsive CSS, assessment scoring weights, CRM field names, form endpoints, server functions, redirects, analytics, or JavaScript behavior. Some complex book/media cards retain their existing destination structure even though their visible copy is editable.

## Safe editing habits

- Change copy freely, but keep button labels concise.
- Review long headlines on both desktop and mobile staging.
- Use the visibility switches instead of deleting sections you may want later.
- Do not replace a button destination unless the new destination has been tested.
- Use **Save Draft** while working and **Publish** only when ready for the staging site to rebuild.
- Always review staging before merging it into `main`.
