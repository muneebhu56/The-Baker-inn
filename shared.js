/* shared.js – The Bakers Inn v3 */

// ── NAV ──────────────────────────────────────────────
function injectNav(active) {
  const pages = [
    { id:'home',    href:'index.html',   label:'Home' },
    { id:'about',   href:'about.html',   label:'Our Story' },
    { id:'menu',    href:'menu.html',    label:'Menu' },
    { id:'builder', href:'builder.html', label:'Cake Builder ✦' },
    { id:'gallery', href:'gallery.html', label:'Gallery' },
    { id:'reviews', href:'reviews.html', label:'Reviews' },
  ];
  const links = pages.map(p =>
    `<li><a href="${p.href}" class="${active===p.id?'active':''}">${p.label}</a></li>`
  ).join('');
  const mobileLinks = pages.map(p =>
    `<a href="${p.href}" class="${active===p.id?'active':''}">${p.label}</a>`
  ).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <div class="mobile-overlay" id="mobileOverlay"></div>
    <div class="mobile-nav" id="mobileNav">
      ${mobileLinks}
      <a href="contact.html" style="background:var(--caramel);color:white;border-radius:8px;margin-top:1rem;text-align:center;">Visit Us</a>
    </div>
    <nav id="navbar">
      <a href="index.html" class="nav-logo">
        <span class="nav-logo-dot"></span>
        The Bakers Inn
      </a>
      <ul class="nav-center">${links}</ul>
      <div class="nav-right">
        <a href="contact.html" class="nav-pill ${active==='contact'?'active':''}">Visit Us</a>
        <button class="hamburger" id="menuBtn"><span></span><span></span><span></span></button>
      </div>
    </nav>
  `);
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('mobileNav').classList.add('open');
    document.getElementById('mobileOverlay').classList.add('open');
  });
  document.getElementById('mobileOverlay').addEventListener('click', () => {
    document.getElementById('mobileNav').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('open');
  });
  window.addEventListener('scroll', () =>
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40)
  );
}

// ── FOOTER ──────────────────────────────────────────
function injectFooter() {
  document.body.insertAdjacentHTML('beforeend', `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="footer-logo">
              <span style="width:8px;height:8px;border-radius:50%;background:var(--caramel);flex-shrink:0;"></span>
              The Bakers Inn
            </a>
            <p>A household name in Faisalabad since 1987. Evolving through generations, crafting quality with love — every single day.</p>
          </div>
          <div class="footer-col">
            <h5>Pages</h5>
            <a href="index.html">Home</a>
            <a href="about.html">Our Story</a>
            <a href="menu.html">Menu</a>
            <a href="builder.html">Cake Builder</a>
            <a href="gallery.html">Gallery</a>
            <a href="reviews.html">Reviews</a>
            <a href="contact.html">Visit Us</a>
          </div>
          <div class="footer-col">
            <h5>Specialties</h5>
            <p>Custom Cakes</p>
            <p>Pastries & Donuts</p>
            <p>Cookies & Rusks</p>
            <p>Breads</p>
            <p>Savoury Snacks</p>
          </div>
          <div class="footer-col">
            <h5>Find Us</h5>
            <a href="tel:0418541838">(041) 8541838</a>
            <p>138 B, Block B</p>
            <p>People's Colony No 1</p>
            <p>Faisalabad, 38000</p>
            <p style="margin-top:0.5rem">Open · Closes 1 AM</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2024 The Bakers Inn · Est. Faisalabad 1987</span>
          <span>Baked with love 🧡</span>
        </div>
      </div>
    </footer>
  `);
}

// ── FADE-INS ─────────────────────────────────────────
function initFadeIns() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => io.observe(el));
}

// ── PARTICLE CANVAS (flour/sprinkles) ────────────────
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const SHAPES = ['circle', 'star', 'rect', 'cross'];
  const COLORS = [
    'rgba(212,130,74,ALPHA)',
    'rgba(232,184,109,ALPHA)',
    'rgba(245,208,138,ALPHA)',
    'rgba(240,232,216,ALPHA)',
    'rgba(168,144,112,ALPHA)',
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function Particle() {
    this.reset = function(fromTop) {
      this.x = Math.random() * W;
      this.y = fromTop ? -20 : Math.random() * H;
      this.size = 2 + Math.random() * 5;
      this.speedY = 0.3 + Math.random() * 0.7;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.angle  = Math.random() * Math.PI * 2;
      this.spin   = (Math.random() - 0.5) * 0.04;
      this.alpha  = 0.15 + Math.random() * 0.5;
      this.shape  = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.sway   = (Math.random() - 0.5) * 0.008;
      this.swayT  = Math.random() * Math.PI * 2;
    };
    this.reset(false);

    this.update = function() {
      this.y += this.speedY;
      this.swayT += this.sway;
      this.x += this.speedX + Math.sin(this.swayT * 40) * 0.3;
      this.angle += this.spin;
      if (this.y > H + 20) this.reset(true);
    };

    this.draw = function() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color.replace('ALPHA', this.alpha);

      const s = this.size;
      if (this.shape === 'circle') {
        ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill();
      } else if (this.shape === 'rect') {
        ctx.fillRect(-s * 0.8, -s * 0.5, s * 1.6, s);
      } else if (this.shape === 'cross') {
        ctx.fillRect(-s * 1.5, -s * 0.25, s * 3, s * 0.5);
        ctx.fillRect(-s * 0.25, -s * 1.5, s * 0.5, s * 3);
      } else if (this.shape === 'star') {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i * 4 * Math.PI / 5) - Math.PI / 2;
          const b = (i * 4 * Math.PI / 5) + (2 * Math.PI / 5) - Math.PI / 2;
          if (i === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
          else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          ctx.lineTo(Math.cos(b) * s * 0.4, Math.sin(b) * s * 0.4);
        }
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    };
  }

  for (let i = 0; i < 70; i++) { const p = new Particle(); particles.push(p); }

  let raf;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(loop);
  }
  loop();

  // Pause when off screen for perf
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { if (!raf) loop(); }
    else { cancelAnimationFrame(raf); raf = null; }
  });
  io.observe(canvas);
}

// ── OVEN TIMERS ───────────────────────────────────────
function initOvenTimers() {
  document.querySelectorAll('[data-bake]').forEach(el => {
    const mins = parseInt(el.dataset.bake);
    const ms   = mins * 60 * 1000;
    function tick() {
      const now  = Date.now();
      const next = Math.ceil(now / ms) * ms;
      const diff = next - now;
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = n => String(n).padStart(2, '0');
      el.textContent = `${pad(m)}:${pad(s)}`;
    }
    tick();
    setInterval(tick, 1000);
  });
}

// ── CONFETTI ──────────────────────────────────────────
function confettiBurst(cx, cy, count = 30) {
  const cols = ['#d4824a','#e8b86d','#f5d08a','#f5ede0','#4caf75'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
    const dist  = 50 + Math.random() * 100;
    const size  = 5 + Math.random() * 6;
    el.style.cssText = `
      position:fixed; left:${cx}px; top:${cy}px;
      width:${size}px; height:${size}px;
      background:${cols[i % cols.length]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events:none; z-index:9999;
      transition: all 0.8s cubic-bezier(0.2,0.9,0.3,1);
      transform: translate(-50%,-50%) rotate(0deg);
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.left = (cx + Math.cos(angle) * dist) + 'px';
      el.style.top  = (cy + Math.sin(angle) * dist) + 'px';
      el.style.opacity = '0';
      el.style.transform = `translate(-50%,-50%) rotate(${Math.random()*360}deg) scale(0)`;
    });
    setTimeout(() => el.remove(), 900);
  }
}
