// This review build never submits interest data or sends notifications.
const form = document.querySelector('#interest-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = form.querySelector('.form-message');
  message.textContent = 'Preview complete. This staging form has not sent or saved your details.';
  message.hidden = false;
});
