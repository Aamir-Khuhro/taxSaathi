const { DISCLAIMER } = require("./shared");

/* Services catalogue (/services/) and one page per service (/services/<slug>/). */
module.exports = function services(ctx) {
  const { S, TS, SEO, U, L, C, articles } = ctx;
  const { esc, money, jsonData, fmtDate } = U;
  const out = [];

  /* ---------- Catalogue ---------- */
  const P = SEO.pages.services;
  const chips = `<div class="chips no-print" role="group" aria-label="Filter by part">
    <button type="button" class="chip-btn" aria-pressed="true" data-filter="all">All</button>
    ${TS.parts.map((p) => `<button type="button" class="chip-btn" aria-pressed="false" data-filter="${p.key}">${p.key}. ${esc(p.name)}</button>`).join("")}
  </div>`;
  out.push({ out: "services/index.html", html: L.page({
    path: "/services/", title: P.title, desc: P.desc, crumbs: [["/services/", "Services"]],
    h1: "Tax services and prices",
    lead: "Tax registration, income tax return filing, notice replies, advice and stamp duty. Choose a service to see its published prices and get your own quote in under a minute.",
    headExtra: `<div class="filter-bar no-print">
      <div class="search">${U.ICONS.search}<label class="sr-only" for="find">Search services</label><input type="search" id="find" placeholder="Search, e.g. NTN, SRB, notice, stamp" autocomplete="off"></div>
      ${chips}
    </div>
    <div class="badge-key small muted">Pricing types: <span class="badge badge--tiered">Tiered</span> <span class="badge badge--unit">Per unit</span> <span class="badge badge--stage">Stage-based</span> <span class="badge badge--subscription">Monthly plan</span></div>`,
    body: `<section class="section" style="padding-top:40px">
      <div class="wrap"><div class="index" id="svc-index" data-filterable>${C.indexHTML()}</div>
      <p class="muted" id="no-match" hidden>No service matches your search. <a href="/contact/">Ask us</a>, we may still be able to help.</p></div>
    </section>
    ${jsonData("svc-map", { ...Object.fromEntries(C.services.map((s) => [s.id, C.path(s)])), "stamp-duty-challan": C.path(C.services.find((s) => s.id === "stamp-duty-challan-sindh")) })}`
  }) });

  /* ---------- Service pages ---------- */
  for (const s of C.services) {
    const k = C.seo(s), part = C.part(s.part), t = C.type(s), path = C.path(s);
    const items = C.items(s);
    const per = s.model === "subscription" ? '<span class="small muted"> /month</span>' : "";

    const tiers = items.map((it) => `<div class="tier" data-key="${esc(it.key)}"><h3 class="tier-name">${esc(it.name)}</h3><div class="t-price">${money(it.fee)}${per}</div><p>${esc(it.criteria)}</p></div>`).join("");
    const addons = s.addons.map((key) => TS.addons[key]);
    const faqs = C.faqs(s);
    const related = C.related(s);
    const helpful = articles.filter((a) => a.service === k.slug).concat(articles.filter((a) => a.service !== k.slug && a.part === s.part)).slice(0, 2);

    // Questions rendered in HTML (works before the script loads).
    const form = s.questions.map((q) => {
      if (q.type === "number") return `<div class="field"><label for="q-${q.id}">${esc(q.label)}</label>${q.help ? `<span class="hint" id="h-${q.id}">${esc(q.help)}</span>` : ""}<input type="number" id="q-${q.id}" data-q="${q.id}" min="${q.min}" max="${q.max}" value="${q.min}" inputmode="numeric"${q.help ? ` aria-describedby="h-${q.id}"` : ""}></div>`;
      if (q.type === "date") return `<div class="field"><label for="q-${q.id}">${esc(q.label)}</label><input type="date" id="q-${q.id}" data-q="${q.id}" aria-describedby="h-${q.id}"><span class="hint" id="h-${q.id}">We plan the work backwards from this date.</span></div>`;
      return `<fieldset class="field q-set"><legend class="label">${esc(q.label)}</legend>
        ${q.help ? `<span class="hint">${esc(q.help)}</span>` : ""}
        <div class="choice-group">${q.options.map((o, i) => `<label class="choice"><input type="radio" name="${q.id}" value="${i}" data-q="${q.id}"><span class="c-main">${esc(o.label)}</span></label>`).join("")}</div></fieldset>`;
    }).join("");

    // Data the quote script needs: this service only, plus settings.
    const qdata = {
      service: { id: s.id, name: s.name, model: s.model, intake: s.intake || null, time: s.time,
        items: items.map(({ key, name, fee }) => ({ key, name, fee })),
        questions: s.questions, govFees: s.govFees, included: s.included, excluded: s.excluded,
        addons: s.addons.map((key) => ({ key, name: TS.addons[key].name, fee: TS.addons[key].fee })) },
      wa: S.WHATSAPP_NUMBER, email: S.EMAIL, brand: S.BRAND, phone: S.PHONE,
      validityDays: S.QUOTE_VALIDITY_DAYS, taxOnFee: S.TAX_ON_FEE, limit: S.WHATSAPP_MESSAGE_LIMIT,
      rules: ["Same answers give the same price, for everyone.", "Government fees are separate, at actual cost.", "If your documents show different facts, we send a revised quote and pause until you accept it.", "Price on this quote is fixed for 14 days from the quote date."]
    };

    const ld = [
      { "@type": "Service", name: s.name, serviceType: k.kw, description: s.summary, url: L.abs(path),
        provider: { "@id": L.abs("/#org") }, areaServed: { "@type": "Country", name: "Pakistan" },
        offers: { "@type": "AggregateOffer", priceCurrency: "PKR", lowPrice: C.fromPrice(s), highPrice: Math.max(...items.map((i) => i.fee)), offerCount: items.length } },
      { "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
    ];

    const body = `<section class="section" style="padding-top:40px">
    <div class="wrap svc-layout">
      <div class="svc-main">
        <div class="svc-section">
          <h2><span class="n">01</span> How much does ${esc(k.short)} cost?</h2>
          <div class="tiers" id="tiers">${tiers}</div>
          <p class="small muted" style="margin-top:12px">${esc(s.unitNote || (s.model !== "unit" ? "Your tier is the highest tier any of your answers points to." : "The same choice always gives the same price."))}</p>
        </div>
        <div class="svc-section">
          <h2><span class="n">02</span> Documents you provide</h2>
          <ul class="checklist">${s.checklist.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
          <p class="docs-note"><strong>${esc(TS.docsNote)}</strong></p>
        </div>
        <div class="svc-section">
          <h2><span class="n">03</span> How ${esc(k.short)} works</h2>
          <ol class="process">${s.process.map(([a, b]) => `<li><strong>${esc(a)}</strong><span>${esc(b)}</span></li>`).join("")}</ol>
        </div>
        <div class="svc-section">
          <h2><span class="n">04</span> What is included</h2>
          <div class="inc-exc inc-exc--page">
            <div class="inc"><strong>Included</strong><ul>${s.included.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
            <div class="exc"><strong>Not included</strong><ul>${s.excluded.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
          </div>
          ${s.govFees.length ? `<p class="small muted" style="margin-top:14px">Government fees, paid by you at actual cost: ${esc(s.govFees.join("; "))}.</p>` : ""}
        </div>
        ${addons.length ? `<div class="svc-section">
          <h2><span class="n">05</span> Add-ons</h2>
          <div class="table-wrap"><table><thead><tr><th scope="col">Add-on</th><th scope="col" class="num">Price</th></tr></thead><tbody>${addons.map((a) =>
            `<tr><td><strong>${esc(a.name)}</strong><div class="crit">${esc(a.desc)}</div></td><td class="num">${money(a.fee)}${a.perUnit ? `<div class="crit">${esc(a.perUnit)}</div>` : ""}</td></tr>`).join("")}</tbody></table></div>
        </div>` : ""}
        <div class="svc-section">
          <h2><span class="n">${addons.length ? "06" : "05"}</span> Questions about ${esc(k.short)}</h2>
          <div class="faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><div>${esc(a)}</div></details>`).join("")}</div>
        </div>
        <div class="svc-section related">
          <h2 class="h-small">Related services</h2>
          <ul class="link-list">${related.map((r) => `<li><a href="${C.path(r)}">${esc(r.name)}</a> <span class="muted small">from ${money(C.fromPrice(r))}</span></li>`).join("")}
            <li><a href="/services/#part-${s.part}">All ${esc(part.name.toLowerCase())}</a></li></ul>
          ${helpful.length ? `<h2 class="h-small">Helpful guides</h2><ul class="link-list">${helpful.map((a) => `<li><a href="${a.url}">${esc(a.title)}</a></li>`).join("")}</ul>` : ""}
        </div>
        <div class="disclaimer-box">
          <p><strong>${DISCLAIMER}</strong></p>
          <p style="margin:0">Price list version ${esc(TS.pricing.version)} · last reviewed ${fmtDate(S.PUBLISHED)} · <a href="/price-list/">Full price list</a></p>
        </div>
      </div>

      <aside class="svc-aside" aria-label="Get your price">
        <div class="quote-panel" id="quote-panel">
          <div class="qp-head"><h2>Get your price</h2><p>Instant quote · No sign-up</p></div>
          <form class="qp-body" id="qform" novalidate>
            ${form}
            ${s.addons.length ? `<fieldset class="field q-set"><legend class="label">Add-ons (optional)</legend><div class="choice-group">${addons.map((a, i) =>
              `<label class="choice"><input type="checkbox" value="${s.addons[i]}" data-addon><span class="c-main">${esc(a.name)}<small>${esc(a.desc)}</small></span><span class="c-price">${money(a.fee)}</span></label>`).join("")}</div></fieldset>` : ""}
          </form>
          <div class="qp-result" id="qresult" aria-live="polite"><p class="muted small" style="margin:0">Answer the questions above to see your price, the reason for it, and what's included.</p></div>
          <noscript><div class="qp-result"><p class="small">Your browser has scripts turned off, so the quote can't be worked out here. The prices are listed on this page; message us on <a href="${L.wa(`Hello TaxSaathi, I would like a quote for ${s.name}.`)}">WhatsApp</a> and we will quote you.</p></div></noscript>
        </div>
      </aside>
    </div>
  </section>
  <div id="print-quote" class="print-quote" aria-hidden="true"></div>
  ${jsonData("quote-data", qdata)}`;

    out.push({ out: `services/${k.slug}/index.html`, html: L.page({
      path, title: k.title, desc: k.desc,
      crumbs: [["/services/", "Services"], [`/services/#part-${s.part}`, part.name], [path, s.name]],
      h1: esc(s.name), lead: esc(k.lead),
      headExtra: `<div class="qp-meta" style="margin-top:16px"><span class="badge badge--${t.key}">${t.label}</span><span class="chip chip--gold">From ${money(C.fromPrice(s))}${C.perLabel(s)}</span><span class="chip chip--muted">${esc(s.basis)}</span><span class="chip chip--muted">Time: ${esc(s.time)}</span></div>`,
      ld, body, scripts: ["/assets/js/quote.js"]
    }) });
  }
  return out;
};
