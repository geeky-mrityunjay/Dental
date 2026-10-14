'use strict';
let content;
let previousFocus;
let currentOverlay;
const contentReady = fetch('content.json').then(response => {
  if (!response.ok) throw new Error('Clinic content could not be loaded.');
  return response.json();
}).then(data => { content = data; return data; });
function closeDialog() {
  currentOverlay?.remove();
  currentOverlay = undefined;
  document.body.style.overflow = '';
  previousFocus?.focus();
}
function openDialog(templateId) {
  closeDialog();
  previousFocus = document.activeElement;
  const template = document.getElementById(templateId);
  const overlay = template.content.firstElementChild.cloneNode(true);
  document.body.append(overlay);
  currentOverlay = overlay;
  document.body.style.overflow = 'hidden';
  overlay.addEventListener('click', event => { if (event.target === overlay) closeDialog(); });
  overlay.querySelector('[aria-label="Close dialog"]').addEventListener('click', closeDialog);
  overlay.querySelector('.modal').focus();
  return overlay;
}
async function openBooking(reason = 'General consultation') {
  try { await contentReady; } catch { window.location.href = 'tel:+917019725870'; return; }
  const overlay = openDialog('booking-template');
  const form = overlay.querySelector('form');
  const input = form.querySelector('input');
  const select = form.querySelector('select');
  input.value = '';
  select.replaceChildren(...['General consultation', ...content.treatments.map(t => t.title)].map(title => new Option(title,title)));
  select.value = reason;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = `Hello ${content.clinic}, my name is ${input.value.trim()}. I would like to request an appointment for ${select.value}. Please let me know your available times.`;
    window.open(`https://wa.me/${content.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
}
document.querySelectorAll('.desktop-nav button, .hero-actions button, .about-text button, .contact-actions button').forEach(button => button.addEventListener('click', () => openBooking()));
document.querySelector('[aria-label="Open navigation"]').addEventListener('click', () => {
  const overlay = openDialog('menu-template');
  overlay.querySelectorAll('nav a').forEach(link => link.addEventListener('click',closeDialog));
  overlay.querySelector('nav button').addEventListener('click', () => openBooking());
});
let expanded = false;
document.querySelector('.treatment-link button').addEventListener('click', event => {
  expanded = !expanded;
  document.querySelectorAll('.treatment-item').forEach((card,index) => { card.hidden = index >= 4 && !expanded; });
  event.currentTarget.textContent = expanded ? 'Show Featured Treatments −' : 'Explore All Treatments →';
});
document.querySelectorAll('.treatment-item').forEach((card,index) => {
  card.querySelector('button').addEventListener('click', async () => {
    try { await contentReady; } catch { openBooking(); return; }
    const treatment = content.treatments[index];
    const overlay = openDialog('treatment-template');
    overlay.querySelector('.eyebrow').textContent = treatment.category;
    overlay.querySelector('h2').textContent = treatment.title;
    overlay.querySelector('.modal > p').textContent = treatment.detail;
    overlay.querySelector('.modal > button:last-child').addEventListener('click', () => openBooking(treatment.title));
  });
});
document.querySelectorAll('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-item button').forEach(other => {
      other.setAttribute('aria-expanded','false');
      const answer = other.parentElement.querySelector('.faq-answer');
      if (answer) answer.hidden = true;
    });
    const answer = button.parentElement.querySelector('.faq-answer');
    if (!answer) return;
    button.setAttribute('aria-expanded',String(!expanded));
    answer.hidden = expanded;
  });
});
document.addEventListener('keydown', event => {
  if (!currentOverlay) return;
  if (event.key === 'Escape') closeDialog();
  if (event.key === 'Tab') {
    const elements = currentOverlay.querySelectorAll('a[href],button,input,select');
    const first = elements[0], last = elements[elements.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === currentOverlay.querySelector('.modal'))) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
});
