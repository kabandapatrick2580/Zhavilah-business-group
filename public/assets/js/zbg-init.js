/*
 * zbg-init.js
 * Inline behaviours that were originally embedded in the PHP pages
 * (contact/subscribe form AJAX, footer "More Services" dropdown, About page
 * "View details" toggle). Loaded last, after the DOM and all libraries.
 */
(function () {
  "use strict";

  // --- About page: "View details" / "Hide details" toggle ---
  window.toggleDetails = function (id) {
    var details = document.getElementById(id);
    if (!details) return;
    if (details.style.display === "none") {
      details.style.display = "block";
      if (window.event && window.event.target)
        window.event.target.textContent = "Hide details";
    } else {
      details.style.display = "none";
      if (window.event && window.event.target)
        window.event.target.textContent = "View details";
    }
  };

  // --- Footer: "More Services" dropdown ---
  var toggle = document.querySelector(".more-services-toggle");
  var dropdown = document.querySelector(".more-services-dropdown");
  if (toggle && dropdown) {
    toggle.addEventListener("click", function () {
      if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "block";
        var up = toggle.querySelector(".arrow");
        if (up) up.textContent = "▲";
      } else {
        dropdown.style.display = "none";
        var down = toggle.querySelector(".arrow");
        if (down) down.textContent = "▼";
      }
    });
  }

  // --- Formspree AJAX submit (contact + subscribe forms share id "my-form") ---
  var forms = document.querySelectorAll("#my-form");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = document.getElementById("my-form-status");
      var data = new FormData(form);
      fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            if (status) status.innerHTML = "Thanks for your submission!";
            form.reset();
          } else {
            response.json().then(function (data) {
              if (Object.hasOwn(data, "errors")) {
                if (status)
                  status.innerHTML = data["errors"]
                    .map(function (error) {
                      return error["message"];
                    })
                    .join(", ");
              } else if (status) {
                status.innerHTML = "Oops! There was a problem submitting your form";
              }
            });
          }
        })
        .catch(function () {
          if (status)
            status.innerHTML = "Oops! There was a problem submitting your form";
        });
    });
  });
})();
