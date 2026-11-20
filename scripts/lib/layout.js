/* Page shell: <head>, header, footer and the floating WhatsApp button.
 * Rendered at build time, so every page has its header, prices and text in the
 * HTML itself (CR-168) and no layout shift while scripts load (CR-143). */
const { esc, ICONS, LOGO, jsonld } = require("./util");

const NAV = [
  ["/services/", "Services"], ["/price-list/", "Price List"], ["/how-it-works/", "How It Works"],
  ["/tools/", "Free Tools"], ["/knowledge/", "Knowledge"], ["/about/", "About"], ["/faq/", "FAQ"], ["/contact/", "Contact"]
];

module.exports = function makeLayout(S, PARTS) {
  const abs = (p) => S.SITE_URL + p;
  const wa = (msg) => S.WHATSAPP_LINK + (msg ? "?text=" + encodeURIComponent(msg) : "");
  const ext = 'target="_blank" rel="noopener noreferrer"';

  const SOCIAL_LABEL = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn" };
  const socials = (cls) => `<div class="${cls}">${["instagram", "facebook", "linkedin"].map((k) =>
    `<a href="${esc(S.SOCIAL[k])}" ${ext} aria-label="${S.BRAND} on ${SOCIAL_LABEL[k]} (opens in a new tab)">${ICONS[k]}</a>`).join("")}</div>`;

  // Organization + LocalBusiness (ProfessionalService) data, on every page (CR-142, CR-165).
  const org = {
    "@type": "ProfessionalService", "@id": abs("/#org"), name: S.BRAND, url: abs("/"),
    logo: abs("/assets/img/logo.png"), image: abs("/assets/img/logo.png"),
    telephone: S.PHONE_TEL, email: S.EMAIL,
    address: { "@type": "PostalAddress", streetAddress: S.ADDRESS_PARTS.street, addressLocality: S.ADDRESS_PARTS.city, addressRegion: S.ADDRESS_PARTS.region, addressCountry: S.ADDRESS_PARTS.country },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: S.HOURS_SCHEMA.days, opens: S.HOURS_SCHEMA.opens, closes: S.HOURS_SCHEMA.closes }],
    sameAs: [S.SOCIAL.instagram, S.SOCIAL.facebook, S.SOCIAL.linkedin],
    priceRange: "PKR"
  };

  function crumbsHTML(crumbs) {
    if (!crumbs || !crumbs.length) return "";
    return `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${crumbs.map(([href, label], i) =>
      i === crumbs.length - 1 ? ` / <span aria-current="page">${esc(label)}</span>` : ` / <a href="${href}">${esc(label)}</a>`).join("")}</nav>`;
  }
  function crumbsLD(crumbs) {
    return { "@type": "BreadcrumbList", itemListElement: [["/", "Home"], ...crumbs].map(([href, label], i) => ({ "@type": "ListItem", position: i + 1, name: label, item: abs(href) })) };
  }

  function header(path) {
    const cur = (href) => (path === href || (href !== "/" && path.startsWith(href))) ? ' aria-current="page"' : "";
    const navLinks = NAV.map(([h, t]) => `<a href="${h}"${cur(h)}>${t}</a>`).join("");
    const orderMsg = "Hello TaxSaathi, I would like to place an order.";
    return `<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap">
  <div class="tb-left">${esc(S.HOURS)}</div>
  <div class="tb-right"><a href="tel:${S.PHONE_TEL}">${esc(S.PHONE)}</a><span class="tb-sep" aria-hidden="true">·</span><a href="mailto:${S.EMAIL}">${esc(S.EMAIL)}</a>${socials("tb-social")}</div>
</div></div>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="${S.BRAND} home">${LOGO}
      <span><span class="brand-name">${S.BRAND}</span><span class="brand-tag">${esc(S.TAGLINE)}</span></span></a>
    <nav class="nav" aria-label="Main">${navLinks}</nav>
    <div class="header-actions">
      <a class="btn btn--primary btn--sm btn--plain btn--wa" href="${wa(orderMsg)}" ${ext}>${ICONS.wa}<span>Order on WhatsApp</span></a>
      <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">MENU</button>
    </div>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">
    ${navLinks}
    <a href="/policies/">Policies</a>
    <div class="mn-actions"><a class="btn btn--primary" href="${wa(orderMsg)}" ${ext}>Order on WhatsApp</a><a class="btn btn--light" href="/services/">Get your price</a></div>
  </nav>
</header>`;
  }

  function footer() {
    const year = new Date().getFullYear();
    return `<footer class="site-footer">
  <div class="wrap">
    <div class="foot-word"><div class="w">Tax<span>Saathi</span></div><div class="u" lang="ur">${S.BRAND_URDU}</div></div>
    <div class="foot-grid">
      <div>
        <h2 class="foot-h">${esc(S.TAGLINE)}</h2>
        <p>Registrations, tax returns, notice replies and stamp duty for individuals, partnerships and companies. Every price is worked out from published rules.</p>
        <p class="follow">Follow us</p>
        ${socials("socials")}
      </div>
      <div><h2 class="foot-h">Services</h2><ul>${PARTS.map((p) => `<li><a href="/services/#part-${p.key}">${p.key}. ${esc(p.name)}</a></li>`).join("")}<li><a href="/services/">All services</a></li></ul></div>
      <div><h2 class="foot-h">${S.BRAND}</h2><ul>
        <li><a href="/price-list/">Price list</a></li><li><a href="/how-it-works/">How it works</a></li>
        <li><a href="/tools/">Free tools</a></li><li><a href="/knowledge/">Knowledge centre</a></li>
        <li><a href="/about/">About</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/contact/">Contact</a></li></ul></div>
      <div><h2 class="foot-h">Contact</h2><ul>
        <li><a href="tel:${S.PHONE_TEL}">${esc(S.PHONE)}</a></li>
        <li><a href="${wa(S.WHATSAPP_GREETING)}" ${ext}>WhatsApp us</a></li>
        <li><a href="mailto:${S.EMAIL}">${esc(S.EMAIL)}</a></li>
        <li><a href="${S.MAP_LINK}" ${ext}>${esc(S.ADDRESS)}</a></li>
        <li>${esc(S.HOURS)}</li></ul></div>
    </div>
    <div class="foot-disclaimer"><strong>General information only;</strong> not a substitute for advice on your specific facts. ${S.BRAND} is a private consultancy. It is not a government body and is not connected with, or approved by, FBR, SECP, SRB, PRA, EOBI, the Board of Revenue or any other authority.</div>
    <div class="foot-bottom"><span>${esc(S.LEGAL_LINE)} · © ${year}</span>
      <span><a href="/policies/#privacy">Privacy</a> · <a href="/policies/#terms">Terms</a> · <a href="/policies/#refund">Refunds</a> · <a href="/policies/#fees">Fee transparency</a></span></div>
  </div>
</footer>
<a class="wa-float" href="${wa(S.WHATSAPP_GREETING)}" ${ext} aria-label="Chat with ${S.BRAND} on WhatsApp (opens in a new tab)">${ICONS.wa}<span>WhatsApp</span></a>`;
  }

  /* page({ path, title, desc, body, crumbs, ld, scripts, noindex, ogType, head }) */
  function page(o) {
    const title = o.rawTitle ? o.title : `${o.title} | ${S.BRAND}`;
    const url = abs(o.path);
    const ld = [org, ...(o.crumbs && o.crumbs.length ? [crumbsLD(o.crumbs)] : []), ...(o.ld || [])];
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(o.desc)}">
${o.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta property="og:type" content="${o.ogType || "website"}">
<meta property="og:site_name" content="${S.BRAND}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${abs("/assets/img/og.png")}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${abs("/assets/img/og.png")}">
<meta name="theme-color" content="#0E5A4B">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="${S.BRAND} Knowledge Centre" href="/knowledge/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&family=Noto+Nastaliq+Urdu:wght@500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">
${o.head || ""}
${jsonld({ "@context": "https://schema.org", "@graph": ld })}
</head>
<body${o.bodyClass ? ` class="${o.bodyClass}"` : ""}>
${header(o.path)}
<main id="main">
${o.pageHead === false ? "" : `<section class="page-head"><div class="wrap">
  ${crumbsHTML(o.crumbs)}
  <h1>${o.h1}</h1>
  ${o.lead ? `<p class="lead">${o.lead}</p>` : ""}
  ${o.headExtra || ""}
</div></section>`}
${o.body}
</main>
${footer()}
<script src="/assets/js/site.js" defer></script>
${(o.scripts || []).map((s) => s.startsWith("<") ? s : `<script src="${s}" defer></script>`).join("\n")}
</body>
</html>
`;
  }

  return { page, wa, abs, ext, socials, org, crumbsHTML };
};
