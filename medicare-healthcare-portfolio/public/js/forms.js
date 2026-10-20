/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/forms.js
 *
 * Reusable client-side validation and demo-only submission feedback. No form on
 * this site transmits anything: valid submissions are stopped locally, reported
 * through an accessible live region and never stored.
 */
(function (window, document) {
  "use strict";

  var UI = window.MediCareUI;
  if (!UI) {
    return;
  }

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_PATTERN = /^[+]?[0-9\s()-]{7,20}$/;
  var enhanced = [];

  function labelTextFor(control) {
    if (control.getAttribute("data-group-label")) {
      return control.getAttribute("data-group-label");
    }
    var choice = control.closest(".choice");
    if (choice) {
      var choiceTitle = choice.querySelector(".choice__title");
      if (choiceTitle && choiceTitle.textContent.trim()) {
        return choiceTitle.textContent.trim();
      }
    }
    if (control.id) {
      var explicit = document.querySelector('label[for="' + control.id + '"]');
      if (explicit && explicit.textContent.trim()) {
        return explicit.textContent.replace(/\s*\*$/, "").trim();
      }
    }
    var fieldset = control.closest("fieldset");
    if (fieldset) {
      var legend = fieldset.querySelector("legend");
      if (legend && legend.textContent.trim()) {
        return legend.textContent.trim();
      }
    }
    var wrapping = control.closest("label");
    if (wrapping && wrapping.textContent.trim()) {
      return wrapping.textContent.replace(/\s*\*$/, "").trim();
    }
    return control.getAttribute("data-label") || control.name || "This field";
  }

  function errorElementFor(control) {
    var key = control.id || control.name;
    if (!key) {
      return null;
    }
    var selector = '[data-error-for="' + key + '"]';
    var existing = control.form ? control.form.querySelector(selector) : document.querySelector(selector);
    if (existing) {
      return existing;
    }
    var node = UI.el("p", {
      className: "form__error",
      attrs: { id: key + "-error", "data-error-for": key }
    });
    node.appendChild(UI.icon("alert", "form__error-icon"));
    node.appendChild(UI.el("span", { className: "form__error-text" }));
    control.insertAdjacentElement("afterend", node);
    return node;
  }

  function describe(control, errorId) {
    var ids = (control.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter(function (value) {
        return value && value !== errorId;
      });
    ids.push(errorId);
    control.setAttribute("aria-describedby", ids.join(" "));
  }

  function setError(control, message) {
    var errorNode = errorElementFor(control);
    control.setAttribute("aria-invalid", "true");
    if (errorNode) {
      describe(control, errorNode.id);
      var textNode = errorNode.querySelector(".form__error-text");
      if (textNode) {
        textNode.textContent = message;
      } else {
        errorNode.textContent = message;
      }
    }
    return message;
  }

  function clearError(control) {
    control.removeAttribute("aria-invalid");
    var errorNode = errorElementFor(control);
    if (errorNode) {
      var textNode = errorNode.querySelector(".form__error-text");
      if (textNode) {
        textNode.textContent = "";
      } else {
        errorNode.textContent = "";
      }
    }
  }

  function validateControl(control) {
    var value = (control.value || "").trim();
    var label = labelTextFor(control);

    if (control.type === "checkbox") {
      if (control.required && !control.checked) {
        return setError(control, "Please tick “" + label + "” to continue.");
      }
      clearError(control);
      return null;
    }

    if (control.type === "radio") {
      var groupName = control.name;
      if (!control.required || !groupName || !control.form) {
        clearError(control);
        return null;
      }
      var group = control.form.querySelectorAll('input[type="radio"][name="' + groupName + '"]');
      var checked = Array.prototype.some.call(group, function (radio) {
        return radio.checked;
      });
      if (!checked) {
        Array.prototype.forEach.call(group, clearError);
        return control === group[0] ? setError(control, "Choose " + label.toLowerCase() + " to continue.") : null;
      }
      Array.prototype.forEach.call(group, clearError);
      return null;
    }

    if (control.required && value === "") {
      return setError(control, "Enter " + label.toLowerCase() + " to continue.");
    }

    if (value === "") {
      clearError(control);
      return null;
    }

    if (control.type === "email" && !EMAIL_PATTERN.test(value)) {
      return setError(control, "Enter an email address in the format name@example.com.");
    }

    if (control.type === "tel" && !PHONE_PATTERN.test(value)) {
      return setError(control, "Enter a phone number using digits, spaces, brackets or a leading +.");
    }

    var minLength = parseInt(control.getAttribute("data-min-length"), 10);
    if (!isNaN(minLength) && value.length < minLength) {
      return setError(control, "Enter at least " + minLength + " characters for " + label.toLowerCase() + ".");
    }

    if (control.type === "date" && control.hasAttribute("data-no-past")) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var chosen = new Date(value + "T00:00:00");
      if (!isNaN(chosen.getTime()) && chosen < today) {
        return setError(control, "Choose today's date or a later date. Past dates are not accepted in this demo.");
      }
    }

    clearError(control);
    return null;
  }

  function fieldsOf(form) {
    return UI.qsa("input, select, textarea", form).filter(function (control) {
      return (
        control.type !== "hidden" &&
        control.type !== "submit" &&
        control.type !== "button" &&
        !control.disabled &&
        control.hasAttribute("data-ignore-validation") === false
      );
    });
  }

  function feedbackRegion(form) {
    var region = UI.qs("[data-form-feedback]", form);
    if (region) {
      return region;
    }
    var container = form.parentElement || form;
    region = UI.el("div", { attrs: { "data-form-feedback": "true" } });
    container.insertBefore(region, form.nextSibling);
    return region;
  }

  function collect(form) {
    var data = {};
    fieldsOf(form).forEach(function (control) {
      var key = control.name || control.id;
      if (!key) {
        return;
      }
      if (control.type === "checkbox") {
        data[key] = control.checked;
      } else if (control.type === "radio") {
        if (control.checked) {
          data[key] = control.value;
        }
      } else {
        data[key] = (control.value || "").trim();
      }
    });
    return data;
  }

  function enhance(form, options) {
    if (!form || form.dataset.formEnhanced === "true") {
      return null;
    }
    form.dataset.formEnhanced = "true";
    form.setAttribute("novalidate", "novalidate");

    var opts = options || {};
    var region = feedbackRegion(form);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var controls = fieldsOf(form);
      var firstInvalid = null;
      var invalidNames = {};

      controls.forEach(function (control) {
        if (validateControl(control) && !firstInvalid) {
          firstInvalid = control;
        }
        if (control.getAttribute("aria-invalid") === "true") {
          invalidNames[control.name || control.id] = true;
        }
      });

      var invalidCount = Object.keys(invalidNames).length;

      region.textContent = "";

      if (firstInvalid) {
        var summary = UI.alertBox({
          variant: "error",
          title: "There " + (invalidCount === 1 ? "is 1 item" : "are " + invalidCount + " items") + " to check",
          text: "Correct the highlighted fields and submit the form again. Nothing has been sent."
        });
        summary.setAttribute("tabindex", "-1");
        region.appendChild(summary);
        UI.focusElement(summary);
        UI.announce(invalidCount + " form field" + (invalidCount === 1 ? "" : "s") + " need attention.");
        UI.focusElement(firstInvalid);
        return;
      }

      var data = collect(form);

      if (typeof opts.onValid === "function") {
        var result = opts.onValid(data, form);
        if (result && result.message) {
          var custom = UI.alertBox({ variant: "success", title: result.title, text: result.message });
          custom.setAttribute("tabindex", "-1");
          region.appendChild(custom);
          UI.focusElement(custom);
          UI.announce(result.title || "Submitted");
          return;
        }
      }

      var success = UI.alertBox({
        variant: "success",
        title: opts.successTitle || "Demo submission received",
        text:
          opts.successText ||
          "This is a portfolio demonstration. Your input stayed in this browser, nothing was transmitted, and no real booking, inquiry or request was created."
      });
      success.setAttribute("tabindex", "-1");
      region.appendChild(success);
      UI.focusElement(success);
      UI.announce(opts.successTitle || "Demo submission received");

      form.dispatchEvent(
        new CustomEvent("medicare:demo-submitted", {
          bubbles: true,
          detail: { data: data, form: form }
        })
      );

      form.reset();

      if (opts.resetErrors !== false) {
        controls.forEach(clearError);
      }
    });

    form.addEventListener(
      "blur",
      function (event) {
        var control = event.target;
        if (control.matches("input, select, textarea")) {
          validateControl(control);
        }
      },
      true
    );

    form.addEventListener("input", function (event) {
      var control = event.target;
      if (control.matches("input, select, textarea") && control.getAttribute("aria-invalid") === "true") {
        validateControl(control);
      }
    });

    enhanced.push(form);
    return form;
  }

  function initAll(root) {
    UI.qsa("form[data-demo-form]", root).forEach(function (form) {
      var title = form.getAttribute("data-success-title");
      var text = form.getAttribute("data-success-text");
      enhance(form, { successTitle: title || undefined, successText: text || undefined });
    });
  }

  window.MediCareForms = {
    enhance: enhance,
    initAll: initAll,
    validate: validateControl
  };
})(window, document);
