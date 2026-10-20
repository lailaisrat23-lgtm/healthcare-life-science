/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/appointments.js
 *
 * Appointment request form support and the simulated appointment-tracking
 * lookup. Requests are validated locally and never transmitted; tracking
 * returns fixed fictional sample statuses only.
 */
(function (window, document) {
  "use strict";

  var UI = window.MediCareUI;
  var DATA = window.MediCareData;
  if (!UI || !DATA) {
    return;
  }

  var TRACKING_STAGES = [
    "Request Draft",
    "Request Received — Demo",
    "Awaiting Confirmation — Demo",
    "Confirmed — Simulated",
    "Completed — Simulated"
  ];

  var initialized = {};

  function todayISO() {
    var now = new Date();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + month + "-" + day;
  }

  function demoReference() {
    var now = new Date();
    var stamp =
      String(now.getFullYear()).slice(2) +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");
    var suffix = String(Math.floor(Math.random() * 9000) + 1000);
    return "MCA-DEMO-" + stamp + "-" + suffix;
  }

  function initRequestForm() {
    var form = UI.qs("[data-appointment-form]");
    if (!form || initialized.request === true) {
      return;
    }
    initialized.request = true;

    var doctorSelect = UI.qs('[data-select="doctor"]');
    if (doctorSelect) {
      doctorSelect.textContent = "";
      doctorSelect.appendChild(
        UI.el("option", { text: "Choose a fictional doctor", attrs: { value: "" } })
      );
      DATA.doctors.forEach(function (doctor) {
        doctorSelect.appendChild(
          UI.el("option", {
            text: doctor.name + " — " + doctor.specialty + " (" + doctor.city + ")",
            attrs: { value: doctor.id }
          })
        );
      });
    }

    var clinicSelect = UI.qs('[data-select="clinic"]');
    if (clinicSelect) {
      clinicSelect.textContent = "";
      clinicSelect.appendChild(UI.el("option", { text: "Choose a fictional clinic", attrs: { value: "" } }));
      DATA.clinics.forEach(function (clinic) {
        clinicSelect.appendChild(
          UI.el("option", {
            text: clinic.name + " — " + clinic.city,
            attrs: { value: clinic.id }
          })
        );
      });
    }

    var testSelect = UI.qs('[data-select="test"]');
    if (testSelect) {
      testSelect.textContent = "";
      testSelect.appendChild(
        UI.el("option", { text: "Not applicable to this request", attrs: { value: "" } })
      );
      DATA.diagnosticTests.forEach(function (test) {
        testSelect.appendChild(
          UI.el("option", {
            text: test.name + " (" + UI.formatBDT(test.price) + ", illustrative)",
            attrs: { value: test.id }
          })
        );
      });
    }

    var dateInput = UI.qs('[data-appointment-date]');
    if (dateInput) {
      dateInput.min = todayISO();
      dateInput.setAttribute("data-no-past", "");
    }

    var timeSelect = UI.qs('[data-select="time"]');
    if (timeSelect) {
      timeSelect.textContent = "";
      timeSelect.appendChild(UI.el("option", { text: "Choose a sample time", attrs: { value: "" } }));
      ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30", "19:00"].forEach(function (time) {
        timeSelect.appendChild(UI.el("option", { text: time + " (sample slot)", attrs: { value: time } }));
      });
    }

    /* Pre-fill from the query string used by directory links. */
    var linkedDoctor = DATA.doctorById(UI.getParam("doctor"));
    if (linkedDoctor && doctorSelect) {
      doctorSelect.value = linkedDoctor.id;
      if (clinicSelect) {
        clinicSelect.value = linkedDoctor.clinicId;
      }
    }
    var linkedClinic = DATA.clinicById(UI.getParam("clinic"));
    if (linkedClinic && clinicSelect) {
      clinicSelect.value = linkedClinic.id;
    }
    var linkedTest = DATA.testById(UI.getParam("test"));
    if (linkedTest && testSelect) {
      testSelect.value = linkedTest.id;
    }

    form.addEventListener("medicare:demo-submitted", function (event) {
      var region = UI.qs("[data-form-feedback]", form);
      if (!region) {
        return;
      }
      var reference = demoReference();
      var box = UI.el("div", { className: "appointment-card mt-6" });
      box.appendChild(
        UI.el("p", { className: "appointment-card__id", text: "Demo reference: " + reference })
      );
      box.appendChild(
        UI.el("h3", { className: "appointment-card__title", text: "Simulated request summary" })
      );
      box.appendChild(
        UI.el("p", {
          className: "card__text",
          text:
            "A fictional request was recorded in this browser only. No clinic or doctor has been contacted, no slot has been reserved, and nothing has been stored. Reference numbers are generated at random and forget them as soon as you leave the page."
        })
      );

      var summary = UI.el("dl", { className: "appointment-card__meta" });
      var doctor = DATA.doctorById(event.detail.data.doctor);
      var clinic = DATA.clinicById(event.detail.data.clinic);
      [
        ["Fictional doctor", doctor ? doctor.name + " — " + doctor.specialty : "Not chosen"],
        ["Fictional clinic", clinic ? clinic.name : "Not chosen"],
        ["Sample date", event.detail.data.date || "Not chosen"],
        ["Sample time", event.detail.data.time || "Not chosen"],
        ["Consultation type", event.detail.data.consultation || "Not chosen"]
      ].forEach(function (pair) {
        var row = UI.el("div", { className: "card__meta-row" });
        row.appendChild(UI.el("dt", { className: "card__meta-term", text: pair[0] }));
        row.appendChild(UI.el("dd", { className: "card__meta-value", text: pair[1] }));
        summary.appendChild(row);
      });
      box.appendChild(summary);

      var statusRow = UI.el("div", { className: "appointment-card__top mt-6" });
      statusRow.appendChild(UI.el("span", { className: "card__meta-term", text: "Simulated status" }));
      statusRow.appendChild(UI.statusBadge("Request Received — Demo"));
      box.appendChild(statusRow);

      var link = UI.el("p", { className: "mt-6" });
      link.appendChild(
        UI.el("a", {
          className: "btn btn--secondary btn--sm",
          text: "Open the appointment tracking demo",
          attrs: { href: UI.pageUrl("appointment-tracking.html") + "?id=MCA-2401-0001" }
        })
      );
      box.appendChild(link);

      region.appendChild(box);
    });
  }

  function renderAppointment(report, host) {
    host.textContent = "";

    var card = UI.el("article", { className: "tracking-panel" });
    var header = UI.el("div", { className: "results-toolbar" });

    var heading = UI.el("div");
    heading.appendChild(UI.el("h3", { className: "card__title", text: report.id }));
    heading.appendChild(
      UI.el("p", {
        className: "card__text",
        text: "Fictional demonstration appointment record. No real booking exists."
      })
    );
    header.appendChild(heading);
    header.appendChild(UI.statusBadge(report.status));
    card.appendChild(header);

    var doctor = DATA.doctorById(report.doctorId);
    var clinic = DATA.clinicById(report.clinicId);

    var facts = UI.el("dl", { className: "appointment-card__meta mt-6" });
    [
      ["Fictional doctor", doctor ? doctor.name + " — " + doctor.specialty : "Not recorded"],
      ["Fictional clinic", clinic ? clinic.name + " — " + clinic.city : "Not recorded"],
      ["Sample date", report.date],
      ["Sample time", report.time],
      ["Consultation type", report.type],
      ["Sample patient reference", report.patientRef + " (non-identifiable demo label)"],
      ["Simulation note", report.notes]
    ].forEach(function (pair) {
      var row = UI.el("div", { className: "card__meta-row" });
      row.appendChild(UI.el("dt", { className: "card__meta-term", text: pair[0] }));
      row.appendChild(UI.el("dd", { className: "card__meta-value", text: pair[1] }));
      facts.appendChild(row);
    });
    card.appendChild(facts);

    card.appendChild(
      UI.el("h4", { className: "content-block__title mt-8", text: "Simulated status timeline" })
    );

    var isCancelled = report.status === "Cancelled — Simulated";
    var currentIndex = TRACKING_STAGES.indexOf(report.status);
    var timeline = UI.el("ol", { className: "timeline" });

    TRACKING_STAGES.forEach(function (stage, index) {
      var state;
      if (isCancelled) {
        state = index === 1 ? "current" : index < 1 ? "complete" : "pending";
      } else {
        state = index < currentIndex ? "complete" : index === currentIndex ? "current" : "pending";
      }
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
              ? "Illustrative stage marked complete in this simulation."
              : state === "current"
              ? "Current simulated stage for this sample record."
              : "Not reached in this simulation."
        })
      );
      timeline.appendChild(item);
    });

    if (isCancelled) {
      var cancelItem = UI.el("li", { className: "timeline__item timeline__item--current" });
      var cancelMarker = UI.el("span", { className: "timeline__marker" });
      cancelItem.appendChild(cancelMarker);
      cancelItem.appendChild(UI.el("h5", { className: "timeline__title", text: "Cancelled — Simulated" }));
      cancelItem.appendChild(
        UI.el("p", { className: "timeline__meta", text: "Sample cancellation recorded for this demonstration record." })
      );
      timeline.appendChild(cancelItem);
    }

    card.appendChild(timeline);
    host.appendChild(card);
    UI.focusElement(card);
    UI.announce("Simulated appointment status: " + report.status + " for record " + report.id + ".");
  }

  function initTracking() {
    var form = UI.qs("[data-tracking-form]");
    var host = UI.qs("[data-tracking-result]");
    var input = UI.qs("[data-tracking-input]");
    if (!form || !host || !input || initialized.tracking === true) {
      return;
    }
    initialized.tracking = true;
    form.setAttribute("novalidate", "novalidate");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = (input.value || "").trim().toUpperCase();

      if (!value) {
        host.textContent = "";
        host.appendChild(
          UI.alertBox({
            variant: "error",
            title: "Enter a demonstration appointment ID",
            text: "Use one of the sample IDs listed on this page, for example MCA-2401-0001."
          })
        );
        UI.focusElement(host);
        input.setAttribute("aria-invalid", "true");
        UI.announce("Enter a demonstration appointment ID.");
        return;
      }

      input.removeAttribute("aria-invalid");
      var appointment = DATA.appointmentById(value);

      if (!appointment) {
        host.textContent = "";
        host.appendChild(
          UI.alertBox({
            variant: "warning",
            title: "That ID is not recognised in the demonstration dataset",
            text:
              "“" +
              value +
              "” does not match any sample appointment record. Check the sample IDs on this page. Remember that no real appointment lookup exists on this site."
          })
        );
        UI.focusElement(host);
        UI.announce("Appointment ID not recognised.");
        return;
      }

      renderAppointment(appointment, host);
    });

    UI.qsa("[data-tracking-sample]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        input.value = button.getAttribute("data-tracking-sample");
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      });
    });

    var linkedId = UI.getParam("id");
    if (linkedId) {
      input.value = linkedId.trim().toUpperCase();
      form.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  }

  window.MediCareAppointments = {
    initRequestForm: initRequestForm,
    initTracking: initTracking,
    stages: TRACKING_STAGES
  };
})(window, document);
