import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context=process.env.CONTEXT||'local';
const branch=process.env.HEAD||process.env.BRANCH||'';
if(context!=='production'&&context!=='local'&&!['staging-faith-practice-faq-2026-10-08','staging-churches-realignment-2026-10-08'].includes(branch)){
  console.log('Faith Into Practice draft skipped outside its staging branch.');
}else{
  const dist=path.join(root,'dist');
  const faq=await fs.readFile(path.join(root,'content','faith-practice-faq.html'),'utf8');
  for(const page of await fs.readdir(dist)){
    if(!page.endsWith('.html'))continue;
    const target=path.join(dist,page);
    let html=await fs.readFile(target,'utf8');
    if(!html.includes('v8-site-header')||html.includes('/assets/faith-practice-draft.css'))continue;
    html=html.replace(/<header\b[\s\S]*?<\/header>/i,header=>header.replaceAll('FORMATION FOR GROUPS','FAITH INTO PRACTICE'));
    html=html.replace(/<footer\b[\s\S]*?<\/footer>/i,footer=>footer.replaceAll('A SPIRITUAL COMMUNITY','FAITH INTO PRACTICE'));
    html=html.replace(/<body\b([^>]*)>/i,(tag,attrs)=>attrs.includes('class=')?tag.replace(/class="([^"]*)"/,(_,c)=>`class="${c} faith-practice-draft"`):`<body${attrs} class="faith-practice-draft">`);
    html=html.replace('</head>','<link rel="stylesheet" href="/assets/faith-practice-draft.css?v=1"></head>');
    if(page==='index.html'){
      html=html.replace('Homeward is a Jesus-centered spiritual community in Fort Worth and online, offering guided Circles, contemplative practices, honest conversation, and a path for everyday spiritual life.','Homeward helps existing Christian groups put faith into practice through a four-week group experience and Sacred Listening. Jesus-centered. No charge.');
      html=html.replace('aria-label="Homeward Circle basics"','aria-label="Homeward experience basics"').replace('Online<br/>Circles','Online<br/>gatherings');
      const pattern=/<section\b[^>]*class="[^"]*\bfaq\b[^"]*"[^>]*>[\s\S]*?<\/section>/i;
      if(!pattern.test(html))throw new Error('Current FAQ section missing');
      html=html.replace(pattern,faq);
      const summary='<strong>A four-week taste—not a new church program.</strong>';
      if(!html.includes(summary))throw new Error('Current group invitation missing');
      html=html.replace(summary,'<h3 class="fp-invitation">A simple invitation to try something together.</h3>');
      html=html.replace('Homeward facilitates the experience inside the community you already have. Your group keeps its identity, relationships, leadership, and rhythm.','Give your group room to experience contemplative prayer, deeper listening, and practices for everyday life. Come with curiosity. Notice what helps. Keep what serves your people.');
      html=html.replace('<div class="hw-group-benefits">','<p class="fp-reassurance"><strong>Four guided gatherings. No charge. Free to stop at any time.</strong><br>Try the Homeward Group Experience and decide together what serves your group.</p><div class="hw-group-benefits">');
      html=html.replace(/(<section\b[^>]*class="[^"]*\bsl2-home\b[^"]*"[^>]*>[\s\S]*?)(<\/section>)/i,'$1<p class="fp-reassurance"><strong>Three sessions. No charge. Free to stop at any time.</strong><br>Try Sacred Listening together and keep what helps.</p>$2');
    }
    await fs.writeFile(target,html);
  }
  await fs.copyFile(path.join(root,'assets','faith-practice-draft.css'),path.join(dist,'assets','faith-practice-draft.css'));
  console.log('Applied staging-only Faith Into Practice subtitle, invitation, and FAQ.');
}
