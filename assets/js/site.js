(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Header hairline once the page scrolls.
  const header = $('.site-header');
  const mbar = $('[data-mbar]');
  if (mbar) document.body.classList.add('has-mbar');
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle('is-scrolled', y > 8);
    mbar && mbar.classList.toggle('is-on', y > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile drawer: focus moves in on open and back to the toggle on close.
  const drawer = $('#drawer');
  const toggle = $('[data-drawer-open]');
  const setDrawer = open => {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    toggle && toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) $('a, button', drawer.querySelector('.drawer-panel'))?.focus();
    else toggle?.focus();
  };
  toggle?.addEventListener('click', () => setDrawer(true));
  $$('[data-drawer-close]').forEach(el => el.addEventListener('click', () => setDrawer(false)));
  drawer?.addEventListener('keydown', e => {
    if (e.key === 'Escape') setDrawer(false);
    if (e.key !== 'Tab') return;
    const items = $$('a, button', drawer.querySelector('.drawer-panel'));
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Booking dialog: every [data-book] opens the salon chooser; without <dialog> support the link falls through to contact.html.
  const dialog = $('#book-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    $$('[data-book]').forEach(el => el.addEventListener('click', e => {
      e.preventDefault();
      if (drawer?.classList.contains('is-open')) setDrawer(false);
      dialog.showModal();
    }));
    $$('[data-book-close]', dialog).forEach(el => el.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  }

  // Open-now status from the published hours, evaluated in Cape Town time.
  const HOURS = { 1: ['09:45', '18:30'], 2: ['09:45', '18:30'], 3: ['09:45', '18:30'], 4: ['09:45', '18:30'], 5: ['09:45', '18:30'], 6: ['09:15', '17:00'], 0: ['09:15', '16:00'] };
  const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const statusText = () => {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      const get = t => parts.find(p => p.type === t)?.value;
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
      const now = `${get('hour')}:${get('minute')}`.replace(/^24/, '00');
      const [open, close] = HOURS[day];
      if (now >= open && now < close) return `Open today until ${close}`;
      if (now < open) return `Opens today at ${open}`;
      const next = (day + 1) % 7;
      return `Closed now, opens ${DAY[next]} at ${HOURS[next][0]}`;
    } catch { return ''; }
  };
  const status = statusText();
  if (status) $$('[data-open-status]').forEach(el => { el.textContent = status; });

  // Scroll reveal: observe every section, footer, and [data-reveal] element across all pages.
  const revealTargets = $$('main > section, .site-footer, [data-reveal]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    }), { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-in'));
  }

  // Pressed-state chip groups.
  const chipGroup = (attr, onPick) => {
    const chips = $$(`[${attr}]`);
    chips.forEach(c => c.addEventListener('click', () => {
      chips.forEach(o => o.setAttribute('aria-pressed', String(o === c)));
      onPick(c.getAttribute(attr));
    }));
  };

  // Reviews page: filter by salon.
  chipGroup('data-review-filter', key => {
    $$('#review-wall .quote').forEach(q => { q.hidden = key !== 'all' && q.dataset.branch !== key; });
  });

  // Treatments page: hide services a salon does not offer, and empty categories.
  chipGroup('data-branch-filter', key => {
    $$('.menu-cat').forEach(cat => {
      const rows = $$('.price-row[data-branches]', cat);
      rows.forEach(r => r.classList.toggle('is-hidden', key !== 'all' && !r.dataset.branches.split(' ').includes(key)));
      const empty = rows.length > 0 && rows.every(r => r.classList.contains('is-hidden'));
      cat.classList.toggle('is-empty', empty);
      const link = $(`.cat-nav a[href="#${cat.id}"]`);
      if (link) link.hidden = empty;
    });
  });

  // Category nav: stepper chevrons, desktop wheel translation, drag-to-scroll, and spy.
  const catTrack = $('[data-cat-track], .cat-nav-inner');
  const catWrap = $('.cat-nav-wrap');
  const catPrev = $('[data-cat-prev]');
  const catNext = $('[data-cat-next]');

  if (catTrack && catWrap) {
    const updateStepper = () => {
      const left = catTrack.scrollLeft;
      const max = catTrack.scrollWidth - catTrack.clientWidth - 2;
      const canLeft = left > 4;
      const canRight = left < max;
      catWrap.classList.toggle('can-scroll-left', canLeft);
      catWrap.classList.toggle('can-scroll-right', canRight);
      if (catPrev) catPrev.disabled = !canLeft;
      if (catNext) catNext.disabled = !canRight;
    };

    catPrev?.addEventListener('click', () => {
      catTrack.scrollBy({ left: -280, behavior: 'smooth' });
    });
    catNext?.addEventListener('click', () => {
      catTrack.scrollBy({ left: 280, behavior: 'smooth' });
    });

    catTrack.addEventListener('scroll', updateStepper, { passive: true });
    window.addEventListener('resize', updateStepper, { passive: true });
    // Initial check after paint
    setTimeout(updateStepper, 50);

    // Desktop mouse wheel horizontal translation
    catTrack.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && catTrack.scrollWidth > catTrack.clientWidth) {
        const left = catTrack.scrollLeft;
        const max = catTrack.scrollWidth - catTrack.clientWidth - 2;
        const canLeft = left > 2;
        const canRight = left < max;
        if ((e.deltaY > 0 && canRight) || (e.deltaY < 0 && canLeft)) {
          e.preventDefault();
          catTrack.scrollLeft += e.deltaY;
          updateStepper();
        }
      }
    }, { passive: false });

    // Desktop click-and-drag scrolling
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasDragged = false;

    catTrack.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      isDown = true;
      hasDragged = false;
      startX = e.pageX - catTrack.offsetLeft;
      scrollStart = catTrack.scrollLeft;
      catTrack.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', e => {
      if (!isDown) return;
      const x = e.pageX - catTrack.offsetLeft;
      const walk = x - startX;
      if (Math.abs(walk) > 4) hasDragged = true;
      catTrack.scrollLeft = scrollStart - walk;
      updateStepper();
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      catTrack.classList.remove('is-dragging');
    });

    catTrack.addEventListener('click', e => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged = false;
      }
    }, true);
  }

  // Category nav: mark the section currently in view.
  const catLinks = $$('.cat-nav a.chip');
  if (catLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(catLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      catLinks.forEach(a => a.removeAttribute('aria-current'));
      const a = byId.get(en.target.id);
      if (a) {
        a.setAttribute('aria-current', 'true');
        const rail = a.parentElement;
        rail.scrollTo({ left: a.offsetLeft - rail.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
      }
    }), { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); s && spy.observe(s); });
  }

  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
})();
