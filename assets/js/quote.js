/* TaxSaathi quote panel (service pages): CR-01 to CR-07.
 * Same answers → same price, always. No per-client price input exists.
 * The order is sent as a pre-filled WhatsApp message; nothing is stored here. */
(function () {
  "use strict";
  var el = document.getElementById("quote-data");
  if (!el) return;
  var D = JSON.parse(el.textContent), svc = D.service;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var pkr = function (n) { return "PKR " + Number(n).toLocaleString("en-US"); };
  var fmt = function (d) { return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); };

  var answers = {}, addons = [], quoteNo = null, issued = null;
  var details = { name: "", mobile: "", city: "", notes: "", agree: false };
  svc.questions.forEach(function (q) { if (q.type === "number") answers[q.id] = q.min; });

  /* ---------- Engine ---------- */
  function compute() {
    var choiceQs = svc.questions.filter(function (q) { return !q.type; });
    var complete = choiceQs.every(function (q) { return answers[q.id] != null; });
    var q = { complete: complete, lines: [], reasons: [] };
    if (!complete) return q;
    var base, label, qty = 1;
    if (svc.model === "unit") {
      var uq = choiceQs.filter(function (x) { return x.options.some(function (o) { return o.unit; }); })[0];
      var opt = uq.options[answers[uq.id]];
      base = svc.items.filter(function (u) { return u.key === opt.unit; })[0];
      var nq = svc.questions.filter(function (x) { return x.type === "number"; })[0];
      if (nq) qty = Math.max(nq.min || 1, Math.min(nq.max || 99, parseInt(answers[nq.id], 10) || 1));
      q.reasons.push(base.name + ": you selected “" + opt.label + "”" + (qty > 1 ? " × " + qty : ""));
      label = base.name + (qty > 1 ? " × " + qty : "");
    } else {
      var idx = 0;
      choiceQs.forEach(function (x) { idx = Math.max(idx, x.options[answers[x.id]].tier || 0); });
      base = svc.items[idx];
      if (idx === 0) q.reasons.push(base.name + " tier: all your answers fit the " + base.name + " criteria");
      else choiceQs.forEach(function (x) {
        var o = x.options[answers[x.id]];
        if ((o.tier || 0) === idx) q.reasons.push(base.name + " tier: you answered “" + o.label + "” to “" + x.label + "”");
      });
      label = base.name + " tier" + (svc.model === "subscription" ? " (monthly)" : "");
    }
    q.item = base; q.label = label;
    q.lines.push({ label: "Professional fee: " + label, amount: base.fee * qty });
    addons.forEach(function (k) {
      var a = svc.addons.filter(function (x) { return x.key === k; })[0];
      if (a) q.lines.push({ label: "Add-on: " + a.name, amount: a.fee });
    });
    q.fee = q.lines.reduce(function (s, l) { return s + l.amount; }, 0);
    q.tax = D.taxOnFee && D.taxOnFee.rate ? Math.round(q.fee * D.taxOnFee.rate) : 0;
    q.total = q.fee + q.tax;
    return q;
  }

  function newQuoteNo() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
    return "TS-" + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + "-" + String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  }
  function validUntil() { var d = new Date(issued); d.setDate(d.getDate() + D.validityDays); return d; }

  function answerList() {
    return svc.questions.filter(function (q) { return answers[q.id] != null && answers[q.id] !== ""; }).map(function (q) {
      var v = answers[q.id];
      if (q.type === "date") v = fmt(new Date(v + "T00:00:00"));
      else if (!q.type) v = q.options[v].label;
      return [q.label, String(v)];
    });
  }

  /* ---------- Message (Appendix A) ---------- */
  function message(q, notes) {
    var lines = [
      "Hello TaxSaathi, I would like to place an order.",
      "Quote no: " + quoteNo,
      "Valid until: " + fmt(validUntil()),
      "Service: " + svc.name,
      "Tier or unit: " + q.reasons.join("; "),
      "My answers: " + answerList().map(function (a) { return a[0] + ": " + a[1]; }).join("; ")
    ];
    if (addons.length) lines.push("Add-ons: " + q.lines.slice(1).map(function (l) { return l.label.replace("Add-on: ", "") + " " + pkr(l.amount); }).join("; "));
    lines.push(
      "Professional fee: " + pkr(q.fee),
      "Taxes on your fee: " + (q.tax ? pkr(q.tax) : "none"),
      "Government fees: paid separately at actual cost",
      "Name: " + details.name,
      "Mobile: " + details.mobile,
      "City: " + details.city,
      "Notes: " + (notes || "none"),
      "Please confirm and share payment details."
    );
    return lines.join("\n");
  }
  // Keep the message within the limit by shortening the notes (CR-01).
  function fittedMessage(q) {
    var notes = details.notes, msg = message(q, notes);
    while (msg.length > D.limit && notes.length) { notes = notes.slice(0, Math.max(0, notes.length - (msg.length - D.limit) - 1)) + "…"; if (notes === "…") notes = ""; msg = message(q, notes); }
    return msg;
  }

  /* ---------- Render ---------- */
  function linesHTML(q) {
    var h = '<ul class="lines">';
    q.lines.forEach(function (l) { h += "<li><span>" + esc(l.label) + "</span><span>" + pkr(l.amount) + "</span></li>"; });
    if (q.tax) h += "<li><span>" + esc(D.taxOnFee.label || "Taxes on our fee (if applicable)") + "</span><span>" + pkr(q.tax) + "</span></li>";
    (svc.govFees.length ? svc.govFees : ["Government fees, if any"]).forEach(function (g) { h += '<li class="gov"><span>' + esc(g) + "</span><span>At cost</span></li>"; });
    h += '<li class="total"><span>Our fee' + (svc.model === "subscription" ? " per month" : "") + "</span><span>" + pkr(q.total) + "</span></li></ul>";
    return h;
  }

  function deadlineHTML() {
    if (!svc.intake || !answers.deadline) return "";
    var t = new Date(answers.deadline + "T00:00:00"), now = new Date(); now.setHours(0, 0, 0, 0);
    var d = Math.round((t - now) / 86400000);
    var h = '<div class="deadline-box">Deadline<strong>' + fmt(t) + "</strong>" + (d < 0 ? "This date has passed. Message us today." : d === 0 ? "Due today." : d + " day" + (d === 1 ? "" : "s") + " left.") + "</div>";
    if (d <= 7) h += '<div class="urgent"><span aria-hidden="true">⚑</span><span>Deadline within 7 days. Your matter is given priority as soon as you send your order. Consider adding Urgent handling.</span></div>';
    return h;
  }

  function valid() { return details.name.trim() && details.mobile.replace(/\D/g, "").length >= 10 && details.city.trim() && details.agree; }

  var R = $("qresult");
  function render() {
    var q = compute();
    document.querySelectorAll("#tiers .tier").forEach(function (t) { t.classList.toggle("active", !!(q.complete && t.dataset.key === q.item.key)); });
    if (!q.complete) {
      quoteNo = null;
      R.innerHTML = deadlineHTML() + '<p class="muted small" style="margin:0">Answer the questions above to see your price, the reason for it, and what\'s included.</p>';
      return;
    }
    if (!quoteNo) { quoteNo = newQuoteNo(); issued = new Date(); }
    R.innerHTML = deadlineHTML() +
      '<div class="qp-top"><div><span class="label-mono" style="margin:0">Quote ' + quoteNo + '</span><div class="qp-meta" style="margin-top:6px"><span class="chip chip--gold">Valid until ' + fmt(validUntil()) + "</span></div></div>" +
      '<div class="stamp" aria-hidden="true">' + (svc.model === "unit" ? "Unit" : "Tier") + "<b>" + esc(q.item.name.split(" ")[0]) + "</b>TaxSaathi</div></div>" +
      q.reasons.map(function (r) { return '<p class="reason">' + esc(r) + "</p>"; }).join("") +
      linesHTML(q) +
      '<p class="small muted" style="margin:10px 0 0">Estimated time: ' + esc(svc.time) + "</p>" +
      '<div class="inc-exc"><div class="inc"><strong>Included</strong><ul>' + svc.included.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      '</ul></div><div class="exc"><strong>Not included</strong><ul>' + svc.excluded.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div>" +
      '<form class="order-step" id="order" novalidate>' +
        '<h3>Send your order</h3><p class="small muted">We confirm your order on WhatsApp and share payment details. Work starts when payment is received. Do not send your CNIC or documents here.</p>' +
        '<div class="field"><label for="o-name">Full name <span aria-hidden="true">*</span></label><input type="text" id="o-name" required autocomplete="name" value="' + esc(details.name) + '"></div>' +
        '<div class="field"><label for="o-mobile">Mobile number <span aria-hidden="true">*</span></label><input type="tel" id="o-mobile" required autocomplete="tel" inputmode="tel" placeholder="03xx xxxxxxx" value="' + esc(details.mobile) + '"></div>' +
        '<div class="field"><label for="o-city">City <span aria-hidden="true">*</span></label><input type="text" id="o-city" required autocomplete="address-level2" value="' + esc(details.city) + '"></div>' +
        '<div class="field"><label for="o-notes">Notes (optional)</label><textarea id="o-notes" maxlength="300" rows="3" aria-describedby="o-notes-h">' + esc(details.notes) + '</textarea><span class="hint" id="o-notes-h">Up to 300 characters.</span></div>' +
        '<label class="check"><input type="checkbox" id="o-agree" required' + (details.agree ? " checked" : "") + '><span>I have read the <a href="/policies/#terms" target="_blank" rel="noopener">Terms</a> and <a href="/policies/#refund" target="_blank" rel="noopener">Refund Policy</a>. <span aria-hidden="true">*</span></span></label>' +
        '<div class="qp-actions">' +
          '<button class="btn btn--primary btn--block btn--wa" type="submit" id="o-wa"' + (valid() ? "" : " disabled") + '>Order on WhatsApp</button>' +
          '<p class="small muted" id="o-help"' + (valid() ? " hidden" : "") + '>Fill in your name, mobile number and city, and tick the box, to send your order.</p>' +
          '<div class="row"><button class="btn btn--ghost btn--sm" type="button" id="o-copy"' + (valid() ? "" : " disabled") + '>Copy message</button><button class="btn btn--ghost btn--sm" type="button" id="o-mail"' + (valid() ? "" : " disabled") + '>Email instead</button></div>' +
          '<p class="small" id="o-copied" role="status" hidden>Message copied. Paste it into WhatsApp or an email to ' + esc(D.email) + ".</p>" +
          '<button class="btn btn--ghost btn--sm btn--plain" type="button" id="o-print">Download or print quote</button>' +
        "</div></form>";
    wireOrder(q);
  }

  function wireOrder(q) {
    var f = $("order");
    var sync = function () {
      details.name = $("o-name").value; details.mobile = $("o-mobile").value; details.city = $("o-city").value;
      details.notes = $("o-notes").value.slice(0, 300); details.agree = $("o-agree").checked;
      var ok = !!valid();
      ["o-wa", "o-copy", "o-mail"].forEach(function (id) { $(id).disabled = !ok; });
      $("o-help").hidden = ok;
    };
    f.addEventListener("input", sync); f.addEventListener("change", sync);
    f.addEventListener("submit", function (e) {
      e.preventDefault(); sync(); if (!valid()) return;
      window.open("https://wa.me/" + D.wa + "?text=" + encodeURIComponent(fittedMessage(q)), "_blank", "noopener");
    });
    $("o-copy").addEventListener("click", function () {
      sync(); if (!valid()) return;
      var text = fittedMessage(q), shown = function () { $("o-copied").hidden = false; };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(shown, function () { fallbackCopy(text); shown(); });
      else { fallbackCopy(text); shown(); }
    });
    $("o-mail").addEventListener("click", function () {
      sync(); if (!valid()) return;
      location.href = "mailto:" + D.email + "?subject=" + encodeURIComponent("Order " + quoteNo + ": " + svc.name) + "&body=" + encodeURIComponent(fittedMessage(q));
    });
    $("o-print").addEventListener("click", function () { printQuote(q); });
  }
  function fallbackCopy(text) {
    var t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (e) { /* ignore */ } document.body.removeChild(t);
  }

  /* ---------- Print quote (CR-05) ---------- */
  function printQuote(q) {
    var P = $("print-quote");
    P.innerHTML =
      '<div class="pq-head"><svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><rect width="40" height="40" fill="#0E5A4B"/><path d="M9 11h22M20 11v19" stroke="#fff" stroke-width="4.2"/><rect x="26" y="25" width="7" height="7" fill="#F2B544"/></svg>' +
      "<div><strong>" + esc(D.brand) + "</strong><br>" + esc(D.phone) + " · " + esc(D.email) + "</div></div>" +
      "<h1>Quote " + quoteNo + "</h1>" +
      '<p class="pq-dates">Date: ' + fmt(issued) + " · Valid until: " + fmt(validUntil()) + "</p>" +
      "<h2>" + esc(svc.name) + "</h2>" +
      "<h3>Your answers</h3><ul>" + answerList().map(function (a) { return "<li>" + esc(a[0]) + ": <strong>" + esc(a[1]) + "</strong></li>"; }).join("") + "</ul>" +
      q.reasons.map(function (r) { return '<p class="reason">' + esc(r) + "</p>"; }).join("") +
      linesHTML(q) +
      "<h3>Fee rules</h3><ul>" + D.rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" +
      '<p class="pq-foot">To order, send this quote number on WhatsApp ' + esc(D.phone) + ". General information only; not a substitute for advice on your specific facts.</p>";
    document.body.classList.add("print-quote-on");
    window.print();
    setTimeout(function () { document.body.classList.remove("print-quote-on"); }, 500);
  }

  /* ---------- Inputs ---------- */
  var form = $("qform");
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  form.addEventListener("input", function (e) {
    var t = e.target;
    if (t.dataset.addon != null) {
      addons = Array.prototype.slice.call(form.querySelectorAll("[data-addon]:checked")).map(function (x) { return x.value; });
    } else if (t.dataset.q) {
      answers[t.dataset.q] = t.type === "radio" ? Number(t.value) : t.value;
      if (t.type !== "date") quoteNo = null; // a new set of answers is a new quote
    } else return;
    render();
  });
  render();
})();
