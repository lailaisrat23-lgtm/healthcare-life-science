# MediCare — Integrated Clinic & Telemedicine Platform

A complete, responsive, multi-page **static** demonstration site for a fictional integrated
healthcare ecosystem: clinic and specialist directories, telemedicine, appointment requests and
tracking, an e-pharmacy catalogue, a diagnostics and pathology directory, pharmaceutical
manufacturer and API raw-material directories, and a patient-portal preview.

Built with HTML5, one CSS file, vanilla JavaScript modules (no ES-module bundler) and static JSON —
no backend, no database, no build step, no framework, no third-party runtime dependency.

> **All content is fictional demonstration material.** Every doctor, clinic, laboratory, medicine,
> manufacturer, supplier, appointment, report, price and statistic is sample data. This is not a live
> healthcare service, provides no medical advice, and performs no booking, prescription, payment or
> record-keeping function.

> **Photography** is licensed stock material from [Pexels](https://www.pexels.com/license/), stored
> locally and attributed with its source on the
> [image credits page](medicare-healthcare-portfolio/resources/views/frontend/credits.html). The
> logo, favicon and interface icons are original vector artwork.

The application itself lives in [`medicare-healthcare-portfolio/`](medicare-healthcare-portfolio/).
That folder also contains a QA-oriented README (page-by-page checklist, SEO checklist, accessibility
evidence); this document is the project-level overview.

---

## 1. Running the project locally

Plain HTML cannot `fetch()` components or JSON from the `file://` protocol, so the site must be
served over HTTP. Any static file server works.

```bash
# From the application folder (the one containing index.html)
cd medicare-healthcare-portfolio

# Option A — PHP (static file serving only, no PHP is used by the site)
php -S 127.0.0.1:8787

# Option B — Python 3
python -m http.server 8787

# Option C — Node.js
npx --yes serve -l 8787 .

# Option D — any static server, or the VS Code "Live Server" extension
```

Then open <http://127.0.0.1:8787/index.html>. With a Laragon/XAMPP document root, the equivalent URL
is `http://localhost/healthcare-life-science/medicare-healthcare-portfolio/index.html`.

The entry point is `index.html` at the application root. Do **not** open the HTML files directly from
disk: the header, footer, breadcrumbs, card grids and all directory data are loaded asynchronously,
and a visible fallback notice replaces them when the page is not served over HTTP.

**Live Server caveat.** The extension injects its reload script into every response, including
component partials. Partials that embed inline SVG therefore end with an explicit `</body>` anchor so
the injected script lands at the end of the file instead of truncating the markup. Keep that trailing
line when editing a partial.

---

## 2. Project structure

```text
healthcare-life-science/                    # repository root
├── README.md                              # this file
├── prd1.md                                # source specification
├── execute.md                             # implementation plan, design tokens, QA log
├── settings.json
└── medicare-healthcare-portfolio/         # the application
    ├── index.html                         # canonical entry point
    ├── README.md                          # page/SEO/accessibility checklists
    │
    ├── jsonData/                          # 14 demonstration datasets (plain JSON)
    │
    ├── public/
    │   ├── css/
    │   │   └── style.css                  # the only stylesheet (19 labelled sections)
    │   ├── js/                            # 12 vanilla JavaScript modules
    │   │   ├── ui.js                      # shared toolkit: DOM, formatting, components, a11y helpers
    │   │   ├── data.js                    # JSON loader + lookup helpers
    │   │   ├── components.js              # fragment loader, token fill, template rendering
    │   │   ├── navigation.js              # mobile drawer and submenu behaviour
    │   │   ├── main.js                    # boot sequence + page-key routing
    │   │   ├── clinic.js                  # doctor and clinic directories, details, featured cards
    │   │   ├── pharmacy.js                # catalogue, product detail, cart preview
    │   │   ├── diagnostics.js             # test directory, test detail, report tracking
    │   │   ├── appointments.js            # request form and appointment tracking
    │   │   ├── supplier-directory.js      # manufacturers and API/raw-material suppliers
    │   │   ├── patient-portal.js          # portal dashboard rendering
    │   │   └── forms.js                   # shared client-side validation
    │   └── assets/
    │       ├── icons/favicon.svg
    │       └── images/
    │           ├── logo.svg
    │           ├── hero/                  # 4 photographs, 1000 × 750
    │           ├── doctors/               # 12 portraits, 480 × 480
    │           ├── clinics/               # 8 photographs, 800 × 450
    │           ├── diagnostics/           # 12 photographs, 800 × 450
    │           ├── pharmacy/              # 14 photographs, 800 × 450
    │           ├── pharmaceutical/         # 6 photographs, 800 × 450
    │           └── suppliers/             # 6 photographs, 800 × 450
    │
    └── resources/views/
        ├── frontend/                      # 25 pages (detail pages take ?id= / ?slug=)
        └── components/                    # 20 reusable HTML fragments
```

### Where the data lives

All demonstration content is plain JSON in `jsonData/`, not JavaScript. Documents stay HTML/CSS and
the scripts carry behaviour only (menu, filtering, sorting, pagination, validation, cart preview,
tracking) plus the small amount of data binding a static page needs.

```text
jsonData/
├── doctor_data.json            # 12 fictional doctor profiles
├── clinic_data.json            # 8 fictional clinics and diagnostic centres
├── laboratory_data.json        # 3 fictional laboratories
├── medicine_data.json          # 14 fictional pharmacy products
├── diagnostic_test_data.json   # 12 fictional test entries
├── manufacturer_data.json      # 6 fictional manufacturers
├── supplier_data.json          # 6 fictional API / raw-material suppliers
├── appointment_data.json       # 6 sample appointment records
├── report_data.json            # 6 sample report records
├── service_data.json           # 12 platform service entries
├── notification_data.json      # 4 example portal notifications
├── device_guidance_data.json   # 4 telemedicine preparation notes
├── portal_profile_data.json    # 1 fictional portal profile
└── config_data.json            # consultation types and city list
```

`public/js/data.js` is only a **loader**: it fetches these files once at start-up, exposes them as
`window.MediCareData`, and adds lookup helpers (`doctorById`, `testById`, `uniqueValues`, …). To
change content, edit the JSON — no JavaScript changes are needed.

Content that never changes and needs no filtering is written directly into the documents instead of
being fetched: the illustrative figures, the homepage service categories and the FAQ answers. Those
sections have no dataset and no renderer.

### Path resolution

Pages sit three levels below the application root (`resources/views/frontend/`), while `index.html`
sits at the root. `ui.js` derives a single base prefix from its own `<script src>` value and resolves
every asset, component and internal link from it, so the same loader works at any depth without a
per-page `data-base` attribute.

```html
<!-- rewritten to the correct depth by the loader -->
<a data-link="doctors.html">Find a doctor</a>
<a data-link="@home">Home</a>
<img data-asset="images/logo.svg" src="" alt="" />
```

`@home` always resolves to the root `index.html`; `data-asset` values are resolved inside
`public/assets/`.

### Component contract

```html
<div data-component="navbar"></div>
<div data-component="breadcrumb" data-trail="Home|@home;Doctors"></div>
<div data-component="demo-notice" data-fill-message="Custom notice text"></div>
```

- `data-fill-<field>` on the mount fills `[data-field="<field>"]` inside the partial, so one
  fragment serves every page.
- Card grids use `<template data-template="doctor-card">` style fragments plus
  `data-attr-src` / `data-attr-alt` bindings on the elements the renderer populates.
- If a fragment cannot be fetched, the mount receives a visible, readable fallback — never an empty
  region.

---

## 3. Pages

`resources/views/frontend/` holds 25 pages; `index.html` at the application root is the canonical
home page (`resources/views/frontend/home.html` mirrors the same markup with folder-relative paths so
it also resolves from inside the views folder).

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Hero, trust indicators, six service categories, deep-linking doctor search, featured doctors and clinics, telemedicine workflow, pharmacy and diagnostics previews, four-step process, FAQ accordion, closing CTA |
| About | `about.html` | Platform overview, mission/vision/values, ecosystem table, service approach, illustrative figures, fictional roles |
| Services | `services.html` | Service hub with live search and category filter, result count, empty state |
| Find a doctor | `doctors.html` | Doctor directory: keyword search, specialty / consultation / city filters, four sort orders, pagination, deep-link prefill |
| Doctor profile | `doctor-details.html?id=` | Generated fact list, sample availability, clinic association, related profiles, not-found state |
| Clinics | `clinics.html` | Clinic directory with search, type / city / service filters, sorting, pagination |
| Clinic profile | `clinic-details.html?id=` | Overview, services, departments, facilities, illustrative hours, associated specialists |
| Telemedicine | `telemedicine.html` | Consultation workflow, device and connectivity guidance, privacy and safety panels, sample profiles |
| Appointment request | `appointments.html` | Doctor / clinic / test selects from data, date minimum, sample slots, full validation, simulated reference — nothing is transmitted |
| Appointment tracking | `appointment-tracking.html` | Sample-ID lookup, simulated status timeline, unknown-ID state, `?id=` support |
| Pharmacy | `pharmacy.html` | Catalogue with search, category / manufacturer / prescription filters, sorting, pagination, cart preview with BDT totals |
| Medicine details | `medicine-details.html?id=` | Product record, specification table, prescription status, warnings, related products |
| Diagnostics | `diagnostics.html` | Test directory with search, category / laboratory / preparation filters, sorting, illustrative pricing |
| Test details | `test-details.html?id=` | What the test measures, preparation notes, turnaround, laboratory association, related tests |
| Report tracking | `report-tracking.html` | Sample-report lookup, simulated five-stage timeline, unrecognised-ID and empty-input handling |
| Manufacturers | `pharmaceutical-manufacturers.html` | Manufacturer directory with search, category and capability filters, inquiry form |
| Manufacturer profile | `manufacturer-details.html?id=` | Company overview, capabilities, portfolio, documentation categories, compliance statement |
| API & raw materials | `api-suppliers.html` | Supplier directory searchable by material, with category and documentation filters |
| Supplier profile | `supplier-details.html?id=` | Supplier overview, per-material specification tables, storage notes, documentation indicators |
| Patient portal | `patient-portal.html` | Demo banner, fictional profile, metrics, appointment cards, report statuses, shortcuts, notifications |
| Contact | `contact.html` | Contact information component and validated demonstration inquiry form |
| FAQ | `faq.html` | Seven categories from the shared dataset with accessible accordions and a limitations sidebar |
| Privacy policy | `privacy-policy.html` | Sample policy in eleven sections, marked as requiring legal review |
| Terms of use | `terms-of-use.html` | Sample terms in ten sections, marked as requiring legal review |
| Image credits | `credits.html` | Photographer, licence and source page for all 62 photographs |

---

## 4. Architecture

### Component loading

`resources/views/components/*.html` holds two kinds of fragment:

1. **Token fragments** loaded into `[data-component]` mounts. `data-fill-*` attributes on the mount
   substitute `{{token}}`-style fields inside the partial, so one navbar, footer, breadcrumb, demo
   notice, card skeleton or form serves every page.
2. **`<template data-template="…">` fragments** for repeated records. The renderer clones a template
   per JSON record and fills it through `data-field` / `data-attr-*` bindings.

### Data safety

JSON values reach the DOM through `textContent` and attribute APIs only — no dataset string is ever
passed to `innerHTML`, so content cannot execute as markup. Image `alt` text is taken from the paired
`*Alt` key, and a missing dataset produces an accessible warning that lists the files that failed to
load, plus the affected section's empty state.

### JavaScript load order

`ui.js` → `data.js` → `components.js` → `navigation.js` → page module → `main.js`, all with `defer`.
`main.js` waits for the datasets *and* the components before it runs the page module:

```js
boot() {
  initShared();                      // footer year, accordions, navigation, form wiring
  DATA.load().then(startView);       // fetch the 14 JSON files
}

startView() {
  reportDataGaps();                  // visible warning if a dataset failed
  MediCareComponents.init();         // inject fragments, then dispatch "medicare:ready"
}

// "medicare:ready" listener → re-wire shared behaviour → initPage() for the current data-page key
```

Page modules are resolved from `<body data-page="…">` through a single key → initialiser map, and each
initialiser is guarded so a missing module cannot break the boot of the rest of the page.

### Why there are no build tools

The specification asks for a deliverable that opens on any static host without a toolchain. Splitting
markup into fragments and data into JSON keeps 25 pages maintainable without a templating engine,
while `ui.js` provides the small amount of abstraction the renderers need (element creation,
formatting, debounced search, live-region announcements).

---

## 5. Implemented features

- 25 pages with meaningful content and working navigation (header, footer, breadcrumbs, CTAs).
- 20 reusable component fragments; no page-local duplication of navbar, footer, breadcrumb, demo
  notice, cards or forms.
- 14 JSON datasets driving every directory, detail page and the patient portal.
- Six filterable, sortable, paginated directories (doctors, clinics, pharmacy, diagnostics,
  manufacturers, suppliers) with live result counts, empty states and reset actions.
- Deep-link prefill: `doctors.html?q=cardio&city=Dhaka`, `appointments.html?doctor=doc-001`,
  `test-details.html?id=test-007`, and equivalent `?id=` / `?slug=` forms for every detail template.
- Cart preview on the pharmacy pages with add, remove, clear and BDT totals — client-side only.
- Client-side form validation with field-level messages, `aria-invalid`, `aria-describedby` wiring, an
  announced summary, first-error focus and an explicit "nothing is sent" disclosure.
- Simulated status timelines for appointment and report tracking, with unknown-ID and empty-input
  handling.
- Accessible accordions, mobile navigation drawer with `aria-expanded` state, Escape handling and
  focus return, plus `prefers-reduced-motion`, `prefers-contrast` and forced-colours support.
- Every page carries a unique title, meta description, canonical placeholder, Open Graph tags, a
  single `h1`, semantic landmarks, a skip link and a `<noscript>` notice.
- 62 local photographs with descriptive alt text and a dedicated credits page — no external image,
  font or script request at runtime.

---

## 6. Image assets and licensing

| Asset type | Format | Source |
| --- | --- | --- |
| 62 photographs (4 hero, 12 portraits, 8 clinics, 12 tests, 14 products, 6 facilities, 6 materials) | JPEG — 1000 × 750 (hero), 480 × 480 (portraits), 800 × 450 (cards) | Pexels, [Pexels License](https://www.pexels.com/license/) |
| Logo, favicon | SVG | Original artwork |
| Interface icons | Inline SVG, 24 × 24 | Original artwork |

Every photograph is listed with its photographer and source page on
[credits.html](medicare-healthcare-portfolio/resources/views/frontend/credits.html), which is linked
from the footer of every page. The Pexels License permits free commercial use without attribution;
the credits page is provided as good practice and to keep every file traceable.

Images are resized and cropped to the exact ratio each layout uses, stored locally, served from the
project, and declared with `width`/`height` to avoid layout shift. Card images are lazy-loaded; the
home page hero is loaded eagerly.

**The photographs are generic stock material.** No person, clinic, laboratory, product or supplier in
them is connected to the fictional records in `jsonData/`, and each detail page states this in its
figure caption. Doctor portraits are stock photographs of real people used to represent fictional
profiles; for any real deployment they should be replaced with staff photography taken with written
consent.

To swap in your own photography, drop a file with the same name and aspect ratio into
`public/assets/images/<folder>/` — no code changes are required — then update the matching row on the
credits page.

---

## 7. Accessibility notes

Target: **WCAG 2.2 Level AA verified, Level AAA targeted** where the content type allows.

| Area | Implementation / verification |
| --- | --- |
| Landmarks & structure | `header`, `nav[aria-label]`, `main#main-content[tabindex="-1"]`, `section`, `article`, `aside`, `footer`, `figure`, `form`, `fieldset`/`legend`, `address`, `time`, `dl`; exactly one `h1` per page, no heading-level skips |
| Non-text content | Every `<img>` has an `alt` attribute; decorative images use `alt=""` |
| Skip link | First focusable element, visible on focus, targets `main` |
| Keyboard | Skip link, native buttons and links, accordions, drawer and pagination are keyboard operable; menu closes with `Escape` and returns focus |
| Focus visibility | Global `:focus-visible` ring, never `outline: none` without a replacement |
| Text contrast | Body text `#12262c` on white ≈ 13.6:1; muted `#46585f` ≈ 7.4:1; primary `#0b5d63` ≈ 7.3:1 |
| Non-text contrast | Meaningful borders and icons use `#a9bfc3` and darker; `#cfdee1` is used for decoration only |
| Reflow / zoom | All typography and spacing in `rem`; no fixed-height text containers; no horizontal overflow at 320–1440 px |
| Forms | Visible labels, required indicators, errors as text plus `aria-invalid`, announced status region, focus moved to the first invalid field |
| Tables | Real `th` with `scope`, `<caption>`, and labelled scrollable wrappers |
| Motion | `prefers-reduced-motion` disables transitions and animation; no flashing or auto-moving content |
| Status messages | Search counts, cart changes, tracking results and submissions announce through live regions |

Accessibility was verified with browser automation (scripted DOM audits and keyboard-driven
interaction tests in Chromium), not with manual screen-reader sessions. Colour-ratio values are
computed from the design tokens.

Not claimed: 1.4.8 visual presentation preferences, 1.4.9 images of text, 3.1.5 reading level of the
sample legal text, and the audio/sign-language alternatives that a fully textual static site does not
provide.

---

## 8. Responsive testing

Mobile-first, with three breakpoints: `37.5em` (600 px), `56.25em` (900 px) and `75em` (1200 px).

- No horizontal page overflow at 320, 375, 414, 768, 1024 or 1440 px.
- Navigation switches from the drawer to the inline desktop menu at 900 px.
- Card grids step 1 → 2 (600 px) → 3 (900 px) columns; statistics and the four-step process go to
  four columns at 900 px; the portal and editorial split sections go two-column at 900 px and 1200 px
  respectively.
- Search filter panels reflow from one column to two and three columns; filter lists stay inside the
  panel at every width.
- Tables scroll inside their own labelled container.
- Touch targets: primary buttons and navigation controls are at least 44 × 44 px.

---

## 9. Known limitations

1. **`file://` will not work.** Components and `jsonData/` are fetched, so a local HTTP server is
   required; the on-screen fallback explains this.
2. **JavaScript is required for shared navigation.** Header, footer and card grids are loaded
   fragments. A `<noscript>` notice explains this on every page; duplicating the header into 26 files
   was rejected as a maintenance hazard.
3. **No backend of any kind.** No server, database, authentication, session, payment gateway or
   e-mail delivery. Nothing is transmitted or stored; no cookies, `localStorage`, `sessionStorage` or
   `IndexedDB` are used.
4. **No real clinical capability.** No consultation, triage, prescription, result interpretation or
   appointment booking. Report and appointment statuses are fixed sample values.
5. **Detail pages are query-string driven.** `?id=` pages are not independently indexable on a static
   host without a build step that emits one crawlable page per record; the demo points each detail
   page's canonical at its listing page.
6. **Photography is generic stock material.** It illustrates the layout, not the fictional records,
   and the credits page must stay with the project if the images are reused.
7. **Legal pages are drafts** and would require jurisdiction-specific review before any real use.
8. **Automated tooling cannot prove AAA conformance**, and no screen-reader walkthrough has been
   recorded — see section 7.
9. **Data is intentionally fictional**, so no figure should be compared with a real healthcare
   statistic or price list. Prices are BDT sample values.
10. **No i18n layer.** The interface is English with Bangladesh-appropriate terminology; there is no
    Bangla translation or locale switcher.

---

## 10. Content and compliance notes

- Every page that displays metrics, prices, availability or sample records carries a visible
  demonstration-data disclosure, and the footer repeats it on every page.
- Guidance content (test preparation, telemedicine device requirements, medication warnings) is
  general education only and never presented as clinical instruction.
- No fabricated certifications, accreditations, registrations, client relationships or testimonials
  appear anywhere in the project.
- No third-party request is made at runtime: no CDN, font host, analytics, map tile or API call.
- Fictional doctor, clinic, laboratory, product and company names are invented and are not trademarks
  of any real business.
