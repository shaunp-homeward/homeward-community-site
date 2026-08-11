(() => {
  const header = document.querySelector('[data-v8-shared-header]');
  if (!header) return;
  const button = header.querySelector('[data-v8-menu-button]');
  const menu = header.querySelector('[data-v8-mobile-menu]');
  if (!button || !menu) return;

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    menu.dataset.open = open ? 'true' : 'false';
    menu.hidden = !open;
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };

  setOpen(false);
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 980) setOpen(false); });
})();
