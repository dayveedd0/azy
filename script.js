/* ============================================
   AZY — VHS TAPE EFFECTS
   ============================================ */

(function () {

  /* ---- VHS DATE & COUNTER ---- */
  const dateEl = document.getElementById('vhs-date');
  const counterEl = document.getElementById('vhs-counter');
  let counterSeconds = 0;

  function updateDate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    if (dateEl) dateEl.textContent = `${y}.${m}.${d}`;
  }

  function updateCounter() {
    counterSeconds++;
    const h = String(Math.floor(counterSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((counterSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(counterSeconds % 60).padStart(2, '0');
    if (counterEl) counterEl.textContent = `${h}:${m}:${s}`;
  }

  updateDate();
  setInterval(updateCounter, 1000);

  /* ---- NOISE CANVAS ---- */
  const canvas = document.getElementById('noise-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth / 2;
      canvas.height = window.innerHeight / 2;
    }

    function drawNoise() {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 30;
      }

      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(drawNoise);
    }

    resize();
    window.addEventListener('resize', resize);
    drawNoise();
  }

  /* ---- TRACKING BARS ---- */
  function spawnTrackingBar() {
    const bar = document.createElement('div');
    const isThick = Math.random() > 0.6;
    bar.className = isThick ? 'tracking-bar-thick' : 'tracking-bar';

    const startY = -20;
    const height = isThick ? (Math.random() * 30 + 10) : (Math.random() * 4 + 2);

    Object.assign(bar.style, {
      top: `${startY}px`,
      height: `${height}px`,
      opacity: String(Math.random() * 0.5 + 0.1)
    });

    document.body.appendChild(bar);

    const speed = Math.random() * 3 + 1;
    let y = startY;

    function move() {
      y += speed;
      bar.style.top = `${y}px`;

      if (y > window.innerHeight + 20) {
        bar.remove();
        return;
      }
      requestAnimationFrame(move);
    }

    move();
    setTimeout(spawnTrackingBar, Math.random() * 4000 + 2000);
  }

  setTimeout(spawnTrackingBar, 1500);

  /* ---- RANDOM JITTER / TRACKING ERROR ---- */
  function randomJitter() {
    const body = document.body;
    const shiftX = (Math.random() - 0.5) * 3;
    const duration = Math.random() * 100 + 30;

    body.style.transform = `translateX(${shiftX}px)`;

    setTimeout(() => {
      body.style.transform = '';
    }, duration);

    setTimeout(randomJitter, Math.random() * 10000 + 5000);
  }

  setTimeout(randomJitter, 4000);

  /* ---- PERIODIC BRIGHTNESS FLICKER ---- */
  function brightnessFlicker() {
    const body = document.body;
    const brightness = 0.85 + Math.random() * 0.3;

    body.style.filter = `brightness(${brightness})`;

    setTimeout(() => {
      body.style.filter = '';
    }, Math.random() * 80 + 30);

    setTimeout(brightnessFlicker, Math.random() * 12000 + 6000);
  }

  setTimeout(brightnessFlicker, 6000);

  /* ---- HEAVY STATIC BURST ---- */
  function staticBurst() {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '9994',
      pointerEvents: 'none',
      background: `rgba(184, 184, 176, ${Math.random() * 0.04 + 0.01})`,
      mixBlendMode: 'overlay'
    });

    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
    }, Math.random() * 150 + 50);

    setTimeout(staticBurst, Math.random() * 15000 + 8000);
  }

  setTimeout(staticBurst, 5000);

  /* ---- HORIZONTAL TEAR ---- */
  function horizontalTear() {
    const tearCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < tearCount; i++) {
      const tear = document.createElement('div');
      const yPos = Math.random() * 100;

      Object.assign(tear.style, {
        position: 'fixed',
        top: `${yPos}%`,
        left: '0',
        width: '100%',
        height: `${Math.random() * 2 + 1}px`,
        background: `rgba(184, 184, 176, ${Math.random() * 0.06 + 0.02})`,
        zIndex: '9993',
        pointerEvents: 'none',
        transform: `translateX(${(Math.random() - 0.5) * 10}px)`
      });

      document.body.appendChild(tear);

      setTimeout(() => tear.remove(), Math.random() * 200 + 50);
    }

    setTimeout(horizontalTear, Math.random() * 7000 + 3000);
  }

  setTimeout(horizontalTear, 3000);

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll(
    '.tape-header, .tape-text-block, .viewfinder-frame, .viewfinder-header, .footer-inner, .sighting-entry, .hub-link'
  );

  revealEls.forEach(el => el.classList.add('reveal-up'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));

  /* ---- VIEWFINDER HOVER STATIC ---- */
  document.querySelectorAll('.viewfinder-frame').forEach(frame => {
    frame.addEventListener('mouseenter', () => {
      const noise = frame.querySelector('.frame-noise');
      if (noise) noise.style.opacity = '0.2';
    });

    frame.addEventListener('mouseleave', () => {
      const noise = frame.querySelector('.frame-noise');
      if (noise) noise.style.opacity = '';
    });
  });

  /* ---- BOTTOM HEAD-SWITCH ARTIFACT ---- */
  function headSwitch() {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      height: `${Math.random() * 8 + 4}px`,
      background: `linear-gradient(180deg, transparent, rgba(184, 184, 176, 0.06), transparent)`,
      zIndex: '9993',
      pointerEvents: 'none'
    });

    document.body.appendChild(bar);

    setTimeout(() => bar.remove(), Math.random() * 300 + 100);
    setTimeout(headSwitch, Math.random() * 5000 + 3000);
  }

  setTimeout(headSwitch, 3000);

})();
