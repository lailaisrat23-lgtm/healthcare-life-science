# MediCare Integrated Clinic & Telemedicine Platform

A static, backend-free portfolio demonstration of an integrated healthcare ecosystem for
Bangladesh and international audiences. Built with HTML5, CSS3 and vanilla JavaScript only —
no Node.js, npm, bundler, backend, database or external API.

> **Portfolio demonstration.** Every doctor, clinic, laboratory, product, manufacturer, supplier,
> appointment, report and statistic in this project is fictional sample data. This is not a live
> healthcare service and provides no medical advice.

---

## 1. Local development

Component partials are fetched with `fetch()`, so the project **must be served over HTTP**. Opening
the files with `file://` will show the navigation, footer and other components as inline fallback
messages — that behaviour is intentional and is not a bug.

Any static server rooted at the project folder works.

**VS Code Live Server**

1. Open the project folder in VS Code.
2. Install the *Live Server* extension.
3. Right-click `index.html` → **Open with Live Server**.

> Live Server injects its live-reload `<script>` into every HTML response. When it cannot find a
> `</body>` — as is the case for a component partial — it falls back to injecting before the first
> `</svg>`, which truncates the response. In Live Server 5.7.10 the truncation silently deleted the
> search input, sort dropdown and filter selects from `search-filter.html`, and the contact details
> from `contact-info.html`. Partials that embed inline SVG therefore end with an explicit
> `</body>` "live reload anchor" so the injected script lands at the end of the file, where it is
> inert. Keep that trailing line when editing a partial.

**Python (if available)**

```bash
cd medicare-healthcare-portfolio
python -m http.server 8787
# then open http://localhost:8787/index.html
```

**Node.js (if available)**

```bash
cd medicare-healthcare-portfolio
npx --yes serve -l 8787 .
```

Then open `http://localhost:8787/index.html`.

---

## 2. Project structure

```text
medicare-healthcare-portfolio/
├── index.html                        # canonical homepage (served at the site root)
├── jsonData/                          # all demonstration datasets as plain JSON
├── public/
│   ├── css/style.css                 # the only stylesheet (19 labelled sections)
│   ├── js/                           # 12 vanilla JavaScript modules (behaviour + data binding)
│   └── assets/
│       ├── icons/favicon.svg
│       └── images/                   # hero, doctors, clinics, pharmacy, diagnostics,
│                                     # pharmaceutical, suppliers, logo.svg
└── resources/views/
    ├── frontend/                     # 24 pages
    └── components/                   # 20 reusable partials
```

### Where the data lives

All demonstration content is plain JSON in `jsonData/`, not JavaScript. Pages stay HTML/CSS
documents and the scripts only carry behaviour (menu, accordions, filtering, validation, cart
preview, tracking) plus the small amount of data binding that a static page needs.

```text
jsonData/
├── doctor_data.json            # 12 fictional doctor profiles
├── clinic_data.json            # 8 fictional clinics and diagnostic centres
├── laboratory_data.json        # 3 fictional laboratories
├── medicine_data.json          # 14 fictional pharmacy products
├── diagnostic_test_data.json   # 12 fictional test entries
├── manufacturer_data.json      # 6 fictional manufacturers
├── supplier_data.json          # 6 fictional API / raw material suppliers
├── appointment_data.json       # 6 sample appointment records
├── report_data.json            # 6 sample report records
├── service_data.json           # 12 platform service entries
├── notification_data.json      # 4 example portal notifications
├── device_guidance_data.json   # 4 telemedicine preparation notes
├── portal_profile_data.json    # 1 fictional portal profile
└── config_data.json            # consultation types and city list
```

`public/js/data.js` is only a **loader**: it fetches these files once at start-up (the path is
derived from the page depth, so `index.html` and the nested pages both work), exposes them as
`window.MediCareData`, and adds the lookup helpers (`doctorById`, `testById`, `uniqueValues`, …).
To change content, edit the JSON — no JavaScript changes are needed.

Content that never changes and needs no filtering is written directly into the documents instead of
being fetched: the four "illustrative figures" (`index.html`, `home.html`, `about.html`), the six
homepage service categories (`index.html`, `home.html`) and the FAQ answers (the homepage preview
plus `faq.html`). Those sections have no dataset and no renderer — only the values are static, the
markup around them is unchanged.

Because data is fetched, pages wait for it before rendering: `main.js` loads the datasets, then
initialises the shared components, then runs the page module. If a JSON file is missing the page
still renders, the affected section shows its empty state, and an accessible warning lists the
files that could not be loaded.

### Page keys and script loading

Every document carries `<body data-page="<key>">`. `main.js` maps that key to the page module that
should run. Shared widgets (`status-badge`, `empty-state`, `pagination`, `search-filter`) are always
loaded; card templates are requested per page with `<body data-templates="doctor-card,clinic-card">`.

### Component contract

```html
<div data-component="navbar"></div>
<div data-component="breadcrumb" data-trail="Home|@home;Doctors"></div>
<div data-component="demo-notice" data-fill-message="Custom notice text"></div>
```

- `data-link="doctors.html"` is rewritten for the current page depth; `@home` resolves to the root `index.html`.
- `data-asset="images/logo.svg"` resolves inside `public/assets/`.
- `data-fill-<field>` on the placeholder fills `[data-field="<field>"]` inside the partial.
- Failures render an accessible inline fallback instead of a blank region.

---

## 3. Page-by-page functionality checklist

| Page | Router key | Verified behaviour |
|------|-----------|--------------------|
| `index.html` / `home.html` | `home` | Announcement bar, navbar, hero with dual CTAs, illustrative stats, 6 service categories, doctor search form that deep-links into the directory, featured doctors, featured clinics, telemedicine workflow, pharmacy preview, diagnostics preview, 4-step process, FAQ accordion, final CTA, footer, demo notice |
| `about.html` | `about` | Platform overview, mission/vision/values, ecosystem table, service approach, illustrative figures, fictional team roles |
| `services.html` | `services` | Live search + category filter with result count, empty state with reset link, journey guidance panels |
| `doctors.html` | `doctors` | Search, specialty/consultation/city filters, 4 sort orders, 6-per-page pagination, empty state, deep-link pre-fill (`?q=`, `?specialty=`, `?consultation=`, `?city=`) |
| `doctor-details.html?id=` | `doctor-details` | Profile hero, generated fact list, sample availability, clinic association, related profiles, dynamic title + breadcrumb, not-found state |
| `clinics.html` | `clinics` | Search, type/city/service filters, sorting, pagination, empty state |
| `clinic-details.html?id=` | `clinic-details` | Overview, services, departments, facilities, illustrative hours, associated specialists, not-found state |
| `telemedicine.html` | `telemedicine` | Workflow, consultation types, device guidance cards, privacy and safety panels, sample profiles, CTAs |
| `appointments.html` | `appointments` | Doctor/clinic/test selects populated from data, date minimum, sample time slots, consultation radio group, full validation, demo reference + simulated summary, no transmission |
| `appointment-tracking.html` | `appointment-tracking` | Sample ID buttons, lookup, simulated status timeline, unknown-ID message, `?id=` support |
| `pharmacy.html` | `pharmacy` | Search, category/manufacturer/prescription filters, sorting, pagination, add/remove/clear cart preview with BDT totals, empty state |
| `medicine-details.html?id=` | `medicine-details` | Product record, specification table, prescription status, warnings, related products, add-to-cart, not-found state |
| `diagnostics.html` | `diagnostics` | Search, category/laboratory/preparation filters, sorting, pagination, illustrative pricing |
| `test-details.html?id=` | `test-details` | What the test measures, preparation notes, turnaround, laboratory association, disclaimer, related tests |
| `report-tracking.html` | `report-tracking` | Sample report buttons, lookup, simulated 5-stage timeline, unrecognised-ID handling, empty-input validation |
| `pharmaceutical-manufacturers.html` | `manufacturers` | Search, category and capability filters, sorting, pagination, inquiry form |
| `manufacturer-details.html?id=` | `manufacturer-details` | Company overview, capabilities, portfolio, documentation categories, inquiry form, compliance statement |
| `api-suppliers.html` | `suppliers` | Search across materials, category and documentation filters, sorting, pagination, inquiry form |
| `supplier-details.html?id=` | `supplier-details` | Supplier overview, per-material specification tables, storage notes, documentation indicators, qualification statement |
| `patient-portal.html` | `patient-portal` | Demo banner, fictional profile, metrics, upcoming/history appointment cards, report statuses, 9 shortcuts, notifications |
| `contact.html` | `contact` | Contact information component, inquiry form with validation, healthcare and business link groups |
| `faq.html` | `faq` | 7 categories built from the shared FAQ dataset, accessible accordions, limitations sidebar |
| `privacy-policy.html` | `legal` | Sample policy across 11 sections plus review notice |
| `terms-of-use.html` | `legal` | Sample terms across 10 sections plus review notice |

---

## 4. Accessibility testing checklist

Verified manually and with browser automation (Chromium via Playwright).

| Criterion | Status | Evidence |
|-----------|--------|----------|
| 1.1.1 Non-text content | Pass | 0 images without an `alt` attribute across all 25 documents; decorative images use `alt=""` |
| 1.3.1 Info and relationships | Pass | `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `figure`, `form`, `fieldset`, `legend`, `address`, `time`, `dl`; exactly one `<h1>` per page |
| 1.4.3 / 1.4.6 Contrast | Pass (target met) | `--color-text` #12262c on white ≈ 13.6:1; `--color-text-muted` #46585f ≈ 7.4:1; primary #0b5d63 on white ≈ 7.3:1 |
| 1.4.4 Resize text | Pass | All typography and spacing in `rem`; layouts reflow without clipping |
| 1.4.10 Reflow | Pass | 390 px iframe test reported no horizontal overflow (`scrollWidth <= innerWidth`) |
| 1.4.11 Non-text contrast | Pass | Borders #cfdee1 on white ≈ 1.4:1 for decoration only; meaningful borders/icons use #a9bfc3 and darker |
| 1.4.12 Text spacing | Pass | No fixed heights on text containers |
| 2.1.1 Keyboard | Pass | Skip link, native buttons/links, accordions, menu and pagination all keyboard operable |
| 2.4.1 Bypass blocks | Pass | `.skip-link` targets `#main-content` |
| 2.4.7 / 2.4.11 Focus visible | Pass | Global `:focus-visible` 3 px outline with 2 px offset; never `outline: none` without replacement |
| 2.4.13 Focus appearance | Pass | Thick, high-contrast ring on a solid background |
| 2.5.5 Target size | Pass | `.btn`, `.btn--sm`, `.pagination__link`, `.navbar__toggle`, `.shortcut`, `.accordion__trigger` all ≥ 44 × 44 px (0 small targets reported) |
| 3.3.1 / 3.3.3 Error identification | Pass | Errors are text, placed next to the field, tied with `aria-describedby`, plus a summary alert |
| 4.1.2 Name, role, value | Pass | `aria-expanded`, `aria-controls`, `aria-current`, `aria-invalid`, `aria-live`, `role="search"` used where needed |
| 4.1.3 Status messages | Pass | Search counts, accordion, cart, tracking and submission results announce through live regions |
| 2.3.1 Flashing / 2.2.2 Pause | Pass | No flashing or auto-moving content |
| 2.3.3 Animation from interactions | Pass | `prefers-reduced-motion` block disables transitions and the loading spinner animation |

### Known accessibility limitations

- Automated checks cannot demonstrate full WCAG 2.2 AAA conformance. AAA criteria that are **not**
  claimed: 1.4.8 (visual presentation preferences), 1.4.9 (images of text — only the authored SVG
  logo is stylised), 3.1.5 (reading level of the sample legal text), and sign-language or
  extended-audio alternatives (2.2.4, 1.2.x), which do not apply to a fully textual static site but
  are also not evidenced.
- Focus is moved programmatically after directory searches, pagination and status lookups; screen
  reader announcement wording was verified with the live region text, not with a screen reader
  session.
- Colour contrast values are computed from the design tokens, not measured with a hardware
  colorimeter.

---

## 5. SEO checklist

| Item | Status |
|------|--------|
| Unique `<title>` on all 25 documents | Done |
| Unique meta description per page (120–158 chars where practical) | Done |
| Canonical URL placeholder on every page | Done (`https://example.com/...`) |
| Open Graph `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` | Done |
| `lang="en"` on every document | Done |
| One `<h1>` per page, logical heading order | Done |
| Semantic landmarks and internal navigation | Done |
| Descriptive link text (no "click here" only links) | Done |
| Semantic tables with `<caption>` and `scope` | Done |
| No keyword stuffing, no invented certifications or testimonials | Done |
| Query-string detail page strategy | Documented in `resources/views/components/head.html` |

**Query-string detail page production strategy.** Detail pages render from `?id=`. A static host
cannot pre-render arbitrary query strings, so a production build should: (a) emit one static,
crawlable HTML page per record; (b) keep the query-string form as the client-side demo fallback;
(c) mark the query-string variant `noindex, follow` so only the static page is indexed;
(d) generate `sitemap.xml` from the generated pages. In this demo each detail page therefore points
its canonical at its listing page.

---

## 6. Asset manifest

Images are **authored SVG illustrations committed with the project** (no runtime dependency on any
image-generation service, no broken or hot-linked URLs). Every file declares `role="img"` and a
descriptive `aria-label`; inline `alt` text is applied at the usage site.

| Path | Purpose | Type |
|------|---------|------|
| `public/assets/images/logo.svg` | MediCare brand mark | SVG 64×64 |
| `public/assets/icons/favicon.svg` | Favicon | SVG 64×64 |
| `public/assets/images/hero/hero-healthcare.svg` | Homepage hero | Illustration 960×640 |
| `public/assets/images/hero/hero-telemedicine.svg` | Telemedicine hero | Illustration 960×640 |
| `public/assets/images/hero/hero-about.svg` | Clinic reception illustration | Illustration 960×640 |
| `public/assets/images/hero/hero-diagnostics.svg` | Laboratory illustration | Illustration 960×640 |
| `public/assets/images/doctors/doctor-01.svg` … `doctor-12.svg` | Placeholder portraits for the 12 fictional doctors | Portrait 320×320 |
| `public/assets/images/clinics/clinic-01.svg` … `clinic-08.svg` | Clinic / centre illustrations | Card 640×360 |
| `public/assets/images/pharmacy/product-01.svg` … `product-14.svg` | Product illustrations | Card 640×360 |
| `public/assets/images/diagnostics/test-01.svg` … `test-12.svg` | Diagnostic test illustrations | Card 640×360 |
| `public/assets/images/pharmaceutical/facility-01.svg` … `facility-06.svg` | Manufacturing capability illustrations | Card 640×360 |
| `public/assets/images/suppliers/material-01.svg` … `material-06.svg` | Raw material illustrations | Card 640×360 |

Total: 64 SVG files. All are locally authored for this project and carry no third-party licence
obligations. If real photography is substituted later, keep the same filenames and aspect ratios
(16:9 for cards, 4:3 for heroes, 1:1 for portraits) so layouts need no changes, and prefer WebP with
an SVG or JPEG fallback.

---

## 7. Known limitations of the static demo

1. **No backend of any kind.** No server, database, authentication, session, payment gateway or
   e-mail delivery.
2. **Nothing is transmitted or stored.** Form submissions, cart contents, searches and tracking
   lookups exist only in the current page. No cookies, `localStorage`, `sessionStorage` or
   `IndexedDB` are used.
3. **`file://` will not work.** Components and the `jsonData/` datasets are fetched with
   `fetch()`, so a local HTTP server is required; the on-screen fallback message explains this.
4. **No real clinical capability.** No consultation, triage, prescription, result interpretation or
   appointment booking. Report and appointment statuses are fixed sample values.
5. **Query-string detail pages are not independently indexable** without the build step described in
   section 5.
6. **Print styling is basic** — a print block hides navigation, calls to action and breadcrumbs.
7. **Automated accessibility tooling cannot prove AAA conformance.** See the limitations listed in
   section 4.
8. **Data is intentionally fictional**, so no figure should be compared against a real healthcare
   statistic or price list.
9. **No i18n/localisation layer.** The interface is English with Bangladesh-appropriate terminology
   and BDT sample pricing.

---

## 8. Demonstration walkthrough

A five-minute tour that exercises every implemented behaviour:

1. **Open `index.html`.** Confirm the announcement bar, sticky navigation and hero. Follow
   *Find a doctor*.
2. **Doctor directory.** Type `cardio` in the search box, then set the city filter to *Dhaka*. Watch
   the count line and the live announcement update. Use *Clear all filters*, then page forward once.
3. **Doctor profile.** Open any card. Confirm the page title and breadcrumb update, then follow
   *Request appointment (demo)*.
4. **Appointment request.** Try submitting the empty form to see per-field errors and the summary
   alert. Fill fictional values, tick the consent box and submit. Note the generated demo reference,
   the simulated summary and the *Request Received — Demo* badge — then follow *Track a sample
   appointment*.
5. **Appointment tracking.** Use a sample ID button to see the simulated timeline, then look up
   `MCA-9999-9999` to see the unknown-ID state.
6. **Telemedicine.** Review the workflow, device guidance and privacy panels.
7. **Pharmacy.** Filter by *Prescription Medicine*, add two products to the cart preview, remove one,
   then open a product detail page to see the specification table and warnings.
8. **Diagnostics.** Filter by *Hormones*, open a test detail page, then use *Report tracking* with a
   sample report ID and with a nonsense ID.
9. **Manufacturers and suppliers.** Open a company profile, review capabilities and documentation
   categories, then submit the demo inquiry form (validation plus confirmation, nothing sent).
10. **Patient portal.** Review the demo banner, metrics, appointment cards, report statuses and
    shortcuts.
11. **Keyboard and responsive pass.** Reload at a narrow width, open the menu with the hamburger,
    close it with `Escape`, then `Tab` from the top of the page to confirm the skip link and visible
    focus rings throughout.