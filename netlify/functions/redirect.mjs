// Homeward — dynamic QR redirect.  /m/:slug  ->  looks up the slug in the
// Airtable "QR Codes" table and 302-forwards to its Destination.
// Change Destination in Airtable to repoint a printed code — no reprint, no redeploy.
// Also increments Scans + stamps Last Scan (fire-and-forget) for basic analytics.

export default async (req, context) => {
  // Fallback lands on the live site (swap to homewardcommunity.com once the domain is connected).
  const FALLBACK = "https://homewardcommunity.com/";

  // Read the slug from context.params, falling back to parsing the URL path directly.
  let slug = "";
  try {
    slug = (context && context.params && context.params.slug) || "";
    if (!slug) {
      const parts = new URL(req.url).pathname.split("/").filter(Boolean);
      slug = parts[parts.length - 1] || "";
    }
  } catch (e) {}
  slug = String(slug).toLowerCase().trim();

  const token = Netlify.env.get("AIRTABLE_TOKEN");
  // Base + QR table are not secret — hardcode as fallbacks so a missing env var can't break lookups.
  const base = Netlify.env.get("AIRTABLE_BASE_ID") || "app4aLyKjKz12b4Kc";
  const table = Netlify.env.get("AIRTABLE_QR_TABLE_ID") || "tblspnKiBveKMPy50";
  if (!slug || !token || !base || !table) return Response.redirect(FALLBACK, 302);

  try {
    const formula = encodeURIComponent(`LOWER({Slug})='${slug.replace(/'/g, "")}'`);
    const lookup = `https://api.airtable.com/v0/${base}/${table}?filterByFormula=${formula}&maxRecords=1`;
    const r = await fetch(lookup, { headers: { Authorization: `Bearer ${token}` } });
    const j = await r.json();
    const rec = j.records && j.records[0];
    if (!rec || !rec.fields || !rec.fields.Destination || !rec.fields.Active) {
      return Response.redirect(FALLBACK, 302);
    }
    const dest = rec.fields.Destination;

    // fire-and-forget scan tally
    const scans = (rec.fields.Scans || 0) + 1;
    fetch(`https://api.airtable.com/v0/${base}/${table}/${rec.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields: { Scans: scans, "Last Scan": new Date().toISOString().slice(0, 10) } }),
    }).catch(() => {});

    return Response.redirect(dest, 302);
  } catch (e) {
    return Response.redirect(FALLBACK, 302);
  }
};

export const config = { path: "/m/:slug" };
