/* Text blocks used on more than one page. Exact wording from the brief. */

// How it works (CR-100), exact wording.
exports.STEPS = [
  ["Choose your service and answer a few questions.", "Only the ones that decide your price. Your price and the reason for it appear straight away."],
  ["Send your order on WhatsApp.", "One tap sends your quote to us. We confirm what is included and share payment details."],
  ["Share your documents.", "We tell you exactly which documents are needed. Send clear phone photos or PDFs on WhatsApp."],
  ["We do the work.", "We update you on WhatsApp at each stage and send your completed documents when the work is done."]
];

exports.stepsHTML = () => `<div class="steps steps--4">${exports.STEPS.map(([h, p]) => `<div class="step"><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>`;

// Fee rules (kept from the live site; payment wording per CR-03).
exports.RULES = [
  ["Published formula", "Every tier, unit price, stage and add-on is listed publicly with its criteria."],
  ["No private prices", "No one gets a different price for the same answers. Promotions are public and dated."],
  ["Quote before payment", "A line-by-line breakdown and the reason for your tier, before you pay."],
  ["Price lock", "The price on your quote is the price you pay for 14 days from the quote date, even if prices change."],
  ["Changes need your consent", "If your documents put the job in another tier, work pauses until you accept a revised quote."],
  ["Government fees apart", "Taxes, duty and filing charges sit on separate lines at actual cost, never inside our fee."]
];

exports.rulesHTML = () => `<div class="rules">${exports.RULES.map(([h, p]) => `<div class="rule"><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>`;

exports.PAYMENT = "We confirm your order on WhatsApp and share payment details. Work starts when payment is received.";

exports.DISCLAIMER = "General information only; not a substitute for advice on your specific facts.";

// Article cards (home row, knowledge list, related articles).
exports.articleCard = (a, esc, fmtDate) => `<article class="k-card" data-cat="${esc(a.categorySlug)}" data-search="${esc((a.title + " " + a.summary + " " + a.category).toLowerCase())}">
  <a href="${a.url}">
    <span class="badge">${esc(a.category)}</span>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.summary)}</p>
    <span class="k-meta"><time datetime="${a.date}">${fmtDate(a.date)}</time> · ${a.readTime} min read</span>
  </a>
</article>`;

// Testimonials component (CR-22): kept in code, off by SHOW_TESTIMONIALS.
exports.testimonialsHTML = (S, list, esc) => {
  if (!S.SHOW_TESTIMONIALS || !list || !list.length) return "";
  return `<section class="section section--white"><div class="wrap"><div class="sec-head"><div class="num"><b>—</b>Clients</div><div><h2>What clients say</h2></div></div>
  <div class="grid grid-3">${list.map((t) => `<figure class="card"><blockquote>${esc(t.quote)}</blockquote><figcaption>${esc(t.name)}</figcaption></figure>`).join("")}</div></div></section>`;
};
