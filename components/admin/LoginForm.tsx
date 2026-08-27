"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { Feedback, Field, SubmitButton, TextInput } from "@/components/admin/ui";

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Feedback state={state} />

      <Field label="Username" htmlFor="username" required>
        <TextInput
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
      </Field>

      <Field label="Password" htmlFor="password" required>
        <TextInput id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>

      <SubmitButton className="mt-1 w-full">
        <LogIn className="size-4" /> Sign in
      </SubmitButton>
    </form>
  );
}
