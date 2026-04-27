# Bruno Lorenzon — Portfolio Design System

> Documento di riferimento per Claude. Contiene tutti i token, componenti, pattern e regole del portfolio di Bruno Lorenzon. Usa questo file come fonte di verità per qualsiasi lavoro di design o sviluppo sul portfolio.

---

## 1. TEMA

Il portfolio è **interamente dark**. Tutte le pagine usano il tema scuro.

`style.css` contiene token light come base tecnica del CSS, ma ogni pagina li sovrascrive tramite un blocco `<style>` inline nel `<head>`. **Non esiste tema light attivo nel sito.**

| Pagina | Background principale |
|---|---|
| `index.html` | `#0e0c18` |
| `works-dark.html` | `#0e0c18` (nav `rgba(14,12,24,0.95)`) |
| Tutti i case study `works/*-dark.html` | `#0e0c18` |

---

## 2. COLOR TOKENS

### Token base CSS (`:root` di `style.css`) — sovrascritti da ogni pagina dark

```css
--cream:      #f8f6f3   /* background principale */
--cream-2:    #ebe9e4   /* background card, separatori */
--cream-3:    #e0deda   /* bordi, separatori sottili */
--orange:     #ff5900   /* accent primario (CTA, logo) */
--navy:       #001666   /* testo titoli, hover links */
--dark-bg:    #2a3132   /* about card background, tag */
--gray:       #5f6566   /* testo body, label */
--gray-light: #ccc9c4   /* testo secondario, label uppercase */
--black:      #1a1a1a   /* testo principale */
--white:      #ffffff
```

### Override Dark (inline `<style>` nelle dark pages)

```css
--cream:      #0e0c18   /* background principale dark */
--cream-2:    #16132a   /* card background dark */
--cream-3:    #1e1a32   /* bordi dark */
--navy:       #ffffff   /* titoli diventano bianchi */
--black:      #f0ede8   /* testo principale diventa chiaro */
--gray:       #888884   /* testo secondario dark */
```

### Accent Dark (home page e case study dark)

```css
#C6F135   /* lime/verde acido — accent primario dark mode */
rgba(97,53,241, ...)  /* viola — usato nei gradienti hero/section */
```

### Colori UI specifici

```css
/* Browser mockup */
#2d2d2d   barra browser
#3a3a3a   browser bar
#ff5f57   dot rosso
#febc2e   dot giallo
#28c840   dot verde

/* Project card (light) */
#ffffff   card background
#2A3132   card title, tag background, arrow bg
#F8F6F3   tag text, arrow icon
#5F6566   card description
```

---

## 3. TIPOGRAFIA

### Font Family

```css
--font-serif: 'Libre Baskerville', Georgia, serif   /* titoli, display */
--font-sans:  'DM Sans', system-ui, sans-serif      /* body, UI */
--font-mono:  'Fragment Mono', monospace            /* codice (raro) */
```

Import Google Fonts:
```
DM Sans: 400, 500, 700 (normale + italic)
Libre Baskerville: 400, 700 (normale + italic)
Fragment Mono: 400
```

Font custom: **`gunter`** (locale) — usato per il logo nav in dark mode.

### Scale Tipografica

| Elemento | Font | Size | Style | Weight | Color |
|---|---|---|---|---|---|
| `h1` | serif | `clamp(52px, 8vw, 110px)` | italic | — | `--navy` |
| `h2` | serif | `clamp(36px, 5vw, 72px)` | italic | — | `--navy` |
| `h3` | serif | `clamp(24px, 3vw, 40px)` | italic | — | `--navy` |
| `p` | sans | `clamp(15px, 1.2vw, 18px)` | normal | 400 | `--gray` |
| `.hero__title` | serif | `clamp(60px, 5.6vw, 84px)` | italic | 700 | `--navy` |
| `.hero__subtitle` | sans | `clamp(15px, 1.3vw, 18px)` | normal | 400 | `--gray` |
| `.case-hero__title` | serif | `clamp(32px, 4.5vw, 60px)` | italic | — | `--navy` |
| `.case-section__heading` | serif | `clamp(28px, 3vw, 44px)` | italic | — | `--navy` |
| `.case-section__text` | sans | `17px` | normal | 400 | `--black` |
| `.case-list li` | sans | `17px` | normal | 400 | `--black` |
| `.case-metric__value` | serif | `32px` | italic | — | `--navy` |
| `.case-metric__label` | sans | `13px` | normal | 400 | `--gray` |
| `.project-card__title` | sans | `36px` | normal | 500 | `#2A3132` |
| `.project-card__desc` | sans | `16px` | normal | 400 | `#5F6566` |
| Eyebrow / label | sans | `11–12px` | normal | 600–700 | `--gray` / `--gray-light` |
| Nav link | sans | `15px` | normal | 400 | `--gray` |

### Regola titoli dark mode

```css
h2, h3 { font-family: 'gunter', sans-serif !important; font-style: normal !important; color: #C6F135 !important; }
```

---

## 4. SPACING & LAYOUT

### Gap scale

```css
--gap:     160px   /* sezioni principali */
--gap-md:  100px   /* sezioni medie */
--gap-sm:   60px   /* sezioni piccole */
```

### Border radius

```css
--radius:    16px
--radius-lg: 24px

/* Valori specifici per componenti */
32px   about card
20px   photo about
14px   contact link item
8px    image card
100px  CTA, filter pill, tag
```

### Container

```css
max-width: 1200px;
padding: 0 40px;
```

### Grid

```css
/* Nav */
grid-template-columns: 1fr auto 1fr;

/* Projects grid */
grid-template-columns: repeat(2, 1fr);
gap: 24px;

/* About */
grid-template-columns: 1fr 1fr;
gap: 80px;

/* Case meta */
grid-template-columns: repeat(4, 1fr);
gap: 24px;
```

---

## 5. COMPONENTI

### Navigazione `.nav`

```
position: fixed | z-index: 100 | padding: 20px 48px
grid: [nav__left: Works] [logo: Bruno Lorenzon] [nav__right: About / Contact / Lang]
background: transparent → rgba(248,246,243,0.92) on scroll (blur 16px)
```

**Dark override:**
```css
.nav { background: rgba(10,10,10,0.85); }
.nav.scrolled { background: rgba(10,10,10,0.95); }
```

**Case study dark override:**
```css
.nav, .nav.scrolled { background: rgba(14,12,24,0.95) !important; }
```

**Hamburger mobile** (≤768px): `#nav-hamburger` → attiva `.nav-mobile`

---

### Lang Toggle

```html
<button id="lang-toggle" class="nav__link lang-toggle" aria-label="Switch language">EN</button>
```
- Default: **Italiano** → bottone mostra `EN`
- Gestito da `/js/i18n.js` + `localStorage` key `bl-lang`

---

### Tag

```html
<span class="tag">UX Research</span>
<span class="tag tag--outline">Product Design</span>
```

| Variante | Background | Border | Color |
|---|---|---|---|
| `.tag` (default) | `#2A3132` | — | `#F8F6F3` |
| `.tag--outline` | transparent | `1.5px solid --navy` | `--navy` |
| `.tag` dark | `rgba(198,241,53,0.10)` | — | `#C6F135` |
| `.tag--outline` dark | `rgba(255,255,255,0.15)` | — | `#888884` |

---

### CTA Button

```html
<a href="#" class="hero__cta">Scopri i miei lavori <svg>→</svg></a>
```

```css
background: --orange (#ff5900) | color: white | padding: 16px 28px
border-radius: 100px | font-size: 16px | font-weight: 500
hover: background → --navy, translateY(-2px)
```

---

### Filter Pill

```html
<button class="filter-btn active">All</button>
```

```css
padding: 10px 20px | border-radius: 100px | border: 1.5px solid --cream-3
hover/active: background --navy, color white
```

---

### Project Card `.project-card`

Struttura:
```html
<a class="project-card card-reveal">
  <div class="project-card__image [--browser | --mac]">...</div>
  <div class="project-card__body">
    <h3 class="project-card__title">Nome</h3>
    <p class="project-card__desc">Descrizione</p>
    <div class="project-card__bottom">
      <div class="project-card__tags">
        <span class="tag">...</span>
      </div>
      <div class="project-card__arrow">→</div>
    </div>
  </div>
</a>
```

- Varianti immagine: `--browser` (mockup browser dark), `--mac` (mockup MacBook)
- L'arrow appare al hover con animazione opacity + translateY
- 3D tilt via JS mousemove

---

### Case Meta

```html
<div class="case-meta fade-up">
  <div class="case-meta__item">
    <p class="case-meta__label">Cliente</p>
    <p class="case-meta__value">Nome</p>
  </div>
</div>
```

Grid 4 colonne. Border top + bottom.

---

### Case Metrics

```html
<div class="case-metrics [case-metrics--grid] fade-up">
  <div class="case-metric">
    <span class="case-metric__value">+40%</span>
    <span class="case-metric__label">Descrizione</span>
  </div>
</div>
```

- Default: flex row con border-right tra elementi
- `--grid`: grid 3 colonne

---

### Case System Box

```html
<div class="case-system-box">
  <div class="case-system-box__row">
    <span class="case-system-box__label">Input</span>
    <span class="case-system-box__value">Testo</span>
  </div>
</div>
```

---

### Case List

```html
<ul class="case-list [case-list--bold] fade-up">
  <li>Elemento con em dash automatico</li>
</ul>
```

Pseudo `::before` aggiunge `—` automaticamente.

---

### Contact Link Item

```html
<a class="contact__link-item" href="#">
  <span class="contact__link-label">LinkedIn</span>
  <span class="contact__link-value">linkedin.com/in/...</span>
</a>
```

```css
hover: background --navy, translateX(4px)
```

---

## 6. ANIMAZIONI

| Classe | Effetto | Trigger |
|---|---|---|
| `.fade-up` | opacity 0→1 + translateY 60px→0 | `.visible` (JS IntersectionObserver) |
| `.fade-up-delay-1/2/3` | delay 0.25s / 0.5s / 0.7s | — |
| `.card-reveal` | opacity + translateY 56px + scale 0.97→1 | `.visible` |
| `.card-reveal-delay-1..6` | delay da 0.1s a 0.46s | — |
| `.case-stagger` | opacity + translateY 32px, delay via `--sd` | `.visible` |
| `.img-reveal` | opacity + translateY 40px + scale 0.98→1 | `.visible` |
| `float-breathe` | scale 1→1.05 (3s infinite) | CSS keyframe |
| `slideTrack` | translateX infinito (30s) | CSS keyframe |

**Easing principale:** `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like)
**Easing fade:** `cubic-bezier(0.22, 1, 0.36, 1)`

---

## 7. STRUTTURA FILE

```
portfolio-bruno/
├── index.html              ← Home (dark theme inline)
├── works-dark.html         ← Works listing
├── css/
│   └── style.css           ← Unico foglio stile globale
├── js/
│   ├── main.js             ← Nav scroll, hamburger, tilt, animazioni
│   └── i18n.js             ← Sistema traduzione IT/EN
├── i18n/
│   ├── it.json             ← Traduzioni italiano
│   └── en.json             ← Traduzioni inglese
├── works/
│   ├── leone-master-dark.html
│   ├── tiaa-dark.html
│   ├── colosseum-dark.html
│   ├── adecco-dark.html
│   ├── treedom-dark.html
│   ├── rentall-dark.html
│   └── zuru-dark.html
└── assets/
    └── images/
```

---

## 8. NAV STRUTTURA PER TIPO DI PAGINA

### Home (`index.html`)
```html
<nav class="nav" id="nav">
  <ul class="nav__links nav__left">
    <li><a href="works-dark.html">Works</a></li>
  </ul>
  <a href="index.html" class="nav__logo">...</a>
  <ul class="nav__links nav__right">
    <li><a href="#about" data-i18n="nav.about">About</a></li>
    <li><a href="#contact" data-i18n="nav.contact">Contact</a></li>
    <li><button id="lang-toggle">EN</button></li>
  </ul>
  <button class="nav__hamburger" id="nav-hamburger">...</button>
</nav>
```
*Nota: `class="nav"` senza `scrolled` → JS aggiunge scrolled dopo 40px*

### Works page (`works-dark.html`)
```html
<nav class="nav scrolled" id="nav">
  <ul class="nav__links nav__left">
    <li><a href="works-dark.html" style="color:var(--navy);font-weight:600;">Works</a></li>
  </ul>
  ...stessa struttura nav__right...
</nav>
```
*Nota: `class="nav scrolled"` già applicato*

### Case study pages
```html
<nav class="nav scrolled" id="nav">
  <ul class="nav__links nav__left">
    <li><a href="../works-dark.html">← Works</a></li>
  </ul>
  <a href="../index.html" class="nav__logo">...</a>
  <ul class="nav__links nav__right">
    <li><a href="../index.html#contact">Contact</a></li>
    <li><button id="lang-toggle">EN</button></li>
  </ul>
  <button class="nav__hamburger" id="nav-hamburger">...</button>
</nav>
```

---

## 9. i18n — CHIAVI DI TRADUZIONE

Sistema: `data-i18n="chiave"` sull'elemento HTML → JS sostituisce `innerHTML`.

### Prefissi per case study

| Case Study | Prefisso |
|---|---|
| Leone Master | `lm.*` |
| TIAA | `tiaa.*` |
| Colosseum | `cls.*` |
| Adecco | `adc.*` |
| Treedom | `td.*` |
| Rentall | `ral.*` |
| Zuru | `zu.*` |

### Chiavi globali

```
nav.about       nav.contact
works-page.title    works-page.sub
```

---

## 10. DARK PAGE — TEMPLATE INLINE STYLE

Ogni pagina dark ha questo blocco `<style>` in `<head>`:

```css
/* Nav */
.nav, .nav.scrolled {
  background: rgba(14,12,24,0.95) !important;
  border-bottom: 1px solid rgba(255,255,255,0.08) !important;
}
.nav__link { color: #a0a09a !important; }
.nav__link:hover { color: #fff !important; }
.nav__link[style] { color: #C6F135 !important; }
.nav__logo { font-family: 'gunter', sans-serif !important; font-style: normal !important; }
.nav__logo-top { color: #C6F135 !important; font-weight: 700 !important; }
.nav__logo-bottom { color: #C6F135 !important; opacity: 0.6; font-weight: 400 !important; }
```

---

## 11. SCRIPT INCLUSI (ordine)

```html
<link rel="stylesheet" href="../css/style.css">   <!-- o css/style.css dalla root -->

<!-- In fondo al body -->
<script src="../js/i18n.js"></script>
<script src="../js/main.js"></script>
```

---

## 12. INVENTARIO SVG

### SVG inline (nel codice HTML)

Sono 2 icone riutilizzate in tutto il sito — **copiare sempre questi path esatti**:

#### Freccia diagonale ↗ — `18×18`
Usata in: CTA hero, `.project-card__arrow`
```html
<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M4 14L14 4M14 4H7M14 4V11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

#### Freccia orizzontale → — `16×16`
Usata in: `.about__cta`
```html
<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

#### Testo curvo hero — `.hero__eyebrow`
Testo "This is Bruno" su path curvo. Solo sulla home.
```html
<svg class="hero__eyebrow" viewBox="0 0 300 82" xmlns="http://www.w3.org/2000/svg" aria-label="This is Bruno">
  <defs>
    <path id="eyebrow-curve" d="M 10,75 A 310,310 0 0,1 290,75" fill="none"/>
  </defs>
  <text><textPath href="#eyebrow-curve" startOffset="50%" text-anchor="middle">This is Bruno</textPath></text>
</svg>
```

---

### File SVG in `assets/images/`

Tutte le immagini dei case study sono SVG. Sono diagrammi/infografiche di UX.

#### Leone Master (`lm.*`)
| File | Contenuto |
|---|---|
| `leone_hero.svg` | Immagine hero del case study |
| `leone_confusion_map_finale.svg` | Mappa della confusione (desktop) |
| `leone_confusion_map_finale_mobile.svg` | Mappa della confusione (mobile) |
| `leone_framework_strategico.svg` | Framework strategico (desktop) |
| `leone_framework_strategico_mobile.svg` | Framework strategico (mobile) |
| `leone_onboarding_flow_v2.svg` | Flusso onboarding (desktop) |
| `leone_onboarding_flow_v2_mobile.svg` | Flusso onboarding (mobile) |
| `leone_personalizzazione.svg` | Sistema personalizzazione (desktop) |
| `leone_personalizzazione_mobile.svg` | Sistema personalizzazione (mobile) |
| `leone_system_map_v4.svg` | System map v4 (desktop) |
| `leone_system_map_v4_mobile.svg` | System map v4 (mobile) |

#### TIAA (`tiaa.*`)
| File | Contenuto |
|---|---|
| `tiaa_hero.svg` | Immagine hero del case study |
| `tiaa_benchmark.svg` | Analisi benchmark competitor |
| `tiaa_card_mockup.svg` | Mockup card job listing |
| `tiaa_content_model.svg` | Modello contenuto editoriale |
| `tiaa_framework.svg` | Framework UX |
| `tiaa_user_flow.svg` | User flow |

#### Adecco (`adc.*`)
| File | Contenuto |
|---|---|
| `adecco_competitor.svg` | Analisi competitor |
| `adecco_flow.svg` | Flusso utente |
| `adecco_persona.svg` | Persona UX |

#### Rentall (`ral.*`)
| File | Contenuto |
|---|---|
| `rentall_competitor.svg` | Analisi competitor |
| `rentall_journey.svg` | User journey map |
| `rentall_research.svg` | Risultati ricerca |

#### Treedom (`td.*`)
| File | Contenuto |
|---|---|
| `treedome_journey.svg` | User journey map |
| `treedome_process.svg` | Processo design |

#### Zuru (`zu.*`)
| File | Contenuto |
|---|---|
| `zuru_competitor.svg` | Analisi competitor |

#### Altro
| File | Contenuto |
|---|---|
| `favicon.svg` | Favicon del sito |

---

### Pattern `<picture>` desktop/mobile per SVG

Molti SVG Leone Master hanno versione mobile. Usare sempre `<picture>`:
```html
<picture>
  <source media="(max-width: 768px)" srcset="../assets/images/leone_system_map_v4_mobile.svg">
  <img src="../assets/images/leone_system_map_v4.svg" alt="descrizione" loading="lazy">
</picture>
```

---

## 13. BREAKPOINTS RESPONSIVE

| Breakpoint | Regole principali |
|---|---|
| `≤1024px` | `--gap: 100px`, about 1 colonna, skills 2 col |
| `≤900px` | `.value__floats` nascosti |
| `≤768px` | Nav links nascosti → hamburger, hero padding 24px, projects 1 col, case-body padding 24px |
| `hover: hover` | Freccia card, zoom immagine, mac scroll attivi solo su dispositivi con hover |
| `hover: none` | Arrow sempre visibile, touch-action: manipulation |
