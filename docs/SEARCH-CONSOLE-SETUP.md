# Search engine setup — sitemap, Google Search Console, Bing Webmaster Tools

The site already generates both files you need:

| URL | Source | Notes |
|---|---|---|
| `https://zhavilahbusinessgroup.com/sitemap.xml` | `app/sitemap.ts` | Public pages plus every blog post from Sanity. Refreshes hourly. |
| `https://zhavilahbusinessgroup.com/robots.txt` | `app/robots.ts` | Allows everything except `/admin`, `/api/`, `/sucess`; points to the sitemap. |

Left out of the sitemap on purpose: `/company-history` (still placeholder text — add it to
`PAGES` in `app/sitemap.ts` once it has real content), the admin area, and the post-submit page.

Each page's canonical URL is now its own address (previously every page claimed the homepage).

## Before you start

1. **Deploy first.** Both tools fetch the live site, so these changes must be on
   `https://zhavilahbusinessgroup.com`.
2. Open `https://zhavilahbusinessgroup.com/sitemap.xml` and `/robots.txt` in a browser and
   confirm they load.
3. Decide how you'll prove ownership. **DNS verification is the better choice**: it covers
   the whole domain, survives redeploys, and needs no code. The HTML-tag route below is the
   fallback if you can't edit DNS.

## Google Search Console

1. Go to <https://search.google.com/search-console> and sign in with the Google account that
   should own the site's search data (use a shared company account, not a personal one).
2. **Add property → Domain** and enter `zhavilahbusinessgroup.com`.
3. Google shows a `TXT` record. Add it at your DNS provider (wherever the domain is
   registered or its nameservers point), then click **Verify**. DNS can take a few minutes
   to a few hours.
   - *Can't edit DNS?* Choose **URL prefix** instead → `https://zhavilahbusinessgroup.com`
     → **HTML tag**. Copy only the `content="…"` value, set it as
     `GOOGLE_SITE_VERIFICATION` in Vercel → Project → Settings → Environment Variables,
     redeploy, then click **Verify**.
4. **Sitemaps** (left menu) → enter `sitemap.xml` → **Submit**. Status should read
   *Success* and show the discovered page count.
5. **URL inspection** → paste the homepage URL → **Request indexing**. Repeat for the main
   service pages. This speeds up first crawl; it doesn't guarantee ranking.
6. Check **Pages** after a few days for anything under "Not indexed" and read the reason.

## Bing Webmaster Tools

1. Go to <https://www.bing.com/webmasters> and sign in (Microsoft, Google or Facebook account).
2. **Easiest:** choose **Import from Google Search Console**. Authorise, pick the site, and
   Bing copies the property *and* the sitemap. Skip to step 5.
3. **Otherwise:** **Add a site** → enter `https://zhavilahbusinessgroup.com`.
4. Verify with one of:
   - **HTML Meta Tag** — copy the `content` value of `msvalidate.01`, set it as
     `BING_SITE_VERIFICATION` in Vercel, redeploy, click **Verify**; or
   - **CNAME / DNS record** — add the record Bing shows, click **Verify**.
5. **Sitemaps** → **Submit sitemap** → `https://zhavilahbusinessgroup.com/sitemap.xml`.
6. Optional: **URL Submission** lets you push new URLs directly.

Bing's index also feeds DuckDuckGo, Yahoo and several AI search tools, so it's worth the ten minutes.

## Google Cloud Console is a different product

If "cloud console" meant **Google Cloud Console** (console.cloud.google.com): you don't need it
to get indexed. It's for Google Cloud services and API keys. Search presence is handled entirely
by **Search Console** above. Only touch Cloud Console if you later add something like the Maps
API or Google sign-in.

## After setup

- Publish a Sanity article → it appears in the sitemap within the hour.
- Add a page → add its path to `PAGES` in `app/sitemap.ts`.
- Revisit Search Console's **Pages** and Bing's **Site Explorer** after about a week.
- Also worth doing: claim the **Google Business Profile** for the Kigali office — it drives
  local results far more than the sitemap does.
