// Cookie-consent state: stored locally, read by the banner and by anything
// that wants to know whether it is allowed to load a non-essential script.
//
// Bump STORAGE_VERSION whenever the categories change — that invalidates old
// records and re-asks visitors, which is what a category change requires.

export const STORAGE_KEY = "zbg-cookie-consent";
export const STORAGE_VERSION = 1;
export const CONSENT_EVENT = "zbg:cookie-consent";

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type Consent = Record<ConsentCategory, boolean>;

export type ConsentRecord = {
  version: number;
  /** ISO timestamp of the decision — proof of *when* consent was given. */
  decidedAt: string;
  consent: Consent;
};

export const CATEGORIES: {
  id: ConsentCategory;
  label: string;
  description: string;
  locked?: boolean;
}[] = [
  {
    id: "necessary",
    label: "Strictly necessary",
    description:
      "Required for the site to work — page navigation, security and remembering this choice. These cannot be switched off.",
    locked: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description:
      "Anonymous statistics about which pages and services visitors use, so we can improve them.",
  },
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Used to measure our campaigns and show relevant Zhavilah content on other platforms.",
  },
];

export const ACCEPT_ALL: Consent = { necessary: true, analytics: true, marketing: true };
export const REJECT_ALL: Consent = { necessary: true, analytics: false, marketing: false };

/** Returns the stored decision, or `null` when there isn't a valid current one. */
export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed?.version !== STORAGE_VERSION || !parsed.consent) return null;
    return parsed;
  } catch {
    // Corrupt entry, or storage blocked (private mode / cookies disabled).
    return null;
  }
}

/** Persists a decision and notifies listeners on the same page. */
export function writeConsent(consent: Consent): ConsentRecord {
  const record: ConsentRecord = {
    version: STORAGE_VERSION,
    decidedAt: new Date().toISOString(),
    consent: { ...consent, necessary: true },
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Nothing we can do if storage is unavailable — the banner will simply
    // ask again next visit, which is the safe default.
  }
  window.dispatchEvent(new CustomEvent<ConsentRecord>(CONSENT_EVENT, { detail: record }));
  return record;
}
