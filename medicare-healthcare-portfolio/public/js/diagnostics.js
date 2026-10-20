/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/diagnostics.js
 *
 * Diagnostic test directory, test detail pages and the simulated report-tracking
 * lookup. Report statuses are fixed fictional samples: no patient-identifiable
 * information is used and nothing is presented as a genuine medical record.
 */
(function (window, document) {
  "use strict";

  var UI = window.MediCareUI;
  var DATA = window.MediCareData;
  if (!UI || !DATA) {
    return;
  }

  var PAGE_SIZE = 6;
  var initialized = {};

  function testImageAlt(test) {
    return "Illustration representing the fictional diagnostic test entry " + test.name + ".";
  }

  function renderTestCard(test) {
    var frag = UI.cloneTemplate("diagnostic-test-card");
    if (!frag) {
      return null;
    }
    var lab = DATA.labById(test.labId);

    UI.fillTemplate(frag, {
      name: test.name,
      category: test.category,
      lab: lab ? lab.name : "Laboratory not recorded (demo)",
      turnaround: test.turnaround,
      preparation: "Preparation note: " + test.preparation,
      price: UI.formatBDT(test.price),
      image: UI.assetUrl(test.image),
      imageAlt: testImageAlt(test),
      link: UI.pageUrl("test-details.html") + "?id=" + encodeURIComponent(test.id),
      linkLabel: "Test details",
      requestLink: UI.pageUrl("appointments.html") + "?test=" + encodeURIComponent(test.id)
    });

    var badges = UI.slot(frag, "badges");
    badges.appendChild(UI.el("li", { className: "badge badge--neutral", text: test.category }));
    badges.appendChild(UI.el("li", { className: "badge badge--warning", text: "Illustrative price" }));

    return frag.querySelector("article") || frag;
  }

  function sortTests(list, sort) {
    var copy = list.slice();
    if (sort === "price-asc") {
      copy.sort(function (a, b) {
        return a.price - b.price;
      });
    } else if (sort === "price-desc") {
      copy.sort(function (a, b) {
        return b.price - a.price;
      });
    } else if (sort === "category") {
      copy.sort(function (a, b) {
        return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      });
    } else {
      copy.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
    return copy;
  }

  function initDirectory() {
    if (initialized.directory === true) {
      return;
    }
    var resultsRoot = UI.qs("[data-diagnostics-results]");
    if (!resultsRoot) {
      return;
    }
    initialized.directory = true;

    var filterHost = UI.qs("[data-diagnostics-filters]");
    var paginationHost = UI.qs("[data-diagnostics-pagination]");
    var state = { page: 1, search: "", sort: "name-asc", filters: {} };

    var panel = UI.createFilterPanel({
      idPrefix: "diagnostics-filter",
      panelTitle: "Filter diagnostic tests",
      searchLabel: "Search tests",
      searchPlaceholder: "For example: glucose, ultrasound, thyroid",
      filters: [
        {
          key: "category",
          label: "Test category",
          options: DATA.uniqueValues(DATA.diagnosticTests, "category"),
          allLabel: "All test categories"
        },
        {
          key: "lab",
          label: "Sample laboratory",
          options: DATA.laboratories.map(function (lab) {
            return lab.id;
          }),
          allLabel: "All laboratories"
        },
        {
          key: "prep",
          label: "Preparation",
          options: ["Fasting may apply", "No fasting recorded"],
          allLabel: "Any preparation"
        }
      ],
      sortOptions: [
        { value: "name-asc", label: "Test name (A–Z)" },
        { value: "category", label: "Category (A–Z)" },
        { value: "price-asc", label: "Illustrative price (low to high)" },
        { value: "price-desc", label: "Illustrative price (high to low)" }
      ],
      onChange: function (values) {
        state.search = values.search;
        state.sort = values.sort;
        state.filters = values;
        state.page = 1;
        update();
      }
    });

    /* The laboratory select lists ids; label the options with real names. */
    var labSelect = panel.element.querySelector('[data-filter="lab"]');
    if (labSelect) {
      labSelect.textContent = "";
      labSelect.appendChild(UI.el("option", { text: "All laboratories", attrs: { value: "" } }));
      DATA.laboratories.forEach(function (lab) {
        labSelect.appendChild(UI.el("option", { text: lab.name, attrs: { value: lab.id } }));
      });
    }

    if (filterHost) {
      filterHost.textContent = "";
      filterHost.appendChild(panel.element);
    }

    function matches(test) {
      if (state.search) {
        var haystack = (
          test.name + " " + test.category + " " + test.description + " " + test.preparation
        ).toLowerCase();
        if (haystack.indexOf(state.search) === -1) {
          return false;
        }
      }
      if (state.filters.category && test.category !== state.filters.category) {
        return false;
      }
      if (state.filters.lab && test.labId !== state.filters.lab) {
        return false;
      }
      var fastingApplies = test.preparation.toLowerCase().indexOf("fasting") !== -1;
      if (state.filters.prep === "Fasting may apply" && !fastingApplies) {
        return false;
      }
      if (state.filters.prep === "No fasting recorded" && fastingApplies) {
        return false;
      }
      return true;
    }

    function update() {
      var filtered = sortTests(DATA.diagnosticTests.filter(matches), state.sort);
      var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (state.page > totalPages) {
        state.page = totalPages;
      }
      var start = (state.page - 1) * PAGE_SIZE;

      panel.setCount(filtered.length, DATA.diagnosticTests.length, "fictional test entries");
      UI.renderCollection(resultsRoot, filtered.slice(start, start + PAGE_SIZE), renderTestCard, {
        title: "No diagnostic tests match your search",
        text: "Try another keyword, category or preparation filter. All test records, prices and turnaround times are illustrative.",
        actionLabel: "Reset the test directory",
        actionHref: UI.pageUrl("diagnostics.html")
      });

      UI.renderPagination(paginationHost, {
        page: state.page,
        totalPages: totalPages,
        label: "Diagnostic test results pagination",
        onPage: function (requested) {
          state.page = requested;
          update();
          UI.focusElement(resultsRoot);
          UI.announce("Showing page " + requested + " of " + totalPages + ".");
        }
      });
    }

    update();
  }

  function initPreview() {
    var root = UI.qs("[data-diagnostics-preview]");
    if (!root || root.dataset.previewInit === "true") {
      return;
    }
    root.dataset.previewInit = "true";
    UI.renderCollection(root, DATA.diagnosticTests.slice(0, 3), renderTestCard, {
      title: "No demonstration tests available",
      text: "The fictional diagnostics dataset could not be displayed."
    });
  }

  function initDetail() {
    var scope = UI.qs('[data-detail="test"]');
    if (!scope || scope.dataset.detailInit === "true") {
      return;
    }
    scope.dataset.detailInit = "true";

    var test = DATA.testById(UI.getParam("id"));
    if (!test) {
      UI.renderNotFound(scope, {
        title: "That demonstration test was not found",
        text: "The test identifier is not in the fictional diagnostics dataset. Browse the directory to choose a sample test.",
        actionLabel: "Back to the test directory",
        actionHref: UI.pageUrl("diagnostics.html")
      });
      return;
    }

    UI.setPageTitle(test.name + " — fictional diagnostic test entry");
    UI.setBreadcrumbCurrent(test.name);

    var lab = DATA.labById(test.labId);

    UI.fillTemplate(scope, {
      name: test.name,
      category: test.category,
      lab: lab ? lab.name : "Laboratory not recorded (demo)",
      labCity: lab ? lab.city : "—",
      labTurnaround: lab ? lab.turnaround : "—",
      price: UI.formatBDT(test.price),
      turnaround: test.turnaround,
      preparation: test.preparation,
      description: test.description,
      image: UI.assetUrl(test.image),
      imageAlt: testImageAlt(test),
      requestLink: UI.pageUrl("appointments.html") + "?test=" + encodeURIComponent(test.id)
    });

    var badges = UI.slot(scope, "badges");
    badges.appendChild(UI.el("li", { className: "badge badge--neutral", text: test.category }));
    badges.appendChild(UI.el("li", { className: "badge badge--warning", text: "Illustrative price in BDT" }));

    var labSlot = UI.slot(scope, "labServices");
    if (lab) {
      var services = UI.el("ul", { className: "tag-list" });
      lab.services.forEach(function (service) {
        services.appendChild(UI.el("li", { className: "badge badge--neutral", text: service }));
      });
      labSlot.appendChild(services);
    } else {
      labSlot.appendChild(UI.el("p", { className: "card__text", text: "No sample laboratory association recorded." }));
    }

    var relatedSlot = UI.slot(scope, "related");
    var related = DATA.diagnosticTests
      .filter(function (item) {
        return item.id !== test.id && item.category === test.category;
      })
      .slice(0, 3);
    var grid = UI.el("ul", { className: "card-grid" });
    UI.renderCollection(grid, related, renderTestCard, {
      title: "No related demonstration tests",
      text: "No other sample tests share this category."
    });
    relatedSlot.appendChild(grid);
  }

  /* ---------------------------------------------------------------------- */
  /* Simulated report tracking                                              */
  /* ---------------------------------------------------------------------- */

  var TRACKING_STAGES = [
    "Request Registered — Demo",
    "Sample Collection Pending — Demo",
    "Sample Received — Demo",
    "Processing — Simulated",
    "Report Ready — Simulated"
  ];

  function renderReport(report, host) {
    host.textContent = "";

    var card = UI.el("article", { className: "tracking-panel" });
    var header = UI.el("div", { className: "results-toolbar" });
    var heading = UI.el("div");
    heading.appendChild(UI.el("h3", { className: "card__title", text: report.id }));
    heading.appendChild(
      UI.el("p", {
        className: "card__text",
        text: "Fictional demonstration report record. No real patient, sample or result is represented."
      })
    );
    header.appendChild(heading);
    header.appendChild(UI.statusBadge(report.status));
    card.appendChild(header);

    var test = DATA.testById(report.testId);
    var lab = DATA.labById(report.labId);

    var facts = UI.el("dl", { className: "appointment-card__meta mt-6" });
    [
      ["Sample laboratory", lab ? lab.name : "Not recorded"],
      ["Test name", test ? test.name : "Not recorded"],
      ["Sample collection date", report.collectedOn],
      ["Illustrative expected availability", report.expectedOn],
      ["Sample patient reference", report.patientRef + " (non-identifiable demo label)"]
    ].forEach(function (pair) {
      var row = UI.el("div", { className: "card__meta-row" });
      row.appendChild(UI.el("dt", { className: "card__meta-term", text: pair[0] }));
      row.appendChild(UI.el("dd", { className: "card__meta-value", text: pair[1] }));
      facts.appendChild(row);
    });
    card.appendChild(facts);

    var timelineLabel = UI.el("h4", { className: "content-block__title mt-8", text: "Simulated processing stages" });
    card.appendChild(timelineLabel);

    var currentIndex = TRACKING_STAGES.indexOf(report.status);
    var timeline = UI.el("ol", { className: "timeline" });
    TRACKING_STAGES.forEach(function (stage, index) {
      var state = index < currentIndex ? "complete" : index === currentIndex ? "current" : "pending";
      var item = UI.el("li", { className: "timeline__item timeline__item--" + state });
      var marker = UI.el("span", { className: "timeline__marker" });
      if (state === "complete") {
        marker.appendChild(UI.icon("check", "timeline__check"));
      }
      item.appendChild(marker);
      item.appendChild(UI.el("h5", { className: "timeline__title", text: stage }));
      item.appendChild(
        UI.el("p", {
          className: "timeline__meta",
          text:
            state === "complete"
              ? "Illustrative stage recorded as complete in this simulation."
              : state === "current"
              ? "Current simulated stage for this sample record."
              : "Not reached in this simulation."
        })
      );
      timeline.appendChild(item);
    });
    card.appendChild(timeline);

    card.appendChild(
      UI.el("div", {
        className: "alert alert--info mt-8",
        attrs: { role: "note" }
      })
    );
    var note = card.lastElementChild;
    note.appendChild(UI.icon("info", "alert__icon"));
    var noteBody = UI.el("div", { className: "alert__body" });
    noteBody.appendChild(
      UI.el("p", {
        className: "text-small",
        text:
          "This is a fixed fictional status demonstration. No laboratory has been contacted, no sample exists and no clinical result is shown. Never rely on demonstration data for medical decisions."
      })
    );
    note.appendChild(noteBody);

    host.appendChild(card);
    UI.focusElement(card);
    UI.announce("Simulated report status: " + report.status + " for record " + report.id + ".");
  }

  function initReportTracking() {
    var form = UI.qs("[data-report-form]");
    var host = UI.qs("[data-report-result]");
    var input = UI.qs("[data-report-input]");
    if (!form || !host || !input || form.dataset.detailInit === "true") {
      return;
    }
    form.dataset.detailInit = "true";
    form.setAttribute("novalidate", "novalidate");

    var hint = UI.qs("[data-report-hint]");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = (input.value || "").trim().toUpperCase();

      if (!value) {
        host.textContent = "";
        host.appendChild(
          UI.alertBox({
            variant: "error",
            title: "Enter a demonstration report ID",
            text: "Use one of the sample IDs listed on this page, for example MCR-2401-0001."
          })
        );
        UI.focusElement(host);
        input.setAttribute("aria-invalid", "true");
        UI.announce("Enter a demonstration report ID.");
        return;
      }

      input.removeAttribute("aria-invalid");
      var report = DATA.reportById(value);

      if (!report) {
        renderReport(
          {
            id: value,
            patientRef: "Not found",
            testId: "",
            labId: "",
            collectedOn: "—",
            expectedOn: "—",
            status: "ID Not Recognised"
          },
          host
        );
        return;
      }

      renderReport(report, host);
    });

    var sampleLinks = UI.qsa("[data-report-sample]");
    sampleLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        input.value = link.getAttribute("data-report-sample");
        if (hint) {
          hint.textContent = "Loaded sample ID " + input.value + " into the lookup field.";
        }
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      });
    });
  }

  window.MediCareDiagnostics = {
    initDirectory: initDirectory,
    initPreview: initPreview,
    initDetail: initDetail,
    initReportTracking: initReportTracking,
    renderTestCard: renderTestCard
  };
})(window, document);
