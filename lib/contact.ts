// Validation shared by the contact form and the route handler that receives it.
//
// The same rules have to run in both places for different reasons: on the
// client so a typo is caught before a round trip, and on the server because a
// POST can be crafted by hand and client-side checks are a courtesy, not a
// control. Keeping one implementation means the two can't drift apart.

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

export const EMPTY_CONTACT: ContactFields = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

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
  subject: 150,
  message: 5000,
} as const;

export function validateContact(fields: ContactFields): FieldErrors {
  const errors: FieldErrors = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const phone = fields.phone.trim();
  const subject = fields.subject.trim();
  const message = fields.message.trim();

  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is too long.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL.test(email) || email.length > LIMITS.email)
    errors.email = "Please enter a valid email address.";

  if (!phone) errors.phone = "Please enter a phone number.";
  else if (!PHONE.test(phone)) errors.phone = "Please enter a valid phone number.";

  if (subject.length < 2) errors.subject = "Please enter a subject.";
  else if (subject.length > LIMITS.subject) errors.subject = "That subject is too long.";

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

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  return Boolean(email) && EMAIL.test(email) && email.length <= LIMITS.email;
}
