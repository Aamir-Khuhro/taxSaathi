const { stepsHTML, PAYMENT, DISCLAIMER } = require("./shared");
const fs = require("fs");
const nodePath = require("path");

module.exports = function content(ctx) {
  const { S, TS, SEO, U, L, C, root } = ctx;
  const { esc, fmtDate, money } = U;
  const out = [];
  const svc = (id) => C.services.find((s) => s.id === id);
  const faqLD = (groups) => ({ "@type": "FAQPage", mainEntity: groups.flatMap((g) => g.items).map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) });
  const contactBlock = `<ul class="lines lines--facts">
      <li><span>WhatsApp</span><span><a href="${L.wa(S.WHATSAPP_GREETING)}" ${L.ext}>${esc(S.PHONE)}</a></span></li>
      <li><span>Phone</span><span><a href="tel:${S.PHONE_TEL}">${esc(S.PHONE)}</a></span></li>
      <li><span>Email</span><span><a href="mailto:${S.EMAIL}">${esc(S.EMAIL)}</a></span></li>
      <li><span>Office</span><span>${esc(S.ADDRESS)}</span></li>
      <li><span>Hours</span><span>${esc(S.HOURS)}</span></li>
    </ul>`;

  /* ---------- How it works ---------- */
  {
    const P = SEO.pages.howItWorks;
    out.push({ out: "how-it-works/index.html", html: L.page({
      path: "/how-it-works/", title: P.title, desc: P.desc, crumbs: [["/how-it-works/", "How it works"]],
      h1: "How it works", lead: "From your first question to your completed documents, you always know the price, the reason for it and what happens next. No sign-up needed.",
      body: `<section class="section" style="padding-top:48px"><div class="wrap">${stepsHTML()}
        <p class="notice notice--info" style="margin-top:28px"><span aria-hidden="true">ℹ</span><span>${PAYMENT} Payment is by bank transfer, JazzCash or Easypaisa.</span></p></div></section>

  <section class="section section--white">
    <div class="wrap">
      <div class="section-head"><span class="eyebrow">Pricing models</span><h2>How a price is worked out</h2><p class="lead">Some work costs the same for everyone. Other work depends on the size of your case. Each service page tells you which, and what it depends on.</p></div>
      <div class="grid grid-3">
        <div class="card"><span class="badge badge--unit">Per unit</span><h3>Fixed price</h3><p>Nil returns, consultations and stamp duty challans. One published price, whatever your business.</p></div>
        <div class="card"><span class="badge badge--tiered">Tiered</span><h3>Tiered price</h3><p>Registrations and annual returns. Turnover, transactions, members or assets place the job in Basic, Standard or Complex.</p></div>
        <div class="card"><span class="badge badge--unit">Per unit</span><h3>Priced by notice type</h3><p>Notices from FBR, SRB, PRA, SECP, EOBI and the Board of Revenue. An information request costs less than a show-cause or audit notice.</p></div>
        <div class="card"><span class="badge badge--subscription">Monthly plan</span><h3>Monthly plan</h3><p>Monthly sales tax returns with FBR, SRB or PRA, priced by invoices per month and number of authorities.</p></div>
        <div class="card"><span class="badge badge--stage">Stage-based</span><h3>Stage-based price</h3><p>Audits, assessment proceedings, petitions and appeals. Each stage has its own price and starts only after you approve and pay for it.</p></div>
        <div class="card"><span class="badge">Add-ons</span><h3>Add-ons and custom scope</h3><p>Urgent handling, revisions, earlier years and extra consultation each have a published price. A job that fits no tier is priced at our public <a href="/price-list/#rate-card">rate card</a>, and you approve it first.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap grid grid-2" style="gap:48px;align-items:start">
      <div>
        <span class="eyebrow">When facts change</span>
        <h2>What happens if your documents show something different</h2>
        <p class="lead">Say you told us 60 transactions a month and your documents show 300. We don't quietly charge more.</p>
      </div>
      <ol class="process process--1">
        <li><strong>We pause work</strong><span>Nothing more is done on your order.</span></li>
        <li><strong>We send a revised quote</strong><span>In the correct published tier, with the reason written out.</span></li>
        <li><strong>You decide</strong><span>Accept the revised quote, or cancel under our <a href="/policies/#refund">Refund Policy</a>.</span></li>
        <li><strong>We keep a record</strong><span>Your original quote, the reason and your answer are kept with your order.</span></li>
      </ol>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="wrap"><div class="cta"><div><h2>Ready to see your price?</h2><p>It takes under a minute and there's no obligation.</p></div><div class="cta-actions"><a class="btn btn--gold" href="/services/">Get your price</a><a class="btn btn--light" href="/price-list/">Price list</a></div></div></div>
  </section>`
    }) });
  }

  /* ---------- About (3.7, exact text) ---------- */
  {
    const P = SEO.pages.about;
    const photo = ["abdullah.webp", "abdullah.jpg"].find((f) => fs.existsSync(nodePath.join(root, "assets/img", f)));
    out.push({ out: "about/index.html", html: L.page({
      path: "/about/", title: P.title, desc: P.desc, crumbs: [["/about/", "About"]],
      h1: "About TaxSaathi", lead: "“Saathi” means companion. TaxSaathi helps individuals, partnerships and businesses with registrations, tax returns, notices and stamp duty, with clear prices and plain-language guidance.",
      body: `<section class="section" style="padding-top:48px">
    <div class="wrap grid grid-2" style="gap:48px;align-items:start">
      <div class="prose">
        ${photo ? `<img class="about-photo" src="/assets/img/${photo}" alt="Abdullah, founder of TaxSaathi" width="480" height="560" loading="lazy">` : ""}
        <h2 style="margin-top:0">Abdullah, Founder</h2>
        <p>LLB and LLM, SM Law College. Five years of experience in taxation, with working knowledge of the procedures of federal and provincial tax and revenue departments.</p>
        <h2>Our commitments</h2>
        <ul class="commit">
          <li>We explain each step.</li>
          <li>We tell you which documents are needed.</li>
          <li>We show how your price is worked out before you pay.</li>
          <li>We keep you updated until the work is done.</li>
          <li>We keep your documents confidential.</li>
        </ul>
      </div>
      <div style="display:grid;gap:20px">
        <div class="card" style="padding:28px">
          <h3>Contact</h3>
          ${contactBlock}
          <a class="btn btn--primary btn--block" href="${L.wa(S.WHATSAPP_GREETING)}" ${L.ext} style="margin-top:16px">Message us on WhatsApp</a>
        </div>
        <div class="card" style="padding:28px">
          <h3>Follow us</h3>
          <p>News, deadline reminders and new guides on Instagram, Facebook and LinkedIn.</p>
          ${L.socials("socials socials--light")}
          <p class="small muted" style="margin-top:16px">TaxSaathi is a private consultancy. It is not a government body and is not connected with, or approved by, any tax or revenue authority.</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--white">
    <div class="wrap">
      <div class="sec-head"><div class="num"><b>§</b>How we work</div><div><h2>How we work</h2></div><a class="link-arrow" href="/how-it-works/">More detail</a></div>
      ${stepsHTML()}
    </div>
  </section>`
    }) });
  }

  /* ---------- FAQ (Appendix D) ---------- */
  {
    const P = SEO.pages.faq;
    const groups = [
      { h: "Ordering and payment", items: [
        ["How do I place an order?", "Choose your service, answer the questions and press Order on WhatsApp. Your quote is sent to us in one message. We confirm what is included and share payment details."],
        ["How long is a quote valid?", "14 days from the date shown on the quote."],
        ["How do I pay?", "After we confirm your order on WhatsApp, we share payment details for bank transfer, JazzCash or Easypaisa. Work starts when payment is received. All amounts are in PKR."],
        ["Which documents do I send?", "Each service page has a “Documents you provide” list. Send clear phone photos or PDFs on WhatsApp."],
        ["Is my information confidential?", "Yes. Only TaxSaathi and the staff on your order see your documents. Please never send passwords, OTPs, card numbers or PINs."],
        ["What is your refund policy?", "See our <a href=\"/policies/#refund\">Refund Policy</a>. In short: a full fee refund before work starts, and a refund for work not yet done afterwards."],
        ["Can I talk to someone first?", `Yes. Message us on WhatsApp, or book a paid <a href="${C.path(svc("consultation"))}">30-minute consultation</a>.`],
        ["When do you reply?", `${S.HOURS}. ${S.HOURS_NOTE}`]
      ] },
      { h: "Pricing", items: [
        ["Why isn't there one fixed price per service?", "Jobs of the same service differ in size. Instead of one price for all, we publish tiers with written criteria. Your answers decide your tier, the same way for everyone."],
        ["Can I get a discount?", "We don't give private discounts. Any promotion is public, open to everyone and has a start and end date."],
        ["What if your prices change after I've received a quote?", "You pay the price on your quote for 14 days from the quote date. Later price changes don't affect it."],
        ["Are government fees included?", "No. Government fees, taxes, stamp duty and challans are shown on separate lines at actual cost and paid by you directly."],
        ["Is there tax on your fee?", "If a tax applies to our fee, it is shown on your quote as a separate line, “Taxes on our fee (if applicable)”. If none applies, the line does not appear."]
      ] },
      { h: "Notices", items: [
        ["I've received a notice. What should I do first?", "Find the response deadline on the notice and tell us on WhatsApp. Matters due within 7 days are given priority."],
        ["How are appeals priced?", "By stage. Each stage starts only after you approve and pay for it, so you're never committed to more than the next step."]
      ] }
    ];
    out.push({ out: "faq/index.html", html: L.page({
      path: "/faq/", title: P.title, desc: P.desc, crumbs: [["/faq/", "FAQ"]],
      h1: "Frequently asked questions", lead: "Can't find your answer? Message us on WhatsApp or book a 30-minute consultation.",
      ld: [faqLD(groups)],
      body: `<section class="section" style="padding-top:40px"><div class="wrap" style="max-width:860px">
        ${groups.map((g) => `<h2 class="h-small">${g.h}</h2><div class="faq" style="margin-bottom:36px">${g.items.map(([q, a]) => `<details><summary>${q}</summary><div>${a}</div></details>`).join("")}</div>`).join("")}
      </div></section>`
    }) });
  }

  /* ---------- Contact ---------- */
  {
    const P = SEO.pages.contact;
    out.push({ out: "contact/index.html", html: L.page({
      path: "/contact/", title: P.title, desc: P.desc, crumbs: [["/contact/", "Contact"]],
      h1: "Contact a tax consultant", lead: "The fastest way to reach us is WhatsApp. For a price, you don't need to contact us at all: every service page shows it.",
      body: `<section class="section" style="padding-top:40px">
    <div class="wrap grid grid-2" style="gap:32px;align-items:start">
      <div class="grid" style="gap:16px">
        <a class="card" href="${L.wa(S.WHATSAPP_GREETING)}" ${L.ext}><h2 class="h-card">WhatsApp</h2><p style="margin:0">${esc(S.PHONE)} · usually the quickest reply</p></a>
        <a class="card" href="tel:${S.PHONE_TEL}"><h2 class="h-card">Phone</h2><p style="margin:0">${esc(S.PHONE)}</p></a>
        <a class="card" href="mailto:${S.EMAIL}"><h2 class="h-card">Email</h2><p style="margin:0">${esc(S.EMAIL)}</p></a>
        <div class="card"><h2 class="h-card">Office</h2><p>${esc(S.ADDRESS)}</p><a class="link-arrow" href="${S.MAP_LINK}" ${L.ext}>Open in Google Maps</a></div>
        <div class="card"><h2 class="h-card">Working hours</h2><p style="margin:0">${esc(S.HOURS)}. ${esc(S.HOURS_NOTE)}</p></div>
        <div class="card"><h2 class="h-card">Follow us</h2>${L.socials("socials socials--light")}</div>
      </div>
      <form class="panel" id="contact-form" data-wa="${S.WHATSAPP_NUMBER}">
        <h2>Send a message</h2>
        <div class="field"><label for="cf-name">Name</label><input type="text" id="cf-name" required autocomplete="name"></div>
        <div class="field"><label for="cf-phone">Mobile number</label><input type="tel" id="cf-phone" autocomplete="tel" inputmode="tel"></div>
        <div class="field"><label for="cf-topic">Topic</label><select id="cf-topic"><option>General question</option><option>I received a notice</option><option>A service not listed</option><option>Something else</option></select></div>
        <div class="field"><label for="cf-msg">Message</label><textarea id="cf-msg" required maxlength="1000" aria-describedby="cf-hint"></textarea><span class="hint" id="cf-hint">Never send passwords, OTPs, card numbers or PINs.</span></div>
        <button class="btn btn--primary btn--block" type="submit">Send on WhatsApp</button>
        <p class="small muted" style="margin:12px 0 0">This opens WhatsApp with your message filled in. Nothing is stored on this website. No WhatsApp? Email <a href="mailto:${S.EMAIL}">${esc(S.EMAIL)}</a>.</p>
      </form>
    </div>
    <div class="wrap"><p class="disclaimer-box" style="margin-top:40px">${DISCLAIMER} TaxSaathi is a private consultancy and not a government body.</p></div>
  </section>`
    }) });
  }

  /* ---------- Policies (Appendix B, exact wording) ---------- */
  {
    const P = SEO.pages.policies;
    const updated = `<p class="small muted">Last updated: ${fmtDate(S.PUBLISHED)}</p>`;
    const li = (items) => `<ul>${items.map(([b, t]) => `<li><strong>${b}.</strong> ${t}</li>`).join("")}</ul>`;
    out.push({ out: "policies/index.html", html: L.page({
      path: "/policies/", title: P.title, desc: P.desc, crumbs: [["/policies/", "Policies"]],
      h1: "Policies", lead: "The rules we work by: privacy, terms, refunds and fee transparency.",
      body: `<section class="section" style="padding-top:40px">
  <div class="wrap">
    <nav class="tabs no-print" aria-label="Policies"><a class="tab" href="#privacy">Privacy</a><a class="tab" href="#terms">Terms of Service</a><a class="tab" href="#refund">Refunds</a><a class="tab" href="#fees">Fee transparency</a></nav>
    <div class="prose">
      <h2 id="privacy">Privacy Policy</h2>
      ${updated}
      <p>TaxSaathi respects your privacy. This policy explains what we collect, why, and how we protect it.</p>
      ${li([
        ["What we collect", "The details you give us to do the work: your name, phone number, email, city, CNIC and other documents needed for your service, and information about your tax and business affairs. This website itself collects only what you type into the order form; it passes that to WhatsApp and does not store it."],
        ["Why we collect it", "To quote, to carry out the service you ask for, to communicate with you, to keep records we are required to keep, and to improve our service."],
        ["Who sees it", "Only TaxSaathi and staff working on your order. We share information with a government authority or portal only as far as needed to carry out your service, and with others only where the law requires. We do not sell your information."],
        ["How we protect it", "We keep documents only on protected devices and accounts, limit who can see them, and delete working copies we no longer need. Please never send us passwords, OTPs, card numbers or PINs."],
        ["How long we keep it", "For as long as needed for your service and the record-keeping period required by law, which is generally up to six years. After that we delete or anonymise it."],
        ["Your choices", `You may ask us to correct your information, or to delete it where the law allows. Write to <a href="mailto:${S.EMAIL}">${esc(S.EMAIL)}</a>.`],
        ["Cookies and analytics", "We may use basic analytics to understand how the site is used. We do not use them to identify you personally."],
        ["Contact", `TaxSaathi, ${esc(S.ADDRESS)}. WhatsApp ${esc(S.PHONE)}. Email <a href="mailto:${S.EMAIL}">${esc(S.EMAIL)}</a>.`]
      ])}

      <h2 id="terms">Terms of Service</h2>
      ${updated}
      <p>These terms apply to services provided by TaxSaathi (Associate), operated by Abdullah.</p>
      ${li([
        ["Our services", "The scope of each service is shown on its page and confirmed on your quote. Work outside that scope is quoted separately at our published prices and starts only when you approve it in writing."],
        ["Your responsibilities", "You give us accurate and complete information and documents on time. You are responsible for the truth of the facts you give us."],
        ["Prices", "Prices come from our published price list and rules and are the same for every client. The price on your accepted quote is the price you pay, for 14 days from the quote date. Government fees, stamp duty and challans are separate and paid by you at actual cost. Taxes that apply to our fee, if any, are shown as a separate line."],
        ["Re-tiering", "If your documents show different facts from your answers, we send a revised quote in the correct tier. Work pauses until you accept it in writing."],
        ["Staged work", "For staged services, each stage starts only after you approve and pay for it."],
        ["Payment", "Payment is made after we confirm your order and before work starts, by the methods we share on WhatsApp."],
        ["Timelines", "Times shown are estimates. Decisions and timing of government authorities are outside our control."],
        ["No guarantee of outcome", "We do our work with care, but we cannot promise any decision by a tax or revenue authority or court."],
        ["Our right to decline", "We may decline or stop work, for example where we are asked to take a position we cannot support. Where we stop, we refund the part of our fee for work not done."],
        ["Confidentiality", "We keep your information confidential as described in our <a href=\"#privacy\">Privacy Policy</a>."],
        ["Limit of liability", "To the extent the law allows, our liability for any claim related to a service is limited to the fee you paid for that service."],
        ["General information", "Content on this website is general information and not a substitute for advice on your specific facts."],
        ["Law", "These terms are governed by the laws of Pakistan, and the courts at Karachi have jurisdiction."],
        ["Changes", "We may update these terms. The terms in force on your accepted quote date apply to your order."]
      ])}

      <h2 id="refund">Refund Policy</h2>
      ${updated}
      ${li([
        ["Before work starts", "you may cancel and we refund the full professional fee you paid."],
        ["After work has started", "we refund the fee for the part of the work not yet done. The fee for completed work is not refunded."],
        ["Revised quote not accepted", "if you do not accept a revised quote, we stop and refund any fee paid for work not done."],
        ["Government fees, duty and challans", "not refundable by us once paid to the authority. Any refund made by the authority is passed on to you where it is paid to us."],
        ["Our error", "if we make an error that causes a rejected filing, we correct it at no extra fee."],
        ["How refunds are paid", "by the same method you used, within 7 working days of the refund being agreed."],
        ["How to ask", `message us on WhatsApp <a href="${L.wa("Hello TaxSaathi, I would like to ask about a refund. Quote no: ")}" ${L.ext}>${esc(S.PHONE)}</a> with your quote number.`]
      ]).replace(/<strong>([^<]+)\.<\/strong>/g, "<strong>$1:</strong>")}

      <h2 id="fees">Fee Transparency Policy</h2>
      ${updated}
      <ol>
        <li><strong>Published formula.</strong> Every service shows its tiers, units, stages and add-ons, with the criteria for each.</li>
        <li><strong>No private discounts.</strong> No client gets a different price for the same inputs. Promotions are public, open to everyone and dated.</li>
        <li><strong>Quote before payment.</strong> You see a line-by-line breakdown and the reason for your tier before paying. Quotes are numbered and valid for 14 days.</li>
        <li><strong>Price lock.</strong> The price on your accepted quote is the price you pay.</li>
        <li><strong>Re-tiering with consent.</strong> If your documents show different facts, we pause and send a revised quote. Work resumes only after you accept it in writing.</li>
        <li><strong>Government fees separate.</strong> Government fees, stamp duty, challans and filing charges are shown separately at actual cost and are never part of our fee.</li>
        <li><strong>Stage approval.</strong> For staged work, the next stage starts only after you approve and pay for it.</li>
        <li><strong>Custom scope.</strong> Work that fits no tier is priced at our public rate card and approved by you before it starts.</li>
        <li><strong>Invoice equals quote.</strong> Your invoice matches your accepted quote exactly.</li>
        <li><strong>Regular review.</strong> We review prices every quarter and show the last review date on the <a href="/price-list/">price list</a>.</li>
      </ol>
    </div>
  </div>
</section>`
    }) });
  }

  /* ---------- Free tools ---------- */
  {
    const P = SEO.pages.tools;
    const auths = ["All", ...new Set(TS.deadlines.map((d) => d.auth))];
    const when = (d) => d.when === "Every month" ? `By the ${d.day}th of every month` : d.when === "Quarterly" ? `By the ${d.day}th after each quarter` : `${d.day} ${d.when}`;
    const calc = S.SHOW_STAMP_CALCULATOR;
    const sindh = svc("stamp-duty-challan-sindh");
    out.push({ out: "tools/index.html", html: L.page({
      path: "/tools/", title: P.title, desc: P.desc, crumbs: [["/tools/", "Free tools"]],
      h1: "Free tax tools", lead: "Free to use. Plan your tax deadlines and gather the right documents before you start.",
      scripts: calc ? ["/assets/js/stamp-duty.js", "/assets/js/stamp-calc.js"] : [],
      body: `<section class="section" style="padding-top:40px">
  <div class="wrap">
    <div class="tabs no-print" role="tablist" aria-label="Tools">
      <button class="tab" role="tab" id="tab-cal" aria-selected="true" aria-controls="panel-cal" data-tab="cal">Deadline calendar</button>
      <button class="tab" role="tab" id="tab-chk" aria-selected="false" aria-controls="panel-chk" data-tab="chk">Documents to provide</button>
      ${calc ? '<button class="tab" role="tab" id="tab-calc" aria-selected="false" aria-controls="panel-calc" data-tab="calc">Stamp duty calculator</button>' : ""}
    </div>

    <div data-panel="cal" id="panel-cal" role="tabpanel" aria-labelledby="tab-cal">
      <h2 class="h-small">Tax deadline calendar</h2>
      <div class="notice" style="margin-bottom:20px"><span aria-hidden="true">⚠</span><span><strong>Indicative dates.</strong> Due dates can change by notification or extension. Always confirm the current date for your case.</span></div>
      <div class="chips no-print" role="group" aria-label="Filter by authority">${auths.map((a, i) => `<button type="button" class="chip-btn" aria-pressed="${i === 0}" data-auth="${esc(a)}">${esc(a)}</button>`).join("")}</div>
      <div class="deadlines">${TS.deadlines.map((d) => `<div class="deadline" data-auth="${esc(d.auth)}"><div class="d-date"><b>${d.day}</b><small>${d.when === "Every month" ? "monthly" : d.when === "Quarterly" ? "quarterly" : d.when.slice(0, 3)}</small></div>
        <div><h3>${esc(d.title)}</h3><p>${when(d)} · ${esc(d.note)}</p></div></div>`).join("")}</div>
      <p class="tool-next">Want these filed for you? See <a href="${C.path(svc("monthly-sales-tax-returns"))}">monthly sales tax return filing</a> and <a href="${C.path(svc("income-tax-return"))}">income tax return filing</a>.</p>
    </div>

    <div data-panel="chk" id="panel-chk" role="tabpanel" aria-labelledby="tab-chk" class="hidden">
      <h2 class="h-small">Documents to provide</h2>
      <p class="muted">Pick a service to see the documents you provide for it, then save it as a PDF or print it.</p>
      <div class="field no-print" style="max-width:520px"><label for="chk-svc">Service</label><select id="chk-svc">${TS.parts.map((p) => `<optgroup label="${p.key}. ${esc(p.name)}">${C.services.filter((s) => s.part === p.key).map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}</optgroup>`).join("")}</select></div>
      ${C.services.map((s, i) => `<div class="panel chk-list${i ? " hidden" : ""}" data-chk="${s.id}">
        <div class="print-only print-brand"><strong>${S.BRAND}</strong> · ${esc(S.PHONE)} · ${esc(S.EMAIL)}</div>
        <h3>Documents you provide: ${esc(s.name)}</h3>
        <ul class="checklist">${s.checklist.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        <p class="docs-note"><strong>${esc(TS.docsNote)}</strong></p>
        <div class="tool-actions no-print">
          <button class="btn btn--primary btn--plain" type="button" data-print>Download PDF / print</button>
          <a class="btn btn--ghost" href="${C.path(s)}">Get a price for this service</a>
        </div>
        <p class="small muted print-only">${DISCLAIMER}</p>
      </div>`).join("")}
    </div>

    ${calc ? `<div data-panel="calc" id="panel-calc" role="tabpanel" aria-labelledby="tab-calc" class="hidden">
      <div class="svc-layout" style="gap:32px">
        <div><div class="panel"><h2 class="h-small">Sindh stamp duty calculator</h2>
          <div class="field"><label for="sd-ins">Type of document</label><select id="sd-ins"></select></div>
          <div id="sd-inputs"></div></div>
          <p class="small muted" style="margin-top:14px" id="sd-src"></p></div>
        <aside><div class="quote-panel"><div class="qp-head"><h2>Indicative duty</h2><p>Sindh</p></div>
          <div class="qp-result" style="border-top:0" id="sd-out" aria-live="polite" data-service="${C.path(sindh)}" data-fee="${money(C.fromPrice(sindh))}"></div></div></aside>
      </div>
    </div>` : ""}
  </div>
</section>`
    }) });
  }

  /* ---------- 404 (CR-147) ---------- */
  {
    const P = SEO.pages.notFound;
    out.push({ out: "404.html", html: L.page({
      path: "/404.html", title: P.title, desc: P.desc, noindex: true,
      h1: "We couldn't find that page", lead: "The address may have changed. These will get you where you need to go.",
      body: `<section class="section" style="padding-top:40px"><div class="wrap">
        <div class="grid grid-3">
          <a class="card" href="/services/"><h2 class="h-card">Services</h2><p>All services with their published prices.</p></a>
          <a class="card" href="/price-list/"><h2 class="h-card">Price list</h2><p>Every fee, add-on and the rate card.</p></a>
          <a class="card" href="${L.wa(S.WHATSAPP_GREETING)}" ${L.ext}><h2 class="h-card">WhatsApp</h2><p>Message us and we'll point you to the right service.</p></a>
        </div></div></section>`
    }) });
  }
  return out;
};
