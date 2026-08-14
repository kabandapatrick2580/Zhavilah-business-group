// Receives the footer subscribe form.
//
// Subscriptions currently arrive as mail to the office inbox rather than going
// into a list provider — that is enough while the list is small, and swapping
// sendMail for an API call is the only change needed later.

import { NextResponse } from "next/server";
import { HONEYPOT_FIELD, MIN_FILL_MS, isValidEmail, submittedTooFast } from "@/lib/contact";
import { escapeHtml, sendMail } from "@/lib/mail";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const { allowed, retryAfter } = rateLimit(`subscribe:${clientKey(request)}`, LIMIT, WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: "Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (typeof body[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD]) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (submittedTooFast(body.renderedAt, MIN_FILL_MS.subscribe)) {
    return NextResponse.json(
      { error: "That was a little too quick — please try again." },
      { status: 400 },
    );
  }

  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  const verification = await verifyTurnstile(token, clientKey(request));
  if (!verification.ok && verification.reason !== "unreachable") {
    return NextResponse.json(
      { error: "We couldn't verify that you're human. Please try again." },
      { status: 403 },
    );
  }

  const result = await sendMail({
    subject: "New newsletter subscription",
    replyTo: email,
    text: `New subscriber: ${email}`,
    html: `<p style="font-family:sans-serif">New subscriber: <strong>${escapeHtml(email)}</strong></p>`,
  });

  if (!result.ok) {
    return NextResponse.json({ error: "We couldn't sign you up just now. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
