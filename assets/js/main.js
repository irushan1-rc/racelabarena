(function () {
  "use strict";

  var SUPPORTERS_ENDPOINT = "https://szfjzymqmiayvqkhkpuk.supabase.co/rest/v1/supporters?select=username,amount,tier,created_at&order=created_at.desc";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6Zmp6eW1xbWlheXZxa2hrcHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjE0MTcsImV4cCI6MjA5MTEzNzQxN30.4ekWPf_Ic4PoLgBdULXiseHWmPJ4sq3s2LcdkSQUhR8";

  var SITE_LINKS = [
    ["Home", "index.html"],
    ["Experience", "experience.html"],
    ["How It Works", "how-it-works.html"],
    ["Drive Module", "drive-module.html"],
    ["Events", "events.html"],
    ["Journal", "journal.html"],
    ["Merch", "merch.html"],
    ["About", "about.html"],
    ["FAQ", "faq.html"]
  ];

  function currentFile() {
    var path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function buildLink(label, href, mobile) {
    var link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (href === currentFile()) link.setAttribute("aria-current", "page");
    if (mobile && label === "Home") link.className = "mobile-home-link";
    return link;
  }

  function renderSiteChrome() {
    if (!document.querySelector("link[rel='manifest']")) {
      var manifest = document.createElement("link");
      manifest.rel = "manifest";
      manifest.href = "site.webmanifest";
      document.head.appendChild(manifest);
    }

    var headerMount = document.querySelector("[data-site-header]");
    var footerMount = document.querySelector("[data-site-footer]");

    if (headerMount) {
      headerMount.className = "site-header";
      headerMount.setAttribute("data-header", "");

      var shell = document.createElement("div");
      shell.className = "header-shell";

      var brand = document.createElement("a");
      brand.className = "brand";
      brand.href = "index.html";
      brand.setAttribute("aria-label", "RaceLab Arena home");
      var logo = document.createElement("img");
      logo.src = "assets/images/rla-logo.png";
      logo.width = 400;
      logo.height = 266;
      logo.alt = "RaceLab Arena";
      brand.appendChild(logo);

      var desktopNav = document.createElement("nav");
      desktopNav.className = "desktop-nav desktop-nav-full";
      desktopNav.setAttribute("aria-label", "Primary navigation");
      SITE_LINKS.forEach(function (item) { desktopNav.appendChild(buildLink(item[0], item[1], false)); });

      var cta = document.createElement("a");
      cta.className = "header-cta";
      cta.href = "register.html";
      cta.textContent = "Join the waitlist";

      var toggle = document.createElement("button");
      toggle.className = "menu-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", "mobile-menu");
      toggle.setAttribute("aria-label", "Open navigation menu");
      toggle.setAttribute("data-menu-toggle", "");
      toggle.appendChild(document.createElement("span"));
      toggle.appendChild(document.createElement("span"));

      shell.appendChild(brand);
      shell.appendChild(desktopNav);
      shell.appendChild(cta);
      shell.appendChild(toggle);
      headerMount.appendChild(shell);

      var mobileNav = document.createElement("nav");
      mobileNav.className = "mobile-menu";
      mobileNav.id = "mobile-menu";
      mobileNav.hidden = true;
      mobileNav.setAttribute("data-mobile-menu", "");
      mobileNav.setAttribute("aria-label", "Mobile navigation");
      SITE_LINKS.forEach(function (item) { mobileNav.appendChild(buildLink(item[0], item[1], true)); });
      [["Partners", "partners.html"], ["Pricing", "pricing.html"], ["Contact", "contact.html"]].forEach(function (item) {
        mobileNav.appendChild(buildLink(item[0], item[1], true));
      });
      var mobileCta = buildLink("Join the waitlist", "register.html", true);
      mobileCta.className = "mobile-menu-cta";
      mobileNav.appendChild(mobileCta);
      headerMount.appendChild(mobileNav);
    }

    if (footerMount) {
      footerMount.className = "site-footer";
      var top = document.createElement("div");
      top.className = "container footer-top footer-top-wide";

      var identity = document.createElement("div");
      identity.className = "footer-brand";
      var footerBrand = document.createElement("a");
      footerBrand.className = "brand brand-footer";
      footerBrand.href = "index.html";
      footerBrand.setAttribute("aria-label", "RaceLab Arena home");
      var footerLogo = document.createElement("img");
      footerLogo.src = "assets/images/rla-logo.png";
      footerLogo.width = 400;
      footerLogo.height = 266;
      footerLogo.alt = "RaceLab Arena";
      footerBrand.appendChild(footerLogo);
      identity.appendChild(footerBrand);
      var line = document.createElement("p");
      line.textContent = "Real cars. Real control. Real experience.";
      identity.appendChild(line);
      var location = document.createElement("span");
      location.textContent = "In development — Perth, Western Australia";
      identity.appendChild(location);
      top.appendChild(identity);

      var groups = [
        ["Experience", [["Experience", "experience.html"], ["How it works", "how-it-works.html"], ["Drive Module", "drive-module.html"], ["Events", "events.html"], ["Pricing", "pricing.html"]]],
        ["Company", [["About RLA", "about.html"], ["Journal", "journal.html"], ["Partners", "partners.html"], ["Contact", "contact.html"], ["FAQ", "faq.html"]]],
        ["Store + legal", [["Merchandise", "merch.html"], ["Stay Driven bag", "product-bag.html"], ["Privacy", "privacy.html"], ["Terms", "terms.html"], ["Register interest", "register.html"]]],
        ["Connect", [["Instagram ↗", "https://www.instagram.com/racelab.arena?igsh=MWY2ejIybW03NGd5MQ=="], ["Facebook ↗", "https://www.facebook.com/share/1J4wxdN9aW/"], ["TikTok ↗", "https://www.tiktok.com/@racelab.arena"], ["Support the build ↗", "https://buymeacoffee.com/racelabarena"]]]
      ];

      groups.forEach(function (group) {
        var col = document.createElement("div");
        col.className = "footer-col";
        var heading = document.createElement("h2");
        heading.textContent = group[0];
        col.appendChild(heading);
        group[1].forEach(function (item) {
          var link = document.createElement("a");
          link.href = item[1];
          link.textContent = item[0];
          if (item[1].startsWith("http")) {
            link.target = "_blank";
            link.rel = "noopener";
          }
          col.appendChild(link);
        });
        top.appendChild(col);
      });

      var bottom = document.createElement("div");
      bottom.className = "container footer-bottom";
      var copyright = document.createElement("span");
      copyright.textContent = "© 2026 RaceLab Arena. All rights reserved.";
      var code = document.createElement("span");
      code.textContent = "RLA / Perth / Western Australia";
      var back = document.createElement("a");
      back.href = "#top";
      back.textContent = "Back to top ↑";
      bottom.appendChild(copyright);
      bottom.appendChild(code);
      bottom.appendChild(back);

      footerMount.appendChild(top);
      footerMount.appendChild(bottom);
    }
  }

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

  function setupAccordions() {
    document.querySelectorAll("[data-accordion-button]").forEach(function (button) {
      var panelId = button.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      function toggleAccordion() {
        var open = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      }

      button.addEventListener("click", toggleAccordion);
      button.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleAccordion();
        }
      });
    });
  }

  function setupJournalFilter() {
    var buttons = document.querySelectorAll("[data-journal-filter]");
    var cards = document.querySelectorAll("[data-journal-card]");
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-journal-filter");
        buttons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
        cards.forEach(function (card) {
          card.hidden = value !== "all" && card.getAttribute("data-category") !== value;
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderSiteChrome();
    setupHeader();
    setupMenu();
    setupReveals();
    setupScrollSpy();
    setupShare();
    setupAccordions();
    setupJournalFilter();
    loadSupporters();
  });
})();
