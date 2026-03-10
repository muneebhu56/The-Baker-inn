/* ============================================================
   animations.js — The Bakers Inn
   Scroll reveals · 3D card tilt · Magnetic buttons
   Parallax · Split-text · Number counters · Custom cursor
   ============================================================ */

(function() {
  'use strict';

  /* ── 1. CUSTOM CURSOR ─────────────────────────────────── */
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'ani-cursor-dot';
    ring.className = 'ani-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = -100, my = -100, rx = -100, ry = -100;
    let isHover = false;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });

    // Smooth ring follow
    function followRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${isHover ? 2.2 : 1})`;
      requestAnimationFrame(followRing);
    }
    followRing();

    // Grow on interactive elements
    const hoverSel = 'a,button,.btn,.m-card,.r-card,.val-card,.oven-card,.size-btn,.opt-btn,.topping-btn,.m-item';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverSel)) {
        isHover = true;
        dot.classList.add('ani-cursor-dot--hover');
        ring.classList.add('ani-cursor-ring--hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverSel)) {
        isHover = false;
        dot.classList.remove('ani-cursor-dot--hover');
        ring.classList.remove('ani-cursor-ring--hover');
      }
    });
    document.addEventListener('mousedown', () => ring.classList.add('ani-cursor-ring--click'));
    document.addEventListener('mouseup',   () => ring.classList.remove('ani-cursor-ring--click'));
  }

  /* ── 2. SCROLL REVEAL ─────────────────────────────────── */
  function initScrollReveal() {
    // Tag every major element with a reveal class & stagger
    const selectors = [
      { sel: '.h1, .h2',             cls: 'reveal-up',    delay: 0   },
      { sel: '.tag, .page-label',     cls: 'reveal-up',    delay: 0   },
      { sel: '.body-lg',              cls: 'reveal-up',    delay: 80  },
      { sel: '.btn:not(.nav-pill)',   cls: 'reveal-up',    delay: 120 },
      { sel: '.m-card',               cls: 'reveal-up',    stagger: 80 },
      { sel: '.r-card',               cls: 'reveal-up',    stagger: 60 },
      { sel: '.val-card',             cls: 'reveal-up',    stagger: 80 },
      { sel: '.oven-card',            cls: 'reveal-up',    stagger: 60 },
      { sel: '.q-card',               cls: 'reveal-up',    stagger: 60 },
      { sel: '.menu-card',            cls: 'reveal-up',    stagger: 80 },
      { sel: '.tl-item',              cls: 'reveal-left',  stagger: 100},
      { sel: '.stat-num',             cls: 'reveal-scale', stagger: 80 },
      { sel: '.g-stat',               cls: 'reveal-scale', stagger: 80 },
      { sel: '.promo-step',           cls: 'reveal-left',  stagger: 80 },
      { sel: '.footer-col',           cls: 'reveal-up',    stagger: 60 },
      { sel: '.story-imgs',           cls: 'reveal-left',  delay: 0   },
      { sel: '.map-embed-wrap',       cls: 'reveal-up',    delay: 0   },
      { sel: '.form-wrap',            cls: 'reveal-up',    delay: 0   },
    ];

    selectors.forEach(({ sel, cls, delay = 0, stagger }) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (el.closest('nav') || el.closest('footer')) return;
        if (!el.classList.contains('reveal-tagged')) {
          el.classList.add('reveal-base', cls, 'reveal-tagged');
          el.style.transitionDelay = `${delay + (stagger ? i * stagger : 0)}ms`;
        }
      });
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-base').forEach(el => io.observe(el));
  }

  /* ── 3. 3D CARD TILT ──────────────────────────────────── */
  function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tiltSels = '.m-card, .r-card, .val-card, .oven-card, .q-card, .menu-card, .fake-builder-preview, .r-score-card';

    function applyTilt(el) {
      el.addEventListener('mousemove', e => {
        const r    = el.getBoundingClientRect();
        const cx   = r.left + r.width  / 2;
        const cy   = r.top  + r.height / 2;
        const dx   = (e.clientX - cx) / (r.width  / 2);
        const dy   = (e.clientY - cy) / (r.height / 2);
        const rotX = -dy * 8;   // max 8deg
        const rotY =  dx * 8;
        el.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
        el.style.transition = 'transform 0.1s ease';

        // Highlight shimmer
        const pct = ((e.clientX - r.left) / r.width * 100).toFixed(1);
        el.style.background = `radial-gradient(circle at ${pct}% ${((e.clientY - r.top)/r.height*100).toFixed(1)}%, rgba(255,255,255,0.04) 0%, transparent 60%), var(--bg2)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform  = '';
        el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
        el.style.background = '';
      });
    }

    // Apply now + watch for dynamically added cards
    document.querySelectorAll(tiltSels).forEach(applyTilt);

    const mo = new MutationObserver(() => {
      document.querySelectorAll(`${tiltSels}:not([data-tilt])`).forEach(el => {
        el.setAttribute('data-tilt', '1');
        applyTilt(el);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ── 4. MAGNETIC BUTTONS ──────────────────────────────── */
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    function magnetise(btn) {
      btn.addEventListener('mousemove', e => {
        const r    = btn.getBoundingClientRect();
        const cx   = r.left + r.width  / 2;
        const cy   = r.top  + r.height / 2;
        const dx   = (e.clientX - cx) * 0.35;
        const dy   = (e.clientY - cy) * 0.35;
        btn.style.transform  = `translate(${dx}px,${dy}px)`;
        btn.style.transition = 'transform 0.1s ease';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform  = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      });
    }

    document.querySelectorAll('.btn-fill, .btn-gold, .nav-pill, .btn-order-cake').forEach(magnetise);

    // Also handle dynamically injected buttons
    const mo = new MutationObserver(() => {
      document.querySelectorAll('.btn-fill:not([data-mag]), .btn-gold:not([data-mag]), .nav-pill:not([data-mag])').forEach(el => {
        el.setAttribute('data-mag', '1');
        magnetise(el);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ── 5. PARALLAX HERO ─────────────────────────────────── */
  function initParallax() {
    const heroBg = document.querySelector('.hero-right img, .page-banner-bg img');
    if (!heroBg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY * 0.3;
          heroBg.style.transform = `translateY(${y}px) scale(1.08)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ── 6. SPLIT TEXT HERO HEADING ───────────────────────── */
  function initSplitText() {
    const heading = document.querySelector('#hero .hero-left h1');
    if (!heading) return;

    // Split into words, wrap each
    const html = heading.innerHTML;
    const words = html.split(/(\s+|<br\s*\/?>)/gi);
    heading.innerHTML = words.map(w => {
      if (!w.trim() || w.match(/<br/i)) return w;
      return `<span class="split-word">${w}</span>`;
    }).join('');

    // Animate each word in
    heading.querySelectorAll('.split-word').forEach((w, i) => {
      w.style.cssText = `
        display:inline-block;
        opacity:0;
        transform:translateY(32px) rotate(-2deg);
        transition: opacity 0.6s ease ${200 + i * 90}ms, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${200 + i * 90}ms;
      `;
    });

    requestAnimationFrame(() => requestAnimationFrame(() => {
      heading.querySelectorAll('.split-word').forEach(w => {
        w.style.opacity   = '1';
        w.style.transform = 'translateY(0) rotate(0)';
      });
    }));
  }

  /* ── 7. NUMBER COUNTERS ───────────────────────────────── */
  function initCounters() {
    const targets = document.querySelectorAll('.stat-num, .g-stat-n, .big-num');

    function animateCount(el) {
      const raw   = el.textContent.trim();
      const match = raw.match(/[\d.]+/);
      if (!match) return;

      const end    = parseFloat(match[0]);
      const prefix = raw.slice(0, raw.indexOf(match[0]));
      const suffix = raw.slice(raw.indexOf(match[0]) + match[0].length);
      const isFloat = match[0].includes('.');
      const dur    = 1600;
      const start  = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const prog    = Math.min(elapsed / dur, 1);
        const ease    = 1 - Math.pow(1 - prog, 3); // easeOutCubic
        const val     = end * ease;
        el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (prog < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    targets.forEach(el => io.observe(el));
  }

  /* ── 8. BUTTON RIPPLE ─────────────────────────────────── */
  function initRipple() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn, .btn-order-cake, .f-tab, .g-tab, .r-tab, .size-btn, .opt-btn');
      if (!btn) return;

      const r    = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const x    = e.clientX - r.left - size / 2;
      const y    = e.clientY - r.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.cssText = `
        width:${size}px; height:${size}px;
        left:${x}px; top:${y}px;
      `;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  }

  /* ── 9. FLOATING BADGES ───────────────────────────────── */
  function initFloatingBadges() {
    document.querySelectorAll('.hero-year-tag, .about-badge, .si-badge, .live-badge').forEach((el, i) => {
      el.style.animation = `float-badge ${2.8 + i * 0.4}s ease-in-out infinite alternate`;
      el.style.animationDelay = `${i * 0.3}s`;
    });
  }

  /* ── 10. NAV LINK UNDERLINE ───────────────────────────── */
  function initNavUnderline() {
    document.querySelectorAll('.nav-center a').forEach(a => {
      a.classList.add('nav-link-ani');
    });
  }

  /* ── 11. SECTION ENTRY LINE ───────────────────────────── */
  function initSectionLines() {
    document.querySelectorAll('.tag').forEach(tag => {
      tag.classList.add('tag-ani');
    });
  }

  /* ── 12. STAGGER GRID ITEMS ON FILTER ─────────────────── */
  // Patch initFadeIns to also handle reveal-base
  const _origInitFadeIns = window.initFadeIns;
  window.initFadeIns = function() {
    if (_origInitFadeIns) _origInitFadeIns();
    // Also re-init tilt and scroll-reveal for newly rendered items
    setTimeout(() => {
      initScrollReveal();
      initCardTilt();
    }, 50);
  };

  /* ── INIT ALL ─────────────────────────────────────────── */
  function init() {
    initCursor();
    initScrollReveal();
    initCardTilt();
    initMagneticButtons();
    initParallax();
    initSplitText();
    initCounters();
    initRipple();
    initFloatingBadges();
    initNavUnderline();
    initSectionLines();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Slight delay so shared.js injects nav/footer first
    setTimeout(init, 80);
  }

})();
