/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/main.js
 *
 * Shared application entry point. Boots the component loader, wires the common
 * behaviour every page needs, then delegates to the page module declared on
 * `<body data-page="...">`. Page modules run only after shared components have
 * been injected, so they can safely query component-rendered markup.
 */
(function (window, document) {
  "use strict";

  var UI = window.MediCareUI;
  var DATA = window.MediCareData;

  /** page key -> initialiser. Defined lazily so a missing module cannot break boot. */
  var PAGE_MODULES = {
    home: function () {
      call("MediCareClinic", "initFeaturedDoctors");
      call("MediCareClinic", "initFeaturedClinics");
      call("MediCarePharmacy", "initPreview");
      call("MediCareDiagnostics", "initPreview");
    },
    about: function () {
      /* Illustrative statistics are static markup; nothing to initialise. */
    },
    faq: function () {
      /* FAQ answers are static markup; accordions are wired by UI.initAccordions. */
    },
    services: initServicesDirectory,
    doctors: function () {
      call("MediCareClinic", "initDoctorDirectory");
    },
    "doctor-details": function () {
      call("MediCareClinic", "initDoctorDetail");
    },
    clinics: function () {
      call("MediCareClinic", "initClinicDirectory");
    },
    "clinic-details": function () {
      call("MediCareClinic", "initClinicDetail");
    },
    telemedicine: function () {
      initDeviceGuidance();
      call("MediCareClinic", "initFeaturedDoctors");
    },
    legal: function () {
      /* Privacy policy and terms are static documents; nothing to initialise. */
    },
    appointments: function () {
      call("MediCareAppointments", "initRequestForm");
    },
    "appointment-tracking": function () {
      call("MediCareAppointments", "initTracking");
    },
    pharmacy: function () {
      call("MediCarePharmacy", "initDirectory");
    },
    "medicine-details": function () {
      call("MediCarePharmacy", "initDetail");
    },
    diagnostics: function () {
      call("MediCareDiagnostics", "initDirectory");
    },
    "test-details": function () {
      call("MediCareDiagnostics", "initDetail");
    },
    "report-tracking": function () {
      call("MediCareDiagnostics", "initReportTracking");
    },
    manufacturers: function () {
      call("MediCareSuppliers", "initManufacturerDirectory");
    },
    "manufacturer-details": function () {
      call("MediCareSuppliers", "initManufacturerDetail");
    },
    suppliers: function () {
      call("MediCareSuppliers", "initSupplierDirectory");
    },
    "supplier-details": function () {
      call("MediCareSuppliers", "initSupplierDetail");
    },
    "patient-portal": function () {
      call("MediCarePortal", "init");
    }
  };

  function call(namespace, method) {
    var module = window[namespace];
    if (module && typeof module[method] === "function") {
      try {
        module[method]();
      } catch (error) {
        reportError(error, namespace + "." + method);
      }
    }
  }

  function reportError(error, context) {
    if (window.console && window.console.error) {
      window.console.error("[MediCare] " + (context || "initialisation") + " failed:", error);
    }
  }

  /** Generic client-side filtering used by the services directory. */
  function initServicesDirectory() {
    var listRoot = UI.qs("[data-services-results]");
    if (!listRoot || listRoot.dataset.servicesInit === "true") {
      return;
    }
    listRoot.dataset.servicesInit = "true";

    var searchInput = UI.qs("[data-services-search]");
    var categorySelect = UI.qs("[data-services-category]");
    var countNode = UI.qs("[data-services-count]");
    var services = (DATA && DATA.services) || [];

    function render() {
      var term = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var category = categorySelect ? categorySelect.value : "";

      var matches = services.filter(function (service) {
        var matchesCategory = !category || service.category === category;
        var haystack = (service.title + " " + service.text + " " + service.category).toLowerCase();
        return matchesCategory && (!term || haystack.indexOf(term) !== -1);
      });

      listRoot.textContent = "";
      if (!matches.length) {
        listRoot.appendChild(
          UI.emptyState({
            title: "No services match your search",
            text: "Try a different keyword or clear the category filter to see all demonstration services.",
            actionLabel: "Clear filters",
            actionHref: "services.html"
          })
        );
      } else {
        var grid = UI.el("ul", { className: "category-grid" });
        matches.forEach(function (service) {
          var item = UI.el("li");
          var card = UI.el("article", { className: "category-card" });
          card.appendChild(UI.icon(service.icon, "category-card__icon"));
          card.appendChild(UI.el("h3", { className: "category-card__title", text: service.title }));
          card.appendChild(UI.el("p", { className: "category-card__text", text: service.text }));
          var tags = UI.el("ul", { className: "card__tags" });
          tags.appendChild(UI.el("li", { className: "badge badge--neutral", text: service.category }));
          card.appendChild(tags);
          card.appendChild(
            UI.el("a", {
              className: "category-card__link link-arrow",
              text: "View details",
              attrs: { href: UI.pageUrl(service.link) }
            })
          );
          item.appendChild(card);
          grid.appendChild(item);
        });
        listRoot.appendChild(grid);
      }

      if (countNode) {
        countNode.textContent = "";
        countNode.appendChild(UI.el("strong", { text: String(matches.length) }));
        countNode.appendChild(
          document.createTextNode(" of " + services.length + " demonstration services shown")
        );
      }
      UI.announce(matches.length + " services shown.");
    }

    if (searchInput) {
      searchInput.addEventListener("input", UI.debounce(render, 200));
    }
    if (categorySelect) {
      categorySelect.addEventListener("change", render);
    }
    render();
  }

  /** Device and connectivity guidance cards on the telemedicine page. */
  function initDeviceGuidance() {
    var root = UI.qs("[data-device-guidance]");
    if (!root || root.dataset.guidanceInit === "true" || !DATA) {
      return;
    }
    root.dataset.guidanceInit = "true";
    root.textContent = "";
    DATA.deviceGuidance.forEach(function (entry) {
      var item = UI.el("li", { className: "stat" });
      item.appendChild(UI.el("span", { className: "stat__label", text: entry.title }));
      item.appendChild(UI.el("span", { className: "stat__note", text: entry.text }));
      root.appendChild(item);
    });
  }

  function initShared() {
    var yearNode = UI.qs("[data-current-year]");
    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }
    UI.initAccordions(document);
    if (window.MediCareNavigation) {
      window.MediCareNavigation.init();
    }
    if (window.MediCareForms) {
      window.MediCareForms.initAll(document);
    }
  }

  function initPage() {
    var page = document.body.dataset.page || "home";
    var module = PAGE_MODULES[page];
    if (typeof module === "function") {
      try {
        module();
      } catch (error) {
        reportError(error, page);
      }
    }
    document.documentElement.setAttribute("data-page-ready", page);
  }

  function boot() {
    initShared();

    /* Data lives in jsonData/ as static JSON, so every renderer waits for it. */
    var dataReady = DATA && typeof DATA.load === "function" ? DATA.load() : Promise.resolve();

    dataReady.then(startView, startView);
  }

  function startView() {
    reportDataGaps();
    if (window.MediCareComponents) {
      window.MediCareComponents.init();
    } else {
      initPage();
    }
  }

  /** Explain missing datasets on screen instead of silently rendering blanks. */
  function reportDataGaps() {
    if (!DATA || !DATA.failures || !DATA.failures.length) {
      return;
    }
    var host = document.getElementById("main-content") || document.body;
    var notice = UI.alertBox({
      variant: "warning",
      title: "Some demonstration data could not be loaded",
      text:
        "The following JSON files in the jsonData folder were unavailable, so their sections are shown empty: " +
        DATA.failures.join(", ") +
        ". Serve the project over a local HTTP server and reload."
    });
    host.insertBefore(notice, host.firstChild);
  }

  document.addEventListener("medicare:ready", function () {
    /* Components are in the DOM; re-run shared wiring that depends on them. */
    UI.initAccordions(document);
    if (window.MediCareNavigation) {
      window.MediCareNavigation.init();
    }
    if (window.MediCareForms) {
      window.MediCareForms.initAll(document);
    }
    initPage();
  });

  window.addEventListener("error", function (event) {
    if (event && event.message) {
      reportError(event.error || event.message, "runtime");
    }
  });

  window.addEventListener("unhandledrejection", function (event) {
    reportError(event.reason, "promise");
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.MediCareApp = {
    version: "1.0.0",
    page: function () {
      return document.body.dataset.page || "home";
    },
    refreshServices: initServicesDirectory
  };
})(window, document);
