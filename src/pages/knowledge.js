const { articleCard, DISCLAIMER } = require("./shared");

/* Knowledge Centre (CR-30 to CR-34): list, category pages, articles, RSS feed. */
module.exports = function knowledge(ctx) {
  const { S, SEO, U, L, C, articles, CATEGORIES } = ctx;
  const { esc, fmtDate, rfc822 } = U;
  const out = [];
  const P = SEO.pages.knowledge;
  const PAGE_SIZE = 9;
  const usedCats = CATEGORIES.filter((c) => articles.some((a) => a.categorySlug === c.slug));

  const listBody = (list, activeSlug) => `<section class="section" style="padding-top:40px"><div class="wrap">
    ${list.length ? `<div class="filter-bar no-print">
      <div class="search">${U.ICONS.search}<label class="sr-only" for="k-find">Search guides</label><input type="search" id="k-find" placeholder="Search guides" autocomplete="off"></div>
      <nav class="chips" aria-label="Categories"><a class="chip-btn" href="/knowledge/"${!activeSlug ? ' aria-current="page"' : ""}>All</a>${usedCats.map((c) => `<a class="chip-btn" href="/knowledge/category/${c.slug}/"${activeSlug === c.slug ? ' aria-current="page"' : ""}>${esc(c.name)}</a>`).join("")}</nav>
    </div>
    <div class="k-grid" id="k-list" data-page="${PAGE_SIZE}">${list.map((a, i) => articleCard(a, esc, fmtDate).replace('<article class="k-card"', `<article class="k-card${i >= PAGE_SIZE ? " is-more" : ""}"`)).join("")}</div>
    <p class="muted" id="no-match" hidden>No guide matches your search.</p>
    ${list.length > PAGE_SIZE ? '<div class="center" style="margin-top:28px"><button class="btn btn--ghost" type="button" id="k-more">Load more</button></div>' : ""}`
    : `<div class="k-empty">
      <p class="lead">New guides are published every week. Until then, these free tools answer the most common questions.</p>
      <div class="grid grid-3">
        <a class="card" href="/tools/"><h2 class="h-card">Tax deadline calendar</h2><p>Monthly and annual due dates for FBR, SRB, PRA and EOBI.</p></a>
        <a class="card" href="/tools/#documents"><h2 class="h-card">Documents to provide</h2><p>The document list for every service, ready to print.</p></a>
        <a class="card" href="/faq/"><h2 class="h-card">Questions and answers</h2><p>Ordering, prices, payment and documents.</p></a>
      </div></div>`}
    <p class="small muted" style="margin-top:32px">${DISCLAIMER} <a href="/knowledge/feed.xml">RSS feed</a></p>
  </div></section>`;

  out.push({ out: "knowledge/index.html", html: L.page({
    path: "/knowledge/", title: P.title, desc: P.desc, crumbs: [["/knowledge/", "Knowledge"]],
    h1: "Tax guides: Knowledge Centre", lead: "Plain-language tax guides for Pakistan on registration, returns, notices, stamp duty, employers and deadlines. No jargon without an explanation.",
    body: listBody(articles, null)
  }) });

  for (const c of usedCats) {
    const list = articles.filter((a) => a.categorySlug === c.slug);
    const path = `/knowledge/category/${c.slug}/`;
    out.push({ out: `knowledge/category/${c.slug}/index.html`, html: L.page({
      path, title: `${c.name} Guides`, desc: `Plain-language ${c.name.toLowerCase()} guides from TaxSaathi: steps, documents, common mistakes and deadlines. Read the latest.`,
      crumbs: [["/knowledge/", "Knowledge"], [path, c.name]],
      h1: `${esc(c.name)} guides`, lead: esc(c.blurb), body: listBody(list, c.slug)
    }) });
  }

  for (const a of articles) {
    const svc = C.services.find((s) => C.seo(s).slug === a.service);
    const related = articles.filter((x) => x !== a && x.categorySlug === a.categorySlug).concat(articles.filter((x) => x !== a && x.categorySlug !== a.categorySlug)).slice(0, 3);
    const h2s = a.headings.filter((h) => h.level === 2);
    const toc = h2s.length >= 4 ? `<nav class="toc" aria-label="On this page"><p class="label-mono">On this page</p><ol>${h2s.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join("")}</ol></nav>` : "";
    const url = L.abs(a.url);
    const share = `<div class="share no-print"><span class="label-mono">Share</span>
      <a href="https://wa.me/?text=${encodeURIComponent(a.title + " " + url)}" ${L.ext} aria-label="Share on WhatsApp (opens in a new tab)">${U.ICONS.wa}</a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" ${L.ext} aria-label="Share on LinkedIn (opens in a new tab)">${U.ICONS.linkedin}</a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" ${L.ext} aria-label="Share on Facebook (opens in a new tab)">${U.ICONS.facebook}</a>
      <button type="button" data-copy="${url}" aria-label="Copy link">${U.ICONS.link}<span class="copy-done" hidden>Copied</span></button></div>`;
    const ld = [{ "@type": "Article", headline: a.title, description: a.summary, datePublished: a.date, dateModified: a.updated || a.date,
      author: { "@type": "Person", name: a.author }, publisher: { "@id": L.abs("/#org") }, mainEntityOfPage: url,
      image: L.abs("/assets/img/og.png"), articleSection: a.category, ...(a.keyword ? { keywords: a.keyword } : {}) }];
    const help = svc ? `<aside class="help-box">
        <h2>Need help with this?</h2>
        <p>${esc(svc.name)}: from ${U.money(C.fromPrice(svc))}${C.perLabel(svc)}. See the published price, the documents you provide and order on WhatsApp.</p>
        <div class="cta-actions"><a class="btn btn--primary" href="${C.path(svc)}">See the service and price</a><a class="btn btn--ghost btn--plain" href="${L.wa(`Hello TaxSaathi, I read “${a.title}” and have a question.`)}" ${L.ext}>Ask on WhatsApp</a></div>
      </aside>` : "";

    out.push({ out: `knowledge/${a.slug}/index.html`, html: L.page({
      path: a.url, title: a.seoTitle || a.title, desc: a.summary, ogType: "article",
      crumbs: [["/knowledge/", "Knowledge"], [`/knowledge/category/${a.categorySlug}/`, a.category], [a.url, a.title]],
      h1: esc(a.title), lead: esc(a.summary),
      headExtra: `<p class="k-byline">By ${esc(a.author)} · <time datetime="${a.date}">${fmtDate(a.date)}</time>${a.updated && a.updated !== a.date ? ` · Updated <time datetime="${a.updated}">${fmtDate(a.updated)}</time>` : ""} · ${a.readTime} min read</p>`,
      ld,
      body: `<section class="section" style="padding-top:40px"><div class="wrap article-layout">
        <article class="prose article">
          ${toc}
          ${a.html}
          ${help}
          <p class="disclaimer-box">${DISCLAIMER}</p>
          ${share}
        </article>
        <aside class="article-aside">
          ${related.length ? `<h2 class="h-small">Related guides</h2><ul class="link-list">${related.map((r) => `<li><a href="${r.url}">${esc(r.title)}</a></li>`).join("")}</ul>` : ""}
          <h2 class="h-small">Browse</h2><ul class="link-list"><li><a href="/knowledge/category/${a.categorySlug}/">More ${esc(a.category.toLowerCase())} guides</a></li><li><a href="/services/">All services</a></li></ul>
        </aside>
      </div></section>`
    }) });
  }

  // RSS feed
  const items = articles.slice(0, 30).map((a) => `<item>
  <title>${esc(a.title)}</title>
  <link>${L.abs(a.url)}</link>
  <guid isPermaLink="true">${L.abs(a.url)}</guid>
  <pubDate>${rfc822(a.date)}</pubDate>
  <category>${esc(a.category)}</category>
  <description>${esc(a.summary)}</description>
</item>`).join("\n");
  out.push({ out: "knowledge/feed.xml", html: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${S.BRAND} Knowledge Centre</title>
<link>${L.abs("/knowledge/")}</link>
<atom:link href="${L.abs("/knowledge/feed.xml")}" rel="self" type="application/rss+xml"/>
<description>Plain-language tax guides from ${S.BRAND}.</description>
<language>en</language>
${articles.length ? `<lastBuildDate>${rfc822(articles[0].updated || articles[0].date)}</lastBuildDate>` : ""}
${items}
</channel>
</rss>
` });
  return out;
};
