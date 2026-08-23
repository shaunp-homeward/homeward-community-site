(() => {
  const form = document.querySelector('#partner-interest-form');
  if (!form) return;

  const landing = form.querySelector('#partner-landing-page');
  const referrer = form.querySelector('#partner-referrer');
  const setTracking = () => {
    if (landing) landing.value = location.href;
    if (referrer) referrer.value = document.referrer || '';
  };
  setTracking();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.form-message');
    const originalLabel = button?.textContent || 'Explore a Free Pilot';

    if (button) {
      button.disabled = true;
      button.textContent = 'Sending…';
    }
    if (message) {
      message.hidden = true;
      message.textContent = '';
      message.classList.remove('is-error');
    }

    try {
      const body = new FormData(form);
      const organization = String(body.get('organization') || '').trim();
      const role = String(body.get('role') || '').trim();
      const draw = String(body.get('draw') || '').trim();
      const context = [
        organization ? `Church / community: ${organization}` : '',
        role ? `Role: ${role}` : '',
      ].filter(Boolean).join('\n');
      body.set('draw', [context, draw].filter(Boolean).join('\n\n'));

      const response = await fetch('/api/lead', { method: 'POST', body });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) throw new Error(result.error || 'Unable to send');

      form.reset();
      setTracking();
      if (message) {
        message.textContent = 'Thanks — we received your interest and will follow up personally about a possible Homeward Circle for your community.';
        message.hidden = false;
      }
    } catch (_error) {
      if (message) {
        message.textContent = 'Something went wrong while sending. Please try again, or use the Talk with Shaun link.';
        message.classList.add('is-error');
        message.hidden = false;
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
  });
})();
