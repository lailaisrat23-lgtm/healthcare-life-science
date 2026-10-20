# Project Prompt: MediCare Integrated Clinic & Telemedicine Platform

## 1. Role and Objective

Act as a **Senior Frontend Developer, UI/UX Designer, Accessibility Specialist, and Technical SEO Engineer**.

Design and develop a complete, professional, modern, responsive static portfolio demo for a healthcare platform named **MediCare Integrated Clinic & Telemedicine Platform**.

The platform should demonstrate how a unified digital healthcare ecosystem could connect patients, doctors, clinics, diagnostic laboratories, pharmacies, pharmaceutical manufacturers, and API raw material suppliers.

The project is intended for portfolio presentation and UI/UX demonstration. It must look like a realistic healthcare technology product, not a generic medical website template.

Build a complete frontend experience with coherent navigation, reusable components, realistic sample data, and working client-side interactions.

**This is a strictly static website.** All doctors, patients, appointments, prescriptions, medical services, products, diagnostic tests, orders, dashboards, notifications, and statistics must use fictional demonstration data.

Do not implement a backend, database, real authentication, actual telemedicine sessions, real appointment booking, payment processing, prescription issuance, medical record storage, or external API integrations.

## 2. Project Information

- **Project Name:** MediCare Integrated Clinic & Telemedicine Platform
- **Industry:** Healthcare & Life Sciences
- **Market Scope:** Bangladesh and Global
- **Primary Concept:** Integrated clinic management and telemedicine platform
- **Technology:** HTML5, CSS3, Vanilla JavaScript
- **Optional UI Framework:** Bootstrap 5 via CDN, only where it improves development efficiency
- **Rendering:** Static HTML pages and lightweight JavaScript components
- **Data:** Local, hardcoded fictional demo datasets
- **Backend:** None
- **Database:** None
- **Build Tools:** No Node.js, npm, Vite, Webpack, or build pipeline
- **CSS Rule:** All custom CSS must reside in `public/css/style.css`
- **JavaScript Rule:** All custom JavaScript must reside in `public/js/`
- **Reusable HTML:** `resources/views/components/`
- **Frontend Pages:** `resources/views/frontend/`
- **Image Generation:** https://imgenerate.com/

## 3. Target Niches and Verticals

The design must represent the following five healthcare and life-sciences verticals.

### A. Retail & E-Pharmacy

Demonstrate a digital pharmacy storefront featuring:

- Medicine and healthcare product categories.
- Product search and filtering.
- Product details.
- Generic product information and manufacturer details.
- Availability labels using static sample data.
- Cart preview using local JavaScript state.
- Prescription-required product labels.
- A clearly simulated checkout preview.

Do not enable actual medicine purchases, prescription uploads for real medical use, or payment processing.

### B. Pharmaceutical Manufacturers

Demonstrate a B2B pharmaceutical manufacturing information section with:

- Manufacturer profiles.
- Product portfolio.
- Manufacturing capabilities.
- Quality assurance information.
- Sample documentation and compliance categories.
- Business inquiry forms.
- Manufacturing and distribution overview.

Do not invent real certifications or represent fictional manufacturers as verified businesses.

### C. API Raw Material Suppliers

Demonstrate a B2B API and pharmaceutical raw material directory with:

- Supplier profiles.
- Material categories.
- Product specifications.
- Sample catalog records.
- Packaging and storage information.
- Documentation availability indicators.
- Supplier inquiry forms.
- Search and category filters.

Use fictional sample materials and suppliers. Do not provide medical or pharmaceutical manufacturing instructions.

### D. Diagnostic & Pathology Laboratories

Demonstrate a diagnostic services directory with:

- Laboratory profiles.
- Diagnostic test categories.
- Sample test details.
- Preparation instructions where appropriate.
- Illustrative prices in BDT.
- Sample appointment request forms.
- Sample report-status tracking.
- Laboratory service information.

All test prices, laboratory profiles, test results, and report statuses must be clearly identified as fictional demo data.

Never generate realistic patient-identifiable information or suggest that demo results are valid for diagnosis or treatment.

### E. Specialized Clinics

Demonstrate clinic and specialist discovery with:

- Clinic profiles.
- Medical specialty categories.
- Fictional doctor profiles.
- Doctor availability examples.
- Consultation types.
- Appointment request interactions.
- Clinic facilities.
- Patient guidance content.

Do not imply that fictional doctors are licensed or accepting real patients.

## 4. Required Folder Structure

Use the following structure as the project's foundation. You may add supporting files and subdirectories without moving the required folders.

```text
medicare-healthcare-portfolio/
│
├── index.html
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── hero/
│   │   │   ├── doctors/
│   │   │   ├── clinics/
│   │   │   ├── pharmacy/
│   │   │   ├── diagnostics/
│   │   │   ├── pharmaceutical/
│   │   │   └── suppliers/
│   │   │
│   │   └── icons/
│   │
│   └── js/
│       ├── main.js
│       ├── components.js
│       ├── navigation.js
│       ├── data.js
│       ├── clinic.js
│       ├── pharmacy.js
│       ├── diagnostics.js
│       ├── appointments.js
│       ├── patient-portal.js
│       ├── supplier-directory.js
│       ├── forms.js
│       └── ui.js
│
└── resources/
    └── views/
        ├── frontend/
        │   ├── home.html
        │   ├── about.html
        │   ├── services.html
        │   ├── doctors.html
        │   ├── doctor-details.html
        │   ├── clinics.html
        │   ├── clinic-details.html
        │   ├── telemedicine.html
        │   ├── appointments.html
        │   ├── pharmacy.html
        │   ├── medicine-details.html
        │   ├── diagnostics.html
        │   ├── test-details.html
        │   ├── pharmaceutical-manufacturers.html
        │   ├── manufacturer-details.html
        │   ├── api-suppliers.html
        │   ├── supplier-details.html
        │   ├── patient-portal.html
        │   ├── appointment-tracking.html
        │   ├── report-tracking.html
        │   ├── contact.html
        │   ├── faq.html
        │   ├── privacy-policy.html
        │   └── terms-of-use.html
        │
        └── components/
            ├── head.html
            ├── announcement-bar.html
            ├── navbar.html
            ├── footer.html
            ├── breadcrumb.html
            ├── service-card.html
            ├── doctor-card.html
            ├── clinic-card.html
            ├── medicine-card.html
            ├── diagnostic-test-card.html
            ├── manufacturer-card.html
            ├── supplier-card.html
            ├── appointment-card.html
            ├── status-badge.html
            ├── pagination.html
            ├── search-filter.html
            ├── inquiry-form.html
            ├── contact-info.html
            ├── empty-state.html
            └── demo-notice.html
```

### Important architectural requirement

Browsers do not natively include one HTML file inside another. Since this project must remain static and must not require a backend or build tool, use a lightweight, dependency-free JavaScript component loader to fetch reusable HTML partials.

Requirements:

- Use the requested component directory.
- Keep shared markup in reusable component files.
- Ensure nested-page asset paths work consistently.
- Initialize page-specific functionality after components have loaded.
- Handle component-loading failures gracefully.
- Avoid duplicate event listeners.
- Avoid loading the same component multiple times.
- Use a local HTTP server, such as VS Code Live Server, for development.

Do not claim that component fetching will necessarily work when HTML files are opened directly using `file://`.

## 5. Design Direction

Create a premium, modern, trustworthy healthcare interface.

### Visual identity

Use a restrained clinical design system featuring:

- Deep teal or healthcare blue as the primary color.
- Soft mint or a carefully chosen green accent.
- White and light neutral surfaces.
- Dark, highly readable text.
- Subtle borders and restrained shadows.
- Rounded cards with consistent radii.
- Clear spacing and readable typography.
- Authentic healthcare and clinical imagery.
- Consistent icons, badges, buttons, and form controls.

The design should feel appropriate for both Bangladeshi healthcare services and an international healthcare technology audience.

Avoid excessive gradients, unnecessary animations, overcrowded layouts, exaggerated medical imagery, and generic dashboard patterns.

Create a coherent visual hierarchy that communicates trust, clarity, and accessibility.

## 6. CSS Architecture and Strict Styling Rules

All custom CSS must exist in:

`public/css/style.css`

**Inline CSS is strictly prohibited.**

Do not use:

- `style="..."` attributes.
- Inline `<style>` blocks.
- JavaScript-generated style attributes.
- Repeated component styles across multiple pages.

Use `:root` custom properties for all reusable design tokens.

Example:

```css
:root {
  --color-primary: #075e66;
  --color-primary-hover: #064b52;
  --color-accent: #287f68;

  --color-background: #ffffff;
  --color-surface: #f3f7f7;
  --color-text: #182b33;
  --color-text-muted: #4c6068;
  --color-border: #d5e0e3;

  --font-family-base: Arial, Helvetica, sans-serif;

  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  --container-max-width: 1200px;

  --transition-fast: 180ms ease;
}
```

Treat these as starting values. Verify actual contrast before finalizing the palette.

Organize the stylesheet into clearly labeled sections:

1. Reset and base styles.
2. Design tokens.
3. Typography.
4. Accessibility utilities.
5. Containers and layout.
6. Header and navigation.
7. Buttons and links.
8. Forms and validation.
9. Cards, badges, and tables.
10. Homepage sections.
11. Doctor and clinic directories.
12. Telemedicine and appointments.
13. Pharmacy and product catalog.
14. Diagnostics and report tracking.
15. Pharmaceutical manufacturers and suppliers.
16. Patient portal.
17. Footer.
18. Responsive breakpoints.
19. Reduced-motion and accessibility overrides.

Follow these rules:

- Use reusable CSS classes.
- Prefer mobile-first responsive design.
- Use CSS Grid and Flexbox appropriately.
- Use descriptive class names.
- Use `rem` for typography and most spacing.
- Avoid unnecessary IDs for styling.
- Avoid excessive `!important`.
- Avoid duplicating framework styles unnecessarily.
- Keep the stylesheet readable and maintainable.

## 7. Semantic HTML and SEO

Use semantic HTML5 throughout the project.

Appropriate elements include:

- `<header>`
- `<nav>`
- `<main>`
- `<section>`
- `<article>`
- `<aside>`
- `<footer>`
- `<figure>`
- `<form>`
- `<fieldset>`
- `<legend>`
- `<address>`
- `<time>`

Requirements:

- One clear primary `<h1>` per page.
- Logical heading hierarchy.
- Meaningful link text.
- Real buttons for actions.
- Links for navigation.
- Proper form labels.
- Descriptive image alt text.
- Empty alt attributes for purely decorative images.
- Unique page titles and meta descriptions.
- Appropriate canonical URL placeholders.
- Open Graph metadata where useful.
- Semantic tables and headings.
- Descriptive internal navigation.

Do not invent healthcare credentials, real clinic addresses, verified laboratory certifications, or real patient testimonials.

Because the site is static, each HTML document must contain its own initial metadata. Query-string-based detail pages must have a documented production SEO strategy.

## 8. Homepage — `home.html`

Build a complete homepage containing the following sections.

### 8.1 Announcement bar

Display a short message about integrated healthcare services, digital consultations, or convenient clinic discovery.

### 8.2 Navigation

Include:

- MediCare logo.
- Home.
- About.
- Services.
- Doctors.
- Clinics.
- Telemedicine.
- Pharmacy.
- Diagnostics.
- Contact.
- A primary CTA such as Find a Doctor.

Use a responsive navigation pattern with keyboard support.

### 8.3 Hero section

Suggested headline:

**"Better Healthcare, Connected Around You."**

Supporting copy should explain how patients can discover healthcare services, explore specialists, request appointments, and access digital healthcare information.

Include two CTAs:

- Find a Doctor.
- Explore Healthcare Services.

Use an appropriate healthcare image generated through Imgenerate or another permitted image source.

### 8.4 Trust and service indicators

Show fictional demo statistics, such as:

- Listed Specialists.
- Partner Clinics.
- Diagnostic Services.
- Healthcare Categories.

Label them as illustrative demonstration figures.

### 8.5 Healthcare service categories

Show cards for:

- General Medicine.
- Specialized Clinics.
- Telemedicine.
- Diagnostics and Pathology.
- Pharmacy.
- Pharmaceutical Suppliers.

### 8.6 Find a doctor

Include a doctor search interface with:

- Doctor name.
- Specialty.
- Consultation type.
- Location or city.
- Search button.

Use fictional static records.

### 8.7 Featured doctors

Display fictional doctor profiles with:

- Name.
- Specialty.
- Qualifications marked as illustrative.
- Consultation type.
- Sample availability.
- View Profile CTA.

Clearly label the doctors as fictional demonstration profiles.

### 8.8 Clinics and diagnostic centers

Show clinic and laboratory cards with categories, services, illustrative locations, and detail links.

### 8.9 Telemedicine introduction

Explain the concept of remote consultation and show a demo consultation workflow.

Do not imply that a real consultation can be started.

### 8.10 Pharmacy preview

Show selected healthcare products and medicine categories with prescription-required labels where appropriate.

### 8.11 Diagnostic services preview

Show selected tests with sample prices, preparation information, and detail links.

All prices and service availability must be fictional.

### 8.12 Healthcare process

Display a simple illustrative flow:

Find a Service → Explore Details → Request an Appointment → Review Demo Status.

Make clear that appointment requests are not transmitted.

### 8.13 Frequently asked questions

Include questions about clinic discovery, appointment requests, telemedicine, diagnostics, pharmacy information, and platform limitations.

### 8.14 Final CTA

Encourage visitors to explore services or view the healthcare directory.

### 8.15 Footer

Include company information, service links, healthcare categories, contact details, policy links, and a static-demo disclaimer.

## 9. Informational and Directory Pages

### About Us — `about.html`

Include the platform overview, mission, vision, healthcare ecosystem, service approach, and fictional team or organization details.

### Services — `services.html`

Display a searchable or categorized overview of the platform's service areas.

### Doctors — `doctors.html`

Implement a doctor directory with:

- Search.
- Specialty filters.
- Consultation type filters.
- City filters.
- Sorting.
- Doctor cards.
- Empty results state.
- Pagination if useful.

### Doctor Details — `doctor-details.html`

Display the selected fictional doctor using a query parameter or static identifier.

Include profile, specialty, illustrative qualifications, sample availability, consultation type, clinic association, and an appointment request CTA.

### Clinics — `clinics.html`

Implement a clinic directory with search, specialty filters, location filters, service summaries, and detail links.

### Clinic Details — `clinic-details.html`

Include clinic overview, services, departments, opening hours as illustrative data, sample doctors, and appointment inquiry options.

## 10. Telemedicine and Appointment Pages

### Telemedicine — `telemedicine.html`

Include:

- Telemedicine introduction.
- How remote consultation works.
- Sample consultation types.
- Device and connectivity guidance.
- Privacy and safety information.
- Sample consultation cards.
- CTA to explore doctors.

Do not build actual video calling, medical consultations, patient triage, or real-time communication.

### Appointments — `appointments.html`

Create a static appointment request interface with:

- Doctor or clinic selection.
- Sample date and time choices.
- Consultation type.
- Contact fields using fictional demo inputs.
- Validation.
- Confirmation-style demo feedback.

Do not transmit appointment requests or claim a real appointment has been booked.

### Appointment Tracking — `appointment-tracking.html`

Display simulated appointment statuses, such as:

- Request Draft.
- Request Received — Demo.
- Awaiting Confirmation — Demo.
- Confirmed — Simulated.
- Completed — Simulated.
- Cancelled — Simulated.

Allow users to search sample appointment IDs. Explain that no real appointment is created.

## 11. Pharmacy and Medicine Pages

### Pharmacy — `pharmacy.html`

Build a static e-pharmacy interface with:

- Product categories.
- Product search.
- Category filters.
- Manufacturer filters where appropriate.
- Product cards.
- Price display in BDT.
- Prescription-required labels.
- Product detail links.
- Cart preview.
- Empty search results state.

Any cart must use local JavaScript state and must not initiate payment or actual purchasing.

### Medicine Details — `medicine-details.html`

Include:

- Product name.
- Product category.
- Fictional manufacturer.
- Packaging information.
- Illustrative price.
- Product description.
- Prescription-required status.
- Appropriate product warnings.
- Related products.

Do not provide individualized treatment advice or recommend medicines based on symptoms.

Clearly distinguish educational product information from medical advice.

## 12. Diagnostics and Pathology Pages

### Diagnostics — `diagnostics.html`

Build a diagnostic services directory containing:

- Test search.
- Test category filters.
- Sample prices in BDT.
- Preparation information.
- Laboratory association.
- Detail links.
- Sample appointment request CTA.

### Test Details — `test-details.html`

Include:

- Test name and category.
- What the test generally measures.
- Sample preparation information.
- Illustrative pricing.
- Sample turnaround time.
- Laboratory association.
- Appointment request CTA.
- Medical disclaimer.

Do not invent clinically significant results or provide patient-specific interpretations.

### Report Tracking — `report-tracking.html`

Build a simulated report tracking interface with:

- Demo report ID input.
- Sample laboratory name.
- Test name.
- Collection date.
- Simulated report status.
- Illustrative expected availability.
- Invalid ID handling.

Example statuses:

- Request Registered — Demo.
- Sample Collection Pending — Demo.
- Sample Received — Demo.
- Processing — Simulated.
- Report Ready — Simulated.

Any report details must be clearly fictional. Avoid realistic patient identifiers and avoid presenting demo data as genuine medical records.

## 13. Pharmaceutical Manufacturers and API Suppliers

### Pharmaceutical Manufacturers — `pharmaceutical-manufacturers.html`

Include:

- Manufacturer directory.
- Product categories.
- Manufacturing capabilities.
- Quality documentation categories.
- Search and filters.
- Business inquiry CTA.

### Manufacturer Details — `manufacturer-details.html`

Include a fictional company overview, product portfolio, capabilities, documentation examples, and inquiry form.

### API Suppliers — `api-suppliers.html`

Include:

- Supplier directory.
- Raw material categories.
- Product specifications.
- Supplier search.
- Filters.
- Packaging information.
- Documentation availability indicators.

### Supplier Details — `supplier-details.html`

Include supplier profile, material listings, sample specifications, storage information, documentation examples, and business inquiry form.

All companies and records must be fictional. Do not imply that demo suppliers are qualified, certified, or approved pharmaceutical suppliers.

## 14. Patient Portal — `patient-portal.html`

Create a professional patient dashboard preview with:

- Welcome header.
- Profile summary using fictional data.
- Upcoming appointment cards.
- Recent appointment history.
- Sample diagnostic report statuses.
- Healthcare service shortcuts.
- Notification examples.
- Appointment tracking links.
- Clear demo-mode banner.

Do not implement real login, passwords, patient authentication, persistent medical records, or access to actual healthcare data.

Do not store sensitive patient data in browser storage.

## 15. Contact, FAQ, Privacy and Terms

### Contact — `contact.html`

Include:

- Contact information.
- Healthcare service inquiries.
- Business inquiries.
- Contact form.
- Form validation.
- Accessible feedback.
- Demo submission notice.

### FAQ — `faq.html`

Provide categorized questions for:

- Appointments.
- Telemedicine.
- Clinics.
- Pharmacy.
- Diagnostics.
- Pharmaceutical suppliers.
- Privacy and security.

### Privacy Policy — `privacy-policy.html`

Cover information handling, intended data use, cookies, third-party services, security, data retention, and user rights as a sample policy requiring legal review.

### Terms of Use — `terms-of-use.html`

Cover website usage, illustrative service information, demo interactions, intellectual property, liability, external links, and the absence of real healthcare transactions.

## 16. Reusable Component Requirements

Build reusable components in `resources/views/components/`.

At a minimum, implement:

- Head and metadata conventions.
- Announcement bar.
- Navbar.
- Footer.
- Breadcrumb.
- Service card.
- Doctor card.
- Clinic card.
- Medicine card.
- Diagnostic test card.
- Manufacturer card.
- Supplier card.
- Appointment card.
- Status badge.
- Pagination.
- Search and filter controls.
- Inquiry form.
- Contact information.
- Empty state.
- Demo notice.

Repeated UI must use shared component markup and reusable rendering functions.

Do not duplicate the same card, badge, footer, navigation, or form markup across multiple pages.

## 17. JavaScript Architecture

Keep custom JavaScript in `public/js/`.

### `main.js`

- Shared application initialization.
- Page setup.
- Common initialization sequence.
- General error handling.

### `components.js`

- HTML partial loading.
- Component insertion.
- Loading failures.
- Initialization coordination.

### `navigation.js`

- Responsive menu.
- Active navigation state.
- Keyboard interactions.

### `data.js`

- Shared fictional doctors.
- Clinics.
- Pharmacy products.
- Diagnostic tests.
- Manufacturers.
- Suppliers.
- Appointments and reports.

### `clinic.js`

- Clinic directory.
- Doctor directory.
- Search and filtering.
- Detail-page rendering.

### `pharmacy.js`

- Product search.
- Filtering.
- Product detail lookup.
- Local cart preview.

### `diagnostics.js`

- Test directory.
- Filtering.
- Test details.
- Simulated report lookup.

### `appointments.js`

- Appointment request form.
- Sample date and time selection.
- Demo status lookup.

### `patient-portal.js`

- Dashboard rendering.
- Sample activity.
- Appointment and report summaries.

### `supplier-directory.js`

- Manufacturer and supplier directories.
- Search and filters.
- Detail rendering.

### `forms.js`

- Reusable client-side validation.
- Error and success messages.
- Demo-only submission handling.

### `ui.js`

- Shared DOM helpers.
- Accessible accordion behavior.
- Modal and dropdown utilities if required.
- Empty states and status rendering.

Follow these principles:

- Use modern Vanilla JavaScript.
- Prefer small, reusable functions.
- Keep data separate from rendering.
- Avoid global-variable pollution.
- Use event delegation where appropriate.
- Prevent duplicate listeners.
- Use safe DOM APIs such as `textContent`.
- Avoid unsafe insertion of user-provided HTML.
- Do not use `eval`.
- Do not use inline event handlers.
- Do not introduce unnecessary dependencies.
- Do not call external APIs.

## 18. Accessibility Requirements — WCAG 2.2 AAA Target

Treat WCAG 2.2 Level AAA as the target for the complete interface.

Implement:

- Semantic HTML.
- Logical heading structure.
- Skip-to-content link.
- Full keyboard operation.
- Visible and unobscured focus indicators.
- Correct labels and instructions.
- Accessible form validation.
- Screen-reader-friendly status messages.
- Appropriate ARIA attributes only where needed.
- Descriptive image alternatives.
- Sufficient contrast.
- Accessible tables and dynamic content.
- Keyboard-accessible navigation and dialogs.
- No keyboard traps.
- Reduced-motion support.
- No color-only status communication.
- Browser zoom and text resizing support.
- Clear focus management after search and status updates.
- Comfortable interactive targets.
- Accessible empty and error states.

Use the following design goals where applicable:

- Normal text contrast of at least 7:1.
- Large text contrast of at least 4.5:1.
- Enhanced contrast for relevant non-text UI components.
- Support for text resizing up to 200% without loss of content or functionality.
- Aim for targets of at least 44 × 44 CSS pixels where practical.
- Avoid unnecessary time limits and flashing content.
- Respect `prefers-reduced-motion`.

Test applicable WCAG 2.2 AAA success criteria using automated and manual methods. Do not claim full AAA conformance merely because an automated scanner reports no errors. Document any limitations.

## 19. Healthcare Safety, Privacy and Trust

Because this project represents healthcare services:

- Label fictional doctors, clinics, suppliers, and companies.
- Clearly mark simulated appointments and reports.
- Do not display real patient information.
- Do not store sensitive medical information.
- Do not implement real medical record management.
- Do not claim that an appointment or consultation is confirmed in the real world.
- Do not provide personalized diagnosis or treatment recommendations.
- Do not claim medical certifications without evidence.
- Do not create false assurances of regulatory compliance.
- Avoid using fake medical endorsements.
- Use non-identifiable sample data.
- Add a visible notice that the platform is a portfolio demonstration and not a live healthcare service.

Use Bangladesh-appropriate terminology and BDT for local price examples while keeping the overall visual language suitable for an international audience.

## 20. Image Generation and Asset Optimization

Use https://imgenerate.com/ as a preferred resource for generating suitable healthcare imagery.

Suggested image categories:

- Healthcare hero image.
- Doctor consultation.
- Modern clinic reception.
- Diagnostic laboratory.
- Medical laboratory equipment.
- Pharmacy storefront.
- Pharmaceutical manufacturing facility.
- Pharmaceutical raw materials.
- Healthcare team.

Save final approved assets locally in `public/assets/images/`.

Requirements:

- Use descriptive filenames.
- Optimize images for web delivery.
- Prefer appropriate WebP or similarly efficient formats.
- Use meaningful alt text for informative images.
- Use empty alt text for decorative images.
- Avoid broken image URLs.
- Avoid relying on a remote generation service at runtime.
- Verify licensing and usage terms.
- Maintain consistent aspect ratios and visual treatment.

## 21. Performance and Code Quality

Implement production-minded frontend practices:

- Mobile-first layouts.
- Efficient DOM operations.
- Lazy loading of below-the-fold images.
- Stable image dimensions.
- Minimal third-party dependencies.
- Reusable components and functions.
- No unnecessary scripts.
- No repeated data structures.
- Clear loading and error states.
- No broken internal links.
- No avoidable console errors.
- Consistent formatting and naming conventions.

Do not over-engineer a static portfolio into a full application framework.

## 22. Development Workflow

### Phase 1 — Architecture

- Confirm directory structure.
- Implement the component loader.
- Define CSS tokens.
- Define shared static datasets.
- Establish metadata conventions.

### Phase 2 — Shared UI

- Build the navbar, footer, cards, badges, forms, breadcrumbs, and common utilities.

### Phase 3 — Homepage and Directories

- Build the homepage.
- Build doctor and clinic directories.
- Build service and detail pages.

### Phase 4 — Healthcare Verticals

- Build telemedicine and appointment previews.
- Build pharmacy and product details.
- Build diagnostics and report tracking.
- Build manufacturer and API supplier directories.
- Build the patient portal.

### Phase 5 — Supporting Pages

- Build contact, FAQ, privacy policy, and terms.

### Phase 6 — Accessibility and SEO

- Verify metadata and semantic markup.
- Test keyboard navigation.
- Test contrast.
- Test responsive layouts.
- Test dynamic feedback.
- Document remaining accessibility limitations.

### Phase 7 — Final QA

- Test every page.
- Test all navigation and buttons.
- Verify shared component loading.
- Verify static data consistency.
- Verify all assets and local paths.
- Confirm no inline CSS or inline event handlers.
- Confirm the project runs without a backend or build tools.

## 23. Final Deliverables

Provide:

1. Complete project folder structure.
2. All HTML frontend pages.
3. All reusable HTML components.
4. Complete `public/css/style.css`.
5. All required JavaScript files.
6. Shared static datasets.
7. Local image assets or a documented asset manifest.
8. Local development instructions.
9. Page-by-page functionality checklist.
10. Accessibility testing checklist.
11. SEO checklist.
12. Known limitations of the static demo.
13. A concise demonstration walkthrough.

Do not return only a mockup, pseudocode, or partial homepage.

Build the complete, connected, functional static portfolio demo.

**Final instruction:** Work as a senior developer. Resolve architectural conflicts before implementation, maintain a consistent design system, keep code reusable, and prioritize accessibility, responsive behavior, healthcare trust, semantic HTML, and the DRY principle. Clearly distinguish all simulated data from real medical services and transactions.
