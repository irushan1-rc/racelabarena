(function () {
  "use strict";

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
      var businessDetails = document.createElement("div");
      businessDetails.className = "footer-business";
      var businessEmail = document.createElement("a");
      businessEmail.href = "mailto:info@racelabarena.com";
      businessEmail.textContent = "info@racelabarena.com";
      var businessNumber = document.createElement("span");
      businessNumber.textContent = "ABN 90 706 045 051";
      businessDetails.appendChild(businessEmail);
      businessDetails.appendChild(businessNumber);
      identity.appendChild(businessDetails);
      top.appendChild(identity);

      var groups = [
        ["Experience", [["Experience", "experience.html"], ["How it works", "how-it-works.html"], ["Drive Module", "drive-module.html"], ["Events", "events.html"], ["Pricing", "pricing.html"]]],
        ["Company", [["About RLA", "about.html"], ["Journal", "journal.html"], ["Partners", "partners.html"], ["Contact", "contact.html"], ["FAQ", "faq.html"]]],
        ["Updates + legal", [["Merchandise", "merch.html"], ["Register interest", "register.html"], ["Privacy", "privacy.html"], ["Terms", "terms.html"]]],
        ["Connect", [["Instagram ↗", "https://www.instagram.com/racelab.arena?igsh=MWY2ejIybW03NGd5MQ=="], ["Facebook ↗", "https://www.facebook.com/share/1J4wxdN9aW/"], ["TikTok ↗", "https://www.tiktok.com/@racelab.arena"]]]
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
    setupAccordions();
    setupJournalFilter();
  });
})();
