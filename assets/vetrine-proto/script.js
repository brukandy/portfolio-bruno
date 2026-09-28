// =============================================================
// UPGRADE VETRINE YOURETAIL — comportamenti del prototipo
// 1. contatore delle offerte al posto dei dot
// 2. popup <dialog>: sheet a tutta altezza su mobile
// 3. wizard a 3 passi dentro "Prenota un appuntamento"
// 4. chip giorno/orario a selezione singola
// =============================================================

'use strict';

const STEP_NAMES = Object.freeze(['Tipologia', 'Data e Ora', 'Finalizza']);

// --- Contatore offerte: sostituisce i dot ------------------------------
const trackOffers = () => {
  const scroller = document.getElementById('offers');
  const currentEl = document.getElementById('offer-current');
  const totalEl = document.getElementById('offer-total');
  if (!scroller || !currentEl || !totalEl) return;

  const cards = Array.from(scroller.children);
  if (cards.length === 0) return;
  totalEl.textContent = String(cards.length);

  const observer = new IntersectionObserver((entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry) => {
        const index = cards.indexOf(entry.target);
        if (index >= 0) currentEl.textContent = String(index + 1);
      });
  }, { root: scroller, threshold: 0.6 });

  cards.forEach((card) => observer.observe(card));
};

// --- Apertura e chiusura dei popup -------------------------------------
const trackDialogs = () => {
  document.querySelectorAll('[data-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const dialog = document.getElementById(trigger.getAttribute('data-open'));
      if (!dialog) return;
      dialog.showModal();
      document.body.style.overflow = 'hidden';   // niente scroll sotto lo sheet
    });
  });

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => dialog.close());
    });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  });
};

// --- Wizard a 3 passi ---------------------------------------------------
const trackWizard = () => {
  const form = document.getElementById('form-prenota');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.step'));
  const prevBtn = form.querySelector('[data-prev]');
  const nextBtn = form.querySelector('[data-next]');
  const submitBtn = form.querySelector('[data-submit]');
  const nowEl = form.querySelector('[data-step-now]');
  const nameEl = form.querySelector('[data-step-name]');
  const fillEl = form.querySelector('[data-step-fill]');
  const body = form.querySelector('.sheet__body');
  if (steps.length === 0) return;

  let current = 1;

  const render = () => {
    steps.forEach((step) => {
      step.hidden = Number(step.getAttribute('data-step')) !== current;
    });

    const isLast = current === steps.length;
    prevBtn.disabled = current === 1;
    nextBtn.hidden = isLast;
    submitBtn.hidden = !isLast;

    nowEl.textContent = String(current);
    nameEl.textContent = STEP_NAMES[current - 1] || '';
    fillEl.style.width = `${(current / steps.length) * 100}%`;

    if (body) body.scrollTop = 0;
  };

  const goTo = (step) => {
    current = Math.min(Math.max(step, 1), steps.length);
    render();
  };

  nextBtn.addEventListener('click', () => goTo(current + 1));
  prevBtn.addEventListener('click', () => goTo(current - 1));

  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
    }
  });

  render();
};

// --- Chip giorno/orario: una sola opzione attiva per gruppo -------------
const trackChips = () => {
  document.querySelectorAll('.chips').forEach((group) => {
    const chips = Array.from(group.querySelectorAll('.chip'));
    group.addEventListener('click', (event) => {
      const clicked = event.target.closest('.chip');
      if (!clicked || !chips.includes(clicked)) return;
      chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip === clicked)));
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  trackOffers();
  trackDialogs();
  trackWizard();
  trackChips();
});
