"use client";

// One form for both crafting a new intake and editing an existing one — see
// the note at the top of ModuleForm.tsx for why they are not written twice.

import { useActionState, useEffect, useRef } from "react";
import { CalendarPlus, Check } from "lucide-react";
import { createIntakeAction, updateIntakeAction } from "@/app/admin/actions";
import { Feedback, Field, SubmitButton, TextArea, TextInput } from "@/components/admin/ui";
import { isoToLocalInput } from "@/lib/training/dates";
import type { TrainingIntake } from "@/lib/training/types";

export default function IntakeForm({
  intake,
  onSaved,
}: {
  /** Present when editing; absent when creating. */
  intake?: TrainingIntake;
  onSaved?: () => void;
}) {
  const editing = intake !== undefined;
  const [state, formAction] = useActionState(editing ? updateIntakeAction : createIntakeAction, {});
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.success) return;
    if (editing) onSaved?.();
    else form.current?.reset();
  }, [state.success, editing, onSaved]);

  // Namespaced so several forms can be open on the page without colliding ids.
  const key = intake?.id ?? "new";

  return (
    <form ref={form} action={formAction} className="flex flex-col gap-5">
      <Feedback state={state} />
      {editing ? <input type="hidden" name="id" value={intake.id} /> : null}

      <Field label="Intake title" htmlFor={`${key}-title`} required>
        <TextInput
          id={`${key}-title`}
          name="title"
          required
          maxLength={160}
          defaultValue={intake?.title}
          placeholder="October 2026 Practical Accounting Intake"
        />
      </Field>

      <Field
        label="Summary"
        htmlFor={`${key}-summary`}
        hint="One or two sentences. This is the paragraph under the heading on the training page."
      >
        <TextArea
          id={`${key}-summary`}
          name="summary"
          rows={3}
          defaultValue={intake?.summary}
          placeholder="Twelve evening sessions covering the full practical accounting, taxation and QuickBooks syllabus."
        />
      </Field>

      {/* All three are entered as Kigali wall-clock time and stored as UTC —
          see the note in lib/training/dates.ts. */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="Applications open"
          htmlFor={`${key}-opensAt`}
          required
          hint="The countdown on the website runs to this moment."
        >
          <TextInput
            id={`${key}-opensAt`}
            name="opensAt"
            type="datetime-local"
            required
            defaultValue={intake ? isoToLocalInput(intake.opensAt) : undefined}
          />
        </Field>

        <Field label="Applications close" htmlFor={`${key}-closesAt`} hint="Optional deadline.">
          <TextInput
            id={`${key}-closesAt`}
            name="closesAt"
            type="datetime-local"
            defaultValue={intake?.closesAt ? isoToLocalInput(intake.closesAt) : undefined}
          />
        </Field>

        <Field label="Training starts" htmlFor={`${key}-startsAt`} hint="Optional first day of class.">
          <TextInput
            id={`${key}-startsAt`}
            name="startsAt"
            type="datetime-local"
            defaultValue={intake?.startsAt ? isoToLocalInput(intake.startsAt) : undefined}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Delivery" htmlFor={`${key}-mode`} hint="Classroom, Online, Hybrid, Evenings & weekends…">
          <TextInput id={`${key}-mode`} name="mode" defaultValue={intake?.mode} placeholder="Classroom & online" />
        </Field>

        <Field label="Location" htmlFor={`${key}-location`}>
          <TextInput
            id={`${key}-location`}
            name="location"
            defaultValue={intake?.location}
            placeholder="Ikaze House, Remera-Gisimenti"
          />
        </Field>

        <Field label="Fee" htmlFor={`${key}-fee`} hint="Free text, so it can carry the currency and any qualifier.">
          <TextInput
            id={`${key}-fee`}
            name="fee"
            defaultValue={intake?.fee}
            placeholder="RWF 150,000 per participant"
          />
        </Field>

        <Field label="Seats" htmlFor={`${key}-seats`} hint="Optional. Shown as the capacity of the intake.">
          <TextInput
            id={`${key}-seats`}
            name="seats"
            type="number"
            min={1}
            step={1}
            defaultValue={intake?.seats}
            placeholder="25"
          />
        </Field>
      </div>

      <Field
        label="Application link"
        htmlFor={`${key}-applicationUrl`}
        required
        hint="The full https:// address of the form applicants fill in — a Google Form, for example. It opens in a new tab."
      >
        <TextInput
          id={`${key}-applicationUrl`}
          name="applicationUrl"
          type="url"
          required
          inputMode="url"
          defaultValue={intake?.applicationUrl}
          placeholder="https://forms.gle/…"
        />
      </Field>

      <label className="flex items-start gap-3 rounded-lg border border-brand-line bg-brand-haze/60 p-4">
        <input
          type="checkbox"
          name="published"
          defaultChecked={intake ? intake.published : true}
          className="mt-0.5 size-4 shrink-0 accent-[#251f61]"
        />
        <span className="text-sm text-brand-ink">
          <span className="font-semibold">{editing ? "Published" : "Publish immediately"}</span>
          <span className="mt-0.5 block text-brand-muted">
            Untick to {editing ? "hide it from the public page" : "save it as a draft"}. Drafts are visible
            here but never on the public page.
          </span>
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>
          {editing ? (
            <>
              <Check className="size-4" /> Save changes
            </>
          ) : (
            <>
              <CalendarPlus className="size-4" /> Create intake
            </>
          )}
        </SubmitButton>

        {editing ? (
          <button
            type="button"
            onClick={onSaved}
            className="rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-muted transition hover:text-brand-ink"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
