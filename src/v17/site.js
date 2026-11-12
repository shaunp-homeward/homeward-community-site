const menu = document.querySelector('.menu');
const navigation = document.querySelector('.navlinks');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menu?.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
    menu.focus();
  }
});
window.addEventListener('message', (event) => {
  const frame = document.getElementById('calendly-booking');
  if (!frame || event.origin !== 'https://calendly.com' || event.source !== frame.contentWindow) return;
  if (event.data?.event !== 'calendly.page_height') return;
  // Calendly's supported page_height messages use CSS pixel strings.
  const rawHeight = event.data.payload?.height;
  const height = typeof rawHeight === 'string' && /^\d+(?:\.\d+)?px$/.test(rawHeight)
    ? Number.parseFloat(rawHeight)
    : Number(rawHeight);
  if (Number.isFinite(height) && height >= 350 && height <= 4000) {
    frame.style.setProperty('height', `${Math.ceil(height)}px`, 'important');
  }
});
