import type { Metadata } from "next";
import ModuleForm from "@/components/admin/ModuleForm";
import ModuleRow from "@/components/admin/ModuleRow";
import { Panel } from "@/components/admin/ui";
import { readTraining } from "@/lib/training/store";

export const metadata: Metadata = { title: "Training modules" };

export default async function ModulesPage() {
  const { modules } = await readTraining();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-2xl font-extrabold text-brand-ink">Training modules</h1>
        <p className="mt-1.5 text-sm text-brand-muted">
          The syllabus cards under “Training Contents” on the public training page. Changes appear there as
          soon as they are saved.
        </p>
      </header>

      <Panel
        title={`${modules.length} module${modules.length === 1 ? "" : "s"}`}
        description="Listed in the order they are rendered on /training."
      >
        {modules.length === 0 ? (
          <p className="text-sm text-brand-muted">
            No modules yet. Add the first one below and it will appear on the training page.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {modules.map((module, index) => (
              <ModuleRow
                key={module.id}
                module={module}
                isFirst={index === 0}
                isLast={index === modules.length - 1}
              />
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Add a module" description="It is appended to the end of the list; reorder it afterwards.">
        <ModuleForm />
      </Panel>
    </div>
  );
}
