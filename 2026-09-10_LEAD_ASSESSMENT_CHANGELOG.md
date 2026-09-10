# Homeward lead + Journey Reflection update — 2026-09-10

Small production update; no site redesign or curriculum/content changes.

## Lead capture

- Added case-insensitive Airtable contact lookup by email before record creation.
- Existing contacts are updated rather than duplicated.
- Existing-contact updates are intentionally limited to:
  - Assessment Stage when supplied and valid.
  - Gathering Preference only when the existing field is blank.
  - Notes, with the newest submission prepended as a date-stamped block.
- Existing Name, Stage, Source, Segment, Contact Type, Date Added, and Interested In are not overwritten.
- New contacts continue to be created with the current date.

## Assessment notifications

- Journey Reflection submissions now send a notification to `HOMEWARD_NOTIFICATION_EMAIL` in addition to the participant guide email.
- The notification includes name, email, assessment stage, moving-toward stage, wants, longings, gathering preference, open note, Airtable record link, and whether the submission matched an existing contact or created a new lead.

## Analytics

- Added `journey_reflection_result` with `assessment_stage` only when the result screen renders.
- No PII is included in the result-view analytics event.
- Existing `journey_reflection_complete` remains the successful-submit event.
