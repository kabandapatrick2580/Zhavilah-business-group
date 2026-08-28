import "server-only";

// The training catalogue: two backends behind one pair of functions.
//
// WHY TWO
//
// The catalogue started as a JSON file, which works on any host with a real
// disk and is pleasant to develop against — you can open it in an editor and
// `git diff` it. It does not work on Vercel: the deployment bundle is
// read-only and each invocation may land on a fresh instance, so a save either
// fails outright or is lost on the next cold start. That is not a setting to
// change; a file store and serverless hosting are structurally incompatible.
//
// So writes go to Vercel Blob when a Blob store is connected, and to the file
// otherwise. The switch is the presence of BLOB_READ_WRITE_TOKEN, which Vercel
// injects automatically when you connect a store to the project. Nothing else
// in the app knows which one is in use.
//
// The file remains the SEED. On a deployment where the blob does not exist yet,
// `readTraining` falls back to the committed `data/training.json`, so a fresh
// deploy renders the catalogue immediately rather than an empty page. The first
// save creates the blob — and from that moment the blob is authoritative. See
// the warning on `readFromFile`.
//
// Everything the rest of the app touches goes through this module. Swapping in
// Sanity or Postgres later means reimplementing these two exported functions
// and nothing else.

import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { BlobError, get, put } from "@vercel/blob";
import { parseTrainingData, type TrainingData } from "@/lib/training/types";

// Resolved from the working directory, which Next sets to the project root in
// both `next dev` and `next start`.
const FILE = path.join(process.cwd(), "data", "training.json");

// A fixed pathname (no random suffix) so it can be read back by name.
const BLOB_PATH = "training/catalogue.json";

const EMPTY: TrainingData = { modules: [], intakes: [] };

/**
 * Vercel sets this automatically for a project with a Blob store connected.
 * Absent locally unless you `vercel env pull`, which is what keeps development
 * on the file.
 */
function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// ---------------------------------------------------------------------------
// The public pair
// ---------------------------------------------------------------------------

/**
 * Reads the catalogue. Never throws: any failure yields the committed seed (or
 * an empty catalogue), because a storage problem must not take /training down.
 */
export async function readTraining(): Promise<TrainingData> {
  if (blobConfigured()) {
    const stored = await readFromBlob();
    if (stored) return stored;
    // No blob yet — first deploy, before anything has been saved.
  }
  return readFromFile();
}

export type WriteResult = { ok: true } | { ok: false; reason: "readonly" | "failed"; message: string };

export async function writeTraining(data: TrainingData): Promise<WriteResult> {
  return blobConfigured() ? writeToBlob(data) : writeToFile(data);
}

// ---------------------------------------------------------------------------
// Vercel Blob
// ---------------------------------------------------------------------------

async function readFromBlob(): Promise<TrainingData | null> {
  try {
    // `useCache: false` reads from origin storage rather than the CDN. Without
    // it a save would not be visible until the edge TTL expired, which would
    // make the dashboard look broken for a minute after every edit — exactly
    // the window in which someone checks whether their change worked.
    const result = await get(BLOB_PATH, { access: "private", useCache: false });

    // `get` resolves to null when the blob does not exist. 304 cannot happen
    // here because no ifNoneMatch is sent, but the type allows it.
    if (!result || result.statusCode !== 200) return null;

    return parseTrainingData(JSON.parse(await new Response(result.stream).text()));
  } catch (error) {
    // Falls through to the committed seed. Logged rather than swallowed: the
    // page will render stale content and that should be visible in the logs.
    console.error("[training] could not read the blob, falling back to data/training.json:", error);
    return null;
  }
}

async function writeToBlob(data: TrainingData): Promise<WriteResult> {
  try {
    await put(BLOB_PATH, `${JSON.stringify(data, null, 2)}\n`, {
      // Private, which is both what the connected store is configured for and
      // the right default: nothing outside this module ever needs the blob's
      // URL. `readFromBlob` fetches it by pathname with the store token, so
      // there is no reader that a public URL would serve.
      //
      // The contents are only the marketing copy /training already publishes —
      // module titles, dates, a fee, a link to a form. Nothing with a person in
      // it may ever be stored here; private access does not change that rule,
      // it only removes the second copy of public data from the open web.
      access: "private",
      contentType: "application/json",
      // Overwrite one stable path rather than accumulating versioned blobs.
      addRandomSuffix: false,
      allowOverwrite: true,
      // Reads pass `useCache: false` anyway; this only bounds how long an
      // authorised direct fetch of the blob URL could be stale.
      cacheControlMaxAge: 60,
    });
    return { ok: true };
  } catch (error) {
    console.error("[training] could not write the blob:", error);
    return { ok: false, reason: "failed", message: blobFailureMessage(error) };
  }
}

/**
 * Turns a Blob failure into a message that names the fix.
 *
 * "Please try again" is the wrong advice for most of these: a token pointing at
 * a store that was deleted, or one left over from another project, fails
 * identically on every retry. The SDK raises a distinct error per cause, so the
 * causes with distinct fixes get distinct messages and only the genuinely
 * transient ones ask for a retry.
 *
 * Showing the underlying message is safe. This is behind the admin login, and
 * no Blob error carries the token or any part of it — they are fixed strings
 * prefixed "Vercel Blob:".
 */
function blobFailureMessage(error: unknown): string {
  const detail = error instanceof BlobError ? error.message : null;

  if (detail) {
    // Wrong, stale, or foreign token — the usual outcome of connecting a store
    // to a different project, or of a hand-set BLOB_READ_WRITE_TOKEN.
    if (detail.includes("Access denied")) {
      return (
        "Blob storage rejected this deployment's token. Reconnect the Blob store to this project " +
        "in the Vercel dashboard and redeploy — do not set BLOB_READ_WRITE_TOKEN by hand."
      );
    }
    if (detail.includes("This store does not exist")) {
      return (
        "The Blob store this deployment points at no longer exists. Create one under " +
        "Storage → Blob, connect it to this project, and redeploy."
      );
    }
    // Store access mode and the `access` option here must agree; they are set
    // in two different places, so the mismatch is easy to create and the SDK's
    // own wording does not say which of the two to change.
    if (detail.includes("private store") || detail.includes("public store")) {
      return (
        `Blob storage refused the write: ${detail} The \`access\` option in ` +
        "lib/training/store.ts must match how the store was created in the Vercel dashboard."
      );
    }
    if (detail.includes("suspended")) {
      return "The Blob store has been suspended. Check billing and usage limits in the Vercel dashboard.";
    }
    // Vercel's own outage or throttling: retrying really is the fix.
    if (detail.includes("not available") || detail.includes("Too many requests")) {
      return `${detail} Nothing was saved — try again in a moment.`;
    }
    return `The change could not be saved to Blob storage. ${detail}`;
  }

  // Not a BlobError at all — a network failure reaching the API, most likely.
  return (
    "The change could not be saved to Blob storage, and the failure did not come from Blob itself " +
    "(a network problem reaching the API, most likely). Check the deployment's runtime logs for " +
    "\"[training] could not write the blob\"."
  );
}

// ---------------------------------------------------------------------------
// Local filesystem
// ---------------------------------------------------------------------------

/**
 * Reads the committed file.
 *
 * WARNING: once a deployment has written its blob, this file is only the seed
 * for a *new* store — editing it in git and redeploying changes nothing that
 * anyone sees. Edit through /admin, or delete the blob to re-seed from here.
 */
async function readFromFile(): Promise<TrainingData> {
  try {
    return parseTrainingData(JSON.parse(await readFile(FILE, "utf8")));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    // ENOENT on a first run is expected and unremarkable; anything else is not.
    if (code !== "ENOENT") {
      console.error("[training] could not read data/training.json:", error);
    }
    return EMPTY;
  }
}

/**
 * Written to a sibling temp file and renamed into place: `rename` is atomic
 * within a filesystem, so a crash mid-write leaves the previous file intact
 * rather than a truncated one that would parse to an empty catalogue.
 */
async function writeToFile(data: TrainingData): Promise<WriteResult> {
  const temp = `${FILE}.${process.pid}.tmp`;
  try {
    await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    await rename(temp, FILE);
    return { ok: true };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    console.error("[training] could not write data/training.json:", error);

    // EROFS: read-only filesystem. EACCES/EPERM: no write permission. This is
    // the normal outcome of running the file backend on a serverless host, so
    // it names the fix rather than reporting a generic failure.
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      return {
        ok: false,
        reason: "readonly",
        message:
          "This server's filesystem is read-only, so the change could not be saved. " +
          "Connect a Vercel Blob store to the project and redeploy — see docs/TRAINING-DASHBOARD.md §6.",
      };
    }
    return { ok: false, reason: "failed", message: "The change could not be saved. Please try again." };
  }
}
