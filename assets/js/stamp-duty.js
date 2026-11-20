/* Sindh stamp duty calculator: rate data and calculation (CR-120).
 * Loaded only when SHOW_STAMP_CALCULATOR is true in site.config.js. */
window.TS = window.TS || {};
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
    ratesUpdated: "2026-11-17", // CR-120: shown as "Rates last updated". Change when the SITC document is applied.
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

