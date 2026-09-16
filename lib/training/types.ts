// Shape of the training catalogue held in `data/training.json`.
//
// Two collections, deliberately kept flat: the modules that make up the
// syllabus, and the intakes (a dated run of the course that people apply to).
// Nothing here references a database — see `lib/training/store.ts` for why the
// file is the store, and what that costs.

import { SERVICE_ICONS, type ServiceIconName } from "@/components/services/serviceIcons";

/** One syllabus module, rendered as a card on /training. */
export type TrainingModule = {
  id: string;
  title: string;
  /** Key into `SERVICE_ICONS`. Server components can't pass a component to the
      client, so the catalogue stores the name and the page resolves it. */
  icon: ServiceIconName;
  /** Optional one-line framing shown above the topic list. */
  summary?: string;
  items: string[];
};

/**
 * Where the training fee is paid.
 *
 * These are the company's standing details rather than something that varies
 * per intake, so every field is preloaded from `PAYMENT_DEFAULTS` and only
 * carries a stored value once an admin has actually edited it. Each one is a
 * plain string that may be empty: an admin who clears the MoMo code means the
 * intake has no MoMo code, which is why blank is kept rather than refilled.
 */
export type IntakePayment = {
  companyName: string;
  reason: string;
  bankName: string;
  bankAccount: string;
  momoCode: string;
};

/** What the create form opens with, and what an older record falls back to. */
export const PAYMENT_DEFAULTS: IntakePayment = {
  companyName: "ZHAVILAH BUSINESS GROUP LTD",
  reason: "Training Fee",
  bankName: "Equity",
  bankAccount: "4003201102265",
  momoCode: "221231",
};

/**
 * A dated run of the training that applicants can register for.
 *
 * Three dates, all optional except `opensAt`, and they drive the countdown:
 *   opensAt  — applications open. Before it, the button is inert.
 *   closesAt — application deadline. After it, no more applications.
 *   startsAt — first day of class. Shown as detail, and used as the countdown
 *              target once applications have opened but no deadline was set.
 */
export type TrainingIntake = {
  id: string;
  title: string;
  summary: string;
  /** ISO-8601 UTC instant. */
  opensAt: string;
  closesAt?: string;
  startsAt?: string;
  /** Free text — "Classroom", "Online", "Hybrid", "Evenings & weekends"… */
  mode?: string;
  location?: string;
  /** Free text so it can carry a currency and a qualifier: "RWF 150,000 per participant". */
  fee?: string;
  seats?: number;
  /** Third-party application form (Google Forms and the like). Opened in a new tab. */
  applicationUrl: string;
  /** How the fee is paid. Always present — see `IntakePayment`. */
  payment: IntakePayment;
  /** Unpublished intakes are visible in the dashboard only. */
  published: boolean;
  createdAt: string;
};

export type TrainingData = {
  modules: TrainingModule[];
  intakes: TrainingIntake[];
};

/** The icons offered in the dashboard's picker — the subset that suits a course. */
export const MODULE_ICON_CHOICES = [
  "book", "percent", "laptop", "calculator", "graduation", "spreadsheet",
  "clipboard", "receipt", "landmark", "line-chart", "briefcase", "scale",
  "presentation", "award", "workflow", "target",
] as const satisfies readonly ServiceIconName[];

export function isIconName(value: unknown): value is ServiceIconName {
  return typeof value === "string" && value in SERVICE_ICONS;
}

/**
 * Narrows a parsed-JSON value to `TrainingData`, dropping anything malformed.
 *
 * The file is hand-editable and written by a route that could be interrupted
 * mid-write, so it is not trusted. A partly corrupt file loses the bad records
 * rather than taking the page down.
 */
export function parseTrainingData(value: unknown): TrainingData {
  const root = isRecord(value) ? value : {};
  return {
    modules: asArray(root.modules).map(parseModule).filter(isPresent),
    intakes: asArray(root.intakes).map(parseIntake).filter(isPresent),
  };
}

function parseModule(value: unknown): TrainingModule | null {
  if (!isRecord(value)) return null;
  const id = str(value.id);
  const title = str(value.title);
  if (!id || !title) return null;
  return {
    id,
    title,
    icon: isIconName(value.icon) ? value.icon : "book",
    ...(str(value.summary) ? { summary: str(value.summary) } : {}),
    items: asArray(value.items).map(str).filter(Boolean),
  };
}

function parseIntake(value: unknown): TrainingIntake | null {
  if (!isRecord(value)) return null;
  const id = str(value.id);
  const title = str(value.title);
  const opensAt = isoOrEmpty(value.opensAt);
  const applicationUrl = str(value.applicationUrl);
  if (!id || !title || !opensAt || !applicationUrl) return null;

  const closesAt = isoOrEmpty(value.closesAt);
  const startsAt = isoOrEmpty(value.startsAt);
  const seats = typeof value.seats === "number" && value.seats > 0 ? Math.floor(value.seats) : undefined;

  return {
    id,
    title,
    summary: str(value.summary),
    opensAt,
    ...(closesAt ? { closesAt } : {}),
    ...(startsAt ? { startsAt } : {}),
    ...(str(value.mode) ? { mode: str(value.mode) } : {}),
    ...(str(value.location) ? { location: str(value.location) } : {}),
    ...(str(value.fee) ? { fee: str(value.fee) } : {}),
    ...(seats ? { seats } : {}),
    payment: parsePayment(value.payment),
    applicationUrl,
    published: value.published !== false,
    createdAt: isoOrEmpty(value.createdAt) || new Date(0).toISOString(),
  };
}

/**
 * Fills in the company's details for anything the record does not carry.
 *
 * A key that is present — even as an empty string — is an admin's decision and
 * is kept as it is. A key that is missing predates the payment fields, so it
 * takes the default.
 */
function parsePayment(value: unknown): IntakePayment {
  const record = isRecord(value) ? value : {};
  const field = (key: keyof IntakePayment): string =>
    key in record ? str(record[key]) : PAYMENT_DEFAULTS[key];

  return {
    companyName: field("companyName"),
    reason: field("reason"),
    bankName: field("bankName"),
    bankAccount: field("bankAccount"),
    momoCode: field("momoCode"),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isoOrEmpty(value: unknown): string {
  const raw = str(value);
  if (!raw) return "";
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function isPresent<T>(value: T | null): value is T {
  return value !== null;
}
