"use client";

// One form for both adding a module and editing one.
//
// Sharing the markup is not just less code: it guarantees the edit form can
// reach every field the create form can, which is the failure mode of a
// separately written editor — a field quietly becomes create-only and the
// only way to change it is to delete the record and retype it.

import { useActionState, useEffect } from "react";
import { Check, Plus } from "lucide-react";
import { createModuleAction, updateModuleAction } from "@/app/admin/actions";
import { Feedback, Field, Select, SubmitButton, TextArea, TextInput } from "@/components/admin/ui";
import { MODULE_ICON_CHOICES, type TrainingModule } from "@/lib/training/types";

export default function ModuleForm({
  module,
  onSaved,
}: {
  /** Present when editing; absent when adding. */
  module?: TrainingModule;
  onSaved?: () => void;
}) {
  const editing = module !== undefined;
  const [state, formAction] = useActionState(editing ? updateModuleAction : createModuleAction, {});

  // React 19 resets an uncontrolled form after the action completes, which is
  // what the add form wants. On failure the action hands back what was
  // submitted so the fields can be re-seeded instead of blanked.
  const seed = (field: keyof TrainingModule & string, fallback?: string) =>
    state.values?.[field] ?? fallback;

  // An edit form closes once its save lands; the row underneath re-renders
  // with the new values. In an effect, not in render — calling a parent's
  // setState while rendering is not allowed.
  useEffect(() => {
    if (editing && state.success) onSaved?.();
  }, [editing, state.success, onSaved]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Feedback state={state} />
      {editing ? <input type="hidden" name="id" value={module.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-[1fr_200px]">
        <Field label="Module title" htmlFor={`${module?.id ?? "new"}-title`} required>
          <TextInput
            id={`${module?.id ?? "new"}-title`}
            name="title"
            required
            maxLength={160}
            defaultValue={seed("title", module?.title)}
            placeholder="Module IV: Financial Analysis"
          />
        </Field>

        <Field label="Icon" htmlFor={`${module?.id ?? "new"}-icon`} hint="Shown on the module card.">
          <Select id={`${module?.id ?? "new"}-icon`} name="icon" defaultValue={seed("icon", module?.icon ?? "book")}>
            {MODULE_ICON_CHOICES.map((name) => (
              <option key={name} value={name}>
                {name.replace(/-/g, " ")}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="Summary"
        htmlFor={`${module?.id ?? "new"}-summary`}
        hint="Optional. One line above the topic list, if the title needs framing."
      >
        <TextInput
          id={`${module?.id ?? "new"}-summary`}
          name="summary"
          defaultValue={seed("summary", module?.summary)}
          placeholder="For finance staff moving into reporting roles."
        />
      </Field>

      <Field
        label="Topics"
        htmlFor={`${module?.id ?? "new"}-items`}
        required
        hint="One per line — paste a list straight from a document and it will keep the line breaks."
      >
        <TextArea
          id={`${module?.id ?? "new"}-items`}
          name="items"
          required
          rows={editing ? 12 : 9}
          defaultValue={state.values?.items ?? module?.items.join("\n")}
          placeholder={"Reading a set of financial statements\nRatio analysis\nWorking capital management"}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>
          {editing ? (
            <>
              <Check className="size-4" /> Save changes
            </>
          ) : (
            <>
              <Plus className="size-4" /> Add module
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
