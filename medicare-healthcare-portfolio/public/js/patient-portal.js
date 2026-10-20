/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/patient-portal.js
 *
 * Dashboard preview for the demonstration patient portal. All content is
 * fictional: there is no login, no authentication, no persistent medical record
 * and nothing is written to browser storage.
 */
(function (window, document) {
  "use strict";

  var UI = window.MediCareUI;
  var DATA = window.MediCareData;
  if (!UI || !DATA) {
    return;
  }

  var initialised = false;

  function appointmentCard(appointment) {
    var frag = UI.cloneTemplate("appointment-card");
    if (!frag) {
      return null;
    }
    var doctor = DATA.doctorById(appointment.doctorId);
    var clinic = DATA.clinicById(appointment.clinicId);

    UI.fillTemplate(frag, {
      title: doctor ? doctor.name + " — " + doctor.specialty : "Appointment record",
      id: "Demo appointment reference: " + appointment.id,
      date: appointment.date,
      time: appointment.time + " (sample slot)",
      type: appointment.type,
      clinic: clinic ? clinic.name + " — " + clinic.city : "Not recorded",
      note: appointment.notes,
      link: UI.pageUrl("appointment-tracking.html") + "?id=" + encodeURIComponent(appointment.id),
      linkLabel: "Open tracking view"
    });

    var status = UI.slot(frag, "status");
    status.appendChild(UI.statusBadge(appointment.status));

    return frag.querySelector("article") || frag;
  }

  function reportRow(report) {
    var test = DATA.testById(report.testId);
    var lab = DATA.labById(report.labId);
    var row = UI.el("li", { className: "notification" });
    var body = UI.el("div");
    body.appendChild(
      UI.el("span", {
        className: "doc-list__title",
        text: (test ? test.name : "Test record") + " · " + report.id
      })
    );
    body.appendChild(
      UI.el("p", {
        className: "doc-list__meta",
        text:
          "Sample laboratory: " +
          (lab ? lab.name : "not recorded") +
          " · collected " +
          report.collectedOn +
          " · illustrative availability " +
          report.expectedOn
      })
    );
    body.appendChild(UI.statusBadge(report.status));
    row.appendChild(body);
    return row;
  }

  function shortcut(definition) {
    var item = UI.el("li");
    var link = UI.el("a", {
      className: "shortcut",
      attrs: { href: UI.pageUrl(definition.page) }
    });
    link.appendChild(UI.icon(definition.icon, "shortcut__icon"));
    link.appendChild(UI.el("span", { text: definition.label }));
    item.appendChild(link);
    return item;
  }

  function init() {
    var root = UI.qs("[data-portal]");
    if (!root || initialised) {
      return;
    }
    initialised = true;

    var profile = DATA.portalProfile || {};
    UI.fillTemplate(root, {
      name: profile.name || "Demo Patient",
      reference: profile.reference || "Patient reference: not available",
      bloodGroup: profile.bloodGroup || "Sample group: —",
      age: profile.age || "Sample age: —",
      city: "Sample city: " + (profile.city || "—"),
      plan: profile.plan || "Demo health plan: —",
      appointmentCount: String(DATA.appointments.length) + " sample records",
      reportCount: String(DATA.reports.length) + " sample records"
    });

    var upcomingHost = UI.qs("[data-portal-upcoming]");
    if (upcomingHost) {
      var upcoming = DATA.appointments.filter(function (appointment) {
        return (
          appointment.status === "Confirmed — Simulated" ||
          appointment.status === "Awaiting Confirmation — Demo" ||
          appointment.status === "Request Received — Demo"
        );
      });
      var upcomingList = UI.el("ul", { className: "stack" });
      upcoming.forEach(function (appointment) {
        var card = appointmentCard(appointment);
        if (card) {
          upcomingList.appendChild(UI.el("li", { children: [card] }));
        }
      });
      upcomingHost.textContent = "";
      if (!upcoming.length) {
        upcomingHost.appendChild(
          UI.emptyState({
            title: "No sample upcoming appointments",
            text: "This demonstration account has no fictional upcoming appointment records.",
            actionLabel: "Open the appointment demo",
            actionHref: UI.pageUrl("appointments.html")
          })
        );
      } else {
        upcomingHost.appendChild(upcomingList);
      }
    }

    var historyHost = UI.qs("[data-portal-history]");
    if (historyHost) {
      var history = DATA.appointments.filter(function (appointment) {
        return (
          appointment.status === "Completed — Simulated" || appointment.status === "Cancelled — Simulated"
        );
      });
      var historyList = UI.el("ul", { className: "stack" });
      history.forEach(function (appointment) {
        var card = appointmentCard(appointment);
        if (card) {
          historyList.appendChild(UI.el("li", { children: [card] }));
        }
      });
      historyHost.textContent = "";
      if (!history.length) {
        historyHost.appendChild(
          UI.el("p", { className: "card__text", text: "No sample appointment history recorded." })
        );
      } else {
        historyHost.appendChild(historyList);
      }
    }

    var reportHost = UI.qs("[data-portal-reports]");
    if (reportHost) {
      var reportList = UI.el("ul", { className: "notification-list" });
      DATA.reports.forEach(function (report) {
        reportList.appendChild(reportRow(report));
      });
      reportHost.textContent = "";
      reportHost.appendChild(reportList);
    }

    var shortcutHost = UI.qs("[data-portal-shortcuts]");
    if (shortcutHost) {
      shortcutHost.textContent = "";
      [
        { label: "Find a doctor", page: "doctors.html", icon: "stethoscope" },
        { label: "Request an appointment", page: "appointments.html", icon: "calendar" },
        { label: "Track an appointment", page: "appointment-tracking.html", icon: "clock" },
        { label: "Book a diagnostic test", page: "diagnostics.html", icon: "flask" },
        { label: "Track a report", page: "report-tracking.html", icon: "file" },
        { label: "Browse the pharmacy demo", page: "pharmacy.html", icon: "pill" },
        { label: "Clinic directory", page: "clinics.html", icon: "building" },
        { label: "Telemedicine overview", page: "telemedicine.html", icon: "globe" },
        { label: "Send a demo inquiry", page: "contact.html", icon: "mail" }
      ].forEach(function (definition) {
        shortcutHost.appendChild(shortcut(definition));
      });
    }

    var notificationHost = UI.qs("[data-portal-notifications]");
    if (notificationHost) {
      var list = UI.el("ul", { className: "notification-list" });
      DATA.notifications.forEach(function (notification) {
        var item = UI.el("li", { className: "notification" });
        var body = UI.el("div");
        body.appendChild(UI.el("span", { className: "doc-list__title", text: notification.title }));
        body.appendChild(UI.el("span", { className: "notification__time", text: notification.time }));
        body.appendChild(UI.el("p", { className: "doc-list__meta", text: notification.text }));
        item.appendChild(body);
        list.appendChild(item);
      });
      notificationHost.textContent = "";
      notificationHost.appendChild(list);
    }

    var metricHost = UI.qs("[data-portal-metrics]");
    if (metricHost) {
      metricHost.textContent = "";
      [
        { label: "Sample appointments", value: String(DATA.appointments.length) },
        { label: "Sample reports", value: String(DATA.reports.length) },
        { label: "Illustrative notifications", value: String(DATA.notifications.length) },
        { label: "Demo session storage", value: "None" }
      ].forEach(function (metric) {
        var item = UI.el("li", { className: "metric", children: [UI.el("span", { className: "metric__label", text: metric.label })] });
        item.appendChild(UI.el("span", { className: "metric__value", text: metric.value }));
        metricHost.appendChild(item);
      });
    }

    UI.announce("Demonstration dashboard loaded with sample data.");
  }

  window.MediCarePortal = {
    init: init
  };
})(window, document);
