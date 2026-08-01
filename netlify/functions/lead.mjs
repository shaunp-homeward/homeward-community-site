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
  const guideMap = {
    "Inherited Faith": {
      title: "Inherited Faith",
      subtitle: "Receiving the gift, making it your own",
      page: "/journey/inherited-faith",
      pdf: "/downloads/Homeward_Inherited_Faith_Guide.pdf",
    },
    "Honest Questions": {
      title: "Honest Questions",
      subtitle: "Making room for what is true",
      page: "/journey/honest-questions",
      pdf: "/downloads/Homeward_Honest_Questions_Guide.pdf",
    },
    "Sacred Search": {
      title: "The Sacred Search",
      subtitle: "Seeking with open hands",
      page: "/journey/sacred-search",
      pdf: "/downloads/Homeward_Sacred_Search_Guide.pdf",
    },
    "New Foundations": {
      title: "New Foundations",
      subtitle: "Rebuilding with humility and hope",
      page: "/journey/new-foundations",
      pdf: "/downloads/Homeward_New_Foundations_Guide.pdf",
    },
    "Embodied Faith": {
      title: "Embodied Faith",
      subtitle: "Letting faith become a way of life",
      page: "/journey/embodied-faith",
      pdf: "/downloads/Homeward_Embodied_Faith_Guide.pdf",
    },
    "Living Awake": {
      title: "Living Awake",
      subtitle: "Present to God, available to love",
      page: "/journey/living-awake",
      pdf: "/downloads/Homeward_Living_Awake_Guide.pdf",
    },
  };
  const guide = guideMap[assessmentStage] || null;
  const requestOrigin = new URL(req.url).origin;
  const guideUrl = guide ? new URL(guide.page, requestOrigin).href : "";
  const guidePdfUrl = guide ? new URL(guide.pdf, requestOrigin).href : "";
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
    return json({ ok: true, preview: true, conversationRequested, guideUrl, guidePdfUrl, emailSent: false }, 200);
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
    let emailSent = false;
    if (formType === "assessment" && guide && email) {
      emailSent = await sendGuideEmail({
        email,
        firstName: first,
        guide,
        guideUrl,
        guidePdfUrl,
      });
    }
    return json({ ok: true, conversationRequested, guideUrl, guidePdfUrl, emailSent }, 200);
  } catch (error) {
    console.error("Airtable fetch failed", error);
    return json({ ok: false, error: "airtable-fetch-failed" }, 502);
  }
};

async function sendGuideEmail({ email, firstName, guide, guideUrl, guidePdfUrl }) {
  const apiKey = String(Netlify.env.get("RESEND_API_KEY") || "").trim();
  const from = String(Netlify.env.get("ASSESSMENT_FROM_EMAIL") || "").trim();
  const replyTo = String(Netlify.env.get("ASSESSMENT_REPLY_TO") || "").trim();
  if (!apiKey || !from) return false;

  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hello,";
  const subject = `Your Homeward guide: ${guide.title}`;
  const html = `<!doctype html><html><body style="margin:0;background:#FAF6EF;color:#333333;font-family:Arial,sans-serif"><div style="max-width:620px;margin:auto;padding:34px 24px"><div style="background:#153A2E;color:#FAF6EF;padding:32px;border-radius:12px 12px 0 0"><div style="font-size:12px;letter-spacing:.18em;color:#E0A443;font-weight:700">HOMEWARD · JOURNEY OF FAITH</div><h1 style="font-family:Georgia,serif;font-size:34px;margin:12px 0 4px">${escapeHtml(guide.title)}</h1><div style="font-family:Georgia,serif;font-style:italic;color:#F1D8CB;font-size:19px">${escapeHtml(guide.subtitle || "A guide for your season")}</div></div><div style="background:white;padding:30px;border-radius:0 0 12px 12px"><p>${greeting}</p><p>Thank you for taking the Homeward Journey Reflection. Your complete guide is ready.</p><p style="margin:26px 0"><a href="${guideUrl}" style="display:inline-block;background:#B53A2A;color:white;text-decoration:none;padding:13px 20px;border-radius:999px;font-weight:700">Read your guide online</a></p><p><a href="${guidePdfUrl}" style="color:#153A2E;font-weight:700">Download the printable PDF →</a></p><p style="color:#6D7D6A;font-size:14px;margin-top:28px">A mirror, not a box. Faith moves in a spiral, and you may revisit familiar questions from deeper places.</p><p style="margin-top:28px">Journeying Toward God. Together.<br><strong>Homeward</strong></p></div></div></body></html>`;
  const text = `${firstName ? `Hi ${firstName},` : "Hello,"}\n\nThank you for taking the Homeward Journey Reflection. Your ${guide.title} guide is ready.\n\nRead online: ${guideUrl}\nDownload the PDF: ${guidePdfUrl}\n\nJourneying Toward God. Together.\nHomeward`;

  try {
    const payload = { from, to: [email], subject, html, text };
    if (replyTo) payload.reply_to = replyTo;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error("Guide email failed", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Guide email exception", error);
    return false;
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export const config = { path: "/api/lead" };
