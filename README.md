# ZHAVILAH BUSINESS GROUP Ltd — Website (Next.js)

Marketing website for ZHAVILAH BUSINESS GROUP Ltd, converted from the original
static PHP template into a **Next.js 15 (App Router)** project.

This is **phase 1: a faithful port** — the design, styling, markup and behaviour
are intentionally unchanged from the PHP original. Refactoring into idiomatic
React components can follow in later phases.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (fully static)
npm start        # serve the production build
```

## How it is structured

| Path | Purpose |
| --- | --- |
| `app/layout.js` | Root layout: `<head>` metadata + stylesheet links, renders `Header` / `Footer`, and loads all library scripts at the end of `<body>` in the original order. |
| `app/page.js` and `app/<route>/page.js` | One route per original `.php` page. Each injects its pre-extracted HTML partial. |
| `app/not-found.js` | The old `404.php` content. |
| `components/Header.js`, `components/Footer.js` | The old `navbar.php` header and `footer.php` markup. |
| `content/*.html` | The original page markup, extracted verbatim (design untouched). Injected via `dangerouslySetInnerHTML`. |
| `lib/content.js` | Reads the HTML partials from `content/`. |
| `public/assets/` | All original CSS / JS / images / fonts, served unchanged. |
| `public/assets/js/zbg-init.js` | The small inline scripts that lived in the PHP pages (contact & subscribe form AJAX, footer "More Services" dropdown, About "View details" toggle). |

### Why HTML partials + full-page navigation

The original template is jQuery-driven (Bootstrap, Swiper, Slick, Isotope,
Fancybox, Magnific Popup, Waypoints, CounterUp) and its `main.js` initialises on
page load, including `$(window).on("load", …)` handlers. To preserve behaviour
exactly, the library scripts are emitted as ordinary `<script>` tags at the end
of `<body>`, and internal links remain plain `<a href>` (full page loads) rather
than client-side `next/link` navigation. This keeps every carousel, filter and
counter working identically to the PHP site.

## Route map (old → new)

| Original | Route |
| --- | --- |
| `index.php` | `/` |
| `about.php` | `/about` |
| `company-history.php` | `/company-history` |
| `contact.php` | `/contact` |
| `gallery.php` | `/gallery` |
| `industries.php` | `/industries` |
| `Accounting-Services.php` | `/accounting-services` |
| `Auditing-Assurance.php` | `/auditing-assurance` |
| `Tax-Advisory.php` | `/tax-advisory` |
| `Business-Advisory.php` | `/business-advisory` |
| `Customs-Clearing-Forwarding.php` | `/customs-clearing-forwarding` |
| `Warehousing-Services.php` | `/warehousing-services` |
| `Transport-Logistics.php` | `/transport-logistics` |
| `Training.php` | `/training` |
| `sucess.php` | `/sucess` |
| `404.php` | Next.js `not-found` |

## Bug fixes applied during the port

The following genuine bugs from the original were fixed (design/styling
untouched):

- **"Get a Quote"** button pointed to the non-existent `request-quote.php`; it
  now links to `/contact`.
- **Page titles**: `ndustries We Serve` → `Industries We Serve`; the Transport &
  Logistics page was titled "Company History" → now "Transport & Logistics".
- **Contact page**: the phone block was mislabelled "Email Address" → now "Phone
  Number"; placeholder/fake `tel:` numbers replaced with the real
  `tel:+250788221231`; removed an empty `mailto:` link and a stray `</a>`; the
  duplicate identical phone line was collapsed to one.
- **Footer / 404**: `mialto:` typo → `mailto:`; footer phone `href="+250…"` was
  missing its `tel:` scheme → `href="tel:+250788221231"`.

Forms still post to Formspree exactly as before.
