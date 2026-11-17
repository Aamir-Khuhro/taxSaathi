/* TaxSaathi — service catalogue, price rules and quote questions.
 *
 * This file is the single source of truth for every price on the site.
 * Until the admin panel is built, the owner edits prices HERE.
 *
 *   - Prices (PKR, professional fee only) were set in November 2026 against
 *     published price lists of other Pakistani consultants. Review each quarter.
 *   - `basis` tells the client, in plain words, whether a price is fixed or what
 *     it depends on.
 *   - There is deliberately no per-client price field anywhere (rule 4.3.2).
 */

window.TS = window.TS || {};

TS.business = {
  name: "TaxSaathi",
  tagline: "Tax · Regulatory · Compliance",
  phone: "0325 3936334",
  phoneIntl: "923253936334",
  email: "taxsaathie@gmail.com",
  address: "Office adjacent to Idara Maarif-ul-Quran, Sector A, Street No. 2, Kashmir Colony, Korangi Road, Karachi",
  social: {
    linkedin: "#", // [OWNER TO CONFIRM] profile URLs
    facebook: "#",
    instagram: "#",
    youtube: "#"
  }
};

TS.owner = {
  name: "Abdullah",
  title: "Founder and principal consultant",
  qualifications: ["LLB, SM Law College, Karachi", "LLM, SM Law College, Karachi"],
  years: 5,
  departments: ["FBR", "SRB", "PRA", "SECP", "EOBI", "Board of Revenue", "Excise & Taxation"]
};

TS.pricing = {
  version: "2026.2",
  effectiveFrom: "1 December 2026",
  lastReviewed: "17 November 2026",
  quoteValidityDays: 14,
  taxOnFee: null          // e.g. { label: "Sindh sales tax on services", rate: 0.15 } if TaxSaathi registers with SRB
};

// Switches for elements that need the owner's written approval (section 5).
TS.features = {
  testimonials: false,
  adLandingPages: false
};

TS.parts = [
  { key: "A", slug: "registration", name: "Registrations", blurb: "NTN, business, company, sales tax and EOBI registrations with FBR, SECP, SRB, PRA and EOBI.", icon: "id" },
  { key: "B", slug: "returns", name: "Tax returns", blurb: "Annual returns for individuals, AOPs and every kind of company, nil returns, wealth statements and monthly sales tax.", icon: "doc" },
  { key: "C", slug: "litigation", name: "Notices & litigation", blurb: "Replies to notices from FBR, SRB, PRA, SECP, EOBI and the Board of Revenue, plus audits and appeals. Priced by notice type.", icon: "shield" },
  { key: "D", slug: "other", name: "Advice & consultation", blurb: "Paid consultations with a qualified tax lawyer.", icon: "chat" },
  { key: "E", slug: "stamp-duty", name: "Stamp duty", blurb: "E-stamp challans, duty assessment and document review for Sindh and Punjab.", icon: "stamp" }
];

// Published add-ons. Each service lists which add-ons it accepts.
TS.addons = {
  urgent:   { name: "Urgent handling", desc: "Work starts within one working day and is prioritised.", fee: 3000 },
  revision: { name: "Extra revision", desc: "One additional revision after the first delivered draft.", fee: 1500 },
  historic: { name: "Earlier year filing or correction", desc: "Per earlier tax year or period that needs filing or correcting.", fee: 3000, perUnit: "per year" },
  consult:  { name: "Additional 30-minute consultation", desc: "Extra call with a consultant about this order.", fee: 3000 }
};

// Public standard rate card for Custom scope work (rule 4.3.9). Same for everyone.
TS.rateCard = [
  { name: "Consultant time", unit: "per hour", fee: 4000 },
  { name: "Principal consultant time (Abdullah)", unit: "per hour", fee: 7500 },
  { name: "Hearing attendance", unit: "per hearing", fee: 5000 },
  { name: "Visit to a government office for your matter", unit: "per visit", fee: 3000 },
  { name: "Drafting of a written submission", unit: "per submission", fee: 10000 }
];

/* ---------- Shared building blocks ---------- */
const P_REG = (thing, cert) => [
  ["Get your price", "Answer a few questions and see your tier at once."],
  ["Provide documents", "Upload the documents listed below from your phone."],
  ["We verify and file", `We check everything, then file the ${thing}.`],
  ["Receive " + cert, `Your ${cert} is delivered to you with your login details.`]
];
const P_RET = [
  ["Get your price", "Answer a few questions about the year."],
  ["Provide documents", "We tick off each document as it arrives."],
  ["Review the draft", "We share the draft return and computation for your approval."],
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
      { id: "regimes", label: "How is the income taxed?", help: "Not sure? Pick the first option; we confirm from your accounts.", options: [
        { label: "Normal tax regime only", tier: 0 }, { label: "Mix of normal, final or minimum tax", tier: 1 }, { label: "Exports / imports, or a tax credit or exemption", tier: 2 } ] },
      { id: "branches", label: "Places of business", options: [
        { label: "One", tier: 0 }, { label: "2–3", tier: 1 }, { label: "More than 3", tier: 2 } ] }
    ],
    govFees: ["Any tax payable is paid by the company directly to FBR"],
    included: ["Review of audited accounts and tax computation", "Reconciliation of tax deducted and advance tax", "Return filed on IRIS", "Copy of filed return and acknowledgement", "One review meeting with the finance team"],
    excluded: ["Statutory audit", "Preparing financial statements", "Withholding statements", "Notice replies", ...(extra.excluded || [])],
    checklist: ["Company NTN and IRIS login", "Audited financial statements for the year (signed)", "Trial balance and general ledger", "Withholding tax certificates and challans (tax deducted from the company)", "Advance tax challans paid in the year", "Fixed asset register with tax depreciation", "Last year's filed return and tax computation", ...(extra.checklist || [])],
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
    included: ["IRIS account creation", "NTN registration", "Login handed over to you securely", "Short guide to your next filing date"],
    excluded: ["Filing your income tax return", "Business registration"],
    checklist: ["CNIC (front and back)", "Mobile number registered in your name (biometric SIM)", "Email address you can access", "Current address", "For overseas Pakistanis: NICOP or passport"],
    process: [
      ["Get your price", "Tell us about your income source."],
      ["Provide documents", "CNIC, mobile and email."],
      ["We register you", "We create your IRIS account; you confirm the codes sent to your phone."],
      ["You're registered", "We hand over your NTN and login."]
    ],
    faqs: [
      ["Will you keep my IRIS password?", "No. We hand the login to you and recommend you change the password once registration is done."],
      ["Does an NTN make me a filer?", "No. You appear on the Active Taxpayers List after you file your income tax return."]
    ],
    addons: ["urgent"]
  },
  {
    id: "sole-proprietorship-registration",
    part: "A", name: "Sole proprietorship registration (FBR)",
    summary: "Register your one-owner business with FBR so it has a valid NTN and business record.",
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
    checklist: ["CNIC (front and back)", "Mobile number registered in your name", "Email address", "Proof of business premises (rent agreement or ownership document)", "Latest paid utility bill of the premises", "Business name and letterhead details"],
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
    excluded: ["Drafting a new partnership deed", "Registrar of Firms registration", "Sales tax registration"],
    checklist: ["Signed partnership deed on stamp paper", "CNIC of every member", "NTN of every member (if available)", "Proof of business premises", "Latest paid utility bill of the premises", "Authority letter for the principal officer"],
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
    checklist: ["Three proposed company names", "CNIC of the member", "CNIC of the nominee and alternate nominee", "Email and mobile of the member", "Registered office address with latest utility bill", "Authorised capital you want", "Short description of the business"],
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
    checklist: ["Three proposed company names", "CNIC of every director and shareholder (passport for foreigners)", "Email and mobile of every director", "Registered office address with latest utility bill", "Shareholding split and authorised capital", "Short description of the business"],
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
    checklist: ["Three proposed company names", "CNIC or passport of every director and subscriber (at least 3 directors, 3 members)", "Email and mobile of every director", "Registered office address with latest utility bill", "Shareholding split and authorised capital", "Detailed description of the business"],
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
      { id: "kind", label: "What best describes your business?", options: [
        { label: "Trader / distributor / wholesaler", tier: 0 }, { label: "Importer or exporter", tier: 1 }, { label: "Manufacturer", tier: 2 } ] },
      { id: "premises", label: "How many business premises?", options: [
        { label: "One", tier: 0 }, { label: "2–3", tier: 1 }, { label: "4 or more", tier: 2 } ] }
    ],
    govFees: ["Biometric verification charges at the NADRA centre, if any"],
    included: ["Sales tax registration on IRIS", "Guidance for biometric verification", "Help with premises verification follow-up", "STRN delivered"],
    excluded: ["Monthly sales tax returns", "Electricity meter / industrial connection changes"],
    checklist: ["NTN of the business", "CNIC of owner / directors", "Bank account maintenance certificate", "Proof of business premises with photos", "Latest paid utility bill (commercial / industrial)", "GPS-tagged photos of premises (manufacturers)", "List of machinery and electricity meter details (manufacturers)"],
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
    included: ["Service classification check", "SRB e-registration", "SRB login handed over", "Registration certificate delivered"],
    excluded: ["Monthly SRB returns", "Registration in other provinces"],
    checklist: ["NTN of the business", "CNIC of owner / directors", "Bank account maintenance certificate", "Proof of business premises", "Latest paid utility bill", "Description of services provided", "Company documents (memorandum, Form 29) for companies"],
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
    included: ["Service classification check", "PRA e-registration", "PRA login handed over", "Registration certificate delivered"],
    excluded: ["Monthly PRA returns", "Registration in other provinces"],
    checklist: ["NTN of the business", "CNIC of owner / directors", "Bank account maintenance certificate", "Proof of business premises", "Latest paid utility bill", "Description of services provided"],
    process: P_REG("PRA registration", "PRA registration certificate"),
    faqs: [["We're based in Karachi but serve clients in Lahore. Do we need PRA?", "Possibly. It depends on where the service is provided. Book a consultation and we'll go through your facts."]],
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
    checklist: ["NTN of the business", "CNIC of owner / directors", "Proof of business address with latest utility bill", "Company documents (incorporation certificate, Form A / Form 29) or partnership deed", "List of employees with CNIC, date of birth, joining date and salary", "Copy of CNIC of each employee"],
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
    checklist: ["CNIC (or company / AOP NTN)", "IRIS login", "Bank statement for the year showing no business activity", "Last year's return, if any", "Individuals: list of assets you own (property, vehicles, bank balances)"],
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
    included: ["Review of your income and tax deducted", "Wealth statement and reconciliation", "Return filed on IRIS", "Copy of filed return and acknowledgement", "One draft review call"],
    excluded: ["Business or freelance income (see the business return)", "Earlier years' returns (see add-on)", "Notice replies"],
    checklist: ["IRIS login (or we register you first)", "Salary certificate / annual tax deduction certificate", "Bank statements for the tax year (1 July to 30 June)", "Bank profit and tax deduction certificates", "Property and vehicle documents", "Rent agreement and rent received (if any)", "Utility and phone bills showing tax deducted", "Last year's filed return and wealth statement"],
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
    included: ["Profit and loss and balance sheet for the return", "Wealth statement and reconciliation", "Return filed on IRIS", "Copy of filed return and acknowledgement", "One draft review call"],
    excluded: ["Bookkeeping", "Sales tax returns", "Earlier years' returns (see add-on)", "Notice replies"],
    checklist: ["IRIS login", "Bank statements of all business and personal accounts for the year", "Sales and purchase record (register, invoices or software export)", "Expense record (rent, salaries, utilities)", "Withholding tax certificates and challans", "Freelancers: foreign remittance (PRC) certificates", "Property and vehicle documents", "Last year's filed return and wealth statement"],
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
    checklist: ["AOP NTN and IRIS login", "Partnership deed", "Bank statements of all AOP accounts for the year", "Sales and purchase record", "Expense record", "Withholding tax certificates and challans", "Partners' capital and drawings record", "Last year's filed return"],
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
    { time: "15–20 working days after documents are complete", checklist: ["Directors' report and board-approved accounts"] }),
  companyReturn("listed-company-return", "listed company", "company listed on the Pakistan Stock Exchange",
    ["Rs 2 billion", "Rs 10 billion"], [150000, 250000, 400000],
    { time: "15–25 working days after documents are complete", checklist: ["Annual report as published", "Group structure and related-party transactions"],
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
    checklist: ["IRIS login", "Last filed wealth statement", "Property documents (sale deed, allotment, transfer letter) with purchase cost", "Vehicle registration books with purchase cost", "Bank statements and closing balances on 30 June", "Investments (shares, savings certificates, prize bonds)", "Loans taken or given, with documents", "Household and personal expenses estimate for the year"],
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
    checklist: ["Sales tax registration (STRN / SRB / PRA)", "Portal login", "Sales invoices for the month", "Purchase invoices for the month", "Bank statement for the month"],
    process: [
      ["Choose your plan", "Your plan depends on invoices per month."],
      ["Provide monthly data", "Upload invoices by the 7th of each month."],
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
    summary: "Received a notice? We read it, explain it in plain language and draft a written reply. Priced by type of notice.",
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
    included: ["Plain-language explanation of the notice", "Written reply drafted and shared for your approval", "Reply filed online or ready for submission", "List of supporting documents to attach"],
    excluded: ["Hearing attendance (rate card)", "Appeals (see Audits and appeals)", "Payment of any tax demanded"],
    checklist: ["Copy of the notice (all pages)", "Tax return, filing or document the notice relates to", "Any earlier correspondence with the department", "Documents supporting your position", "Portal login, if the reply is filed online"],
    process: [
      ["Tell us the deadline", "We show it prominently and flag anything due within 7 days."],
      ["Provide the notice", "We read it and confirm the notice type and price."],
      ["Review the draft reply", "You approve the reply before it goes anywhere."],
      ["Reply submitted", "We file it or hand it to you ready to submit."]
    ],
    faqs: [
      ["My deadline is in two days. Can you still help?", "Yes, tell us now. Matters due within 7 days are flagged to the principal consultant at once. Add Urgent handling if you need work to start the same day."],
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
    model: "unit", time: "Depends on the hearing schedule set by the authority",
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
    included: ["Review of the order or audit notice", "Drafting of grounds, statement of facts or submissions", "Filing with the authority", "Attendance at the hearings stated for the stage", "Written update after each hearing"],
    excluded: ["Hearings beyond those stated (rate card)", "References to the High Court (custom scope)", "Payment of any tax demanded"],
    checklist: ["Order or notice being challenged (all pages)", "Assessment record and earlier replies", "Tax returns and accounts for the year", "Evidence supporting your position", "Signed power of attorney (we provide the format)"],
    process: [
      ["Choose the stage", "Each stage has its own published price."],
      ["Provide the record", "We review the order and your documents."],
      ["We prepare and file", "You approve the grounds or submissions before filing."],
      ["Hearings", "We attend and update you in writing after each hearing."]
    ],
    faqs: [["Do I have to pay for every stage up front?", "No. You pay for one stage at a time and decide whether to go further after each result."]],
    addons: ["urgent", "consult"],
    intake: "notice"
  },

  /* ===================== D. Advice ===================== */
  {
    id: "consultation",
    part: "D", name: "Paid consultation (30 minutes)",
    summary: "A 30-minute call or meeting with a qualified tax lawyer to talk through your tax or compliance question.",
    basis: "Fixed price per session",
    model: "unit", time: "Usually within 2 working days",
    units: [
      { key: "session", name: "30-minute consultation", fee: 3000, criteria: "Per 30-minute session, by phone, video or at our office." }
    ],
    questions: [
      { id: "mode", label: "How would you like to meet?", options: [
        { label: "Video call", unit: "session" }, { label: "Phone call", unit: "session" }, { label: "At our Karachi office", unit: "session" } ] },
      { id: "qty", label: "Number of sessions", type: "number", min: 1, max: 4 }
    ],
    govFees: [],
    included: ["30 minutes with a consultant", "Short written summary of what was discussed"],
    excluded: ["Formal written tax opinion (rate card)", "Filing or registration work"],
    checklist: ["A short note of your question", "Any notice, return or document you want to discuss"],
    process: [
      ["Book and pay", "Choose how you'd like to meet."],
      ["Share your question", "Send a short note and any documents."],
      ["Meet", "We call or meet at the agreed time (PKT)."],
      ["Summary", "You receive a short written summary."]
    ],
    faqs: [["If I then order a service, is the consultation fee deducted?", "Yes. If you order a service within 14 days, the fee for one session is deducted from it. This applies to everyone."]],
    addons: []
  },

  /* ===================== E. Stamp duty ===================== */
  {
    id: "stamp-duty-challan",
    part: "E", name: "Stamp duty challan preparation (Sindh and Punjab)",
    summary: "We check your document, work out the correct duty and prepare the e-stamp challan in Sindh or Punjab.",
    basis: "Fixed price per challan",
    model: "unit", time: "1–2 working days",
    units: [
      { key: "sindh", name: "Sindh challan", fee: 2000, criteria: "Per challan for an instrument executed in Sindh." },
      { key: "punjab", name: "Punjab challan", fee: 2500, criteria: "Per challan for an instrument executed in Punjab." }
    ],
    questions: [
      { id: "province", label: "Which province?", options: [
        { label: "Sindh", unit: "sindh" }, { label: "Punjab", unit: "punjab" } ] },
      { id: "instrument", label: "Type of document", options: [
        { label: "Sale deed / transfer of property" }, { label: "Gift deed" }, { label: "Lease or rent agreement" }, { label: "Partnership deed" },
        { label: "Power of attorney" }, { label: "Share transfer / company document" }, { label: "Loan, mortgage or bond" }, { label: "Other" } ] },
      { id: "qty", label: "Number of challans", type: "number", min: 1, max: 50 }
    ],
    unitNote: "Try the free stamp duty calculator for an indicative figure. A TaxSaathi staff member verifies the duty before any challan is issued.",
    govFees: ["Stamp duty at actual cost — paid by you directly to the government"],
    included: ["Check of instrument type and value", "Duty worked out from the current schedule", "E-stamp challan prepared with correct particulars", "Challan copy stored with your order"],
    excluded: ["Stamp duty itself", "Document drafting", "Registration with the sub-registrar"],
    checklist: ["Draft or signed document", "CNIC of all parties", "Value or consideration of the document", "Property details and location (for property documents)", "DC / valuation table value, if you have it"],
    process: [
      ["Get your price", "Choose the province and number of challans."],
      ["Provide the document", "We check the instrument type and value."],
      ["We verify the duty", "A staff member confirms the duty amount."],
      ["Challan ready", "You pay the duty directly; the challan is stored with your order."]
    ],
    faqs: [
      ["Do you collect the stamp duty?", "No. Stamp duty is paid by you directly to the government through the authorised channel. It is never part of our fee."],
      ["Why are Sindh and Punjab priced separately?", "The rules, rates and procedures differ between the provinces, so each has its own checklist, price and time estimate."]
    ],
    addons: ["urgent"]
  }
];

/* ---------- Sindh stamp duty (free calculator) ----------
 * Source: Stamp Act 1899, Schedule I as applied in Sindh, as amended up to the
 * Sindh Finance Acts 2024 and 2025; property valuation follows the SITC eStamp
 * Citizen Portal method (DC rate x area, floors, basements). Rates are data, not code.
 * kind:
 *   "fixed"    amount
 *   "pct"      rate x value (optional min / max)
 *   "property" rate x higher of DC valuation and declared value
 *   "per"      amount for every `per` rupees (or part); or per unit (sq yd, sq ft, set)
 *   "slab"     [[upTo, amount | "x%"], ...]
 *   "rent"     rate x total rent for the whole term (+ advance rent)
 * reg: registration duty charged separately at the sub-registrar, as calculated
 *   by the SITC portal (only if the document is registered).
 */
TS.stampDuty = {
  sindh: {
    source: "Stamp Act 1899, Schedule I as applied in Sindh, amended up to the Sindh Finance Act 2025; property valuation as on the SITC eStamp Citizen Portal",
    karachiBasementRate: 13500, // per sq yd, commercial basements, Karachi land categories I–IV
    instruments: [
      // Property
      { id: "conveyance", group: "Property", name: "Sale deed / conveyance", art: "16(A)(ii)", kind: "property", rate: 0.02, reg: { pct: 0.01 }, note: "2% of the valuation-table (DC) value or the declared value, whichever is higher." },
      { id: "reit", group: "Property", name: "Conveyance to or from a REIT", art: "16(A)(i)", kind: "property", rate: 0.02, note: "2% of the DC value or declared value, whichever is higher." },
      { id: "lease-assign", group: "Property", name: "Transfer of lease by assignment", art: "16(B)", kind: "property", rate: 0.02, note: "Same duty as conveyance: 2%." },
      { id: "gift-family", group: "Property", name: "Gift between spouse, parents, children, grandparents, grandchildren, brother or sister", art: "20(i)", kind: "property", rate: 0.004, note: "One-fifth of the conveyance duty (0.4%)." },
      { id: "gift-other", group: "Property", name: "Gift to anyone else", art: "20(ii)", kind: "property", rate: 0.02, note: "Same duty as conveyance: 2%." },
      { id: "exchange", group: "Property", name: "Exchange of property", art: "18", kind: "property", rate: 0.02, valueHint: "Use the property of greater value.", note: "Same duty as conveyance, on the property of greater value." },
      { id: "cert-sale", group: "Property", name: "Certificate of sale (public auction)", art: "11", kind: "property", rate: 0.02, note: "Same duty as conveyance: 2%." },
      { id: "partition", group: "Property", name: "Partition", art: "25", kind: "property", rate: 0.01, reg: { fixed: 500 }, valueHint: "Value of the separated share(s) only.", note: "1% of the value of the separated share(s)." },
      { id: "release", group: "Property", name: "Release of a claim on property", art: "29", kind: "property", rate: 0.02, note: "Same duty as conveyance: 2%." },
      { id: "settlement", group: "Property", name: "Settlement (other than religious or charitable)", art: "30(A)(ii)", kind: "property", rate: 0.02, note: "Same duty as conveyance: 2%." },
      { id: "settlement-charity", group: "Property", name: "Settlement for a religious or charitable purpose", art: "30(A)(i)", kind: "pct", rate: 0.045, valueLabel: "Value of the property settled", note: "4.5% of the value of the property settled." },
      { id: "trust-property", group: "Property", name: "Trust of immovable property", art: "32(i)", kind: "property", rate: 0.02, note: "Same duty as conveyance: 2%." },
      { id: "poa-sale-paid", group: "Property", name: "Power of attorney to sell property, given for consideration", art: "27(b)", kind: "property", rate: 0.02, reg: { fixed: 500 }, note: "Same duty as conveyance: 2%." },
      { id: "allot-res-small", group: "Allotment orders", name: "Allotment / transfer of allotment: residential plot up to 399 sq yd", art: "4(A)(i)(a)", kind: "per", amount: 10, per: 1, unitLabel: "Plot area (sq yd)", note: "Rs 10 per sq yd." },
      { id: "allot-res-large", group: "Allotment orders", name: "Allotment / transfer of allotment: residential plot 400 sq yd or more", art: "4(A)(i)(b)", kind: "per", amount: 30, per: 1, unitLabel: "Plot area (sq yd)", note: "Rs 30 per sq yd." },
      { id: "allot-com", group: "Allotment orders", name: "Allotment / transfer of allotment: commercial plot", art: "4(A)(ii)", kind: "per", amount: 40, per: 1, unitLabel: "Plot area (sq yd)", note: "Rs 40 per sq yd." },
      { id: "allot-ind", group: "Allotment orders", name: "Allotment / transfer of allotment: industrial plot", art: "4(A)(iii)", kind: "per", amount: 20, per: 1, unitLabel: "Plot area (sq yd)", note: "Rs 20 per sq yd." },
      { id: "allot-house", group: "Allotment orders", name: "Allotment / transfer of allotment: residential house", art: "4(B)(i)", kind: "per", amount: 10, per: 1, unitLabel: "Covered area (sq ft)", note: "Rs 10 per sq ft." },
      { id: "allot-flat", group: "Allotment orders", name: "Allotment / transfer of allotment: residential flat", art: "4(B)(ii)", kind: "per", amount: 5, per: 1, unitLabel: "Covered area (sq ft)", note: "Rs 5 per sq ft." },
      { id: "allot-office", group: "Allotment orders", name: "Allotment / transfer of allotment: commercial office or shop", art: "4(B)(iii)", kind: "per", amount: 15, per: 1, unitLabel: "Covered area (sq ft)", note: "Rs 15 per sq ft." },
      { id: "allot-factory", group: "Allotment orders", name: "Allotment / transfer of allotment: industrial unit or factory", art: "4(B)(iv)", kind: "per", amount: 15, per: 1, unitLabel: "Covered area (sq ft)", note: "Rs 15 per sq ft." },
      { id: "sanad", group: "Allotment orders", name: "Government allotment order or sanad (issue or renewal)", art: "4-A", kind: "fixed", amount: 5000, note: "Fixed Rs 5,000 (certain Goth Abad, Katchi Abadi and free grants are excluded)." },
      // Lease and rent
      { id: "lease-rent", group: "Lease and rent", name: "Rent agreement / rent-based lease or licence", art: "21(iii)", kind: "rent", rate: 0.015, reg: { pct: 0.01 }, note: "1.5% of the total rent for the entire period of the lease." },
      { id: "lease-property", group: "Lease and rent", name: "Lease of plot, flat, shop, office, town house or bungalow (valuation-table lease)", art: "21(i)", kind: "property", rate: 0.02, note: "Same duty as conveyance: 2%." },
      { id: "lease-surrender", group: "Lease and rent", name: "Surrender of lease, sub-lease or pre-lease (urban)", art: "21(ii)", kind: "property", rate: 0.02, note: "Same duty as conveyance: 2% (not for surrender to KDA, DHA or other government agency)." },
      // Loans and security
      { id: "mortgage-poss", group: "Loans and security", name: "Mortgage deed, possession given", art: "23(a)", kind: "pct", rate: 0.03, reg: { pct: 0.01 }, valueLabel: "Amount secured", note: "3% of the amount secured." },
      { id: "mortgage", group: "Loans and security", name: "Mortgage deed, possession not given", art: "23(b)", kind: "pct", rate: 0.02, reg: { pct: 0.01 }, valueLabel: "Amount secured", note: "2% of the amount secured." },
      { id: "mortgage-collateral", group: "Loans and security", name: "Collateral or additional security (primary security already stamped)", art: "23(c)", kind: "per", amount: 15, per: 1000, valueLabel: "Amount secured", note: "Rs 15 for every Rs 1,000 or part." },
      { id: "hypothecation", group: "Loans and security", name: "Hypothecation of movable property (not interest-based)", art: "23(d)", kind: "pct", rate: 0.002, valueLabel: "Amount of loan or finance", note: "0.2% of the loan or finance amount." },
      { id: "bank-loan", group: "Loans and security", name: "Mortgage or financing instrument for an interest-based bank loan", art: "23-A", kind: "pct", rate: 0.01, reg: { pct: 0.01 }, valueLabel: "Entire amount of loan advanced", note: "1% of the entire loan advanced." },
      { id: "financing", group: "Loans and security", name: "Islamic financing document (not interest-based)", art: "19", kind: "slab", valueLabel: "Finance amount", slabs: [[500000, "0.3%"], [1000000, 1500], [10000000, 3800], [50000000, 15000], [100000000, 38000], [300000000, 53000], [500000000, 75000], [Infinity, 150000]], note: "0.3% up to Rs 0.5 million, then fixed slabs up to Rs 150,000." },
      { id: "bank-guarantee", group: "Loans and security", name: "Bank guarantee", art: "6", kind: "per", amount: 100, per: 100000, valueLabel: "Amount of the guarantee", note: "Rs 100 for every Rs 100,000 or part." },
      { id: "bond-indemnity", group: "Loans and security", name: "Indemnity bond, security bond or surety bond", art: "10(A)", kind: "fixed", amount: 500, note: "Fixed Rs 500." },
      { id: "bond-custom", group: "Loans and security", name: "Custom bond", art: "10(B)", kind: "fixed", amount: 500, note: "Fixed Rs 500." },
      { id: "bond-other", group: "Loans and security", name: "Any other bond (incl. bottomry and respondentia)", art: "10(D)–(F)", kind: "pct", rate: 0.045, valueLabel: "Amount of the bond", note: "4.5% of the amount of the bond." },
      { id: "debenture", group: "Loans and security", name: "Debenture, TFC or commercial paper", art: "10(C)", kind: "pct", rate: 0.0005, min: 500, valueLabel: "Amount", note: "0.05% of the amount per annum, minimum Rs 500." },
      { id: "lc", group: "Loans and security", name: "Letter of credit", art: "22", kind: "slab", valueLabel: "Amount of the letter of credit", slabs: [[2000000, 1000], [5000000, 1500], [10000000, 2000], [Infinity, 3000]], note: "Rs 1,000 up to Rs 2 million; 1,500 up to 5 million; 2,000 up to 10 million; 3,000 above." },
      { id: "pn-demand", group: "Loans and security", name: "Promissory note payable on demand", art: "28(a)", kind: "slab", valueLabel: "Amount of the note", slabs: [[250000, 1000], [Infinity, 2000]], note: "Rs 1,000 up to Rs 250,000; Rs 2,000 above." },
      { id: "pn-other", group: "Loans and security", name: "Promissory note payable otherwise than on demand", art: "28(b)", kind: "pct", rate: 0.002, min: 500, valueLabel: "Amount payable", note: "0.2% of the amount, minimum Rs 500." },
      { id: "receipt", group: "Loans and security", name: "Receipt of money for immovable property", art: "1", kind: "slab", valueLabel: "Amount received", slabs: [[50000, 10], [200000, 20], [500000, 50], [1000000, 100], [2500000, 500], [5000000, 1000], [Infinity, 2000]], note: "Rs 10 to Rs 2,000 depending on the amount." },
      // Company and business
      { id: "partnership", group: "Company and business", name: "Partnership deed or dissolution of partnership", art: "24-A", kind: "fixed", amount: 5000, note: "Fixed Rs 5,000." },
      { id: "share-physical", group: "Company and business", name: "Transfer of shares (physical, or withdrawn from CDC)", art: "31(a)(i)", kind: "pct", rate: 0.015, min: 1, valueLabel: "Face value of the shares", note: "1.5% of face value." },
      { id: "share-cdc", group: "Company and business", name: "Transfer of shares deposited with CDC", art: "31(a)(ii)", kind: "pct", rate: 0.0015, valueLabel: "Face value of the shares", note: "0.15% of face value." },
      { id: "share-cert", group: "Company and business", name: "Share certificate", art: "12", kind: "pct", rate: 0.005, min: 1, valueLabel: "Face value of the shares", note: "0.5% of face value, minimum Re 1." },
      { id: "debenture-transfer", group: "Company and business", name: "Transfer of marketable debentures", art: "31(b)", kind: "pct", rate: 0.03, min: 2, valueLabel: "Face value of the debentures", note: "3% of face value." },
      { id: "contract", group: "Company and business", name: "Works or services contract (incl. work order)", art: "15(a)", kind: "per", amount: 0.35, per: 100, valueLabel: "Amount of the contract", note: "35 paisa for every Rs 100 or part (0.35%)." },
      { id: "purchase-order", group: "Company and business", name: "Purchase order for supply of stores or materials", art: "15(b)", kind: "per", amount: 0.25, per: 100, valueLabel: "Amount of the purchase order", note: "25 paisa for every Rs 100 or part (0.25%)." },
      { id: "bill-entry", group: "Company and business", name: "Bill of entry / goods declaration", art: "7", kind: "fixed", amount: 2000, note: "Fixed Rs 2,000." },
      { id: "bill-exchange", group: "Company and business", name: "Bill of exchange (not payable on demand)", art: "8", kind: "per", amount: 3, per: 1000, valueLabel: "Amount of the bill", note: "Rs 3 for every Rs 1,000 or part." },
      { id: "bill-lading", group: "Company and business", name: "Bill of lading", art: "9", kind: "per", amount: 1000, per: 1, unitLabel: "Number of sets", note: "Rs 1,000 for each set." },
      { id: "charter", group: "Company and business", name: "Charter party", art: "13", kind: "per", amount: 100, per: 100000, valueLabel: "Value of the charter party", note: "Rs 100 for every Rs 100,000 or part." },
      { id: "trust-worship", group: "Company and business", name: "Trust for a mosque, madrassah, imambargah, temple, church or place of worship", art: "32(ii)", kind: "fixed", amount: 500, note: "Fixed Rs 500." },
      { id: "trust-other", group: "Company and business", name: "Trust (any other)", art: "32(iii)", kind: "pct", rate: 0.02, valueLabel: "Trust fund", note: "2% of the trust fund." },
      // Agreements and personal documents
      { id: "agr-sale", group: "Agreements and personal", name: "Agreement to sell a vehicle or immovable property, or re-convey mortgaged property", art: "3(a)", kind: "fixed", amount: 1000, note: "Fixed Rs 1,000." },
      { id: "agr-builder", group: "Agreements and personal", name: "Builder / developer booking agreement (SBCA-approved project)", art: "3(b)", kind: "fixed", amount: 5000, note: "Fixed Rs 5,000." },
      { id: "agr-other", group: "Agreements and personal", name: "Any other agreement", art: "3(c)", kind: "fixed", amount: 1000, note: "Fixed Rs 1,000." },
      { id: "affidavit", group: "Agreements and personal", name: "Affidavit", art: "2", kind: "fixed", amount: 200, note: "Fixed Rs 200 (affidavits for court use are exempt)." },
      { id: "poa-sale-free", group: "Agreements and personal", name: "Power of attorney to sell property, not for consideration", art: "27(a)", kind: "fixed", amount: 7000, reg: { fixed: 500 }, note: "Fixed Rs 7,000." },
      { id: "poa-other", group: "Agreements and personal", name: "Power of attorney (any other)", art: "27(c)", kind: "fixed", amount: 1000, reg: { fixed: 500 }, note: "Fixed Rs 1,000." },
      { id: "counterpart", group: "Agreements and personal", name: "Counterpart or duplicate of a stamped document", art: "17", kind: "fixed", amount: 1000, reg: { fixed: 500 }, note: "Fixed Rs 1,000." },
      { id: "will", group: "Agreements and personal", name: "Will", art: "—", kind: "fixed", amount: 1000, reg: { fixed: 500 }, note: "Rs 1,000 as charged on the SITC eStamp portal." },
      { id: "notarial", group: "Agreements and personal", name: "Notarial act", art: "24", kind: "fixed", amount: 50, note: "Fixed Rs 50." },
      { id: "air-dom", group: "Agreements and personal", name: "Air ticket, domestic flight", art: "3-A(i)", kind: "per", amount: 50, per: 1, unitLabel: "Number of tickets", note: "Rs 50 per ticket." },
      { id: "air-int", group: "Agreements and personal", name: "Air ticket, international flight", art: "3-A(ii)", kind: "per", amount: 400, per: 1, unitLabel: "Number of tickets", note: "Rs 400 per ticket." },
      // Insurance
      { id: "ins-voyage", group: "Insurance", name: "Sea or air insurance, per voyage", art: "26(A)(1)", kind: "pct", rate: 0.0002, min: 500, valueLabel: "Sum insured", note: "0.02% of the sum insured, minimum Rs 500." },
      { id: "ins-time", group: "Insurance", name: "Sea or air insurance, for time (up to 12 months)", art: "26(A)(2)", kind: "pct", rate: 0.0009, min: 500, valueLabel: "Sum insured", note: "0.09% of the sum insured, minimum Rs 500." },
      { id: "ins-fire", group: "Insurance", name: "Fire and other property insurance", art: "26(B)", kind: "per", amount: 500, per: 1, unitLabel: "Number of policies", note: "Rs 500 per policy." },
      { id: "ins-life", group: "Insurance", name: "Life or health insurance", art: "26(C)", kind: "pct", rate: 0.0015, min: 500, valueLabel: "Sum insured", note: "0.15% of the sum insured, minimum Rs 500." },
      { id: "ins-vehicle", group: "Insurance", name: "Vehicle third-party insurance", art: "26(E)", kind: "per", amount: 50, per: 1, unitLabel: "Number of policies", note: "Rs 50 per policy." }
    ]
  }
};

/* Property value from DC rates, as the SITC eStamp portal works it out (urban cases).
 *  plot:        DC rate (per sq yd) x land area
 *  residential: DC x covered area x (1 + 0.25 x floors above ground + 0.25 x basements)
 *  commercial:  DC x covered area x (1 + floors above ground) + basements
 *               (Karachi land categories I–IV: Rs 13,500 x basement area; otherwise DC x covered area x basements)
 *  industrial:  land DC rate x land area (sq yd) + structure rate x covered area (sq ft)
 */
TS.dcValue = function (p) {
  const n = (k) => Math.max(0, Number(p[k]) || 0);
  const f = (x) => Number(Math.round(x)).toLocaleString("en-PK");
  const rate = n("rate"), area = n("area"), fl = n("floors"), bs = n("basements");
  switch (p.type) {
    case "plot": return { value: rate * area, working: `${f(rate)} × ${f(area)} sq yd` };
    case "residential": {
      const v = rate * area * (1 + 0.25 * fl + 0.25 * bs);
      return { value: v, working: `${f(rate)} × ${f(area)} × (1 + 0.25 × ${fl} floor${fl === 1 ? "" : "s"} + 0.25 × ${bs} basement${bs === 1 ? "" : "s"})` };
    }
    case "commercial": {
      const stru = rate * area * (1 + fl);
      const bsmt = bs ? (p.khiCat ? TS.stampDuty.sindh.karachiBasementRate * n("bArea") : rate * area * bs) : 0;
      return { value: stru + bsmt, working: `${f(rate)} × ${f(area)} × (1 + ${fl} floor${fl === 1 ? "" : "s"})` + (bs ? (p.khiCat ? ` + 13,500 × ${f(n("bArea"))} basement sq yd` : ` + ${f(rate)} × ${f(area)} × ${bs} basement${bs === 1 ? "" : "s"}`) : "") };
    }
    case "industrial": {
      const v = n("landRate") * n("landArea") + n("struRate") * n("covered");
      return { value: v, working: `${f(n("landRate"))} × ${f(n("landArea"))} sq yd + ${f(n("struRate"))} × ${f(n("covered"))} sq ft` };
    }
  }
  return { value: 0, working: "" };
};

// Returns { duty, base } where base is the amount the rate was applied to.
TS.stampCalc = function (ins, v) {
  const val = Math.max(0, Number(v.value) || 0);
  const up = (x) => Math.ceil(x - 1e-9); // the SITC portal rounds duty up
  switch (ins.kind) {
    case "fixed": return { duty: ins.amount, base: null };
    case "pct": { const d = up(val * ins.rate); return { duty: val ? Math.max(ins.min || 0, d) : 0, base: val }; }
    case "property": { const base = Math.max(val, Math.max(0, Number(v.declared) || 0)); return { duty: up(base * ins.rate), base }; }
    case "per": return { duty: val ? up(Math.ceil(val / ins.per - 1e-9) * ins.amount) : 0, base: val };
    case "slab": {
      const s = ins.slabs.find(([upTo]) => val <= upTo);
      return { duty: val ? (typeof s[1] === "string" ? up(val * parseFloat(s[1]) / 100) : s[1]) : 0, base: val };
    }
    case "rent": {
      const base = (Number(v.rent) || 0) * (Number(v.months) || 0) + (Number(v.advance) || 0);
      return { duty: up(base * ins.rate), base };
    }
  }
  return { duty: 0, base: null };
};
TS.regDuty = function (ins, base) {
  if (!ins.reg) return null;
  return ins.reg.fixed != null ? ins.reg.fixed : (base ? Math.ceil(base * ins.reg.pct) : 0);
};

// Statutory deadlines (free tool). Indicative — the owner must verify before launch.
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
