"use server";

// Every mutation the dashboard performs.
//
// These are Server Actions, which means each one is a public POST endpoint with
// a generated name — being unreachable from the UI is not protection. So every
// action that touches data calls `requireAdmin()` first, and validates its own
// input, exactly as `app/api/contact/route.ts` re-checks everything the contact
// form already checked on the client.

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { endSession, getSession, startSession, verifyCredentials, isAdminConfigured } from "@/lib/admin/auth";
import { rateLimit } from "@/lib/rate-limit";
import { readTraining, writeTraining, type WriteResult } from "@/lib/training/store";
import { isIconName, type TrainingData, type TrainingIntake, type TrainingModule } from "@/lib/training/types";
import { localInputToIso } from "@/lib/training/dates";

export type ActionState = { error?: string; success?: string };

// Five attempts per fifteen minutes. The limiter is per-instance and the
// caveat in `lib/rate-limit.ts` applies — a flood spread across cold starts
// gets through — but this endpoint guards one password rather than a user
// table, and slowing an online guessing attack is worth the four lines.
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isAdminConfigured()) {
    return { error: "The admin area is not configured on this server. See docs/TRAINING-DASHBOARD.md." };
  }

  const { allowed } = rateLimit(`admin-login:${await requestKey()}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (!allowed) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const username = text(formData, "username");
  const password = text(formData, "password");
  if (!username || !password) return { error: "Enter your username and password." };

  // One message for both failure modes: naming which half was wrong tells an
  // attacker when they have found a valid username.
  if (!verifyCredentials(username, password)) {
    return { error: "Those credentials were not recognised." };
  }

  await startSession(username);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/**
 * Guard for every data action. Redirects rather than throwing so an expired
 * session lands on the login form instead of an error page.
 */
async function requireAdmin(): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------

const MAX_MODULE_ITEMS = 60;

export async function createModuleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const title = text(formData, "title");
  if (!title) return { error: "Give the module a title." };
  if (title.length > 160) return { error: "That title is too long — keep it under 160 characters." };

  const iconValue = text(formData, "icon");
  const icon = isIconName(iconValue) ? iconValue : "book";

  // One topic per line is how the office already writes a syllabus; splitting
  // on newlines means they can paste one straight out of a document.
  const items = text(formData, "items")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, MAX_MODULE_ITEMS);

  if (items.length === 0) return { error: "Add at least one topic, one per line." };

  const summary = text(formData, "summary");
  const module: TrainingModule = {
    id: makeId(title),
    title,
    icon,
    ...(summary ? { summary } : {}),
    items,
  };

  return save((data) => ({ ...data, modules: [...data.modules, module] }), `"${title}" was added.`);
}

export async function deleteModuleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const data = await readTraining();
  const target = data.modules.find((module) => module.id === id);
  if (!target) return { error: "That module no longer exists." };

  return save(
    (current) => ({ ...current, modules: current.modules.filter((module) => module.id !== id) }),
    `"${target.title}" was removed.`,
  );
}

/** Moves a module one place up or down, which is the order /training renders. */
export async function moveModuleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const direction = text(formData, "direction") === "up" ? -1 : 1;

  return save((data) => {
    const index = data.modules.findIndex((module) => module.id === id);
    const next = index + direction;
    if (index === -1 || next < 0 || next >= data.modules.length) return data;

    const modules = [...data.modules];
    [modules[index], modules[next]] = [modules[next]!, modules[index]!];
    return { ...data, modules };
  }, "Order updated.");
}

// ---------------------------------------------------------------------------
// Intakes
// ---------------------------------------------------------------------------

export async function createIntakeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const title = text(formData, "title");
  if (!title) return { error: "Give the intake a title." };

  const opensAt = localInputToIso(text(formData, "opensAt"));
  if (!opensAt) return { error: "Set the date applications open — that is what the countdown runs to." };

  const closesAt = localInputToIso(text(formData, "closesAt"));
  const startsAt = localInputToIso(text(formData, "startsAt"));

  if (closesAt && Date.parse(closesAt) <= Date.parse(opensAt)) {
    return { error: "The application deadline has to be after applications open." };
  }
  if (startsAt && closesAt && Date.parse(startsAt) < Date.parse(closesAt)) {
    return { error: "The training cannot start before the application deadline." };
  }

  const applicationUrl = safeUrl(text(formData, "applicationUrl"));
  if (!applicationUrl) {
    return { error: "Paste the full application link, starting with https:// (a Google Form, for example)." };
  }

  const seatsRaw = text(formData, "seats");
  const seatsNumber = Number(seatsRaw);
  if (seatsRaw && (!Number.isFinite(seatsNumber) || seatsNumber < 1)) {
    return { error: "Seats has to be a whole number, or left blank." };
  }

  const intake: TrainingIntake = {
    id: makeId(title),
    title,
    summary: text(formData, "summary"),
    opensAt,
    ...(closesAt ? { closesAt } : {}),
    ...(startsAt ? { startsAt } : {}),
    ...optional(formData, "mode"),
    ...optional(formData, "location"),
    ...optional(formData, "fee"),
    ...(seatsRaw ? { seats: Math.floor(seatsNumber) } : {}),
    applicationUrl,
    published: formData.get("published") !== null,
    createdAt: new Date().toISOString(),
  };

  return save((data) => ({ ...data, intakes: [intake, ...data.intakes] }), `"${title}" was created.`);
}

export async function deleteIntakeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const data = await readTraining();
  const target = data.intakes.find((intake) => intake.id === id);
  if (!target) return { error: "That intake no longer exists." };

  return save(
    (current) => ({ ...current, intakes: current.intakes.filter((intake) => intake.id !== id) }),
    `"${target.title}" was removed.`,
  );
}

/** Publishing is the switch between "drafted in the dashboard" and "live on /training". */
export async function toggleIntakeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const publish = text(formData, "publish") === "true";

  return save(
    (data) => ({
      ...data,
      intakes: data.intakes.map((intake) => (intake.id === id ? { ...intake, published: publish } : intake)),
    }),
    publish ? "Intake published — it is now live on /training." : "Intake hidden from /training.",
  );
}

// ---------------------------------------------------------------------------
// Shared plumbing
// ---------------------------------------------------------------------------

/**
 * Read, transform, write, revalidate.
 *
 * The read happens inside the action rather than being passed in, so the write
 * is based on what is on disk right now. Two admins editing at once would still
 * be last-write-wins — acceptable for a single-account dashboard, and the point
 * at which it stops being acceptable is the point at which this needs a real
 * database.
 */
async function save(transform: (data: TrainingData) => TrainingData, success: string): Promise<ActionState> {
  const data = await readTraining();
  const result: WriteResult = await writeTraining(transform(data));
  if (!result.ok) return { error: result.message };

  // /training is statically rendered, so it keeps serving the previous HTML
  // until the cache entry for it is dropped. The dashboard's own pages read
  // cookies and are already dynamic, but are listed for clarity.
  revalidatePath("/training");
  revalidatePath("/admin");
  revalidatePath("/admin/modules");
  revalidatePath("/admin/intakes");

  return { success };
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optional(formData: FormData, key: string): Record<string, string> {
  const value = text(formData, key);
  return value ? { [key]: value } : {};
}

/**
 * Accepts only absolute http(s) URLs.
 *
 * This is the security check on the whole feature: the value is rendered into
 * an `href` on a public page, so `javascript:` — and anything else that is not
 * a plain web link — has to be rejected here, not filtered at render time.
 */
function safeUrl(value: string): string | null {
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
}

/**
 * A readable slug plus a short random suffix. The slug makes the JSON file
 * legible when someone opens it in an editor; the suffix guarantees uniqueness
 * without having to scan the existing records.
 */
function makeId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${slug || "item"}-${randomUUID().slice(0, 8)}`;
}

/** Best-effort client identity for the login limiter, mirroring `clientKey`. */
async function requestKey(): Promise<string> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return list.get("x-real-ip")?.trim() || "unknown";
}
