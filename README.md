# TaxSaathi website: Phase 1 public site (front end)

A static site in plain HTML, CSS and JavaScript. It has no build step and no dependencies.

## Run locally
```
python -m http.server 5173
```
Then open http://localhost:5173. You can also open `index.html` directly in a browser.

## Where things live
| File | What it holds |
|---|---|
| `assets/js/data.js` | **All prices, tiers, criteria, quote questions, add-ons, rate card, checklists, FAQs and deadlines.** Every `fee: null` shows as "To be set". Put the owner's PKR amounts here. |
| `assets/js/site.js` | Shared header, footer and WhatsApp button, plus the quote engine (`TS.computeQuote`) |
| `assets/css/style.css` | Design system: brand colours, Manrope, components |
| `service.html?s=<id>` | One template for every service page, with the "Get your price" panel |
| `order.html` | Order-flow UI: quote, add-ons, details, documents, review and terms, pay, confirmation. **Preview only; nothing is submitted.** |
| `_partials/*.part.html` | Source for the simple content pages. Run `python _partials/make.py` after editing them. |

## Quote rules
- Tiered and monthly-plan services: each answer option points to a tier. The job lands in the **highest** tier any answer points to, and those answers become the reason shown to the client.
- Per-unit services: one answer chooses the unit, and an optional quantity multiplies it.
- No per-client price input exists anywhere. The same answers always give the same price.
- Government fees always show on separate "At cost" lines.

## Not built yet (needs a backend)
Accounts, file storage, payments, email and WhatsApp notifications, the admin panel (versioned price rules, orders, re-quotes, logs), the client portal, and Urdu.
