(function () {
  "use strict";

  var PRODUCT_IMAGES = [
    { src: "assets/images/stay-driven-bag.jpg", alt: "Front view of the white RLA Stay Driven duffel bag" },
    { src: "assets/images/stay-driven-bag-side.jpg", alt: "Angled side view of the RLA Stay Driven duffel bag" },
    { src: "assets/images/stay-driven-bag-detail.jpg", alt: "Mesh side pocket and hardware detail on the RLA Stay Driven duffel bag" },
    { src: "assets/images/stay-driven-bag-back.jpg", alt: "RLA Stay Driven duffel bag with adjustable shoulder strap" }
  ];

  var selectedSize = "Small";
  var selectedPrice = 95;

  function setupGallery() {
    var main = document.querySelector("[data-product-main-image]");
    var buttons = document.querySelectorAll("[data-gallery-index]");
    if (!main || !buttons.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var index = Number(button.getAttribute("data-gallery-index"));
        var image = PRODUCT_IMAGES[index];
        if (!image) return;
        main.src = image.src;
        main.alt = image.alt;
        buttons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
      });
    });
  }

  function updateSize(button, size, price) {
    selectedSize = size;
    selectedPrice = price;
    document.querySelectorAll("[data-size-option]").forEach(function (item) {
      item.setAttribute("aria-pressed", String(item === button));
    });
    var priceDisplay = document.querySelector("[data-price-display]");
    if (priceDisplay) {
      priceDisplay.replaceChildren();
      priceDisplay.appendChild(document.createTextNode("$" + price + " AUD "));
      var detail = document.createElement("span");
      detail.textContent = "— " + size;
      priceDisplay.appendChild(detail);
    }
  }

  function setupSizes() {
    document.querySelectorAll("[data-size-option]").forEach(function (button) {
      button.addEventListener("click", function () {
        updateSize(button, button.getAttribute("data-size"), Number(button.getAttribute("data-price")));
      });
    });

    var guideButton = document.querySelector("[data-size-guide-toggle]");
    var guide = document.querySelector("[data-size-guide]");
    if (guideButton && guide) {
      guideButton.addEventListener("click", function () {
        var open = guideButton.getAttribute("aria-expanded") === "true";
        guideButton.setAttribute("aria-expanded", String(!open));
        guide.hidden = open;
        guideButton.textContent = open ? "View size guide" : "Hide size guide";
      });
    }

    var buyButton = document.querySelector("[data-buy-now]");
    if (buyButton) {
      buyButton.addEventListener("click", function () {
        window.location.href = "checkout.html?product=RLA+Stay+Driven+Duffel+Bag&size=" + selectedSize + "&price=" + selectedPrice + "&shipping=3-4+weeks";
      });
    }
  }

  function setupCheckout() {
    var form = document.getElementById("checkoutForm");
    if (!form) return;

    var STRIPE_LINKS = {
      small: "https://buy.stripe.com/bJe3cw6DabTDds45TFfw401",
      large: "https://buy.stripe.com/3cIcN69Pm2j30FibdZfw400"
    };

    var params = new URLSearchParams(window.location.search);
    var product = params.get("product") || "RLA Merch Item";
    var sizeRaw = params.get("size") || "—";
    var price = params.get("price") || "—";
    var shipping = params.get("shipping") || "1-2 weeks";
    var size = sizeRaw.trim();
    var sizeKey = size.toLowerCase();

    document.getElementById("f-product").value = product;
    document.getElementById("f-size").value = size;
    document.getElementById("f-price").value = "$" + price + " AUD";
    document.getElementById("s-product").textContent = product;
    document.getElementById("s-size").textContent = size;
    document.getElementById("s-price").textContent = "$" + price + " AUD";
    document.getElementById("s-shipping").textContent = "FREE 🌍 — " + shipping;
    document.getElementById("shipping-note").textContent = "Free worldwide shipping — allow " + shipping + " for delivery.";

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var submitButton = form.querySelector("[type='submit']");
      submitButton.disabled = true;
      submitButton.textContent = "Processing...";

      var stripeUrl = STRIPE_LINKS[sizeKey];
      if (!stripeUrl) {
        window.alert("Invalid size selected. Please go back and choose Small or Large.");
        submitButton.disabled = false;
        submitButton.textContent = "Continue to payment →";
        return;
      }

      try {
        var response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          window.location.href = stripeUrl;
        } else {
          window.alert("There was an issue submitting your order details. Please try again.");
          submitButton.disabled = false;
          submitButton.textContent = "Continue to payment →";
        }
      } catch (error) {
        window.alert("Something went wrong. Please check your internet connection and try again.");
        submitButton.disabled = false;
        submitButton.textContent = "Continue to payment →";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupGallery();
    setupSizes();
    setupCheckout();
  });
})();
