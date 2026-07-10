(function () {
  "use strict";

  var SUPPORTERS_ENDPOINT = "https://szfjzymqmiayvqkhkpuk.supabase.co/rest/v1/supporters?select=username,amount,tier,created_at&order=created_at.desc";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6Zmp6eW1xbWlheXZxa2hrcHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjE0MTcsImV4cCI6MjA5MTEzNzQxN30.4ekWPf_Ic4PoLgBdULXiseHWmPJ4sq3s2LcdkSQUhR8";

  function setupHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;

    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    var header = document.querySelector("[data-header]");
    if (!toggle || !menu) return;

    function setMenu(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      menu.hidden = !open;
      document.body.classList.toggle("menu-open", open);
      if (header) header.classList.toggle("menu-visible", open);
    }

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1180) setMenu(false);
    });
  }

  function setupReveals() {
    var elements = document.querySelectorAll(".reveal");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) { element.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    elements.forEach(function (element) { observer.observe(element); });
  }

  function setupScrollSpy() {
    if (!("IntersectionObserver" in window)) return;

    var links = Array.prototype.slice.call(document.querySelectorAll(".desktop-nav a[href^='#']"));
    var sections = links.map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    }).filter(Boolean);

    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-18% 0px -68%", threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function tierClass(tier) {
    if (tier === "Race Sponsor") return "tier-sponsor";
    if (tier === "Upgrade the build") return "tier-upgrade";
    return "tier-battery";
  }

  function renderSupporterMessage(container, status, message) {
    container.replaceChildren();
    var item = document.createElement("span");
    item.className = "supporter-loading";
    item.textContent = message;
    container.appendChild(item);
    status.textContent = message;
  }

  function renderSupporters(container, status, supporters) {
    container.replaceChildren();

    if (!Array.isArray(supporters) || supporters.length === 0) {
      renderSupporterMessage(container, status, "No supporters yet — be the first.");
      return;
    }

    var fragment = document.createDocumentFragment();
    supporters.forEach(function (supporter) {
      var pill = document.createElement("span");
      var safeName = typeof supporter.username === "string" ? supporter.username.trim() : "Supporter";

      pill.className = "supporter-pill " + tierClass(supporter.tier);
      pill.textContent = "@" + (safeName || "Supporter");
      fragment.appendChild(pill);
    });

    container.appendChild(fragment);
    status.textContent = supporters.length + " supporters loaded.";
  }

  function loadSupporters() {
    var container = document.getElementById("supporters-list");
    var status = document.getElementById("supporter-status");
    if (!container || !status) return;

    fetch(SUPPORTERS_ENDPOINT, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: "Bearer " + SUPABASE_ANON_KEY
      }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Supporter wall request failed");
        return response.json();
      })
      .then(function (supporters) {
        renderSupporters(container, status, supporters);
      })
      .catch(function () {
        renderSupporterMessage(container, status, "Supporter wall is temporarily unavailable.");
      });
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(value);

    return new Promise(function (resolve, reject) {
      var input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("Copy failed"));
      } catch (error) {
        reject(error);
      }
      input.remove();
    });
  }

  function setupShare() {
    var button = document.querySelector("[data-share]");
    var status = document.querySelector("[data-share-status]");
    if (!button || !status) return;

    var url = "https://www.racelabarena.com/";
    var text = "RaceLab Arena connects simulator controls to real physical RC vehicles through live FPV. Built in Perth.";

    button.addEventListener("click", function () {
      if (navigator.share) {
        navigator.share({ title: "RaceLab Arena", text: text, url: url }).catch(function () {});
        return;
      }

      copyText(url).then(function () {
        status.textContent = "RaceLab Arena link copied.";
      }).catch(function () {
        status.textContent = "Copy unavailable. Visit racelabarena.com to share.";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupHeader();
    setupMenu();
    setupReveals();
    setupScrollSpy();
    setupShare();
    loadSupporters();
  });
})();
