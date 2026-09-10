// Homeward website lead capture -> Airtable Homeward CRM (Contacts table)
// Required: AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID, RESEND_API_KEY, HOMEWARD_FROM_EMAIL

export default async (req) => {
  if (req.method !== "POST") return json({ ok: false, error: "method-not-allowed" }, 405);

  let data = {};
  try {
    if ((req.headers.get("content-type") || "").includes("application/json")) data = await req.json();
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
  const suppliedCity = clean(data.city);
  const zip = normalizeZip(data.zip || data.postal_code);
  const interestChoice = clean(data.interest);
  const draw = clean(data.draw);
  const formType = clean(data.form_type) || "interest";
  const assessmentStage = clean(data.assessment_stage);
  const season = clean(data.season);
  const movingToward = clean(data.moving_toward);
  const assessmentGathering = clean(data.gathering);
  const gatheringChoice = clean(data.gathering_preference);
  const intent = clean(data.intent);
  const longings = clean(data.longings);
  const openNote = clean(data.open_note);
  const newsletter = clean(data.newsletter).toLowerCase() === "yes";
  const conversationRequested = /conversation|talk about|talk with|speak with/i.test(interestChoice);

  const guides = {
    "Inherited Faith": ["Inherited Faith", "Receiving the gift, making it your own", "inherited-faith", "Homeward_Inherited_Faith_Guide.pdf"],
    "Honest Questions": ["Honest Questions", "Making room for what is true", "honest-questions", "Homeward_Honest_Questions_Guide.pdf"],
    "Sacred Search": ["The Sacred Search", "Seeking with open hands", "sacred-search", "Homeward_Sacred_Search_Guide.pdf"],
    "New Foundations": ["New Foundations", "Rebuilding with humility and hope", "new-foundations", "Homeward_New_Foundations_Guide.pdf"],
    "Embodied Faith": ["Embodied Faith", "Letting faith become a way of life", "embodied-faith", "Homeward_Embodied_Faith_Guide.pdf"],
    "Living Awake": ["Living Awake", "Present to God, available to love", "living-awake", "Homeward_Living_Awake_Guide.pdf"],
  };
  const guideParts = guides[assessmentStage];
  const guide = guideParts ? { title: guideParts[0], subtitle: guideParts[1], page: `/journey/${guideParts[2]}`, pdf: `/downloads/${guideParts[3]}` } : null;
  const requestOrigin = new URL(req.url).origin;
  const guideUrl = guide ? new URL(guide.page, requestOrigin).href : "";
  const guidePdfUrl = guide ? new URL(guide.pdf, requestOrigin).href : "";

  const deployContext = clean(Netlify.env.get("CONTEXT"));
  const requestHost = new URL(req.url).hostname;
  const previewHost = /localhost|127\.0\.0\.1|deploy-preview|--/.test(requestHost);
  const isPreview = (deployContext && deployContext !== "production") || previewHost;
  const branchName = clean(Netlify.env.get("BRANCH"));
  const isStagingBranch = /^staging--homeward-community-dfw\.netlify\.app$/i.test(requestHost)
    || (deployContext === "branch-deploy" && branchName.toLowerCase() === "staging");
  const allowPreviewWrite = isStagingBranch
    || clean(Netlify.env.get("ALLOW_PREVIEW_AIRTABLE")).toLowerCase() === "true";

  const zipLocation = zip ? await lookupUsZip(zip) : null;
  const city = suppliedCity || (zipLocation ? zipLocation.city : "");
  const gathering = normalizeGatheringPreference(assessmentGathering || gatheringChoice, zip);
  const attribution = {
    source: clean(data.utm_source).toLowerCase(), medium: clean(data.utm_medium), campaign: clean(data.utm_campaign),
    term: clean(data.utm_term), content: clean(data.utm_content), gclid: clean(data.gclid), fbclid: clean(data.fbclid),
    landing: clean(data.landing_page), referrer: clean(data.referrer),
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

  const notes = [formType === "assessment" ? "Website — Journey Reflection" : "Website — Interest form"];
  if (isStagingBranch) notes.push("Environment: staging branch test");
  if (interestChoice) notes.push(`Selected: ${interestChoice}`);
  if (conversationRequested) notes.push("Conversation requested: yes");
  if (draw) notes.push(`What they hope to find: ${draw}`);
  if (assessmentStage) notes.push(`Assessment stage: ${assessmentStage}${season ? ` (${season})` : ""}`);
  if (movingToward) notes.push(`Moving toward: ${movingToward}`);
  if (intent) notes.push(`Wants: ${intent}`);
  if (longings) notes.push(`Longing for: ${longings}`);
  if (zip) notes.push(`ZIP: ${zip}`);
  if (zipLocation) notes.push(`City from ZIP: ${zipLocation.city}, ${zipLocation.state}`);
  if (gatheringChoice) notes.push(`Circle format preference: ${gatheringChoice}`);
  if (assessmentGathering) notes.push(`Gathering: ${assessmentGathering}`);
  if (openNote) notes.push(`Their words: ${openNote}`);
  notes.push(`Newsletter opt-in: ${newsletter ? "yes" : "no"}`);
  const utmSummary = [attribution.source, attribution.medium, attribution.campaign, attribution.term, attribution.content].filter(Boolean).join(" / ");
  if (utmSummary) notes.push(`UTM: ${utmSummary}`);
  if (attribution.gclid) notes.push(`gclid: ${attribution.gclid}`);
  if (attribution.fbclid) notes.push(`fbclid: ${attribution.fbclid}`);
  if (attribution.landing) notes.push(`Original landing page: ${attribution.landing}`);
  if (attribution.referrer) notes.push(`Original referrer: ${attribution.referrer}`);

  const validStages = ["Inherited Faith", "Honest Questions", "Sacred Search", "New Foundations", "Embodied Faith", "Living Awake"];
  const validGathering = ["DFW — open to in person", "DFW — prefer online", "Outside DFW — online"];
  const fields = {
    Name: name, Email: email, Source: source, Stage: "New Lead", "Email Consent": true,
    "Newsletter Opt-in": newsletter, "Conversation Requested": conversationRequested,
    Notes: notes.join("\n"), "Date Added": new Date().toISOString().slice(0, 10),
  };
  if (zip) fields.ZIP = zip;
  if (city) fields.City = city;
  if (interested.length) fields["Interested In"] = interested;
  if (contactTypes.length) fields["Contact Type"] = contactTypes;
  if (validStages.includes(assessmentStage)) fields["Assessment Stage"] = assessmentStage;
  if (validGathering.includes(gathering)) fields["Gathering Preference"] = gathering;

  if (isPreview && !allowPreviewWrite) {
    const previewEmailAllowed = canSendPreviewEmail(email);
    let emailSent = false;
    let notificationSent = false;
    if (previewEmailAllowed && formType === "assessment" && guide) {
      emailSent = await sendGuideEmail({ email, firstName: first, guide, guideUrl, guidePdfUrl });
      notificationSent = await sendAssessmentNotification({ name, email, assessmentStage, movingToward, intent, longings, gathering: assessmentGathering || gathering, openNote, existingContact: false, preview: true });
    } else if (previewEmailAllowed && formType === "interest") {
      notificationSent = await sendInterestNotification({ name, email, zip, city, zipLocation, gatheringChoice, gathering, interestChoice, draw, newsletter, conversationRequested, attribution, notes: notes.join("\n"), preview: true });
    }
    return json({ ok: true, preview: true, conversationRequested, guideUrl, guidePdfUrl, emailSent, notificationSent }, 200);
  }

  const token = Netlify.env.get("AIRTABLE_TOKEN");
  const baseId = Netlify.env.get("AIRTABLE_BASE_ID");
  const tableId = Netlify.env.get("AIRTABLE_TABLE_ID");
  if (!token || !baseId || !tableId) return json({ ok: false, error: "airtable-not-configured" }, 503);

  try {
    const tableUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;
    const existingRecord = await findContact(tableUrl, token, email);
    const existingContact = Boolean(existingRecord?.id);
    let recordId = existingRecord?.id || "";

    if (existingContact) {
      const update = {};
      if (validStages.includes(assessmentStage)) update["Assessment Stage"] = assessmentStage;
      if (validGathering.includes(gathering) && blank(existingRecord.fields?.["Gathering Preference"])) update["Gathering Preference"] = gathering;
      const datedBlock = `[${new Date().toISOString().slice(0, 10)}] ${notes.join("\n")}`;
      update.Notes = [datedBlock, String(existingRecord.fields?.Notes || "").trim()].filter(Boolean).join("\n\n");
      const response = await fetch(`${tableUrl}/${encodeURIComponent(recordId)}`, {
        method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ fields: update, typecast: true }),
      });
      if (!response.ok) return airtableError(response, "update");
    } else {
      const response = await fetch(tableUrl, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ records: [{ fields }], typecast: true }),
      });
      if (!response.ok) return airtableError(response, "create");
      const payload = await response.json().catch(() => ({}));
      recordId = payload?.records?.[0]?.id || "";
    }

    let emailSent = false;
    let notificationSent = false;
    if (formType === "assessment") {
      if (guide) emailSent = await sendGuideEmail({ email, firstName: first, guide, guideUrl, guidePdfUrl, preview: isStagingBranch });
      notificationSent = await sendAssessmentNotification({
        name, email, assessmentStage, movingToward, intent, longings, gathering: assessmentGathering || gathering,
        openNote, recordId, baseId, tableId, existingContact, preview: isStagingBranch,
      });
    } else if (formType === "interest") {
      notificationSent = await sendInterestNotification({
        name, email, zip, city, zipLocation, gatheringChoice, gathering, interestChoice, draw, newsletter,
        conversationRequested, attribution, notes: notes.join("\n"), recordId, baseId, tableId, preview: isStagingBranch,
      });
    }
    return json({ ok: true, conversationRequested, guideUrl, guidePdfUrl, emailSent, notificationSent, existingContact }, 200);
  } catch (error) {
    console.error("Airtable fetch failed", error);
    return json({ ok: false, error: "airtable-fetch-failed" }, 502);
  }
};

async function findContact(tableUrl, token, email) {
  const escaped = String(email).replaceAll("\\", "\\\\").replaceAll("'", "\\'");
  const query = new URLSearchParams({ filterByFormula: `LOWER({Email})=LOWER('${escaped}')`, maxRecords: "1" });
  query.append("fields[]", "Notes");
  query.append("fields[]", "Gathering Preference");
  const response = await fetch(`${tableUrl}?${query}`, { method: "GET", headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Airtable lookup failed (${response.status}): ${detail.slice(0, 500)}`);
  }
  const payload = await response.json().catch(() => ({}));
  return payload.records?.[0] || null;
}

async function airtableError(response, action) {
  const detail = await response.text();
  console.error(`Airtable ${action} error`, response.status, detail);
  return json({ ok: false, error: "airtable-write-failed" }, 502);
}

function blank(value) {
  return Array.isArray(value) ? value.length === 0 : value == null || String(value).trim() === "";
}

function airtableLink(recordId, baseId, tableId) {
  return recordId && baseId && tableId ? `https://airtable.com/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}/${encodeURIComponent(recordId)}` : "";
}

async function sendGuideEmail({ email, firstName, guide, guideUrl, guidePdfUrl, preview = false }) {
  const config = getEmailConfig();
  if (!config.apiKey || !config.from) return false;
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hello,";
  const subject = `${preview ? "[STAGING TEST] " : ""}Your Homeward guide: ${guide.title}`;
  const html = `<!doctype html><html><body style="margin:0;background:#FAF6EF;color:#333;font-family:Arial,sans-serif"><div style="max-width:620px;margin:auto;padding:34px 24px"><div style="background:#153A2E;color:#FAF6EF;padding:32px"><h1 style="font-family:Georgia,serif">${escapeHtml(guide.title)}</h1><div>${escapeHtml(guide.subtitle)}</div></div><div style="background:white;padding:30px"><p>${greeting}</p><p>Thank you for taking the Homeward Journey Reflection. Your complete guide is ready.</p><p><a href="${escapeHtml(guideUrl)}">Read your guide online</a></p><p><a href="${escapeHtml(guidePdfUrl)}">Download the printable PDF →</a></p><p>Journeying Toward God. Together.<br><strong>Homeward</strong></p></div></div></body></html>`;
  const text = `${firstName ? `Hi ${firstName},` : "Hello,"}\n\nThank you for taking the Homeward Journey Reflection. Your complete ${guide.title.replace(/^The\s+/i, "")} guide is ready.\n\nRead online: ${guideUrl}\nDownload the PDF: ${guidePdfUrl}\n\nJourneying Toward God. Together.\nHomeward`;
  return sendViaResend({ to: email, subject, html, text, replyTo: config.replyTo, logLabel: "assessment guide" });
}

async function sendAssessmentNotification({ name, email, assessmentStage, movingToward, intent, longings, gathering, openNote, recordId, baseId, tableId, existingContact, preview }) {
  const config = getEmailConfig();
  if (!config.apiKey || !config.from || !config.notificationTo) return false;
  const status = existingContact ? "Existing contact" : "New lead";
  const link = airtableLink(recordId, baseId, tableId);
  const rows = [
    ["Contact status", status], ["Name", name], ["Email", email], ["Stage", assessmentStage || "Not provided"],
    ["Moving toward", movingToward || "Not provided"], ["Wants", intent || "Not provided"],
    ["Longings", longings || "Not provided"], ["Gathering", gathering || "Not provided"], ["Their open note", openNote || "None"],
  ];
  return sendNotification({
    config, email, preview, subject: `Homeward Journey Reflection — ${status.toLowerCase()} — ${name}`,
    heading: "HOMEWARD · JOURNEY REFLECTION", intro: `${status} submitted the Homeward Journey Reflection.`, rows, link,
    logLabel: "assessment notification",
  });
}

async function sendInterestNotification({ name, email, zip, city, zipLocation, gatheringChoice, gathering, interestChoice, draw, newsletter, conversationRequested, attribution, notes, recordId, baseId, tableId, preview }) {
  const config = getEmailConfig();
  if (!config.apiKey || !config.from || !config.notificationTo) return false;
  const location = [city, zipLocation?.state, zip].filter(Boolean).join(", ") || "Not provided";
  const rows = [
    ["Name", name], ["Email", email], ["Location", location], ["Preferred format", gatheringChoice || gathering || "Not provided"],
    ["Interested in", interestChoice || "Not provided"], ["What they hope to find", draw || "Not provided"],
    ["Conversation requested", conversationRequested ? "Yes" : "No"], ["Newsletter opt-in", newsletter ? "Yes" : "No"],
    ["Source", attribution?.source || "Direct / unknown"], ["Campaign", attribution?.campaign || "None"],
  ];
  return sendNotification({
    config, email, preview, subject: `New Homeward interest: ${name}`, heading: "HOMEWARD · WEBSITE INTEREST",
    intro: "A new person submitted the Homeward interest form.", rows, link: airtableLink(recordId, baseId, tableId), notes,
    logLabel: "interest notification",
  });
}

async function sendNotification({ config, email, preview, subject, heading, intro, rows, link, notes = "", logLabel }) {
  const prefixedSubject = `${preview ? "[STAGING TEST] " : ""}${subject}`;
  const rowHtml = rows.map(([label, value]) => `<tr><td style="padding:9px 12px;border-bottom:1px solid #E7E0D5;font-weight:700;color:#153A2E;vertical-align:top;width:180px">${escapeHtml(label)}</td><td style="padding:9px 12px;border-bottom:1px solid #E7E0D5;vertical-align:top">${escapeHtml(value)}</td></tr>`).join("");
  const reply = email ? `<p><a href="mailto:${escapeHtml(email)}">Reply to ${escapeHtml(rows.find(([label]) => label === "Name")?.[1] || "this person")}</a></p>` : "";
  const airtable = link ? `<p><a href="${escapeHtml(link)}">Open the Airtable contact →</a></p>` : "";
  const details = notes ? `<details><summary>Submission notes</summary><pre style="white-space:pre-wrap">${escapeHtml(notes)}</pre></details>` : "";
  const html = `<!doctype html><html><body style="margin:0;background:#FAF6EF;color:#333;font-family:Arial,sans-serif"><div style="max-width:680px;margin:auto;padding:34px 24px"><div style="background:#153A2E;color:#FAF6EF;padding:28px 30px"><div style="font-size:12px;letter-spacing:.18em;color:#E0A443;font-weight:700">${escapeHtml(heading)}</div></div><div style="background:white;padding:28px 30px"><p>${escapeHtml(intro)}${preview ? " (staging)" : ""}</p><table style="width:100%;border-collapse:collapse">${rowHtml}</table>${reply}${airtable}${details}</div></div></body></html>`;
  const textRows = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const text = `${intro}${preview ? " (staging)" : ""}\n\n${textRows}${link ? `\n\nAirtable: ${link}` : ""}${notes ? `\n\nSubmission notes:\n${notes}` : ""}`;
  return sendViaResend({ to: config.notificationTo, subject: prefixedSubject, html, text, replyTo: email || config.replyTo, logLabel });
}

function getEmailConfig() {
  return {
    apiKey: String(Netlify.env.get("RESEND_API_KEY") || "").trim(),
    from: String(Netlify.env.get("HOMEWARD_FROM_EMAIL") || Netlify.env.get("ASSESSMENT_FROM_EMAIL") || "Homeward <hello@mail.homewardcommunity.com>").trim(),
    replyTo: String(Netlify.env.get("HOMEWARD_REPLY_TO") || Netlify.env.get("ASSESSMENT_REPLY_TO") || "shaun@homewardcommunity.com").trim(),
    notificationTo: String(Netlify.env.get("HOMEWARD_NOTIFICATION_EMAIL") || "shaun@homewardcommunity.com").trim(),
  };
}

function canSendPreviewEmail(submittedEmail) {
  if (String(Netlify.env.get("ALLOW_PREVIEW_EMAIL") || "").trim().toLowerCase() !== "true") return false;
  return String(Netlify.env.get("PREVIEW_EMAIL_RECIPIENTS") || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean).includes(String(submittedEmail || "").trim().toLowerCase());
}

async function sendViaResend({ to, subject, html, text, replyTo, logLabel }) {
  const config = getEmailConfig();
  if (!config.apiKey || !config.from || !to) return false;
  try {
    const payload = { from: config.from, to: Array.isArray(to) ? to : [to], subject, html, text };
    if (replyTo) payload.reply_to = replyTo;
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const responseText = await response.text();
    if (!response.ok) { console.error(`${logLabel || "Email"} failed`, response.status, responseText); return false; }
    console.log(`${logLabel || "Email"} sent`, responseText);
    return true;
  } catch (error) {
    console.error(`${logLabel || "Email"} exception`, error);
    return false;
  }
}

function normalizeZip(value) {
  const match = String(value || "").trim().match(/\b(\d{5})(?:-\d{4})?\b/);
  return match ? match[1] : "";
}
function isLikelyDfwZip(zip) {
  const prefix = Number(String(zip || "").slice(0, 3));
  return (prefix >= 750 && prefix <= 754) || (prefix >= 760 && prefix <= 762);
}
function normalizeGatheringPreference(value, zip) {
  const raw = String(value || "").trim();
  if (["DFW — open to in person", "DFW — prefer online", "Outside DFW — online"].includes(raw)) return raw;
  const outsideDfw = zip && !isLikelyDfwZip(zip);
  if (/in person/i.test(raw)) return "DFW — open to in person";
  if (/either/i.test(raw)) return outsideDfw ? "Outside DFW — online" : "DFW — open to in person";
  if (/online/i.test(raw)) return outsideDfw ? "Outside DFW — online" : "DFW — prefer online";
  return "";
}
async function lookupUsZip(zip) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(zip)}`, { signal: controller.signal });
    if (!response.ok) return null;
    const payload = await response.json();
    const place = Array.isArray(payload.places) ? payload.places[0] : null;
    if (!place) return null;
    const city = String(place["place name"] || "").trim();
    const state = String(place["state abbreviation"] || place.state || "").trim();
    return city ? { city, state } : null;
  } catch (error) {
    console.warn("ZIP lookup skipped", String(error?.message || error));
    return null;
  } finally { clearTimeout(timeout); }
}
function escapeHtml(value) {
  return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function json(payload, status) {
  return new Response(JSON.stringify(payload), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}

export const config = { path: "/api/lead" };
