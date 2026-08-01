(() => {
  const hash = window.location.hash || '';
  const isIdentityFlow = /(?:invite_token|confirmation_token|recovery_token|access_token)=/.test(hash);
  if (!isIdentityFlow || window.location.pathname.startsWith('/admin')) return;
  window.location.replace(`/admin/${hash}`);
})();
