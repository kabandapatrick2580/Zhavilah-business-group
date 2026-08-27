// Date handling for intakes, shared by the dashboard, the server and the
// countdown running in the browser.
//
// Everything is stored as a UTC instant and displayed in Africa/Kigali, the
// same rule `lib/format.ts` already sets for blog posts: pinned explicitly on
// both sides so server and client render identical text and React sees no
// hydration mismatch.

import type { TrainingIntake } from "@/lib/training/types";

/**
 * Rwanda is UTC+02:00 (CAT) year-round with no daylight saving, so a fixed
 * offset is exact rather than an approximation.
 *
 * This is what makes `<input type="datetime-local">` usable: that control
 * submits a wall-clock string with no zone attached ("2026-09-01T09:00"). Read
 * with the server's own zone it would mean different instants on a laptop in
 * Kigali and a container in Virginia. Anchoring it here means "09:00" always
 * means 09:00 in Kigali, wherever the code runs.
 */
export const KIGALI_OFFSET = "+02:00";
export const KIGALI_TZ = "Africa/Kigali";

/** `datetime-local` value → ISO-8601 UTC instant. Null if unparseable. */
export function localInputToIso(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Browsers omit ":00" seconds when the input has minute precision.
  const withSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed) ? `${trimmed}:00` : trimmed;
  const date = new Date(`${withSeconds}${KIGALI_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** ISO instant → `datetime-local` value in Kigali time, for pre-filling a form. */
export function isoToLocalInput(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: KIGALI_TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** "1 September 2026" */
export function formatIntakeDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: KIGALI_TZ,
  });
}

/** "1 September 2026, 09:00 CAT" */
export function formatIntakeDateTime(iso: string): string {
  const time = new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: KIGALI_TZ,
  });
  return `${formatIntakeDate(iso)}, ${time} CAT`;
}

/**
 * Where an intake sits relative to now.
 *
 *   upcoming — applications have not opened. The countdown runs to `opensAt`.
 *   open     — applications are being taken. The countdown runs to the deadline
 *              if there is one, otherwise to the first day of class.
 *   closed   — the deadline has passed (or, with no deadline, the course has
 *              already started).
 */
export type IntakePhase = "upcoming" | "open" | "closed";

export function intakePhase(intake: TrainingIntake, now: number): IntakePhase {
  const opens = Date.parse(intake.opensAt);
  if (now < opens) return "upcoming";

  const end = intake.closesAt ? Date.parse(intake.closesAt) : intake.startsAt ? Date.parse(intake.startsAt) : NaN;
  // No end date at all means the intake stays open until the admin unpublishes
  // it — better than guessing a deadline the client never gave.
  if (Number.isNaN(end)) return "open";
  return now < end ? "open" : "closed";
}

/** The instant the countdown is ticking towards in a given phase, if any. */
export function countdownTarget(intake: TrainingIntake, phase: IntakePhase): string | null {
  if (phase === "upcoming") return intake.opensAt;
  if (phase === "open") return intake.closesAt ?? intake.startsAt ?? null;
  return null;
}

export type CountdownParts = { days: number; hours: number; minutes: number; seconds: number };

/** Splits a remaining duration into whole units, floored at zero. */
export function countdownParts(remainingMs: number): CountdownParts {
  const total = Math.max(0, Math.floor(remainingMs / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
