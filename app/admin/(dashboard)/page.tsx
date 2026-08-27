import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarClock, ExternalLink, Layers } from "lucide-react";
import { Panel } from "@/components/admin/ui";
import { readTraining } from "@/lib/training/store";
import { formatIntakeDateTime, intakePhase } from "@/lib/training/dates";
import { featuredIntake } from "@/lib/training/select";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  const data = await readTraining();
  const now = Date.now();
  const featured = featuredIntake(data.intakes, now);
  const drafts = data.intakes.filter((intake) => !intake.published).length;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-2xl font-extrabold text-brand-ink">Overview</h1>
        <p className="mt-1.5 text-sm text-brand-muted">
          Everything on this dashboard drives the public{" "}
          <Link href="/training" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">
            training page
          </Link>
          .
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Training modules" value={data.modules.length} href="/admin/modules" icon={Layers} />
        <Stat label="Intakes" value={data.intakes.length} href="/admin/intakes" icon={CalendarClock} />
        <Stat label="Unpublished drafts" value={drafts} href="/admin/intakes" icon={AlertTriangle} />
      </div>

      <Panel
        title="Featured on the training page"
        description="The published intake visitors currently see, with its countdown."
      >
        {featured ? (
          <div>
            <h3 className="font-heading text-lg font-extrabold text-brand-ink">{featured.title}</h3>
            <p className="mt-1 text-sm text-brand-muted">
              {intakePhase(featured, now) === "upcoming"
                ? `Applications open ${formatIntakeDateTime(featured.opensAt)}.`
                : "Applications are open now."}
            </p>
            <a
              href={featured.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-dark"
            >
              <ExternalLink className="size-3.5" /> Open the application form
            </a>
          </div>
        ) : (
          <p className="text-sm text-brand-muted">
            Nothing is featured. Publish an intake whose deadline has not passed and it will appear at the top
            of /training with a live countdown.{" "}
            <Link href="/admin/intakes" className="font-semibold text-brand hover:underline">
              Create one →
            </Link>
          </p>
        )}
      </Panel>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: number;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_rgba(25,20,65,0.05)] transition hover:-translate-y-0.5 hover:border-brand/40"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-tint text-brand">
        <Icon className="size-4" />
      </span>
      <p className="mt-4 font-heading text-3xl font-extrabold leading-none text-brand-ink">{value}</p>
      <p className="mt-2 flex items-center gap-1 text-sm text-brand-muted">
        {label}
        <ArrowRight className="size-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
      </p>
    </Link>
  );
}
