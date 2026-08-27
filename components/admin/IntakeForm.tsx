"use client";

import { useActionState, useEffect, useRef } from "react";
import { CalendarPlus } from "lucide-react";
import { createIntakeAction } from "@/app/admin/actions";
import { Feedback, Field, SubmitButton, TextArea, TextInput } from "@/components/admin/ui";

export default function IntakeForm() {
  const [state, formAction] = useActionState(createIntakeAction, {});
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) form.current?.reset();
  }, [state.success]);

  return (
    <form ref={form} action={formAction} className="flex flex-col gap-5">
      <Feedback state={state} />

      <Field label="Intake title" htmlFor="intake-title" required>
        <TextInput
          id="intake-title"
          name="title"
          required
          maxLength={160}
          placeholder="October 2026 Practical Accounting Intake"
        />
      </Field>

      <Field
        label="Summary"
        htmlFor="intake-summary"
        hint="One or two sentences. This is the paragraph under the heading on the training page."
      >
        <TextArea
          id="intake-summary"
          name="summary"
          rows={3}
          placeholder="Twelve evening sessions covering the full practical accounting, taxation and QuickBooks syllabus."
        />
      </Field>

      {/* All three are entered as Kigali wall-clock time and stored as UTC —
          see the note in lib/training/dates.ts. */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="Applications open"
          htmlFor="opensAt"
          required
          hint="The countdown on the website runs to this moment."
        >
          <TextInput id="opensAt" name="opensAt" type="datetime-local" required />
        </Field>

        <Field label="Applications close" htmlFor="closesAt" hint="Optional deadline.">
          <TextInput id="closesAt" name="closesAt" type="datetime-local" />
        </Field>

        <Field label="Training starts" htmlFor="startsAt" hint="Optional first day of class.">
          <TextInput id="startsAt" name="startsAt" type="datetime-local" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Delivery" htmlFor="mode" hint="Classroom, Online, Hybrid, Evenings & weekends…">
          <TextInput id="mode" name="mode" placeholder="Classroom & online" />
        </Field>

        <Field label="Location" htmlFor="location">
          <TextInput id="location" name="location" placeholder="Ikaze House, Remera-Gisimenti" />
        </Field>

        <Field label="Fee" htmlFor="fee" hint="Free text, so it can carry the currency and any qualifier.">
          <TextInput id="fee" name="fee" placeholder="RWF 150,000 per participant" />
        </Field>

        <Field label="Seats" htmlFor="seats" hint="Optional. Shown as the capacity of the intake.">
          <TextInput id="seats" name="seats" type="number" min={1} step={1} placeholder="25" />
        </Field>
      </div>

      <Field
        label="Application link"
        htmlFor="applicationUrl"
        required
        hint="The full https:// address of the form applicants fill in — a Google Form, for example. It opens in a new tab."
      >
        <TextInput
          id="applicationUrl"
          name="applicationUrl"
          type="url"
          required
          inputMode="url"
          placeholder="https://forms.gle/…"
        />
      </Field>

      <label className="flex items-start gap-3 rounded-lg border border-brand-line bg-brand-haze/60 p-4">
        <input
          type="checkbox"
          name="published"
          defaultChecked
          className="mt-0.5 size-4 shrink-0 accent-[#103a6b]"
        />
        <span className="text-sm text-brand-ink">
          <span className="font-semibold">Publish immediately</span>
          <span className="mt-0.5 block text-brand-muted">
            Untick to save it as a draft. Drafts are visible here but never on the public page.
          </span>
        </span>
      </label>

      <div>
        <SubmitButton>
          <CalendarPlus className="size-4" /> Create intake
        </SubmitButton>
      </div>
    </form>
  );
}
