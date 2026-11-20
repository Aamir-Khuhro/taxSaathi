const { rulesHTML, DISCLAIMER } = require("./shared");

/* Price list (CR-90). Rendered in the HTML itself so search engines and
 * visitors without scripts see every price. Search only hides rows. */
module.exports = function priceList(ctx) {
  const { S, TS, SEO, U, L, C } = ctx;
  const { esc, money, fmtDate, addMonths } = U;
  const P = SEO.pages.priceList;

  const parts = TS.parts.map((p) => {
    const svcs = C.services.filter((s) => s.part === p.key);
    return `<section class="pl-part" data-part="${p.key}">
      <h2 class="pl-h">Part ${p.key} · ${esc(p.name)}</h2>
      <div class="table-wrap"><table>
        <thead><tr><th scope="col" style="width:34%">Service</th><th scope="col">Tier / unit and criteria</th><th scope="col" class="num">Fee</th></tr></thead>
        ${svcs.map((s) => {
          const items = C.items(s), t = C.type(s);
          return `<tbody data-search="${esc((s.name + " " + p.name + " " + C.seo(s).kw).toLowerCase())}">${items.map((it, i) => `<tr>${i === 0 ? `<th scope="rowgroup" rowspan="${items.length}" class="pl-svc"><a href="${C.path(s)}"><strong>${esc(s.name)}</strong></a>
              <div class="crit"><span class="badge badge--${t.key}">${t.label}</span> ${esc(s.time)}</div>
              <div class="crit"><strong>${esc(s.basis)}</strong></div>
              ${s.govFees.length ? `<div class="crit">Plus, at actual cost: ${esc(s.govFees.join("; "))}</div>` : ""}</th>` : ""}
            <td><strong>${esc(it.name)}</strong><div class="crit">${esc(it.criteria)}</div></td>
            <td class="num">${money(it.fee)}${s.model === "subscription" ? '<div class="crit">per month</div>' : s.model === "unit" ? '<div class="crit">each</div>' : ""}</td></tr>`).join("")}</tbody>`;
        }).join("")}
      </table></div></section>`;
  }).join("");

  const body = `<section class="section" style="padding-top:40px">
    <div class="wrap">
      <div class="notice notice--info" style="margin-bottom:20px"><span aria-hidden="true">ℹ</span><span>Government fees, taxes and stamp duty are <strong>never</strong> part of our fee. They are shown separately and paid at actual cost. Taxes on our fee, if any apply, are shown as a separate line on your quote.</span></div>
      <div class="grid grid-4 pl-types" style="margin-bottom:12px">
        <div class="card"><span class="badge badge--unit">Per unit</span><h3 style="margin-top:12px">Same price for everyone</h3><p>Nil returns, consultations and stamp challans. The price does not depend on your business.</p></div>
        <div class="card"><span class="badge badge--tiered">Tiered</span><h3 style="margin-top:12px">Set by published criteria</h3><p>Registrations and annual returns. Turnover, transactions, members or assets place the job in a tier.</p></div>
        <div class="card"><span class="badge badge--stage">Stage-based</span><h3 style="margin-top:12px">One stage at a time</h3><p>Audits, assessment proceedings, petitions and appeals. Each stage starts only after you approve and pay for it.</p></div>
        <div class="card"><span class="badge badge--subscription">Monthly plan</span><h3 style="margin-top:12px">Every month</h3><p>Monthly sales tax returns, priced by invoices per month and number of authorities.</p></div>
      </div>
      <div id="pl-list">${parts}</div>
      <p class="muted" id="no-match" hidden>Nothing matches your search. <a href="/contact/">Ask us</a>.</p>

      <h2 class="pl-h2" id="addons">Add-ons</h2>
      <div class="table-wrap"><table><thead><tr><th scope="col">Add-on</th><th scope="col">What it covers</th><th scope="col" class="num">Price</th></tr></thead><tbody>${Object.values(TS.addons).map((a) =>
        `<tr><td><strong>${esc(a.name)}</strong></td><td>${esc(a.desc)}</td><td class="num">${money(a.fee)}${a.perUnit ? `<div class="crit">${esc(a.perUnit)}</div>` : ""}</td></tr>`).join("")}</tbody></table></div>

      <h2 class="pl-h2" id="rate-card">Standard rate card</h2>
      <p class="muted">Used for rate-card services, staged work and jobs that fit no published tier (“custom scope”). You approve a written scope before any work starts.</p>
      <div class="table-wrap"><table><thead><tr><th scope="col">Item</th><th scope="col">Unit</th><th scope="col" class="num">Rate</th></tr></thead><tbody>${TS.rateCard.map((r) =>
        `<tr><td><strong>${esc(r.name)}</strong></td><td>${esc(r.unit)}</td><td class="num">${money(r.fee)}</td></tr>`).join("")}</tbody></table></div>
    </div>
  </section>

  <section class="section band" id="fees">
    <div class="wrap">
      <div class="sec-head"><div class="num"><b>§</b>Fee rules</div><div><h2>How every price on this list is applied.</h2><p>Full text in our <a class="on-dark" href="/policies/#fees">Fee Transparency Policy</a>.</p></div></div>
      ${rulesHTML()}
    </div>
  </section>

  <section class="section" id="refund">
    <div class="wrap prose">
      <h2 style="margin-top:0;border-top:0;padding-top:0">Refunds, in short</h2>
      <ul>
        <li>Before work starts: a full refund of the professional fee you paid.</li>
        <li>After work has started: a refund of the fee for the part of the work not yet done.</li>
        <li>Government fees, duty and challans are not refundable by us once paid to the authority.</li>
      </ul>
      <p>Read the full <a href="/policies/#refund">Refund Policy</a>. ${DISCLAIMER}</p>
    </div>
  </section>`;

  return [{ out: "price-list/index.html", html: L.page({
    path: "/price-list/", title: P.title, desc: P.desc, crumbs: [["/price-list/", "Price list"]],
    h1: "Tax consultant fees: our price list",
    lead: "Every TaxSaathi fee in one place: the NTN registration fee, return filing fees, notices, add-ons and our standard rate card. The same list applies to every client, and every figure is our full professional fee.",
    headExtra: `<dl class="pl-meta">
        <div><dt>Version</dt><dd>${esc(TS.pricing.version)}</dd></div>
        <div><dt>Effective from</dt><dd>${fmtDate(S.PUBLISHED)}</dd></div>
        <div><dt>Last reviewed</dt><dd>${fmtDate(S.PUBLISHED)}</dd></div>
        <div><dt>Next review</dt><dd>${fmtDate(addMonths(S.PUBLISHED, 3))}</dd></div>
      </dl>
      <div class="filter-bar no-print">
        <div class="search">${U.ICONS.search}<label class="sr-only" for="find">Search the price list</label><input type="search" id="find" placeholder="Search services" autocomplete="off"></div>
        <button class="btn btn--primary btn--plain" type="button" data-print>Download PDF</button>
      </div>`,
    body
  }) }];
};
