/* ============================================
   BRUNO LORENZON — PORTFOLIO
   main.js — Animations & Interactions
   ============================================ */

// ── WORD-BY-WORD REVEAL for headings (h2 outside hero) ────────
function initWordReveal(el) {
  // Split preserving <br> tags
  const parts = el.innerHTML.split(/(<br\s*\/?>) */gi);
  el.innerHTML = parts.map(p => {
    if (p.match(/^<br/i)) return '<br>';
    return p.split(/\s+/).filter(Boolean)
             .map(w => `<span class="word-reveal">${w}</span>`)
             .join(' ');
  }).join('');
  el.querySelectorAll('.word-reveal').forEach((word, i) => {
    word.style.cssText = 'display:inline-block;opacity:0;transform:translateY(40px);will-change:transform,opacity;';
    word.dataset.delay = i;
  });
}

const headingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const words = entry.target.querySelectorAll('.word-reveal');
    words.forEach((word, i) => {
      setTimeout(() => {
        word.style.transition = 'opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1)';
        word.style.opacity = '1';
        word.style.transform = 'translateY(0)';
      }, i * 90);
    });
    headingObserver.unobserve(entry.target);
  });
}, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('h1, h2').forEach(el => {
  if (el.closest('.hero') || el.closest('.case-hero') || el.classList.contains('case-section__heading')) return;
  initWordReveal(el);
  headingObserver.observe(el);
});

// ── SCROLL REVEAL — for other elements below hero ─────────────
const revealEls = document.querySelectorAll('.fade-up, .card-reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

revealEls.forEach(el => {
  if (!el.closest('.hero')) revealObserver.observe(el); // hero has own animation
});

// ── IMG REVEAL (case study full-width images) ──────────────────
const imgRevealEls = document.querySelectorAll('.img-reveal');
const imgRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      imgRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

imgRevealEls.forEach(el => imgRevealObserver.observe(el));

// ── HERO FLOATING CARDS ───────────────────────────────────────
const floats = document.querySelectorAll('.hero__float');
const baseRot  = [-25, 32, -19, 12];
const startRot = [-10, 18,  -5,  6]; // rotates TO baseRot during entrance

// Scroll: top cards (0,1) scroll nearly at normal speed (tiny positive lag).
// Bottom cards (2,3) get an extra upward push = exit viewport faster.
// Text scrolls naturally (no JS modification).
const scrollFactor = [0.10, 0.10, -0.22, -0.22];

const mouseSpeed = [0.022, -0.018, 0.014, -0.020];

const entryDelays   = [850, 1130, 1410, 1690]; // sequential: top-left → top-right → bottom-left → bottom-right
const entryDuration = 1280;                      // smooth, long

let mouseX = 0, mouseY = 0;
let curMouseX = 0, curMouseY = 0;
let scrollY = 0, curScrollY = 0;
let rafId  = null;
let _launchCards = null; // assigned after floats are confirmed

if (floats.length) {
  // Hide cards immediately — start offsets computed dynamically at launch time
  floats.forEach(el => { el.style.opacity = '0'; });

  _launchCards = function () {
    // Compute explosion origin from h1 text center at launch time
    const h1 = document.querySelector('.hero__title');
    const heroRect   = document.querySelector('.hero').getBoundingClientRect();
    const h1rect     = h1 ? h1.getBoundingClientRect() : heroRect;
    const textCX = h1rect.left + h1rect.width  / 2 - heroRect.left;
    const textCY = h1rect.top  + h1rect.height / 2 - heroRect.top;

    // Cardinal offsets from text center to each card's final CSS position
    // (negative = card starts closer to text center)
    const startOffsets = [
      { x:  420, y:  220, s: 0.42 },
      { x: -400, y:  210, s: 0.42 },
      { x:  360, y: -200, s: 0.48 },
      { x: -340, y: -190, s: 0.48 },
    ];

    // Set each card to starting position (at text center offset)
    floats.forEach((el, i) => {
      const { x, y, s } = startOffsets[i];
      el.style.transform = `rotate(${startRot[i]}deg) translate(${x}px,${y}px) scale(${s})`;
    });

    let done = 0;
    floats.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition =
          `opacity ${entryDuration}ms cubic-bezier(0.16,1,0.3,1),` +
          `transform ${entryDuration}ms cubic-bezier(0.16,1,0.3,1)`;
        el.style.opacity   = '1';
        el.style.transform = `rotate(${baseRot[i]}deg) translate(0px,0px) scale(1)`;

        setTimeout(() => {
          el.style.transition = '';
          if (++done === floats.length) {
            _startDrift();
            // Enable breathing animation after all cards have arrived
            floats.forEach(card => {
              const pulse = card.querySelector('.float-pulse');
              if (pulse) pulse.style.animationPlayState = 'running';
            });
          }
        }, entryDuration + 20);
      }, entryDelays[i]);
    });
  };

  // Scroll listener starts immediately so copy parallax works from page load
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!rafId) rafId = requestAnimationFrame(_tick);
  }, { passive: true });

  function _startDrift() {
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      mouseX = e.clientX - cx;
      mouseY = e.clientY - cy;
      if (!rafId) rafId = requestAnimationFrame(_tick);
    });
  }

  function _tick() {
    rafId = null;
    curMouseX  += (mouseX  - curMouseX)  * 0.07;
    curMouseY  += (mouseY  - curMouseY)  * 0.07;
    curScrollY += (scrollY - curScrollY) * 0.09;

    floats.forEach((el, i) => {
      const mx = curMouseX * mouseSpeed[i];
      const my = curMouseY * mouseSpeed[i];
      const sy = curScrollY * scrollFactor[i];
      el.style.transform = `rotate(${baseRot[i]}deg) translate(${mx}px,${sy + my}px)`;
    });

    // Copy scrolls upward like bottom cards
    const copy = document.querySelector('.hero__copy');
    if (copy) copy.style.transform = `translateY(${curScrollY * -0.22}px)`;

    const moving =
      Math.abs(mouseX  - curMouseX)  + Math.abs(mouseY  - curMouseY)  > 0.3 ||
      Math.abs(scrollY - curScrollY) > 0.4;
    if (moving) rafId = requestAnimationFrame(_tick);
  }
}

// ── HERO ENTRANCE SEQUENCE ────────────────────────────────────
// 1 eyebrow arc → 2 title words → 3 subtitle → 4 CTA → 5 cards
window.addEventListener('load', () => {

  // 1. Eyebrow arc
  const eyebrow = document.querySelector('.hero__eyebrow');
  if (eyebrow) {
    eyebrow.style.transform = 'translateY(18px)';
    setTimeout(() => {
      eyebrow.style.transition = 'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)';
      eyebrow.style.opacity    = '1';
      eyebrow.style.transform  = 'translateY(0)';
    }, 60);
  }

  // 2. Title — word by word
  const h1 = document.querySelector('.hero__title');
  if (h1) {
    h1.classList.remove('fade-up', 'fade-up-delay-1');
    h1.style.opacity = '1';
    const parts = h1.innerHTML.split(/(<br\s*\/?>) */gi);
    h1.innerHTML = parts.map(p => {
      if (p.match(/^<br/i)) return '<br>';
      return p.split(/\s+/).filter(Boolean)
               .map(w => `<span class="word-reveal">${w}</span>`)
               .join(' ');
    }).join('');
    h1.querySelectorAll('.word-reveal').forEach((word, i) => {
      word.style.cssText = 'display:inline-block;opacity:0;transform:translateY(44px);will-change:transform,opacity;';
      setTimeout(() => {
        word.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
        word.style.opacity    = '1';
        word.style.transform  = 'translateY(0)';
      }, 150 + i * 90);
    });
  }

  // 3. Subtitle
  const subtitle = document.querySelector('.hero__subtitle');
  if (subtitle) {
    subtitle.classList.remove('fade-up', 'fade-up-delay-2');
    subtitle.style.cssText = 'opacity:0;transform:translateY(44px);';
    setTimeout(() => {
      subtitle.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      subtitle.style.opacity    = '1';
      subtitle.style.transform  = 'translateY(0)';
    }, 540);
  }

  // 4. CTA
  const cta = document.querySelector('.hero__cta');
  if (cta) {
    cta.classList.remove('fade-up', 'fade-up-delay-3');
    cta.style.cssText = 'opacity:0;transform:translateY(44px);';
    setTimeout(() => {
      cta.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      cta.style.opacity    = '1';
      cta.style.transform  = 'translateY(0)';
    }, 730);
  }

  // 5. Cards — after text
  if (_launchCards) _launchCards();

  // Trigger scroll reveal for any below-fold fade-up already in view
  revealEls.forEach(el => {
    if (el.closest('.hero')) return;
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
  });
});

// ── FILTER BUTTONS ─────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card[data-categories]').forEach(card => {
      const show = filter === 'all' || (card.dataset.categories || '').includes(filter);
      if (show) {
        card.style.display = '';
        requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = ''; });
      } else {
        card.style.opacity = '0'; card.style.transform = 'scale(0.96)';
        setTimeout(() => { card.style.display = 'none'; }, 250);
      }
    });
  });
});

// ── NAV: transparent → frosted on scroll ──────────────────────
const nav = document.querySelector('.nav');
if (nav && !nav.classList.contains('scrolled')) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Project cards: only image zoom on hover (handled via CSS)

// ── VALUE SECTION — floating skill tags explosion ──────────────
(function initValueTags() {
  const section  = document.querySelector('.value');
  const floatsEl = document.querySelector('.value__floats');
  const titleEl  = document.querySelector('.value__title');
  if (!section || !floatsEl || !titleEl) return;

  // Tag definitions: text + final offset (px) from section center + rotation
  const TAGS = [
    { text: 'UX Research',        dx: -380, dy: -130, rot: -5 },
    { text: 'Product Design',     dx:  +80, dy: -230, rot:  4 },
    { text: 'E-learning Design',  dx: +370, dy: -155, rot:  7 },
    { text: 'UI Design',          dx: +395, dy:  +30, rot:  3 },
    { text: 'Design Systems',     dx: -395, dy:  +30, rot: -5 },
    { text: 'AI-Driven Design',   dx:  -75, dy: +250, rot:  5 },
    { text: 'Strategy & Metrics', dx: +305, dy: +200, rot: -4 },
    { text: 'Prototipazione',     dx: -320, dy: +200, rot: -3 },
    { text: 'User Testing',       dx: +110, dy: +255, rot:  6 },
  ];

  // Build DOM
  TAGS.forEach(d => {
    const el = document.createElement('span');
    el.className = 'value__tag';
    el.textContent = d.text;
    el._dx = d.dx; el._dy = d.dy; el._rot = d.rot;
    floatsEl.appendChild(el);
  });

  const tagEls = Array.from(floatsEl.querySelectorAll('.value__tag'));

  // Place tags at their final positions
  function positionTags() {
    const w  = section.offsetWidth;
    const h  = section.offsetHeight;
    const cx = w / 2;
    const cy = h / 2;
    // Scale offsets proportionally to viewport so tags stay within bounds
    const sc = Math.min(1, w / 1440);
    tagEls.forEach(el => {
      el.style.left = (cx + el._dx * sc) + 'px';
      el.style.top  = (cy + el._dy * sc) + 'px';
    });
  }
  positionTags();
  window.addEventListener('resize', () => {
    positionTags();
    // After resize, snap tags to their final visual position (no re-animation)
    tagEls.forEach(el => {
      if (el.style.opacity === '1') {
        el.style.transition = 'none';
        el.style.transform  = `translate(-50%, -50%) rotate(${el._rot}deg) scale(1)`;
      }
    });
  }, { passive: true });

  // Explosion entrance — triggered once when section enters viewport
  let launched = false;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || launched) return;
    launched = true;
    obs.disconnect();

    // Measure title center relative to section
    const secRect   = section.getBoundingClientRect();
    const titleRect = titleEl.getBoundingClientRect();
    const tcx = titleRect.left + titleRect.width  / 2 - secRect.left;
    const tcy = titleRect.top  + titleRect.height / 2 - secRect.top;

    tagEls.forEach((el, i) => {
      const finalL = parseFloat(el.style.left);
      const finalT = parseFloat(el.style.top);
      // Offset from final position to title center (start point)
      const sdx = tcx - finalL;
      const sdy = tcy - finalT;

      // Set start: at title center, tiny, no rotation
      el.style.transition = 'none';
      el.style.opacity    = '1';
      el.style.transform  = `translate(calc(-50% + ${sdx}px), calc(-50% + ${sdy}px)) scale(0.15) rotate(0deg)`;

      const delay = 180 + i * 75;
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.transition = `transform 1150ms cubic-bezier(0.16,1,0.3,1),
                                 opacity   350ms ease`;
          el.style.transform  = `translate(-50%, -50%) rotate(${el._rot}deg) scale(1)`;
        }, delay);
      });
    });
  }, { threshold: 0.25 });

  obs.observe(section);
}());

// ── CASE STUDY SCROLL ANIMATIONS ──────────────────────────────
(function initCaseAnimations() {
  if (!document.querySelector('.case-hero')) return; // only on case study pages

  // 1. Stagger list items — remove fade-up from parent, animate each li
  document.querySelectorAll('.case-list.fade-up').forEach(list => {
    list.classList.remove('fade-up');
    list.style.opacity = '1';
    list.style.transform = 'none';
    list.querySelectorAll('li').forEach((li, i) => {
      li.classList.add('case-stagger');
      li.style.setProperty('--sd', (i * 0.1) + 's');
    });
  });

  // 2. Stagger metrics — remove fade-up from parent, animate each metric
  document.querySelectorAll('.case-metrics.fade-up').forEach(group => {
    group.classList.remove('fade-up');
    group.style.opacity = '1';
    group.querySelectorAll('.case-metric').forEach((el, i) => {
      el.classList.add('case-stagger');
      el.style.setProperty('--sd', (i * 0.12) + 's');
    });
  });

  // 3. Stagger meta items
  document.querySelectorAll('.case-meta.fade-up').forEach(meta => {
    meta.classList.remove('fade-up');
    meta.style.opacity = '1';
    meta.querySelectorAll('.case-meta__item').forEach((el, i) => {
      el.classList.add('case-stagger');
      el.style.setProperty('--sd', (i * 0.1) + 's');
    });
  });

  // Observe all stagger elements
  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      staggerObs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.case-stagger').forEach(el => staggerObs.observe(el));

  // 4. Scale-on-scroll: elements grow as they approach viewport center
  const scaleEls = Array.from(document.querySelectorAll('.case-full-image'));
  scaleEls.forEach(el => {
    el.style.willChange = 'transform, opacity';
    el.style.transformOrigin = 'center center';
  });

  function runScaleScroll() {
    const vh = window.innerHeight;
    scaleEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distFromCenter = Math.abs(center - vh / 2);
      const maxDist = vh / 2 + rect.height / 2;
      const progress = 1 - Math.min(distFromCenter / maxDist, 1); // 0 → 1 as element centers
      const scale   = 0.90 + progress * 0.10; // 0.90 → 1.0
      const opacity = 0.4  + progress * 0.60; // 0.4 → 1.0
      el.style.transform = `scale(${scale})`;
      el.style.opacity   = opacity;
    });
  }

  window.addEventListener('scroll', runScaleScroll, { passive: true });
  runScaleScroll();
}());
