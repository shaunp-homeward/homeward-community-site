const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileNav?.classList.toggle('open', !open);
  mobileNav?.setAttribute('aria-hidden', String(open));
});
mobileNav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  mobileNav?.classList.remove('open');
  mobileNav?.setAttribute('aria-hidden', 'true');
}));
const form = document.querySelector('#interest-form');
if (form) {
  const landing = form.querySelector('#landing-page-field');
  const referrer = form.querySelector('#referrer-field');
  if (landing) landing.value = location.href;
  if (referrer) referrer.value = document.referrer || '';
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.form-message');
    const originalLabel = button?.textContent || 'Share My Interest';
    if (button) { button.disabled = true; button.textContent = 'Sending…'; }
    if (message) { message.hidden = true; message.textContent = ''; }
    try {
      const body = new FormData(form);
      const gatheringChoice = String(body.get('gathering_preference') || '');
      const interestChoice = String(body.get('interest') || '');
      if (/conversation/i.test(gatheringChoice) && !/conversation/i.test(interestChoice)) {
        body.set('interest', `${interestChoice} — let's start with a conversation`);
      }
      const response = await fetch('/api/lead', { method: 'POST', body });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) throw new Error(result.error || 'Unable to send');
      form.reset();
      if (landing) landing.value = location.href;
      if (referrer) referrer.value = document.referrer || '';
      if (message) { message.textContent = 'Thank you. We received your interest and will follow up personally.'; message.hidden = false; }
    } catch (_error) {
      if (message) { message.textContent = 'Something went wrong while sending. Please try again, or use the conversation link to contact us.'; message.hidden = false; }
    } finally {
      if (button) { button.disabled = false; button.textContent = originalLabel; }
    }
  });
}
const sticky = document.querySelector('.mobile-sticky');
const interest = document.querySelector('#interest');
if (sticky && interest && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    sticky.style.display = entries[0].isIntersecting ? 'none' : '';
  }, { threshold: .08 });
  observer.observe(interest);
}
