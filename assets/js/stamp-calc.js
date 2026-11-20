/* Sindh stamp duty calculator UI. Loaded only when SHOW_STAMP_CALCULATOR is true. */
document.addEventListener("DOMContentLoaded", () => {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  TS.esc = TS.esc || esc;
  // Stamp duty calculator (Sindh)
  const OUT = document.getElementById("sd-out"), SD = TS.stampDuty.sindh, insSel = document.getElementById("sd-ins"), box = document.getElementById("sd-inputs");
  const groups = [...new Set(SD.instruments.map(i => i.group))];
  insSel.innerHTML = groups.map(g => `<optgroup label="${g}">${SD.instruments.filter(i => i.group === g).map(i => `<option value="${i.id}">${TS.esc(i.name)} — Art. ${TS.esc(i.art)}</option>`).join("")}</optgroup>`).join("");
  document.getElementById("sd-src").innerHTML = `Rates: ${TS.esc(SD.source)}. Indicative only: exemptions, the correct DC rate for your property and future Finance Act changes can alter the figure. Agricultural (rural) land is valued per acre from the deh rate, so enter its value directly. We confirm the exact duty before preparing your challan.`;
  const num = (id, label, hint, ph) => `<div class="field"><label for="${id}">${label}</label><input type="number" min="0" step="any" inputmode="decimal" id="${id}" placeholder="${ph || "Rs"}">${hint ? `<span class="hint">${hint}</span>` : ""}</div>`;
  const row = (a, b) => `<div class="grid grid-2" style="gap:0 16px">${a}${b}</div>`;
  const val = (id) => { const e = document.getElementById(id); return e ? e.value : ""; };
  const radio = (name, opts, sel) => `<div class="choice-group" style="margin-bottom:16px">${opts.map(([v, l]) => `<label class="choice"><input type="radio" name="${name}" value="${v}"${v === sel ? " checked" : ""}><span class="c-main">${l}</span></label>`).join("")}</div>`;
  let vMode = "known", pType = "residential";
  const propFields = () => {
    if (vMode === "known") return num("sd-val", "Value as per the valuation (DC) table", "From the DC valuation table for your area, or the value on your last challan.");
    let h = `<div class="field"><span class="label">Type of property</span></div>` + radio("sd-ptype", [["plot", "Open plot"], ["residential", "Residential built-up (house or flat)"], ["commercial", "Commercial built-up (shop or office)"], ["industrial", "Industrial"]], pType);
    if (pType === "industrial") return h + row(num("sd-lrate", "DC land rate (per sq yd)"), num("sd-larea", "Land area (sq yd)", "", "sq yd")) + row(num("sd-srate", "DC structure rate (per sq ft)"), num("sd-cov", "Total covered area (sq ft)", "Leave empty if nothing is built.", "sq ft"));
    h += row(num("sd-rate", "DC rate (per sq yd)"), num("sd-area", pType === "plot" ? "Land area (sq yd)" : "Covered area (sq yd)", "", "sq yd"));
    if (pType === "plot") return h;
    h += row(num("sd-floors", "Floors above ground", "0 = ground floor only.", "0"), num("sd-bs", "Number of basements", "", "0"));
    if (pType === "commercial") h += `<label class="check" style="margin-bottom:12px"><input type="checkbox" id="sd-khi"><span>Karachi, land category I, II, III or IV</span></label>` + num("sd-barea", "Basement covered area (sq yd)", "Used only for Karachi categories I–IV (Rs 13,500 per sq yd).", "sq yd");
    return h;
  };
  const drawInputs = () => {
    const ins = SD.instruments.find(i => i.id === insSel.value);
    let h = "";
    if (ins.kind === "fixed") h = `<p class="small muted">This document carries a fixed duty, whatever its value.</p>`;
    else if (ins.kind === "rent") h = row(num("sd-rent", "Monthly rent"), num("sd-months", "Term of the lease (months)", "", "months")) + num("sd-adv", "Advance rent, if any", "Refundable security deposits are usually not rent.");
    else if (ins.kind === "property") h = `<div class="field"><span class="label">Property value</span>${ins.valueHint ? `<span class="hint">${TS.esc(ins.valueHint)}</span>` : ""}</div>` + radio("sd-vmode", [["known", "I know the valuation-table (DC) value"], ["dc", "Work it out from the DC rate, as the SITC portal does"]], vMode) + `<div id="sd-prop">${propFields()}</div>` + num("sd-dec", "Value declared in the document (sale price)", "Duty is charged on whichever is higher.");
    else if (ins.unitLabel) h = num("sd-val", ins.unitLabel, "", "");
    else h = num("sd-val", ins.valueLabel || "Value");
    box.innerHTML = h;
    calc();
  };
  const fmt = (n) => "PKR " + Number(n).toLocaleString("en-PK");
  const calc = () => {
    const ins = SD.instruments.find(i => i.id === insSel.value);
    let value = val("sd-val"), dc = null;
    if (ins.kind === "property" && vMode === "dc") {
      dc = TS.dcValue({ type: pType, rate: val("sd-rate"), area: val("sd-area"), floors: val("sd-floors"), basements: val("sd-bs"), khiCat: (document.getElementById("sd-khi") || {}).checked, bArea: val("sd-barea"), landRate: val("sd-lrate"), landArea: val("sd-larea"), struRate: val("sd-srate"), covered: val("sd-cov") });
      value = dc.value;
    }
    const r = TS.stampCalc(ins, { value, declared: val("sd-dec"), rent: val("sd-rent"), months: val("sd-months"), advance: val("sd-adv") });
    const reg = TS.regDuty(ins, r.base);
    let lines = "";
    if (dc && dc.value) lines += `<li><span>DC valuation (${TS.esc(dc.working)})</span><span>${fmt(Math.round(dc.value))}</span></li>`;
    if (ins.kind === "property" && r.base) lines += `<li><span>Value charged (higher of DC and declared)</span><span>${fmt(Math.round(r.base))}</span></li>`;
    if (ins.kind === "rent" && r.base) lines += `<li><span>Total rent for the term</span><span>${fmt(r.base)}</span></li>`;
    lines += `<li class="total"><span>Stamp duty</span><span>${fmt(r.duty)}</span></li>`;
    document.getElementById("sd-out").innerHTML = `
      <span class="label-mono" style="margin:0">Schedule I · Article ${TS.esc(ins.art)}</span>
      <p class="reason" style="margin-top:12px">${TS.esc(ins.note)}</p>
      <ul class="lines">${lines}</ul>
      ${reg != null ? `<ul class="lines" style="margin-top:6px"><li class="gov"><span>Registration duty, if the document is registered</span><span>${fmt(reg)}</span></li></ul>` : ""}
      <p class="small muted" style="margin:12px 0 0">Paid by you directly to the Government of Sindh through e-stamping. It is never part of our fee.${reg != null ? " Registration duty follows the SITC eStamp portal's current calculation." : ""}</p>
      <p class="reason" style="margin-top:14px">Indicative only. We confirm the exact duty before preparing your challan.</p><p class="small muted">Rates last updated: ${new Date(SD.ratesUpdated + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p><div class="qp-actions no-print"><p class="small" style="margin:0"><strong>Stamp duty challan, Sindh</strong>: ${OUT.dataset.fee} per challan</p><a class="btn btn--primary btn--block" href="${OUT.dataset.service}">Order on WhatsApp</a></div>`;
  };
  insSel.addEventListener("change", () => { vMode = "known"; drawInputs(); });
  box.addEventListener("change", (e) => {
    if (e.target.name === "sd-vmode") { vMode = e.target.value; drawInputs(); }
    else if (e.target.name === "sd-ptype") { pType = e.target.value; document.getElementById("sd-prop").innerHTML = propFields(); calc(); }
    else calc();
  });
  box.addEventListener("input", calc);
  drawInputs();

});
