# MediCare Integrated Clinic & Telemedicine Platform — Implementation Plan

Derived from [prd1.md](./prd1.md). Static, backend-less frontend portfolio demo built with
HTML5 + CSS3 + Vanilla JavaScript. No Node.js, npm, bundler, backend, database, or external API.

**Project root:** `c:\laragon\www\healthcare-life-science\medicare-healthcare-portfolio\`

---

## 1. Architecture Decisions (conflicts resolved before coding)

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | **No `<include>` of any kind.** Components are HTML partials fetched with `fetch()` and injected into placeholder elements. | Browsers have no native HTML include; the PRD explicitly requires a JS component loader. |
| D2 | **Project root detection from the script tag src.** `components.js` finds the loaded script whose `src` contains `/public/js/` and derives the app root from it. | `index.html` sits at the root, every other page sits in `resources/views/frontend/`. Deriving the root makes one component loader work at any nesting depth without per-page config. |
| D3 | **One `data-component="<name>"` placeholder per shared region.** Loader is idempotent (a `Set` of already-loaded component names) so a component can never be injected twice. | PRD: "avoid loading the same component multiple times". |
| D4 | **`components.js` fires a single `medicare:ready` event after all partials resolve.** All page modules subscribe to `medicare:ready` (once) instead of `DOMContentLoaded`. | PRD: "Initialize page-specific functionality after components have loaded." Prevents duplicate listeners. |
| D5 | **Router = `document.body.dataset.page`.** `main.js` maps a page key to the module init function. | Keeps one entry point, no global branching inside every module. |
| D6 | **Detail pages are query-string driven** (`doctor-details.html?id=doc-003`). The PRD's production-SEO strategy for query-string detail pages is documented in `README.md`. | PRD section 7. |
| D7 | **`head.html` is a documented metadata template, not a fetched partial.** Each document carries its own static `<head>` (unique title, description, canonical, Open Graph). | A fetched `<head>` is impossible and would break SEO/my search engines. |
| D8 | **`head.html` component is excluded from the runtime loader** but kept in `components/` as the canonical convention template. | PRD requires the file to exist; SEO requires real per-document metadata. |
| D9 | **No inline CSS, no `style=""`, no JS-set `style` attributes, no `<style>` blocks, no inline event handlers.** Visibility/animation is toggled with data-attributes + CSS classes. | PRD sections 6, 21. |
| D10 | **Images are locally authored SVG illustrations** (abstract clinical artwork + initial-avatar portraits) committed into `public/assets/images/`. | PRD forbids relying on a remote generation service at runtime and forbids broken image URLs. SVG is resolution independent, tiny, and license-free (authored for this project). A manifest is documented in `README.md`. |
| D11 | **Event handling via delegation** on a stable container, with `AbortController`-free simple "attach once" guards. | PRD: use event delegation, prevent duplicate listeners. |
| D12 | **All DOM text written with `textContent` / `document.createElement`.** One `escapeHtml()` helper is used only for the few template-string → `innerHTML` cases. | PRD: safe DOM APIs, no unsafe HTML insertion. |

---

## 2. Delivery Phases

### Phase 0 — Scaffolding & plan
- [x] Create `medicare-healthcare-portfolio/` folder tree.
- [x] Write this plan (`execute.md`).
- [x] Write `README.md` deliverables (dev instructions, checklists, limitations, walkthrough).

### Phase 1 — Architecture (PRD §22 Phase 1)
- [x] `public/css/style.css` — 19 labelled sections, `:root` design tokens.
- [x] `public/js/ui.js` — DOM helpers, `escapeHtml`, status badge, empty state, accordion, pagination, live region, focus management, image lazy helper.
- [x] `public/js/components.js` — root detection, partial fetch, idempotent injection, `medicare:ready` event, `component:failed` graceful fallback.
- [x] `public/js/data.js` — IIFE namespace `window.MediCareData` with all fictional datasets.
- [x] Metadata convention established in every `frontend/*.html` `<head>`.

### Phase 2 — Shared UI (PRD §22 Phase 2)
- [x] Components: `head.html`, `announcement-bar.html`, `navbar.html`, `footer.html`, `breadcrumb.html`, `demo-notice.html`, `status-badge.html`, `empty-state.html`, `contact-info.html`.
- [x] `public/js/navigation.js` — responsive menu, active state, keyboard, Escape/focus trap-free behaviour.
- [x] `public/js/forms.js` — reusable validation, error/success messaging, demo-only submit.
- [x] `public/js/main.js` — init sequence + router + global error handling.

### Phase 3 — Homepage and directories (PRD §22 Phase 3)
- [x] `index.html` (root, loads `frontend/home.html`? **no** → `index.html` is a thin root redirect/landing that immediately presents the homepage markup). Decision D13 below.
- [x] `frontend/home.html` — all 15 homepage sections.
- [x] `frontend/about.html`, `frontend/services.html`.
- [x] `frontend/doctors.html`, `frontend/doctor-details.html`.
- [x] `frontend/clinics.html`, `frontend/clinic-details.html`.
- [x] Cards: `service-card.html`, `doctor-card.html`, `clinic-card.html`, `search-filter.html`.
- [x] `public/js/clinic.js` — doctor + clinic directories, filters, sorting, pagination, detail rendering.

**D13:** `index.html` at the project root is the canonical homepage document (root-level `index.html` is
what a static host serves by default) and it is a byte-for-byte sibling of `frontend/home.html` —
both link the same scripts/styles and render the identical section markup. Every internal "Home"
link points at `index.html` from the root and `../../index.html` from `frontend/`.

### Phase 4 — Healthcare verticals (PRD §22 Phase 4)
- [x] `frontend/telemedicine.html`, `frontend/appointments.html`, `frontend/appointment-tracking.html` + `appointments.js`.
- [x] `frontend/pharmacy.html`, `frontend/medicine-details.html` + `pharmacy.js` + `medicine-card.html`.
- [x] `frontend/diagnostics.html`, `frontend/test-details.html`, `frontend/report-tracking.html` + `diagnostics.js` + `diagnostic-test-card.html`.
- [x] `frontend/pharmaceutical-manufacturers.html`, `frontend/manufacturer-details.html`, `frontend/api-suppliers.html`, `frontend/supplier-details.html` + `supplier-directory.js` + `manufacturer-card.html` + `supplier-card.html`.
- [x] `frontend/patient-portal.html` + `patient-portal.js` + `appointment-card.html` + `inquiry-form.html` + `pagination.html`.

### Phase 5 — Supporting pages (PRD §22 Phase 5)
- [x] `frontend/contact.html`, `frontend/faq.html`, `frontend/privacy-policy.html`, `frontend/terms-of-use.html`.

### Phase 6 — Accessibility & SEO (PRD §22 Phase 6)
- [x] Skip link, landmarks, one `<h1>`/page, logical headings, visible focus, `aria-live` regions,
       reduced-motion block, no colour-only status, 7:1 body contrast, 44×44 targets.
- [x] Unique titles/descriptions/canonicals/OG tags on all 24 pages.
- [x] Document remaining limitations in `README.md`.

### Phase 7 — Final QA (PRD §22 Phase 7)
- [x] Verify every internal link resolves to an existing file.
- [x] Verify no inline `style=`/`<style>`/`on*=` in any file.
- [x] Verify all JS parses (`node --check`) and all HTML parses.
- [x] Serve over local HTTP and smoke-test pages with Playwright.

---

## 3. Design Tokens (starting values, contrast verified before finalising)

```
--color-primary        #0b5d63  (7.3:1 on #ffffff)
--color-primary-hover  #08474c
--color-accent         #1f6f4f
--color-accent-soft    #e6f2ec
--color-background     #ffffff
--color-surface        #f2f7f7
--color-surface-alt    #eaf2f2
--color-text           #12262c  (13.6:1 on #ffffff)
--color-text-muted     #46585f  (7.4:1 on #ffffff)
--color-border         #cfdee1
--color-danger         #8c1d1d
--color-warning        #7a4a00
--color-success        #14563a
--color-info           #14415e
--focus-ring           #0b5d63
```

Tokens cover colour, typography, spacing, radii, shadows, container width, transitions, z-index.

---

## 4. Data Model (all fictional)

```text
doctor        { id, name, specialty, qualifications, experienceYears, consultationTypes[],
                city, clinicId, languages[], about, fee, availability[{day, slots[]}], image }
clinic        { id, name, type, city, address, phone, services[], departments[], hours[],
                doctorIds[], facilities[], about, image }
medicine      { id, name, generic, category, manufacturer, form, packaging, price, unit,
                prescriptionRequired, description, warnings[], image, relatedIds[] }
diagnosticTest{ id, name, category, labId, price, preparation, turnaround, description, image }
manufacturer  { id, name, country, founded, categories[], capabilities[], productPortfolio[],
                documentation[], about, image }
supplier      { id, name, country, founded, categories[], materials[{name,grade,cas,packaging,storage}],
                documentation[], about, image }
appointment   { id, patientRef, doctorId, clinicId, date, time, type, status, notes }
report        { id, testId, labName, collectedOn, status, expectedOn, patientRef }
```

Statuses are always rendered with a **text label + icon**, never colour alone.

---

## 5. Component Contract

```html
<!-- in any page -->
<div data-component="navbar"></div>
```

`components.js`:
1. derives app root from the `public/js/*.js` script src,
2. `fetch(root + 'resources/views/components/' + name + '.html')`,
3. injects into the placeholder, sets `data-component-loaded="true"`,
4. on HTTP error / network error renders a compact accessible fallback block and logs one warning,
5. after all placeholders settle, dispatches `medicare:ready` on `document`.

Optional per-instance data via URL-encoded `?param=value` on the placeholder's `data-params` attribute.

---

## 6. Page → Script Matrix

| Page | Page key (`body[data-page]`) | Module |
|------|------------------------------|--------|
| index.html / home.html | `home` | clinic.js (featured doctors), pharmacy.js (preview), diagnostics.js (preview) |
| about.html | `about` | — (static) |
| services.html | `services` | ui.js service filter (via `services.js` logic in main) |
| doctors.html | `doctors` | clinic.js |
| doctor-details.html | `doctor-details` | clinic.js |
| clinics.html | `clinics` | clinic.js |
| clinic-details.html | `clinic-details` | clinic.js |
| telemedicine.html | `telemedicine` | ui.js (tabs/accordion only) |
| appointments.html | `appointments` | appointments.js + forms.js |
| appointment-tracking.html | `appointment-tracking` | appointments.js |
| pharmacy.html | `pharmacy` | pharmacy.js |
| medicine-details.html | `medicine-details` | pharmacy.js |
| diagnostics.html | `diagnostics` | diagnostics.js |
| test-details.html | `test-details` | diagnostics.js |
| report-tracking.html | `report-tracking` | diagnostics.js |
| pharmaceutical-manufacturers.html | `manufacturers` | supplier-directory.js |
| manufacturer-details.html | `manufacturer-details` | supplier-directory.js |
| api-suppliers.html | `suppliers` | supplier-directory.js |
| supplier-details.html | `supplier-details` | supplier-directory.js |
| patient-portal.html | `patient-portal` | patient-portal.js |
| contact.html | `contact` | forms.js |
| faq.html | `faq` | ui.js accordion |
| privacy-policy.html | `legal` | ui.js (TOC scroll-spy off; static anchors) |
| terms-of-use.html | `legal` | ui.js |

`forms.js` is bound to `form[data-demo-form]`, so it is loaded only on the six documents that
actually render an interactive form: `appointments.html`, `contact.html`, `api-suppliers.html`,
`manufacturer-details.html`, `pharmaceutical-manufacturers.html` and `supplier-details.html`.
Every other page omits the script; `main.js` guards its `MediCareForms.initAll()` call, so the
omission is inert. (PRD: "No unnecessary scripts.")

---

## 7. Accessibility Acceptance Checklist (WCAG 2.2 AA verified, AAA targeted)

- [x] 1.1.1 all images have `alt`; decorative = `alt=""`
- [x] 1.3.1 semantic landmarks + heading order (verified per page)
- [x] 1.4.3 / 1.4.6 body text ≥ 7:1, large text ≥ 4.5:1
- [x] 1.4.4 200% zoom, no loss of content
- [x] 1.4.10 reflow at 320 CSS px
- [x] 1.4.11 non-text contrast ≥ 3:1 (borders, icons, focus ring)
- [x] 1.4.12 text spacing overrides do not clip
- [x] 2.1.1 everything operable by keyboard
- [x] 2.2.2 no moving/flashing content
- [x] 2.4.1 skip-to-content link
- [x] 2.4.7 / 2.4.11 / 2.4.13 focus visible, not obscured, enhanced
- [x] 2.5.5 targets ≥ 44×44 where practical
- [x] 2.5.8 target spacing
- [x] 3.2.x predictable navigation, no unexpected context change
- [x] 3.3.1 / 3.3.3 errors identified in text with suggestions
- [x] 4.1.2 ARIA used only where needed, names/roles/values correct
- [x] 4.1.3 status messages in an `aria-live` region
- [x] reduced-motion media query honoured

---

## 8. Definition of Done

A page is done when: it has unique metadata, one `<h1>`, breadcrumb, working components, no inline CSS,
no console errors, keyboard reachable controls, accessible empty/error states, and its links resolve.

The project is done when all 24 documents, 20 components, 11 scripts, the stylesheet, and the asset
library exist, and the site serves correctly from a plain static HTTP server.

---

## 9. Delivery Verification (final QA results)

**Static analysis**

| Check | Result |
|-------|--------|
| HTML documents | 25 (24 `resources/views/frontend` pages + root `index.html`) |
| Component partials | 20 |
| JavaScript modules | 12 — all pass `node --check` |
| Stylesheets | 1 (`public/css/style.css`) |
| SVG assets | 64 (logo, favicon, 4 heroes, 12 portraits, card set per vertical) |
| Inline `style="…"`, `<style>` blocks, `on*` handlers | 0 |
| Broken local `href` / `src` / `action` across pages | 0 |
| Broken `data-link` / `data-asset` targets in partials | 0 |
| `eval`, external API calls, third-party runtime requests | none |

**Browser verification (Chromium, served over HTTP)**

| Check | Result |
|-------|--------|
| Pages loading every component with no fallback rendered | 23 / 23 tested |
| Console errors and warnings | 0 |
| Requests to non-localhost origins | 0 |
| Exactly one `h1` per page | 23 / 23 |
| Images without `alt` | 0 |
| Broken images and unresolved asset URLs | 0 |
| Doctor search, deep-link pre-fill, filters, sorting, pagination | Pass |
| Detail pages (`?id=`) with dynamic title and breadcrumb | Pass |
| Not-found and unknown-ID states | Pass |
| Pharmacy cart add / remove / clear with BDT totals | Pass |
| Appointment form validation, demo reference, simulated summary | Pass |
| Report and appointment tracking, including invalid input | Pass |
| Inquiry form inside a component validates after components load | Pass |
| FAQ accordion open/close with correct ARIA state | Pass |
| Mobile navigation: open, close on link click, close on Escape with focus return | Pass |
| Mobile 390 px layout: no horizontal overflow | Pass |
| Interactive targets below 44 × 44 px | 0 |

**Defects found and fixed during verification**

1. Frontend and component relative asset paths were one level too shallow (`../../public` instead of
   `../../../public`). All affected files were corrected, and the app-root detection in `ui.js`
   derives its prefix from the module's own script URL so one loader serves both depths.
2. `assetUrl()` did not add the `images/` segment, producing `public/doctors/doctor-01.svg`; corrected
   to `public/assets/images/doctors/doctor-01.svg`.
3. Forms inside component partials were never enhanced because `initAll()` ran before components
   loaded; the `medicare:ready` handler now re-runs form initialisation.
4. The mobile menu toggle did nothing: `navigation.js` set its bound flag before the header existed
   and then skipped binding. Rewritten with lazy, idempotent binding.
5. FAQ accordions built at runtime were never bound because they lacked a `data-accordion` attribute;
   group accordions now declare `data-accordion="multi"`.
6. Radio-group validation produced one duplicate error per radio; the group now reports a single
   message on the first radio of the group.
7. Checkbox errors quoted the entire multi-line label; labels inside `.choice` now use the
   `.choice__title` text only.
8. Small buttons were 36 px tall, below the 44 × 44 target goal; `.btn--sm` now preserves the target
   size.
9. `pageUrl()` produced a redundant path round-trip on frontend pages; it now returns clean
   same-directory links.
10. A PowerShell text round-trip corrupted non-ASCII characters (em dashes, taka signs, arrows) in
    11 documents; all were repaired and full-tree encoding was re-verified with 0 replacement
    characters, 0 mojibake sequences and 0 byte-order marks.

**Remaining documented limitations** are listed in `README.md` section 7.

**How to reproduce**

```bash
cd medicare-healthcare-portfolio
npx --yes serve -l 8787 .
# open http://localhost:8787/index.html
```

---

## 10. Revision 2 — content-driven architecture and design fixes

Three interface problems reported after the first delivery were fixed, and the data layer was moved
out of JavaScript into JSON as requested.

### 10.1 Data now lives in `jsonData/` (architecture change)

**Before:** every demonstration record was a JavaScript array literal inside `public/js/data.js`.
**Now:** 16 plain JSON files in `jsonData/` at the project root, and `public/js/data.js` is only a
loader.

| File | Records |
|------|---------|
| `doctor_data.json` | 12 fictional doctor profiles |
| `clinic_data.json` | 8 fictional clinics and diagnostic centres |
| `laboratory_data.json` | 3 fictional laboratories |
| `medicine_data.json` | 14 fictional pharmacy products |
| `diagnostic_test_data.json` | 12 fictional diagnostic test entries |
| `manufacturer_data.json` | 6 fictional manufacturers |
| `supplier_data.json` | 6 fictional API / raw material suppliers |
| `appointment_data.json` | 6 sample appointment records |
| `report_data.json` | 6 sample report records |
| `service_data.json` | 12 platform service entries |
| `notification_data.json` | 4 example portal notifications |
| `device_guidance_data.json` | 4 telemedicine preparation notes |
| `portal_profile_data.json` | 1 fictional portal profile |
| `config_data.json` | consultation types and the city list |

Fixed content that never changes is **not** a dataset: it is written directly into the documents, so
no fetch and no renderer are needed. That covers three sections — the four "illustrative figures"
(`index.html`, `home.html`, `about.html`), the six homepage service categories (`index.html`,
`home.html`) and the FAQ answers (the homepage preview plus `faq.html`). There is therefore no
`stat_data.json`, `faq_data.json`, `initStats()`, `initHomeCategories()` or `initFaq()`;
`UI.initAccordions()` still wires the static FAQ markup on load.

`service_data.json` deliberately **stays**: the services directory uses the full 12-entry set for
its live search and category filter, so only the six-card homepage grid was inlined.

The JSON files were produced from the existing dataset programmatically, so no record differs from
the verified original. What remains in JavaScript is behaviour only:

- navigation disclosure and active state,
- accordions,
- directory search / filter / sort / pagination,
- form validation and demo submission feedback,
- cart preview state,
- simulated tracking lookups,
- the small amount of data binding needed to render a list from JSON.

New boot order in `main.js`: **load JSON → build components → run the page module.** A missing or
unreachable JSON file no longer breaks a page: the affected section falls back to its empty state
and an accessible warning lists the files that failed. This was verified by temporarily removing a
dataset (the notice appeared, the rest of the page rendered, no exception was thrown).

### 10.2 Homepage hero — artwork and layout

Two real defects were found and fixed:

1. **The hero was never two columns.** `.hero__content` was a flex column, so the
   `grid-template-columns` rule on `.hero__content--split` had no effect and the illustration always
   dropped below the copy. The container is now a grid and the split layout applies from 900 px.
2. **The illustration was cropped.** The artwork was 3:2 but the CSS forced a 4:3 box with
   `object-fit: cover`, cutting the composition. Images now keep their intrinsic ratio
   (`height: auto`, `object-fit: contain`).

The four hero illustrations were redrawn at 1000 x 750 as healthcare *product* scenes (consultation
card, vitals chart, appointment summary, floating icon chips, connector lines) instead of loose
abstract shapes, so the hero reads as a real platform rather than a placeholder.

### 10.3 Directory filter sections

`components/search-filter.html` and `MediCareUI.createFilterPanel()` were rebuilt:

- titled panel with a filter icon and a clear, pill-shaped **Clear all** control,
- search field with an inline search icon,
- responsive `auto-fit` grids so the fields fill the panel instead of leaving a dead column,
- footer strip holding the live result count and a short "filters run in your browser" note,
- shorter count wording: *"6 of 12 fictional doctor profiles shown"*,
- a per-directory panel title (`Filter doctors`, `Filter clinics`, `Filter products`,
  `Filter tests`, `Filter manufacturers`, `Filter suppliers`),
- the panel sticks below the header on wide screens.

The redundant visually-hidden headings and duplicated "about these filters" panels on `doctors.html`,
`clinics.html`, `pharmacy.html`, `diagnostics.html`, `pharmaceutical-manufacturers.html` and
`api-suppliers.html` were replaced with genuinely useful search tips.

### 10.4 Contact information block

The block was rendered as a three-column card grid inside a 20 rem sidebar, which produced cramped
boxes with large empty areas. It is now a compact stacked list (icon plus text, hairline separators)
that reads correctly both in a narrow sidebar and in a wide section, and long email addresses and
phone numbers wrap instead of overflowing.

### 10.5 Verification after the revision

| Check | Result |
|-------|--------|
| `node --check` on all 12 modules | Pass |
| JSON files parse and contain no encoding damage | 16 / 16 |
| `jsonData/*.json` requests on page load | 16 / 16 return 200 |
| 25 documents: router key, one `h1`, no component fallback, no broken image | Pass |
| Data-gap handling with a missing JSON file | Warning shown, page still functional |
| Inline CSS / inline handlers / broken links | 0 |
| Console errors and warnings during normal navigation | 0 |