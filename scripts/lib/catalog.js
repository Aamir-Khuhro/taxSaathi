/* Service catalogue helpers used by every page that lists services or prices. */
const { esc, money } = require("./util");

module.exports = function makeCatalog(TS, SEO, S) {
  const services = TS.services;
  const seo = (s) => {
    const x = SEO.services[s.id];
    if (!x) throw new Error("No keyword map entry (src/seo.js) for " + s.id);
    return x;
  };
  const path = (s) => `/services/${seo(s).slug}/`;
  const part = (k) => TS.parts.find((p) => p.key === k);
  const items = (s) => (s.model === "unit" ? s.units : s.tiers);
  const fromPrice = (s) => Math.min(...items(s).map((t) => { if (t.fee == null) throw new Error("Missing price in " + s.id); return t.fee; }));
  const code = (s) => { const all = services.filter((x) => x.part === s.part); return `${s.part}.${String(all.indexOf(s) + 1).padStart(2, "0")}`; };

  // Pricing type badge (section 3.8): tiered, per unit, stage-based or subscription.
  const type = (s) => s.model === "tiered" ? { key: "tiered", label: "Tiered" }
    : s.model === "subscription" ? { key: "subscription", label: "Monthly plan" }
    : s.stage ? { key: "stage", label: "Stage-based" }
    : { key: "unit", label: items(s).length === 1 ? "Fixed / per unit" : "Per unit" };

  const perLabel = (s) => s.model === "subscription" ? " per month" : s.model === "unit" ? (s.units.length === 1 && /hour/i.test(s.units[0].criteria) ? " per hour" : " each") : "";

  // 3 to 5 questions per service page (CR-163): the service's own questions,
  // then the three most-searched ones built from its published data.
  function faqs(s) {
    const k = seo(s), name = k.short;
    const cap = name.charAt(0).toUpperCase() + name.slice(1);
    const auto = [
      [`How much does ${name} cost?`, `Our professional fee starts from ${money(fromPrice(s))}${perLabel(s)}. ${s.basis}. Answer the questions on this page to see your exact price and the reason for it. Government fees are always separate.`],
      [`What documents are needed for ${name}?`, `${s.checklist.join("; ")}. ${TS.docsNote}`],
      [`How long does ${name} take?`, `${s.time}. Times are estimates; the timing of government authorities is outside our control. We update you on WhatsApp at each stage.`]
    ];
    const own = (s.faqs || []).map(([q, a]) => [q, a]);
    const list = [...own.slice(0, 2), ...auto, ...own.slice(2)];
    return list.slice(0, 5);
  }

  function related(s, n = 3) {
    const same = services.filter((x) => x.part === s.part && x !== s);
    return same.slice(0, n);
  }

  // Ledger index of services, grouped by part (home + services page).
  function indexHTML() {
    return TS.parts.map((p) => {
      const all = services.filter((s) => s.part === p.key);
      return `<div class="index-part" id="part-${p.key}" data-part="${p.key}">
      <div class="index-part-head"><div class="letter">${p.key}</div><h3>${esc(p.name)}</h3><p>${esc(p.blurb)}</p></div>
      <ul class="index-rows">${all.map((s) => {
        const t = type(s);
        return `<li data-search="${esc((s.name + " " + s.summary + " " + p.name + " " + seo(s).kw).toLowerCase())}"><a href="${path(s)}">
        <span class="code">${code(s)}</span>
        <span class="name">${esc(s.name)}<small>${esc(s.summary)}</small></span>
        <span class="model"><span class="badge badge--${t.key}">${t.label}</span></span>
        <span class="price">from ${money(fromPrice(s))}</span>
        <span class="go" aria-hidden="true">→</span></a></li>`;
      }).join("")}</ul></div>`;
    }).join("");
  }

  return { services, seo, path, part, items, fromPrice, code, type, perLabel, faqs, related, indexHTML };
};
