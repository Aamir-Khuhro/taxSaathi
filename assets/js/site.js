/* TaxSaathi — shared layout (header, footer, WhatsApp) and the quote engine. */
(function () {
  const B = TS.business;

  /* ---------- Icons ---------- */
  const I = {
    id: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M15 10h3M15 13h3"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
    stamp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l-1 7h-4z"/><path d="M5 14h14v3H5zM4 21h16"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h12M9 12h12M9 18h12M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>',
    calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
    in: '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z"/></svg>',
    fb: '<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM16 2H8a6 6 0 0 0-6 6v8a6 6 0 0 0 6 6h8a6 6 0 0 0 6-6V8a6 6 0 0 0-6-6zm4 14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4z"/></svg>',
    yt: '<svg viewBox="0 0 24 24"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15V9l5.2 3z"/></svg>'
  };
  TS.icon = (k) => I[k] || "";

  const LOGO = '<svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" fill="#0E5A4B"/><path d="M9 11h22M20 11v19" stroke="#fff" stroke-width="4.2"/><rect x="26" y="25" width="7" height="7" fill="#F2B544"/></svg>';

  /* ---------- Helpers ---------- */
  TS.esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  TS.money = (n) => n == null ? '<span class="tbd">To be set</span>' : "PKR " + Number(n).toLocaleString("en-PK");
  TS.moneyText = (n) => n == null ? "To be set" : "PKR " + Number(n).toLocaleString("en-PK");
  TS.part = (k) => TS.parts.find((p) => p.key === k);
  TS.service = (id) => TS.services.find((s) => s.id === id);
  TS.priceItems = (s) => s.model === "unit" ? s.units : s.tiers;
  TS.qs = (k) => new URLSearchParams(location.search).get(k);

  // Lowest published fee across a service's tiers/units. null while prices are unset.
  TS.fromPrice = (s) => {
    const fees = TS.priceItems(s).map((t) => t.fee).filter((f) => f != null);
    return fees.length ? Math.min(...fees) : null;
  };
  TS.partFrom = (key) => {
    const fees = TS.services.filter((s) => s.part === key).map(TS.fromPrice).filter((f) => f != null);
    return fees.length ? Math.min(...fees) : null;
  };

  /* ---------- Quote engine ----------
   * Same inputs → same price, always. No per-client input exists. */
  TS.computeQuote = function (svc, answers, addonKeys) {
    answers = answers || {};
    addonKeys = addonKeys || [];
    const choiceQs = svc.questions.filter((q) => !q.type);
    const missing = choiceQs.filter((q) => answers[q.id] == null);
    const q = { service: svc, complete: missing.length === 0, lines: [], reasons: [], govLines: svc.govFees || [] };
    if (!q.complete) return q;

    let base, label, qty = 1;
    if (svc.model === "unit") {
      const unitQ = choiceQs.find((x) => x.options.some((o) => o.unit));
      const unitKey = unitQ.options[answers[unitQ.id]].unit;
      base = svc.units.find((u) => u.key === unitKey);
      const qtyQ = svc.questions.find((x) => x.type === "number");
      if (qtyQ) qty = Math.max(qtyQ.min || 1, Math.min(qtyQ.max || 99, parseInt(answers[qtyQ.id], 10) || 1));
      q.reasons.push(`${base.name}: you selected “${unitQ.options[answers[unitQ.id]].label}”` + (qty > 1 ? ` × ${qty}` : ""));
      label = base.name + (qty > 1 ? ` × ${qty}` : "");
    } else {
      let idx = 0;
      choiceQs.forEach((x) => { idx = Math.max(idx, x.options[answers[x.id]].tier || 0); });
      base = svc.tiers[idx];
      if (idx === 0) q.reasons.push(`${base.name} tier: all your answers fit the ${base.name} criteria`);
      else choiceQs.forEach((x) => {
        const o = x.options[answers[x.id]];
        if ((o.tier || 0) === idx) q.reasons.push(`${base.name} tier: you answered “${o.label}” to “${x.label}”`);
      });
      q.tierIndex = idx;
      label = `${base.name} tier` + (svc.model === "subscription" ? " · monthly" : "");
    }
    q.item = base; q.qty = qty;
    q.lines.push({ label: "Professional fee — " + label, amount: base.fee == null ? null : base.fee * qty });
    addonKeys.forEach((k) => { const a = TS.addons[k]; if (a) q.lines.push({ label: "Add-on — " + a.name, amount: a.fee, addon: k }); });

    const unset = q.lines.some((l) => l.amount == null);
    q.subtotal = unset ? null : q.lines.reduce((s, l) => s + l.amount, 0);
    if (TS.pricing.taxOnFee && q.subtotal != null) {
      const t = Math.round(q.subtotal * TS.pricing.taxOnFee.rate);
      q.taxLine = { label: TS.pricing.taxOnFee.label, amount: t };
      q.total = q.subtotal + t;
    } else q.total = q.subtotal;
    return q;
  };

  TS.quoteNumber = () => {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `TSQ-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
  };
  TS.validUntil = () => {
    const d = new Date(); d.setDate(d.getDate() + TS.pricing.quoteValidityDays);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
  TS.daysUntil = (iso) => {
    if (!iso) return null;
    const t = new Date(iso + "T00:00:00"); const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((t - now) / 86400000);
  };

  TS.linesHTML = function (q) {
    let h = '<ul class="lines">';
    q.lines.forEach((l) => { h += `<li><span>${TS.esc(l.label)}</span><span>${TS.money(l.amount)}</span></li>`; });
    if (q.taxLine) h += `<li><span>${TS.esc(q.taxLine.label)}</span><span>${TS.money(q.taxLine.amount)}</span></li>`;
    q.govLines.forEach((g) => { h += `<li class="gov"><span>${TS.esc(g)}</span><span>At cost</span></li>`; });
    h += `<li class="total"><span>Our fee${q.service.model === "subscription" ? " per month" : ""}</span><span>${TS.money(q.total)}</span></li></ul>`;
    return h;
  };

  // Encode a quote's inputs so the order page rebuilds the identical quote.
  TS.encodeInputs = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  TS.decodeInputs = (s) => { try { return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch (e) { return null; } };

  /* ---------- Layout ---------- */
  const NAV = [
    ["services.html", "Services"], ["price-list.html", "Price List"], ["how-it-works.html", "How It Works"],
    ["tools.html", "Free Tools"], ["knowledge.html", "Knowledge"], ["about.html", "About"], ["faq.html", "FAQ"], ["contact.html", "Contact"]
  ];
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const cur = (href) => (here === href || (href === "services.html" && here === "service.html")) ? ' aria-current="page"' : "";
  const waLink = (msg) => `https://wa.me/${B.phoneIntl}?text=${encodeURIComponent(msg || "Assalam o Alaikum TaxSaathi, I have a question.")}`;
  TS.waLink = waLink;

  function header() {
    return `
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap">
  <div class="tb-left">Clear prices. Same rules for everyone.</div>
  <div><a href="tel:+${B.phoneIntl}">${B.phone}</a> &nbsp;·&nbsp; <a href="mailto:${B.email}">${B.email}</a></div>
</div></div>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="TaxSaathi home">${LOGO}
      <span><span class="brand-name">TaxSaathi</span><span class="brand-tag">${B.tagline}</span></span></a>
    <nav class="nav" aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}"${cur(h)}>${t}</a>`).join("")}</nav>
    <div class="header-actions">
      <a class="btn btn--ghost btn--sm btn--plain login" href="login.html">Client login</a>
      <a class="btn btn--primary btn--sm" href="services.html">Get your price</a>
      <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">MENU</button>
    </div>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">
    ${NAV.map(([h, t]) => `<a href="${h}"${cur(h)}>${t}</a>`).join("")}
    <a href="policies.html">Policies</a>
    <div class="mn-actions"><a class="btn btn--primary" href="services.html">Get your price</a><a class="btn btn--ghost" href="login.html">Client login</a></div>
  </nav>
</header>`;
  }

  function footer() {
    const svcLinks = TS.services.slice(0, 6).map((s) => `<li><a href="service.html?s=${s.id}">${TS.esc(s.name.replace(/\s*\(.*\)/, ""))}</a></li>`).join("");
    return `
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-word"><div class="w">Tax<span>Saathi</span></div><div class="u" lang="ur">ٹیکس ساتھی</div></div>
    <div class="foot-grid">
      <div>
        <h4>${B.tagline}</h4>
        <p>Tax, regulatory and corporate-compliance help for individuals, partnerships and small companies across Pakistan. Every price is worked out from published rules.</p>
        <div class="socials">
          <a href="${B.social.linkedin}" aria-label="LinkedIn">${I.in}</a><a href="${B.social.facebook}" aria-label="Facebook">${I.fb}</a>
          <a href="${B.social.instagram}" aria-label="Instagram">${I.ig}</a><a href="${B.social.youtube}" aria-label="YouTube">${I.yt}</a>
        </div>
      </div>
      <div><h4>Services</h4><ul>${svcLinks}<li><a href="services.html">All services →</a></li></ul></div>
      <div><h4>TaxSaathi</h4><ul>
        <li><a href="price-list.html">Price list</a></li><li><a href="how-it-works.html">How it works</a></li>
        <li><a href="tools.html">Free tools</a></li><li><a href="knowledge.html">Knowledge centre</a></li>
        <li><a href="about.html">About</a></li><li><a href="faq.html">FAQ</a></li><li><a href="policies.html">Policies</a></li></ul></div>
      <div><h4>Contact</h4><ul>
        <li><a href="tel:+${B.phoneIntl}">${B.phone}</a></li><li><a href="${waLink()}" target="_blank" rel="noopener">WhatsApp us</a></li>
        <li><a href="mailto:${B.email}">${B.email}</a></li><li>${B.address}</li></ul></div>
    </div>
    <div class="foot-disclaimer"><strong>General information only;</strong> not a substitute for advice on your specific facts. TaxSaathi is a private consultancy and is not a government body or an authorised representative of FBR, SECP, SRB, PRA or any other authority.</div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} TaxSaathi (sole proprietorship), Karachi.</span>
      <span><a href="policies.html#privacy">Privacy</a> · <a href="policies.html#terms">Terms</a> · <a href="policies.html#refund">Refunds</a> · <a href="policies.html#fees">Fee transparency</a></span></div>
  </div>
</footer>
<a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${I.wa}<span>WhatsApp</span></a>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.outerHTML = header();
    if (f) f.outerHTML = footer();
    const mb = document.querySelector(".menu-btn");
    if (mb) mb.addEventListener("click", () => {
      const open = document.getElementById("mobile-nav").classList.toggle("open");
      mb.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll("[data-feature]").forEach((el) => { if (!TS.features[el.dataset.feature]) el.remove(); });
  });
})();

/* Service index (home + services page): ledger rows grouped by part. */
TS.indexHTML = function (term) {
  term = (term || "").toLowerCase();
  const models = { tiered: "Tiered", unit: "Per unit", subscription: "Monthly plan" };
  return TS.parts.map((p) => {
    const all = TS.services.filter((s) => s.part === p.key);
    const svcs = all.filter((s) => !term || (s.name + s.summary + p.name).toLowerCase().includes(term));
    if (!svcs.length) return "";
    return `<div class="index-part" id="part-${p.key}" style="scroll-margin-top:96px">
      <div class="index-part-head"><div class="letter">${p.key}</div><h3>${p.name}</h3><p>${p.blurb}</p></div>
      <ul class="index-rows">${svcs.map((s) => `<li><a href="service.html?s=${s.id}">
        <span class="code">${p.key}.${String(all.indexOf(s) + 1).padStart(2, "0")}</span>
        <span class="name">${TS.esc(s.name)}<small>${TS.esc(s.summary)}</small></span>
        <span class="model">${models[s.model]}</span>
        <span class="price">from ${TS.money(TS.fromPrice(s))}</span>
        <span class="go">→</span></a></li>`).join("")}</ul></div>`;
  }).join("");
};
