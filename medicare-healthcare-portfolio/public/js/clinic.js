/**
 * MediCare Integrated Clinic & Telemedicine Platform
 * public/js/clinic.js
 *
 * Doctor and clinic directories plus their detail pages, including search,
 * filtering, sorting, pagination and the homepage featured-doctor list. Every
 * record rendered here comes from the fictional dataset in data.js.
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

  function consultationSummary(doctor) {
    return doctor.consultationTypes.join(" · ");
  }

  function doctorImageAlt(doctor) {
    return "Illustrated placeholder portrait for " + doctor.name + ", a fictional " + doctor.specialty + " profile.";
  }

  function renderDoctorCard(doctor) {
    var frag = UI.cloneTemplate("doctor-card");
    if (!frag) {
      return null;
    }
    var clinic = DATA.clinicById(doctor.clinicId);

    UI.fillTemplate(frag, {
      name: doctor.name,
      specialty: doctor.specialty,
      qualifications: doctor.qualifications,
      consultation: consultationSummary(doctor),
      location: doctor.city + (clinic ? " · " + clinic.name : ""),
      fee: UI.formatBDT(doctor.fee),
      image: UI.assetUrl(doctor.image),
      imageAlt: doctorImageAlt(doctor),
      link: UI.pageUrl("doctor-details.html") + "?id=" + encodeURIComponent(doctor.id),
      linkLabel: "View profile",
      requestLink: UI.pageUrl("appointments.html") + "?doctor=" + encodeURIComponent(doctor.id)
    });

    var badges = UI.slot(frag, "badges");
    badges.appendChild(UI.demoFlag("Fictional profile"));
    doctor.consultationTypes.forEach(function (type) {
      badges.appendChild(UI.el("li", { className: "badge badge--info", text: type }));
    });

    var availability = UI.slot(frag, "availability");
    doctor.availability.slice(0, 3).forEach(function (slot) {
      var row = UI.el("li", { className: "availability-list__row" });
      row.appendChild(UI.el("span", { className: "availability-list__day", text: slot.day }));
      row.appendChild(UI.el("span", { text: slot.slots.join(" · ") }));
      availability.appendChild(row);
    });
    if (!doctor.availability.length) {
      availability.appendChild(
        UI.el("li", { className: "availability-list__row", text: "No sample availability recorded." })
      );
    }

    var article = frag.querySelector("article");
    return article || frag;
  }

  function renderClinicCard(clinic) {
    var frag = UI.cloneTemplate("clinic-card");
    if (!frag) {
      return null;
    }
    var doctors = DATA.doctorsForClinic(clinic.id);
    var hours = clinic.hours.map(function (entry) {
      return entry.day + " " + entry.time;
    });

    UI.fillTemplate(frag, {
      name: clinic.name,
      type: clinic.type,
      city: clinic.city,
      hours: hours.join(" · "),
      doctorCount: doctors.length + " listed (illustrative)",
      services: "Sample services: " + clinic.services.join(", "),
      image: UI.assetUrl(clinic.image),
      imageAlt: "Illustration representing " + clinic.name + ", a fictional " + clinic.type + ".",
      link: UI.pageUrl("clinic-details.html") + "?id=" + encodeURIComponent(clinic.id),
      linkLabel: "Clinic details",
      requestLink: UI.pageUrl("appointments.html") + "?clinic=" + encodeURIComponent(clinic.id)
    });

    var badges = UI.slot(frag, "badges");
    badges.appendChild(UI.el("li", { className: "badge badge--neutral", text: clinic.type }));
    clinic.facilities.slice(0, 2).forEach(function (facility) {
      badges.appendChild(UI.el("li", { className: "badge badge--success", text: facility }));
    });

    return frag.querySelector("article") || frag;
  }

  function sortDoctors(list, sort) {
    var copy = list.slice();
    if (sort === "fee-asc") {
      copy.sort(function (a, b) {
        return a.fee - b.fee;
      });
    } else if (sort === "experience-desc") {
      copy.sort(function (a, b) {
        return b.experienceYears - a.experienceYears;
      });
    } else if (sort === "specialty") {
      copy.sort(function (a, b) {
        return a.specialty.localeCompare(b.specialty) || a.name.localeCompare(b.name);
      });
    } else {
      copy.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
    return copy;
  }

  function sortClinics(list, sort) {
    var copy = list.slice();
    if (sort === "city") {
      copy.sort(function (a, b) {
        return a.city.localeCompare(b.city) || a.name.localeCompare(b.name);
      });
    } else if (sort === "type") {
      copy.sort(function (a, b) {
        return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
      });
    } else {
      copy.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
    return copy;
  }

  /** Build the shared "directory" harness used by both directories. */
  /** Read filter seeds from the current URL query string. */
  function querySeeds(keys) {
    var seeds = {};
    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (error) {
      return seeds;
    }
    keys.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        seeds[key === "q" ? "search" : key] = value;
      }
    });
    return seeds;
  }

  function createDirectory(config) {
    var resultsRoot = UI.qs(config.resultsSelector);
    if (!resultsRoot) {
      return null;
    }
    var filterHost = UI.qs(config.filterSelector);
    var paginationHost = UI.qs(config.paginationSelector);
    var state = { page: 1, search: "", sort: config.defaultSort, filters: {} };

    var seeds = querySeeds(config.seedKeys || []);
    state.search = seeds.search || "";
    state.filters = seeds;
    state.sort = config.defaultSort;

    var panel = UI.createFilterPanel({
      idPrefix: config.idPrefix,
      panelTitle: config.panelTitle,
      searchLabel: config.searchLabel,
      searchPlaceholder: config.searchPlaceholder,
      filters: config.filters,
      sortOptions: config.sortOptions,
      initial: seeds,
      onChange: function (values) {
        state.search = values.search;
        state.sort = values.sort;
        state.filters = values;
        state.page = 1;
        update();
        UI.announce("Directory updated. " + countMatches() + " results shown.");
      }
    });
    if (filterHost) {
      filterHost.textContent = "";
      filterHost.appendChild(panel.element);
    }

    function countMatches() {
      return apply().length;
    }

    function apply() {
      var list = config.all();
      var filtered = list.filter(function (item) {
        return config.matches(item, state);
      });
      return config.sortItems(filtered, state.sort);
    }

    function update() {
      var sorted = apply();
      var totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
      if (state.page > totalPages) {
        state.page = totalPages;
      }
      var start = (state.page - 1) * PAGE_SIZE;
      var pageItems = sorted.slice(start, start + PAGE_SIZE);

      panel.setCount(sorted.length, config.all().length, config.noun);
      UI.renderCollection(resultsRoot, pageItems, config.renderItem, config.empty);

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
    return { update: update, state: state };
  }

  function initDoctorDirectory() {
    if (initialized.doctors === true) {
      return;
    }
    initialized.doctors = true;

    createDirectory({
      resultsSelector: "[data-doctor-results]",
      filterSelector: "[data-doctor-filters]",
      paginationSelector: "[data-doctor-pagination]",
      idPrefix: "doctor-filter",
      noun: "fictional doctor profiles",
      panelTitle: "Filter doctors",
      searchLabel: "Search by name or specialty",
      searchPlaceholder: "For example: Nusrat, cardiology",
      defaultSort: "name-asc",
      paginationLabel: "Doctor results pagination",
      seedKeys: ["q", "specialty", "consultation", "city"],
      all: function () {
        return DATA.doctors;
      },
      filters: [
        {
          key: "specialty",
          label: "Specialty",
          options: DATA.uniqueValues(DATA.doctors, "specialty"),
          allLabel: "All specialties"
        },
        {
          key: "consultation",
          label: "Consultation type",
          options: DATA.consultationTypes.slice(),
          allLabel: "All consultation types"
        },
        {
          key: "city",
          label: "City",
          options: DATA.cities.slice(),
          allLabel: "All cities"
        }
      ],
      sortOptions: [
        { value: "name-asc", label: "Name (A–Z)" },
        { value: "specialty", label: "Specialty (A–Z)" },
        { value: "fee-asc", label: "Sample fee (low to high)" },
        { value: "experience-desc", label: "Illustrative experience (most first)" }
      ],
      matches: function (doctor, state) {
        var term = state.search;
        if (term) {
          var haystack = (
            doctor.name +
            " " +
            doctor.specialty +
            " " +
            doctor.city +
            " " +
            doctor.qualifications +
            " " +
            doctor.consultationTypes.join(" ")
          ).toLowerCase();
          if (haystack.indexOf(term) === -1) {
            return false;
          }
        }
        if (state.filters.specialty && doctor.specialty !== state.filters.specialty) {
          return false;
        }
        if (state.filters.consultation && doctor.consultationTypes.indexOf(state.filters.consultation) === -1) {
          return false;
        }
        if (state.filters.city && doctor.city !== state.filters.city) {
          return false;
        }
        return true;
      },
      sortItems: sortDoctors,
      renderItem: renderDoctorCard,
      empty: {
        title: "No fictional doctor profiles match your search",
        text: "Try a different name, specialty, consultation type or city. All records are demonstration data.",
        actionLabel: "Reset the directory",
        actionHref: UI.pageUrl("doctors.html")
      }
    });
  }

  function initClinicDirectory() {
    if (initialized.clinics === true) {
      return;
    }
    initialized.clinics = true;

    createDirectory({
      resultsSelector: "[data-clinic-results]",
      filterSelector: "[data-clinic-filters]",
      paginationSelector: "[data-clinic-pagination]",
      idPrefix: "clinic-filter",
      noun: "fictional clinic records",
      panelTitle: "Filter clinics",
      searchLabel: "Search clinics",
      searchPlaceholder: "For example: Dhanmondi, cardiology",
      defaultSort: "name-asc",
      paginationLabel: "Clinic results pagination",
      seedKeys: ["q", "type", "city", "service"],
      all: function () {
        return DATA.clinics;
      },
      filters: [
        {
          key: "type",
          label: "Clinic type",
          options: DATA.uniqueValues(DATA.clinics, "type"),
          allLabel: "All clinic types"
        },
        {
          key: "city",
          label: "City",
          options: DATA.cities.slice(),
          allLabel: "All cities"
        },
        {
          key: "service",
          label: "Service",
          options: (function () {
            var seen = {};
            var services = [];
            DATA.clinics.forEach(function (clinic) {
              clinic.services.forEach(function (service) {
                if (!seen[service]) {
                  seen[service] = true;
                  services.push(service);
                }
              });
            });
            return services.sort();
          })(),
          allLabel: "All services"
        }
      ],
      sortOptions: [
        { value: "name-asc", label: "Name (A–Z)" },
        { value: "city", label: "City (A–Z)" },
        { value: "type", label: "Clinic type (A–Z)" }
      ],
      matches: function (clinic, state) {
        var term = state.search;
        if (term) {
          var haystack = (
            clinic.name +
            " " +
            clinic.type +
            " " +
            clinic.city +
            " " +
            clinic.address +
            " " +
            clinic.services.join(" ")
          ).toLowerCase();
          if (haystack.indexOf(term) === -1) {
            return false;
          }
        }
        if (state.filters.type && clinic.type !== state.filters.type) {
          return false;
        }
        if (state.filters.city && clinic.city !== state.filters.city) {
          return false;
        }
        if (state.filters.service && clinic.services.indexOf(state.filters.service) === -1) {
          return false;
        }
        return true;
      },
      sortItems: sortClinics,
      renderItem: renderClinicCard,
      empty: {
        title: "No fictional clinics match your search",
        text: "Try another city, clinic type or service. Addresses and facilities shown in this directory are illustrative.",
        actionLabel: "Reset the directory",
        actionHref: UI.pageUrl("clinics.html")
      }
    });
  }

  function initFeaturedDoctors() {
    var roots = UI.qsa("[data-featured-doctors]");
    if (!roots.length) {
      return;
    }
    var featuredIds = ["doc-001", "doc-002", "doc-005", "doc-007"];
    var featured = DATA.doctors.filter(function (doctor) {
      return featuredIds.indexOf(doctor.id) !== -1;
    });
    roots.forEach(function (root) {
      if (root.dataset.featuredInit === "true") {
        return;
      }
      root.dataset.featuredInit = "true";
      UI.renderCollection(root, featured, renderDoctorCard, {
        title: "No featured profiles available",
        text: "The fictional doctor dataset could not be displayed."
      });
    });
  }

  function initFeaturedClinics() {
    var roots = UI.qsa("[data-featured-clinics]");
    if (!roots.length) {
      return;
    }
    var featured = DATA.clinics.slice(0, 3);
    roots.forEach(function (root) {
      if (root.dataset.featuredInit === "true") {
        return;
      }
      root.dataset.featuredInit = "true";
      UI.renderCollection(root, featured, renderClinicCard, {
        title: "No clinic records available",
        text: "The fictional clinic dataset could not be displayed."
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Detail pages                                                           */
  /* ---------------------------------------------------------------------- */

  function initDoctorDetail() {
    var scope = UI.qs('[data-detail="doctor"]');
    if (!scope || scope.dataset.detailInit === "true") {
      return;
    }
    scope.dataset.detailInit = "true";

    var id = UI.getParam("id");
    var doctor = DATA.doctorById(id);

    if (!doctor) {
      UI.renderNotFound(scope, {
        title: "That fictional doctor profile was not found",
        text: "The profile you asked for is not in the demonstration dataset. Choose a doctor from the directory to view a sample profile.",
        actionLabel: "Browse the doctor directory",
        actionHref: UI.pageUrl("doctors.html")
      });
      return;
    }

    UI.setPageTitle(doctor.name + " — fictional " + doctor.specialty + " profile");
    UI.setBreadcrumbCurrent(doctor.name);

    var clinic = DATA.clinicById(doctor.clinicId);
    var facts = UI.el("ul", { className: "detail-facts" });
    [
      { term: "Specialty", value: doctor.specialty },
      { term: "Qualifications", value: doctor.qualifications },
      { term: "Illustrative experience", value: doctor.experienceYears + " years (demonstration figure)" },
      { term: "Consultation types", value: consultationSummary(doctor) },
      { term: "Languages", value: doctor.languages.join(", ") },
      { term: "Sample consultation fee", value: UI.formatBDT(doctor.fee) + " (illustrative)" }
    ].forEach(function (fact) {
      var item = UI.el("li", { className: "detail-facts__item" });
      item.appendChild(UI.icon("info", "detail-facts__icon"));
      var body = UI.el("div");
      body.appendChild(UI.el("span", { className: "detail-facts__term", text: fact.term }));
      body.appendChild(UI.el("p", { className: "detail-facts__value", text: fact.value }));
      item.appendChild(body);
      facts.appendChild(item);
    });

    UI.fillTemplate(scope, {
      name: doctor.name,
      specialty: doctor.specialty,
      qualifications: doctor.qualifications,
      about: doctor.about,
      image: UI.assetUrl(doctor.image),
      imageAlt: doctorImageAlt(doctor),
      clinicName: clinic ? clinic.name : "Clinic not recorded in this demo",
      requestLink: UI.pageUrl("appointments.html") + "?doctor=" + encodeURIComponent(doctor.id),
      clinicLink: clinic ? UI.pageUrl("clinic-details.html") + "?id=" + encodeURIComponent(clinic.id) : "#"
    });

    var factsSlot = UI.slot(scope, "facts");
    factsSlot.appendChild(facts);

    var availabilitySlot = UI.slot(scope, "availability");
    var availabilityList = UI.el("ul", { className: "availability-list" });
    doctor.availability.forEach(function (slot) {
      var row = UI.el("li", { className: "availability-list__row" });
      row.appendChild(UI.el("span", { className: "availability-list__day", text: slot.day }));
      row.appendChild(UI.el("span", { text: slot.slots.join(" · ") }));
      availabilityList.appendChild(row);
    });
    availabilitySlot.appendChild(availabilityList);

    var relatedSlot = UI.slot(scope, "related");
    var related = DATA.doctors
      .filter(function (item) {
        return item.id !== doctor.id && (item.specialty === doctor.specialty || item.city === doctor.city);
      })
      .slice(0, 3);
    if (!related.length) {
      relatedSlot.appendChild(
        UI.el("p", { className: "card__text", text: "No related demonstration profiles in this dataset." })
      );
    } else {
      var relatedGrid = UI.el("ul", { className: "card-grid" });
      UI.renderCollection(relatedGrid, related, renderDoctorCard, {});
      relatedSlot.appendChild(relatedGrid);
    }
  }

  function initClinicDetail() {
    var scope = UI.qs('[data-detail="clinic"]');
    if (!scope || scope.dataset.detailInit === "true") {
      return;
    }
    scope.dataset.detailInit = "true";

    var id = UI.getParam("id");
    var clinic = DATA.clinicById(id);

    if (!clinic) {
      UI.renderNotFound(scope, {
        title: "That fictional clinic record was not found",
        text: "The clinic you asked for is not in the demonstration dataset. Choose a clinic from the directory to view a sample profile.",
        actionLabel: "Browse the clinic directory",
        actionHref: UI.pageUrl("clinics.html")
      });
      return;
    }

    UI.setPageTitle(clinic.name + " — fictional " + clinic.type);
    UI.setBreadcrumbCurrent(clinic.name);

    UI.fillTemplate(scope, {
      name: clinic.name,
      type: clinic.type,
      city: clinic.city,
      address: clinic.address,
      phone: clinic.phone,
      about: clinic.about,
      image: UI.assetUrl(clinic.image),
      imageAlt: "Illustration representing " + clinic.name + ", a fictional " + clinic.type + ".",
      requestLink: UI.pageUrl("appointments.html") + "?clinic=" + encodeURIComponent(clinic.id)
    });

    var hoursSlot = UI.slot(scope, "hours");
    var hoursList = UI.el("ul", { className: "availability-list" });
    clinic.hours.forEach(function (entry) {
      var row = UI.el("li", { className: "availability-list__row" });
      row.appendChild(UI.el("span", { className: "availability-list__day", text: entry.day }));
      row.appendChild(UI.el("span", { text: entry.time }));
      hoursList.appendChild(row);
    });
    hoursSlot.appendChild(hoursList);

    var servicesSlot = UI.slot(scope, "services");
    var serviceList = UI.el("ul", { className: "tag-list" });
    clinic.services.forEach(function (service) {
      serviceList.appendChild(UI.el("li", { className: "badge badge--neutral", text: service }));
    });
    servicesSlot.appendChild(serviceList);

    var departmentsSlot = UI.slot(scope, "departments");
    var departmentList = UI.el("ul", { className: "link-list" });
    clinic.departments.forEach(function (department) {
      departmentList.appendChild(UI.el("li", { text: department + " (illustrative department listing)" }));
    });
    departmentsSlot.appendChild(departmentList);

    var facilitiesSlot = UI.slot(scope, "facilities");
    var facilityList = UI.el("ul", { className: "tag-list" });
    clinic.facilities.forEach(function (facility) {
      facilityList.appendChild(UI.el("li", { className: "badge badge--success", text: facility }));
    });
    facilitiesSlot.appendChild(facilityList);

    var doctorsSlot = UI.slot(scope, "doctors");
    var clinicDoctors = DATA.doctorsForClinic(clinic.id);
    var grid = UI.el("ul", { className: "card-grid" });
    UI.renderCollection(grid, clinicDoctors, renderDoctorCard, {
      title: "No fictional specialists are linked to this clinic",
      text: "This demonstration clinic has no sample doctor records associated with it yet."
    });
    doctorsSlot.appendChild(grid);
  }

  window.MediCareClinic = {
    initDoctorDirectory: initDoctorDirectory,
    initClinicDirectory: initClinicDirectory,
    initDoctorDetail: initDoctorDetail,
    initClinicDetail: initClinicDetail,
    initFeaturedDoctors: initFeaturedDoctors,
    initFeaturedClinics: initFeaturedClinics,
    renderDoctorCard: renderDoctorCard,
    renderClinicCard: renderClinicCard
  };
})(window, document);
