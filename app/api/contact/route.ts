// Receives the contact form and forwards it to the office inbox.
//
// Everything the client already checked is checked again here, because the
// client is not a trust boundary — this endpoint is public and can be POSTed to
// directly.

import { NextResponse } from "next/server";
import {
  HONEYPOT_FIELD,
  hasErrors,
  validateContact,
  type ContactFields,
} from "@/lib/contact";
import { escapeHtml, sendMail } from "@/lib/mail";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

// Reading a field that may be absent or a non-string from an untrusted body.
function field(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const { allowed, retryAfter } = rateLimit(clientKey(request), LIMIT, WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've sent several messages already. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // A filled honeypot means a bot. Answer 200 so it has no signal to adapt to,
  // and drop the submission.
  if (field(body, HONEYPOT_FIELD)) {
    return NextResponse.json({ ok: true });
  }

  const fields: ContactFields = {
    name: field(body, "name"),
    email: field(body, "email"),
    phone: field(body, "phone"),
    subject: field(body, "subject"),
    service: field(body, "service"),
    message: field(body, "message"),
  };

  const errors = validateContact(fields);
  if (hasErrors(errors)) {
    return NextResponse.json({ error: "Please check the highlighted fields.", errors }, { status: 400 });
  }

  // Both dropdown values go in the subject line so the inbox can be triaged
  // and filtered without opening anything.
  const result = await sendMail({
    subject: `${fields.subject} — ${fields.service}`,
    replyTo: fields.email,
    text: [
      `Name:    ${fields.name}`,
      `Email:   ${fields.email}`,
      `Phone:   ${fields.phone}`,
      `Enquiry: ${fields.subject}`,
      `Service: ${fields.service}`,
      "",
      fields.message,
    ].join("\n"),
    html: `
      <h2 style="font-family:sans-serif">New enquiry from the website</h2>
      <table style="font-family:sans-serif;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0"><strong>Name</strong></td><td>${escapeHtml(fields.name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><strong>Email</strong></td><td>${escapeHtml(fields.email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><strong>Phone</strong></td><td>${escapeHtml(fields.phone)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><strong>Enquiry</strong></td><td>${escapeHtml(fields.subject)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><strong>Service</strong></td><td>${escapeHtml(fields.service)}</td></tr>
      </table>
      <p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(fields.message)}</p>
    `,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error:
          "We couldn't send your message just now. Please try again, or email us directly at info@zhavilahbusinessgroup.com.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
