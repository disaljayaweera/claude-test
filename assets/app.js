// Maison Obsidian — interaction engine
// Lightweight spring-physics, magnetic cursor attraction, scroll reveal,
// and a procedural "liquid-gold shimmer" canvas backdrop.

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll('.cell, .entry, .stats li, .hero-title .line, .section-head, .lede, .hero-meta');
  revealTargets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }

  /* ---------- Magnetic spring attraction ---------- */
  if (!reduced) {
    const magnets = document.querySelectorAll('.magnet, .magnet-card');
    magnets.forEach(el => {
      let tx = 0, ty = 0, vx = 0, vy = 0, targetX = 0, targetY = 0;
      const stiffness = 0.18, damping = 0.78, strength = el.classList.contains('magnet-card') ? 14 : 22;
      let raf, hovering = false;

      const tick = () => {
        const fx = (targetX - tx) * stiffness;
        const fy = (targetY - ty) * stiffness;
        vx = (vx + fx) * damping;
        vy = (vy + fy) * damping;
        tx += vx; ty += vy;
        el.style.transform = `translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0)`;
        if (hovering || Math.abs(vx) > 0.01 || Math.abs(vy) > 0.01 || Math.abs(tx - targetX) > 0.05) {
          raf = requestAnimationFrame(tick);
        }
      };

      el.addEventListener('mouseenter', () => { hovering = true; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        targetX = dx * strength;
        targetY = dy * strength;
      });
      el.addEventListener('mouseleave', () => { hovering = false; targetX = 0; targetY = 0; });
    });
  }

  /* ---------- Parallax orbs ---------- */
  if (!reduced) {
    const orbs = document.querySelectorAll('.orb, .atelier-orb');
    let scrollY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      scrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          orbs.forEach((o, i) => {
            const r = o.getBoundingClientRect();
            const center = r.top + r.height / 2 - innerHeight / 2;
            const p = -center * 0.06 * (1 + (i % 3) * 0.15);
            o.style.setProperty('--py', p.toFixed(2) + 'px');
            o.style.translate = `0 ${p.toFixed(2)}px`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Liquid-gold shimmer backdrop ---------- */
  const canvas = document.getElementById('shimmer');
  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mouseX = 0.5, mouseY = 0.5;
    let scrollOffset = 0;

    const resize = () => {
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / innerWidth;
      mouseY = e.clientY / innerHeight;
    });
    window.addEventListener('scroll', () => { scrollOffset = window.scrollY; }, { passive: true });

    const lines = 14;
    let t = 0;
    const tick = () => {
      t += 0.006;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1 * dpr;

      for (let i = 0; i < lines; i++) {
        const y = (i / lines) * h + Math.sin(t + i) * 18 * dpr;
        const phase = t * 1.4 + i * 0.6 + scrollOffset * 0.0015;
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        const a = 0.04 + Math.sin(phase) * 0.04;
        grad.addColorStop(0, 'rgba(212,175,55,0)');
        grad.addColorStop(Math.max(0.01, (Math.sin(phase) + 1) / 2 - 0.15), `rgba(212,175,55,${Math.max(0, a).toFixed(3)})`);
        grad.addColorStop((Math.sin(phase) + 1) / 2, `rgba(245,217,126,${Math.max(0, a + 0.06).toFixed(3)})`);
        grad.addColorStop(Math.min(0.99, (Math.sin(phase) + 1) / 2 + 0.15), `rgba(197,160,33,${Math.max(0, a).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.strokeStyle = grad;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 24 * dpr) {
          const yy = y + Math.sin(x * 0.0035 + t * 1.1 + i) * 10 * dpr + (mouseY - 0.5) * 12 * dpr;
          if (x === 0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();
