/* clearcargo.ae – menu, forms, scroll effects */
(function () {
  "use strict";

  // ---------- Edit these before going live ----------
  var CONFIG = {
    // Where quote requests go when no formEndpoint is set (opens the visitor's email app).
    quoteEmail: "hello@clearcargo.ae",
    // Paste a Formspree (or similar) URL, e.g. "https://formspree.io/f/abcdwxyz", to receive requests directly.
    formEndpoint: "",
    // Tracking page URL with {ref} in it, e.g. "https://track.example.com/?ref={ref}". Empty = ask visitors to email.
    trackingUrl: ""
  };

  var doc = document.documentElement;
  doc.classList.add("js");

  // ---------- Footer year ----------
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Mobile menu ----------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menu");
    nav.classList.remove("open");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Menu" : "Close menu");
      nav.classList.toggle("open", !open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { closeMenu(); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !e.target.closest(".site-header")) closeMenu();
    });
  }

  // ---------- Header shadow on scroll ----------
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Reveal on scroll + active nav link ----------
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + "ms";
      io.observe(el);
    });

    var links = nav ? nav.querySelectorAll('a[href^="#"]:not(.btn)') : [];
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (link && entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("active"); });
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- Helpers ----------
  function say(el, text, kind) {
    if (!el) return;
    el.textContent = text;
    el.className = "msg" + (kind ? " " + kind : "");
  }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  // ---------- Tracking ----------
  var trackForm = document.getElementById("track-form");
  if (trackForm) {
    var trackMsg = document.getElementById("track-msg");
    trackForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = trackForm.elements.ref;
      var ref = input.value.trim();
      if (!ref) {
        input.setAttribute("aria-invalid", "true");
        say(trackMsg, "Please enter your reference number.", "err");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      if (CONFIG.trackingUrl) {
        window.open(CONFIG.trackingUrl.replace("{ref}", encodeURIComponent(ref)), "_blank", "noopener");
        say(trackMsg, "Opening tracking for " + ref + "…", "ok");
      } else {
        var mail = "mailto:" + CONFIG.quoteEmail + "?subject=" + encodeURIComponent("Tracking request: " + ref);
        trackMsg.className = "msg";
        trackMsg.textContent = "Online tracking is coming soon. ";
        var a = document.createElement("a");
        a.href = mail;
        a.textContent = "Email us your reference";
        trackMsg.appendChild(a);
        trackMsg.appendChild(document.createTextNode(" and your coordinator will reply with the latest status."));
      }
    });
  }

  // ---------- Quote form ----------
  var quoteForm = document.getElementById("quote-form");
  if (quoteForm) {
    var quoteMsg = document.getElementById("quote-msg");
    var submit = quoteForm.querySelector('button[type="submit"]');

    quoteForm.addEventListener("input", function (e) {
      if (e.target.hasAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid");
    });

    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = quoteForm.elements;

      // Honeypot: bots fill hidden fields, people don't.
      if (f.company_website && f.company_website.value) return;

      var firstBad = null;
      [["name", function (v) { return v.length > 1; }],
       ["email", isEmail],
       ["service", function (v) { return v !== ""; }]].forEach(function (rule) {
        var el = f[rule[0]];
        var ok = rule[1](el.value.trim());
        if (ok) el.removeAttribute("aria-invalid");
        else { el.setAttribute("aria-invalid", "true"); firstBad = firstBad || el; }
      });
      if (firstBad) {
        say(quoteMsg, "Please fill in your name, a valid email and the service you need.", "err");
        firstBad.focus();
        return;
      }

      var data = {
        name: f.name.value.trim(),
        company: f.company.value.trim(),
        email: f.email.value.trim(),
        phone: f.phone.value.trim(),
        service: f.service.value,
        route: f.route.value.trim(),
        details: f.details.value.trim()
      };

      if (CONFIG.formEndpoint) {
        submit.disabled = true;
        say(quoteMsg, "Sending…");
        fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(Object.assign({ _subject: "Quote request: " + data.service }, data))
        }).then(function (res) {
          if (!res.ok) throw new Error(res.status);
          quoteForm.reset();
          say(quoteMsg, "Thank you. We'll reply within one working day.", "ok");
        }).catch(function () {
          say(quoteMsg, "Sorry, that didn't send. Please email " + CONFIG.quoteEmail + " instead.", "err");
        }).then(function () { submit.disabled = false; });
        return;
      }

      var body = [
        "Name: " + data.name,
        "Company: " + (data.company || "-"),
        "Email: " + data.email,
        "Phone / WhatsApp: " + (data.phone || "-"),
        "Service: " + data.service,
        "From → To: " + (data.route || "-"),
        "",
        "Cargo details:",
        data.details || "-"
      ].join("\n");
      window.location.href = "mailto:" + CONFIG.quoteEmail +
        "?subject=" + encodeURIComponent("Quote request: " + data.service + (data.company ? " – " + data.company : "")) +
        "&body=" + encodeURIComponent(body);
      say(quoteMsg, "Your email app should open with the request filled in. If not, email " + CONFIG.quoteEmail + ".", "ok");
    });
  }
})();
