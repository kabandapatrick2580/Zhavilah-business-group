"use client";

// The dashboard's small vocabulary of form and layout pieces.
//
// It is deliberately its own set rather than the marketing site's: this is a
// tool, not a page, so the type is smaller, the spacing tighter and the
// controls have visible borders and focus rings. The palette is still the
// brand's navy so it does not feel like a different product.

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function Panel({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-brand-line bg-white shadow-[0_10px_30px_rgba(11,38,74,0.05)]">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-line px-6 py-5">
        <div>
          <h2 className="font-heading text-lg font-extrabold text-brand-ink">{title}</h2>
          {description ? <p className="mt-1 max-w-2xl text-sm text-brand-muted">{description}</p> : null}
        </div>
        {actions}
      </header>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-brand-ink">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-brand-muted">{hint}</p> : null}
    </div>
  );
}

const CONTROL =
  "w-full rounded-lg border border-brand-line bg-white px-3.5 py-2.5 text-sm text-brand-ink " +
  "outline-none transition placeholder:text-brand-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${CONTROL} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${CONTROL} resize-y leading-relaxed ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${CONTROL} ${props.className ?? ""}`} />;
}

/**
 * A submit button wired to the enclosing form's pending state.
 *
 * `useFormStatus` only reports the form it is rendered inside, which is why
 * every row's delete button can have its own spinner without the page tracking
 * which row is busy.
 */
export function SubmitButton({
  children,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    ghost: "border border-brand-line bg-white text-brand-ink hover:border-brand/40 hover:text-brand",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",
  }[variant];

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

/** Inline result of the last action. `role="status"` so it is announced. */
export function Feedback({ state }: { state: { error?: string; success?: string } }) {
  if (!state.error && !state.success) return null;
  const error = Boolean(state.error);
  return (
    <p
      role="status"
      className={`rounded-lg border px-3.5 py-2.5 text-sm ${
        error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {state.error ?? state.success}
    </p>
  );
}
