/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/supplier-directory.js
 *
 * B2B directories for fictional pharmaceutical manufacturers and fictional API /
 * raw-material suppliers, including their detail pages. Nothing in this module
 * implies qualification, certification, approval or a real commercial
 * relationship, and no manufacturing or handling instructions are provided.
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

  function renderManufacturerCard(company) {
    var frag = UI.cloneTemplate("manufacturer-card");
    if (!frag) {
      return null;
    }
    UI.fillTemplate(frag, {
      name: company.name,
      country: company.country,
      founded: String(company.founded) + " (illustrative)",
      categories: "Sample categories: " + company.categories.join(", "),
      image: UI.assetUrl(company.image),
      imageAlt: "Illustration representing " + company.name + ", a fictional manufacturing profile.",
      link: UI.pageUrl("manufacturer-details.html") + "?id=" + encodeURIComponent(company.id),
      linkLabel: "Company profile",
      inquiryLink: UI.pageUrl("contact.html") + "?topic=manufacturing&company=" + encodeURIComponent(company.id)
    });

    var badges = UI.slot(frag, "badges");
    badges.appendChild(UI.demoFlag("Fictional company"));
    var tags = UI.slot(frag, "tags");
    company.categories.forEach(function (category) {
      tags.appendChild(UI.el("li", { className: "badge badge--neutral", text: category }));
    });

    return frag.querySelector("article") || frag;
  }

  function renderSupplierCard(company) {
    var frag = UI.cloneTemplate("supplier-card");
    if (!frag) {
      return null;
    }
    UI.fillTemplate(frag, {
      name: company.name,
      country: company.country,
      materialCount: company.materials.length + " sample material record(s)",
      categories: "Sample categories: " + company.categories.join(", "),
      image: UI.assetUrl(company.image),
      imageAlt: "Illustration representing " + company.name + ", a fictional raw material supplier profile.",
      link: UI.pageUrl("supplier-details.html") + "?id=" + encodeURIComponent(company.id),
      linkLabel: "Supplier profile",
      inquiryLink: UI.pageUrl("contact.html") + "?topic=supply&supplier=" + encodeURIComponent(company.id)
    });

    var badges = UI.slot(frag, "badges");
    badges.appendChild(UI.demoFlag("Fictional supplier"));
    badges.appendChild(UI.el("span", { className: "badge badge--warning", text: "Not a qualified supplier" }));

    var tags = UI.slot(frag, "tags");
    company.categories.forEach(function (category) {
      tags.appendChild(UI.el("li", { className: "badge badge--neutral", text: category }));
    });

    return frag.querySelector("article") || frag;
  }

  function createDirectory(config) {
    var resultsRoot = UI.qs(config.resultsSelector);
    if (!resultsRoot) {
      return;
    }
    var filterHost = UI.qs(config.filterSelector);
    var paginationHost = UI.qs(config.paginationSelector);
    var state = { page: 1, search: "", sort: "name-asc", filters: {} };

    var panel = UI.createFilterPanel({
      idPrefix: config.idPrefix,
      panelTitle: config.panelTitle,
      searchLabel: config.searchLabel,
      searchPlaceholder: config.searchPlaceholder,
      filters: config.filters,
      sortOptions: [
        { value: "name-asc", label: "Name (A–Z)" },
        { value: "founded-asc", label: "Illustrative founding year (oldest first)" },
        { value: "founded-desc", label: "Illustrative founding year (newest first)" },
        { value: "country", label: "Sample origin (A–Z)" }
      ],
      onChange: function (values) {
        state.search = values.search;
        state.sort = values.sort;
        state.filters = values;
        state.page = 1;
        update();
      }
    });
    if (filterHost) {
      filterHost.textContent = "";
      filterHost.appendChild(panel.element);
    }

    function apply() {
      var filtered = config.all().filter(function (item) {
        return config.matches(item, state);
      });
      var copy = filtered.slice();
      if (state.sort === "founded-asc") {
        copy.sort(function (a, b) {
          return a.founded - b.founded;
        });
      } else if (state.sort === "founded-desc") {
        copy.sort(function (a, b) {
          return b.founded - a.founded;
        });
      } else if (state.sort === "country") {
        copy.sort(function (a, b) {
          return a.country.localeCompare(b.country) || a.name.localeCompare(b.name);
        });
      } else {
        copy.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });
      }
      return copy;
    }

    function update() {
      var sorted = apply();
      var totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
      if (state.page > totalPages) {
        state.page = totalPages;
      }
      var start = (state.page - 1) * PAGE_SIZE;

      panel.setCount(sorted.length, config.all().length, config.noun);
      UI.renderCollection(resultsRoot, sorted.slice(start, start + PAGE_SIZE), config.renderItem, config.empty);

      UI.renderPagination(paginationHost, {
        page: state.page,
        totalPages: totalPages,
        label: config.paginationLabel,
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

  function initManufacturerDirectory() {
    if (initialized.manufacturers === true) {
      return;
    }
    initialized.manufacturers = true;

    createDirectory({
      resultsSelector: "[data-manufacturer-results]",
      filterSelector: "[data-manufacturer-filters]",
      paginationSelector: "[data-manufacturer-pagination]",
      idPrefix: "manufacturer-filter",
      noun: "fictional manufacturer records",
      panelTitle: "Filter manufacturers",
      searchLabel: "Search manufacturers",
      searchPlaceholder: "For example: capsules, sterile, supplements",
      paginationLabel: "Manufacturer results pagination",
      all: function () {
        return DATA.manufacturers;
      },
      filters: [
        {
          key: "category",
          label: "Product category",
          options: (function () {
            var seen = {};
            var list = [];
            DATA.manufacturers.forEach(function (company) {
              company.categories.forEach(function (category) {
                if (!seen[category]) {
                  seen[category] = true;
                  list.push(category);
                }
              });
            });
            return list.sort();
          })(),
          allLabel: "All product categories"
        },
        {
          key: "capability",
          label: "Capability",
          options: (function () {
            var seen = {};
            var list = [];
            DATA.manufacturers.forEach(function (company) {
              company.capabilities.forEach(function (capability) {
                var label = capability.replace(/\s*\(.*\)\s*$/, "");
                if (!seen[label]) {
                  seen[label] = true;
                  list.push(label);
                }
              });
            });
            return list.sort();
          })(),
          allLabel: "All capabilities"
        }
      ],
      matches: function (company, state) {
        if (state.search) {
          var haystack = (
            company.name +
            " " +
            company.country +
            " " +
            company.about +
            " " +
            company.categories.join(" ") +
            " " +
            company.capabilities.join(" ") +
            " " +
            company.productPortfolio.join(" ")
          ).toLowerCase();
          if (haystack.indexOf(state.search) === -1) {
            return false;
          }
        }
        if (state.filters.category && company.categories.indexOf(state.filters.category) === -1) {
          return false;
        }
        if (state.filters.capability) {
          var hasCapability = company.capabilities.some(function (capability) {
            return capability.indexOf(state.filters.capability) === 0;
          });
          if (!hasCapability) {
            return false;
          }
        }
        return true;
      },
      renderItem: renderManufacturerCard,
      empty: {
        title: "No fictional manufacturers match your search",
        text: "Try another category or capability keyword. No company listed here is certified, approved or verified in any way.",
        actionLabel: "Reset the manufacturer directory",
        actionHref: UI.pageUrl("pharmaceutical-manufacturers.html")
      }
    });
  }

  function initSupplierDirectory() {
    if (initialized.suppliers === true) {
      return;
    }
    initialized.suppliers = true;

    createDirectory({
      resultsSelector: "[data-supplier-results]",
      filterSelector: "[data-supplier-filters]",
      paginationSelector: "[data-supplier-pagination]",
      idPrefix: "supplier-filter",
      noun: "fictional supplier records",
      panelTitle: "Filter suppliers",
      searchLabel: "Search suppliers and materials",
      searchPlaceholder: "For example: excipients, reagents, packaging",
      paginationLabel: "Supplier results pagination",
      all: function () {
        return DATA.suppliers;
      },
      filters: [
        {
          key: "category",
          label: "Material category",
          options: DATA.uniqueValues(
            DATA.suppliers.reduce(function (all, supplier) {
              return all.concat(
                supplier.categories.map(function (category) {
                  return { category: category };
                })
              );
            }, []),
            "category"
          ),
          allLabel: "All material categories"
        },
        {
          key: "docs",
          label: "Documentation indicator",
          options: ["Documentation indicator available", "Indicator not recorded"],
          allLabel: "Any documentation status"
        }
      ],
      matches: function (company, state) {
        if (state.search) {
          var materialText = company.materials
            .map(function (material) {
              return material.name + " " + material.grade + " " + material.packaging;
            })
            .join(" ");
          var haystack = (
            company.name +
            " " +
            company.country +
            " " +
            company.categories.join(" ") +
            " " +
            materialText
          ).toLowerCase();
          if (haystack.indexOf(state.search) === -1) {
            return false;
          }
        }
        if (state.filters.category && company.categories.indexOf(state.filters.category) === -1) {
          return false;
        }
        if (state.filters.docs === "Documentation indicator available" && !company.documentation.length) {
          return false;
        }
        if (state.filters.docs === "Indicator not recorded" && company.documentation.length) {
          return false;
        }
        return true;
      },
      renderItem: renderSupplierCard,
      empty: {
        title: "No fictional suppliers match your search",
        text: "Try another material category or keyword. Supplier records are illustrative and no qualification is implied.",
        actionLabel: "Reset the supplier directory",
        actionHref: UI.pageUrl("api-suppliers.html")
      }
    });
  }

  function documentList(items, host) {
    var list = UI.el("ul", { className: "doc-list" });
    items.forEach(function (entry) {
      var item = UI.el("li", { className: "doc-list__item" });
      item.appendChild(UI.icon("file", "doc-list__icon"));
      var body = UI.el("div");
      body.appendChild(UI.el("span", { className: "doc-list__title", text: entry.title }));
      body.appendChild(UI.el("p", { className: "doc-list__meta", text: entry.meta }));
      item.appendChild(body);
      list.appendChild(item);
    });
    host.appendChild(list);
  }

  function initManufacturerDetail() {
    var scope = UI.qs('[data-detail="manufacturer"]');
    if (!scope || scope.dataset.detailInit === "true") {
      return;
    }
    scope.dataset.detailInit = "true";

    var company = DATA.manufacturerById(UI.getParam("id"));
    if (!company) {
      UI.renderNotFound(scope, {
        title: "That fictional manufacturer profile was not found",
        text: "The company identifier is not in the demonstration dataset. Browse the directory to view a sample profile.",
        actionLabel: "Back to the manufacturer directory",
        actionHref: UI.pageUrl("pharmaceutical-manufacturers.html")
      });
      return;
    }

    UI.setPageTitle(company.name + " — fictional manufacturer profile");
    UI.setBreadcrumbCurrent(company.name);

    UI.fillTemplate(scope, {
      name: company.name,
      country: company.country,
      founded: String(company.founded) + " (illustrative)",
      about: company.about,
      image: UI.assetUrl(company.image),
      imageAlt: "Illustration representing " + company.name + ", a fictional manufacturing profile.",
      inquiryLink: "#business-inquiry"
    });

    var badges = UI.slot(scope, "badges");
    badges.appendChild(UI.demoFlag("Fictional company"));
    badges.appendChild(UI.el("span", { className: "badge badge--warning", text: "No certification claimed" }));

    var capabilitySlot = UI.slot(scope, "capabilities");
    var capabilityList = UI.el("ul", { className: "link-list" });
    company.capabilities.forEach(function (capability) {
      capabilityList.appendChild(UI.el("li", { text: capability }));
    });
    capabilitySlot.appendChild(capabilityList);

    var portfolioSlot = UI.slot(scope, "portfolio");
    var portfolioList = UI.el("ul", { className: "tag-list" });
    company.productPortfolio.forEach(function (product) {
      portfolioList.appendChild(UI.el("li", { className: "badge badge--neutral", text: product }));
    });
    portfolioSlot.appendChild(portfolioList);

    var docsSlot = UI.slot(scope, "documentation");
    documentList(company.documentation, docsSlot);

    var relatedSlot = UI.slot(scope, "supplierLink");
    relatedSlot.appendChild(
      UI.el("p", {
        className: "card__text",
        text:
          "Raw-material sourcing is demonstrated separately in the fictional API and excipient supplier directory."
      })
    );
    relatedSlot.appendChild(
      UI.el("a", {
        className: "btn btn--secondary btn--sm",
        text: "Open the API supplier directory",
        attrs: { href: UI.pageUrl("api-suppliers.html") }
      })
    );
  }

  function initSupplierDetail() {
    var scope = UI.qs('[data-detail="supplier"]');
    if (!scope || scope.dataset.detailInit === "true") {
      return;
    }
    scope.dataset.detailInit = "true";

    var company = DATA.supplierById(UI.getParam("id"));
    if (!company) {
      UI.renderNotFound(scope, {
        title: "That fictional supplier profile was not found",
        text: "The supplier identifier is not in the demonstration dataset. Browse the directory to view a sample profile.",
        actionLabel: "Back to the supplier directory",
        actionHref: UI.pageUrl("api-suppliers.html")
      });
      return;
    }

    UI.setPageTitle(company.name + " — fictional supplier profile");
    UI.setBreadcrumbCurrent(company.name);

    UI.fillTemplate(scope, {
      name: company.name,
      country: company.country,
      founded: String(company.founded) + " (illustrative)",
      about: company.about,
      image: UI.assetUrl(company.image),
      imageAlt: "Illustration representing " + company.name + ", a fictional raw material supplier profile.",
      inquiryLink: "#business-inquiry"
    });

    var badges = UI.slot(scope, "badges");
    badges.appendChild(UI.demoFlag("Fictional supplier"));
    badges.appendChild(UI.el("span", { className: "badge badge--warning", text: "Not a qualified supplier" }));

    var materialSlot = UI.slot(scope, "materials");
    company.materials.forEach(function (material) {
      var wrap = UI.el("div", { className: "content-block" });
      wrap.appendChild(UI.el("h3", { className: "content-block__title", text: material.name }));
      var table = UI.el("table", { className: "data-table spec-table" });
      table.appendChild(
        UI.el("caption", { text: "Illustrative specification record — sample data only" })
      );
      var tbody = UI.el("tbody");
      [
        ["Illustrative grade", material.grade],
        ["CAS reference", material.cas],
        ["Sample packaging", material.packaging],
        ["Storage note", material.storage]
      ].forEach(function (pair) {
        var row = UI.el("tr");
        row.appendChild(UI.el("th", { text: pair[0], attrs: { scope: "row" } }));
        row.appendChild(UI.el("td", { text: pair[1] }));
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      wrap.appendChild(UI.el("div", { className: "table-wrap", children: [table] }));
      materialSlot.appendChild(wrap);
    });

    var docsSlot = UI.slot(scope, "documentation");
    documentList(company.documentation, docsSlot);
  }

  window.MediCareSuppliers = {
    initManufacturerDirectory: initManufacturerDirectory,
    initSupplierDirectory: initSupplierDirectory,
    initManufacturerDetail: initManufacturerDetail,
    initSupplierDetail: initSupplierDetail,
    renderManufacturerCard: renderManufacturerCard,
    renderSupplierCard: renderSupplierCard
  };
})(window, document);
