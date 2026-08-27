import type { Metadata } from "next";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import ActionForm from "@/components/admin/ActionForm";
import ModuleForm from "@/components/admin/ModuleForm";
import { Panel } from "@/components/admin/ui";
import { SERVICE_ICONS } from "@/components/services/serviceIcons";
import { deleteModuleAction, moveModuleAction } from "@/app/admin/actions";
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
            {modules.map((module, index) => {
              const Icon = SERVICE_ICONS[module.icon];
              return (
                <li
                  key={module.id}
                  className="rounded-xl border border-brand-line bg-brand-haze/50 p-5 transition hover:border-brand/30"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-heading font-extrabold text-brand-ink">{module.title}</h3>
                        {module.summary ? (
                          <p className="mt-0.5 text-sm text-brand-muted">{module.summary}</p>
                        ) : null}
                        <p className="mt-1 text-xs text-brand-muted">
                          {module.items.length} topic{module.items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <ActionForm
                        action={moveModuleAction}
                        fields={{ id: module.id, direction: "up" }}
                        label={<ArrowUp className="size-4" />}
                        title="Move up"
                        disabled={index === 0}
                      />
                      <ActionForm
                        action={moveModuleAction}
                        fields={{ id: module.id, direction: "down" }}
                        label={<ArrowDown className="size-4" />}
                        title="Move down"
                        disabled={index === modules.length - 1}
                      />
                      <ActionForm
                        action={deleteModuleAction}
                        fields={{ id: module.id }}
                        label={
                          <>
                            <Trash2 className="size-4" /> Remove
                          </>
                        }
                        confirmLabel="Remove this module?"
                      />
                    </div>
                  </div>

                  {/* The topics are the substance of the card, so they are shown
                      rather than hidden behind an expander — the admin is here
                      to check exactly this text. */}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-brand transition hover:text-brand-dark">
                      Topics
                    </summary>
                    <ul className="mt-3 grid gap-1.5 pl-1 sm:grid-cols-2">
                      {module.items.map((item) => (
                        <li key={item} className="text-sm text-brand-muted">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <Panel title="Add a module" description="It is appended to the end of the list; reorder it afterwards.">
        <ModuleForm />
      </Panel>
    </div>
  );
}
