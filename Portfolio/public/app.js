const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  // Prevent the default full-page GET/POST
  e.preventDefault();
  statusEl.textContent = '';

  const data = Object.fromEntries(new FormData(form));

  // Frontend validation
  const errs = [];
  if (!data.name || data.name.trim().length < 2) errs.push('Name must be at least 2 characters.');
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.push('Please enter a valid email.');
  if (!data.subject || data.subject.trim().length < 3) errs.push('Subject must be at least 3 characters.');
  if (!data.message || data.message.trim().length < 10) errs.push('Message must be at least 10 characters.');

  if (errs.length) {
    statusEl.textContent = errs.join(' ');
    statusEl.className = 'error';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (json.ok) {
      statusEl.textContent = json.message || 'Message sent!';
      statusEl.className = 'success';
      form.reset();
    } else {
      const msg = json.message || (json.errors && json.errors.map(e => e.msg).join(' ')) || 'Failed to send.';
      statusEl.textContent = msg;
      statusEl.className = 'error';
    }
  } catch (err) {
    statusEl.textContent = 'Network error. Please try again.';
    statusEl.className = 'error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});
