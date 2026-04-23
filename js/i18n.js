(function () {
  const STORAGE_KEY = 'bl-lang';
  const DEFAULT_LANG = 'it';
  const I18N_BASE = '/i18n/';

  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  async function loadLang(lang) {
    try {
      const res = await fetch(I18N_BASE + lang + '.json');
      if (!res.ok) throw new Error('Lang file not found: ' + lang);
      const strings = await res.json();
      applyStrings(strings);
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
      updateToggle();
    } catch (e) {
      console.warn('[i18n]', e.message);
    }
  }

  function applyStrings(strings) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (strings[key] !== undefined) el.innerHTML = strings[key];
    });
  }

  function updateToggle() {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = currentLang === 'it' ? 'EN' : 'IT';
  }

  function toggle() {
    loadLang(currentLang === 'it' ? 'en' : 'it');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.addEventListener('click', toggle);
    loadLang(currentLang);
  });
})();
