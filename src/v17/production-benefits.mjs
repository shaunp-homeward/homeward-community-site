const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function renderPublicPractices(content) {
  const themes = ['amber', 'green', 'rose', 'blue'];
  if (content.panels.length !== 4) throw new Error('Public Practices requires four panels.');
  return `<section class="section benefit-section"><div class="wrap"><span class="eyebrow">A deeper life. An everyday practice.</span><h2>${escape(content.heading)}</h2><p class="introleft">${escape(content.introduction)}</p><div class="benefit-grid">${content.panels.map((panel, i) => {
    if (panel.theme !== themes[i]) throw new Error('Practices panel order or theme changed.');
    return `<article class="benefit ${panel.theme}"><header><span>${i + 1}</span><h3>${escape(panel.title)}</h3></header><div class="benefit-body"><h4>${escape(panel.heading)}</h4><p>${escape(panel.description)}</p></div></article>`;
  }).join('')}</div><p class="research-note">${escape(content.note)}</p></div></section>`;
}
