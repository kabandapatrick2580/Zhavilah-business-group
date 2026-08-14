# CMS Implementation — ZHAVILAH BUSINESS GROUP Ltd

Reference document and running checklist for delivering §2.2 (Content Management
System) of the Software Development Freelance Agreement, plus the remaining
open items from §2.1, §2.4 and §2.5.

**Last updated:** 2026-08-14

---

## Current status — start here

**Phase 1 is code-complete apart from webhook revalidation. Nothing is deployed,
and the work is not yet committed.**

| | State |
| --- | --- |
| Phase 0 (Sanity project) | **Not started — blocks everything below** |
| Phase 1 (blog, banners, gallery) | Built and verified locally |
| Phase 2 (services, training, pages) | Not started; needs scope sign-off first |
| Phase 3 (SEO, security, backups, handover) | Not started |
| Production site | Still serving the previous build |
| Git | Changes uncommitted, on `main` |

### The blocker

Every CMS-driven surface currently renders its **code fallback**, because no
Sanity project exists yet. The site is fully intact and the blog is built, but
nothing can be demonstrated as *actually CMS-driven* until Phase 0 is done — and
Phase 0 needs the Client, since the account must be created in their name.

### Next action

1. Create the Sanity project in the Client's name → fill `.env.local` and
   `studio/.env`.
2. `cd studio && npm run deploy` to publish the Studio.
3. Add a banner, a gallery image and a blog post; confirm they replace the
   fallbacks.
4. Then present for the 30% milestone review.

### Verified locally (2026-08-14)

- `npm run build` passes; all 20 routes generate.
- `/`, `/blog`, `/gallery`, `/contact` all return 200.
- With an empty CMS, the hero and gallery render exactly the markup they did
  before the migration — five headline tokens plus the blue `<em>`, the original
  photograph, and all five gallery images.
- Unknown blog slugs 404 correctly.
- Studio typechecks and `sanity build` succeeds, validating the schema graph.

---

## 1. Decision record

**Chosen: Sanity (Free plan), with the Studio deployed separately to
`*.sanity.studio` rather than embedded in the Next.js app.**

### Why

| Criterion | Outcome |
| --- | --- |
| Stack disruption | Minimal — the Next app gains three small client libraries, and one `images.remotePatterns` entry in `next.config.js`. No route added to `app/`, no database, no object storage, no auth code. |
| Cost | **RWF 0 / month**, indefinitely. See quota table below. |
| Reliability | Content is fetched at build/ISR, so the public site is static HTML on Vercel's edge. If Sanity goes down, the website stays up. |
| Editor experience | Hosted Studio, email/Google login, image cropping, rich text. Lowest training burden for §2.5 and fewest support calls during the §11 warranty period. |
| Handover (§9) | Schemas live in this repo. Content is exportable via `sanity dataset export`. |

### Free plan quotas (verified 2026-08-12)

| Quota | Free plan | This project's need |
| --- | --- | --- |
| User seats | 20 | 2 |
| Permission roles | **2 — Administrator + Viewer only** | See constraint below |
| Datasets | 2 (**public only**) | 1 |
| Documents | 10,000 | < 200 |
| Asset storage | 100 GB | < 1 GB |
| Bandwidth | 100 GB / month | Negligible |
| API CDN requests | 1M / month | Negligible |
| API requests | 250k / month | Negligible |
| Webhooks | 2 | 1 (revalidation) |

**The one constraint:** the Free plan provides only *Administrator* and
*Viewer* (read-only). The *Editor* role — edit and publish, but no project
administration — requires the **Growth** plan at **$15/seat/month**.

Two seats on Growth is $360/year, roughly **1.8× the entire RWF 290,000 CMS fee,
recurring annually**. Under §12 that cost falls to the Client.

**Resolution:** both editors are provisioned as **Administrators** on the Free
plan. §2.2 requires the CMS to allow *"authorized administrators"* to manage
content — it does not mandate tiered permissions, and no such requirement was
raised by the Client. Privilege separation was an internal assumption and has
been dropped.

**Caveat to verify before go-live:** Free datasets are public-read. Confirm how
unpublished drafts behave under unauthenticated API access before advising the
Client that draft content is private. All published content on this site is
public by design, so the practical exposure is limited to work-in-progress.

### Options considered and rejected

| Option | Why not |
| --- | --- |
| **Payload 3 + Postgres** | Strong fit, and the right answer *if* tiered roles were required (roles are free, unlimited TypeScript access-control functions). Rejected here because it wraps `next.config.js`, claims a route group in `app/`, and adds Postgres + object storage — three free tiers to monitor during the warranty month — for a benefit no longer needed. |
| **Prisma + custom admin** | Prisma is an ORM, not a CMS. Choosing it means hand-building auth, CRUD UI, media pipeline, rich-text editing and sanitisation, and backups: ~12–16 days against a RWF 290,000 line item. Revisit only if this becomes a reusable product sold to multiple clients — §9 expressly preserves the right to reuse such tooling. |
| **Keystone 6** | The Prisma-native CMS, if the Prisma route is ever taken. Needs a persistent Node host (not Vercel serverless) and its development pace has slowed. |
| **Keystatic** | Genuinely $0 with git-as-backup, but client-facing use requires editors to hold GitHub accounts, and it has no meaningful role model. Poor fit for non-technical staff. |
| **WordPress headless** | Second runtime, PHP hosting cost, largest security-maintenance surface. Conflicts directly with §2.4 and §11 obligations. |

---

## 2. Architecture

```
Sanity Content Lake  ──(GROQ, build + ISR)──▶  Next.js on Vercel  ──▶  static HTML at the edge
        ▲
        │ edits
Sanity Studio (deployed to *.sanity.studio — NOT mounted in this app)
```

**The rule that protects the stack:** content is fetched during
build/revalidation, never client-side. The public site remains static and fast,
and has no runtime dependency on Sanity's availability.

### Layout in this repo

| Path | Purpose |
| --- | --- |
| `studio/` | **A separate npm project** with its own `package.json` and `node_modules`. Deploys to Sanity's hosting, not Vercel. |
| `studio/schemaTypes/` | Document schemas — the source of truth for §2.2. |
| `studio/sanity.config.ts` | Studio configuration and sidebar structure. |
| `lib/sanity/client.ts` | Configured read client. |
| `lib/sanity/queries.ts` | GROQ queries, one per view. |
| `lib/sanity/types.ts` | Result types, written by hand. |
| `lib/sanity/image.ts` | Image URL builder. |
| `components/blog/PortableBody.tsx` | Rich-text renderer. |

### Dependency decisions made during implementation

Both were forced by version constraints, and both turned out to be structurally
better than the obvious approach:

**1. `@sanity/client` rather than `next-sanity`.**
`next-sanity@13` peer-depends on `next@^16`; this project runs Next 15.5.23.
Rather than forcing the resolution, the app uses `@sanity/client`,
`@sanity/image-url` and `@portabletext/react` directly. None of them peer-depend
on Next at all, so the CMS layer is now completely decoupled from the Next major
version and a future Next upgrade cannot break it.

**2. The Studio is a separate npm project, not a route in this app.**
`sanity@6` requires `react@^19.2.2`; the site runs React 19.1.0. Bumping the
site's React to satisfy a tool that deploys elsewhere would have put the whole
website at risk for no benefit. `studio/` therefore has its own dependency tree.
Consequences: the Studio's dependencies can never conflict with the website's,
the Studio cannot break the site's build, and `tsconfig.json` excludes `studio`
so the site's typecheck ignores it.

The trade-off is that `lib/sanity/types.ts` mirrors the schemas by hand rather
than generating from them. Keep the two in step when a schema field changes.

### Migration pattern — CMS content with a code fallback

The site is already live, so every migrated page keeps its original hardcoded
content as a fallback and uses it whenever the CMS returns nothing:

```
const images = fromCms.length > 0 ? fromCms : FALLBACK_IMAGES;
```

Without this, deploying the CMS would blank the live gallery and hero until the
Client had populated Sanity. Apply the same pattern to services, training and
page copy in Phase 2 — and only remove a fallback once the corresponding content
is published and verified.

Verified for the hero and gallery: with an empty CMS, both render exactly the
markup they did before the migration.

### How the homepage banner works

The hero is a single band, not a carousel. `getBanners()` returns active banners
in sort order and **the first one is the one displayed** — editors reorder to
swap which banner is live, and can keep others staged behind it.

Individual fields fall back independently, so a half-completed banner degrades
to the default rather than breaking the page.

**Editor detail worth covering in §2.5 training:** wrapping a phrase in
`*asterisks*` inside the headline renders it in blue, and that phrase animates
as one unit. The default headline is
`Build a stronger business with *trusted expertise.*`

### Known issue — inherited npm vulnerabilities

`npm audit` reports 3 high-severity advisories in `postcss` and `sharp`. Both
are transitive dependencies **of Next.js itself**, not of anything added for the
CMS. The only clean fix is Next 16, a breaking major upgrade.

Not addressed in this phase. Practical exposure on a statically generated
marketing site is low — the postcss advisories affect build-time CSS processing,
and Vercel runs its own image pipeline in production. Raise it with the Client as
a §2.6 maintenance item, or schedule the Next 16 upgrade as a §7 Change Request.

---

## 3. Schema — mapping §2.2 to documents

§2.2 requires administrators to manage: website pages, services, training
programs, blog posts, gallery, homepage banners.

| Document | §2.2 item | Replaces (current hardcoded source) |
| --- | --- | --- |
| `siteSettings` (singleton) | — | `CONTACT`, `SOCIALS` in `lib/site.ts` |
| `banner` | Homepage banners | Hero block in `components/HomePage.tsx` |
| `service` | Services | `SERVICES` in `lib/site.ts` + 8 service page bodies |
| `trainingModule` | Training programs | `modules` in `app/training/page.tsx` |
| `post` | Blog posts | **New — no blog exists today** |
| `galleryImage` | Gallery | `images` in `app/gallery/page.tsx` |
| `page` | Website pages | About / Company History / Industries body copy |

### Scope boundary — read this before building `page`

**"Manage website pages" is implemented as: edit the text and images of
existing pages. Page layout remains in code.**

The alternative reading — a drag-and-drop block builder that composes arbitrary
new pages — is 3–4× the work and is not a RWF 290,000 feature. The service pages
are bespoke layouts assembled from `components/services/ServiceHistory.tsx`,
`components/ui/Faq.tsx` and per-page icon sets; decomposing those into
CMS-editable blocks is a project in itself.

**Action:** get this interpretation confirmed in writing before Phase 2 begins.
§8 deems a deliverable accepted after five business days of silence, which cuts
both ways. If the Client wants the page builder, raise it as a §7 Change
Request with revised timeline and fee.

---

## 4. Implementation checklist

### Phase 0 — Sanity project setup (requires Client account)

- [ ] Create the Sanity project **in the Client's name** — the account must be
      owned by the Client, not the Freelancer (§9 transfers ownership).
- [ ] Create the `production` dataset.
- [ ] Copy project ID and dataset into `.env.local` (see `.env.example`).
- [ ] Invite both editors as **Administrators**.
- [ ] Add the same env vars to the Vercel project settings.
- [ ] `npx sanity deploy` — publishes the Studio to `*.sanity.studio`.

### Phase 1 — unlocks the 30% milestone (RWF 195,000)

Target: a working system to present for review under §5.

- [x] Install dependencies.
- [x] Sanity client, image builder, GROQ queries, result types.
- [x] Schemas for all seven documents.
- [x] Studio configuration (`sanity.config.ts`, `sanity.cli.ts`).
- [x] Blog index at `/blog`.
- [x] Blog detail at `/blog/[slug]`.
- [x] Portable Text renderer.
- [x] Blog entry added to primary navigation.
- [x] Homepage banners read from `banner`.
- [x] Gallery reads from `galleryImage`.
- [ ] Webhook-driven revalidation for instant updates (see note below).
- [ ] **Present for review → invoice 30%.**

Pages that read from the CMS are set to `revalidate = 60`, so published edits
already appear within a minute with no redeploy. A Sanity webhook pointed at a
revalidation route would make that instant; it is a refinement, not a blocker
for the review.

### Phase 2 — content migration

- [ ] Migrate the 8 services into `service` documents.
- [ ] Migrate training modules into `trainingModule` documents.
- [ ] Migrate About / Company History / Industries copy into `page` documents.
- [ ] Move contact details and socials into `siteSettings`.
- [ ] Confirm the §3 scope boundary above is signed off before starting.

### Phase 3 — unlocks the final 20% (RWF 130,000)

Closes the remaining non-CMS contract items.

**§2.1 Basic SEO** — currently incomplete:
- [ ] `app/robots.ts` — `robots.txt` currently returns 404.
- [ ] `app/sitemap.ts` — `sitemap.xml` currently returns 404; must include blog posts.
- [ ] LocalBusiness JSON-LD structured data.
- [x] Fix `metadata.title.template` in `app/layout.tsx` — was `"%s"`, which does nothing.

**§2.1 other:**
- [ ] Fix the WhatsApp link in `lib/site.ts` — `web.whatsapp.com/send` fails on
      mobile; use `wa.me`.
- [ ] Decide whether the contact form stays on Formspree (third-party free tier,
      submission caps, Client-borne under §12) or moves to a Sanity-backed
      inbox with Zoho SMTP notification.

**§2.4 Deployment & Security** — partially complete:
- [x] Production deployment (Vercel).
- [x] Domain and DNS configured.
- [x] SSL certificate (valid; HSTS present via Vercel).
- [ ] Security headers in `next.config.js` — CSP, X-Frame-Options,
      X-Content-Type-Options, Referrer-Policy, Permissions-Policy. **None are
      currently set.**
- [ ] Routine backup procedure: scheduled `sanity dataset export`, with a
      **tested** restore documented. Repo itself is backed by git.

**§2.5 Training & Handover:**
- [ ] CMS administrator training session.
- [ ] Written CMS guide for the Client's editors.
- [ ] Email management guidance (see §5 below).
- [ ] Formal handover: transfer Sanity account ownership, hand over a dataset
      export, confirm Vercel and DNS access.
- [ ] Start the one-month post-deployment support window (§2.5) and the
      thirty-day warranty (§11).

---

## 5. Status of non-CMS contract items

Verified against the live site and DNS on 2026-08-12.

### §2.1 Website pages

| Page | Status |
| --- | --- |
| Home | Complete |
| About | Complete (plus `/company-history`) |
| Services | Complete — 8 service pages |
| Training | Complete |
| **Blog** | **Built in Phase 1 — did not exist** |
| Contact | Complete |

Delivered beyond scope: Gallery, Industries, cookie consent, QuickBooks page.

### §2.3 Professional Email — substantially complete

- DNS configured — Zoho Mail (`mx.zoho.com`, `mx2`, `mx3`).
- SPF present: `v=spf1 include:zohomail.com include:spf.efwd.registrar-servers.com ~all`
- DKIM present: `zmail._domainkey` resolves.
- Webmail: Zoho.

Remaining:
- [ ] Confirm all **four** mailboxes are provisioned per §2.3.
- [ ] Write the basic email configuration guidance (§2.3, §2.5).
- [ ] Optional, not contracted: add a DMARC record. `_dmarc` does not currently
      resolve, leaving the SPF/DKIM/DMARC trio incomplete for deliverability.

---

## 6. Handover notes (§9)

Record these in the final handover document:

1. **The Sanity account must be owned by the Client.** Ownership of deliverables
   transfers on full payment; that has to include the content, not just the code.
2. **Hand over a dataset export** so the Client holds a copy independent of the
   SaaS.
3. **State the Free plan ceiling in writing.** If the Client ever wants a
   restricted, non-administrator editor, that is Growth at $15/seat/month. Better
   disclosed now than discovered in year two.
4. **Third-party costs are the Client's under §12** — domain, hosting, email
   subscriptions, and any future Sanity plan upgrade.
5. Backup and restore procedure, with the date it was last tested.

---

## 7. Commands

The website and the Studio are **separate npm projects**. Run each from its own
directory — the `sanity` CLI is not installed at the repo root and these
commands will not work from there.

### Website (repo root)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — run before every deploy
npm start        # serve the production build locally
```

### Studio (`studio/`)

```bash
cd studio
npm install
npm run dev      # Studio at http://localhost:3333
npm run deploy   # publish to https://<name>.sanity.studio
npm run export   # content backup → §2.4 routine backup procedure
```

### Stopping a stray dev server

```bash
pkill -f "next dev"
```

Note that `pkill -f "next-server"` also matches the dev server; use the exact
pattern above to avoid killing more than intended.
