/* TaxSaathi — service catalogue, price rules and quote questions.
 *
 * This file is the single source of truth for every price on the site.
 * Prices are edited HERE. The build (npm run build) turns them into the pages.
 *
 *   - Prices (PKR, professional fee only) were set in November 2026 against
 *     published price lists of other Pakistani consultants. Review each quarter.
 *   - `basis` tells the client, in plain words, whether a price is fixed or what
 *     it depends on.
 *   - There is deliberately no per-client price field anywhere (rule 4.3.2).
 */

window.TS = window.TS || {};

// Contact details, links, quote validity and tax-on-fee live in site.config.js.

TS.owner = {
  name: "Abdullah",
  title: "Founder",
  qualifications: ["LLB, SM Law College", "LLM, SM Law College"],
  years: 5
};

// Price list header (CR-90). Dates come from PUBLISHED in site.config.js.
TS.pricing = { version: "1.0" };

TS.parts = [
  { key: "A", slug: "registration", name: "Registrations", blurb: "NTN, business, company, sales tax and EOBI registrations with FBR, SECP, SRB, PRA and EOBI.", icon: "id" },
  { key: "B", slug: "returns", name: "Tax returns", blurb: "Annual returns for individuals, AOPs and every kind of company, nil returns, wealth statements and monthly sales tax.", icon: "doc" },
  { key: "C", slug: "litigation", name: "Notices & litigation", blurb: "Replies to notices from FBR, SRB, PRA, SECP, EOBI and the Board of Revenue, plus audit support, assessment proceedings, appeals and petitions.", icon: "shield" },
  { key: "D", slug: "other", name: "Advice & consultation", blurb: "A paid 30-minute consultation, a tax health check or a written tax opinion from Abdullah (LLB, LLM).", icon: "chat" },
  { key: "E", slug: "stamp-duty", name: "Stamp duty", blurb: "E-stamp challans for Sindh and Punjab, duty assessment and advice, document review, notice replies and adjudication, refund or appeal.", icon: "stamp" }
];

// Published add-ons. Each service lists which add-ons it accepts.
TS.addons = {
  urgent:   { name: "Urgent handling", desc: "Work starts within one working day and is prioritised.", fee: 3000 },
  revision: { name: "Extra revision", desc: "One additional revision after the first version is shared with you.", fee: 1500 },
  historic: { name: "Earlier year filing or correction", desc: "Per earlier tax year or period that needs filing or correcting.", fee: 3000, perUnit: "per year" },
  consult:  { name: "Additional 30-minute consultation", desc: "Extra call with a consultant about this order.", fee: 3000 }
};

// Public standard rate card for Custom scope work (rule 4.3.9). Same for everyone.
// `key` lets rate-card-priced services below reuse these figures (never retyped).
TS.rateCard = [
  { key: "consultant", name: "Consultant time", unit: "per hour", fee: 4000 },
  { key: "principal", name: "Principal consultant time (Abdullah)", unit: "per hour", fee: 7500 },
  { key: "hearing", name: "Hearing attendance", unit: "per hearing", fee: 5000 },
  { key: "visit", name: "Visit to a government office for your matter", unit: "per visit", fee: 3000 },
  { key: "submission", name: "Preparation of a written submission", unit: "per submission", fee: 10000 }
];
const RATE = (key) => TS.rateCard.find((r) => r.key === key).fee;

/* ---------- Shared building blocks ---------- */
const P_REG = (thing, cert) => [
  ["Get your price", "Answer a few questions and see your tier at once."],
  ["Send your documents", "Send the documents listed below on WhatsApp: clear photos or PDFs."],
  ["We verify and file", `We check everything, then file the ${thing}.`],
  ["Receive " + cert, `We send your ${cert} to you on WhatsApp.`]
];
const P_RET = [
  ["Get your price", "Answer a few questions about the year."],
  ["Send your documents", "Send them on WhatsApp; we tell you if anything is missing."],
  ["Check before filing", "We share the return and tax computation for your approval."],
  ["Filed", "We file on IRIS and send you the acknowledgement."]
];
const FAQ_TIER = ["What if my documents show more than I said?", "We pause work and send a revised quote in the correct published tier, with the reason. You never pay more without agreeing first."];
const FAQ_TAX = ["Is the tax I owe included in your fee?", "No. Any tax payable is yours and goes to the government directly through a challan. It is never part of our fee."];

/* Company returns: one service per company type (single member, private,
 * public unlisted, listed), each with turnover-based tiers. */
function companyReturn(id, name, short, bands, fees, extra) {
  return {
    id, part: "B", name: `Income tax return: ${name}`,
    summary: `Annual income tax return for a ${short}, prepared from your audited accounts and filed on IRIS.`,
    basis: "Varies by turnover, tax regimes and number of branches",
    model: "tiered", time: extra.time,
    tiers: [
      { key: "basic", name: "Basic", fee: fees[0], criteria: `Turnover up to ${bands[0]}, normal tax regime, one place of business.` },
      { key: "standard", name: "Standard", fee: fees[1], criteria: `Turnover ${bands[0]} to ${bands[1]}, or income under more than one tax regime (normal, final, minimum).` },
      { key: "complex", name: "Complex", fee: fees[2], criteria: `Turnover above ${bands[1]}, more than three branches, exports or imports, or a tax credit or exemption claim.` }
    ],
    questions: [
      { id: "turnover", label: "Annual turnover (sales or receipts)", options: [
        { label: `Up to ${bands[0]}`, tier: 0 }, { label: `${bands[0]} to ${bands[1]}`, tier: 1 }, { label: `Above ${bands[1]}`, tier: 2 } ] },
      { id: "regimes", label: "How is the income taxed?", help: "Not sure? Pick the first option; we confirm it from the financial statements.", options: [
        { label: "Normal tax regime only", tier: 0 }, { label: "Mix of normal, final or minimum tax", tier: 1 }, { label: "Exports / imports, or a tax credit or exemption", tier: 2 } ] },
      { id: "branches", label: "Places of business", options: [
        { label: "One", tier: 0 }, { label: "2–3", tier: 1 }, { label: "More than 3", tier: 2 } ] }
    ],
    govFees: ["Any tax payable is paid by the company directly to FBR"],
    included: ["Review of audited accounts and tax computation", "Reconciliation of tax deducted and advance tax", "Return filed on IRIS", "Copy of filed return and acknowledgement", "One review meeting with the finance team"],
    excluded: ["Statutory audit", "Preparing financial statements", "Withholding statements", "Notice replies", ...(extra.excluded || [])],
    process: P_RET,
    faqs: [FAQ_TIER, FAQ_TAX, ...(extra.faqs || [])],
    addons: ["urgent", "historic", "consult"]
  };
}

/* Service definitions
 * model: "tiered" | "unit" | "subscription"
 * tiered/subscription: each option in `questions` carries a `tier` index; the job
 *   lands in the HIGHEST tier any answer points to. The answers that set it become
 *   the reason shown to the client.
 * unit: one question picks the `unit` key; an optional `qty` question multiplies it.
 * `checklist` is the list of documents the client provides.
 */
TS.services = [
  /* ===================== A. Registrations ===================== */
  {
    id: "individual-ntn",
    part: "A", name: "Individual NTN registration (FBR)",
    summary: "Get your personal National Tax Number so you can file returns and join the Active Taxpayers List.",
    basis: "Varies by source of income",
    model: "tiered", time: "1–3 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 2000, criteria: "Salary or no income yet." },
      { key: "standard", name: "Standard", fee: 3000, criteria: "Business, freelance or rental income." },
      { key: "complex", name: "Complex", fee: 5000, criteria: "Overseas Pakistani, foreign income, or more than two income sources." }
    ],
    questions: [
      { id: "source", label: "What is your main source of income?", options: [
        { label: "Salary, or no income yet", tier: 0 }, { label: "Business, freelance or rent", tier: 1 }, { label: "Foreign income / overseas Pakistani", tier: 2 } ] },
      { id: "sources", label: "How many income sources do you have?", options: [
        { label: "One or two", tier: 0 }, { label: "More than two", tier: 2 } ] }
    ],
    govFees: [],
    included: ["IRIS registration in your name", "NTN registration", "IRIS access handed to you, so you can set your own password", "Short guide to your next filing date"],
    excluded: ["Filing your income tax return", "Business registration"],
    process: [
      ["Get your price", "Tell us about your income source."],
      ["Send your documents", "CNIC, mobile and email, on WhatsApp."],
      ["We register you", "We file the registration; you confirm the codes sent to your phone yourself."],
      ["You're registered", "We send you your NTN and hand IRIS access to you."]
    ],
    faqs: [
      ["Will you keep my IRIS password?", "No. We hand IRIS access to you and recommend you change the password as soon as registration is done. Never send passwords or OTPs by message."],
      ["Does an NTN make me a filer?", "No. You appear on the Active Taxpayers List after you file your income tax return."]
    ],
    addons: ["urgent"]
  },
  {
    id: "sole-proprietorship-registration",
    part: "A", name: "Sole proprietorship registration (FBR)",
    summary: "Register your one-person business with FBR so it has a valid NTN and business record.",
    basis: "Varies by number of activities and premises",
    model: "tiered", time: "3–5 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 5000, criteria: "One business activity, you already have an individual NTN." },
      { key: "standard", name: "Standard", fee: 7500, criteria: "One business activity, no NTN yet." },
      { key: "complex", name: "Complex", fee: 10000, criteria: "More than one business activity or more than one business premises." }
    ],
    questions: [
      { id: "ntn", label: "Do you already have an individual NTN?", options: [
        { label: "Yes", tier: 0 }, { label: "No", tier: 1 }, { label: "Not sure", tier: 1 } ] },
      { id: "activities", label: "How many business activities?", options: [
        { label: "One", tier: 0 }, { label: "Two or more", tier: 2 } ] },
      { id: "premises", label: "How many business premises?", options: [
        { label: "One (or online only)", tier: 0 }, { label: "Two or more", tier: 2 } ] }
    ],
    govFees: [],
    included: ["Review of your details", "Online registration on IRIS", "Business added to your NTN record", "Registration certificate delivered", "Bank account letter on request"],
    excluded: ["Sales tax registration", "Bank account opening", "Provincial registrations"],
    process: P_REG("registration on IRIS", "registration certificate"),
    faqs: [
      ["Is a sole proprietorship the same as my personal NTN?", "The business is registered under your personal NTN. We add the business details to your record."],
      ["Do I need a bank account first?", "No. Most banks ask for your NTN record when opening a business account, so registration usually comes first."]
    ],
    addons: ["urgent", "consult"]
  },
  {
    id: "aop-registration",
    part: "A", name: "Association of Persons (AOP) registration (FBR)",
    summary: "Register a partnership or association of persons with FBR and get its NTN.",
    basis: "Varies by number and type of members",
    model: "tiered", time: "5–7 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 8000, criteria: "2–3 members, all with NTNs, signed partnership deed ready." },
      { key: "standard", name: "Standard", fee: 12000, criteria: "4–10 members, or some members without an NTN." },
      { key: "complex", name: "Complex", fee: 18000, criteria: "More than 10 members, or a member is a company or non-resident." }
    ],
    questions: [
      { id: "members", label: "How many members (partners)?", options: [
        { label: "2–3", tier: 0 }, { label: "4–10", tier: 1 }, { label: "More than 10", tier: 2 } ] },
      { id: "memberNtn", label: "Do all members have an NTN?", options: [
        { label: "Yes, all of them", tier: 0 }, { label: "No, some do not", tier: 1 } ] },
      { id: "memberType", label: "Is any member a company or non-resident?", options: [
        { label: "No", tier: 0 }, { label: "Yes", tier: 2 } ] }
    ],
    govFees: ["Stamp duty on the partnership deed (Sindh: Rs 5,000)", "Registrar of Firms fee, if registering the deed"],
    included: ["Review of partnership deed", "AOP registration on IRIS", "Principal officer setup", "Registration certificate delivered"],
    excluded: ["Preparing a new partnership deed", "Registrar of Firms registration", "Sales tax registration"],
    process: P_REG("AOP registration", "AOP NTN certificate"),
    faqs: [
      ["Do we need to register the deed with the Registrar of Firms?", "It is not always required for FBR registration, but many banks ask for it. We can explain your options in a consultation."],
      ["Who is the principal officer?", "One member who acts for the AOP with FBR. Usually the managing partner."]
    ],
    addons: ["urgent", "revision", "consult"]
  },
  {
    id: "smc-incorporation",
    part: "A", name: "Single member company incorporation (SECP)",
    summary: "Incorporate a one-person private limited company (SMC) with SECP, including name reservation and company NTN.",
    basis: "Varies by type of business",
    model: "tiered", time: "5–10 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 20000, criteria: "General trading, services or IT business." },
      { key: "standard", name: "Standard", fee: 25000, criteria: "Specialised objects such as consultancy, education or health." },
      { key: "complex", name: "Complex", fee: 35000, criteria: "Business that needs a licence or NOC, or the member is non-resident." }
    ],
    questions: [
      { id: "objects", label: "What kind of business?", options: [
        { label: "General trading, services or IT", tier: 0 }, { label: "Specialised (consultancy, education, health)", tier: 1 }, { label: "Needs a licence or NOC (security, travel, finance)", tier: 2 } ] },
      { id: "resident", label: "Where does the single member live?", options: [
        { label: "In Pakistan", tier: 0 }, { label: "Abroad", tier: 2 } ] }
    ],
    govFees: ["SECP name reservation fee", "SECP incorporation fee (depends on authorised capital)"],
    included: ["Name availability check and reservation", "Memorandum and Articles of Association", "Nominee and alternate nominee forms", "Online incorporation on eZfile", "Company NTN registration", "Certificate of incorporation delivered"],
    excluded: ["Licences or NOCs from other authorities", "Sales tax registration", "Bank account opening", "Annual SECP filings"],
    process: [
      ["Get your price", "Tell us the type of business."],
      ["Name reservation", "We check and reserve your company name with SECP."],
      ["Documents and filing", "We prepare the memorandum, articles and nominee forms and file for incorporation."],
      ["Certificate and NTN", "You receive your incorporation certificate and company NTN."]
    ],
    faqs: [
      ["Why does an SMC need a nominee?", "SECP requires a nominee and an alternate nominee who would take over the company's affairs if the single member dies or becomes unable to act."],
      ["Can an SMC later add shareholders?", "Yes. It can be converted into a private limited company. Ask us for a price."]
    ],
    addons: ["urgent", "revision", "consult"]
  },
  {
    id: "company-incorporation",
    part: "A", name: "Private limited company incorporation (SECP)",
    summary: "Incorporate a private limited company with SECP, including name reservation and company NTN.",
    basis: "Varies by number of directors and type of business",
    model: "tiered", time: "7–12 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 25000, criteria: "2 directors, all Pakistani residents, standard objects." },
      { key: "standard", name: "Standard", fee: 35000, criteria: "3–5 directors, or specialised business objects." },
      { key: "complex", name: "Complex", fee: 50000, criteria: "More than 5 directors, a foreign shareholder, or business needing a licence or NOC." }
    ],
    questions: [
      { id: "directors", label: "How many directors / shareholders?", options: [
        { label: "2", tier: 0 }, { label: "3–5", tier: 1 }, { label: "More than 5", tier: 2 } ] },
      { id: "foreign", label: "Will any shareholder be foreign or non-resident?", options: [
        { label: "No", tier: 0 }, { label: "Yes", tier: 2 } ] },
      { id: "objects", label: "What kind of business?", options: [
        { label: "General trading, services or IT", tier: 0 }, { label: "Specialised (consultancy, education, health)", tier: 1 }, { label: "Needs a licence or NOC (security, finance, travel)", tier: 2 } ] }
    ],
    govFees: ["SECP name reservation fee", "SECP incorporation fee (depends on authorised capital)"],
    included: ["Name availability check and reservation", "Memorandum and Articles of Association", "Online incorporation on eZfile", "Company NTN registration", "Certificate of incorporation delivered"],
    excluded: ["Licences or NOCs from other authorities", "Sales tax registration", "Bank account opening", "Annual SECP filings"],
    process: [
      ["Get your price", "Tell us the number of directors and type of business."],
      ["Name reservation", "We check and reserve your company name with SECP."],
      ["Documents and filing", "We prepare the memorandum and articles and file for incorporation."],
      ["Certificate and NTN", "You receive your incorporation certificate and company NTN."]
    ],
    faqs: [
      ["Can one person form a company?", "Yes, as a single member company. It has its own service and price."],
      ["Does authorised capital change the SECP fee?", "Yes. The SECP fee depends on authorised capital and is shown as a separate government fee."]
    ],
    addons: ["urgent", "revision", "consult"]
  },
  {
    id: "public-company-incorporation",
    part: "A", name: "Public limited company incorporation (SECP)",
    summary: "Incorporate an unlisted public limited company with SECP, with the extra filings a public company needs.",
    basis: "Varies by type of business and shareholders",
    model: "tiered", time: "15–25 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 75000, criteria: "Pakistani shareholders only, standard objects." },
      { key: "standard", name: "Standard", fee: 100000, criteria: "Specialised objects, or a foreign shareholder." },
      { key: "complex", name: "Complex", fee: 150000, criteria: "Regulated sector needing an SECP or other licence (e.g. NBFC, modaraba, insurance)." }
    ],
    questions: [
      { id: "foreign", label: "Will any shareholder be foreign or non-resident?", options: [
        { label: "No", tier: 0 }, { label: "Yes", tier: 1 } ] },
      { id: "objects", label: "What kind of business?", options: [
        { label: "General trading, services, manufacturing or IT", tier: 0 }, { label: "Specialised (education, health, real estate)", tier: 1 }, { label: "Regulated (NBFC, modaraba, insurance)", tier: 2 } ] }
    ],
    govFees: ["SECP name reservation fee", "SECP incorporation fee (depends on authorised capital)", "Licence fees of other regulators, if any"],
    included: ["Name availability check and reservation", "Memorandum and Articles of Association for a public company", "Online incorporation on eZfile", "Company NTN registration", "Guidance on commencement of business requirements"],
    excluded: ["Licence applications to other regulators", "Listing on the stock exchange", "Bank account opening", "Annual SECP filings"],
    process: [
      ["Get your price", "Tell us about your shareholders and business."],
      ["Name reservation", "We check and reserve your company name with SECP."],
      ["Documents and filing", "We prepare the constitutional documents and file for incorporation."],
      ["Certificate and NTN", "You receive your incorporation certificate and company NTN."]
    ],
    faqs: [["Is this the same as listing on the stock exchange?", "No. This service forms an unlisted public company. Listing is a separate, much larger process."]],
    addons: ["urgent", "revision", "consult"]
  },
  {
    id: "federal-sales-tax-registration",
    part: "A", name: "Federal sales tax registration (FBR)",
    summary: "Register for federal sales tax with FBR so you can issue sales tax invoices.",
    basis: "Varies by business type and premises",
    model: "tiered", time: "7–15 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 10000, criteria: "Trader or distributor with one premises." },
      { key: "standard", name: "Standard", fee: 15000, criteria: "Importer or exporter, or 2–3 premises." },
      { key: "complex", name: "Complex", fee: 20000, criteria: "Manufacturer, or 4 or more premises." }
    ],
    questions: [
      { id: "kind", label: "What kind of business is it?", options: [
        { label: "Trader / distributor / wholesaler", tier: 0 }, { label: "Importer or exporter", tier: 1 }, { label: "Manufacturer", tier: 2 } ] },
      { id: "premises", label: "How many business premises?", options: [
        { label: "One", tier: 0 }, { label: "2–3", tier: 1 }, { label: "4 or more", tier: 2 } ] }
    ],
    govFees: ["Biometric verification charges at the NADRA centre, if any"],
    included: ["Sales tax registration on IRIS", "Guidance for biometric verification", "Help with premises verification follow-up", "STRN delivered"],
    excluded: ["Monthly sales tax returns", "Electricity meter / industrial connection changes"],
    process: P_REG("sales tax application and guide you through biometric verification", "STRN"),
    faqs: [
      ["Do I need to visit for biometric verification?", "Usually yes, at a NADRA e-Sahulat or designated centre. We tell you exactly when and where."],
      ["When do monthly returns start?", "From the month after registration. Our monthly returns plan can take this on."]
    ],
    addons: ["urgent", "consult"]
  },
  {
    id: "srb-registration",
    part: "A", name: "Sindh sales tax on services registration (SRB)",
    summary: "Register with the Sindh Revenue Board if you provide taxable services in Sindh.",
    basis: "Varies by number of services and locations",
    model: "tiered", time: "5–10 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 10000, criteria: "One taxable service, one location in Sindh." },
      { key: "standard", name: "Standard", fee: 15000, criteria: "More than one taxable service, or 2–3 locations." },
      { key: "complex", name: "Complex", fee: 20000, criteria: "4 or more locations, or services in more than one province." }
    ],
    questions: [
      { id: "services", label: "How many taxable services do you provide?", options: [
        { label: "One", tier: 0 }, { label: "Two or more", tier: 1 } ] },
      { id: "locations", label: "How many locations?", options: [
        { label: "One", tier: 0 }, { label: "2–3", tier: 1 }, { label: "4 or more", tier: 2 } ] },
      { id: "other", label: "Do you also provide services in other provinces?", options: [
        { label: "No, Sindh only", tier: 0 }, { label: "Yes", tier: 2 } ] }
    ],
    govFees: [],
    included: ["Service classification check", "SRB e-registration", "SRB e-services access handed to you", "Registration certificate sent to you"],
    excluded: ["Monthly SRB returns", "Registration in other provinces"],
    process: P_REG("SRB registration", "SRB registration certificate"),
    faqs: [["Do I need SRB registration if I'm registered with FBR?", "FBR registration covers sales tax on goods. Services provided in Sindh fall under SRB, so you may need both."]],
    addons: ["urgent", "consult"]
  },
  {
    id: "pra-registration",
    part: "A", name: "Punjab sales tax on services registration (PRA)",
    summary: "Register with the Punjab Revenue Authority if you provide taxable services in Punjab.",
    basis: "Varies by number of services and locations",
    model: "tiered", time: "5–10 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 10000, criteria: "One taxable service, one location in Punjab." },
      { key: "standard", name: "Standard", fee: 15000, criteria: "More than one taxable service, or 2–3 locations." },
      { key: "complex", name: "Complex", fee: 20000, criteria: "4 or more locations, or services in more than one province." }
    ],
    questions: [
      { id: "services", label: "How many taxable services do you provide?", options: [
        { label: "One", tier: 0 }, { label: "Two or more", tier: 1 } ] },
      { id: "locations", label: "How many locations?", options: [
        { label: "One", tier: 0 }, { label: "2–3", tier: 1 }, { label: "4 or more", tier: 2 } ] },
      { id: "other", label: "Do you also provide services in other provinces?", options: [
        { label: "No, Punjab only", tier: 0 }, { label: "Yes", tier: 2 } ] }
    ],
    govFees: [],
    included: ["Service classification check", "PRA e-registration", "PRA e-services access handed to you", "Registration certificate sent to you"],
    excluded: ["Monthly PRA returns", "Registration in other provinces"],
    process: P_REG("PRA registration", "PRA registration certificate"),
    faqs: [["Our business is in Sindh but we serve clients in Punjab. Do we need PRA registration?", "Possibly. It depends on where the service is provided. Book a consultation and we'll go through your facts."]],
    addons: ["urgent", "consult"]
  },
  {
    id: "eobi-registration",
    part: "A", name: "EOBI employer registration",
    summary: "Register your business with the Employees' Old-Age Benefits Institution and enrol your employees.",
    basis: "Varies by number of employees and branches",
    model: "tiered", time: "7–15 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 8000, criteria: "Up to 10 employees, one location." },
      { key: "standard", name: "Standard", fee: 12000, criteria: "11–50 employees." },
      { key: "complex", name: "Complex", fee: 18000, criteria: "More than 50 employees, or more than one branch." }
    ],
    questions: [
      { id: "employees", label: "How many employees?", options: [
        { label: "Up to 10", tier: 0 }, { label: "11–50", tier: 1 }, { label: "More than 50", tier: 2 } ] },
      { id: "branches", label: "How many locations or branches?", options: [
        { label: "One", tier: 0 }, { label: "Two or more", tier: 2 } ] }
    ],
    govFees: ["Monthly EOBI contributions are paid by you directly to EOBI"],
    included: ["Employer registration application", "Employee enrolment forms (PR-02)", "Follow-up with the EOBI regional office", "Employer registration number delivered", "Explanation of your monthly contribution and how to pay it"],
    excluded: ["Monthly contribution filing", "SESSI / PESSI registration", "Replies to EOBI notices (see Notices)"],
    process: P_REG("employer registration with EOBI", "EOBI registration number"),
    faqs: [
      ["Who has to register with EOBI?", "Generally any business that employs five or more people. We confirm in the first review."],
      ["Is the EOBI contribution part of your fee?", "No. Contributions are paid by you directly to EOBI every month."]
    ],
    addons: ["urgent", "consult"]
  },

  /* ===================== B. Tax returns ===================== */
  {
    id: "nil-return",
    part: "B", name: "Nil (null) income tax return",
    summary: "A return for a taxpayer with no taxable income and no business activity in the year. Fixed price.",
    basis: "Fixed price for each taxpayer type",
    model: "unit", time: "1–2 working days",
    units: [
      { key: "individual", name: "Individual", fee: 1500, criteria: "No income, or only income below the taxable limit, plus a simple wealth statement." },
      { key: "aop", name: "AOP", fee: 3000, criteria: "Registered AOP with no business transactions in the year." },
      { key: "company", name: "Company", fee: 7500, criteria: "Dormant company with no operations; audited or management accounts provided." }
    ],
    questions: [
      { id: "type", label: "Who is filing?", options: [
        { label: "Individual", unit: "individual" }, { label: "AOP / partnership", unit: "aop" }, { label: "Company (any type)", unit: "company" } ] }
    ],
    govFees: [],
    included: ["Check that a nil return is correct for your case", "Return filed on IRIS", "Simple wealth statement (individuals)", "Acknowledgement delivered"],
    excluded: ["Returns with any income or transactions (see the full returns)", "Earlier years (see add-on)"],
    process: P_RET,
    faqs: [
      ["What if I had some income after all?", "Then a nil return would be wrong. We move you to the correct return service at its published price, and only with your approval."],
      ["Why file a nil return at all?", "Filing keeps you on the Active Taxpayers List, which lowers withholding tax on banking, property and vehicles."]
    ],
    addons: ["urgent", "historic"]
  },
  {
    id: "income-tax-return",
    part: "B", name: "Income tax return: salaried and other income (individual)",
    summary: "Annual return and wealth statement for an individual with salary, pension, rent, profit or capital gains.",
    basis: "Varies by income sources and number of assets",
    model: "tiered", time: "2–5 working days after documents are complete",
    tiers: [
      { key: "basic", name: "Basic", fee: 3500, criteria: "Salary or pension only, up to 10 assets and liabilities." },
      { key: "standard", name: "Standard", fee: 7500, criteria: "Salary plus rent, profit, dividends or capital gains; or 11–25 assets." },
      { key: "complex", name: "Complex", fee: 12000, criteria: "Foreign income or assets, more than 25 assets, or property sold in the year." }
    ],
    questions: [
      { id: "other", label: "Income besides salary or pension?", options: [
        { label: "None", tier: 0 }, { label: "Rent, profit on savings, dividends or capital gains", tier: 1 }, { label: "Foreign income", tier: 2 } ] },
      { id: "assets", label: "Roughly how many assets and liabilities (property, vehicles, bank accounts, loans)?", options: [
        { label: "Up to 10", tier: 0 }, { label: "11–25", tier: 1 }, { label: "More than 25", tier: 2 } ] },
      { id: "sold", label: "Did you sell any property in the year?", options: [
        { label: "No", tier: 0 }, { label: "Yes", tier: 2 } ] }
    ],
    govFees: ["Any tax payable is paid by you directly to FBR through a challan"],
    included: ["Review of your income and tax deducted", "Wealth statement and reconciliation", "Return filed on IRIS", "Copy of filed return and acknowledgement", "One review call before filing"],
    excluded: ["Business or freelance income (see the business return)", "Earlier years' returns (see add-on)", "Notice replies"],
    process: P_RET,
    faqs: [FAQ_TIER, FAQ_TAX],
    addons: ["urgent", "revision", "historic", "consult"]
  },
  {
    id: "business-individual-return",
    part: "B", name: "Income tax return: business, freelance or sole proprietor (individual)",
    summary: "Annual return and wealth statement for an individual earning from a business, profession or freelance work.",
    basis: "Varies by turnover and number of transactions",
    model: "tiered", time: "5–10 working days after documents are complete",
    tiers: [
      { key: "basic", name: "Basic", fee: 8000, criteria: "Turnover up to Rs 10 million and up to 300 transactions a year." },
      { key: "standard", name: "Standard", fee: 15000, criteria: "Turnover Rs 10–50 million, or 301–1,500 transactions, or freelance income from abroad." },
      { key: "complex", name: "Complex", fee: 25000, criteria: "Turnover above Rs 50 million, more than 1,500 transactions, or imports / exports." }
    ],
    questions: [
      { id: "turnover", label: "Annual turnover (sales or receipts)", options: [
        { label: "Up to Rs 10 million", tier: 0 }, { label: "Rs 10–50 million", tier: 1 }, { label: "Above Rs 50 million", tier: 2 } ] },
      { id: "txns", label: "Business transactions in the year", options: [
        { label: "Up to 300", tier: 0 }, { label: "301–1,500", tier: 1 }, { label: "More than 1,500", tier: 2 } ] },
      { id: "kind", label: "Type of income", options: [
        { label: "Local business or profession", tier: 0 }, { label: "Freelance / IT exports paid from abroad", tier: 1 }, { label: "Imports or exports of goods", tier: 2 } ] }
    ],
    govFees: ["Any tax payable is paid by you directly to FBR through a challan"],
    included: ["Profit and loss and balance sheet for the return", "Wealth statement and reconciliation", "Return filed on IRIS", "Copy of filed return and acknowledgement", "One review call before filing"],
    excluded: ["Bookkeeping", "Sales tax returns", "Earlier years' returns (see add-on)", "Notice replies"],
    process: P_RET,
    faqs: [FAQ_TIER, FAQ_TAX, ["Do I need proper books of account?", "Not for the Basic tier. We can work from bank statements and simple records. Larger businesses usually need a proper ledger."]],
    addons: ["urgent", "revision", "historic", "consult"]
  },
  {
    id: "aop-return",
    part: "B", name: "Income tax return: Association of Persons (AOP)",
    summary: "Annual income tax return for a partnership or AOP, with the share of profit for each partner.",
    basis: "Varies by turnover, transactions and number of partners",
    model: "tiered", time: "7–12 working days after documents are complete",
    tiers: [
      { key: "basic", name: "Basic", fee: 15000, criteria: "Turnover up to Rs 10 million, up to 500 transactions, up to 3 partners." },
      { key: "standard", name: "Standard", fee: 25000, criteria: "Turnover Rs 10–100 million, 501–2,000 transactions, or 4–10 partners." },
      { key: "complex", name: "Complex", fee: 40000, criteria: "Turnover above Rs 100 million, more than 2,000 transactions, more than 10 partners, or audited accounts." }
    ],
    questions: [
      { id: "turnover", label: "Annual turnover", options: [
        { label: "Up to Rs 10 million", tier: 0 }, { label: "Rs 10–100 million", tier: 1 }, { label: "Above Rs 100 million", tier: 2 } ] },
      { id: "txns", label: "Transactions in the year", options: [
        { label: "Up to 500", tier: 0 }, { label: "501–2,000", tier: 1 }, { label: "More than 2,000", tier: 2 } ] },
      { id: "partners", label: "Number of partners", options: [
        { label: "2–3", tier: 0 }, { label: "4–10", tier: 1 }, { label: "More than 10", tier: 2 } ] }
    ],
    govFees: ["Any tax payable is paid by the AOP directly to FBR"],
    included: ["Accounts for the return (profit and loss, balance sheet)", "Partners' profit shares worked out", "Return filed on IRIS", "Copy of filed return and acknowledgement", "One review meeting"],
    excluded: ["Partners' personal returns (separate service)", "Bookkeeping", "Sales tax returns", "Notice replies"],
    process: P_RET,
    faqs: [FAQ_TIER, FAQ_TAX],
    addons: ["urgent", "revision", "historic", "consult"]
  },
  companyReturn("smc-return", "single member company", "single member company (SMC)",
    ["Rs 10 million", "Rs 100 million"], [15000, 25000, 40000],
    { time: "7–12 working days after documents are complete" }),
  companyReturn("company-return", "private limited company", "private limited company",
    ["Rs 50 million", "Rs 500 million"], [25000, 45000, 75000],
    { time: "10–15 working days after documents are complete" }),
  companyReturn("public-company-return", "public limited company (unlisted)", "public limited company that is not listed",
    ["Rs 500 million", "Rs 2 billion"], [60000, 100000, 150000],
    { time: "15–20 working days after documents are complete" }),
  companyReturn("listed-company-return", "listed company", "company listed on the Pakistan Stock Exchange",
    ["Rs 2 billion", "Rs 10 billion"], [150000, 250000, 400000],
    { time: "15–25 working days after documents are complete",
      excluded: ["Transfer pricing documentation"], faqs: [["Do you work with our auditors and tax department?", "Yes. We work alongside your finance team and auditors and agree a timetable at the start."]] }),
  {
    id: "wealth-statement",
    part: "B", name: "Wealth statement and reconciliation",
    summary: "Prepare, reconcile or revise your wealth statement so your assets match your declared income.",
    basis: "Varies by number of assets and whether earlier statements need revising",
    model: "tiered", time: "2–5 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: 2500, criteria: "Up to 10 assets and liabilities, new statement for one year." },
      { key: "standard", name: "Standard", fee: 5000, criteria: "11–25 items, or a revision of a statement already filed." },
      { key: "complex", name: "Complex", fee: 10000, criteria: "More than 25 items, foreign assets, or an unexplained gap that needs reconciling." }
    ],
    questions: [
      { id: "items", label: "How many assets and liabilities?", options: [
        { label: "Up to 10", tier: 0 }, { label: "11–25", tier: 1 }, { label: "More than 25", tier: 2 } ] },
      { id: "kind", label: "What do you need?", options: [
        { label: "New statement for this year", tier: 0 }, { label: "Revise a statement already filed", tier: 1 }, { label: "Reconcile a gap between income and assets", tier: 2 } ] },
      { id: "foreign", label: "Any assets outside Pakistan?", options: [
        { label: "No", tier: 0 }, { label: "Yes", tier: 2 } ] }
    ],
    govFees: [],
    included: ["Wealth statement prepared on IRIS", "Wealth reconciliation (opening to closing)", "Revised statement filed, if needed", "Plain-language note on any gap found"],
    excluded: ["The income tax return itself", "Replies to notices about the statement"],
    process: P_RET,
    faqs: [["Why is the wealth statement important?", "FBR compares your assets with your declared income. An unexplained increase can lead to a notice, so the reconciliation must add up."]],
    addons: ["urgent", "historic", "consult"]
  },
  {
    id: "monthly-sales-tax-returns",
    part: "B", name: "Monthly sales tax returns (FBR, SRB, PRA)",
    summary: "We file your monthly sales tax returns with FBR, SRB or PRA, on time, every month.",
    basis: "Varies by invoices per month and number of authorities",
    model: "subscription", period: "month", time: "Filed before each monthly due date",
    tiers: [
      { key: "starter", name: "Starter", fee: 5000, criteria: "Up to 50 invoices a month, one authority." },
      { key: "growth", name: "Growth", fee: 10000, criteria: "51–200 invoices a month, or two authorities." },
      { key: "scale", name: "Scale", fee: 20000, criteria: "More than 200 invoices a month, or three authorities." }
    ],
    questions: [
      { id: "txns", label: "Sales and purchase invoices per month", options: [
        { label: "Up to 50", tier: 0 }, { label: "51–200", tier: 1 }, { label: "More than 200", tier: 2 } ] },
      { id: "authorities", label: "Which returns do you file?", options: [
        { label: "One of FBR, SRB or PRA", tier: 0 }, { label: "Two of them", tier: 1 }, { label: "All three", tier: 2 } ] }
    ],
    govFees: ["Sales tax payable is paid by you directly through a challan"],
    included: ["Monthly data review", "Return and annexures prepared and filed", "Challan amount worked out for you", "Filed return and acknowledgement each month", "Reminder before each due date"],
    excluded: ["Bookkeeping", "Annexure corrections for earlier months", "Notice replies"],
    process: [
      ["Choose your plan", "Your plan depends on invoices per month."],
      ["Send monthly data", "Send sales and purchase records on WhatsApp by the 7th of each month."],
      ["We prepare and file", "We file before the due date and tell you the tax payable."],
      ["You pay the challan", "You pay the tax directly; we keep the acknowledgement."]
    ],
    faqs: [
      ["What if my invoices go up in a busy month?", "Your plan is checked every quarter. If you consistently move to a higher band, we'll offer the higher plan for your approval first."],
      ["Can I cancel?", "Yes, with one month's notice. No lock-in."]
    ],
    addons: ["urgent", "historic", "consult"]
  },

  /* ===================== C. Notices & litigation ===================== */
  {
    id: "notice-reply",
    part: "C", name: "Notice review and written reply (FBR, SRB, PRA, SECP, EOBI, BOR)",
    summary: "Received a notice? We read it, explain it in plain language and prepare a written reply. Priced by type of notice.",
    basis: "Varies by type of notice",
    model: "unit", time: "Depends on your deadline — we plan backwards from it",
    units: [
      { key: "info", name: "Information or document request", fee: 5000, criteria: "Notices asking for documents or explanations (e.g. s.176 income tax, s.38 sales tax)." },
      { key: "nonfiling", name: "Non-filing or compliance notice", fee: 7500, criteria: "Notices for a missing return, statement or registration (e.g. s.114, s.117). Filing the return is priced separately." },
      { key: "showcause", name: "Show-cause notice", fee: 15000, criteria: "Notices proposing an addition, penalty, default surcharge or stamp duty deficiency." },
      { key: "amendment", name: "Amendment of assessment or audit notice", fee: 30000, criteria: "Notices to amend a filed return or select you for audit (e.g. s.122, s.177, sales tax s.25)." },
      { key: "demand", name: "Assessment order, demand or recovery notice", fee: 20000, criteria: "Orders raising a tax demand, recovery or attachment, with options explained." }
    ],
    questions: [
      { id: "authority", label: "Which authority sent the notice?", options: [
        { label: "FBR (income tax or sales tax)" }, { label: "SRB" }, { label: "PRA / KPRA" }, { label: "SECP" }, { label: "EOBI" }, { label: "Board of Revenue (BOR)" } ] },
      { id: "type", label: "What type of notice is it?", help: "Not sure? Pick the closest one; we confirm after reading the notice.", options: [
        { label: "Request for information / documents", unit: "info" }, { label: "Non-filing or compliance notice", unit: "nonfiling" }, { label: "Show-cause notice", unit: "showcause" },
        { label: "Amendment or audit notice", unit: "amendment" }, { label: "Assessment order, demand or recovery", unit: "demand" } ] },
      { id: "deadline", label: "Response deadline on the notice", type: "date" }
    ],
    govFees: ["Any tax, penalty or default surcharge is paid by you directly, if payable"],
    included: ["Plain-language explanation of the notice", "Written reply prepared and shared for your approval", "Reply filed online or ready for submission", "List of supporting documents to attach"],
    excluded: ["Hearing attendance (rate card)", "Appeals (see Audits and appeals)", "Payment of any tax demanded"],
    process: [
      ["Tell us the deadline", "We note it first and give priority to anything due within 7 days."],
      ["Send the notice", "Send all pages on WhatsApp. We read it and confirm the notice type and price."],
      ["Approve the reply", "You approve the reply before it goes anywhere."],
      ["Reply submitted", "We file it or hand it to you ready to submit."]
    ],
    faqs: [
      ["My deadline is in two days. Can you still help?", "Yes, tell us now. Matters due within 7 days are given priority and reviewed by Abdullah at once. Add Urgent handling if you need work to start within one working day."],
      ["What kind of Board of Revenue notices do you handle?", "Stamp duty deficiency, valuation and registration-related notices from the Board of Revenue and its sub-registrar offices."],
      ["What if the matter goes to appeal?", "Appeals are priced by stage. Each stage starts only after you approve and pay for it."]
    ],
    addons: ["urgent", "consult"],
    intake: "notice"
  },
  {
    id: "audits-appeals",
    part: "C", name: "Audits and appeals (stage-priced)",
    summary: "Representation in a tax audit or an appeal, priced one stage at a time so you always know the next cost.",
    basis: "Fixed price per stage",
    model: "unit", stage: true, time: "Depends on the hearing schedule set by the authority",
    units: [
      { key: "stay", name: "Stay application against recovery", fee: 15000, criteria: "Application to stop recovery while the matter is heard." },
      { key: "audit", name: "Tax audit representation", fee: 50000, criteria: "Handling an audit from selection to the audit report, including up to 3 hearings." },
      { key: "cira", name: "Appeal before Commissioner (Appeals)", fee: 35000, criteria: "Grounds of appeal, filing, and up to 2 hearings." },
      { key: "atir", name: "Appeal before the Appellate Tribunal", fee: 60000, criteria: "Appeal to the Appellate Tribunal Inland Revenue (or SRB / PRA tribunal), up to 2 hearings." }
    ],
    questions: [
      { id: "stage", label: "Which stage?", options: [
        { label: "Stay application", unit: "stay" }, { label: "Tax audit", unit: "audit" }, { label: "Appeal before Commissioner (Appeals)", unit: "cira" }, { label: "Appeal before the Appellate Tribunal", unit: "atir" } ] },
      { id: "deadline", label: "Filing deadline or next hearing date", type: "date" }
    ],
    govFees: ["Appeal filing fee charged by the authority", "Any tax, penalty or surcharge, if payable"],
    included: ["Review of the order or audit notice", "Preparation of grounds, statement of facts or submissions", "Filing with the authority", "Attendance at the hearings stated for the stage", "Written update after each hearing"],
    excluded: ["Hearings beyond those stated (rate card)", "References to the High Court (custom scope)", "Payment of any tax demanded"],
    process: [
      ["Choose the stage", "Each stage has its own published price."],
      ["Send the record", "Send the order and documents on WhatsApp; we review them."],
      ["We prepare and file", "You approve the grounds or submissions before filing."],
      ["Hearings", "We attend and update you in writing after each hearing."]
    ],
    faqs: [["Do I have to pay for every stage up front?", "No. You pay for one stage at a time and decide whether to go further after each result."]],
    addons: ["urgent", "consult"],
    intake: "notice"
  },

  {
    id: "assessment-proceedings",
    part: "C", name: "Assessment proceedings (stage-priced)",
    summary: "Representation while an authority assesses or amends your tax: written submissions and hearings, priced at our published rate card.",
    basis: "Rate card: per written submission, per hearing or per visit",
    model: "unit", stage: true, time: "Depends on the hearing schedule set by the authority",
    units: [
      { key: "submission", name: "Written submission", fee: RATE("submission"), criteria: "Preparation of one written submission or reply in the proceedings (rate card)." },
      { key: "hearing", name: "Hearing attendance", fee: RATE("hearing"), criteria: "Attending one hearing before the officer (rate card)." },
      { key: "visit", name: "Visit to the office", fee: RATE("visit"), criteria: "One visit to the department to follow up or file papers (rate card)." }
    ],
    questions: [
      { id: "stage", label: "What do you need for this stage?", options: [
        { label: "A written submission or reply", unit: "submission" }, { label: "Attendance at a hearing", unit: "hearing" }, { label: "A visit to the office for my matter", unit: "visit" } ] },
      { id: "qty", label: "How many?", type: "number", min: 1, max: 10 },
      { id: "deadline", label: "Next deadline or hearing date", type: "date" }
    ],
    govFees: ["Any tax, penalty or surcharge, if payable"],
    included: ["Review of the notice and assessment record", "The submissions, hearings or visits you order", "Written update after each step"],
    excluded: ["Appeals (see Audits and appeals)", "Payment of any tax demanded"],
    process: [
      ["Choose the step", "Each submission, hearing or visit has a published rate."],
      ["Send the record", "Send the notice and documents on WhatsApp; we review them."],
      ["Approve and pay", "You approve the step before it starts."],
      ["We act and update you", "We file or attend and update you on WhatsApp."]
    ],
    faqs: [["Do I have to commit to every hearing at once?", "No. Each step is ordered and paid for separately, so you decide after each one."]],
    addons: ["urgent", "consult"],
    intake: "notice"
  },
  {
    id: "tax-petitions",
    part: "C", name: "Petitions and applications (stage-priced)",
    summary: "Petitions and applications before a tax or revenue authority, such as rectification or condonation of delay, priced by stage at our rate card.",
    basis: "Rate card: per petition and per hearing",
    model: "unit", stage: true, time: "Depends on the authority's schedule",
    units: [
      { key: "petition", name: "Petition or application", fee: RATE("submission"), criteria: "Preparing and filing one petition or application (rate card: written submission)." },
      { key: "hearing", name: "Hearing attendance", fee: RATE("hearing"), criteria: "Attending one hearing on the petition (rate card)." }
    ],
    questions: [
      { id: "stage", label: "Which stage?", options: [
        { label: "Prepare and file the petition", unit: "petition" }, { label: "Attend a hearing on it", unit: "hearing" } ] },
      { id: "qty", label: "How many?", type: "number", min: 1, max: 10 },
      { id: "deadline", label: "Filing deadline or hearing date", type: "date" }
    ],
    govFees: ["Any filing fee charged by the authority"],
    included: ["Review of the order or record", "Petition or application prepared for your approval", "Filing with the authority", "Hearings you order"],
    excluded: ["Constitutional petitions or references to the High Court (custom scope)", "Payment of any tax demanded"],
    process: [
      ["Choose the stage", "Each stage has a published rate."],
      ["Send the record", "Send the order and documents on WhatsApp."],
      ["We prepare and file", "You approve the petition before it is filed."],
      ["Hearing and update", "We attend the hearings you order and update you on WhatsApp."]
    ],
    faqs: [["Which petitions does this cover?", "Petitions and applications before the tax or revenue authority itself, such as rectification of a mistake or condonation of delay. Court petitions are custom scope and quoted at our rate card first."]],
    addons: ["urgent", "consult"],
    intake: "notice"
  },

  /* ===================== D. Advice ===================== */
  {
    id: "consultation",
    part: "D", name: "Paid consultation (30 minutes)",
    summary: "A 30-minute call or meeting with Abdullah (LLB, LLM) to talk through your tax or compliance question. Booked on WhatsApp.",
    basis: "Fixed price per session",
    model: "unit", time: "Usually within 2 working days",
    units: [
      { key: "session", name: "30-minute consultation", fee: 3000, criteria: "Per 30-minute session, by phone, video or at our office." }
    ],
    questions: [
      { id: "mode", label: "How would you like to meet?", options: [
        { label: "Video call", unit: "session" }, { label: "Phone call", unit: "session" }, { label: "At our office", unit: "session" } ] },
      { id: "qty", label: "Number of sessions", type: "number", min: 1, max: 4 }
    ],
    govFees: [],
    included: ["30 minutes with a consultant", "Short written summary of what was discussed"],
    excluded: ["Formal written tax opinion (see Written tax opinion)", "Filing or registration work"],
    process: [
      ["Book on WhatsApp", "Choose how you'd like to meet and send your order."],
      ["Share your question", "Send a short note and any documents."],
      ["Meet", "We call or meet at the agreed time (PKT)."],
      ["Summary", "You receive a short written summary."]
    ],
    faqs: [["If I then order a service, is the consultation fee deducted?", "Yes. If you order a service within 14 days, the fee for one session is deducted from it. This applies to everyone."]],
    addons: []
  },

  {
    id: "tax-health-check",
    part: "D", name: "Tax health check",
    summary: "A review of your registrations, returns and records to find gaps and risks before they turn into notices.",
    basis: "Rate card: principal consultant time, per hour",
    model: "unit", time: "Usually within 5 working days of receiving your records",
    units: [
      { key: "hour", name: "Principal consultant time", fee: RATE("principal"), criteria: "Per hour of review by Abdullah (rate card). We tell you the expected hours in writing before starting." }
    ],
    questions: [
      { id: "who", label: "Who is the check for?", options: [
        { label: "Individual", unit: "hour" }, { label: "Sole proprietorship or AOP", unit: "hour" }, { label: "Company", unit: "hour" } ] },
      { id: "qty", label: "Hours of review", help: "Start with 1. If more time is needed, we send a written scope for your approval first.", type: "number", min: 1, max: 10 }
    ],
    govFees: [],
    included: ["Review of registrations, recent returns and notices", "Plain-language list of gaps and risks found", "Suggested next steps, with published prices"],
    excluded: ["Filing or correcting returns (separate services)", "Replies to notices"],
    process: [
      ["Order on WhatsApp", "Tell us who the check is for."],
      ["Send your records", "Recent returns, registrations and any notices."],
      ["We review", "Abdullah reviews your records."],
      ["Your summary", "You receive a written list of findings and next steps."]
    ],
    faqs: [["Will the health check fix the problems it finds?", "No. It tells you what needs attention. Any fix is a separate service at its published price, and only if you want it."]],
    addons: ["urgent"]
  },
  {
    id: "written-tax-opinion",
    part: "D", name: "Written tax opinion",
    summary: "A written opinion on a specific tax question, based on the facts and documents you give us.",
    basis: "Rate card: principal consultant time, per hour",
    model: "unit", time: "Agreed in the written scope before work starts",
    units: [
      { key: "hour", name: "Principal consultant time", fee: RATE("principal"), criteria: "Per hour of research and writing by Abdullah (rate card). We tell you the expected hours in writing before starting." }
    ],
    questions: [
      { id: "topic", label: "What is the question about?", options: [
        { label: "Income tax", unit: "hour" }, { label: "Sales tax (FBR, SRB or PRA)", unit: "hour" }, { label: "Stamp duty", unit: "hour" }, { label: "Something else", unit: "hour" } ] },
      { id: "qty", label: "Hours", help: "Start with 1. We confirm the hours in a written scope before any work starts.", type: "number", min: 1, max: 20 }
    ],
    govFees: [],
    included: ["Review of your facts and documents", "Written opinion on the question agreed in the scope", "One follow-up call to explain it"],
    excluded: ["Representation before an authority", "Questions outside the agreed scope"],
    process: [
      ["Order on WhatsApp", "Tell us the topic."],
      ["Send the facts", "A written description and the documents."],
      ["Written scope", "We confirm the question and the hours for your approval."],
      ["Your opinion", "You receive the written opinion and a follow-up call."]
    ],
    faqs: [["Does a written opinion decide how the authority will rule?", "No. It sets out our view on your facts. No one can promise a decision by a tax authority or court."]],
    addons: ["urgent"]
  },

  /* ===================== E. Stamp duty ===================== */
  ...["sindh", "punjab"].map((prov) => {
    const P = prov === "sindh" ? "Sindh" : "Punjab";
    return {
      id: "stamp-duty-challan-" + prov,
      part: "E", name: `Stamp duty challan preparation (${P})`,
      summary: `We check your document, work out the correct duty and prepare the e-stamp challan in ${P}.`,
      basis: "Fixed price per challan",
      model: "unit", time: "1–2 working days",
      units: [
        prov === "sindh"
          ? { key: "sindh", name: "Sindh challan", fee: 2000, criteria: "Per challan for an instrument executed in Sindh." }
          : { key: "punjab", name: "Punjab challan", fee: 2500, criteria: "Per challan for an instrument executed in Punjab." }
      ],
      questions: [
        { id: "instrument", label: "Type of document", options: [
          "Sale deed / transfer of property", "Gift deed", "Lease or rent agreement", "Partnership deed",
          "Power of attorney", "Share transfer / company document", "Loan, mortgage or bond", "Other"].map((label) => ({ label, unit: prov })) },
        { id: "qty", label: "Number of challans", type: "number", min: 1, max: 50 }
      ],
      unitNote: "We confirm the exact duty before preparing your challan.",
      govFees: ["Stamp duty at actual cost, paid by you directly to the government"],
      included: ["Check of instrument type and value", "Duty worked out from the current schedule", "E-stamp challan prepared with correct particulars", "Challan copy sent to you on WhatsApp"],
      excluded: ["Stamp duty itself", "Writing the document itself", "Registration with the sub-registrar"],
      process: [
        ["Get your price", "Choose the document type and number of challans."],
        ["Send the document", "Send it on WhatsApp; we check the instrument type and value."],
        ["We confirm the duty", "We tell you the exact duty before preparing the challan."],
        ["Challan ready", "You pay the duty directly; we send you the challan."]
      ],
      faqs: [
        ["Do you collect the stamp duty?", "No. Stamp duty is paid by you directly to the government through the authorised channel. It is never part of our fee."],
        ["Why are Sindh and Punjab priced separately?", "The rules, rates and procedures differ between the provinces, so each has its own checklist, price and time estimate."]
      ],
      addons: ["urgent"]
    };
  }),
  {
    id: "stamp-duty-assessment",
    part: "E", name: "Stamp duty assessment and advice",
    summary: "We read your document, tell you which article of the stamp duty schedule applies and how much duty is due, before you sign or pay.",
    basis: "Rate card: consultant time, per hour",
    model: "unit", time: "1–3 working days",
    units: [
      { key: "hour", name: "Consultant time", fee: RATE("consultant"), criteria: "Per hour (rate card). Most single documents need one hour; we confirm before starting." }
    ],
    questions: [
      { id: "province", label: "Which province?", options: [
        { label: "Sindh", unit: "hour" }, { label: "Punjab", unit: "hour" } ] },
      { id: "qty", label: "Hours", help: "Start with 1. If more time is needed, we tell you first.", type: "number", min: 1, max: 10 }
    ],
    govFees: ["Stamp duty at actual cost, paid by you directly to the government"],
    included: ["Instrument type and schedule article identified", "Duty worked out on the correct value", "Short written note of the result"],
    excluded: ["The challan itself (see Stamp duty challan)", "Stamp duty itself"],
    process: [
      ["Order on WhatsApp", "Choose the province."],
      ["Send the document", "Send the document and the value on WhatsApp."],
      ["We assess", "We identify the article and work out the duty."],
      ["Written note", "You receive the result and can order the challan."]
    ],
    faqs: [["Is this the same as the challan service?", "No. This tells you the duty and why. The challan service prepares the e-stamp challan itself."]],
    addons: ["urgent"]
  },
  {
    id: "stamp-duty-document-review",
    part: "E", name: "Stamp duty document review",
    summary: "A check of a deed or agreement for stamp duty points before it is signed: the instrument type, the value stated and the parties.",
    basis: "Rate card: consultant time, per hour",
    model: "unit", time: "1–3 working days",
    units: [
      { key: "hour", name: "Consultant time", fee: RATE("consultant"), criteria: "Per hour of review (rate card). We confirm the hours before starting." }
    ],
    questions: [
      { id: "province", label: "Which province?", options: [
        { label: "Sindh", unit: "hour" }, { label: "Punjab", unit: "hour" } ] },
      { id: "qty", label: "Hours", help: "Start with 1. If more time is needed, we tell you first.", type: "number", min: 1, max: 10 }
    ],
    govFees: [],
    included: ["Review of the document for stamp duty points", "Written list of changes we suggest", "One follow-up call"],
    excluded: ["Writing or rewriting the document", "Legal advice on matters other than stamp duty"],
    process: [
      ["Order on WhatsApp", "Choose the province."],
      ["Send the document", "Send the document on WhatsApp."],
      ["We review", "We check it for stamp duty points."],
      ["Your notes", "You receive written notes and a follow-up call."]
    ],
    faqs: [["Can you review a document that is already signed?", "Yes. We then tell you whether the duty paid looks correct and what can be done if it is not."]],
    addons: ["urgent"]
  },
  {
      id: "stamp-duty-notice-reply",
      part: "E", name: "Reply to a stamp duty or Board of Revenue notice",
      summary: "A Board of Revenue or sub-registrar notice about stamp duty, valuation or registration, read, explained and answered in writing. Same prices as our notice replies.",
      basis: "Varies by type of notice (same prices as Notice review and reply)",
      model: "unit", time: "Depends on your deadline; we plan backwards from it",
      unitsFrom: { service: "notice-reply", keys: ["info", "showcause", "demand"] },
      questions: [
        { id: "type", label: "What type of notice is it?", help: "Not sure? Pick the closest one; we confirm after reading the notice.", options: [
          { label: "Request for information or documents", unit: "info" }, { label: "Show-cause or stamp duty deficiency notice", unit: "showcause" }, { label: "Order, demand or recovery notice", unit: "demand" } ] },
        { id: "deadline", label: "Response deadline on the notice", type: "date" }
      ],
      govFees: ["Any duty, penalty or surcharge is paid by you directly, if payable"],
      included: ["Plain-language explanation of the notice", "Written reply prepared and shared for your approval", "Reply ready for submission", "List of supporting documents to attach"],
      excluded: ["Hearing attendance (rate card)", "Adjudication, refund or appeal (see that service)", "Payment of any duty demanded"],
      process: [
        ["Tell us the deadline", "We note it first and give priority to anything due within 7 days."],
        ["Send the notice", "Send the notice and the document on WhatsApp."],
        ["Approve the reply", "You approve the reply before it goes anywhere."],
        ["Reply submitted", "We file it or hand it to you ready to submit."]
      ],
      faqs: [["Who sends stamp duty notices?", "Usually the Board of Revenue or a sub-registrar office, about duty that appears to be short-paid, the value used or the registration of a document."]],
      addons: ["urgent", "consult"],
      intake: "notice"
  },
  {
    id: "stamp-duty-adjudication",
    part: "E", name: "Stamp duty adjudication, refund or appeal (stage-priced)",
    summary: "Applications for adjudication of duty, refunds of spoiled or unused stamps, and appeals, priced by stage at our rate card.",
    basis: "Rate card: per application and per hearing",
    model: "unit", stage: true, time: "Depends on the authority's schedule",
    units: [
      { key: "application", name: "Application or appeal", fee: RATE("submission"), criteria: "Preparing and filing one application for adjudication, refund or appeal (rate card: written submission)." },
      { key: "hearing", name: "Hearing attendance", fee: RATE("hearing"), criteria: "Attending one hearing (rate card)." }
    ],
    questions: [
      { id: "kind", label: "What do you need?", options: [
        { label: "Adjudication of duty", unit: "application" }, { label: "Refund of stamps or duty", unit: "application" }, { label: "Appeal against an order", unit: "application" }, { label: "Attendance at a hearing", unit: "hearing" } ] },
      { id: "qty", label: "How many?", type: "number", min: 1, max: 10 },
      { id: "deadline", label: "Deadline or hearing date", type: "date" }
    ],
    govFees: ["Any fee or duty charged by the authority"],
    included: ["Review of the document and any order", "Application or appeal prepared for your approval", "Filing with the authority", "Hearings you order"],
    excluded: ["Payment of any duty demanded", "Court proceedings (custom scope)"],
    process: [
      ["Choose the stage", "Each stage has a published rate."],
      ["Send the papers", "Send the document, order and proof of duty paid on WhatsApp."],
      ["We prepare and file", "You approve the application before it is filed."],
      ["Hearing and update", "We attend the hearings you order and update you on WhatsApp."]
    ],
    faqs: [["Is a refund certain once applied for?", "No. The authority decides refunds under its own rules and timing. We prepare a complete application and follow it up."]],
    addons: ["urgent"],
    intake: "notice"
  }
];


// Services that reuse another service's published units (no price retyped).
TS.services.forEach((s) => {
  if (!s.unitsFrom) return;
  const src = TS.services.find((x) => x.id === s.unitsFrom.service);
  s.units = s.unitsFrom.keys.map((k) => ({ ...src.units.find((u) => u.key === k) }));
  delete s.unitsFrom;
});

/* Documents you provide (Appendix C). Each service page shows its list,
 * then the fixed security note (TS.docsNote). */
TS.docsNote = "Send clear photos or PDFs on WhatsApp. Never send passwords, OTPs, card numbers or PINs.";
TS.documents = {
  ntn: ["CNIC (front and back)", "Mobile number registered in your own name", "Email address", "Occupation and source of income", "Bank account details (IBAN)"],
  sole: ["CNIC", "Business name, nature of business and start date", "Business address", "Utility bill for the premises", "Rent agreement or proof of ownership", "Bank account details", "Mobile number and email"],
  aop: ["Partnership deed or association agreement", "CNIC and NTN of every member", "Business name, nature of business and address", "Utility bill and rent agreement or ownership proof for the premises", "Bank account details", "Authority letter naming the person who will operate the account"],
  company: ["Three proposed company names", "CNIC (or passport) and NTN of every director and shareholder", "Address, mobile and email for each", "Business objectives", "Proposed authorised capital and share split", "Registered office address with a utility bill or rent agreement"],
  fst: ["NTN", "CNIC of owner, partners or directors", "Bank account certificate in the business name", "Gas and electricity consumer numbers of the premises", "GPS-tagged photos of the premises (manufacturers: photos of machinery)", "Partnership deed or incorporation certificate where applicable", "Details of branches"],
  srbpra: ["NTN", "CNIC of owner, partners or directors", "Business address with utility bill", "Rent agreement or ownership proof", "List of taxable services you provide", "Bank account details", "Partnership deed or incorporation certificate where applicable"],
  eobi: ["NTN", "Employer CNIC", "Business registration or incorporation proof", "Business address", "List of employees with CNIC, designation, joining date and salary"],
  individualReturn: ["CNIC", "NTN and a way for us to file for you (we guide you on authorising us; do not share passwords by message)", "Salary certificate or slips", "Bank profit certificates", "Tax deducted certificates", "Rental income details", "Property and vehicle details", "Foreign income details", "Last year's return and wealth statement"],
  nil: ["CNIC", "NTN", "A short note confirming you had no taxable income", "Last year's return, if any"],
  aopReturn: ["Partnership deed", "Partner details", "Bank statements", "Sales and expense records or accounts", "Tax deducted certificates", "Withholding statements", "Last year's return"],
  companyReturn: ["Audited or draft accounts", "Trial balance", "Bank statements", "Tax deducted certificates", "Withholding statements", "SECP filings", "Last year's return"],
  wealth: ["Details of property, vehicles, bank balances, investments, gold and cash", "Loans and liabilities", "Last year's wealth statement"],
  monthly: ["Sales and purchase invoices or registers for the month", "Bank statements", "Tax deducted certificates", "Previous month's return"],
  notice: ["Complete copy of the notice and attachments", "The date you received it", "The response deadline", "Related returns and records", "Earlier correspondence", "Any authority letter already given"],
  challan: ["Draft or signed document", "Names and CNICs of the parties", "Property details and value or consideration", "District or sub-registrar office", "Any earlier duty paid"],
  stampNotice: ["Copy of the notice", "The document concerned", "Proof of duty paid", "Valuation papers if any", "The response deadline"],
  consult: ["A short note about your question or business", "Relevant returns and records", "Preferred time"],
  opinion: ["A written description of the question", "All relevant facts and documents", "Any notice or correspondence"]
};
const DOCS_FOR = {
  "individual-ntn": "ntn", "sole-proprietorship-registration": "sole", "aop-registration": "aop",
  "smc-incorporation": "company", "company-incorporation": "company", "public-company-incorporation": "company",
  "federal-sales-tax-registration": "fst", "srb-registration": "srbpra", "pra-registration": "srbpra", "eobi-registration": "eobi",
  "nil-return": "nil", "income-tax-return": "individualReturn", "business-individual-return": "individualReturn", "aop-return": "aopReturn",
  "smc-return": "companyReturn", "company-return": "companyReturn", "public-company-return": "companyReturn", "listed-company-return": "companyReturn",
  "wealth-statement": "wealth", "monthly-sales-tax-returns": "monthly",
  "notice-reply": "notice", "audits-appeals": "notice", "assessment-proceedings": "notice", "tax-petitions": "notice",
  "consultation": "consult", "tax-health-check": "consult", "written-tax-opinion": "opinion",
  "stamp-duty-challan-sindh": "challan", "stamp-duty-challan-punjab": "challan", "stamp-duty-assessment": "challan", "stamp-duty-document-review": "challan",
  "stamp-duty-notice-reply": "stampNotice", "stamp-duty-adjudication": "stampNotice"
};
const DOCS_EXTRA = {
  "smc-incorporation": ["Single-member company: the nominee's details"],
  "public-company-incorporation": ["Public limited company: details of the proposed directors and subscribers"],
  "listed-company-return": ["Listed companies: the annual report and relevant disclosures"]
};
TS.services.forEach((s) => {
  const key = DOCS_FOR[s.id];
  if (!key) throw new Error("No Appendix C document list for " + s.id);
  s.checklist = [...TS.documents[key], ...(DOCS_EXTRA[s.id] || [])];
});

// Statutory deadlines (free tool). Indicative: check each date against the latest notification.
TS.deadlines = [
  { day: "15", when: "Every month", title: "Sales tax payment (FBR)", note: "Payment of sales tax for the previous month.", auth: "FBR" },
  { day: "18", when: "Every month", title: "Sales tax return (FBR)", note: "Monthly sales tax return for the previous month.", auth: "FBR" },
  { day: "15", when: "Every month", title: "SRB sales tax on services payment", note: "Payment for the previous month.", auth: "SRB" },
  { day: "18", when: "Every month", title: "SRB monthly return", note: "Return for the previous month.", auth: "SRB" },
  { day: "18", when: "Every month", title: "PRA monthly return", note: "Return and payment for the previous month.", auth: "PRA" },
  { day: "15", when: "Every month", title: "EOBI contribution", note: "Employer and employee contribution for the previous month.", auth: "EOBI" },
  { day: "20", when: "Quarterly", title: "Withholding tax statements", note: "Quarterly statements for the previous quarter.", auth: "FBR" },
  { day: "30", when: "September", title: "Income tax return (individuals and AOPs)", note: "Annual return and wealth statement for the tax year ended 30 June.", auth: "FBR" },
  { day: "31", when: "December", title: "Income tax return (companies, June year-end)", note: "Annual return for companies with a 30 June year-end.", auth: "FBR" }
];
