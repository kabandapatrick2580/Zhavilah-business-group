"use client";

// Footer newsletter signup. Same reasoning as the contact form — submit in
// place, answer in place — but a single field needs only a single message.

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { HONEYPOT_FIELD, isValidEmail } from "@/lib/contact";
import Turnstile, { TURNSTILE_SITE_KEY } from "@/components/Turnstile";

type Status = "idle" | "sending" | "sent" | "error";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const renderedAt = useRef(Date.now());

  // This form sits in the footer of every page, so the widget is mounted only
  // once someone actually engages with it. Loading Cloudflare's script on every
  // page view to guard a field most visitors never touch is not a trade worth
  // making.
  const [engaged, setEngaged] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    if (TURNSTILE_SITE_KEY && !token) {
      setStatus("error");
      setMessage("Please complete the verification check, then try again.");
      return;
    }

    setStatus("sending");
    setMessage(null);
    try {
      const honeypot = new FormData(event.currentTarget).get(HONEYPOT_FIELD);
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          [HONEYPOT_FIELD]: honeypot ?? "",
          renderedAt: renderedAt.current,
          turnstileToken: token,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      // Spent either way — reissue before any retry.
      setToken("");
      setResetSignal((n) => n + 1);

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setEmail("");
      setStatus("sent");
      setMessage("Thank you — you're on the list.");
    } catch {
      setToken("");
      setResetSignal((n) => n + 1);
      setStatus("error");
      setMessage("We couldn't reach the server. Please try again.");
    }
  }

  const busy = status === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto mt-8 max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          value={email}
          required
          disabled={busy}
          placeholder="Enter Your Email"
          aria-label="Email address"
          aria-invalid={status === "error"}
          onFocus={() => setEngaged(true)}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") {
              setStatus("idle");
              setMessage(null);
            }
          }}
          className="w-full rounded-md border border-white/20 bg-white px-4 py-3 text-body outline-none focus:border-accent disabled:opacity-60"
        />
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy ? (
            <>
              Subscribing… <Loader2 className="size-4 animate-spin" />
            </>
          ) : (
            "Subscribe now"
          )}
        </button>
      </div>
      {engaged ? (
        <Turnstile
          onToken={setToken}
          resetSignal={resetSignal}
          theme="auto"
          className="mt-3 flex justify-center"
        />
      ) : null}

      {message ? (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`mt-3 text-sm ${status === "error" ? "text-red-200" : "text-sky"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
