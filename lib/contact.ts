// Validation shared by the contact form and the route handler that receives it.
//
// The same rules have to run in both places for different reasons: on the
// client so a typo is caught before a round trip, and on the server because a
// POST can be crafted by hand and client-side checks are a courtesy, not a
// control. Keeping one implementation means the two can't drift apart.

import { SERVICES } from "@/lib/site";

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  service: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

export const EMPTY_CONTACT: ContactFields = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  service: "",
  message: "",
};

// The kinds of enquiry the office actually receives, ordered by how commonly
// they arrive so the likeliest options need no scrolling on mobile. "Something
// else" is last and deliberately open — a fixed list that can't express the
// visitor's reason is worse than no list at all, and the message body catches
// whatever the options miss.
export const INQUIRY_TYPES = [
  "Request a quote",
  "Book a consultation",
  "General enquiry",
  "Request a proposal or tender document",
  "Existing client support",
  "Training or workshop booking",
  "Partnership or supplier enquiry",
  "Careers and internships",
  "Something else",
] as const;

// Derived from the navigation's service list rather than retyped, so a service
// added to the site menu appears here automatically and the two can't disagree.
// The trailing option exists because a visitor who already knew which service
// they needed would often not be writing in.
export const SERVICE_OPTIONS: string[] = [
  ...SERVICES.map((service) => service.label),
  "Not sure yet — please advise",
];

// Deliberately permissive. An address is only truly validated by sending mail
// to it, so this rejects the obviously malformed and lets the rest through
// rather than turning away the unusual-but-valid.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Rwandan numbers are usually written +250 7XX XXX XXX, but clients abroad and
// landlines are both normal here, so this only asserts "enough digits to be a
// phone number" and allows the punctuation people actually type.
const PHONE = /^[+]?[\d\s().-]{7,20}$/;

const LIMITS = {
  name: 100,
  email: 200,
  phone: 20,
  message: 5000,
} as const;

export function validateContact(fields: ContactFields): FieldErrors {
  const errors: FieldErrors = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const phone = fields.phone.trim();
  const subject = fields.subject.trim();
  const service = fields.service.trim();
  const message = fields.message.trim();

  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is too long.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL.test(email) || email.length > LIMITS.email)
    errors.email = "Please enter a valid email address.";

  if (!phone) errors.phone = "Please enter a phone number.";
  else if (!PHONE.test(phone)) errors.phone = "Please enter a valid phone number.";

  // Both dropdowns are checked against their lists rather than for length. A
  // value outside the list can't come from the rendered form, so it means the
  // request was hand-crafted — and accepting it would let arbitrary text into
  // the email subject line.
  if (!subject) errors.subject = "Please choose what your enquiry is about.";
  else if (!INQUIRY_TYPES.includes(subject as (typeof INQUIRY_TYPES)[number]))
    errors.subject = "Please choose one of the listed options.";

  if (!service) errors.service = "Please choose the service you're interested in.";
  else if (!SERVICE_OPTIONS.includes(service))
    errors.service = "Please choose one of the listed services.";

  if (message.length < 10) errors.message = "Please tell us a little more — at least 10 characters.";
  else if (message.length > LIMITS.message)
    errors.message = `Please keep your message under ${LIMITS.message} characters.`;

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

// The field a bot fills in and a person never sees. Named plausibly rather
// than "honeypot" so naive form-fillers treat it as a real input.
export const HONEYPOT_FIELD = "company_website";

// How long a person plausibly takes before submitting. Scripts post the instant
// they parse the page, so anything faster is almost certainly automated.
//
// The timestamp comes from the client and is therefore forgeable — this filters
// naive bots, it does not stop a determined one. Turnstile is the layer that
// does. The thresholds are per-form because the contact form has six fields and
// the footer has one, and 3s of dwell time on a single email box would flag
// people who paste and click.
export const MIN_FILL_MS = { contact: 3000, subscribe: 1200 } as const;

/**
 * True when the submission arrived implausibly soon after the form was built.
 * A missing or nonsensical timestamp counts as too fast: every real client sends
 * one, so its absence means the request did not come from the rendered form.
 */
export function submittedTooFast(renderedAt: unknown, minMs: number): boolean {
  if (typeof renderedAt !== "number" || !Number.isFinite(renderedAt)) return true;
  const elapsed = Date.now() - renderedAt;
  // A future timestamp means a forged or badly skewed clock; treat as suspect.
  return elapsed < minMs;
}

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  return Boolean(email) && EMAIL.test(email) && email.length <= LIMITS.email;
}
