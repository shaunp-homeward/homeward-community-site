const safeHref = (value = '') => {
  const href = String(value).trim();
  return /^(https?:\/\/|mailto:|\/|#)/i.test(href) ? href : '#';
};

const escAttr = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const formatText = (text = '') => String(text)
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => `<a href="${escAttr(safeHref(url))}">${label}</a>`)
  .replace(/\*\*([^*<>]+)\*\*/g, '<strong>$1</strong>')
  .replace(/__([^_<>]+)__/g, '<strong>$1</strong>')
  .replace(/\*([^*<>]+)\*/g, '<em>$1</em>')
  .replace(/_([^_<>]+)_/g, '<em>$1</em>');

export function applyCmsInlineFormatting(html = '') {
  const protectedBlocks = [];
  let source = String(html).replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, (block) => {
    const token = `@@HOMEWARDPROTECTED${protectedBlocks.length}@@`;
    protectedBlocks.push(block);
    return token;
  });

  source = source.split(/(<[^>]+>)/g).map((part) => part.startsWith('<') ? part : formatText(part)).join('');
  protectedBlocks.forEach((block, index) => {
    source = source.replace(`@@HOMEWARDPROTECTED${index}@@`, block);
  });
  return source;
}
