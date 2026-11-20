/* TaxSaathi: site settings (CR-140).
 *
 * The ONE place for contact details, links and switches. Every page reads from
 * this file when the site is built (`npm run build`). Change a value here,
 * rebuild, and it updates everywhere: header, footer, contact page, structured
 * data, canonical links, sitemap, feed and the WhatsApp order message.
 */
module.exports = {
  // Domain not bought yet. Set this to the final address (no trailing slash)
  // before launch; canonical links, sitemap, feed and social tags follow it.
  SITE_URL: "https://www.taxsaathi.example",

  // Date the site (and price list v1.0) is published. Used for "Effective from",
  // "Last reviewed", the policies' "Last updated" and the next price review
  // (three months later). Format: YYYY-MM-DD.
  PUBLISHED: "2026-11-20",

  BRAND: "TaxSaathi",
  BRAND_URDU: "ٹیکس ساتھی",
  TAGLINE: "Tax · Regulatory · Compliance",
  LEGAL_LINE: "TaxSaathi (Associate), Karachi", // CR-150: footer line, exactly
  OWNER: "Abdullah",
  CREDENTIALS: "LLB, LLM",

  PHONE: "+92 325 3936334",
  PHONE_TEL: "+923253936334",
  WHATSAPP_NUMBER: "923253936334",
  WHATSAPP_LINK: "https://wa.me/923253936334",
  WHATSAPP_GREETING: "Hello TaxSaathi, I have a question.",
  EMAIL: "taxsaathie@gmail.com",

  ADDRESS: "Office adjacent to Idara Maarif-ul-Quran, Sector A, Street No. 2, Kashmir Colony, Korangi Road, Karachi",
  ADDRESS_PARTS: { street: "Office adjacent to Idara Maarif-ul-Quran, Sector A, Street No. 2, Kashmir Colony, Korangi Road", city: "Karachi", region: "Sindh", country: "PK" },
  MAP_LINK: "https://www.google.com/maps/search/?api=1&query=Idara%20Maarif-ul-Quran%2C%20Kashmir%20Colony%2C%20Korangi%20Road%2C%20Karachi",

  HOURS: "Monday to Saturday, 10:00 am to 6:00 pm (Pakistan time)",
  HOURS_NOTE: "Messages outside these hours are answered the next working day.",
  HOURS_SCHEMA: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "18:00" },

  SOCIAL: {
    instagram: "https://www.instagram.com/tax_saathee/",
    facebook: "https://www.facebook.com/profile.php?id=61596413390837",
    linkedin: "https://www.linkedin.com/company/tax-saathi/"
  },

  // Quotes (section 2): valid 14 days; tax on our fee shown only when it applies.
  QUOTE_VALIDITY_DAYS: 14,
  // e.g. { label: "Taxes on our fee (if applicable)", rate: 0.15 }. null = none.
  TAX_ON_FEE: null,
  WHATSAPP_MESSAGE_LIMIT: 1500,

  // Switches
  SHOW_TESTIMONIALS: false,     // CR-22: component kept, switched off
  SHOW_STAMP_CALCULATOR: false, // CR-120: off until the owner supplies the SITC document

  // Hosting: "cloudflare" or "netlify". Netlify also gets the www → main-address
  // rule and old service.html?s= redirects inside _redirects.
  HOST: "cloudflare"
};
