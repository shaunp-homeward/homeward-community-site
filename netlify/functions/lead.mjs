// Homeward website lead capture -> Airtable Homeward CRM (Contacts table)
// Required Netlify environment variables:
// AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID

export default async (req) => {
  if (req.method !== "POST") return json({ ok: false, error: "method-not-allowed" }, 405);

  let data = {};
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) data = await req.json();
    else {
      const form = await req.formData();
      form.forEach((value, key) => { data[key] = typeof value === "string" ? value : String(value); });
    }
  } catch (_error) {
    return json({ ok: false, error: "invalid-form-data" }, 400);
  }

  const clean = (value) => String(value || "").trim();
  const first = clean(data.firstName);
  const last = clean(data.lastName);
  const email = clean(data.email);
  if (!email) return json({ ok: false, error: "email-required" }, 400);

  const name = [first, last].filter(Boolean).join(" ") || email.split("@")[0] || "Website Lead";
  const city = clean(data.city);
  const interestChoice = clean(data.interest);
  const draw = clean(data.draw);
  const formType = clean(data.form_type) || "interest";
  const assessmentStage = clean(data.assessment_stage);
  const season = clean(data.season);
  const movingToward = clean(data.moving_toward);
  const gathering = clean(data.gathering);
  const intent = clean(data.intent);
  const longings = clean(data.longings);
  const openNote = clean(data.open_note);
  const newsletter = clean(data.newsletter).toLowerCase() === "yes";
  const conversationRequested = /conversation|talk about|talk with|speak with/i.test(interestChoice);

  // Deploy previews and local development should not create live CRM records.
  // Set ALLOW_PREVIEW_AIRTABLE=true only when an intentional end-to-end test is needed.
  const deployContext = clean(Netlify.env.get("CONTEXT"));
  const requestHost = new URL(req.url).hostname;
  const previewHost = /localhost|127\.0\.0\.1|deploy-preview|--/.test(requestHost);
  const isPreview = (deployContext && deployContext !== "production") || previewHost;
  const allowPreviewWrite = clean(Netlify.env.get("ALLOW_PREVIEW_AIRTABLE")).toLowerCase() === "true";

  const attribution = {
    source: clean(data.utm_source).toLowerCase(),
    medium: clean(data.utm_medium),
    campaign: clean(data.utm_campaign),
    term: clean(data.utm_term),
    content: clean(data.utm_content),
    gclid: clean(data.gclid),
    fbclid: clean(data.fbclid),
    landing: clean(data.landing_page),
    referrer: clean(data.referrer),
  };

  let interested = [];
  let contactTypes = [];
  if (formType === "assessment") {
    if (/build|lead/i.test(intent)) interested = ["Circles", "Volunteering / Leadership"];
    else if (/circle|online/i.test(intent)) interested = ["Circles"];
    else if (/keep|posted/i.test(intent)) interested = ["Just Keep in Touch"];
  } else {
    if (/lead|co-host|host/i.test(interestChoice)) interested = ["Circles", "Volunteering / Leadership"];
    else if (/keep|informed|loop|touch/i.test(interestChoice)) interested = ["Just Keep in Touch"];
    else if (/circle/i.test(interestChoice)) interested = ["Circles"];
    else if (/meditation|practice/i.test(interestChoice)) interested = ["Just Keep in Touch"];
    if (/circle/i.test(interestChoice) || conversationRequested) contactTypes = ["Circle Prospect"];
  }

  let source = "Other";
  if (/meta|facebook|fb|instagram|ig/.test(attribution.source) || attribution.fbclid) source = "Social / Meta Ad";

  const notes = [];
  notes.push(formType === "assessment" ? "Website — Journey Reflection" : "Website — Interest form");
  if (interestChoice) notes.push(`Selected: ${interestChoice}`);
  if (conversationRequested) notes.push("Conversation requested: yes");
  if (draw) notes.push(`What they hope to find: ${draw}`);
  if (assessmentStage) notes.push(`Assessment stage: ${assessmentStage}${season ? ` (${season})` : ""}`);
  if (movingToward) notes.push(`Moving toward: ${movingToward}`);
  if (intent) notes.push(`Wants: ${intent}`);
  if (longings) notes.push(`Longing for: ${longings}`);
  if (gathering) notes.push(`Gathering: ${gathering}`);
  if (openNote) notes.push(`Their words: ${openNote}`);
  notes.push(`Newsletter opt-in: ${newsletter ? "yes" : "no"}`);
  const utmSummary = [attribution.source, attribution.medium, attribution.campaign, attribution.term, attribution.content].filter(Boolean).join(" / ");
  if (utmSummary) notes.push(`UTM: ${utmSummary}`);
  if (attribution.gclid) notes.push(`gclid: ${attribution.gclid}`);
  if (attribution.fbclid) notes.push(`fbclid: ${attribution.fbclid}`);
  if (attribution.landing) notes.push(`Original landing page: ${attribution.landing}`);
  if (attribution.referrer) notes.push(`Original referrer: ${attribution.referrer}`);

  const fields = {
    "Name": name,
    "Email": email,
    "Source": source,
    "Stage": "New Lead",
    "Email Consent": true,
    "Newsletter Opt-in": newsletter,
    "Conversation Requested": conversationRequested,
    "Notes": notes.join("\n"),
    "Date Added": new Date().toISOString().slice(0, 10),
  };
  if (city) fields["City"] = city;
  if (interested.length) fields["Interested In"] = interested;
  if (contactTypes.length) fields["Contact Type"] = contactTypes;

  const validStages = ["Inherited Faith", "Honest Questions", "Sacred Search", "New Foundations", "Embodied Faith", "Living Awake"];
  if (validStages.includes(assessmentStage)) fields["Assessment Stage"] = assessmentStage;
  const validGathering = ["DFW — open to in person", "DFW — prefer online", "Outside DFW — online"];
  if (validGathering.includes(gathering)) fields["Gathering Preference"] = gathering;

  if (isPreview && !allowPreviewWrite) {
    console.log("Homeward preview lead captured without Airtable write", { formType, interestChoice, conversationRequested });
    return json({ ok: true, preview: true, conversationRequested }, 200);
  }

  const token = Netlify.env.get("AIRTABLE_TOKEN");
  const baseId = Netlify.env.get("AIRTABLE_BASE_ID");
  const tableId = Netlify.env.get("AIRTABLE_TABLE_ID");
  if (!token || !baseId || !tableId) return json({ ok: false, error: "airtable-not-configured" }, 503);

  try {
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("Airtable error", response.status, detail);
      return json({ ok: false, error: "airtable-write-failed" }, 502);
    }
    return json({ ok: true, conversationRequested }, 200);
  } catch (error) {
    console.error("Airtable fetch failed", error);
    return json({ ok: false, error: "airtable-fetch-failed" }, 502);
  }
};

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export const config = { path: "/api/lead" };
