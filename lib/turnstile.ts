// Server-side verification of Cloudflare Turnstile tokens.
//
// This is the layer the honeypot can't provide. The honeypot only catches a bot
// that renders the form and fills every field; anything POSTing JSON straight at
// the endpoint simply omits the field and passes. A Turnstile token has to be
// issued by Cloudflare and is verified here against their API, so a scripted
// client can't forge one.

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { ok: true; skipped: boolean }
  | { ok: false; reason: "missing-token" | "rejected" | "unreachable" };

export async function verifyTurnstile(token: string, ip: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Fail open when unconfigured, matching how sendMail treats missing keys: a
  // deployment that hasn't been set up yet stays usable rather than rejecting
  // every visitor. The trade is that a production deploy missing the secret is
  // silently unprotected, so the warning is deliberately loud — check for it in
  // the logs after any deploy.
  if (!secret) {
    console.warn(
      "[turnstile] TURNSTILE_SECRET_KEY is not set — bot verification is DISABLED for this request.",
    );
    return { ok: true, skipped: true };
  }

  if (!token) return { ok: false, reason: "missing-token" };

  try {
    const body = new URLSearchParams({ secret, response: token });
    // Cloudflare uses the IP to score the challenge; "unknown" from clientKey
    // would be meaningless to them, so it is only sent when real.
    if (ip && ip !== "unknown") body.set("remoteip", ip);

    const response = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = (await response.json().catch(() => null)) as
      | { success?: boolean; "error-codes"?: string[] }
      | null;

    if (!data?.success) {
      console.warn(`[turnstile] Rejected: ${data?.["error-codes"]?.join(", ") ?? "no detail"}`);
      return { ok: false, reason: "rejected" };
    }

    return { ok: true, skipped: false };
  } catch (error) {
    // Reported separately from "rejected" so the caller can distinguish "this
    // looks like a bot" from "we couldn't tell". The routes let this one
    // through: an outage at Cloudflare must not take the contact form down,
    // and the honeypot, timing and rate-limit layers still apply.
    console.error("[turnstile] Verification request failed:", error);
    return { ok: false, reason: "unreachable" };
  }
}
