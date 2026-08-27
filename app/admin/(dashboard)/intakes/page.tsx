import type { Metadata } from "next";
import IntakeForm from "@/components/admin/IntakeForm";
import IntakeRow from "@/components/admin/IntakeRow";
import { Panel } from "@/components/admin/ui";
import { readTraining } from "@/lib/training/store";
import { intakePhase } from "@/lib/training/dates";

export const metadata: Metadata = { title: "Upcoming intakes" };

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
            {intakes.map((intake) => (
              <IntakeRow key={intake.id} intake={intake} phase={intakePhase(intake, now)} />
            ))}
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
