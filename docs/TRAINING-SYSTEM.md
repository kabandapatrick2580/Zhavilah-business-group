# Training Management System — Feasibility & Architecture Consultation

Scope study for a Training Management System (TMS) covering **application →
admission → enrolment → marking → certification** for ZHAVILAH TRAINING CENTER.

This is **not** a contracted deliverable under the current agreement. It sits
outside §2.1–§2.5 and would be a §7 Change Request or a separate contract.

**Last updated:** 2026-08-26
**Status:** consultation only — nothing built, no decisions taken.

---

## Read this first — the three findings that shape everything

### 1. The Hobby plan cannot host this, and arguably cannot host the current site

Vercel defines commercial usage as *any deployment used for the financial gain
of anyone involved in any part of the project's production* — and explicitly
names **"being paid to create or host the site"** as commercial use.

That definition already covers `zhavilahbusinessgroup.com` today: it is a paid
freelance build for a trading company. A TMS that takes applications for paid
courses removes any remaining ambiguity.

**This is a licensing problem, not a quota problem.** Staying under 100 GB of
bandwidth does not make the use permitted. Enforcement is sporadic, but the
failure mode is the client's live site being suspended with no warning during an
intake window.

Three honest options, costed below in §6. The short version: **move hosting to
Cloudflare Workers, whose free plan carries no such restriction, or budget
$20/month for Vercel Pro.** Do not build a TMS on Hobby and hope.

### 2. Applicant data must never touch Sanity

`CMS-IMPLEMENTATION.md` §1 already records it: **Sanity Free datasets are
public-read.** The caveat was written about draft blog posts. Applied to a TMS
it becomes severe — a training application carries name, national ID or passport
number, date of birth, phone, employer, academic transcripts, and later, marks.

Putting any of that in a public dataset is a personal-data breach that a browser
and a project ID are enough to exploit.

**Rule: Sanity holds the prospectus. A Postgres database holds the people.**
The line is absolute and should be written into the schema review.

### 3. The effort is 4–6× the CMS, and should be priced that way

The CMS line item is RWF 290,000. A realistic TMS build is **37–54 developer
days** (§8). Quoting this as an add-on to the existing agreement would be a
serious mispricing. It is a second project.

---

## 1. Should you build this at all?

Answer honestly before writing code, because two cheaper options exist.

| Option | Cost | Covers | Why it fails here |
| --- | --- | --- | --- |
| **Google Forms + Sheets + Classroom** | RWF 0, ~2 days setup | Applications, course delivery, basic grading | No admission workflow, no cohort capacity control, no weighted grading scheme, no transcripts, no branded certificates, no verification. Data lives in a personal Google account — a §9 handover problem. |
| **Moodle (self-hosted)** | ~$5–7/mo VPS | Essentially everything, mature and free | Second runtime (PHP), a large security-maintenance surface directly against §2.4 and the §11 warranty, and admissions is a weak bolt-on. Roughly 6–10 days to stand up and theme, then permanent patching. |
| **Build on the existing stack** | RWF 0–20/mo infra | Exactly the process the centre runs | 37–54 dev days. Owned outright, matches the brand, handover is a git repo. |

**Recommendation:** build — but only if the centre is genuinely running intakes
with cohorts and issuing certificates that need to be verifiable. If the real
need today is "collect applications and email people back", **Phase 1 alone
(§8) delivers 80% of the value for 25% of the cost.** Stop there and see whether
Phases 2–3 are still wanted in six months.

Do not build the marking system speculatively. It is the most expensive phase
and the one most likely to be replaced by "the instructor keeps a spreadsheet".

---

## 2. Where the code lives

**Recommendation: a separate Next.js project, deployed separately, on a
subdomain — `training.zhavilahbusinessgroup.com`.** Not a route group in this
repo.

### Why not in this repo

`CMS-IMPLEMENTATION.md` §2 states the rule that protects the current stack:
*content is fetched at build/ISR, never client-side; the public site is static
HTML at the edge with no runtime dependency.*

A TMS violates every clause of that sentence. It is authenticated, stateful,
database-backed, and cannot be statically generated. Merging the two means:

- a database outage or migration error can fail the **marketing site's** build;
- the marketing site inherits the TMS's auth, session and PII security surface;
- every TMS deploy re-deploys the brochure site, and vice versa;
- the blast radius of a dependency bump doubles.

Separation costs almost nothing: both platforms allow unlimited projects on the
free tier, and the link between them is one `<a href>` in the navigation.

### What is shared

| Shared | How |
| --- | --- |
| Design language | Copy `components/ui`, Tailwind config, and fonts into the new repo. Do **not** build a shared npm package for two apps — the versioning overhead exceeds the duplication cost. |
| Contact details, socials | Read from Sanity `siteSettings` in both apps. |
| Course catalogue | Sanity `trainingModule` is already the source of truth. The TMS reads it to render "what you are applying for". Extend it with an `intake` document (§5). |
| QR generation | `lib/qr.ts` moves across unchanged — it is already the certificate-verification primitive you will need (§7). |

---

## 3. Recommended stack

| Layer | Choice | Free-plan reality (verified 2026-08-26) |
| --- | --- | --- |
| Framework | Next.js 15 App Router | Same as today. No new learning curve. |
| Hosting | **Cloudflare Workers** (or Vercel Pro at $20/mo) | 100k requests/day, 10 ms CPU per request. No commercial-use restriction. |
| Database | **Neon Postgres** | 0.5 GB storage, 100 CU-hours/month, 10 branches. Scales to zero after 5 min, wakes automatically. |
| ORM / migrations | **Drizzle** | Free. Lighter than Prisma on serverless cold starts, and generates plain SQL migrations you can hand over. |
| Auth | **Auth.js v5**, self-hosted | Free, no MAU ceiling, no vendor lock. See the email trap in §6. |
| File storage | **Cloudflare R2** | 10 GB storage, 1M writes, 10M reads/month, **zero egress**. S3-compatible. |
| Transactional email | **Resend** (already integrated) | 3,000/month **capped at 100/day**, 1 verified domain. See §6 — this is the tightest constraint in the whole design. |
| Bot protection | **Cloudflare Turnstile** (already integrated) | Free, unmetered. |
| Rate limiting / sessions | **Upstash Redis** or Cloudflare KV | The current in-memory limiter is insufficient here — see §6. |
| Scheduled jobs | **GitHub Actions cron** | 2,000 min/month on private repos. More flexible than Hobby cron (2 jobs, once daily). |
| PDF generation | **`pdf-lib`** or `@react-pdf/renderer` | Free. **Not Puppeteer** — headless Chrome exceeds serverless bundle and CPU limits. |

**Why Neon over Supabase:** Supabase free projects are **paused after one week
of inactivity** and require a manual dashboard login to restore. A training
portal is idle between intakes by definition — it would be asleep exactly when
an applicant arrives. Neon's compute scales to zero and wakes on the next query
with no human in the loop. Supabase's bundled auth and storage are attractive,
but the pause behaviour disqualifies it for this access pattern.

---

## 4. The four workflows

```
  PUBLIC                    STAFF                       OUTPUT
  ──────                    ─────                       ──────
  Browse intakes
        │
  Apply ─┼──▶ documents to R2 (presigned, direct)
        │
        └──▶ Application ──▶ Review queue ──▶ Decision ──▶ email + status page
                                  │
                            Admit ─┴──▶ Enrolment ──▶ Cohort
                                                        │
                                              Attendance + Marks
                                                        │
                                              Publish gate (admin)
                                                        │
                                          Transcript + Certificate ──▶ /verify/<serial>
```

### 4.1 Application

- Public, unauthenticated start. **Do not require an account to begin** — it is
  the single biggest drop-off point in every admissions funnel.
- Multi-step with server-side save after each step, keyed to an emailed resume
  link. Applicants on mobile data will not complete a long form in one sitting.
- Document upload (ID, certificates) goes **direct to R2 via a presigned URL**.
  Serverless request bodies cap around 4.5 MB; a photographed transcript
  routinely exceeds that. Never proxy the file through the function.
- Reuse the existing Turnstile + honeypot + timing defence from `lib/contact.ts`.

### 4.2 Admission

- States: `draft → submitted → under_review → (accepted | rejected | waitlisted) → enrolled`.
- Every transition writes an append-only `application_event` row with actor,
  timestamp and reason. Admissions decisions get disputed; a mutable status
  column gives you nothing to stand on.
- Capacity lives on the **intake**, not the programme. Enforce it in a
  transaction at the point of enrolment, not at acceptance — accepting 30 for 25
  seats is normal and intentional.
- Decision emails are batched, not sent in a loop. See §6.

### 4.3 Delivery

- Cohort, sessions, attendance register, instructor assignment.
- Keep attendance a simple three-state mark (present / absent / excused) entered
  by the instructor per session. Anything richer goes unused.

### 4.4 Marking

Three design decisions carry the whole subsystem:

**a. Version the grading scheme, and snapshot the result.**
A scheme is *CA 40% + Practical 20% + Final Exam 40%, pass mark 50*. If a
scheme is edited in 2028, every transcript issued in 2026 must not silently
change. Store the computed final grade **and the scheme version** on the result
row at publication.

**b. Marks are draft until an admin publishes the cohort.**
Instructors enter marks freely; students see nothing. One deliberate publish
action per cohort flips visibility and freezes the results. Without this gate
you will be explaining a half-entered gradebook to a student.

**c. Corrections are new rows, not edits.**
A `mark_event` append-only log with actor and reason. The current mark is the
latest event. This is the difference between "we corrected an entry error" and
"we cannot account for why this number changed".

Certificates: PDF with a serial number and a QR code pointing at a public
`/verify/<serial>` page that shows holder name, programme, cohort and issue date
— nothing more. `lib/qr.ts` already does the QR half correctly, including the
contrast and quiet-zone handling scanners need.

---

## 5. Data model sketch

Sanity keeps the marketing catalogue. Postgres owns everything with a person in it.

```
Sanity (public)                 Postgres (private)
───────────────                 ──────────────────
trainingModule                  user (role: applicant|student|instructor|admin)
  └─ programme                  applicant_profile
       └─ intake  ◀──────────── application ──▶ application_document (R2 key)
          (dates, capacity,          │
           fee, status)         application_event  (append-only)
                                     │
                                enrolment ──▶ cohort ──▶ session ──▶ attendance
                                     │
                                assessment (component, weight, max)
                                     │
                                mark ──▶ mark_event  (append-only)
                                     │
                                result (final grade + scheme_version, frozen)
                                     │
                                certificate (serial, issued_at, revoked_at)
```

`intake` is the one document worth adding to Sanity — dates, capacity and fee
are marketing copy the client must edit without a developer. Its *bookings* are
Postgres's problem.

---

## 6. Where the free tiers will actually bite

Not the ones people worry about. Storage and bandwidth are a non-issue at this
scale. These four are real:

### The 100-emails-per-day cap is the binding constraint

Resend Free is 3,000/month **capped at 100/day**, and sending pauses at the cap
rather than charging overage.

A single admissions round breaks this. Publishing decisions for a 60-applicant
intake is 60 emails; add enrolment confirmations and one instructor
announcement and the day is gone — **silently, mid-batch**.

Mitigations, in order of preference:

1. **Queue outbound mail** in a Postgres table with a `send_after` timestamp,
   drained by a scheduled job at a safe rate. Never send in a request loop.
   Build this in Phase 1 even though Phase 1 does not need it — retrofitting a
   queue after the fact is painful.
2. **Do not use magic-link login for students.** Auth.js magic links spend one
   email per login. Forty students signing in on results day is forty emails
   against the same 100. Use passwords with long-lived sessions for students;
   reserve magic links for the handful of staff.
3. Budget Resend Pro (~$20/mo) if intakes exceed ~50 people. Cheaper than the
   support calls generated by mail that silently stopped.

### The in-memory rate limiter will not hold a login endpoint

`lib/rate-limit.ts` documents its own limitation honestly — per-instance, and
"move to a shared store only if abuse actually shows up." That judgement is
correct for a contact form. It is wrong for `/login`: credential stuffing
spread across cold starts walks straight through a per-instance counter.
Move to Upstash Redis or Cloudflare KV **before** the first authenticated route
ships, not after.

### Neon's 0.5 GB is generous for rows and hostile to blobs

Thousands of applicants fit comfortably. One PDF stored as `bytea` starts
eating the ceiling. Files go to R2; Postgres stores the object key. Never the
bytes.

### Cold starts land on the applicant

Neon scales to zero after five minutes. Between intakes, the first request of
the day pays the wake-up cost. Keep it off the critical path: render the public
intake list from Sanity (already static and edge-cached), so the database is
only touched once someone actually starts an application.

### Hosting cost comparison

| Route | Monthly | Notes |
| --- | --- | --- |
| Cloudflare Workers + Neon + R2 + Resend Free | **$0** | No commercial-use restriction. Some Next.js features need adapter work. |
| Vercel Pro + Neon + R2 + Resend Free | **$20** | Zero migration risk; the stack you already know. Resolves the licensing problem for the marketing site too. |
| Vercel Pro + Resend Pro | **$40** | Add when intakes pass ~50 people. |

**Recommendation: Vercel Pro at $20/month.** Under §12 this is the Client's
cost, and it is roughly RWF 27,000/month — trivial against a single course fee.
Chasing $0 by porting a working Next.js deployment to Workers spends several
developer days and introduces adapter risk, for an annual saving smaller than
the days cost. Take the Cloudflare route only if the Client refuses any
recurring platform cost.

---

## 7. Security and legal — not optional here

The current site handles no personal data beyond a contact form. A TMS handles
national IDs, dates of birth and academic records. That is a category change.

- **Rwanda Law N° 058/2021** on the protection of personal data and privacy
  imposes obligations on data controllers — lawful basis, retention limits,
  subject access, and registration with the supervisory authority. **Confirm the
  current position with the Client's counsel before collecting the first
  application.** Do not advise on this from a developer's chair.
- Decide retention up front: how long are rejected applicants' documents kept?
  Build the deletion job in Phase 1. It is nearly free then and a migration later.
- The security headers still open in `CMS-IMPLEMENTATION.md` §4 Phase 3 (CSP,
  X-Frame-Options, Referrer-Policy) move from *good practice* to *mandatory*
  once sessions exist. A missing `X-Frame-Options` on an authenticated portal is
  a clickjacking hole.
- R2 objects must be private, served only through short-lived presigned URLs.
  A public bucket of applicant IDs is the same breach as the Sanity one, wearing
  a different hat.
- Backups: nightly `pg_dump` to R2 via GitHub Actions, plus the existing
  `sanity dataset export`. **A restore that has never been tested is not a
  backup** — the same open item as §2.4.

---

## 8. Phasing and effort

Solo developer, working days, including testing and documentation.

| Phase | Deliverable | Days |
| --- | --- | --- |
| **0 — Foundations** | Repo, subdomain, Neon + R2 + Auth.js wiring, schema, migrations, RBAC, mail queue, shared rate limiter | 6–8 |
| **1 — Applications** | Public multi-step form, resume-by-link, R2 uploads, applicant status page, admin review queue, decision emails, event log | 8–11 |
| **2 — Enrolment & cohorts** | Intakes with capacity, enrolment, cohorts, sessions, attendance, student and instructor dashboards | 8–12 |
| **3 — Marking & certification** | Assessment schemes with weights, mark entry, publish gate, mark audit log, transcripts, certificates, public verification page | 12–18 |
| **4 — Hardening & handover** | Security headers, penetration pass, backup + tested restore, retention job, admin guide, training session | 5–8 |
| | **Total** | **39–57** |

Roughly **8–12 weeks** at a sustainable solo pace — call it **4–6× the CMS line
item**, which is the number that matters for pricing.

**Phases 0 + 1 alone (14–19 days) are independently useful** and I would sell
them first. They replace an email inbox with a real admissions pipeline and
produce something demonstrable inside a month. Phases 2–3 should be quoted
separately, after the centre has run one intake through Phase 1 and can say what
it actually needs.

---

## 9. Decisions needed from the Client before any of this starts

1. **Hosting licence.** Vercel Pro at $20/month, or a port to Cloudflare? This
   blocks everything, and it applies to the existing site today regardless of
   whether the TMS is built.
2. **Scope.** Phase 1 only, or the full pipeline through certification?
3. **Fees.** Does the system take money? Stripe does not serve Rwandan payouts;
   MTN MoMo, Flutterwave or Paypack would be the route, and none are free.
   **Strong recommendation: v1 records payments made offline** — the applicant
   uploads a bank slip, an admin marks it paid. Building payment collection
   triples the compliance surface for a process the centre already runs by hand.
4. **Data protection posture.** Who is the registered controller, and what is
   the retention policy for unsuccessful applicants?
5. **Certificate authority.** Who signs, and does a verification page carry any
   accreditation claim? Get the wording approved before it is rendered into a PDF.

Note also that this work **cannot start on the CMS contract's critical path**:
Phase 0 of `CMS-IMPLEMENTATION.md` is still blocked on the Client creating the
Sanity account, and `CONTACT-FORM.md` is blocked on Resend and Turnstile. All
three blockers are the same shape — accounts that must exist in the Client's
name. Bundle them into one request rather than three.

---

## Sources

Free-plan figures verified 2026-08-26:

- Vercel Hobby plan and commercial-use definition — <https://vercel.com/docs/plans/hobby>
- Neon free plan limits — <https://neon.com/faqs/free-plan-limits-and-quotas>
- Resend account quotas — <https://resend.com/docs/knowledge-base/account-quotas-and-limits>
- Cloudflare Workers pricing — <https://developers.cloudflare.com/workers/platform/pricing/>
- Cloudflare Pages Functions pricing — <https://developers.cloudflare.com/pages/functions/pricing/>
- Supabase pricing and inactivity pause — <https://supabase.com/pricing>
