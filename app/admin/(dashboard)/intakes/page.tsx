import type { Metadata } from "next";
import { Eye, EyeOff, ExternalLink, Trash2 } from "lucide-react";
import ActionForm from "@/components/admin/ActionForm";
import IntakeForm from "@/components/admin/IntakeForm";
import { Panel } from "@/components/admin/ui";
import { deleteIntakeAction, toggleIntakeAction } from "@/app/admin/actions";
import { readTraining } from "@/lib/training/store";
import { formatIntakeDateTime, intakePhase } from "@/lib/training/dates";

export const metadata: Metadata = { title: "Upcoming intakes" };

const PHASE_LABEL = {
  upcoming: { text: "Applications not yet open", className: "bg-amber-50 text-amber-800 border-amber-200" },
  open: { text: "Applications open", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  closed: { text: "Closed", className: "bg-slate-100 text-slate-600 border-slate-200" },
} as const;

export default async function IntakesPage() {
  const { intakes } = await readTraining();
  // Rendered on the server only, so the phase badge can be a beat stale on a
  // cached page. The countdown the public sees is computed in the browser.
  const now = Date.now();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-2xl font-extrabold text-brand-ink">Upcoming intakes</h1>
        <p className="mt-1.5 text-sm text-brand-muted">
          A dated run of the training that people apply to. The published intake opening soonest is the one
          featured with a countdown at the top of the training page.
        </p>
      </header>

      <Panel
        title={`${intakes.length} intake${intakes.length === 1 ? "" : "s"}`}
        description="Times are Kigali time (CAT)."
      >
        {intakes.length === 0 ? (
          <p className="text-sm text-brand-muted">
            No intakes yet. Create one below and it will be announced on the training page with a live
            countdown to the day applications open.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {intakes.map((intake) => {
              const phase = intakePhase(intake, now);
              const badge = PHASE_LABEL[phase];
              return (
                <li key={intake.id} className="rounded-xl border border-brand-line bg-brand-haze/50 p-5">
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

                      {intake.summary ? (
                        <p className="mt-1.5 max-w-2xl text-sm text-brand-muted">{intake.summary}</p>
                      ) : null}

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
            })}
          </ul>
        )}
      </Panel>

      <Panel
        title="Craft an upcoming intake"
        description="Only the title, the opening date and the application link are required."
      >
        <IntakeForm />
      </Panel>
    </div>
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
