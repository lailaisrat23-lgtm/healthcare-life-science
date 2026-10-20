/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/data.js
 *
 * Data access layer. All demonstration records live as plain JSON files in the
 * project's `jsonData/` folder and are fetched once at start-up; this module
 * only loads them and exposes lookup helpers. Keeping the data out of the
 * JavaScript means content can be edited without touching application logic.
 *
 * Every record is fictional sample data written for portfolio presentation.
 */
(function (window) {
  "use strict";

  /* Dataset key -> JSON file in `jsonData/`. */
  var FILES = {
    doctors: "doctor_data.json",
    clinics: "clinic_data.json",
    laboratories: "laboratory_data.json",
    medicines: "medicine_data.json",
    diagnosticTests: "diagnostic_test_data.json",
    manufacturers: "manufacturer_data.json",
    suppliers: "supplier_data.json",
    appointments: "appointment_data.json",
    reports: "report_data.json",
    services: "service_data.json",
    notifications: "notification_data.json",
    deviceGuidance: "device_guidance_data.json",
    portalProfile: "portal_profile_data.json",
    config: "config_data.json"
  };

  var DATA = {
    doctors: [],
    clinics: [],
    laboratories: [],
    medicines: [],
    diagnosticTests: [],
    manufacturers: [],
    suppliers: [],
    appointments: [],
    reports: [],
    services: [],
    notifications: [],
    deviceGuidance: [],
    portalProfile: null,
    consultationTypes: [],
    cities: [],

    loaded: false,
    failures: []
  };

  /**
   * Resolve `jsonData/…` for the current page depth. `ui.js` already derives the
   * project prefix from its own script URL, so reuse it when available.
   */
  function jsonBase() {
    var prefix = "";
    if (window.MediCareUI && typeof window.MediCareUI.basePrefix === "string") {
      prefix = window.MediCareUI.basePrefix;
    } else {
      var scripts = document.querySelectorAll("script[src]");
      for (var i = 0; i < scripts.length; i += 1) {
        var src = scripts[i].getAttribute("src") || "";
        var index = src.indexOf("public/js/");
        if (index !== -1) {
          prefix = src.slice(0, index);
          break;
        }
      }
    }
    return prefix + "jsonData/";
  }

  function loadFile(key, base) {
    return fetch(base + FILES[key], { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP " + response.status + " for " + FILES[key]);
        }
        return response.json();
      })
      .then(function (payload) {
        applyPayload(key, payload);
      })
      .catch(function (error) {
        DATA.failures.push(FILES[key]);
        if (window.console && window.console.warn) {
          window.console.warn("[MediCare] Could not load " + FILES[key] + ":", error.message);
        }
      });
  }

  function applyPayload(key, payload) {
    if (key === "config") {
      DATA.consultationTypes = payload.consultationTypes || [];
      DATA.cities = payload.cities || [];
      return;
    }
    DATA[key] = payload;
  }

  var loadPromise = null;

  /** Fetch every dataset once. Safe to call from several places. */
  function load() {
    if (loadPromise) {
      return loadPromise;
    }
    var base = jsonBase();
    var keys = Object.keys(FILES);
    loadPromise = Promise.all(
      keys.map(function (key) {
        return loadFile(key, base);
      })
    ).then(function () {
      DATA.loaded = true;
      return DATA;
    });
    return loadPromise;
  }

  function findById(list, id) {
    if (!id || !list) {
      return null;
    }
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id) {
        return list[i];
      }
    }
    return null;
  }

  DATA.load = load;
  DATA.doctorById = function (id) {
    return findById(DATA.doctors, id);
  };
  DATA.clinicById = function (id) {
    return findById(DATA.clinics, id);
  };
  DATA.labById = function (id) {
    return findById(DATA.laboratories, id);
  };
  DATA.medicineById = function (id) {
    return findById(DATA.medicines, id);
  };
  DATA.testById = function (id) {
    return findById(DATA.diagnosticTests, id);
  };
  DATA.manufacturerById = function (id) {
    return findById(DATA.manufacturers, id);
  };
  DATA.supplierById = function (id) {
    return findById(DATA.suppliers, id);
  };
  DATA.appointmentById = function (id) {
    return findById(DATA.appointments, id);
  };
  DATA.reportById = function (id) {
    return findById(DATA.reports, id);
  };
  DATA.doctorsForClinic = function (clinicId) {
    return DATA.doctors.filter(function (doctor) {
      return doctor.clinicId === clinicId;
    });
  };
  DATA.uniqueValues = function (list, key) {
    var seen = {};
    var output = [];
    (list || []).forEach(function (item) {
      var value = item[key];
      if (value && !seen[value]) {
        seen[value] = true;
        output.push(value);
      }
    });
    return output.sort();
  };

  window.MediCareData = DATA;
})(window);