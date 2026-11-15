const test = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

test('Contact processing respects newsletter choice and strips sensitive URL parameters', async () => {
  const originalFetch = global.fetch;
  const originalNetlify = global.Netlify;
  const handler = (await import(pathToFileURL(path.resolve('netlify/functions/lead.mjs')).href)).default;
  try {
    global.Netlify = {env:{get:key=>({AIRTABLE_TOKEN:'test-only',AIRTABLE_BASE_ID:'test-base',AIRTABLE_TABLE_ID:'test-table',CONTEXT:'production'})[key]}};
    for (const newsletter of ['no','yes']) {
      const writes=[];
      global.fetch = async (url,options={}) => {
        assert(String(url).startsWith('https://api.airtable.com/'), 'No live email or unrelated requests');
        if(options.method==='POST') {writes.push(JSON.parse(options.body));return new Response(JSON.stringify({records:[{id:'test-record'}]}),{status:200});}
        return new Response(JSON.stringify({records:[]}),{status:200});
      };
      const res = await handler(new Request('https://homewardcharities.org/api/lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'test@example.invalid',newsletter,landing_page:'https://homewardcharities.org/path?belief=private#answer',referrer:'https://example.invalid/page?email=private'})}));
      assert.equal(res.status,200);
      assert.equal(writes[0].records[0].fields['Email Consent'],newsletter==='yes');
      assert(!writes[0].records[0].fields.Notes.includes('belief='));
      assert(!writes[0].records[0].fields.Notes.includes('email=private'));
      assert(writes[0].records[0].fields.Notes.includes('https://homewardcharities.org/path'));
    }
  } finally {global.fetch=originalFetch;global.Netlify=originalNetlify;}
});
