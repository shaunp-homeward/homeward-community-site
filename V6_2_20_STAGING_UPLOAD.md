# V6.2.20 staging upload

This targeted package is intentionally based on **V6.2.17** because V6.2.18 and V6.2.19 were not installed. It combines both releases with the new V6.2.20 changes.

1. Open the `staging` branch in GitHub.
2. Upload the contents of `Homeward_Website_V6_2_20_Targeted_Update.zip`, preserving folders.
3. Commit the upload to `staging`.
4. Wait for the Netlify branch deploy to finish.
5. Test the homepage, Circles page, Practices page, `/admin/`, and one interest-form submission.

## What to verify on staging

- Future Vision is hidden on the homepage but the full Vision page still works.
- The homepage shows three practices plus the “and more” invitation.
- Homepage and Circles page show: in person in the Fort Worth area or online, no cost, six to eight people, eight weeks.
- The interest form asks for ZIP and Circle-format preference.
- The Practices FAQ opens and closes correctly.
- Decap shows section visibility switches, button text fields, new logistics copy, ZIP/form fields, and the Practices FAQ.

## Airtable test

The existing Homeward CRM fields are reused; no Airtable schema change is required:

- `ZIP`
- `City`
- `Gathering Preference`

On a production submission, the function stores the submitted ZIP, looks up its city, and writes the city when the lookup succeeds. Failure of the lookup never blocks the form. The four visitor-facing choices map to the existing Airtable categories; the exact visitor answer is also preserved in Notes.

Preview/branch deploys do not write to live Airtable unless `ALLOW_PREVIEW_AIRTABLE=true` is configured. This safety behavior is unchanged.

## Calendly question

The website form now asks the preferred Circle format. Calendly’s booking questions live inside Calendly and cannot be changed by this source package. Add this question manually to the 30-minute event type so direct calendar bookings also capture it:

**If you joined a Circle, what would work best?**

- In person in the Fort Worth area
- Online
- Either would work for me
- I’m not sure yet
