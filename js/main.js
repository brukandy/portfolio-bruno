/* ============================================
   BRUNO LORENZON — PORTFOLIO
   main.js — Animations & Interactions
   ============================================ */

// ── SCROLL REVEAL (fade-up + card-reveal) ─────────────────────
const revealEls = document.querySelectorAll('.fade-up, .card-reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

revealEls.forEach(el => observer.observe(el));

// Trigger elements already in viewport on load
window.addEventListener('load', () => {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
});

// ── HERO FLOATING IMAGES — scroll parallax + mouse drift ──────
const floats = document.querySelectorAll('.hero__float');

if (floats.length) {
  // Base CSS rotations
  const baseRot    = [-12, 10, 4, -6];
  // Scroll speeds: negative = moves up faster (exit viewport top)
  // Top cards go faster, bottom cards slower
  const scrollSpeed = [-0.45, -0.35, -0.12, -0.18];
  // Mouse drift speeds
  const mouseSpeed  = [0.022, -0.018, 0.014, -0.020];

  let mouseX = 0, mouseY = 0;
  let curMouseX = 0, curMouseY = 0;
  let scrollY = 0, curScrollY = 0;
  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    mouseX = e.clientX - cx;
    mouseY = e.clientY - cy;
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: true });

  function tick() {
    rafId = null;

    // Lerp mouse
    curMouseX += (mouseX - curMouseX) * 0.07;
    curMouseY += (mouseY - curMouseY) * 0.07;
    // Lerp scroll
    curScrollY += (scrollY - curScrollY) * 0.10;

    floats.forEach((el, i) => {
      const r  = baseRot[i];
      const sy = curScrollY * scrollSpeed[i];
      const mx = curMouseX * mouseSpeed[i];
      const my = curMouseY * mouseSpeed[i];
      el.style.transform = `rotate(${r}deg) translate(${mx}px, ${sy + my}px)`;
    });

    // Keep animating if still moving
    const moving =
      Math.abs(mouseX - curMouseX) + Math.abs(mouseY - curMouseY) > 0.3 ||
      Math.abs(scrollY - curScrollY) > 0.3;
    if (moving) rafId = requestAnimationFrame(tick);
  }
}

// ── FILTER BUTTONS ─────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-categories]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const cats = card.dataset.categories || '';
      const show = filter === 'all' || cats.includes(filter);

      if (show) {
        card.style.display = '';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = '';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
        setTimeout(() => { card.style.display = 'none'; }, 250);
      }
    });
  });
});

// ── NAV: transparent → frosted on scroll ──────────────────────
const nav = document.querySelector('.nav');
if (nav && !nav.classList.contains('scrolled')) {
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── SMOOTH hover tilt on project cards ────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
