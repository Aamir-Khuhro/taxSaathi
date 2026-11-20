/* Keyword map (Appendix F, CR-160 to CR-163).
 * One primary keyword per page, used naturally in the title, H1 or first
 * paragraph, one H2, the URL and the description. The build checks lengths:
 * title under 60 characters, description under 155.
 *
 * slug   → the page address: /services/<slug>/
 * short  → plain name used in the page's question headings
 * kw     → primary keyword
 * lead   → first paragraph on the page
 */
module.exports.services = {
  "individual-ntn": {
    slug: "ntn-registration", short: "NTN registration", kw: "NTN registration Pakistan",
    title: "NTN Registration in Pakistan for Individuals",
    desc: "Get your NTN with FBR. See the fee for your income type, the documents you need and how to order on WhatsApp. See your price.",
    lead: "NTN registration in Pakistan for individuals: we register you with FBR so you get your National Tax Number and can file returns. Your price depends only on your source of income."
  },
  "sole-proprietorship-registration": {
    slug: "sole-proprietorship-registration", short: "sole proprietorship registration", kw: "sole proprietorship registration FBR",
    title: "Sole Proprietorship Registration with FBR",
    desc: "Register your one-owner business with FBR and get its business NTN record. Clear tiers, a document list and one-tap WhatsApp ordering.",
    lead: "Sole proprietorship registration with FBR adds your business to your own NTN record, so you can open a business bank account, issue invoices and file as a business."
  },
  "aop-registration": {
    slug: "aop-registration", short: "AOP registration", kw: "AOP registration Pakistan",
    title: "AOP Registration in Pakistan (Partnership NTN)",
    desc: "Register a partnership or association of persons with FBR and get its NTN. Price set by members, documents listed. See your price.",
    lead: "AOP registration in Pakistan gives your partnership or association of persons its own NTN with FBR. Your price depends on the number and type of members."
  },
  "smc-incorporation": {
    slug: "single-member-company-registration", short: "single member company registration", kw: "single member company registration SECP",
    title: "Single Member Company Registration with SECP",
    desc: "Form a one-person private limited company with SECP, including name reservation and company NTN. Published tiers. See your price.",
    lead: "Single member company registration with SECP lets one person own a private limited company. We reserve the name, prepare the documents, file for incorporation and register the company NTN."
  },
  "company-incorporation": {
    slug: "private-limited-company-registration", short: "private limited company registration", kw: "company registration SECP",
    title: "Company Registration with SECP: Private Limited",
    desc: "Private limited company registration with SECP: name reservation, incorporation and company NTN. Tiers by directors. See your price.",
    lead: "Company registration with SECP for a private limited company: we check and reserve the name, prepare the memorandum and articles, file for incorporation and register the company NTN."
  },
  "public-company-incorporation": {
    slug: "public-limited-company-registration", short: "public limited company registration", kw: "public limited company registration",
    title: "Public Limited Company Registration (SECP)",
    desc: "Incorporate an unlisted public limited company with SECP, with the extra filings a public company needs. Published tiers. See your price.",
    lead: "Public limited company registration with SECP for an unlisted public company, with the constitutional documents and filings a public company needs."
  },
  "federal-sales-tax-registration": {
    slug: "sales-tax-registration", short: "sales tax registration", kw: "sales tax registration FBR",
    title: "Sales Tax Registration with FBR (STRN)",
    desc: "Register for federal sales tax with FBR and get your STRN. Price set by business type and premises; documents listed. See your price.",
    lead: "Sales tax registration with FBR gives your business an STRN so you can issue sales tax invoices. Your price depends on the type of business and the number of premises."
  },
  "srb-registration": {
    slug: "srb-registration", short: "SRB registration", kw: "SRB registration",
    title: "SRB Registration: Sindh Sales Tax on Services",
    desc: "SRB registration for businesses providing taxable services in Sindh. See the documents SRB needs and your price, then order on WhatsApp.",
    lead: "SRB registration is needed if you provide taxable services in Sindh. We check how your services are classified, register you with the Sindh Revenue Board and send you the certificate."
  },
  "pra-registration": {
    slug: "pra-registration", short: "PRA registration", kw: "PRA registration",
    title: "PRA Registration: Punjab Sales Tax on Services",
    desc: "PRA registration for businesses providing taxable services in Punjab. See the documents PRA needs and your price, then order on WhatsApp.",
    lead: "PRA registration is needed if you provide taxable services in Punjab. We check how your services are classified, register you with the Punjab Revenue Authority and send you the certificate."
  },
  "eobi-registration": {
    slug: "eobi-registration", short: "EOBI registration", kw: "EOBI registration",
    title: "EOBI Employer Registration",
    desc: "EOBI employer registration and employee enrolment. Price set by number of employees and branches; documents listed. See your price.",
    lead: "EOBI registration enrols your business as an employer with the Employees' Old-Age Benefits Institution and your employees for their old-age benefits."
  },
  "nil-return": {
    slug: "nil-return", short: "a nil return", kw: "nil return filing",
    title: "Nil Return Filing: Individuals, AOPs, Companies",
    desc: "File a nil income tax return when there was no taxable income or business activity. One fixed price per taxpayer type. See your price.",
    lead: "Nil return filing is for a taxpayer with no taxable income and no business activity in the year. We first check a nil return is right for you, then file it."
  },
  "income-tax-return": {
    slug: "income-tax-return-filing", short: "income tax return filing", kw: "income tax return filing Pakistan",
    title: "Income Tax Return Filing in Pakistan: Salaried",
    desc: "File your income tax return and wealth statement: salary, pension, rent, profit or capital gains. Clear tiers. See your price now.",
    lead: "Income tax return filing in Pakistan for salaried people and individuals with pension, rent, profit or capital gains, including the wealth statement."
  },
  "business-individual-return": {
    slug: "business-income-tax-return", short: "a business income tax return", kw: "file income tax return business",
    title: "Income Tax Return: Business or Freelance Income",
    desc: "File the income tax return of a sole proprietor, freelancer or professional. Tiers set by turnover and transactions. See your price.",
    lead: "File your income tax return for business, freelance or professional income, with the accounts and wealth statement the return needs."
  },
  "aop-return": {
    slug: "aop-income-tax-return", short: "an AOP income tax return", kw: "AOP income tax return",
    title: "AOP Income Tax Return Filing (Partnership)",
    desc: "Partnership tax return filing for an AOP, with each partner's profit share worked out. Tiers by turnover and partners. See your price.",
    lead: "AOP income tax return filing for partnerships and associations of persons, with the share of profit for each partner worked out."
  },
  "smc-return": {
    slug: "single-member-company-tax-return", short: "a single member company tax return", kw: "single member company tax return",
    title: "Single Member Company Income Tax Return",
    desc: "Annual income tax return for a single member company, prepared from its accounts and filed on IRIS. Tiers by turnover. See your price.",
    lead: "The single member company tax return is prepared from the company's accounts and filed on IRIS. Your price depends on turnover, tax regimes and branches."
  },
  "company-return": {
    slug: "private-limited-company-tax-return", short: "a company income tax return", kw: "company income tax return Pakistan",
    title: "Company Income Tax Return in Pakistan: Pvt Ltd",
    desc: "Private limited company return filing from your audited accounts, with tax computation and IRIS filing. Tiers by turnover. See your price.",
    lead: "Company income tax return filing in Pakistan for a private limited company, prepared from your audited accounts and filed on IRIS."
  },
  "public-company-return": {
    slug: "public-limited-company-tax-return", short: "a public company tax return", kw: "public limited company tax return",
    title: "Public Limited Company Tax Return (Unlisted)",
    desc: "Income tax return for an unlisted public limited company, from audited accounts to IRIS filing. Tiers by turnover. See your price.",
    lead: "The public limited company tax return for an unlisted public company, prepared from audited accounts and filed on IRIS."
  },
  "listed-company-return": {
    slug: "listed-company-tax-return", short: "a listed company tax return", kw: "listed company return",
    title: "Listed Company Income Tax Return",
    desc: "Income tax return for a company listed on the Pakistan Stock Exchange, alongside your finance team. Tiers by turnover. See your price.",
    lead: "Listed company return filing for companies on the Pakistan Stock Exchange. We work alongside your finance team and auditors on a timetable agreed at the start."
  },
  "wealth-statement": {
    slug: "wealth-statement-filing", short: "wealth statement filing", kw: "wealth statement filing",
    title: "Wealth Statement Filing and Reconciliation",
    desc: "Prepare, revise or reconcile your FBR wealth statement so your assets match your declared income. Clear tiers. See your price.",
    lead: "Wealth statement filing and reconciliation, so the assets on your FBR wealth statement match your declared income from year to year."
  },
  "monthly-sales-tax-returns": {
    slug: "sales-tax-return-filing", short: "monthly sales tax return filing", kw: "sales tax return filing",
    title: "Monthly Sales Tax Return Filing: FBR, SRB, PRA",
    desc: "Monthly sales tax return filing with FBR, SRB or PRA before each due date. Plans by invoices per month. See your monthly price.",
    lead: "Sales tax return filing every month with FBR, SRB or PRA, filed before each due date, with the tax payable worked out for you."
  },
  "notice-reply": {
    slug: "fbr-notice-reply", short: "a notice reply", kw: "FBR notice reply",
    title: "FBR Notice Reply and Tax Notice Review",
    desc: "Reply to an FBR, SRB, PRA, SECP, EOBI or Board of Revenue notice. Priced by notice type; we plan from your deadline. See your price.",
    lead: "FBR notice reply and review of notices from SRB, PRA, SECP, EOBI and the Board of Revenue. We read the notice, explain it in plain language and prepare a written reply."
  },
  "audits-appeals": {
    slug: "tax-audit-and-appeals", short: "audit support and appeals", kw: "tax audit and appeal",
    title: "Tax Audit Support and Appeals, Priced by Stage",
    desc: "Representation in a tax audit, a stay application or an appeal, priced one stage at a time so you know the next cost. See your price.",
    lead: "Tax audit support and appeals, priced one stage at a time: a stay application, the audit itself, or an appeal before the Commissioner (Appeals) or the Appellate Tribunal."
  },
  "assessment-proceedings": {
    slug: "assessment-proceedings", short: "assessment proceedings", kw: "tax assessment proceedings",
    title: "Tax Assessment Proceedings, Priced by Stage",
    desc: "Written submissions and hearings while your tax is assessed or amended, each priced at our published rate card. See your price.",
    lead: "Tax assessment proceedings: written submissions, hearings and follow-up visits while an authority assesses or amends your tax, each step priced at our published rate card."
  },
  "tax-petitions": {
    slug: "tax-petitions", short: "petitions and applications", kw: "tax petition",
    title: "Tax Petitions and Applications, by Stage",
    desc: "Petitions and applications before a tax or revenue authority, such as rectification or condonation of delay. Rate-card prices. See your price.",
    lead: "Tax petition and application work before a tax or revenue authority, such as rectification of a mistake or condonation of delay, priced by stage at our rate card."
  },
  "consultation": {
    slug: "tax-consultation", short: "a tax consultation", kw: "tax consultation online",
    title: "Tax Consultation Online: 30 Minutes",
    desc: "Book a paid 30-minute tax consultation by video, phone or at our office. Speak to a tax consultant about your question. See the price.",
    lead: "A tax consultation online or at our office: 30 minutes with Abdullah (LLB, LLM) to talk through your tax or compliance question, booked on WhatsApp."
  },
  "tax-health-check": {
    slug: "tax-health-check", short: "a tax health check", kw: "tax health check",
    title: "Tax Health Check for Individuals and Businesses",
    desc: "A review of your registrations, returns and records to find gaps before they turn into notices. Rate-card price. See your price.",
    lead: "A tax health check reviews your registrations, recent returns and records, and gives you a plain-language list of gaps and risks before they turn into notices."
  },
  "written-tax-opinion": {
    slug: "written-tax-opinion", short: "a written tax opinion", kw: "written tax opinion",
    title: "Written Tax Opinion on Your Question",
    desc: "A written tax opinion on a specific question, based on your facts and documents, with a scope agreed first. See the rate-card price.",
    lead: "A written tax opinion sets out our view on one specific question, based on the facts and documents you give us, with the scope and hours agreed in writing first."
  },
  "stamp-duty-challan-sindh": {
    slug: "stamp-duty-sindh", short: "a Sindh stamp duty challan", kw: "stamp duty Sindh",
    title: "Stamp Duty Sindh: E-Stamp Challan Preparation",
    desc: "Sindh stamp duty challan prepared for your deed or agreement, with the duty checked first. Fixed price per challan. See your price.",
    lead: "Stamp duty in Sindh is paid through an e-stamp challan. We check your document, confirm the duty on the correct value and prepare the Sindh stamp duty challan."
  },
  "stamp-duty-challan-punjab": {
    slug: "stamp-duty-punjab", short: "a Punjab stamp duty challan", kw: "stamp duty Punjab",
    title: "Stamp Duty Punjab: E-Stamping Challan",
    desc: "Punjab stamp duty challan prepared for your deed or agreement, with the duty checked first. Fixed price per challan. See your price.",
    lead: "Stamp duty in Punjab is paid through e-stamping. We check your document, confirm the duty on the correct value and prepare the Punjab stamp duty challan."
  },
  "stamp-duty-assessment": {
    slug: "stamp-duty-assessment", short: "a stamp duty assessment", kw: "stamp duty assessment",
    title: "Stamp Duty Assessment and Advice",
    desc: "Find out which stamp duty article applies to your document and how much duty is due, before you sign or pay. See the rate-card price.",
    lead: "A stamp duty assessment tells you which article of the stamp duty schedule applies to your document and how much duty is due, before you sign or pay."
  },
  "stamp-duty-document-review": {
    slug: "stamp-duty-document-review", short: "a stamp duty document review", kw: "stamp duty document review",
    title: "Stamp Duty Document Review",
    desc: "A check of a deed or agreement for stamp duty points before it is signed: instrument type, value and parties. See the rate-card price.",
    lead: "A stamp duty document review checks a deed or agreement before it is signed: the instrument type, the value stated and the parties named."
  },
  "stamp-duty-notice-reply": {
    slug: "board-of-revenue-notice-reply", short: "a Board of Revenue notice reply", kw: "Board of Revenue notice reply",
    title: "Board of Revenue Notice Reply: Stamp Duty",
    desc: "Reply to a Board of Revenue or sub-registrar notice about stamp duty in Sindh or Punjab. Priced by notice type. See your price.",
    lead: "A Board of Revenue notice reply for stamp duty, valuation or registration notices in Sindh and Punjab, read, explained and answered in writing."
  },
  "stamp-duty-adjudication": {
    slug: "stamp-duty-adjudication-and-appeal", short: "stamp duty adjudication, refund or appeal", kw: "stamp duty adjudication",
    title: "Stamp Duty Adjudication, Refund or Appeal",
    desc: "Applications for adjudication of stamp duty, refunds and appeals in Sindh and Punjab, priced by stage at our rate card. See your price.",
    lead: "Stamp duty adjudication, refund and appeal work in Sindh and Punjab, priced one stage at a time at our published rate card."
  }
};

// Fixed pages. Home title and description are the exact wording from CR-24.
module.exports.pages = {
  home: { title: "TaxSaathi | Tax Registration, Returns, Notices & Stamp Duty", raw: true,
    desc: "Register your business, file returns, reply to tax notices and sort stamp duty. See how your price is worked out before you pay." },
  services: { title: "Tax Services: Registration, Returns, Notices",
    desc: "Tax registration, income tax return filing, notice replies, consultations and stamp duty, each with published prices. Find your service." },
  priceList: { title: "Tax Consultant Fees in Pakistan: Price List",
    desc: "Every TaxSaathi fee in one list: NTN registration fee, return filing fee, notices, add-ons and the rate card. See the full price list." },
  howItWorks: { title: "How It Works: Quote, Order on WhatsApp, Done",
    desc: "Answer a few questions, send your quote on WhatsApp, share documents and we do the work. See how your price is worked out." },
  tools: { title: "Free Tax Deadline Calendar and Document Lists",
    desc: "Free monthly and annual tax deadline calendar for FBR, SRB, PRA and EOBI, plus printable document lists for every service. Use them free." },
  knowledge: { title: "Tax Guides for Pakistan: Knowledge Centre",
    desc: "Plain-language tax guides for Pakistan on registration, returns, notices, stamp duty, employers and tax deadlines. Read the latest guide." },
  about: { title: "About TaxSaathi and Abdullah (LLB, LLM)",
    desc: "TaxSaathi helps individuals and businesses with registrations, returns, notices and stamp duty, with clear prices. Meet the founder." },
  faq: { title: "FAQ: Ordering, Prices, Payment and Documents",
    desc: "How to order on WhatsApp, how quotes and payment work, which documents to send and our refund policy, in short answers. Read the FAQ." },
  contact: { title: "Contact a Tax Consultant: WhatsApp or Office",
    desc: "Message TaxSaathi on WhatsApp, call, email or visit our office. Monday to Saturday, 10 am to 6 pm. Get in touch today." },
  policies: { title: "Privacy Policy, Terms and Refund Policy",
    desc: "TaxSaathi's Privacy Policy, Terms of Service, Refund Policy and Fee Transparency Policy, in plain language. Read our policies." },
  notFound: { title: "Page Not Found",
    desc: "This page does not exist. Find a service, see the price list or message us on WhatsApp." }
};
