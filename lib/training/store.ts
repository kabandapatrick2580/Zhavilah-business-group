import "server-only";

// The training catalogue, stored as a JSON file on disk.
//
// WHY A FILE, AND WHAT IT COSTS
//
// This is a deliberate first step, not a destination. It gives the client a
// working dashboard with no database account to create, no migrations and no
// recurring cost — the same "blocked on an external account" problem that has
// held up `docs/CONTACT-FORM.md` and `docs/CMS-IMPLEMENTATION.md`.
//
// The price is that **writes only persist on a host with a writable, persistent
// filesystem** — a VPS, a container with a volume, or `next start` on your own
// machine. On Vercel and other serverless platforms the bundle is read-only and
// each invocation gets a fresh instance, so a save either fails outright or is
// silently lost on the next cold start. `writeTraining` detects the read-only
// case and reports it, so the dashboard says so instead of pretending to save.
//
// Everything the rest of the app touches goes through this module. Swapping the
// file for Postgres later means reimplementing these two functions and nothing
// else.

import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseTrainingData, type TrainingData } from "@/lib/training/types";

// Resolved from the working directory, which Next sets to the project root in
// both `next dev` and `next start`.
const FILE = path.join(process.cwd(), "data", "training.json");

const EMPTY: TrainingData = { modules: [], intakes: [] };

/**
 * Reads the catalogue. Never throws: a missing or corrupt file yields an empty
 * catalogue and logs, because a broken JSON file must not take /training down.
 */
export async function readTraining(): Promise<TrainingData> {
  try {
    const raw = await readFile(FILE, "utf8");
    return parseTrainingData(JSON.parse(raw));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    // ENOENT on a first run is expected and unremarkable; anything else is not.
    if (code !== "ENOENT") {
      console.error("[training] could not read data/training.json:", error);
    }
    return EMPTY;
  }
}

export type WriteResult = { ok: true } | { ok: false; reason: "readonly" | "failed"; message: string };

/**
 * Persists the catalogue.
 *
 * Written to a sibling temp file and renamed into place: `rename` is atomic
 * within a filesystem, so a crash mid-write leaves the previous file intact
 * rather than a truncated one that would parse to an empty catalogue.
 */
export async function writeTraining(data: TrainingData): Promise<WriteResult> {
  const temp = `${FILE}.${process.pid}.tmp`;
  try {
    await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    await rename(temp, FILE);
    return { ok: true };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    console.error("[training] could not write data/training.json:", error);

    // EROFS: read-only filesystem. EACCES/EPERM: no write permission. On a
    // serverless host the deployment bundle is read-only and this is the normal
    // outcome, so it gets its own message rather than a generic failure.
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      return {
        ok: false,
        reason: "readonly",
        message:
          "The server's filesystem is read-only, so this change could not be saved. " +
          "The JSON store needs a host with a writable disk — see docs/TRAINING-DASHBOARD.md.",
      };
    }
    return { ok: false, reason: "failed", message: "The change could not be saved. Please try again." };
  }
}
