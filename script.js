// ─── Water cursor ───
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch devices

  // Custom cursor dot
  const dot = document.createElement('div');
  dot.className = 'water-cursor';
  document.body.appendChild(dot);

  let mx = -999, my = -999;
  let lastRipple = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;

    const now = Date.now();
    if (now - lastRipple < 80) return; // throttle ripples
    lastRipple = now;

    const ripple = document.createElement('div');
    ripple.className = 'water-ripple';
    ripple.style.left = mx + 'px';
    ripple.style.top  = my + 'px';
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
})();

// ─── Page loader ───
(function () {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <img class="page-loader-logo" src="correct-logo.png" alt="" style="height: 180px; width: auto;" />
    <div class="page-loader-line"></div>
    <div class="page-loader-text">WE HAVE ME.</div>
  `;
  document.body.prepend(loader);
  const dismiss = () => {
    loader.classList.add('exit');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  };
  if (document.readyState === 'complete') {
    setTimeout(dismiss, 2600);
  } else {
    window.addEventListener('load', () => setTimeout(dismiss, 2600));
  }
})();

// ─── Scroll progress bar ───
(function () {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  const update = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ─── Side section dots ───
(function () {
  const sections = Array.from(document.querySelectorAll('main section'));
  if (sections.length < 2) return;
  const container = document.createElement('nav');
  container.className = 'section-dots';
  container.setAttribute('aria-hidden', 'true');
  sections.forEach((sec, i) => {
    const dot = document.createElement('button');
    dot.className = 'section-dot';
    dot.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    container.appendChild(dot);
  });
  document.body.appendChild(container);
  const dots = Array.from(container.querySelectorAll('.section-dot'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = sections.indexOf(e.target);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
})();

// ─── Parallax hero backgrounds ───
(function () {
  const els = Array.from(document.querySelectorAll('.home-hero-bg, .page-hero-img, .phil-hero-bg'));
  if (!els.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const update = () => {
    els.forEach(el => {
      const section = el.closest('section') || el.parentElement;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const pct = rect.top / window.innerHeight;
      el.style.transform = `translateY(${pct * 18}%)`;
    });
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ─── Magnetic buttons ───
(function () {
  document.querySelectorAll('.btn-gold, .btn-lg').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.38;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

// ─── Button click ripple ───
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const el = document.createElement('span');
  el.className = 'btn-ripple-el';
  const size = Math.max(r.width, r.height);
  el.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size/2}px;top:${e.clientY - r.top - size/2}px`;
  btn.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
});

// ─── 3D card tilt ───
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sel = '.journey-card, .conviction-item, .badge-card, .pillar-card, .cause-card, .who-feature-card, .foundation-card';
  document.querySelectorAll(sel).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

// ─── Count-up stats ───
(function () {
  const els = document.querySelectorAll('.cause-stat-num, .about-hero-stat-num');
  if (!els.length) return;
  const run = el => {
    const raw = el.textContent.trim();
    const num = parseInt(raw);
    const suffix = raw.replace(/[0-9]/g, '');
    if (isNaN(num)) return;
    const dur = 1800, start = performance.now();
    const tick = now => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(eased * num) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach(el => io.observe(el));
})();

// ─── Section title reveal ───
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.section-title').forEach(el => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
  document.querySelectorAll('.section-title').forEach(el => io.observe(el));
})();

// ─── Home hero sequential reveal ───
(function () {
  const heroText = document.querySelector('.home-hero-text');
  if (!heroText) return;
  const eyebrow   = heroText.querySelector('.home-eyebrow');
  const lead      = heroText.querySelector('.lead');
  const btns      = Array.from(heroText.querySelectorAll('.hero-actions .btn'));
  const LOADER_MS = 1650; // just after loader exits at 1600ms
  // Eyebrow first
  setTimeout(() => eyebrow?.classList.add('hero-visible'), LOADER_MS);
  // Lead and buttons fire after words — resolved inside word-split below
  window._heroLeadDelay = LOADER_MS + 200; // will be updated after words are split
  window._heroRevealLead = () => {
    setTimeout(() => lead?.classList.add('hero-visible'), 0);
    btns.forEach((b, i) => setTimeout(() => b.classList.add('hero-visible'), i * 140 + 180));
  };
})();

// ─── Hero h1 word-split animation ───
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.home-hero-text h1, .about-hero-text h1, .phil-hero-left h1, .offer-hero-text h1').forEach(h1 => {
    // Walk child nodes, wrap text words in spans, preserve elements (em, br)
    const wrapNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); }
          else if (part) {
            const s = document.createElement('span');
            s.className = 'hero-word';
            s.textContent = part;
            frag.appendChild(s);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM') {
        // Wrap <em> as a single word unit
        const s = document.createElement('span');
        s.className = 'hero-word';
        s.appendChild(node.cloneNode(true));
        node.parentNode.replaceChild(s, node);
      }
      // <br> and other elements left untouched
    };
    Array.from(h1.childNodes).forEach(wrapNode);
    const words = Array.from(h1.querySelectorAll('.hero-word'));
    const isHome = !!h1.closest('.home-hero-text');
    const startMs = isHome ? 1850 : 200; // home: after eyebrow; others: on scroll
    words.forEach((w, i) => {
      const delay = startMs + i * 130;
      w.style.transitionDelay = `${delay / 1000}s`;
      if (isHome) {
        setTimeout(() => w.classList.add('visible'), delay);
      } else {
        // Non-home heroes: trigger on intersection
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { w.classList.add('visible'); io.unobserve(w); } });
        }, { threshold: 0.1 });
        io.observe(w);
      }
    });
    // After last word, trigger lead + buttons
    if (isHome && words.length) {
      const lastWordEnd = startMs + (words.length - 1) * 130 + 650;
      setTimeout(() => window._heroRevealLead?.(), lastWordEnd);
    }
  });
})();

// ─── Universal stagger reveal ───
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const reveal = (el, delay = 0) => {
    el.style.transitionDelay = delay + 'ms';
    el.classList.add('is-revealed');
  };
  const makeObserver = (threshold = 0.15) => new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { reveal(e.target); obs.unobserve(e.target); } });
  }, { threshold, rootMargin: '0px 0px -30px 0px' });
  const obs = makeObserver();

  // Stagger children of a container
  const staggerObserver = (selector, childSelector, delayStep = 100) => {
    document.querySelectorAll(selector).forEach(parent => {
      const children = parent.querySelectorAll(childSelector);
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            children.forEach((c, i) => setTimeout(() => c.classList.add('is-revealed'), i * delayStep));
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      io.observe(parent);
    });
  };

  // Dividers
  document.querySelectorAll('.divider').forEach(el => obs.observe(el));

  // Images with reveal
  document.querySelectorAll('.who-img, .philosophy-wealth-img, .platform-intro-img, .journey-intro-img, .offer-hero-img').forEach(el => obs.observe(el));

  // Reject / build cards
  document.querySelectorAll('.reject-card, .build-card').forEach(el => obs.observe(el));

  // Pillar cards stagger
  staggerObserver('.philosophy-pillars', '.pillar-card', 120);

  // Foundation cards stagger
  staggerObserver('.foundation-grid', '.foundation-card', 110);

  // Cause cards stagger
  staggerObserver('.cause-cards', '.cause-card', 90);

  // Cycle steps stagger
  staggerObserver('.prosperity-cycle', '.cycle-step', 130);

  // Covenant words stagger
  document.querySelectorAll('.covenant-inner-section .covenant-word, .covenant-section .covenant-word').forEach((el, i) => {
    el.style.transitionDelay = '0ms';
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.style.transitionDelay = `${i * 150}ms`;
          el.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
  });

  // Orbital rig entrance
  document.querySelectorAll('.orbital-rig').forEach(rig => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { rig.classList.add('is-revealed'); io.unobserve(rig); } });
    }, { threshold: 0.2 });
    io.observe(rig);
  });

  // Footer stagger
  staggerObserver('.footer-grid', '.footer-brand, .footer-col', 100);

  // Eyebrow elements slide in
  document.querySelectorAll('.eyebrow').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
  });

  // Lead paragraphs (skip home hero — handled by sequential reveal)
  document.querySelectorAll('p.lead').forEach(el => {
    if (el.closest('.home-hero-text')) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s';
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'none'; io.unobserve(el); }
      });
    }, { threshold: 0.3 });
    io.observe(el);
  });

  // Closing CTA headings
  document.querySelectorAll('.closing-cta h2').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)';
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'none'; io.unobserve(el); }
      });
    }, { threshold: 0.3 });
    io.observe(el);
  });

  // Statement quote letter-by-letter feel — just a big clip
  document.querySelectorAll('.statement-quote').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 1s ease 0.2s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.2s';
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'none'; io.unobserve(el); }
      });
    }, { threshold: 0.3 });
    io.observe(el);
  });
})();

// ─── Nav scroll state ───
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ─── Logo resize on scroll ───
(function () {
  const logo = document.querySelector('.nav-logo img');
  if (!logo) return;
  const BIG = '80px';
  const SMALL = '44px';
  const DURATION = '0.35s';
  logo.style.transition = `height ${DURATION} cubic-bezier(0.16,1,0.3,1), opacity ${DURATION} ease`;
  const resize = () => {
    logo.style.height = window.scrollY > 24 ? SMALL : BIG;
  };
  window.addEventListener('scroll', resize, { passive: true });
  resize();
})();

// ─── Mobile hamburger ───
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
hamburger?.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// ─── Intersection observer — fade-in ───
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fade-in').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });

  // ─── Conviction & Journey cards — staggered slide-up ───
  const cardIo = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('risen'); cardIo.unobserve(e.target); }
    }),
    { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
  );
  document.querySelectorAll('.conviction-item, .journey-card').forEach((el, i) => {
    el.style.animationDelay = `${(i % 4) * 100}ms`;
    cardIo.observe(el);
  });
}

// ─── Orbital convictions ───
(function () {
  const rig = document.getElementById('orbitalRig');
  if (!rig) return;

  const convictions = [
    {
      tag: 'Conviction 01',
      title: 'Every Individual Has Potential',
      body: 'No person is without the seed of greatness. Our role is to cultivate it — through mentorship, education, and community that sees people before it sees problems.',
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>'
    },
    {
      tag: 'Conviction 02',
      title: 'Every Institution Has Influence',
      body: 'Institutions shape culture. We partner with them to align influence with impact — so they become multipliers of prosperity, not gatekeepers of it.',
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 7V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1"/><path d="M12 12v3"/></svg>'
    },
    {
      tag: 'Conviction 03',
      title: 'Every Community Has Assets',
      body: 'We see communities not as deficits to be filled, but as assets to be unlocked — rich with knowledge, talent, and possibility waiting to be activated.',
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
    },
    {
      tag: 'Conviction 04',
      title: 'Every Nation Has Opportunity',
      body: 'No country is without the conditions for transformation. We help nations see their opportunity — and act on it with decisive, sustained, and measurable action.',
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
    }
  ];

  const nodes = rig.querySelectorAll('.orbit-node');
  const radius = 260;
  const startAngles = [-90, 0, 90, 180]; // top, right, bottom, left

  // Position nodes
  nodes.forEach((node, i) => {
    const angle = (startAngles[i] * Math.PI) / 180;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    node.style.left = `calc(50% + ${x}px)`;
    node.style.top  = `calc(50% + ${y}px)`;
  });

  // Popup elements
  const popup    = document.getElementById('convictionPopup');
  const backdrop = document.getElementById('convictionBackdrop');
  const closeBtn = document.getElementById('convictionClose');
  const popupIcon  = document.getElementById('popupIcon');
  const popupTag   = document.getElementById('popupTag');
  const popupTitle = document.getElementById('popupTitle');
  const popupBody  = document.getElementById('popupBody');

  function openPopup(idx) {
    const c = convictions[idx];
    popupIcon.innerHTML  = c.icon;
    popupTag.textContent   = c.tag;
    popupTitle.textContent = c.title;
    popupBody.textContent  = c.body;
    popup.classList.add('open');
    backdrop.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
    nodes.forEach(n => n.classList.remove('active'));
    nodes[idx].classList.add('active');
  }

  function closePopup() {
    popup.classList.remove('open');
    backdrop.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');
    nodes.forEach(n => n.classList.remove('active'));
  }

  nodes.forEach(node => {
    node.addEventListener('click', () => openPopup(+node.dataset.idx));
  });

  // Mobile grid cards — same popup
  document.querySelectorAll('.conviction-mobile-card').forEach(card => {
    card.addEventListener('click', () => openPopup(+card.dataset.idx));
  });

  closeBtn.addEventListener('click', closePopup);
  backdrop.addEventListener('click', closePopup);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });
})();

// ─── Engines focus carousel ───
(function () {
  const track = document.querySelector('.engines-scroll-track');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.engine-card'));
  const prev  = document.querySelector('.engines-arrow--prev');
  const next  = document.querySelector('.engines-arrow--next');
  let current = 0;

  function goTo(idx, scroll = true) {
    current = Math.max(0, Math.min(idx, cards.length - 1));
    cards.forEach((c, i) => c.classList.toggle('is-active', i === current));
    if (scroll) cards[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // Activate first card on load without scrolling
  goTo(0, false);

  prev?.addEventListener('click', () => goTo(current - 1));
  next?.addEventListener('click', () => goTo(current + 1));

  // Sync active state when user manually swipes
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const center = track.scrollLeft + track.offsetWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((c, i) => {
        const dist = Math.abs((c.offsetLeft + c.offsetWidth / 2) - center);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      if (closest !== current) { current = closest; cards.forEach((c, i) => c.classList.toggle('is-active', i === current)); }
    }, 80);
  }, { passive: true });
})();

// ─── Contact form ───
const form = document.querySelector('form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '✓ Sent — We\'ll be in touch';
    btn.style.background = 'rgba(201,168,76,0.2)';
    btn.style.color = 'var(--gold)';
    btn.style.border = '1.5px solid var(--gold)';
  }, 1400);
});
