# Contact & Subscribe Forms — Implementation

Reference document for the contact form, the footer subscribe form, and the bot
protection in front of both. Closes the §2.1 open item "decide whether the
contact form stays on Formspree" recorded in `CMS-IMPLEMENTATION.md`.

**Last updated:** 2026-08-14

---

## Current status — start here

**Code-complete and verified locally. Nothing is deployed, and submissions do
not yet reach anybody.**

| | State |
| --- | --- |
| Form UI, validation, states | Built and verified |
| API routes (`/api/contact`, `/api/subscribe`) | Built and verified |
| Bot protection (Turnstile, honeypot, timing, rate limit) | Built and verified |
| Resend account + domain verification | **Not started — blocks delivery** |
| Cloudflare Turnstile keys | **Not started — protection fails open** |
| Git | Changes uncommitted, on `main` |

### The blockers

Two pieces of external setup, both requiring accounts in the Client's name:

1. **Resend is unconfigured.** Every submission returns HTTP 502 with a
   "try again, or email us directly" message. The form works end to end right up
   to the point of sending.
2. **Turnstile is unconfigured.** Both routes **fail open** when
   `TURNSTILE_SECRET_KEY` is absent — they accept the submission and log
   `[turnstile] … DISABLED` instead of blocking. A deploy that forgets the secret
   is silently unprotected.

### Next action

1. Create the Resend account in the Client's name; add
   `zhavilahbusinessgroup.com`; publish the DNS records it issues; wait for
   verification. **This is the long pole** — see the Zoho interaction note below.
2. Create a free Cloudflare Turnstile site key (Cloudflare hosting not required).
3. Fill all five variables in `.env.local` and in the Vercel project settings.
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is build-time, so Vercel needs a redeploy.
4. Submit the live form once; confirm arrival in `info@zhavilahbusinessgroup.com`.
5. Grep the deploy logs for `[turnstile]` and confirm `DISABLED` is **absent**.

### DNS interaction with Zoho (§2.3) — read before step 1

The domain already carries Zoho Mail's SPF and DKIM for the mailboxes. Resend
sends from a **subdomain** (e.g. `send.zhavilahbusinessgroup.com`) with its own
SPF and DKIM records, so the root SPF record stays untouched and the existing
Zoho setup is unaffected. Do not add a Resend `include:` to the root SPF — that
record already has two includes and SPF permits only ten DNS lookups in total.

---

## 1. Decision record

**Chosen: Next.js route handlers sending through Resend.**

Superseded the previous arrangement, in which both forms did a plain HTML POST
directly to Formspree.

### Why the previous setup had to go

| Problem | Detail |
| --- | --- |
| Endpoints were almost certainly wrong | Contact posted to `xwplbgjj`, the footer to `xwplbggj` — the same eight characters with two transposed. Formspree issues one ID per form, so at most one was real. **Historic submissions may never have arrived anywhere.** |
| `/sucess` was dead code | No `_next` field was set, so Formspree's own thank-you page was shown instead of the site's. |
| No feedback | No loading state, no error path, no validation beyond the browser's `required`. A slow network looked like a dead button. |
| No spam protection | No honeypot, no captcha, no rate limit. |
| Submission cap | Formspree's free tier allows 50 submissions/month. |

### Options considered

| Option | Outcome |
| --- | --- |
| **Route handler + Resend** | **Chosen.** Full control, no third-party branding, 3,000 emails/month free, submissions can later be stored or forwarded elsewhere. Costs one account and DNS verification. |
| Keep Formspree | Fastest, no DNS work — but the 50/month cap, a third party reading every message, and their reply-to flow. |
| Route handler + Zoho SMTP | No new vendor, reuses the §2.3 mailbox. Rejected: needs the mailbox password in env, and shared-host SMTP is commonly rate-limited or spam-flagged. |
| Sanity-backed inbox | The alternative floated in `CMS-IMPLEMENTATION.md`. Rejected: enquiries in a CMS dataset are harder to reply to than email, and it makes the contact form depend on the Phase 0 blocker. |

---

## 2. Architecture

| Path | Purpose |
| --- | --- |
| `lib/contact.ts` | Field types, validation, dropdown option lists, honeypot name, timing check. Imported by both client and server so the rules cannot drift. |
| `lib/mail.ts` | Resend REST call and HTML escaping. |
| `lib/turnstile.ts` | Cloudflare `siteverify` call. |
| `lib/rate-limit.ts` | In-memory fixed-window limiter. |
| `app/api/contact/route.ts` | Contact endpoint. |
| `app/api/subscribe/route.ts` | Footer subscribe endpoint. |
| `components/contact/ContactForm.tsx` | The contact form. |
| `components/SubscribeForm.tsx` | The footer subscribe form. |
| `components/Turnstile.tsx` | Shared widget, explicit render, script loaded on demand. |

### Request pipeline

Both routes apply the same checks in this order. Order matters: the cheap local
checks run before the two network calls.

1. **Rate limit** — 5 requests per IP per 10 minutes.
2. **Parse** — malformed JSON rejected.
3. **Honeypot** — a filled `company_website` returns `200 {ok:true}` and drops
   the submission, so a bot gets no signal to adapt to.
4. **Validation** — see below.
5. **Timing** — rejects submissions arriving implausibly fast.
6. **Turnstile** — rejects unverified tokens.
7. **Send** — via Resend.

### Validation

Runs on the client for speed and again on the server for trust; the server is
the only one that counts, since the endpoint is public and accepts hand-crafted
JSON.

- `name`, `message` — length bounds.
- `email` — deliberately permissive pattern. Rejecting whitespace also closes
  CRLF header injection into `reply_to`.
- `phone` — asserts "enough digits to be a phone number" and allows the
  punctuation people type. International and landline numbers are normal here.
- `subject`, `service` — checked for **membership of their lists**, not length.
  `subject` feeds the email subject line, so accepting an off-list value would
  let a crafted POST write arbitrary text into inbox headers.

### The two dropdowns

`subject` is a fixed list of nine enquiry types, ordered by how commonly they
arrive, ending in "Something else" — a list that cannot express the visitor's
reason is worse than no list.

`service` is **derived from `SERVICES` in `lib/site.ts`**, not retyped. A service
added to the site navigation appears in the form automatically. It ends with
"Not sure yet — please advise", because a visitor who already knew which service
they needed often would not be writing in.

The email subject line is `{enquiry} — {service}`, so the inbox can be triaged
and filtered without opening anything.

---

## 3. Bot protection

### Layers and what each is actually worth

| Layer | Stops | Does not stop |
| --- | --- | --- |
| **Turnstile** | Scripted clients — a token must be issued by Cloudflare and cannot be forged | Human-driven abuse |
| Honeypot | Bots that fill every field of a scraped form | Anything POSTing JSON directly — it just omits the field |
| Timing check | Naive bots that submit the instant they parse the page | Anything that waits, or forges the timestamp |
| Rate limit | One script hammering one warm instance | Rotating IPs, cold starts, parallel instances |

**Turnstile is the load-bearing layer.** The honeypot defends a rendered HTML
form and does nothing for a JSON API whose shape is visible in the browser's
network tab; the timing value is client-supplied and therefore forgeable. Both
are cheap extras that catch different naive populations, not defences in
themselves.

### Blast radius, if all of it were defeated

`CONTACT_TO_EMAIL` is read server-side from the environment, so the recipient
cannot be influenced by the request. **The site cannot be turned into an open
relay** — the worst case is the Client's own inbox filling with junk, not
outbound spam and a burned domain reputation. The practical cost of abuse is
Resend quota: exhausting the 3,000/month free tier would make genuine enquiries
start failing.

### Deliberate behaviours worth knowing

- **Fail open on missing config.** Both Resend and Turnstile keep the site
  working when unconfigured, matching each other, so setup order never breaks the
  live form. The cost is the silent-exposure risk in "Blockers" above.
- **Cloudflare unreachable is allowed through.** Distinguished from "rejected" in
  `verifyTurnstile`. An outage at Cloudflare must not take the contact form down;
  the other three layers still apply.
- **The widget resets after every attempt, including failures.** Turnstile tokens
  are single-use and consumed by verification. Without the reset the form would
  work once and then refuse — a hard-to-reproduce bug.
- **`refresh-expired: auto`.** Tokens expire in about five minutes. A visitor who
  opens the page, is distracted, then submits would otherwise be told they failed
  a check they had passed.
- **Too-fast returns a retryable 400, not a silent 200.** If a real person ever
  trips it, resubmitting a moment later works; pretending to accept would lose
  their message. A bot pays the delay either way.
- **Timing thresholds differ per form** — 3s contact, 1.2s subscribe. A single
  email box is legitimately filled in under three seconds by someone pasting and
  clicking.
- **The footer widget mounts on first focus.** That form is on every page;
  loading Cloudflare's script everywhere to guard a field most visitors never
  touch is not a good trade.

### Known weaknesses, accepted for now

- The rate limiter is **in-memory and per serverless instance**, so it resets on
  cold start and the real ceiling is roughly 5 × warm instances. IP rotation
  defeats it. It is there to blunt bursts, not to guarantee a cap. Upgrade path:
  Vercel KV or Upstash.
- 5-per-10-minutes is per IP, and visitors behind carrier-grade NAT — common on
  Rwandan mobile networks — share one. Three colleagues in one office submitting
  in quick succession could see the third blocked.
- The rate limiter runs in dev too, but Next's dev server re-evaluates route
  modules per request, so the counter resets and the limit never trips under
  `npm run dev`. Test it against `npm run build && npm start`.

---

## 4. Environment variables

All five are absent by default; see `.env.example` for the annotated copy.

| Variable | Scope | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | server | From resend.com/api-keys. |
| `CONTACT_FROM_EMAIL` | server | Must be on a Resend-verified domain. Envelope sender, **not** a reply target. |
| `CONTACT_TO_EMAIL` | server | The inbox receiving enquiries. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | client, **build-time** | Public. Vercel needs a redeploy after changing it. |
| `TURNSTILE_SECRET_KEY` | server | Secret. Absent ⇒ verification skipped. |

Cloudflare's always-passes test pair, useful locally:
site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.
The always-fails secret is `2x0000000000000000000000000000000AA`.

---

## 5. Verified locally (2026-08-14)

`npx tsc --noEmit` and `npm run build` both pass; all 22 routes generate, with
`/api/contact` and `/api/subscribe` registered as dynamic.

Tested against `npm start` (a production build — see the dev-mode caveat above),
using Cloudflare's documented test keys. The `invalid-input-response` error
returned in the logs confirms real round trips to `siteverify`, not a stub.

| Case | Expected | Result |
| --- | --- | --- |
| Valid submission, no Resend key | reaches send, fails there | 502 ✓ |
| Invalid fields | per-field errors | 400 ✓ |
| Malformed JSON | rejected | 400 ✓ |
| Honeypot filled | silently dropped | 200 `{ok:true}` ✓ |
| 6th request in window | blocked | 429 + `retry-after: 288` ✓ |
| Both dropdowns empty | each named separately | 400 ✓ |
| Off-list dropdown values (`Injected <b>subject</b>`, `Fake service`) | rejected | 400 ✓ |
| Valid + token + 8s dwell | passes every check | 502 at send ✓ |
| Submitted instantly | too quick | 400 ✓ |
| `renderedAt` omitted | too quick | 400 ✓ |
| Token omitted, secret set | blocked | 403 ✓ |
| Token Cloudflare rejects — contact | blocked | 403 ✓ |
| Token Cloudflare rejects — subscribe | blocked | 403 ✓ |
| No secret configured | fails open, warns | 502 + `DISABLED` warning ✓ |

Rendered page: both `<select>` elements present with all nine enquiry types and
all eight services plus the fallback; honeypot present and hidden; the Turnstile
site key and script URL inlined into the client chunk; the Cloudflare script
**absent** from the initial homepage HTML, confirming the footer widget is lazy.
No Formspree reference remains anywhere in `app/`, `components/` or `lib/`.

### Not verified

- **The Turnstile widget has not been seen rendering in a real browser.** The
  markup, bundle contents and explicit-render wiring were checked, but the visual
  "does the challenge actually appear" step was not — the browser tooling was
  unavailable. Check this once real keys exist.
- The styled `<select>` uses `appearance-none` with a custom chevron. Verified
  functionally, not visually; worth a look on mobile Safari, which is fussiest
  about select styling.
- No email has been delivered end to end, because Resend is unconfigured.

---

## 6. Follow-ups

- [ ] `/sucess` (note the spelling) is now **orphaned** — success renders inline
      in the form. Delete the route, or fix the spelling and keep it as a
      no-JavaScript fallback. Left in place pending a check for inbound links.
      It is still listed in the README's route map.
- [ ] Check the Formspree account for a backlog of enquiries that arrived before
      this change, and for any that never arrived at all.
- [ ] Consider moving the rate limiter to Vercel KV if abuse appears.
- [ ] A Content-Security-Policy is still unset (`CMS-IMPLEMENTATION.md` §2.4).
      When one is added it must allow `challenges.cloudflare.com` for both
      `script-src` and `frame-src`, or Turnstile will silently stop rendering.
