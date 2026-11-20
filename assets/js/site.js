/* TaxSaathi: small enhancements for pages that are already complete in HTML.
 * Menu, search and filters, tabs, print, copy link, contact form → WhatsApp. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Mobile menu
  var mb = $(".menu-btn");
  if (mb) mb.addEventListener("click", function () {
    var open = $("#mobile-nav").classList.toggle("open");
    mb.setAttribute("aria-expanded", String(open));
    mb.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Home quick-start: go straight to the chosen service page.
  var starter = $("#starter");
  if (starter) starter.addEventListener("submit", function (e) { e.preventDefault(); location.href = $("#starter-svc").value; });

  // Old addresses: /services/?s=<old id or path> → the service page.
  var map = $("#svc-map");
  if (map) {
    var s = new URLSearchParams(location.search).get("s");
    if (s) {
      var m = JSON.parse(map.textContent);
      var to = m[s] || (/^\/services\/[a-z0-9-]+\/$/.test(s) ? s : null);
      if (to) location.replace(to);
    }
  }

  // Print / save as PDF
  $$("[data-print]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });

  // Copy link
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var done = function () { var d = $(".copy-done", b); if (d) { d.hidden = false; setTimeout(function () { d.hidden = true; }, 2000); } };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, done); else done();
    });
  });

  // Services catalogue: search + part chips
  var idx = $("[data-filterable]");
  if (idx) {
    var find = $("#find"), part = "all";
    var draw = function () {
      var term = (find.value || "").trim().toLowerCase(), any = false;
      $$(".index-part", idx).forEach(function (p) {
        var vis = 0;
        $$("li[data-search]", p).forEach(function (li) {
          var ok = (part === "all" || p.dataset.part === part) && (!term || li.dataset.search.indexOf(term) !== -1);
          li.hidden = !ok; if (ok) vis++;
        });
        p.hidden = vis === 0; if (vis) any = true;
      });
      $("#no-match").hidden = any;
    };
    find.addEventListener("input", draw);
    $$(".chip-btn[data-filter]").forEach(function (c) {
      c.addEventListener("click", function () {
        part = c.dataset.filter;
        $$(".chip-btn[data-filter]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === c)); });
        draw();
      });
    });
    var hp = (location.hash.match(/^#part-([A-E])$/) || [])[1];
    if (hp) { var chip = $('.chip-btn[data-filter="' + hp + '"]'); if (chip) chip.click(); }
  }

  // Price list search
  var pl = $("#pl-list");
  if (pl) {
    var pf = $("#find");
    pf.addEventListener("input", function () {
      var term = pf.value.trim().toLowerCase(), any = false;
      $$(".pl-part", pl).forEach(function (sec) {
        var vis = 0;
        $$("tbody[data-search]", sec).forEach(function (tb) { var ok = !term || tb.dataset.search.indexOf(term) !== -1; tb.hidden = !ok; if (ok) vis++; });
        sec.hidden = vis === 0; if (vis) any = true;
      });
      $("#no-match").hidden = any;
    });
  }

  // Knowledge list: search + load more
  var kl = $("#k-list");
  if (kl) {
    var kf = $("#k-find"), more = $("#k-more"), showAll = false;
    var kdraw = function () {
      var term = (kf.value || "").trim().toLowerCase(), any = false;
      $$(".k-card", kl).forEach(function (c) {
        var ok = (!term || c.dataset.search.indexOf(term) !== -1) && (showAll || term || !c.classList.contains("is-more"));
        c.hidden = !ok; if (ok) any = true;
      });
      $("#no-match").hidden = any;
      if (more) more.hidden = showAll || !!term;
    };
    kf.addEventListener("input", kdraw);
    if (more) more.addEventListener("click", function () { showAll = true; kdraw(); });
    kdraw();
  }

  // Tools: tabs, authority filter, document lists
  var tabs = $$("[role=tab][data-tab]");
  if (tabs.length) {
    var show = function (key) {
      tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t.dataset.tab === key)); });
      $$("[data-panel]").forEach(function (p) { p.classList.toggle("hidden", p.dataset.panel !== key); });
    };
    tabs.forEach(function (t) { t.addEventListener("click", function () { show(t.dataset.tab); }); });
    var h = { "#documents": "chk", "#calendar": "cal", "#calculator": "calc" }[location.hash];
    if (h && $('[data-tab="' + h + '"]')) show(h);
    $$(".chip-btn[data-auth]").forEach(function (c) {
      c.addEventListener("click", function () {
        $$(".chip-btn[data-auth]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === c)); });
        $$(".deadline").forEach(function (d) { d.hidden = !(c.dataset.auth === "All" || d.dataset.auth === c.dataset.auth); });
      });
    });
    var cs = $("#chk-svc");
    if (cs) cs.addEventListener("change", function () {
      $$("[data-chk]").forEach(function (p) { p.classList.toggle("hidden", p.dataset.chk !== cs.value); });
    });
  }

  // Contact form → WhatsApp (nothing is stored on the site)
  var cf = $("#contact-form");
  if (cf) cf.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = function (id) { return ($("#" + id).value || "").trim(); };
    if (!v("cf-name") || !v("cf-msg")) { cf.reportValidity(); return; }
    var text = "Hello TaxSaathi.\nTopic: " + v("cf-topic") + "\n\n" + v("cf-msg") + "\n\nName: " + v("cf-name") + (v("cf-phone") ? "\nMobile: " + v("cf-phone") : "");
    window.open("https://wa.me/" + cf.dataset.wa + "?text=" + encodeURIComponent(text), "_blank", "noopener");
  });
})();
