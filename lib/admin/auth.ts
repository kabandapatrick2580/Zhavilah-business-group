import "server-only";

// Admin authentication: one account, defined entirely by environment variables.
//
// There is no user table because there is no second user. The client's office
// needs one person to be able to edit the training catalogue; modelling that as
// a database of accounts, password resets and roles would be more machinery
// than the problem has. The credentials live where the Resend and Turnstile
// keys already live — in the environment, set once in the host's dashboard.
//
// The session is a cookie carrying a payload and an HMAC signature over it.
// Nothing is stored server-side, so the cookie must be self-verifying: if the
// signature made with ADMIN_SESSION_SECRET doesn't match, the cookie was forged
// or tampered with and is rejected. Rotating that secret logs everyone out.

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "zbg_admin_session";

/** Eight hours — a working day, after which an unattended browser is logged out. */
const SESSION_SECONDS = 8 * 60 * 60;

export type AdminSession = { username: string; expiresAt: number };

type Config = { username: string; password: string; secret: string };

/**
 * Reads the three variables the admin area needs.
 *
 * Returns null when any is missing, and every caller treats that as "no admin
 * exists" — login always fails and the dashboard is unreachable. Failing closed
 * matters here: an admin area that defaults to a blank password because the env
 * wasn't set is worse than one that is switched off.
 */
function config(): Config | null {
  const username = process.env.ADMIN_USERNAME ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!username || !password || !secret) return null;
  return { username, password, secret };
}

export function isAdminConfigured(): boolean {
  return config() !== null;
}

/**
 * Constant-time credential check.
 *
 * Both sides are hashed first so the comparison is always over 32 bytes:
 * `timingSafeEqual` throws on a length mismatch, and comparing raw secrets
 * would leak their length through that throw.
 */
export function verifyCredentials(username: string, password: string): boolean {
  const conf = config();
  if (!conf) return false;
  // Both are evaluated — no `&&` short-circuit — so a wrong username and a
  // wrong password take the same time.
  const userOk = equalSecrets(username, conf.username);
  const passOk = equalSecrets(password, conf.password);
  return userOk && passOk;
}

function equalSecrets(a: string, b: string): boolean {
  const secret = config()?.secret ?? "";
  // Keyed digests rather than plain SHA-256: without the key an attacker who
  // could observe the comparison could precompute digests to test guesses.
  const digestA = createHmac("sha256", secret).update(a).digest();
  const digestB = createHmac("sha256", secret).update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeSession(session: AdminSession, secret: string): string {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

function decodeSession(token: string): AdminSession | null {
  const conf = config();
  if (!conf) return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;
  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const expected = sign(payload, conf.secret);
  if (signature.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;
  const { username, expiresAt } = parsed as Record<string, unknown>;
  if (typeof username !== "string" || typeof expiresAt !== "number") return null;

  // Checked here as well as in the cookie's Max-Age, because Max-Age is only
  // enforced by a cooperating browser and this cookie can be replayed by hand.
  if (Date.now() >= expiresAt) return null;

  // A signature stays valid after the username changes in the environment, so
  // the name is re-checked rather than trusted from the payload.
  if (username !== conf.username) return null;

  return { username, expiresAt };
}

export async function startSession(username: string): Promise<void> {
  const conf = config();
  if (!conf) return;

  const session: AdminSession = { username, expiresAt: Date.now() + SESSION_SECONDS * 1000 };
  const store = await cookies();
  store.set(COOKIE_NAME, encodeSession(session, conf.secret), {
    httpOnly: true,
    // Dropped in development so the cookie survives plain-HTTP localhost.
    secure: process.env.NODE_ENV === "production",
    // "lax" still sends the cookie on a top-level navigation into /admin, while
    // withholding it from cross-site POSTs — the CSRF shape that matters for
    // the server actions behind the dashboard.
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** The current session, or null. Reading cookies makes the caller dynamic. */
export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token ? decodeSession(token) : null;
}

/**
 * Generates a secret suitable for ADMIN_SESSION_SECRET. Not used at runtime —
 * it exists so the setup instructions can point at real code rather than ask
 * the reader to trust an opaque string.
 */
export function generateSessionSecret(): string {
  return randomBytes(32).toString("base64url");
}
