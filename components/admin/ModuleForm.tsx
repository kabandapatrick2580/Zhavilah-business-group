"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { createModuleAction } from "@/app/admin/actions";
import { Feedback, Field, Select, SubmitButton, TextArea, TextInput } from "@/components/admin/ui";
import { MODULE_ICON_CHOICES } from "@/lib/training/types";

export default function ModuleForm() {
  const [state, formAction] = useActionState(createModuleAction, {});
  const form = useRef<HTMLFormElement>(null);

  // Cleared only on success, so a rejected submission keeps what was typed and
  // the admin can fix the one field the message names.
  useEffect(() => {
    if (state.success) form.current?.reset();
  }, [state.success]);

  return (
    <form ref={form} action={formAction} className="flex flex-col gap-5">
      <Feedback state={state} />

      <div className="grid gap-5 sm:grid-cols-[1fr_200px]">
        <Field label="Module title" htmlFor="title" required>
          <TextInput
            id="title"
            name="title"
            required
            maxLength={160}
            placeholder="Module IV: Financial Analysis"
          />
        </Field>

        <Field label="Icon" htmlFor="icon" hint="Shown on the module card.">
          <Select id="icon" name="icon" defaultValue="book">
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
        htmlFor="summary"
        hint="Optional. One line above the topic list, if the title needs framing."
      >
        <TextInput id="summary" name="summary" placeholder="For finance staff moving into reporting roles." />
      </Field>

      <Field
        label="Topics"
        htmlFor="items"
        required
        hint="One per line — paste a list straight from a document and it will keep the line breaks."
      >
        <TextArea
          id="items"
          name="items"
          required
          rows={9}
          placeholder={"Reading a set of financial statements\nRatio analysis\nWorking capital management"}
        />
      </Field>

      <div>
        <SubmitButton>
          <Plus className="size-4" /> Add module
        </SubmitButton>
      </div>
    </form>
  );
}
