/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/ui.js
 *
 * Shared DOM helpers, accessible status rendering, empty states, pagination and
 * disclosure widgets. Everything is exposed on a single namespace so no global
 * variables leak into `window`.
 */
(function (window, document) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /** Static, trusted icon paths (24x24 grid, stroked). */
  var ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    alert: '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    filter: '<path d="M3 5h18"/><path d="M7 12h10"/><path d="M10 19h4"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M5 3h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M3 11h18"/>',
    stethoscope: '<path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v3a4 4 0 0 0 8 0v-2"/><circle cx="18" cy="10" r="2"/>',
    pill: '<rect x="3" y="9" width="18" height="7" rx="3.5"/><path d="M12 9v7"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/>',
    factory: '<path d="M3 20h18"/><path d="M5 20V9l5 3V9l5 3V9l4 2v9"/><path d="M9 20v-4"/><path d="M15 20v-4"/>',
    truck: '<rect x="2" y="7" width="12" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 5.5a3.5 3.5 0 0 1 0 7"/><path d="M18 20a6 6 0 0 0-3-5.2"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h.01"/><path d="M15 8h.01"/><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 21v-4h4v4"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/>',
    package: '<path d="m12 3 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4"/><path d="M12 11v10"/>',
    bell: '<path d="M18 9a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7"/><path d="M10.5 20a2 2 0 0 0 3 0"/>',
    dashboard: '<rect x="3" y="3" width="7" height="8" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/>',
    heart: '<path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
    lock: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    inbox: '<path d="M4 13h4l1 3h6l1-3h4"/><path d="M4 13 7 4h10l3 9v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>'
  };

  /** Status metadata. `tone` maps onto the CSS `.status-badge--*` variants. */
  var STATUS_META = {
    "Request Draft": { tone: "draft", icon: "file" },
    "Request Received — Demo": { tone: "pending", icon: "inbox" },
    "Awaiting Confirmation — Demo": { tone: "pending", icon: "clock" },
    "Confirmed — Simulated": { tone: "confirmed", icon: "check" },
    "Completed — Simulated": { tone: "success", icon: "check" },
    "Cancelled — Simulated": { tone: "cancelled", icon: "x" },
    "Request Registered — Demo": { tone: "registered", icon: "file" },
    "Sample Collection Pending — Demo": { tone: "pending", icon: "clock" },
    "Sample Received — Demo": { tone: "info", icon: "inbox" },
    "Processing — Simulated": { tone: "progress", icon: "flask" },
    "Report Ready — Simulated": { tone: "ready", icon: "check" },
    "Not Found": { tone: "invalid", icon: "alert" },
    "ID Not Recognised": { tone: "invalid", icon: "alert" }
  };

  /**
   * Derive the project-root prefix from this application's own script URL.
   * index.html sits at the project root (`public/js/ui.js`), every other page
   * sits in `resources/views/frontend/` (`../../public/js/ui.js`). Deriving the
   * prefix here keeps every asset, component and internal link correct from any
   * nesting depth without per-page configuration.
   */
  function detectBasePrefix() {
    var scripts = qsa("script[src]");
    var marker = "public/js/";
    for (var i = 0; i < scripts.length; i += 1) {
      var src = scripts[i].getAttribute("src") || "";
      var index = src.indexOf(marker);
      if (index !== -1) {
        return src.slice(0, index);
      }
    }
    return "";
  }

  var BASE_PREFIX = detectBasePrefix();

  /** Resolve a path inside `public/assets/` (e.g. `images/hero/hero.jpg`). */
  function assetUrl(relativePath) {
    var clean = String(relativePath || "").replace(/^\//, "");
    if (/^(https?:)?\/\//.test(clean)) {
      return clean;
    }
    if (clean.indexOf("public/") === 0) {
      return BASE_PREFIX + clean;
    }
    if (clean.indexOf("images/") !== 0) {
      clean = "images/" + clean;
    }
    return BASE_PREFIX + "public/assets/" + clean;
  }

  /** Resolve a frontend page name (e.g. `doctors.html`). */
  function pageUrl(page) {
    var value = String(page || "");
    if (!value || value.charAt(0) === "#" || /^(https?:)?\/\//.test(value) || value.charAt(0) === "/") {
      return value;
    }
    if (value === "@home") {
      return BASE_PREFIX + "index.html";
    }
    if (!BASE_PREFIX) {
      return "resources/views/frontend/" + value;
    }
    return value;
  }

  /** Resolve a component partial name (e.g. `navbar`). */
  function componentUrl(name) {
    return BASE_PREFIX + "resources/views/components/" + String(name) + ".html";
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /** Escape a value for the rare template-string insertion path. */
  function escapeHtml(value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Build an element. Only trusted, developer-authored markup is ever assigned
   * through `options.html`; all user-influenced values go through `text`.
   */
  function el(tagName, options) {
    var node = document.createElement(tagName);
    var opts = options || {};
    var key;

    if (opts.className) {
      node.className = opts.className;
    }
    if (opts.text !== undefined) {
      node.textContent = String(opts.text);
    }
    if (opts.html) {
      node.innerHTML = opts.html;
    }
    if (opts.attrs) {
      for (key in opts.attrs) {
        if (Object.prototype.hasOwnProperty.call(opts.attrs, key)) {
          var value = opts.attrs[key];
          if (value === null || value === undefined || value === false) {
            continue;
          }
          node.setAttribute(key, String(value));
        }
      }
    }
    if (opts.children) {
      opts.children.forEach(function (child) {
        if (child) {
          node.appendChild(child);
        }
      });
    }
    return node;
  }

  function svgIcon(name, className) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.75");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    if (className) {
      svg.setAttribute("class", className);
    }
    svg.innerHTML = ICONS[name] || ICONS.info;
    return svg;
  }

  function formatBDT(amount) {
    var value = Number(amount);
    if (!isFinite(value)) {
      return "৳ —";
    }
    return "৳ " + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var context = this;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(context, args);
      }, wait || 200);
    };
  }

  function getParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch (error) {
      return null;
    }
  }

  /** Look up an accessible status badge element for a given status label. */
  function statusBadge(status) {
    var meta = STATUS_META[status] || { tone: "neutral", icon: "info" };
    var frag = cloneTemplate("status-badge");
    var badge;
    if (frag) {
      badge = frag.querySelector(".status-badge");
      fillTemplate(frag, { label: status });
      var iconHolder = badge.querySelector(".status-badge__icon");
      if (iconHolder && iconHolder.parentNode) {
        iconHolder.parentNode.replaceChild(svgIcon(meta.icon, "status-badge__icon"), iconHolder);
      }
    } else {
      badge = el("span", {
        className: "status-badge",
        attrs: { "data-status": status }
      });
      badge.appendChild(svgIcon(meta.icon, "status-badge__icon"));
      badge.appendChild(el("span", { className: "status-badge__label", text: status }));
    }
    badge.classList.add("status-badge--" + meta.tone);
    badge.setAttribute("data-status", status);
    return badge;
  }

  function demoFlag(text) {
    var flag = el("span", { className: "demo-flag" });
    flag.appendChild(svgIcon("shield", "demo-flag__icon"));
    flag.appendChild(el("span", { text: text || "Demo data" }));
    return flag;
  }

  function emptyState(options) {
    var opts = options || {};
    var frag = cloneTemplate("empty-state");
    var wrap;
    if (frag) {
      wrap = frag.querySelector(".empty-state");
      fillTemplate(frag, { title: opts.title || "No results found", text: opts.text || "" });
      if (!opts.text) {
        var textNode = wrap.querySelector(".empty-state__text");
        if (textNode) {
          textNode.remove();
        }
      }
      if (opts.actionLabel && opts.actionHref) {
        var actionHolder = slot(frag, "actions");
        actionHolder.appendChild(
          el("a", {
            className: "btn btn--secondary",
            text: opts.actionLabel,
            attrs: { href: opts.actionHref }
          })
        );
      } else {
        var actions = wrap.querySelector(".empty-state__actions");
        if (actions) {
          actions.remove();
        }
      }
    } else {
      wrap = el("div", { className: "empty-state", attrs: { role: "status" } });
      wrap.appendChild(svgIcon(opts.icon || "search", "empty-state__icon"));
      wrap.appendChild(el("h3", { className: "empty-state__title", text: opts.title || "No results found" }));
      if (opts.text) {
        wrap.appendChild(el("p", { className: "empty-state__text", text: opts.text }));
      }
      if (opts.actionLabel && opts.actionHref) {
        var fallbackActions = el("p", { className: "empty-state__actions" });
        fallbackActions.appendChild(
          el("a", { className: "btn btn--secondary", text: opts.actionLabel, attrs: { href: opts.actionHref } })
        );
        wrap.appendChild(fallbackActions);
      }
    }
    wrap.setAttribute("role", "status");
    return wrap;
  }

  function alertBox(options) {
    var opts = options || {};
    var variant = opts.variant || "info";
    var wrap = el("div", {
      className: "alert alert--" + variant,
      attrs: {
        role: variant === "error" ? "alert" : "status",
        "data-alert": variant
      }
    });
    wrap.appendChild(
      svgIcon(variant === "success" ? "check" : variant === "error" ? "alert" : "info", "alert__icon")
    );
    var body = el("div", { className: "alert__body" });
    if (opts.title) {
      body.appendChild(el("strong", { className: "alert__title", text: opts.title }));
    }
    if (opts.text) {
      body.appendChild(el("p", { text: opts.text }));
    }
    if (opts.items && opts.items.length) {
      var list = el("ul", { className: "link-list" });
      opts.items.forEach(function (item) {
        list.appendChild(el("li", { text: item }));
      });
      body.appendChild(list);
    }
    wrap.appendChild(body);
    return wrap;
  }

  /** Announce a message to assistive technology via a shared live region. */
  function announce(message) {
    var region = qs("#live-region");
    if (!region) {
      region = el("div", { attrs: { id: "live-region", "aria-live": "polite", "aria-atomic": "true" } });
      region.className = "sr-status";
      document.body.appendChild(region);
    }
    region.textContent = "";
    window.setTimeout(function () {
      region.textContent = message;
    }, 40);
  }

  function focusElement(node) {
    if (!node) {
      return;
    }
    if (!node.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(node.tagName)) {
      node.setAttribute("tabindex", "-1");
    }
    node.focus({ preventScroll: false });
  }

  /** Accessible disclosure/accordion behaviour for `[data-accordion]`. */
  function initAccordions(root) {
    qsa("[data-accordion]", root).forEach(function (accordion) {
      if (accordion.dataset.accordionBound === "true") {
        return;
      }
      accordion.dataset.accordionBound = "true";
      qsa(".accordion__trigger", accordion).forEach(function (trigger) {
        var panelId = trigger.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) {
          return;
        }
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        panel.hidden = !expanded;
      });

      accordion.addEventListener("click", function (event) {
        var trigger = event.target.closest(".accordion__trigger");
        if (!trigger || !accordion.contains(trigger)) {
          return;
        }
        var panelId = trigger.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) {
          return;
        }
        var isExpanded = trigger.getAttribute("aria-expanded") === "true";
        var single = accordion.dataset.accordion === "single";
        if (single && !isExpanded) {
          qsa(".accordion__trigger", accordion).forEach(function (other) {
            if (other === trigger) {
              return;
            }
            other.setAttribute("aria-expanded", "false");
            var otherPanelId = other.getAttribute("aria-controls");
            var otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
            if (otherPanel) {
              otherPanel.hidden = true;
            }
          });
        }
        trigger.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        panel.hidden = isExpanded;
      });
    });
  }

  /**
   * Render a pagination control into `target`.
   * `options.onPage(page)` is called with the requested page number.
   */
  function renderPagination(target, options) {
    if (!target) {
      return;
    }
    var opts = options || {};
    var totalPages = Math.max(1, opts.totalPages || 1);
    var current = Math.min(Math.max(1, opts.page || 1), totalPages);
    target.textContent = "";

    if (totalPages <= 1) {
      return;
    }

    var frag = cloneTemplate("pagination");
    var nav = frag ? frag.querySelector(".pagination") : null;
    if (!nav) {
      nav = el("nav", { className: "pagination" });
    }
    var list = nav.querySelector(".pagination__list") || el("ul", { className: "pagination__list" });
    nav.setAttribute("aria-label", opts.label || "Results pagination");

    function pageItem(page, label, accessibleLabel, disabled) {
      var item;
      var itemFrag = cloneTemplate("pagination-item");
      if (itemFrag) {
        item = itemFrag.querySelector("li");
        fillTemplate(itemFrag, { label: label, page: String(page) });
        if (accessibleLabel) {
          var button = itemFrag.querySelector("button");
          if (button) {
            button.setAttribute("aria-label", accessibleLabel);
          }
        }
      } else {
        item = el("li");
        item.appendChild(
          el("button", {
            className: "pagination__link",
            text: label,
            attrs: { type: "button", "data-page": page }
          })
        );
      }
      var control = item.querySelector("button") || item.firstElementChild;
      if (control) {
        control.setAttribute("data-page", String(page));
        if (disabled) {
          control.setAttribute("aria-disabled", "true");
          control.disabled = true;
        }
      }
      list.appendChild(item);
    }

    pageItem(current - 1, "Previous", "Previous page", current === 1);

    var start = Math.max(1, current - 2);
    var end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);

    for (var page = start; page <= end; page += 1) {
      pageItem(page, String(page), page === current ? "Page " + page + ", current page" : "Go to page " + page, false);
      var added = list.lastElementChild;
      var addedButton = added ? added.querySelector("button") : null;
      if (addedButton && page === current) {
        addedButton.setAttribute("aria-current", "page");
      }
    }

    pageItem(current + 1, "Next", "Next page", current === totalPages);

    if (!nav.parentNode) {
      nav.appendChild(list);
      target.appendChild(nav);
    } else {
      target.appendChild(nav);
    }

    nav.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-page]");
      if (!button || button.disabled) {
        return;
      }
      var requested = parseInt(button.getAttribute("data-page"), 10);
      if (!isNaN(requested) && requested >= 1 && requested <= totalPages && requested !== current) {
        opts.onPage(requested);
      }
    });
  }

  /**
   * Build a reusable search/sort/filter panel from the `search-filter`
   * component template. Returns `{ element, getValues, setCount }` so directory
   * modules only supply their own filter definitions.
   */
  function createFilterPanel(config) {
    var cfg = config || {};
    var prefix = cfg.idPrefix || "filter";
    var frag = cloneTemplate("search-filter");
    var panel = frag ? frag.querySelector("[data-filter-panel]") : null;

    if (!panel) {
      panel = el("form", {
        className: "filter-panel",
        attrs: { role: "search", "data-filter-panel": "true", novalidate: "novalidate" }
      });
      panel.appendChild(el("div", { className: "filter-panel__fields" }));
      panel.appendChild(el("div", { className: "filter-panel__foot" }));
    }

    if (frag) {
      fillTemplate(frag, {
        panelTitle: cfg.panelTitle || "Find and filter",
        searchLabel: cfg.searchLabel || "Search",
        searchPlaceholder: cfg.searchPlaceholder || "Search"
      });
    }

    var searchId = prefix + "-search";
    var searchInput = panel.querySelector('[data-filter="search"]');
    if (searchInput) {
      searchInput.id = searchId;
      var labelNode = panel.querySelector('label[for]');
      if (labelNode) {
        labelNode.setAttribute("for", searchId);
      }
      if (cfg.resultsId) {
        searchInput.setAttribute("aria-controls", cfg.resultsId);
      }
    }
    var filterSlot = panel.querySelector('[data-slot="filters"]') || panel;
    var controls = {};
    (cfg.filters || []).forEach(function (definition) {
      var group = el("div", { className: "form__group filter-field" });
      var id = prefix + "-" + definition.key;
      group.appendChild(el("label", { className: "form__label", text: definition.label, attrs: { for: id } }));
      var select = el("select", {
        className: "form__control",
        attrs: { id: id, "data-filter": definition.key }
      });
      setOptions(select, definition.options || [], definition.allLabel || "All");
      group.appendChild(select);
      filterSlot.appendChild(group);
      controls[definition.key] = select;
    });

    var sortSelect = panel.querySelector('[data-filter="sort"]');
    if (sortSelect && cfg.sortOptions) {
      setOptions(sortSelect, [], null);
      cfg.sortOptions.forEach(function (option) {
        sortSelect.appendChild(el("option", { text: option.label, attrs: { value: option.value } }));
      });
    }

    var countNode = panel.querySelector("[data-results-count]");

    /* Seed controls from a query string so directory links can deep-link
       straight into a filtered view (for example doctors.html?specialty=Cardiology). */
    if (cfg.initial) {
      if (searchInput && cfg.initial.search) {
        searchInput.value = cfg.initial.search;
      }
      Object.keys(controls).forEach(function (key) {
        if (cfg.initial[key]) {
          controls[key].value = cfg.initial[key];
        }
      });
    }

    function getValues() {
      var values = { search: "", sort: sortSelect ? sortSelect.value : "" };
      if (searchInput) {
        values.search = searchInput.value.trim().toLowerCase();
      }
      Object.keys(controls).forEach(function (key) {
        values[key] = controls[key].value;
      });
      return values;
    }

    function emit() {
      if (typeof cfg.onChange === "function") {
        cfg.onChange(getValues());
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", debounce(emit, 200));
    }
    Object.keys(controls).forEach(function (key) {
      controls[key].addEventListener("change", emit);
    });
    if (sortSelect) {
      sortSelect.addEventListener("change", emit);
    }

    var clearButton = panel.querySelector("[data-filter-clear]");
    if (clearButton) {
      clearButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (searchInput) {
          searchInput.value = "";
        }
        Object.keys(controls).forEach(function (key) {
          controls[key].value = "";
        });
        if (sortSelect && sortSelect.options.length) {
          sortSelect.selectedIndex = 0;
        }
        emit();
        if (searchInput) {
          searchInput.focus();
        }
      });
    }

    return {
      element: panel,
      getValues: getValues,
      isSearchForm: true,
      setCount: function (matched, total, noun) {
        if (!countNode) {
          return;
        }
        countNode.textContent = "";
        if (matched === 0) {
          countNode.appendChild(document.createTextNode("No matching " + (noun || "records")));
          return;
        }
        countNode.appendChild(el("strong", { text: String(matched) }));
        countNode.appendChild(
          document.createTextNode(
            " of " + total + " " + (noun || "records") + " shown"
          )
        );
      }
    };
  }

  function setOptions(select, values, placeholder) {
    select.textContent = "";
    if (placeholder) {
      select.appendChild(el("option", { text: placeholder, attrs: { value: "" } }));
    }
    values.forEach(function (value) {
      select.appendChild(el("option", { text: value, attrs: { value: value } }));
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Component templates                                                    */
  /* ---------------------------------------------------------------------- */

  /**
   * Clone a component `<template data-template="name">` injected by
   * components.js. Card, badge and pagination markup therefore lives in exactly
   * one place: `resources/views/components/`.
   */
  function cloneTemplate(name) {
    var template = document.querySelector('template[data-template="' + name + '"]');
    if (!template) {
      return null;
    }
    return template.content.cloneNode(true);
  }

  /**
   * Populate a cloned template fragment.
   *  - `[data-field="key"]` writes text (or appends a node when given a DOM node)
   *  - `[data-attr-<name>="key"]` writes the named attribute
   *  - `[data-slot="name"]` is emptied so the renderer can append rich content
   */
  function fillTemplate(root, data) {
    var values = data || {};
    qsa("[data-field]", root).forEach(function (node) {
      var key = node.getAttribute("data-field");
      if (!(key in values)) {
        return;
      }
      var value = values[key];
      if (value && value.nodeType === 1) {
        node.textContent = "";
        node.appendChild(value);
      } else {
        node.textContent = value === null || value === undefined ? "" : String(value);
      }
    });

    qsa("*", root).forEach(function (node) {
      var directives = [];
      Array.prototype.forEach.call(node.attributes, function (attribute) {
        if (attribute.name.indexOf("data-attr-") !== 0) {
          return;
        }
        directives.push(attribute.name);
        var attributeName = attribute.name.slice("data-attr-".length);
        var value = values[attribute.value];
        if (value === null || value === undefined || value === "") {
          return;
        }
        node.setAttribute(attributeName, String(value));
      });
      directives.forEach(function (name) {
        node.removeAttribute(name);
      });
    });

    qsa("[data-slot]", root).forEach(function (node) {
      node.textContent = "";
    });
    return root;
  }

  function slot(root, name) {
    return root.querySelector('[data-slot="' + name + '"]') || root;
  }

  function fragment(children) {
    var frag = document.createDocumentFragment();
    (children || []).forEach(function (child) {
      if (child) {
        frag.appendChild(child);
      }
    });
    return frag;
  }

  /* ---------------------------------------------------------------------- */
  /* Rendering helpers shared by every directory module                     */
  /* ---------------------------------------------------------------------- */

  /**
   * Render `items` into a results container as `<li>` children of the grid the
   * page already provides. Falls back to a shared empty state when nothing
   * matches, so every directory behaves identically.
   */
  function renderCollection(container, items, renderItem, emptyOptions) {
    if (!container) {
      return;
    }
    container.textContent = "";
    if (!items.length) {
      var wrapper = el("li", { className: "card-grid__empty" });
      wrapper.appendChild(emptyState(emptyOptions || {}));
      container.appendChild(wrapper);
      return;
    }
    items.forEach(function (item) {
      var node = renderItem(item);
      if (!node) {
        return;
      }
      if (node.tagName === "LI") {
        container.appendChild(node);
      } else {
        container.appendChild(el("li", { children: [node] }));
      }
    });
  }

  /**
   * Replace a detail region with an accessible "record not found" message.
   * Used when a query-string identifier does not match any demo record.
   */
  function renderNotFound(scope, options) {
    var opts = options || {};
    if (!scope) {
      return;
    }
    scope.textContent = "";
    scope.appendChild(
      alertBox({
        variant: "warning",
        title: opts.title || "Record not found",
        text: opts.text || "That demonstration record is not available."
      })
    );
    if (opts.actionLabel && opts.actionHref) {
      var actions = el("p", { className: "mt-6" });
      actions.appendChild(
        el("a", { className: "btn btn--secondary", text: opts.actionLabel, attrs: { href: opts.actionHref } })
      );
      scope.appendChild(actions);
    }
    focusElement(scope);
    announce(opts.title || "Record not found");
  }

  /** Update the trailing breadcrumb label after a detail record is resolved. */
  function setBreadcrumbCurrent(text) {
    var node = document.querySelector(".breadcrumb__current");
    if (node) {
      node.textContent = text;
    }
  }

  function setPageTitle(text) {
    document.title = text + " | MediCare Integrated Clinic & Telemedicine Platform";
  }

  function image(src, alt, className, options) {
    var opts = options || {};
    return el("img", {
      attrs: {
        src: src,
        alt: alt,
        class: className || "",
        loading: opts.eager ? "eager" : "lazy",
        decoding: "async",
        width: opts.width || 640,
        height: opts.height || 360
      }
    });
  }

  window.MediCareUI = {
    ICONS: ICONS,
    STATUS_META: STATUS_META,
    basePrefix: BASE_PREFIX,
    assetUrl: assetUrl,
    pageUrl: pageUrl,
    componentUrl: componentUrl,
    qs: qs,
    qsa: qsa,
    el: el,
    icon: svgIcon,
    escapeHtml: escapeHtml,
    formatBDT: formatBDT,
    debounce: debounce,
    getParam: getParam,
    cloneTemplate: cloneTemplate,
    fillTemplate: fillTemplate,
    slot: slot,
    fragment: fragment,
    createFilterPanel: createFilterPanel,
    renderCollection: renderCollection,
    renderNotFound: renderNotFound,
    setBreadcrumbCurrent: setBreadcrumbCurrent,
    setPageTitle: setPageTitle,
    statusBadge: statusBadge,
    demoFlag: demoFlag,
    emptyState: emptyState,
    alertBox: alertBox,
    announce: announce,
    focusElement: focusElement,
    initAccordions: initAccordions,
    renderPagination: renderPagination,
    setOptions: setOptions,
    image: image
  };
})(window, document);
