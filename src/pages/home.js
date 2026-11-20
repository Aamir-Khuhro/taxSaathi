const { stepsHTML, rulesHTML, articleCard, testimonialsHTML } = require("./shared");

module.exports = function home(ctx) {
  const { S, TS, SEO, U, L, C, articles, testimonials } = ctx;
  const { esc, money, fmtDate } = U;
  const P = SEO.pages.home;

  const options = TS.parts.map((p) => `<optgroup label="${p.key}. ${esc(p.name)}">${C.services.filter((s) => s.part === p.key)
    .map((s) => `<option value="${C.path(s)}">${esc(s.name)}</option>`).join("")}</optgroup>`).join("");

  const sample = ["individual-ntn", "income-tax-return", "monthly-sales-tax-returns", "notice-reply", "stamp-duty-challan-sindh"]
    .map((id) => C.services.find((s) => s.id === id))
    .map((s) => `<tr><td class="mono">${C.code(s)}</td><td><a href="${C.path(s)}"><strong>${esc(s.name)}</strong></a></td><td>${C.type(s).label}</td><td class="num">${money(C.fromPrice(s))}</td></tr>`).join("");

  const latest = articles.slice(0, 3);
  const knowledgeRow = latest.length ? `<section class="section section--white">
    <div class="wrap">
      <div class="sec-head">
        <div class="num"><b>04</b>Knowledge</div>
        <div><h2>From the Knowledge Centre</h2><p>Plain-language guides, one new guide every week.</p></div>
        <a class="link-arrow" href="/knowledge/">All guides</a>
      </div>
      <div class="k-grid">${latest.map((a) => articleCard(a, esc, fmtDate)).join("")}</div>
    </div>
  </section>` : "";
  const n = (i) => String(latest.length ? i : i > 4 ? i - 1 : i).padStart(2, "0");

  const body = `<section class="hero">
    <div class="urdu-mark" lang="ur" aria-hidden="true">${S.BRAND_URDU}</div>
    <div class="wrap">
      <div class="hero-grid">
        <div>
          <span class="label-mono">${esc(S.TAGLINE)}</span>
          <h1>Clear prices. <mark>Same rules</mark> for everyone.</h1>
          <p class="lead">TaxSaathi is a tax consultant in Pakistan for individuals, partnerships and companies: tax registration, income tax return filing, FBR notice replies and stamp duty. You see how your price is worked out before you pay.</p>
          <p class="credential"><a href="/about/">Led by ${esc(S.OWNER)}, ${esc(S.CREDENTIALS)}</a></p>
        </div>
        <form class="starter" id="starter" action="/services/">
          <div class="starter-head"><span>Instant quote · No sign-up</span></div>
          <div class="starter-body">
            <label for="starter-svc">What do you need help with?</label>
            <select id="starter-svc" name="s">${options}</select>
            <button class="btn btn--primary" type="submit">Show my price</button>
          </div>
          <div class="starter-foot">Same answers → same price. No private discounts.</div>
        </form>
      </div>
      <div class="formula" aria-label="How your price is made">
        <div><small>Input</small><strong>Your answers</strong><span>Only what decides the tier</span></div>
        <div class="op" aria-hidden="true">+</div>
        <div><small>Published</small><strong>Our price rules</strong><span>Tiers, units, stages, add-ons</span></div>
        <div class="op" aria-hidden="true">=</div>
        <div><small>Output</small><strong>Your price, with the reason</strong><span>Government fees on separate lines</span></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <div class="num"><b>01</b>Services</div>
        <div><h2>Tax registration, returns, notices and stamp duty.</h2><p>Five kinds of help, one way of pricing. Every service shows its tiers, what's included and what isn't.</p></div>
        <a class="link-arrow" href="/services/">All services</a>
      </div>
      <div class="index">${C.indexHTML()}</div>
    </div>
  </section>

  <section class="section section--white">
    <div class="wrap">
      <div class="sec-head">
        <div class="num"><b>02</b>How it works</div>
        <div><h2>Four steps. Order on WhatsApp.</h2><p>No forms to fill in elsewhere. We reply on WhatsApp.</p></div>
        <a class="link-arrow" href="/how-it-works/">How it works</a>
      </div>
      ${stepsHTML()}
    </div>
  </section>

  <section class="section band">
    <div class="wrap">
      <div class="sec-head">
        <div class="num"><b>03</b>Fee rules</div>
        <div><h2>What “transparent pricing” means here.</h2><p>These rules apply to every client, every quote and every invoice.</p></div>
      </div>
      ${rulesHTML()}
    </div>
  </section>

  ${knowledgeRow}

  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <div class="num"><b>${n(5)}</b>Price list</div>
        <div><h2>A page from our price list.</h2></div>
        <a class="link-arrow" href="/price-list/">Full price list</a>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th scope="col">Ref</th><th scope="col">Service</th><th scope="col">Pricing</th><th scope="col" class="num">From (PKR)</th></tr></thead>
          <tbody>${sample}</tbody>
        </table>
      </div>
    </div>
  </section>

  ${testimonialsHTML(S, testimonials, esc)}

  <section class="section section--white">
    <div class="wrap">
      <div class="sec-head">
        <div class="num"><b>${n(6)}</b>Questions</div>
        <div><h2>Short answers.</h2><p>More in our <a href="/faq/">FAQ</a>.</p></div>
      </div>
      <div class="faq faq--narrow">
        <details><summary>How do I place an order?</summary><div>Choose your service, answer the questions and press Order on WhatsApp. Your quote is sent to us in one message. We confirm what is included and share payment details.</div></details>
        <details><summary>Why isn't there one fixed price per service?</summary><div>A simple return and a complicated one can't honestly cost the same. Instead, your price comes from published tiers and criteria: the same rules for everyone.</div></details>
        <details><summary>Is the tax or duty I owe included in your fee?</summary><div>No. Government taxes, duty and filing charges are always shown on their own lines and paid by you directly.</div></details>
        <details><summary>What if my documents show something different?</summary><div>We send a revised quote in the correct tier and pause work until you accept it. You never pay more without agreeing first.</div></details>
        <details><summary>Can I talk to someone first?</summary><div>Yes. Message us on WhatsApp, or book a paid <a href="${C.path(C.services.find((s) => s.id === "consultation"))}">30-minute consultation</a>.</div></details>
      </div>
    </div>
  </section>

  <section class="cta-band">
    <div class="wrap">
      <div class="cta">
        <div><h2>See your price in under a minute.</h2><p>Choose a service, answer a few questions, get a numbered quote you can print or send.</p></div>
        <div class="cta-actions"><a class="btn btn--gold" href="/services/">Get your price</a><a class="btn btn--light" href="${L.wa(S.WHATSAPP_GREETING)}" ${L.ext}>Ask on WhatsApp</a></div>
      </div>
    </div>
  </section>`;

  return [{ out: "index.html", html: L.page({ path: "/", title: P.title, rawTitle: true, desc: P.desc, pageHead: false, body }) }];
};
