# Training dashboard — how it works and how to run it

An admin area at `/admin` for the training catalogue: the syllabus modules shown
under **Training Contents** on `/training`, and the dated **intakes** people
apply to. Both are stored in one JSON file that the dashboard writes and the
public page reads.

**Last updated:** 2026-08-27
**Status:** built and verified end to end locally. One deployment decision is
outstanding — see §6.

---

## 1. What it does

| Capability | Where |
| --- | --- |
| Sign in with credentials from the environment | `/admin/login` |
| See what is live, at a glance | `/admin` |
| Add, **edit**, remove and reorder syllabus modules | `/admin/modules` |
| Create, **edit**, publish, hide and remove intakes | `/admin/intakes` |
| Announce the next intake with a live countdown and an application button | `/training` |

The announcement panel has three states, and moves between them on its own
without a page reload:

- **Before applications open** — counts down to the opening moment; the button
  is replaced by the sentence *"Applications open 15 September 2026"*, because a
  dead button invites the click that sentence answers.
- **While applications are open** — counts down to the deadline (or, if none was
  set, to the first day of class) and shows a live **Apply now** button pointing
  at the third-party form, `target="_blank" rel="noopener noreferrer"`.
- **After the deadline** — the panel removes itself, and the intake stops being
  featured.

Editing happens **inline**: the row swaps in place for a form prefilled with
everything the record holds, and the rest of the list stays on screen. Most
edits to a syllabus are made by comparing a module against its neighbours, and a
full-page editor loses that context.

One form serves both adding and editing (`ModuleForm`, `IntakeForm`), and one
validator serves both actions (`readModuleFields`, `readIntakeFields`). That is
not only less code — it is what stops a field from quietly becoming create-only,
which is the usual failure of a separately written editor. An edit is held to
exactly the rules a new record was: the date ordering, the URL scheme check, the
title length.

Two details worth knowing:

- **The id never changes on edit.** It is the only stable handle a row has, and
  regenerating it from a new title would break an edit submitted from a second
  tab still holding the old one.
- **`createdAt` is carried over, not refreshed.** It records when the intake was
  first announced, which is not what an edit changes.

---

## 2. Setup

Three environment variables, documented in `.env.example`:

```bash
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=      # node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

`.env.local` already has a generated `ADMIN_SESSION_SECRET`; fill in the
username and password and restart. The same three must be set in the host's
project settings before `/admin` works in production.

**If any of the three is missing the dashboard is switched off** — the login
page says so and every attempt fails. This is deliberate. An admin area that
falls back to a blank password when the environment is missing is worse than one
that is unreachable.

---

## 3. Where the data lives

`data/training.json`, committed to the repository — the seed, and the live
store in local development. In production the same JSON lives in Vercel Blob;
see §6.

```json
{
  "modules": [ { "id": "...", "title": "...", "icon": "book", "items": ["..."] } ],
  "intakes": [ { "id": "...", "opensAt": "...", "applicationUrl": "https://…", "published": true } ]
}
```

It is seeded with the three modules that were previously hard-coded in
`app/training/page.tsx` — Applied Business Accounting, Taxation and QuickBooks
Training, with all 36 topics — so the page renders identically to before.

Reads and writes go through `lib/training/store.ts` and nothing else. Writes go
to a temp file and are renamed into place, so an interrupted write leaves the
previous file intact rather than a truncated one. A file that is corrupt or
partly malformed loses the bad records and keeps the rest (`parseTrainingData`)
rather than taking `/training` down.

`icon` is a **name**, not a component — a Server Component cannot hand a
component to the client. The names come from `components/services/serviceIcons.tsx`,
which the service pages already use.

### Dates

All three intake dates are stored as UTC instants and entered and displayed as
Kigali time. Rwanda is UTC+02:00 year-round with no daylight saving, so the
fixed offset in `lib/training/dates.ts` is exact rather than an approximation.
This is what makes `<input type="datetime-local">` safe: that control submits a
wall-clock string with no zone attached, which would otherwise mean different
instants on a laptop in Kigali and a server in Virginia.

---

## 4. Authentication

One account, no user table, because there is no second user.

The session is a cookie carrying a payload and an HMAC signature over it — no
server-side session store, so the cookie verifies itself. `httpOnly`, `secure`
in production, `SameSite=Lax`, eight-hour lifetime. Rotating
`ADMIN_SESSION_SECRET` logs everyone out.

Credential comparison is constant-time over keyed digests of both sides, so
neither the length nor the prefix of the real values leaks through timing. The
failure message is the same whether the username or the password was wrong.

Three layers, because each protects against a different mistake:

1. `app/admin/(dashboard)/layout.tsx` redirects an unauthenticated visitor.
2. **Every Server Action re-checks independently.** A Server Action is a public
   POST endpoint with a generated name; being unreachable from the UI is not
   protection. This is the same reasoning as `app/api/contact/route.ts`
   re-validating what the contact form already validated.
3. `safeUrl()` accepts only absolute `http(s)` URLs for the application link.
   That value is rendered into an `href` on a public page, so `javascript:` has
   to be rejected on the way in, not filtered on the way out.

Login is rate-limited to five attempts per fifteen minutes through the existing
`lib/rate-limit.ts`. The caveat that module documents applies — it is
per-instance, so a flood spread across cold starts gets through. It guards one
password rather than a user table, and it is worth the four lines, but it is
**not** the shared-store limiter that `TRAINING-SYSTEM.md` §6 says a real
authenticated portal needs.

---

## 5. Caching

`/training` is statically rendered, in line with the rule in
`CMS-IMPLEMENTATION.md` §2 that the public site is static HTML at the edge.
Every mutating action calls `revalidatePath("/training")`, so a save drops the
cached HTML and the next visitor gets a fresh render. Verified: creating an
intake made it appear on `/training` immediately.

The dashboard's own pages read cookies and are therefore always dynamic.

---

## 6. Storage: Vercel Blob in production, the file locally

`lib/training/store.ts` has two backends behind one pair of functions, and the
presence of `BLOB_READ_WRITE_TOKEN` chooses between them:

| Token | Backend | Where |
| --- | --- | --- |
| set | Vercel Blob | production on Vercel |
| unset | `data/training.json` | local development |

### Why it needs to be this way

Vercel ships the app as a **read-only bundle**. `data/training.json` is baked
in at build time and the running function cannot write back to it; the only
writable path is `/tmp`, which is per-instance and discarded. A file store and
serverless hosting are structurally incompatible — no setting changes that.

This bit us in production on 2026-08-27: the dashboard reported *"The server's
filesystem is read-only, so this change could not be saved."* That message was
correct and deliberate — `writeToFile` detects `EROFS`/`EACCES`/`EPERM` and
says so rather than reporting a save that did not happen — but the fix is to
move the store, which is what Blob does.

### Setting it up

1. Vercel dashboard → **Storage** → **Blob** → create a store → **Connect** it
   to this project.
2. Redeploy. Vercel injects `BLOB_READ_WRITE_TOKEN` automatically; you never
   set it by hand.

Nothing else changes — the dashboard, the seven server actions, `/training`,
the countdown and the JSON shape are all untouched.

### Three things to know

**The committed file is the seed, not the source of truth.** On a deployment
where the blob does not exist yet, `readTraining` falls back to
`data/training.json`, so a fresh deploy renders the catalogue immediately
rather than an empty page. **The first save creates the blob, and from that
moment the blob wins.** Editing `data/training.json` in git and redeploying
will then change nothing anyone sees. Edit through /admin, or delete the blob
to re-seed.

**Reads bypass the CDN.** `get(..., { useCache: false })` reads from origin
storage, so a save is visible on the very next render. Without it the dashboard
would look broken for up to a minute after every edit — precisely the window in
which someone checks whether their change worked.

**The blob is public.** It holds the same marketing copy `/training` already
publishes: module titles, dates, a fee, a link to a form. Nothing in it is not
already on a public page. **Nothing with a person in it may ever be stored
here** — that line is the same one `TRAINING-SYSTEM.md` §2 draws around Sanity,
and it applies identically.

### If you ever move off Vercel

The change is confined to the two exported functions. The alternatives
considered, and why:

- **Sanity** — `studio/schemaTypes/trainingModule.ts` already exists for exactly
  this data. Best long-term answer: one CMS for blog, gallery and training, and
  it keeps the static-page architecture. Blocked on the Sanity account that
  `CMS-IMPLEMENTATION.md` Phase 0 has been waiting on.
- **A VPS running `next start`** — the file backend then works as written, with
  no code change, and it also resolves the Vercel Hobby commercial-use licensing
  problem in `TRAINING-SYSTEM.md` §1, which applies to this site today
  regardless of the dashboard.
- **Postgres on Neon** — correct and durable, and the direction
  `TRAINING-SYSTEM.md` §3 points, but heavy for two lists that change a few
  times a year. Worth it when Phase 1 (applications, admissions) is actually
  being built.

Note that Blob does **not** resolve the Hobby commercial-use question. That is a
licensing matter, not a quota, and it is still open.

---

## 7. What this is not

This is the **announcement** half of a training system: dates, a countdown, and
a link out to a form somebody else hosts. It is not the Training Management
System scoped in `docs/TRAINING-SYSTEM.md` — no applications are received here,
no applicant data is stored, no admission workflow, no marking, no certificates.

That separation is the point. Sending applicants to a Google Form keeps every
piece of personal data out of this repository and out of Sanity, which is what
§2 and §7 of that document ask for. It is also close to what §1 recommends
building first, at a fraction of the cost — with the one difference that the
form is external, so nothing here needs to comply with Rwanda's Law N° 058/2021
on personal data.

If the centre outgrows the Google Form, the upgrade path is Phase 1 of
`TRAINING-SYSTEM.md`, and this dashboard's intake records are the seed for it.

---

## 8. Files

```
data/training.json                        the store, committed
lib/training/store.ts                     read/write; the only place to change for a new backend
lib/training/types.ts                     types + defensive parsing of the file
lib/training/dates.ts                     Kigali ⇄ UTC, formatting, countdown maths, phase
lib/training/select.ts                    which intake gets featured
lib/admin/auth.ts                         env credentials, signed session cookie
app/admin/actions.ts                      every mutation, each re-checking auth
app/admin/login/page.tsx                  sign-in
app/admin/(dashboard)/                    guard, shell, overview, modules, intakes
components/admin/                          dashboard form and list pieces
components/training/UpcomingIntake.tsx    the public announcement panel
components/training/Countdown.tsx         the ticking clock
components/SiteChrome.tsx                 hides the marketing header/footer under /admin
```

---

## 9. Verified

Driven through a real browser against a production build on 2026-08-27:

- `/admin` redirects to `/admin/login` when signed out; sign-in succeeds and
  lands on the dashboard.
- Adding a module writes it to the JSON and it appears on `/training`.
- Editing a module in place changes its title, summary and topics, leaves its
  `id` untouched, and the row re-renders with the new values.
- Opening an intake's edit form prefills all three dates correctly — a stored
  `2026-08-30T06:00:00.000Z` renders as `08/30/2026, 08:00 AM`, so the
  Kigali ⇄ UTC conversion round-trips exactly.
- Removing it (two-step confirm, no browser dialog) removes it from both.
- With `BLOB_READ_WRITE_TOKEN` set, the Blob backend is taken; when the store is
  unreachable `/training` still renders from the committed seed instead of going
  blank, and a save reports a Blob-specific error rather than the filesystem one.
- A failed save leaves the form's contents intact (see §10).
- Creating an intake stores the Kigali time correctly as UTC
  (09:00 CAT → `07:00:00.000Z`) and publishes it to `/training` with a live
  countdown.
- An intake whose opening date has passed renders the **Apply now** button with
  `target="_blank" rel="noopener noreferrer"` and counts down to the deadline
  instead.
- Hiding an intake removes it from `/training` immediately; the next eligible
  intake takes its place.

Not verified locally, because it needs the real store: a successful Blob write.
The read and failure paths were exercised with an invalid token.

---

## 10. Forms keep their contents when a save fails

React 19 resets an uncontrolled form after a form action completes — **whether
it succeeded or not**. Left alone that means one bad field, or one storage
outage, wipes everything the admin typed; on the ten-field intake form that is a
destructive way to report a typo.

So every create/update action returns a `values` snapshot of the submission on
failure, and the forms seed their `defaultValue`s from it. Found on 2026-08-27
while testing the Blob failure path, and fixed then — an earlier comment in
`ModuleForm.tsx` claimed the opposite behaviour and was wrong.
