#!/usr/bin/env node
/* TaxSaathi static site build. No dependencies (Node 18+).
 *
 *   npm run build            → writes the finished site to dist/
 *   npm run build -- --drafts  → also includes articles marked draft: true (local preview only)
 *
 * Reads: site.config.js (settings), src/data.js (prices and services),
 * src/seo.js (keyword map), content/knowledge/*.md (articles).
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const DRAFTS = process.argv.includes("--drafts");

const S = require(path.join(ROOT, "site.config.js"));
S.SITE_URL = S.SITE_URL.replace(/\/$/, "");
const SEO = require(path.join(ROOT, "src/seo.js"));
const U = require("./lib/util");
const MD = require("./lib/markdown");

// Load the browser-style data file in a sandbox.
const sandbox = {}; sandbox.window = sandbox; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "src/data.js"), "utf8"), sandbox, { filename: "src/data.js" });
const TS = JSON.parse(JSON.stringify(sandbox.TS)); // plain objects

const C = require("./lib/catalog")(TS, SEO, S);
const L = require("./lib/layout")(S, TS.parts);

/* ---------- Knowledge articles ---------- */
const CATEGORIES = [
  { name: "Registration", slug: "registration", blurb: "NTN, business, company, sales tax and provincial registrations: who needs them, the steps and the documents." },
  { name: "Returns", slug: "returns", blurb: "Income tax returns, wealth statements and monthly sales tax returns: who must file and what to keep." },
  { name: "Notices", slug: "notices", blurb: "What to do when a notice arrives from FBR, SRB, PRA, SECP, EOBI or the Board of Revenue." },
  { name: "Stamp Duty", slug: "stamp-duty", blurb: "Stamp duty and e-stamp challans in Sindh and Punjab, in plain language." },
  { name: "Employers", slug: "employers", blurb: "EOBI and other employer duties, step by step." },
  { name: "Deadlines", slug: "deadlines", blurb: "Monthly and annual tax deadlines and how to stay ahead of them." }
];
const errors = [], warnings = [];
const KDIR = path.join(ROOT, "content/knowledge");
const articles = (fs.existsSync(KDIR) ? fs.readdirSync(KDIR) : [])
  .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  .map((f) => {
    const { data, body } = MD.frontMatter(fs.readFileSync(path.join(KDIR, f), "utf8"));
    for (const k of ["title", "slug", "date", "category", "summary", "author"]) if (!data[k]) errors.push(`${f}: missing "${k}" in the header block`);
    const cat = CATEGORIES.find((c) => c.name.toLowerCase() === String(data.category || "").toLowerCase());
    if (!cat) errors.push(`${f}: category must be one of ${CATEGORIES.map((c) => c.name).join(", ")}`);
    if (data.summary && data.summary.length >= 160) errors.push(`${f}: summary must be under 160 characters`);
    const r = MD.render(body);
    const svc = data.service && C.services.find((s) => C.seo(s).slug === data.service);
    if (data.service && !svc) errors.push(`${f}: service "${data.service}" is not a service page slug`);
    return { ...data, file: f, html: r.html, headings: r.headings, category: cat ? cat.name : data.category, categorySlug: cat ? cat.slug : "",
      readTime: Number(data.readTime) || Math.max(1, Math.round(r.words / 200)), url: `/knowledge/${data.slug}/`, part: svc ? svc.part : null };
  })
  .filter((a) => DRAFTS || a.draft !== true)
  .sort((a, b) => (b.date + b.slug).localeCompare(a.date + a.slug));

const testimonialsFile = path.join(ROOT, "content/testimonials.json");
const testimonials = fs.existsSync(testimonialsFile) ? JSON.parse(fs.readFileSync(testimonialsFile, "utf8")) : [];

const ctx = { S, TS, SEO, U, L, C, articles, CATEGORIES, testimonials, root: ROOT };

/* ---------- Render ---------- */
const pages = [
  ...require("../src/pages/home")(ctx),
  ...require("../src/pages/services")(ctx),
  ...require("../src/pages/price-list")(ctx),
  ...require("../src/pages/content")(ctx),
  ...require("../src/pages/knowledge")(ctx)
];

if (errors.length) { console.error("Build stopped:\n  " + errors.join("\n  ")); process.exit(1); }

fs.rmSync(DIST, { recursive: true, force: true });
const write = (rel, data) => { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
pages.forEach((p) => write(p.out, p.html));

/* ---------- Static files ---------- */
const copyDir = (src, dst, filter = () => true) => {
  if (!fs.existsSync(src)) return;
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d, filter);
    else if (filter(e.name)) { fs.mkdirSync(dst, { recursive: true }); fs.copyFileSync(s, d); }
  }
};
const notJunk = (n) => n !== "test.txt" && !n.startsWith(".");
copyDir(path.join(ROOT, "assets/css"), path.join(DIST, "assets/css"), notJunk);
copyDir(path.join(ROOT, "assets/img"), path.join(DIST, "assets/img"), notJunk);
copyDir(path.join(ROOT, "assets/js"), path.join(DIST, "assets/js"), (n) => notJunk(n) && (S.SHOW_STAMP_CALCULATOR || !/^stamp-/.test(n)));
if (fs.existsSync(path.join(ROOT, "assets/img/favicon.ico"))) fs.copyFileSync(path.join(ROOT, "assets/img/favicon.ico"), path.join(DIST, "favicon.ico"));

/* ---------- robots, sitemap ---------- */
const indexable = pages.filter((p) => p.out.endsWith("index.html"));
const urlOf = (out) => "/" + out.replace(/index\.html$/, "");
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${S.SITE_URL}/sitemap.xml\n`);
const lastmod = (p) => { const a = articles.find((x) => urlOf(p.out) === x.url); return a ? (a.updated || a.date) : S.PUBLISHED; };
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `<url><loc>${S.SITE_URL}${urlOf(p.out)}</loc><lastmod>${lastmod(p)}</lastmod></url>`).join("\n")}
</urlset>
`);

/* ---------- Redirects (CR-161) and headers ---------- */
const OLD = { "index.html": "/", "services.html": "/services/", "price-list.html": "/price-list/", "how-it-works.html": "/how-it-works/", "tools.html": "/tools/",
  "knowledge.html": "/knowledge/", "about.html": "/about/", "faq.html": "/faq/", "contact.html": "/contact/", "policies.html": "/policies/" };
const OLD_IDS = { "stamp-duty-challan": "stamp-duty-challan-sindh" }; // retired id → current service
const svcBySlugId = (id) => C.services.find((s) => s.id === (OLD_IDS[id] || id));
let redirects = Object.entries(OLD).map(([from, to]) => `/${from} ${to} 301`);
if (S.HOST === "netlify") {
  const host = S.SITE_URL.replace(/^https?:\/\//, "");
  const bare = host.replace(/^www\./, ""), www = "www." + bare;
  const other = host.startsWith("www.") ? bare : www;
  redirects.unshift(`https://${other}/* ${S.SITE_URL}/:splat 301!`, `http://${other}/* ${S.SITE_URL}/:splat 301!`);
  redirects.push(...[...C.services.map((s) => s.id), ...Object.keys(OLD_IDS)].map((id) => `/service.html s=${id} ${C.path(svcBySlugId(id))} 301`));
}
redirects.push("/service.html /services/ 301");
write("_redirects", redirects.join("\n") + "\n");
write("_headers", `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/assets/*
  Cache-Control: public, max-age=604800
`);
// Old /service.html?s=<id> links: the rule above sends them to /services/?s=<id> (the query
// string is kept), and the services page forwards to the matching service page.

/* ---------- Checks (section 5, CR-162) ---------- */
const titles = {}, descs = {};
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ");
for (const p of pages.filter((p) => p.out.endsWith(".html"))) {
  const title = (p.html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  const desc = (p.html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const t = title.replace(/&amp;/g, "&").replace(/&#39;/g, "'"), d = desc.replace(/&amp;/g, "&").replace(/&#39;/g, "'");
  if (t.length >= 60 && !(p.out === "index.html")) warnings.push(`${p.out}: title is ${t.length} characters (keep under 60): ${t}`);
  if (d.length >= 155) warnings.push(`${p.out}: description is ${d.length} characters (keep under 155)`);
  if (titles[t]) warnings.push(`${p.out}: same title as ${titles[t]}`); titles[t] = p.out;
  if (descs[d]) warnings.push(`${p.out}: same description as ${descs[d]}`); descs[d] = p.out;
  if ((p.html.match(/<h1[\s>]/g) || []).length !== 1) warnings.push(`${p.out}: should have exactly one <h1>`);
  // Words the brief keeps off public pages (section 0 and acceptance test 3).
  let text = strip(p.html.replace(/<head>[\s\S]*?<\/head>/, ""));
  text = text.split(S.ADDRESS).join(" ").replace(/No sign-up/g, "").replace(/CNIC of owner, partners/g, "").split(S.LEGAL_LINE).join(" ").replace("the courts at Karachi have jurisdiction", "");
  const banned = [/karachi/i, /serving all/i, /log ?in\b/i, /sign[ -]?(in|up)\b(?!\s*·)/i, /testimonial/i, /\[/, /\bowner\b/i, /\bbest\b/i, /guarantee(d)?\b(?! of outcome)/i, /lowest price/i, /\badvocate\b/i, /track your order/i, /your account/i, /client portal/i, /to be set/i];
  for (const re of banned) { const m = text.match(re); if (m) warnings.push(`${p.out}: contains “${m[0]}” …${text.slice(Math.max(0, m.index - 40), m.index + 40)}…`); }
}

const nDraft = DRAFTS ? articles.filter((a) => a.draft === true).length : 0;
console.log(`Built ${pages.length} files into dist/ (${C.services.length} services, ${articles.length} articles${nDraft ? `, including ${nDraft} drafts` : ""}).`);
if (!articles.length) console.log("Note: no published Knowledge articles. CR-35 needs at least three before launch (set draft: false).");
if (warnings.length) { console.log(`\n${warnings.length} check warning(s):\n  ` + warnings.join("\n  ")); }
if (process.argv.includes("--strict") && warnings.length) process.exit(1);
