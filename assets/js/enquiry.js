(() => {
  'use strict';
  const form = document.getElementById('enquiry');
  if (!form) return;
  const WA = { main: '27693545285', regent: '27663131966', claremont: '27693307721' };
  const NAMES = { main: 'Main Road', regent: 'Regent Road', claremont: 'Claremont' };
  const F = form.elements;
  const steps = [...form.querySelectorAll('.fstep')];
  const inds = [...document.querySelectorAll('[data-step-ind]')];
  const status = document.getElementById('form-status');
  const openedAt = Date.now();
  let current = 0;

  const dateInput = form.querySelector('#date');
  if (dateInput) dateInput.min = new Date(Date.now() + 2 * 3600e3).toISOString().slice(0, 10);

  const setErr = (key, msg) => { const e = form.querySelector(`[data-err="${key}"]`); if (e) e.textContent = msg; return !msg; };
  const clean = v => String(v || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();

  const validate = i => {
    if (i === 1) {
      const n = Number(F.people.value);
      return setErr('people', Number.isInteger(n) && n >= 1 && n <= 20 ? '' : 'Enter a number from 1 to 20. For bigger groups, say so in your message.');
    }
    if (i === 2) {
      const name = clean(F.name.value), mobile = F.mobile.value.replace(/[\s()-]/g, ''), msg = clean(F.message.value);
      const ok = [
        setErr('name', name.length >= 2 ? '' : 'Please add your name so the salon knows who to reply to.'),
        setErr('mobile', /^(\+27|0)[6-8]\d{8}$/.test(mobile) || /^\+\d{9,15}$/.test(mobile) ? '' : 'Enter a mobile number, for example 082 123 4567.'),
        setErr('message', msg.length >= 5 ? '' : 'Tell the salon a little about what you need.'),
        setErr('consent', F.consent.checked ? '' : 'Please tick the box so the salon may use your details to reply.'),
      ];
      return ok.every(Boolean);
    }
    return true;
  };

  const show = i => {
    steps.forEach((s, k) => { s.hidden = k !== i; });
    inds.forEach((d, k) => { d.classList.toggle('is-current', k === i); d.classList.toggle('is-done', k < i); });
    current = i;
    const first = steps[i].querySelector('input:not([type=hidden]), select, textarea');
    first && first.focus({ preventScroll: true });
  };

  form.addEventListener('click', e => {
    if (e.target.closest('[data-next]') && validate(current)) show(Math.min(current + 1, steps.length - 1));
    if (e.target.closest('[data-prev]')) show(Math.max(current - 1, 0));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(2)) return;
    // Honeypot filled or the form submitted faster than a person can type: drop quietly.
    if (F.website.value || Date.now() - openedAt < 3000) { status.textContent = 'Thanks. Your message is ready.'; return; }
    const branch = WA[F.branch.value] ? F.branch.value : 'main';
    const topic = clean(form.querySelector('input[name="topic"]:checked')?.value);
    const lines = [
      `Hi Rose Blvd ${NAMES[branch]}, this is ${clean(F.name.value)} (${clean(F.mobile.value)}).`,
      `Enquiry: ${topic}`,
      F.date.value ? `Preferred date: ${F.date.value}${F.time.value ? ', ' + clean(F.time.value) : ''}` : '',
      Number(F.people.value) > 1 ? `People: ${Number(F.people.value)}` : '',
      '',
      clean(F.message.value),
    ].filter((l, i) => l || i === 4);
    const url = `https://wa.me/${WA[branch]}?text=${encodeURIComponent(lines.join('\n'))}`;
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    status.innerHTML = '';
    const p = document.createElement('span');
    p.textContent = win ? `WhatsApp opened with your message to ${NAMES[branch]}. Press send to deliver it. ` : 'Your browser blocked the new tab. ';
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Open WhatsApp again';
    status.append(p, a);
  });
})();
