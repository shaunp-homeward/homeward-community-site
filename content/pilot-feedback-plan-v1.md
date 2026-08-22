# Homeward Pilot Feedback & Measurement Plan v1

Date: 2026-08-22

## Recommendation

Launch feedback as a **Homeward-branded responsive web experience connected to Airtable**. Do not build a native App Store app yet.

Why: the first pilots need fast learning, low friction, clean data, and consistent branding. A mobile web survey can be opened from QR, text, email, or the Homeward site and can later become an installable PWA or native app if repeated participant behavior proves that is useful.

## Week 4 participant survey

Intro:

> Thank you for helping shape Homeward. This should take about four minutes. There are no right answers—we want to understand what served you, what did not, and what we should improve.

1. **I would participate in another Homeward season.** 1–5
2. **How likely are you to recommend a Homeward Circle to someone you know?** 0–10
3. **On how many days in the past week did you use a practice you experienced through Homeward?** 0–7
4. **I felt known and able to be myself in this group.** 1–5
5. **The way we listened and talked with one another felt meaningful.** 1–5
6. **The Circle helped me become more attentive to God in ordinary life.** 1–5
7. **Which practices are you most likely to keep using?** Select all that apply from practices used in the season.
8. **What mattered most to you about these four weeks?** Open response.
9. **What would you change to make the experience better?** Open response.
10. **What would you like to do next?** Another Circle / Take a pause / Explore practices on my own / Learn about helping lead a Circle / Not sure yet.

## Leader / champion add-on

- Would you host another Homeward Circle in your church or community? Yes / Maybe / No
- Would you personally consider leading or co-leading a Homeward Circle? Yes / Maybe / No
- Did Homeward feel complementary to your church/community rather than competitive with it? 1–5
- Did the four-week pilot create more staff work than expected? Less / Expected / More
- Which outcome felt most valuable? Spiritual formation / Contemplative practice / Connection / Leader renewal / Re-engagement / Leadership development / Other
- What would you need to see or understand before recommending another Circle?
- Is there another leader or community you would feel comfortable introducing to Homeward? Yes / Maybe / No
- If yes, who or what type of community? Optional.

## Facilitator debrief

- Where did the group feel most alive?
- Where did energy or trust drop?
- Which practice generated the most engagement?
- Which practice continued most naturally between meetings?
- Who demonstrated the posture of a potential Circle leader: listening, humility, steadiness, curiosity, and care?
- Where did the Leader Guide help or constrain?
- What content felt too long, intellectual, vague, or churchy?
- What one change would most improve the next Circle?

## Movement behavior metrics

Track behavior separately from survey scores:

- **Returned** — participant enters another season.
- **Practiced** — participant reports using a practice between gatherings.
- **Referred** — participant or leader introduces another person.
- **Hosted** — church/community hosts another Circle.
- **Apprenticed** — participant begins the leader pathway.
- **Led** — apprentice facilitates a Homeward Circle.

## Early directional signals

These are not statistical thresholds; Circle samples are too small.

- Roughly 70%+ say they would participate again.
- Belonging, conversation quality, and spiritual depth cluster around 4/5 or higher.
- At least half use a Homeward practice more than once between meetings by Week 4.
- Each healthy Circle reveals at least one plausible future host, apprentice, or referral pathway.
- Church leaders describe Homeward as complementary rather than competitive.
- Open-ended language begins repeating; repeated participant language should inform future website copy.

## V1 implementation

### Recommended: Homeward web survey

- Add a `/feedback` page to the Homeward site.
- Use hidden fields for Circle ID, season, respondent role, and survey point.
- Submit through a Netlify function into Airtable.
- Use a QR code at the final gathering and follow with the same link by text/email.
- Keep the experience mobile-first and short.
- Allow anonymous feedback where appropriate; do not attach sensitive spiritual reflections to named CRM contacts unless necessary.

### Best no-code fallback: Fillout

Fillout can create or update Airtable records, supports branching and pre-filled/update workflows, and can be branded and embedded.

### Other fallback: Tally

Tally offers a direct Airtable integration and is a strong lightweight form option.

### Native Airtable forms

Fine for internal prototypes, but not the preferred participant experience.

### Native iOS/Android app

Not yet. Build a broader Homeward app only after actual usage shows demand for features such as guided practice audio/timers, journaling, leader resources, Circle communication, and ongoing practice support.

## Suggested Airtable table

Create a dedicated **Pilot Feedback** table linked to Circles, with optional links to Contacts.

Recommended fields:
- Feedback ID
- Circle
- Season / cohort
- Participant (optional)
- Anonymous
- Respondent role
- Survey point
- Return intent
- Recommend score
- Practice days
- Belonging
- Conversation quality
- Spiritual depth
- Practices to continue
- Most meaningful
- What to improve
- Next step
- Host again
- Consider leading
- Referral available
- Submitted at

## Rollout

**First pilots:** build the feedback table and Week 4 survey; review manually after every Circle.

**After 3–5 Circles:** simplify weak questions, identify repeated language, and create a small dashboard.

**After multiplication begins:** add leader/facilitator feedback and basic longitudinal tracking.

**Only when behavior justifies it:** consider an installable PWA or native Homeward app.

> Build the learning loop now. Build the app only when repeated participant behavior tells us what the app needs to be.
