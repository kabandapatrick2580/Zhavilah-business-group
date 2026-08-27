"use client";

// One intake in the list, swapping in place between reading and editing —
// see the note at the top of ModuleRow.tsx.

import { useState } from "react";
import { ExternalLink, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import ActionForm from "@/components/admin/ActionForm";
import IntakeForm from "@/components/admin/IntakeForm";
import { deleteIntakeAction, toggleIntakeAction } from "@/app/admin/actions";
import { formatIntakeDateTime, type IntakePhase } from "@/lib/training/dates";
import type { TrainingIntake } from "@/lib/training/types";

const PHASE_LABEL: Record<IntakePhase, { text: string; className: string }> = {
  upcoming: { text: "Applications not yet open", className: "bg-amber-50 text-amber-800 border-amber-200" },
  open: { text: "Applications open", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  closed: { text: "Closed", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

export default function IntakeRow({ intake, phase }: { intake: TrainingIntake; phase: IntakePhase }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="rounded-xl border border-brand/40 bg-white p-5 shadow-[0_10px_30px_rgba(11,38,74,0.06)]">
        <p className="mb-5 font-heading text-sm font-extrabold uppercase tracking-[0.12em] text-brand">
          Editing intake
        </p>
        <IntakeForm intake={intake} onSaved={() => setEditing(false)} />
      </li>
    );
  }

  const badge = PHASE_LABEL[phase];

  return (
    <li className="rounded-xl border border-brand-line bg-brand-haze/50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading font-extrabold text-brand-ink">{intake.title}</h3>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
              {badge.text}
            </span>
            {!intake.published ? (
              <span className="rounded-full border border-brand-line bg-white px-2.5 py-0.5 text-xs font-semibold text-brand-muted">
                Draft
              </span>
            ) : null}
          </div>

          {intake.summary ? <p className="mt-1.5 max-w-2xl text-sm text-brand-muted">{intake.summary}</p> : null}

          <dl className="mt-3 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
            <Row label="Opens" value={formatIntakeDateTime(intake.opensAt)} />
            {intake.closesAt ? <Row label="Closes" value={formatIntakeDateTime(intake.closesAt)} /> : null}
            {intake.startsAt ? <Row label="Starts" value={formatIntakeDateTime(intake.startsAt)} /> : null}
            {intake.mode ? <Row label="Delivery" value={intake.mode} /> : null}
            {intake.location ? <Row label="Location" value={intake.location} /> : null}
            {intake.fee ? <Row label="Fee" value={intake.fee} /> : null}
            {intake.seats ? <Row label="Seats" value={String(intake.seats)} /> : null}
          </dl>

          <a
            href={intake.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-sm font-semibold text-brand transition hover:text-brand-dark"
          >
            <ExternalLink className="size-3.5 shrink-0" />
            <span className="truncate">{intake.applicationUrl}</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionForm
            action={toggleIntakeAction}
            fields={{ id: intake.id, publish: String(!intake.published) }}
            label={
              intake.published ? (
                <>
                  <EyeOff className="size-4" /> Hide
                </>
              ) : (
                <>
                  <Eye className="size-4" /> Publish
                </>
              )
            }
            variant={intake.published ? "ghost" : "primary"}
          />
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-line bg-white px-3 py-2 text-sm font-semibold text-brand-ink transition hover:border-brand/40 hover:text-brand"
          >
            <Pencil className="size-4" /> Edit
          </button>
          <ActionForm
            action={deleteIntakeAction}
            fields={{ id: intake.id }}
            label={
              <>
                <Trash2 className="size-4" /> Remove
              </>
            }
            confirmLabel="Remove this intake?"
          />
        </div>
      </div>
    </li>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 font-semibold text-brand-ink">{label}</dt>
      <dd className="min-w-0 text-brand-muted">{value}</dd>
    </div>
  );
}
