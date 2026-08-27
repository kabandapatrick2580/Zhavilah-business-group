"use client";

// One module in the list, which swaps in place between reading and editing.
//
// Editing inline rather than on a separate page keeps the other modules on
// screen — most edits to a syllabus are made by comparing it against its
// neighbours, and a full-page editor loses that context.

import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import ActionForm from "@/components/admin/ActionForm";
import ModuleForm from "@/components/admin/ModuleForm";
import { SERVICE_ICONS } from "@/components/services/serviceIcons";
import { deleteModuleAction, moveModuleAction } from "@/app/admin/actions";
import type { TrainingModule } from "@/lib/training/types";

export default function ModuleRow({
  module,
  isFirst,
  isLast,
}: {
  module: TrainingModule;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const Icon = SERVICE_ICONS[module.icon];

  if (editing) {
    return (
      <li className="rounded-xl border border-brand/40 bg-white p-5 shadow-[0_10px_30px_rgba(25,20,65,0.06)]">
        <p className="mb-5 font-heading text-sm font-extrabold uppercase tracking-[0.12em] text-brand">
          Editing module
        </p>
        <ModuleForm module={module} onSaved={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-brand-line bg-brand-haze/50 p-5 transition hover:border-brand/30">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-heading font-extrabold text-brand-ink">{module.title}</h3>
            {module.summary ? <p className="mt-0.5 text-sm text-brand-muted">{module.summary}</p> : null}
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
            disabled={isFirst}
          />
          <ActionForm
            action={moveModuleAction}
            fields={{ id: module.id, direction: "down" }}
            label={<ArrowDown className="size-4" />}
            title="Move down"
            disabled={isLast}
          />
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-line bg-white px-3 py-2 text-sm font-semibold text-brand-ink transition hover:border-brand/40 hover:text-brand"
          >
            <Pencil className="size-4" /> Edit
          </button>
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
}
