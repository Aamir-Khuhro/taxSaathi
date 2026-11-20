# TaxSaathi website

A static site built by a small Node script (no dependencies, Node 18+). Every page,
price and article is rendered into plain HTML in `dist/`, which any static host can serve.

## Commands
```
npm run build      # build the live site into dist/
npm run preview    # build including draft articles, then serve on http://localhost:5173
npm run check      # build and fail if any title, description or wording check fails
```

## Where things live
| File | What it holds |
|---|---|
| `site.config.js` | **Settings (CR-140):** SITE_URL, publish date, phone, WhatsApp, email, address, hours, social links, tax on fee, switches (testimonials, stamp duty calculator), host. |
| `src/data.js` | **All prices**, tiers, quote questions, add-ons, rate card, Appendix C document lists, deadlines. Edit prices here. |
| `src/seo.js` | Keyword map (Appendix F): page address, title, description and first paragraph for every service and page. |
| `src/pages/*.js` | Page templates and fixed wording (policies, FAQ, About, How it works). |
| `content/knowledge/*.md` | Knowledge articles, one Markdown file each. See `_template.md`. |
| `assets/js/quote.js` | Quote panel: price engine, quote number, WhatsApp order, copy, email and print. |
| `assets/js/site.js` | Menu, search, filters, tabs, contact form → WhatsApp. |
| `assets/js/stamp-duty*.js` | Sindh stamp duty calculator, published only when `SHOW_STAMP_CALCULATOR` is true. |
| `future/portal/` | Old login and online-order pages, kept for later and not built. |

## Adding a Knowledge article
Copy `content/knowledge/_template.md`, fill in the header block, write the article, set
`draft: false` and deploy. The list, category page, home page row, sitemap and feed update.

## Before launch
1. Set `SITE_URL` (the bought domain) and `PUBLISHED` (launch date) in `site.config.js`.
2. Review the three draft articles and change `draft: true` to `draft: false`.
3. Optional: add a photo at `assets/img/abdullah.webp` (or `.jpg`); the About page shows it automatically.

## Hosting (CR-145)
**Currently on Vercel.** `vercel.json` tells Vercel to run `npm run build`, serve `dist/`,
redirect the old `.html` addresses (301) and set headers. Push to `main` to deploy.
Old `service.html?s=<id>` links reach `/services/?s=<id>`, which forwards to the service page.


Vercel's free Hobby plan is for personal, non-commercial use, so use a host whose free plan
allows a business site, such as **Cloudflare Pages** or **Netlify** (check their current terms).
- Build command `npm run build`, output folder `dist`.
- `dist/_redirects` sends old `.html` addresses to the new ones (301), and `dist/_headers` sets caching and security headers. Both hosts read them.
- HTTPS is automatic on both. For www → main address: on Netlify set `HOST: "netlify"` (the rule is written into `_redirects`); on Cloudflare add a Bulk Redirect or redirect rule in the dashboard.

## Quote rules
- Tiered and monthly plans: the job lands in the **highest** tier any answer points to; those answers are the reason shown.
- Per-unit and stage-based: one answer picks the unit; an optional quantity multiplies it.
- No per-client price input exists anywhere. The same answers always give the same price.
- Government fees always show on separate "At cost" lines. Tax on our fee shows only if `TAX_ON_FEE` is set.
