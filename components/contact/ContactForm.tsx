"use client";

// The contact form.
//
// Submits with fetch rather than a native POST so the visitor stays on the page
// and gets an answer in place — a navigation away to a thank-you screen loses
// the context they were reading, and a failed send would otherwise be a dead
// end. Validation runs here for speed and again on the server for trust.

import { useRef, useState } from "react";
import { ChevronRight, CircleCheckBig, Loader2, TriangleAlert } from "lucide-react";
import {
  EMPTY_CONTACT,
  HONEYPOT_FIELD,
  hasErrors,
  validateContact,
  type ContactFields,
  type FieldErrors,
} from "@/lib/contact";

const inputClass =
  "w-full rounded-lg border bg-[#f7faff] px-4 py-3.5 text-brand-ink outline-none transition focus:border-brand disabled:opacity-60";

type Status = "idle" | "sending" | "sent";

export default function ContactForm() {
  const [values, setValues] = useState<ContactFields>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const update = (key: keyof ContactFields) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as it's touched: keeping it visible while
    // the visitor is actively fixing it reads as the form arguing back.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setFormError(null);
    const found = validateContact(values);
    if (hasErrors(found)) {
      setErrors(found);
      return;
    }

    setStatus("sending");
    try {
      const honeypot = new FormData(event.currentTarget).get(HONEYPOT_FIELD);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, [HONEYPOT_FIELD]: honeypot ?? "" }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        errors?: FieldErrors;
      };

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        setFormError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        errorRef.current?.focus();
        return;
      }

      setValues(EMPTY_CONTACT);
      setStatus("sent");
    } catch {
      setFormError(
        "We couldn't reach the server. Please check your connection and try again.",
      );
      setStatus("idle");
      errorRef.current?.focus();
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-8 rounded-2xl border border-brand-line bg-brand-sky/40 p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-white text-brand">
          <CircleCheckBig className="size-7" />
        </span>
        <h3 className="mt-5 font-heading text-2xl font-extrabold text-brand-ink">
          Thank you for reaching out!
        </h3>
        <p className="mt-3 text-brand-muted">
          Your message has been sent. A member of our team will get back to you as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-brand underline underline-offset-4 transition hover:text-brand-dark"
        >
          Send another message
        </button>
      </div>
    );
  }

  const busy = status === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="name"
          placeholder="Your Name"
          value={values.name}
          error={errors.name}
          onChange={update("name")}
          disabled={busy}
          autoComplete="name"
        />
        <Field
          name="email"
          type="email"
          placeholder="Your E-mail"
          value={values.email}
          error={errors.email}
          onChange={update("email")}
          disabled={busy}
          autoComplete="email"
        />
        <Field
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={values.phone}
          error={errors.phone}
          onChange={update("phone")}
          disabled={busy}
          autoComplete="tel"
        />
        <Field
          name="subject"
          placeholder="Subject"
          value={values.subject}
          error={errors.subject}
          onChange={update("subject")}
          disabled={busy}
        />
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Your Message"
          value={values.message}
          disabled={busy}
          onChange={(e) => update("message")(e.target.value)}
          aria-label="Your Message"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "error-message" : undefined}
          className={`${inputClass} h-40 resize-none ${
            errors.message ? "border-red-500" : "border-brand-line"
          }`}
        />
        {errors.message ? <FieldError id="error-message">{errors.message}</FieldError> : null}
      </div>

      {/* Honeypot — hidden from people, offered to bots. aria-hidden and
          tabIndex keep it out of the accessibility tree and tab order. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Company website</label>
        <input
          type="text"
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {formError ? (
        <p
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 outline-none"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {busy ? (
          <>
            Sending… <Loader2 className="size-4 animate-spin" />
          </>
        ) : (
          <>
            Submit Now <ChevronRight className="size-4" />
          </>
        )}
      </button>

      {/* Announced to screen readers without stealing focus mid-typing. */}
      <span aria-live="polite" className="sr-only">
        {busy ? "Sending your message" : ""}
      </span>
    </form>
  );
}

function Field({
  name,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
  disabled,
  autoComplete,
}: {
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled: boolean;
  autoComplete?: string;
}) {
  const errorId = `error-${name}`;
  return (
    <div>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClass} ${error ? "border-red-500" : "border-brand-line"}`}
      />
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {children}
    </p>
  );
}
