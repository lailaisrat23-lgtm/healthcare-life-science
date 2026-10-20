/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/navigation.js
 *
 * Responsive navigation behaviour: menu disclosure, keyboard support and
 * active-page state. The header is injected by the component loader, so binding
 * happens lazily on the first call that actually finds it and is guarded so
 * listeners can never be attached twice. There is deliberately no focus trap, so
 * keyboard users can always leave the panel.
 */
(function (window, document) {
  "use strict";

  var UI = window.MediCareUI;
  if (!UI) {
    return;
  }

  var DESKTOP_QUERY = "(min-width: 56.25em)";
  var headerBound = false;
  var viewportBound = false;

  function isDesktop() {
    return window.matchMedia(DESKTOP_QUERY).matches;
  }

  function panelOf(toggle) {
    var id = toggle.getAttribute("aria-controls");
    return id ? document.getElementById(id) : null;
  }

  /* Visibility is controlled by CSS plus the data-open attribute, so the panel
     is never left with the hidden attribute that would defeat the desktop rule. */
  function setOpen(toggle, panel, isOpen) {
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    panel.setAttribute("data-open", isOpen ? "true" : "false");
    panel.hidden = false;
  }

  function closeAll() {
    UI.qsa(".navbar__toggle").forEach(function (toggle) {
      var panel = panelOf(toggle);
      if (panel) {
        setOpen(toggle, panel, false);
      }
    });
  }

  function syncForViewport() {
    var desktop = isDesktop();
    UI.qsa(".navbar__toggle").forEach(function (toggle) {
      var panel = panelOf(toggle);
      if (!panel) {
        return;
      }
      if (desktop) {
        setOpen(toggle, panel, true);
      } else if (toggle.getAttribute("aria-expanded") !== "false") {
        setOpen(toggle, panel, false);
      }
    });
  }

  function bindHeader(header) {
    if (headerBound) {
      return;
    }
    headerBound = true;

    header.addEventListener("click", function (event) {
      var toggle = event.target.closest(".navbar__toggle");
      if (toggle) {
        var panel = panelOf(toggle);
        if (!panel) {
          return;
        }
        setOpen(toggle, panel, toggle.getAttribute("aria-expanded") !== "true");
        return;
      }

      /* Following a link from the small-screen panel closes it. */
      var link = event.target.closest(".navbar__panel a");
      if (link && !isDesktop()) {
        closeAll();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }
      var open = UI.qs('.navbar__toggle[aria-expanded="true"]');
      if (open && !isDesktop()) {
        closeAll();
        open.focus();
      }
    });
  }

  function bindViewport() {
    if (viewportBound) {
      return;
    }
    viewportBound = true;

    window.addEventListener("resize", UI.debounce(syncForViewport, 150));

    var query = window.matchMedia(DESKTOP_QUERY);
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", syncForViewport);
    } else if (typeof query.addListener === "function") {
      query.addListener(syncForViewport);
    }
  }

  function init() {
    var header = UI.qs(".site-header");
    if (header) {
      bindHeader(header);
    }
    bindViewport();
    syncForViewport();
  }

  window.MediCareNavigation = {
    init: init,
    closeAll: closeAll
  };
})(window, document);
