// Outbound mail via Resend's REST API.
//
// Called with fetch rather than the `resend` SDK: the API is a single POST and
// avoiding the dependency keeps the bundle and the upgrade surface smaller.

const ENDPOINT = "https://api.resend.com/emails";

export type SendMailInput = {
  subject: string;
  html: string;
  text: string;
  /** Where a reply from the team should go — i.e. the person who wrote in. */
  replyTo?: string;
};

export type SendMailResult = { ok: true } | { ok: false; reason: string };

/**
 * Escapes user-supplied text for interpolation into the HTML body. Without
 * this, a message containing markup would be rendered as markup in whatever
 * client opens the notification.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendMail({ subject, html, text, replyTo }: SendMailInput): Promise<SendMailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  // Missing configuration is a deployment mistake, not a user error. Fail
  // loudly in the log so it surfaces, and let the caller return a generic
  // message rather than leaking which variable is absent.
  if (!apiKey || !from || !to) {
    console.error(
      "[mail] Missing configuration — set RESEND_API_KEY, CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL.",
    );
    return { ok: false, reason: "not-configured" };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: [replyTo] } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[mail] Resend responded ${response.status}: ${detail}`);
      return { ok: false, reason: "provider-error" };
    }

    return { ok: true };
  } catch (error) {
    console.error("[mail] Request to Resend failed:", error);
    return { ok: false, reason: "network-error" };
  }
}
