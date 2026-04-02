/* ═══════════════════════════════════════════════════════════
   AZY — script.js
═══════════════════════════════════════════════════════════ */

// ─── VHS TIMESTAMP ────────────────────────────────────────
function updateTimestamp() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const ts  = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}  ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const el  = document.getElementById('vhsTimestamp');
  if (el) el.textContent = ts;
}
setInterval(updateTimestamp, 1000);
updateTimestamp();

// ─── NAVIGATION ──────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
const pages    = document.querySelectorAll('.page');

function showPage(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));

  const target     = document.getElementById(pageId);
  const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);

  if (target)     { target.classList.add('active'); window.scrollTo(0, 0); }
  if (activeLink) { activeLink.classList.add('active'); }

  if (pageId === 'lore') setTimeout(revealFragments, 80);
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.getAttribute('data-page'));
  });
});

// Logo click → home
const logoEl = document.getElementById('navLogoHome');
if (logoEl) {
  logoEl.addEventListener('click', () => showPage('home'));
}

// ─── FRAGMENT REVEAL ─────────────────────────────────────
function revealFragments() {
  document.querySelectorAll('.fragment').forEach((frag, i) => {
    setTimeout(() => frag.classList.add('visible'), i * 120);
  });
}
window.addEventListener('scroll', () => {
  document.querySelectorAll('.fragment:not(.visible)').forEach(frag => {
    if (frag.getBoundingClientRect().top < window.innerHeight * 0.9)
      frag.classList.add('visible');
  });
}, { passive: true });

// ─── COPY CONTRACT ADDRESS ───────────────────────────────
function copyCA() {
  const caEl = document.querySelector('.ca-text');
  if (!caEl) return;
  const text = caEl.textContent.trim();
  const btn  = document.getElementById('copyBtn');
  const fb   = document.getElementById('copyFeedback');

  navigator.clipboard.writeText(text).then(() => {
    if (fb)  { fb.classList.add('show'); setTimeout(() => fb.classList.remove('show'), 1800); }
    if (btn) { btn.textContent = '✓ COPIED'; setTimeout(() => { btn.innerHTML = '<span class="copy-icon">⧉</span> COPY'; }, 1800); }
  }).catch(() => {
    const r = document.createRange();
    r.selectNode(caEl);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  });
}

// ─── VHS GLITCH CANVAS ───────────────────────────────────
(function vhsGlitchCanvas() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; inset: 0; z-index: 9006;
    pointer-events: none; width: 100%; height: 100%;
    mix-blend-mode: overlay;
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Random horizontal glitch lines
    if (Math.random() < 0.035) {
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        const y    = Math.random() * h;
        const lh   = Math.random() * 4 + 1;
        const a    = Math.random() * 0.1 + 0.02;
        const shift = (Math.random() - 0.5) * 20;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(0, y, w, lh);
        ctx.fillStyle = `rgba(255,50,50,${a * 0.4})`;
        ctx.fillRect(shift, y, w * 0.35, lh * 0.5);
      }
    }

    // Vertical tear
    if (Math.random() < 0.006) {
      const sy    = Math.random() * h * 0.8;
      const sh    = Math.random() * 70 + 15;
      const shift = (Math.random() - 0.5) * 26;
      try {
        const img = ctx.getImageData(0, sy, w, sh);
        ctx.clearRect(0, sy, w, sh);
        ctx.putImageData(img, shift, sy);
      } catch(e) {}
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── NAV SCROLL BORDER ───────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) nav.style.borderBottomColor = window.scrollY > 20
    ? 'rgba(255,255,255,0.14)'
    : 'rgba(255,255,255,0.07)';
}, { passive: true });

// ─── INIT ─────────────────────────────────────────────────
showPage('home');