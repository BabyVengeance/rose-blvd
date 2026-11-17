(() => {
  'use strict';
  const form = document.getElementById('planner-form');
  const dataEl = document.getElementById('planner-data');
  if (!form || !dataEl) return;
  const P = JSON.parse(dataEl.textContent);
  const byId = list => Object.fromEntries(list.map(i => [i.id, i]));
  const HANDS = byId(P.hands), FEET = byId(P.feet), RH = byId(P.removeHands), RF = byId(P.removeFeet), ADD = byId(P.addons);
  const BR = Object.fromEntries(P.branches.map(b => [b.key, b]));

  const el = id => document.getElementById(id);
  const list = el('sum-list'), empty = el('sum-empty'), totalEl = el('sum-total'), timeEl = el('sum-time'), saveEl = el('sum-saving');
  const branchSel = el('sum-branch'), bookEl = el('sum-book'), waEl = el('sum-wa');
  const isFill = el('is-fill'), isStudent = el('is-student');

  const rand = n => 'R' + n.toLocaleString('en-ZA').replace(/\s| /g, ' ');
  const dur = m => { const h = Math.floor(m / 60), r = m % 60; return h ? `${h} h${r ? ' ' + r + ' min' : ''}` : `${r} min`; };
  const picked = name => form.querySelector(`input[name="${name}"]:checked`)?.value || '';

  // Resolve the price of a hand service with fill and student options applied.
  const handLine = item => {
    const fill = isFill.checked && item.fill;
    const student = isStudent.checked && item.student;
    let price = item.price, time = item.dur, label = item.name;
    if (student && fill && item.studentFill) { price = item.studentFill.price; time = item.studentFill.dur; label += ', fill, student price'; }
    else if (fill) { price = item.fill.price; time = item.fill.dur; label += ', fill'; }
    else if (student) { price = item.student.price; time = item.student.dur; label += ', student price'; }
    return { label, price, time };
  };
  const footLine = item => {
    const student = isStudent.checked && item.student;
    return student ? { label: item.name + ', student price', price: item.student.price, time: item.student.dur } : { label: item.name, price: item.price, time: item.dur };
  };

  // Keep the visible option prices in step with the fill and student toggles.
  const refreshOptionPrices = () => {
    P.hands.forEach(h => { const n = form.querySelector(`[data-price-for="${h.id}"]`); if (n) n.textContent = rand(handLine(h).price); });
    P.feet.forEach(f => { const n = form.querySelector(`[data-price-for="${f.id}"]`); if (n) n.textContent = rand(footLine(f).price); });
  };

  let shown = 0;
  const animateTotal = target => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { totalEl.textContent = rand(target); shown = target; return; }
    const from = shown, start = performance.now(), len = 260;
    const step = t => {
      const k = Math.min(1, (t - start) / len), e = 1 - Math.pow(1 - k, 3);
      totalEl.textContent = rand(Math.round(from + (target - from) * e));
      if (k < 1) requestAnimationFrame(step); else shown = target;
    };
    requestAnimationFrame(step);
  };

  const update = () => {
    refreshOptionPrices();
    const lines = [];
    let saving = 0;
    const h = HANDS[picked('hands')], f = FEET[picked('feet')];
    const rh = RH[picked('rhands')], rf = RF[picked('rfeet')];
    if (rh) { lines.push({ label: rh.name, price: rh.price, time: rh.dur }); if (h || f) saving += rh.alone - rh.price; }
    if (rf) { lines.push({ label: rf.name, price: rf.price, time: rf.dur }); if (h || f) saving += rf.alone - rf.price; }
    if (h) lines.push(handLine(h));
    if (f) lines.push(footLine(f));
    form.querySelectorAll('input[name="addon"]:checked').forEach(a => { const x = ADD[a.value]; lines.push({ label: x.label, price: x.price, time: x.dur }); });

    // Removal prices in the planner are the "with a new treatment" rate; alone, they cost more.
    if (!h && !f) lines.forEach(l => {
      const r = [rh, rf].find(x => x && x.name === l.label);
      if (r) l.price = r.alone;
    });

    const total = lines.reduce((a, l) => a + l.price, 0);
    const time = lines.reduce((a, l) => a + l.time, 0);
    list.innerHTML = '';
    lines.forEach(l => {
      const li = document.createElement('li');
      const a = document.createElement('span'); a.textContent = l.label;
      const b = document.createElement('span'); b.textContent = rand(l.price);
      li.append(a, b); list.append(li);
    });
    empty.hidden = lines.length > 0;
    animateTotal(total);
    timeEl.textContent = time ? `About ${dur(time)} in the chair` : 'Pick a treatment to see the time';
    saveEl.hidden = !(saving > 0 && (h || f));
    saveEl.textContent = `You save ${rand(saving)} by booking the removal with your new treatment.`;
    el('fill-step').querySelector('#is-fill').disabled = !(h && h.fill);
    if (!(h && h.fill)) isFill.checked = false;

    const br = BR[branchSel.value];
    bookEl.href = br.fresha;
    bookEl.textContent = `Book these at ${br.name} on Fresha`;
    const msg = lines.length
      ? `Hi Rose Blvd ${br.name}, I would like to book:\n${lines.map(l => `- ${l.label} (${rand(l.price)})`).join('\n')}\nEstimated total ${rand(total)}, about ${dur(time)}.\nWhat times do you have available?`
      : `Hi Rose Blvd ${br.name}, I would like to make a booking.`;
    waEl.href = `https://wa.me/${br.wa}?text=${encodeURIComponent(msg)}`;
  };

  form.addEventListener('change', update);
  form.addEventListener('submit', e => e.preventDefault());
  update();
})();
