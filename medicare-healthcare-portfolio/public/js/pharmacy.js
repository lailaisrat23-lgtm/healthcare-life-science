/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/pharmacy.js
 *
 * Static pharmacy catalogue: category/manufacturer filtering, search, product
 * detail lookup and a local cart preview. The cart exists only in memory for the
 * lifetime of the page — nothing is stored, transmitted or purchased.
 */
(function (window, document) {
  "use strict";

  var UI = window.MediCareUI;
  var DATA = window.MediCareData;
  if (!UI || !DATA) {
    return;
  }

  var PAGE_SIZE = 6;
  var cart = [];
  var cartBound = false;
  var initialized = {};

  function productImageAlt(product) {
    return "Stock photograph representing the fictional demonstration product " + product.name + ".";
  }

  function renderMedicineCard(product) {
    var frag = UI.cloneTemplate("medicine-card");
    if (!frag) {
      return null;
    }

    UI.fillTemplate(frag, {
      name: product.name,
      category: product.category,
      generic: "Sample generic: " + product.generic,
      manufacturer: product.manufacturer,
      packaging: product.packaging,
      price: UI.formatBDT(product.price),
      unit: product.unit,
      image: UI.assetUrl(product.image),
      imageAlt: productImageAlt(product),
      cartId: product.id,
      link: UI.pageUrl("medicine-details.html") + "?id=" + encodeURIComponent(product.id),
      linkLabel: "Product details"
    });

    var badges = UI.slot(frag, "badges");
    badges.appendChild(UI.el("li", { className: "badge badge--neutral", text: product.category }));
    if (product.prescriptionRequired) {
      badges.appendChild(UI.el("li", { className: "badge badge--rx", text: "Rx — prescription required (demo label)" }));
    } else {
      badges.appendChild(UI.el("li", { className: "badge badge--success", text: "No prescription label in this demo" }));
    }

    return frag.querySelector("article") || frag;
  }

  function sortProducts(list, sort) {
    var copy = list.slice();
    if (sort === "price-asc") {
      copy.sort(function (a, b) {
        return a.price - b.price;
      });
    } else if (sort === "price-desc") {
      copy.sort(function (a, b) {
        return b.price - a.price;
      });
    } else if (sort === "manufacturer") {
      copy.sort(function (a, b) {
        return a.manufacturer.localeCompare(b.manufacturer) || a.name.localeCompare(b.name);
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
    var resultsRoot = UI.qs("[data-pharmacy-results]");
    if (!resultsRoot) {
      return;
    }
    initialized.directory = true;

    var filterHost = UI.qs("[data-pharmacy-filters]");
    var paginationHost = UI.qs("[data-pharmacy-pagination]");
    var state = { page: 1, search: "", sort: "name-asc", filters: {} };

    var panel = UI.createFilterPanel({
      idPrefix: "pharmacy-filter",
      panelTitle: "Filter products",
      searchLabel: "Search products",
      searchPlaceholder: "For example: paracetamol, vitamin, device",
      filters: [
        {
          key: "category",
          label: "Category",
          options: DATA.uniqueValues(DATA.medicines, "category"),
          allLabel: "All categories"
        },
        {
          key: "manufacturer",
          label: "Illustrative manufacturer",
          options: DATA.uniqueValues(DATA.medicines, "manufacturer"),
          allLabel: "All manufacturers"
        },
        {
          key: "rx",
          label: "Prescription label",
          options: ["Requires prescription label", "No prescription label"],
          allLabel: "Any prescription status"
        }
      ],
      sortOptions: [
        { value: "name-asc", label: "Name (A–Z)" },
        { value: "price-asc", label: "Illustrative price (low to high)" },
        { value: "price-desc", label: "Illustrative price (high to low)" },
        { value: "manufacturer", label: "Manufacturer (A–Z)" }
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

    function matches(product) {
      if (state.search) {
        var haystack = (
          product.name +
          " " +
          product.generic +
          " " +
          product.category +
          " " +
          product.manufacturer +
          " " +
          product.form
        ).toLowerCase();
        if (haystack.indexOf(state.search) === -1) {
          return false;
        }
      }
      if (state.filters.category && product.category !== state.filters.category) {
        return false;
      }
      if (state.filters.manufacturer && product.manufacturer !== state.filters.manufacturer) {
        return false;
      }
      if (state.filters.rx === "Requires prescription label" && !product.prescriptionRequired) {
        return false;
      }
      if (state.filters.rx === "No prescription label" && product.prescriptionRequired) {
        return false;
      }
      return true;
    }

    function update() {
      var filtered = sortProducts(DATA.medicines.filter(matches), state.sort);
      var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (state.page > totalPages) {
        state.page = totalPages;
      }
      var start = (state.page - 1) * PAGE_SIZE;

      panel.setCount(filtered.length, DATA.medicines.length, "fictional product records");
      UI.renderCollection(resultsRoot, filtered.slice(start, start + PAGE_SIZE), renderMedicineCard, {
        title: "No products match your search",
        text: "Try a different keyword, category or prescription filter. Every product in this catalogue is a fictional demonstration record.",
        actionLabel: "Reset the catalogue",
        actionHref: UI.pageUrl("pharmacy.html")
      });

      UI.renderPagination(paginationHost, {
        page: state.page,
        totalPages: totalPages,
        label: "Product results pagination",
        onPage: function (requested) {
          state.page = requested;
          update();
          UI.focusElement(resultsRoot);
          UI.announce("Showing page " + requested + " of " + totalPages + ".");
        }
      });
    }

    update();
    bindCart(resultsRoot);
  }

  /* ---------------------------------------------------------------------- */
  /* Local cart preview                                                     */
  /* ---------------------------------------------------------------------- */

  function cartTotals() {
    var count = 0;
    var total = 0;
    cart.forEach(function (line) {
      count += line.quantity;
      total += line.quantity * line.price;
    });
    return { count: count, total: total, lines: cart.length };
  }

  function renderCart() {
    var list = UI.qs("[data-cart-lines]");
    var summary = UI.qs("[data-cart-summary]");
    var countNode = UI.qs("[data-cart-count]");
    if (!list || !summary) {
      return;
    }

    var totals = cartTotals();
    list.textContent = "";
    summary.textContent = "";

    if (!cart.length) {
      var empty = UI.el("li");
      empty.appendChild(
        UI.el("p", {
          className: "card__text",
          text: "The cart preview is empty. Add a demonstration product to see how a local cart summary behaves."
        })
      );
      list.appendChild(empty);
    } else {
      cart.forEach(function (line) {
        var item = UI.el("li", { className: "cart-line" });
        var details = UI.el("span");
        details.appendChild(UI.el("span", { className: "cart-line__name", text: line.name }));
        details.appendChild(
          UI.el("span", {
            className: "cart-line__detail",
            text: line.quantity + " × " + UI.formatBDT(line.price) + (line.prescriptionRequired ? " · Rx demo label" : "")
          })
        );
        item.appendChild(details);
        item.appendChild(UI.el("span", { className: "cart-line__price", text: UI.formatBDT(line.quantity * line.price) }));

        var remove = UI.el("button", {
          className: "btn btn--ghost btn--sm",
          text: "Remove",
          attrs: { type: "button", "data-cart-remove": line.id }
        });
        remove.setAttribute("aria-label", "Remove " + line.name + " from the cart preview");
        item.appendChild(remove);
        list.appendChild(item);
      });
    }

    [["Items", String(totals.count)], ["Illustrative subtotal", UI.formatBDT(totals.total)]].forEach(function (pair) {
      var row = UI.el("p", { className: "cart-summary__row" });
      row.appendChild(UI.el("span", { text: pair[0] }));
      row.appendChild(UI.el("span", { className: "price", text: pair[1] }));
      summary.appendChild(row);
    });

    var totalRow = UI.el("p", { className: "cart-summary__row cart-summary__row--total" });
    totalRow.appendChild(UI.el("span", { text: "Demo total" }));
    totalRow.appendChild(UI.el("span", { text: UI.formatBDT(totals.total) }));
    summary.appendChild(totalRow);

    if (countNode) {
      countNode.textContent = totals.count === 1 ? "1 item" : totals.count + " items";
    }
  }

  function addToCart(id) {
    var product = DATA.medicineById(id);
    if (!product) {
      return;
    }
    var existing = null;
    cart.forEach(function (line) {
      if (line.id === id) {
        existing = line;
      }
    });
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        prescriptionRequired: product.prescriptionRequired,
        quantity: 1
      });
    }
    renderCart();
    UI.announce(product.name + " added to the local cart preview. Nothing has been ordered.");
  }

  function bindCart(root) {
    if (cartBound) {
      renderCart();
      return;
    }
    cartBound = true;

    document.addEventListener("click", function (event) {
      var add = event.target.closest("[data-add-to-cart]");
      if (add) {
        event.preventDefault();
        addToCart(add.getAttribute("data-cart-id"));
        return;
      }
      var remove = event.target.closest("[data-cart-remove]");
      if (remove) {
        event.preventDefault();
        var id = remove.getAttribute("data-cart-remove");
        cart = cart.filter(function (line) {
          return line.id !== id;
        });
        renderCart();
        UI.announce("Item removed from the local cart preview.");
        return;
      }
      var clear = event.target.closest("[data-cart-clear]");
      if (clear) {
        event.preventDefault();
        cart = [];
        renderCart();
        UI.announce("Cart preview cleared. No order was placed.");
      }
    });

    renderCart();
  }

  function initPreview() {
    var root = UI.qs("[data-pharmacy-preview]");
    if (!root || root.dataset.previewInit === "true") {
      return;
    }
    root.dataset.previewInit = "true";
    var picks = DATA.medicines.slice(0, 3);
    UI.renderCollection(root, picks, renderMedicineCard, {
      title: "No demonstration products available",
      text: "The fictional pharmacy dataset could not be displayed."
    });
    bindCart(root);
  }

  function initDetail() {
    var scope = UI.qs('[data-detail="medicine"]');
    if (!scope || scope.dataset.detailInit === "true") {
      return;
    }
    scope.dataset.detailInit = "true";

    var product = DATA.medicineById(UI.getParam("id"));
    if (!product) {
      UI.renderNotFound(scope, {
        title: "That demonstration product was not found",
        text: "The product identifier is not in the fictional catalogue. Browse the pharmacy demo to choose a sample product.",
        actionLabel: "Back to the pharmacy catalogue",
        actionHref: UI.pageUrl("pharmacy.html")
      });
      return;
    }

    UI.setPageTitle(product.name + " — fictional catalogue entry");
    UI.setBreadcrumbCurrent(product.name);

    UI.fillTemplate(scope, {
      name: product.name,
      category: product.category,
      generic: product.generic,
      manufacturer: product.manufacturer,
      form: product.form,
      packaging: product.packaging,
      price: UI.formatBDT(product.price),
      unit: product.unit,
      description: product.description,
      image: UI.assetUrl(product.image),
      imageAlt: productImageAlt(product),
      cartId: product.id
    });

    var badges = UI.slot(scope, "badges");
    var badgeItems = UI.fragment([
      UI.el("li", { className: "badge badge--neutral", text: product.category }),
      product.prescriptionRequired
        ? UI.el("li", { className: "badge badge--rx", text: "Rx — prescription required (demo label)" })
        : UI.el("li", { className: "badge badge--success", text: "No prescription label in this demo" })
    ]);
    badges.appendChild(badgeItems);

    var sidebarBadges = UI.slot(scope, "badgesSidebar");
    if (sidebarBadges !== badges) {
      sidebarBadges.appendChild(
        UI.fragment([
          UI.el("li", { className: "badge badge--neutral", text: product.category }),
          product.prescriptionRequired
            ? UI.el("li", { className: "badge badge--rx", text: "Prescription-required demo label" })
            : UI.el("li", { className: "badge badge--success", text: "No prescription label" })
        ])
      );
    }

    var warnings = UI.slot(scope, "warnings");
    var warningList = UI.el("ul", { className: "link-list" });
    product.warnings.forEach(function (warning) {
      warningList.appendChild(UI.el("li", { text: warning }));
    });
    warnings.appendChild(warningList);

    var related = UI.slot(scope, "related");
    var relatedProducts = product.relatedIds
      .map(function (id) {
        return DATA.medicineById(id);
      })
      .filter(Boolean);
    var grid = UI.el("ul", { className: "card-grid" });
    UI.renderCollection(grid, relatedProducts, renderMedicineCard, {
      title: "No related demonstration products",
      text: "This sample record has no related catalogue entries."
    });
    related.appendChild(grid);

    bindCart(scope);
  }

  window.MediCarePharmacy = {
    initDirectory: initDirectory,
    initPreview: initPreview,
    initDetail: initDetail,
    addToCart: addToCart,
    renderMedicineCard: renderMedicineCard,
    cartSummary: cartTotals
  };
})(window, document);
