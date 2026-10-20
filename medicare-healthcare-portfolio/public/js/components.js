/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/components.js
 *
 * Lightweight HTML partial loader.
 *
 * Pages declare shared regions with:
 *   <div data-component="navbar"></div>
 *
 * The loader resolves the project-root prefix from its own script URL, fetches
 * each partial once, injects it, rewrites the partial's internal links for the
 * current page depth, and finally dispatches a single `medicare:ready` event.
 * Failures degrade to an accessible inline fallback instead of leaving a blank
 * region or throwing.
 */
(function (window, document) {
  "use strict";

  var UI = window.MediCareUI;
  if (!UI) {
    return;
  }

  var loaded = {};
  var pending = 0;

  /* Widget templates every page needs; page-specific card templates come from
     `<body data-templates="doctor-card,clinic-card">`. */
  var ALWAYS_TEMPLATES = ["status-badge", "empty-state", "pagination", "search-filter"];

  function ensureTemplates() {
    var names = ALWAYS_TEMPLATES.slice();
    (document.body.dataset.templates || "").split(",").forEach(function (name) {
      var clean = name.trim();
      if (clean && names.indexOf(clean) === -1) {
        names.push(clean);
      }
    });

    var holder = UI.el("div", { attrs: { hidden: "", "data-template-holder": "true" } });
    names.forEach(function (name) {
      holder.appendChild(UI.el("div", { attrs: { "data-component": name } }));
    });
    document.body.appendChild(holder);
  }

  function resolveAssets(container) {
    UI.qsa("[data-asset]", container).forEach(function (node) {
      var target = node.getAttribute("data-asset");
      if (target) {
        node.setAttribute("src", UI.assetUrl(target));
        node.removeAttribute("data-asset");
      }
    });
  }

  function applyFills(container, placeholder) {
    var fills = {};
    Array.prototype.forEach.call(placeholder.attributes, function (attribute) {
      if (attribute.name.indexOf("data-fill-") === 0) {
        fills[attribute.name.slice("data-fill-".length)] = attribute.value;
      }
    });
    if (Object.keys(fills).length) {
      UI.fillTemplate(container, fills);
    }
  }

  function resolveLinks(container) {
    UI.qsa("[data-link]", container).forEach(function (node) {
      var target = node.getAttribute("data-link");
      if (!target) {
        return;
      }
      node.setAttribute("href", UI.pageUrl(target));
      node.removeAttribute("data-link");
    });
  }

  function markActiveNav(container) {
    var page = document.body.dataset.page || "";
    UI.qsa("[data-page-match]", container).forEach(function (node) {
      var matches = (node.getAttribute("data-page-match") || "").split(",");
      var isActive = matches.some(function (value) {
        return value.trim() === page;
      });
      if (isActive) {
        node.setAttribute("aria-current", "page");
      } else {
        node.removeAttribute("aria-current");
      }
    });
  }

  function hydrateBreadcrumb(container, placeholder) {
    var list = UI.qs("[data-breadcrumb-list]", container);
    var trail = placeholder.getAttribute("data-trail");
    if (!list || !trail) {
      return;
    }
    list.textContent = "";
    var entries = trail.split(";").filter(function (entry) {
      return entry.trim() !== "";
    });
    if (!entries.length || entries[0].indexOf("|") === -1) {
      entries.unshift("Home|@home");
    }
    entries.forEach(function (entry, index) {
      var parts = entry.split("|");
      var label = parts[0].trim();
      var href = parts.length > 1 ? parts[1].trim() : "";
      var isLast = index === entries.length - 1;
      var item = UI.el("li", { className: "breadcrumb__item" });
      if (isLast || !href) {
        item.appendChild(
          UI.el("span", {
            className: "breadcrumb__current",
            text: label,
            attrs: { "aria-current": "page" }
          })
        );
      } else {
        item.appendChild(
          UI.el("a", { className: "breadcrumb__link", text: label, attrs: { href: UI.pageUrl(href) } })
        );
      }
      list.appendChild(item);
    });
  }

  function renderFallback(placeholder, name) {
    var fallback = UI.el("div", { className: "component-fallback", attrs: { role: "status" } });
    fallback.appendChild(
      UI.el("p", {
        className: "mt-0",
        text:
          "The “" +
          name +
          "” component could not be loaded. Serve this project over a local HTTP server (for example VS Code Live Server) instead of opening the file directly."
      })
    );
    placeholder.textContent = "";
    placeholder.appendChild(fallback);
    placeholder.setAttribute("data-component-failed", "true");
  }

  function loadComponent(placeholder) {
    var name = placeholder.getAttribute("data-component");
    if (!name || placeholder.getAttribute("data-component-loaded") === "true") {
      return Promise.resolve();
    }
    placeholder.setAttribute("data-component-loading", "true");

    var request = loaded[name]
      ? loaded[name]
      : (loaded[name] = fetch(UI.componentUrl(name), { credentials: "same-origin" }).then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP " + response.status + " for component “" + name + "”");
          }
          return response.text();
        }));

    return request
      .then(function (markup) {
        placeholder.innerHTML = markup;
        placeholder.removeAttribute("data-component-loading");
        placeholder.setAttribute("data-component-loaded", "true");
        markActiveNav(placeholder);
        hydrateBreadcrumb(placeholder, placeholder);
        resolveAssets(placeholder);
        resolveLinks(placeholder);
        applyFills(placeholder, placeholder);
      })
      .catch(function (error) {
        placeholder.removeAttribute("data-component-loading");
        renderFallback(placeholder, name);
        if (window.console && window.console.warn) {
          window.console.warn("[MediCare] Component load skipped:", error.message);
        }
      });
  }

  function init() {
    ensureTemplates();
    var placeholders = UI.qsa("[data-component]");
    pending = placeholders.length;

    if (!pending) {
      afterLoad();
      return;
    }

    Promise.all(placeholders.map(loadComponent)).then(afterLoad, afterLoad);
  }

  function afterLoad() {
    pending = 0;
    document.documentElement.setAttribute("data-components-ready", "true");
    document.dispatchEvent(new CustomEvent("medicare:ready"));
  }

  window.MediCareComponents = {
    init: init,
    reload: init
  };
})(window, document);
