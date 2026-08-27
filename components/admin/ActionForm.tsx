"use client";

// A one-button form bound to a Server Action, for the row-level operations
// (delete, publish, reorder) that carry no fields beyond an id.
//
// `confirmLabel` turns it into a two-step control: the first click swaps the
// button for a confirmation pair. That is used instead of `window.confirm`
// because a native dialog blocks the whole page and looks like a browser
// warning rather than part of the tool.

import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/admin/ui";
import type { ActionState } from "@/app/admin/actions";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export default function ActionForm({
  action,
  fields,
  label,
  confirmLabel,
  variant = "ghost",
  title,
  disabled,
  onResult,
}: {
  action: Action;
  fields: Record<string, string>;
  label: React.ReactNode;
  confirmLabel?: string;
  variant?: "primary" | "ghost" | "danger";
  title?: string;
  disabled?: boolean;
  /** Lets a parent surface the result somewhere other than under the button. */
  onResult?: (state: ActionState) => void;
}) {
  const [state, formAction] = useActionState(async (prev: ActionState, formData: FormData) => {
    const result = await action(prev, formData);
    onResult?.(result);
    return result;
  }, {});
  const [confirming, setConfirming] = useState(false);

  if (disabled) {
    return (
      <span
        title={title}
        className="inline-flex cursor-not-allowed items-center rounded-lg border border-brand-line px-3 py-2 text-sm text-brand-muted/50"
      >
        {label}
      </span>
    );
  }

  if (confirmLabel && !confirming) {
    return (
      <button
        type="button"
        title={title}
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-brand-line bg-white px-3 py-2 text-sm font-semibold text-brand-ink transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
      >
        {label}
      </button>
    );
  }

  return (
    <form action={formAction} className="inline-flex flex-wrap items-center gap-2">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {confirmLabel ? (
        <>
          <span className="text-sm text-brand-muted">{confirmLabel}</span>
          <SubmitButton variant="danger" className="!px-3 !py-2">
            Yes, remove
          </SubmitButton>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-brand-muted transition hover:text-brand-ink"
          >
            Cancel
          </button>
        </>
      ) : (
        <SubmitButton variant={variant} className="!px-3 !py-2">
          {label}
        </SubmitButton>
      )}

      {state.error ? <span className="text-sm text-red-700">{state.error}</span> : null}
    </form>
  );
}
