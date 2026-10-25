/* TaxSaathi — service catalogue, price rules and quote questions.
 *
 * This file is the single source of truth for every price on the site.
 * Until the admin panel is built, the owner edits prices HERE.
 *
 *   - Every `fee` is null until the owner sets it (requirement 4.2: the developer
 *     must not invent prices). A null fee is shown as "To be set".
 *   - Tier criteria and question bands marked DRAFT are starting proposals for the
 *     owner to confirm.
 *   - There is deliberately no per-client price field anywhere (rule 4.3.2).
 */

window.TS = window.TS || {};

TS.business = {
  name: "TaxSaathi",
  tagline: "Tax · Regulatory · Compliance",
  phone: "0325 3936334",
  phoneIntl: "923253936334",
  email: "abdullahmahar31@gmail.com",
  address: "Office adjacent to Idara Maarif-ul-Quran, Sector A, Street No. 2, Kashmir Colony, Korangi Road, Karachi",
  social: {
    linkedin: "#", // [OWNER TO CONFIRM] profile URLs
    facebook: "#",
    instagram: "#",
    youtube: "#"
  }
};

TS.pricing = {
  version: "2026.1",
  effectiveFrom: "[Owner to set]",
  lastReviewed: "[Owner to set]",
  quoteValidityDays: 14, // [OWNER TO CONFIRM]
  taxOnFee: null          // [OWNER TO CONFIRM] e.g. { label: "Sindh sales tax on services", rate: 0.15 }
};

// Switches for elements that need the owner's written approval (section 5).
TS.features = {
  testimonials: false,
  adLandingPages: false
};

TS.parts = [
  { key: "A", slug: "registration", name: "Registrations", blurb: "NTN, business, company and sales tax registrations with FBR, SECP, SRB and PRA.", icon: "id" },
  { key: "B", slug: "returns", name: "Tax returns", blurb: "Annual income tax returns and monthly sales tax returns, filed on time.", icon: "doc" },
  { key: "C", slug: "litigation", name: "Notices & litigation", blurb: "Calm, clear help with notices, audits and appeals. Priced by notice type and stage.", icon: "shield" },
  { key: "D", slug: "other", name: "Advice & consultation", blurb: "Paid consultations, tax health checks and written opinions.", icon: "chat" },
  { key: "E", slug: "stamp-duty", name: "Stamp duty", blurb: "Challans, duty assessment and document review for Sindh and Punjab.", icon: "stamp" }
];

// Published add-ons. Each service lists which add-ons it accepts.
TS.addons = {
  urgent:   { name: "Urgent handling", desc: "Work starts within one working day and is prioritised.", fee: null },
  revision: { name: "Extra revision", desc: "One additional revision after the first delivered draft.", fee: null },
  historic: { name: "Historic year correction", desc: "Per earlier tax year or period that needs correcting.", fee: null, perUnit: "per year" },
  consult:  { name: "Additional 30-minute consultation", desc: "Extra call with a consultant about this order.", fee: null }
};

// Public standard rate card for Custom scope work (rule 4.3.9). Same for everyone.
TS.rateCard = [
  { name: "Consultant time", unit: "per hour", fee: null },
  { name: "Senior consultant time", unit: "per hour", fee: null },
  { name: "Hearing attendance", unit: "per hearing", fee: null },
  { name: "Drafting of written submission", unit: "per submission", fee: null }
];

/* Service definitions
 * model: "tiered" | "unit" | "subscription"
 * tiered/subscription: each option in `questions` carries a `tier` index; the job
 *   lands in the HIGHEST tier any answer points to. The answers that set it become
 *   the reason shown to the client.
 * unit: one question picks the `unit` key; an optional `qty` question multiplies it.
 */
TS.services = [
  {
    id: "sole-proprietorship-registration",
    part: "A", name: "Sole proprietorship registration (FBR)",
    summary: "Register your one-owner business with FBR so it has a valid NTN and business record.",
    model: "tiered", time: "3–5 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: null, criteria: "One business activity, you already have an individual NTN." },
      { key: "standard", name: "Standard", fee: null, criteria: "One business activity, no NTN yet, or one business address change." },
      { key: "complex", name: "Complex", fee: null, criteria: "More than one business activity or more than one business premises." }
    ],
    questions: [
      { id: "ntn", label: "Do you already have an individual NTN?", options: [
        { label: "Yes", tier: 0 }, { label: "No", tier: 1 }, { label: "Not sure", tier: 1 } ] },
      { id: "activities", label: "How many business activities?", options: [
        { label: "One", tier: 0 }, { label: "Two or more", tier: 2 } ] },
      { id: "premises", label: "How many business premises?", options: [
        { label: "One (or online only)", tier: 0 }, { label: "Two or more", tier: 2 } ] }
    ],
    govFees: ["FBR fees, if any, at actual cost"],
    included: ["Review of your details", "Online registration on IRIS", "Business added to your NTN record", "Registration certificate delivered"],
    excluded: ["Sales tax registration", "Bank account opening", "Provincial registrations"],
    checklist: ["CNIC (front and back)", "Mobile number registered in your name", "Email address", "Proof of business premises (rent agreement or ownership document)", "Latest paid utility bill of the premises", "Letterhead or business name details"],
    process: [
      ["Get your price", "Answer three questions and see your tier."],
      ["Upload documents", "Send the checklist items through your order."],
      ["We verify and file", "We check everything, then register on IRIS."],
      ["Receive certificate", "Your updated registration record is delivered to you."]
    ],
    faqs: [
      ["Is a sole proprietorship the same as my personal NTN?", "The business is registered under your personal NTN. We add the business details to your record."],
      ["Do I need a bank account first?", "No. Most banks ask for your NTN record when opening a business account, so registration usually comes first."]
    ],
    addons: ["urgent", "consult"]
  },
  {
    id: "aop-registration",
    part: "A", name: "Association of Persons (AOP) registration",
    summary: "Register a partnership or association of persons with FBR and get its NTN.",
    model: "tiered", time: "5–7 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: null, criteria: "2–3 members, all with NTNs, signed partnership deed ready." },
      { key: "standard", name: "Standard", fee: null, criteria: "4–10 members, or some members without an NTN." },
      { key: "complex", name: "Complex", fee: null, criteria: "More than 10 members, or a member is a company or non-resident." }
    ],
    questions: [
      { id: "members", label: "How many members (partners)?", options: [
        { label: "2–3", tier: 0 }, { label: "4–10", tier: 1 }, { label: "More than 10", tier: 2 } ] },
      { id: "memberNtn", label: "Do all members have an NTN?", options: [
        { label: "Yes, all of them", tier: 0 }, { label: "No, some do not", tier: 1 } ] },
      { id: "memberType", label: "Is any member a company or non-resident?", options: [
        { label: "No", tier: 0 }, { label: "Yes", tier: 2 } ] }
    ],
    govFees: ["Registrar of Firms fee, if registering the deed, at actual cost"],
    included: ["Review of partnership deed", "AOP registration on IRIS", "Principal officer setup", "Registration certificate delivered"],
    excluded: ["Drafting a new partnership deed", "Registrar of Firms registration", "Sales tax registration"],
    checklist: ["Signed partnership deed", "CNIC of every member", "NTN of every member (if available)", "Proof of business premises", "Latest paid utility bill of the premises", "Authority letter for the principal officer"],
    process: [
      ["Get your price", "Tell us the number of members and their status."],
      ["Upload documents", "Deed, CNICs and premises proof."],
      ["We verify and file", "We review the deed and register the AOP."],
      ["Receive NTN", "The AOP's NTN certificate is delivered to you."]
    ],
    faqs: [
      ["Do we need to register the deed with the Registrar of Firms?", "It is not always required for FBR registration, but many banks ask for it. We can explain your options in a consultation."],
      ["Who is the principal officer?", "One member who acts for the AOP with FBR. Usually the managing partner."]
    ],
    addons: ["urgent", "revision", "consult"]
  },
  {
    id: "individual-ntn",
    part: "A", name: "Individual NTN registration",
    summary: "Get your personal National Tax Number so you can file returns and join the Active Taxpayers List.",
    model: "tiered", time: "1–3 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: null, criteria: "Salary or no income yet." },
      { key: "standard", name: "Standard", fee: null, criteria: "Business, freelance or rental income." },
      { key: "complex", name: "Complex", fee: null, criteria: "Overseas Pakistani, foreign income, or more than two income sources." }
    ],
    questions: [
      { id: "source", label: "What is your main source of income?", options: [
        { label: "Salary, or no income yet", tier: 0 }, { label: "Business, freelance or rent", tier: 1 }, { label: "Foreign income / overseas Pakistani", tier: 2 } ] },
      { id: "sources", label: "How many income sources do you have?", options: [
        { label: "One or two", tier: 0 }, { label: "More than two", tier: 2 } ] }
    ],
    govFees: [],
    included: ["IRIS account creation", "NTN registration", "Login credentials handed over to you securely", "Short guide to your next filing date"],
    excluded: ["Filing your income tax return", "Business registration"],
    checklist: ["CNIC (front and back)", "Mobile number registered in your name (biometric SIM)", "Email address you can access", "Current address"],
    process: [
      ["Get your price", "Tell us about your income source."],
      ["Share your details", "CNIC, mobile and email."],
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
    id: "company-incorporation",
    part: "A", name: "Private limited company incorporation (SECP)",
    summary: "Incorporate a private limited company with SECP, including name reservation and company NTN.",
    model: "tiered", time: "7–12 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: null, criteria: "Up to 2 directors, all Pakistani residents, standard objects." },
      { key: "standard", name: "Standard", fee: null, criteria: "3–5 directors, or specialised business objects." },
      { key: "complex", name: "Complex", fee: null, criteria: "More than 5 directors, foreign shareholder, or business needing a licence or NOC." }
    ],
    questions: [
      { id: "directors", label: "How many directors / shareholders?", options: [
        { label: "1–2", tier: 0 }, { label: "3–5", tier: 1 }, { label: "More than 5", tier: 2 } ] },
      { id: "foreign", label: "Will any shareholder be foreign or non-resident?", options: [
        { label: "No", tier: 0 }, { label: "Yes", tier: 2 } ] },
      { id: "objects", label: "What kind of business?", options: [
        { label: "General trading, services or IT", tier: 0 }, { label: "Specialised (e.g. consultancy, education, health)", tier: 1 }, { label: "Needs a licence or NOC (e.g. security, finance, travel)", tier: 2 } ] }
    ],
    govFees: ["SECP name reservation fee at actual cost", "SECP incorporation fee (depends on authorised capital) at actual cost"],
    included: ["Name availability check and reservation", "Memorandum and Articles of Association", "Online incorporation filing on eZfile", "Company NTN registration", "Certificate of incorporation delivered"],
    excluded: ["Licences or NOCs from other authorities", "Sales tax registration", "Bank account opening", "Annual SECP filings"],
    checklist: ["Three proposed company names", "CNIC of every director and shareholder", "Email and mobile of every director", "Registered office address with utility bill", "Shareholding split and authorised capital", "Short description of the business"],
    process: [
      ["Get your price", "Tell us the number of directors and type of business."],
      ["Name reservation", "We check and reserve your company name with SECP."],
      ["Documents and filing", "We prepare the memorandum and articles and file for incorporation."],
      ["Certificate and NTN", "You receive your incorporation certificate and company NTN."]
    ],
    faqs: [
      ["Can one person form a private limited company?", "A single-member company is a separate service we will offer soon. Ask us if you need it now."],
      ["Does authorised capital change the SECP fee?", "Yes. The SECP fee depends on authorised capital and is shown as a separate government fee."]
    ],
    addons: ["urgent", "revision", "consult"]
  },
  {
    id: "federal-sales-tax-registration",
    part: "A", name: "Federal sales tax registration (FBR)",
    summary: "Register for federal sales tax with FBR so you can issue sales tax invoices.",
    model: "tiered", time: "7–15 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: null, criteria: "Trader or distributor with one premises." },
      { key: "standard", name: "Standard", fee: null, criteria: "Importer or exporter, or 2–3 premises." },
      { key: "complex", name: "Complex", fee: null, criteria: "Manufacturer, or 4 or more premises." }
    ],
    questions: [
      { id: "kind", label: "What best describes your business?", options: [
        { label: "Trader / distributor / wholesaler", tier: 0 }, { label: "Importer or exporter", tier: 1 }, { label: "Manufacturer", tier: 2 } ] },
      { id: "premises", label: "How many business premises?", options: [
        { label: "One", tier: 0 }, { label: "2–3", tier: 1 }, { label: "4 or more", tier: 2 } ] }
    ],
    govFees: ["Any FBR or biometric verification charges at actual cost"],
    included: ["Sales tax registration on IRIS", "Guidance for biometric verification", "Help with premises verification follow-up", "STRN delivered"],
    excluded: ["Monthly sales tax returns", "Electricity meter / industrial connection changes"],
    checklist: ["NTN of the business", "CNIC of owner / directors", "Bank account maintenance certificate", "Proof of business premises with photos", "Latest paid utility bill (commercial / industrial)", "GPS-tagged photos of premises (manufacturers)", "List of machinery (manufacturers)"],
    process: [
      ["Get your price", "Tell us your business type and premises."],
      ["Upload documents", "Premises, bank and identity documents."],
      ["We file and follow up", "We file the application and guide you through biometric verification."],
      ["Receive STRN", "Your sales tax registration is confirmed."]
    ],
    faqs: [
      ["Do I need to visit for biometric verification?", "Usually yes, at a NADRA e-Sahulat or designated centre. We tell you exactly when and where."],
      ["When do monthly returns start?", "From the month after registration. Our monthly returns subscription can take this on."]
    ],
    addons: ["urgent", "consult"]
  },
  {
    id: "srb-registration",
    part: "A", name: "Sindh sales tax on services registration (SRB)",
    summary: "Register with the Sindh Revenue Board if you provide taxable services in Sindh.",
    model: "tiered", time: "5–10 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: null, criteria: "One taxable service, one location in Sindh." },
      { key: "standard", name: "Standard", fee: null, criteria: "More than one taxable service, or 2–3 locations." },
      { key: "complex", name: "Complex", fee: null, criteria: "4 or more locations, or services in more than one province." }
    ],
    questions: [
      { id: "services", label: "How many taxable services do you provide?", options: [
        { label: "One", tier: 0 }, { label: "Two or more", tier: 1 } ] },
      { id: "locations", label: "How many locations?", options: [
        { label: "One", tier: 0 }, { label: "2–3", tier: 1 }, { label: "4 or more", tier: 2 } ] },
      { id: "other", label: "Do you also provide services in other provinces?", options: [
        { label: "No, Sindh only", tier: 0 }, { label: "Yes", tier: 2 } ] }
    ],
    govFees: ["SRB fees, if any, at actual cost"],
    included: ["Service classification check", "SRB e-registration", "SRB login handed over", "Registration certificate delivered"],
    excluded: ["Monthly SRB returns", "Registration in other provinces"],
    checklist: ["NTN of the business", "CNIC of owner / directors", "Bank account maintenance certificate", "Proof of business premises", "Latest paid utility bill", "Description of services provided"],
    process: [
      ["Get your price", "Tell us about your services and locations."],
      ["Upload documents", "Business, bank and premises documents."],
      ["We register you", "We file your SRB registration."],
      ["Receive certificate", "Your SRB registration certificate is delivered."]
    ],
    faqs: [["Do I need SRB registration if I'm registered with FBR?", "FBR registration covers sales tax on goods. Services provided in Sindh fall under SRB, so you may need both."]],
    addons: ["urgent", "consult"]
  },
  {
    id: "pra-registration",
    part: "A", name: "Punjab sales tax on services registration (PRA)",
    summary: "Register with the Punjab Revenue Authority if you provide taxable services in Punjab.",
    model: "tiered", time: "5–10 working days",
    tiers: [
      { key: "basic", name: "Basic", fee: null, criteria: "One taxable service, one location in Punjab." },
      { key: "standard", name: "Standard", fee: null, criteria: "More than one taxable service, or 2–3 locations." },
      { key: "complex", name: "Complex", fee: null, criteria: "4 or more locations, or services in more than one province." }
    ],
    questions: [
      { id: "services", label: "How many taxable services do you provide?", options: [
        { label: "One", tier: 0 }, { label: "Two or more", tier: 1 } ] },
      { id: "locations", label: "How many locations?", options: [
        { label: "One", tier: 0 }, { label: "2–3", tier: 1 }, { label: "4 or more", tier: 2 } ] },
      { id: "other", label: "Do you also provide services in other provinces?", options: [
        { label: "No, Punjab only", tier: 0 }, { label: "Yes", tier: 2 } ] }
    ],
    govFees: ["PRA fees, if any, at actual cost"],
    included: ["Service classification check", "PRA e-registration", "PRA login handed over", "Registration certificate delivered"],
    excluded: ["Monthly PRA returns", "Registration in other provinces"],
    checklist: ["NTN of the business", "CNIC of owner / directors", "Bank account maintenance certificate", "Proof of business premises", "Latest paid utility bill", "Description of services provided"],
    process: [
      ["Get your price", "Tell us about your services and locations."],
      ["Upload documents", "Business, bank and premises documents."],
      ["We register you", "We file your PRA registration."],
      ["Receive certificate", "Your PRA registration certificate is delivered."]
    ],
    faqs: [["We're based in Karachi but serve clients in Lahore. Do we need PRA?", "Possibly. It depends on where the service is provided. Book a consultation and we'll go through your facts."]],
    addons: ["urgent", "consult"]
  },
  {
    id: "income-tax-return",
    part: "B", name: "Annual income tax return: individuals and businesses",
    summary: "Prepare and file your annual income tax return and wealth statement on IRIS.",
    model: "tiered", time: "3–7 working days after documents are complete",
    tiers: [
      { key: "basic", name: "Basic", fee: null, criteria: "Salary only, up to 10 assets / liabilities in wealth statement." },
      { key: "standard", name: "Standard", fee: null, criteria: "Salary plus rent, profit or capital gains; or a sole proprietor with up to 200 transactions a year." },
      { key: "complex", name: "Complex", fee: null, criteria: "AOP or business with more than 200 transactions a year, foreign income, or more than 25 assets." }
    ],
    questions: [
      { id: "taxpayer", label: "Who is filing?", options: [
        { label: "Salaried individual", tier: 0 }, { label: "Individual with business / freelance income", tier: 1 }, { label: "AOP (partnership)", tier: 2 } ] },
      { id: "other", label: "Any other income?", options: [
        { label: "None", tier: 0 }, { label: "Rent, profit on savings, dividends or capital gains", tier: 1 }, { label: "Foreign income", tier: 2 } ] },
      { id: "assets", label: "Roughly how many assets and liabilities (property, vehicles, bank accounts, loans)?", options: [
        { label: "Up to 10", tier: 0 }, { label: "11–25", tier: 1 }, { label: "More than 25", tier: 2 } ] },
      { id: "txns", label: "Business transactions in the year (if any)", options: [
        { label: "No business / not applicable", tier: 0 }, { label: "Up to 200", tier: 1 }, { label: "More than 200", tier: 2 } ] }
    ],
    govFees: ["Any tax payable is paid by you directly to FBR through a challan"],
    included: ["Review of your income and tax deducted", "Wealth statement and reconciliation", "Return filed on IRIS", "Copy of filed return and acknowledgement", "One draft review call"],
    excluded: ["Earlier years' returns (see Historic year add-on)", "Bookkeeping", "Notice replies"],
    checklist: ["IRIS login (or we register you first)", "Salary certificate / tax deduction certificate", "Bank statements for the tax year", "Bank tax deduction certificates", "Property and vehicle documents", "Utility bills and phone bills (tax deducted)", "Last year's filed return and wealth statement"],
    process: [
      ["Get your price", "Answer four questions about your income and assets."],
      ["Upload documents", "We tick off the checklist as files arrive."],
      ["Review the draft", "We share a draft return and wealth statement for your approval."],
      ["Filed", "We file on IRIS and send you the acknowledgement."]
    ],
    faqs: [
      ["What if my documents show more transactions than I said?", "We'll send a revised quote in the correct tier and pause work until you accept it. You never pay more without agreeing first."],
      ["Is the tax I owe included in your fee?", "No. Any tax payable is yours and goes to FBR directly. It is never part of our fee."]
    ],
    addons: ["urgent", "revision", "historic", "consult"]
  },
  {
    id: "monthly-sales-tax-returns",
    part: "B", name: "Monthly sales tax and SRB/PRA returns",
    summary: "We file your monthly sales tax returns with FBR, SRB or PRA, on time, every month.",
    model: "subscription", period: "month", time: "Filed before each monthly due date",
    tiers: [
      { key: "starter", name: "Starter", fee: null, criteria: "Up to 50 invoices a month, one authority." },
      { key: "growth", name: "Growth", fee: null, criteria: "51–200 invoices a month, or two authorities." },
      { key: "scale", name: "Scale", fee: null, criteria: "More than 200 invoices a month, or three authorities." }
    ],
    questions: [
      { id: "txns", label: "Sales and purchase invoices per month", options: [
        { label: "Up to 50", tier: 0 }, { label: "51–200", tier: 1 }, { label: "More than 200", tier: 2 } ] },
      { id: "authorities", label: "Which returns do you file?", options: [
        { label: "One of FBR, SRB or PRA", tier: 0 }, { label: "Two of them", tier: 1 }, { label: "All three", tier: 2 } ] }
    ],
    govFees: ["Sales tax payable is paid by you directly through a challan"],
    included: ["Monthly data review", "Return preparation and filing", "Challan amount worked out for you", "Filed return and acknowledgement each month", "Reminder before each due date"],
    excluded: ["Bookkeeping", "Annexure corrections for earlier months", "Notice replies"],
    checklist: ["Sales tax registration (STRN / SRB / PRA)", "Portal login", "Sales invoices for the month", "Purchase invoices for the month", "Bank statement for the month"],
    process: [
      ["Choose your plan", "Your plan depends on invoices per month."],
      ["Send monthly data", "Upload invoices by the 7th of each month."],
      ["We prepare and file", "We file before the due date and tell you the tax payable."],
      ["You pay the challan", "You pay the tax directly; we keep the acknowledgement."]
    ],
    faqs: [
      ["What if my invoices go up in a busy month?", "Your plan is checked every quarter. If you consistently move to a higher band, we'll offer the higher plan for your approval first."],
      ["Can I cancel?", "Yes. Cancellation and notice terms will be in the engagement terms."]
    ],
    addons: ["urgent", "historic", "consult"]
  },
  {
    id: "stamp-duty-challan",
    part: "E", name: "Stamp duty challan preparation (Sindh and Punjab)",
    summary: "We prepare the correct e-stamp challan for your document, in Sindh or Punjab.",
    model: "unit", time: "1–2 working days",
    units: [
      { key: "sindh", name: "Sindh challan", fee: null, criteria: "Per challan for an instrument executed in Sindh." },
      { key: "punjab", name: "Punjab challan", fee: null, criteria: "Per challan for an instrument executed in Punjab." }
    ],
    questions: [
      { id: "province", label: "Which province?", options: [
        { label: "Sindh", unit: "sindh" }, { label: "Punjab", unit: "punjab" } ] },
      { id: "instrument", label: "Type of document", options: [
        { label: "Sale deed / transfer of property" }, { label: "Lease or rent agreement" }, { label: "Partnership deed" },
        { label: "Power of attorney" }, { label: "Share transfer / company document" }, { label: "Loan, mortgage or bond" }, { label: "Other" } ] },
      { id: "qty", label: "Number of challans", type: "number", min: 1, max: 50 }
    ],
    unitNote: "Duty rates live in an editable table per province and are never hard-coded. A TaxSaathi staff member verifies the duty amount before any challan is issued.",
    govFees: ["Stamp duty at actual cost — paid by you directly to the government"],
    included: ["Check of instrument type and value", "Challan prepared with correct particulars", "Challan copy stored with your order"],
    excluded: ["Stamp duty itself", "Document drafting", "Registration with the sub-registrar"],
    checklist: ["Draft or signed document", "CNIC of all parties", "Value or consideration of the document", "Property location (if property is involved)"],
    process: [
      ["Get your price", "Choose the province and number of challans."],
      ["Upload the document", "We check the instrument type and value."],
      ["We verify the duty", "A staff member confirms the duty amount."],
      ["Challan ready", "You pay the duty directly; the challan is stored with your order."]
    ],
    faqs: [
      ["Do you collect the stamp duty?", "No. Stamp duty is paid by you directly to the government through the authorised channel. It is never part of our fee."],
      ["Why are Sindh and Punjab priced separately?", "The rules, rates and procedures differ between the provinces, so each has its own checklist, price and time estimate."]
    ],
    addons: ["urgent"]
  },
  {
    id: "notice-reply",
    part: "C", name: "Notice review and written reply (FBR, SRB, PRA, SECP, EOBI)",
    summary: "Received a notice? We read it, explain it in plain language and draft a written reply.",
    model: "unit", time: "Depends on your deadline — we plan backwards from it",
    units: [
      { key: "info", name: "Information request / compliance notice", fee: null, criteria: "Notices asking for documents, explanations or a missing return." },
      { key: "showcause", name: "Show-cause notice", fee: null, criteria: "Notices proposing an addition, penalty or default." },
      { key: "demand", name: "Assessment order / demand notice", fee: null, criteria: "Notices raising a tax demand or recovery." }
    ],
    questions: [
      { id: "authority", label: "Which authority sent the notice?", options: [
        { label: "FBR" }, { label: "SRB" }, { label: "PRA" }, { label: "SECP" }, { label: "EOBI" } ] },
      { id: "type", label: "What type of notice is it?", help: "Not sure? Pick the closest one; we confirm after reading the notice.", options: [
        { label: "Request for information / documents", unit: "info" }, { label: "Show-cause notice", unit: "showcause" }, { label: "Assessment order or demand", unit: "demand" } ] },
      { id: "deadline", label: "Response deadline on the notice", type: "date" }
    ],
    govFees: ["Any tax, penalty or default surcharge is paid by you directly, if payable"],
    included: ["Plain-language explanation of the notice", "Written reply drafted and shared for your approval", "Reply filed online or ready for submission", "List of supporting documents to attach"],
    excluded: ["Hearing attendance (stage-priced)", "Appeals (stage-priced)", "Payment of any tax demanded"],
    checklist: ["Copy of the notice (all pages)", "Tax return or filing the notice relates to", "Any earlier correspondence", "Documents supporting your position"],
    process: [
      ["Tell us the deadline", "We show it prominently and flag anything due within 7 days."],
      ["Upload the notice", "We read it and confirm the notice type."],
      ["Review the draft reply", "You approve the reply before it goes anywhere."],
      ["Reply submitted", "We file it or hand it to you ready to submit."]
    ],
    faqs: [
      ["My deadline is in two days. Can you still help?", "Yes, tell us now. Matters due within 7 days are flagged to the owner at once. Add Urgent handling if you need work to start the same day."],
      ["What if the matter goes to appeal?", "Appeals are priced by stage. Each stage starts only after you approve and pay for it."]
    ],
    addons: ["urgent", "consult"],
    intake: "notice"
  },
  {
    id: "consultation",
    part: "D", name: "Paid consultation (30 minutes)",
    summary: "A 30-minute call or meeting with a consultant to talk through your tax or compliance question.",
    model: "unit", time: "Usually within 2 working days",
    units: [
      { key: "session", name: "30-minute consultation", fee: null, criteria: "Per 30-minute session, by phone, video or at our office." }
    ],
    questions: [
      { id: "mode", label: "How would you like to meet?", options: [
        { label: "Video call", unit: "session" }, { label: "Phone call", unit: "session" }, { label: "At our Karachi office", unit: "session" } ] },
      { id: "qty", label: "Number of sessions", type: "number", min: 1, max: 4 }
    ],
    govFees: [],
    included: ["30 minutes with a consultant", "Short written summary of what was discussed"],
    excluded: ["Formal written tax opinion", "Filing or registration work"],
    checklist: ["A short note of your question", "Any notice, return or document you want to discuss"],
    process: [
      ["Book and pay", "Choose how you'd like to meet."],
      ["Share your question", "Send a short note and any documents."],
      ["Meet", "We call or meet at the agreed time (PKT)."],
      ["Summary", "You receive a short written summary."]
    ],
    faqs: [["If I then order a service, is the consultation fee deducted?", "Any such rule must apply to everyone and will be published here once the owner decides."]],
    addons: []
  }
];

// Statutory deadlines (free tool). Indicative — the owner must verify before launch.
TS.deadlines = [
  { day: "15", when: "Every month", title: "Sales tax payment (FBR)", note: "Payment of sales tax for the previous month.", auth: "FBR" },
  { day: "18", when: "Every month", title: "Sales tax return (FBR)", note: "Monthly sales tax return for the previous month.", auth: "FBR" },
  { day: "15", when: "Every month", title: "SRB sales tax on services payment", note: "Payment for the previous month.", auth: "SRB" },
  { day: "18", when: "Every month", title: "SRB monthly return", note: "Return for the previous month.", auth: "SRB" },
  { day: "18", when: "Every month", title: "PRA monthly return", note: "Return and payment for the previous month.", auth: "PRA" },
  { day: "20", when: "Quarterly", title: "Withholding tax statements", note: "Quarterly statements for the previous quarter.", auth: "FBR" },
  { day: "30", when: "September", title: "Income tax return (individuals and AOPs)", note: "Annual return and wealth statement for the tax year ended 30 June.", auth: "FBR" },
  { day: "31", when: "December", title: "Income tax return (companies, June year-end)", note: "Annual return for companies with a 30 June year-end.", auth: "FBR" }
];
