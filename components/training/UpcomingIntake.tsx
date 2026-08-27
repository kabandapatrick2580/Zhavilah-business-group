"use client";

// The announcement panel at the top of /training.
//
// It has three states and the countdown drives the transition between them
// without a page reload: before applications open it counts down to the
// opening moment and the button is inert; once open it counts down to the
// deadline and the button becomes the live application link; once closed the
// panel removes itself.
//
// The phase is computed on the server for the first paint (so the copy is
// correct with JavaScript disabled, and there is no hydration mismatch) and
// then re-derived in the browser whenever a countdown reaches zero.

import { useCallback, useState } from "react";
import { ArrowUpRight, Banknote, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import Countdown from "@/components/training/Countdown";
import { countdownTarget, formatIntakeDate, formatIntakeDateTime, intakePhase, type IntakePhase } from "@/lib/training/dates";
import type { TrainingIntake } from "@/lib/training/types";

export default function UpcomingIntake({
  intake,
  initialPhase,
}: {
  intake: TrainingIntake;
  initialPhase: IntakePhase;
}) {
  const [phase, setPhase] = useState<IntakePhase>(initialPhase);

  // Recomputed rather than simply advanced, so a clock correction or a tab that
  // was asleep for a week lands on the right state instead of the next one.
  const recheck = useCallback(() => setPhase(intakePhase(intake, Date.now())), [intake]);

  if (phase === "closed") return null;

  const target = countdownTarget(intake, phase);
  const open = phase === "open";

  const details = [
    { icon: CalendarDays, label: "Applications open", value: formatIntakeDate(intake.opensAt) },
    intake.closesAt ? { icon: Clock, label: "Deadline", value: formatIntakeDate(intake.closesAt) } : null,
    intake.startsAt ? { icon: CalendarDays, label: "Training starts", value: formatIntakeDate(intake.startsAt) } : null,
    intake.mode ? { icon: Users, label: "Delivery", value: intake.mode } : null,
    intake.location ? { icon: MapPin, label: "Location", value: intake.location } : null,
    intake.fee ? { icon: Banknote, label: "Fee", value: intake.fee } : null,
    intake.seats ? { icon: Users, label: "Seats", value: `${intake.seats} places` } : null,
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  return (
    <section className="bg-white pt-16 pb-4">
      <div className="mx-auto max-w-7xl px-6">
        <article className="relative isolate overflow-hidden rounded-3xl bg-[linear-gradient(118deg,#17133e_0%,#251f61_56%,#30287e_100%)] px-7 py-10 text-white shadow-[0_30px_70px_rgba(25,20,65,0.25)] sm:px-12 sm:py-14">
          {/* The light-blue wash from the top right, matching the wide service
              card on the homepage so the two read as one family. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(72%_130%_at_87%_12%,rgba(124,192,245,0.26)_0%,rgba(23,19,62,0)_62%)]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-28 -z-10 size-80 rounded-full border border-white/10"
          />

          <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-sky">
                <span className="h-0.5 w-7 bg-brand-sky" />
                {open ? "Applications open now" : "Next intake"}
              </p>

              <h2 className="mt-4 font-heading text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl">
                {intake.title}
              </h2>

              {intake.summary ? (
                <p className="mt-4 max-w-xl leading-relaxed text-white/75">{intake.summary}</p>
              ) : null}

              {details.length > 0 ? (
                <dl className="mt-7 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                  {details.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-sky">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/50">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>

            <div className="lg:pl-4">
              {/* An open intake with neither a deadline nor a start date has
                  nothing to count down to, so the whole block is dropped rather
                  than left as a heading over empty space. */}
              {target ? (
                <>
                  <p className="text-sm font-semibold text-white/70">
                    {open
                      ? intake.closesAt
                        ? "Applications close in"
                        : "Training starts in"
                      : "Applications open in"}
                  </p>
                  <div className="mt-3.5">
                    <Countdown target={target} onElapsed={recheck} />
                  </div>
                </>
              ) : null}

              <p className="mt-3.5 text-sm text-white/60">
                {open
                  ? intake.closesAt
                    ? `Closing ${formatIntakeDateTime(intake.closesAt)}.`
                    : "Apply now — places are confirmed in the order applications arrive."
                  : `Opening ${formatIntakeDateTime(intake.opensAt)}.`}
              </p>

              {open ? (
                <a
                  href={intake.applicationUrl}
                  // The application form is a third-party service (a Google
                  // Form and the like). `noopener` denies it a handle back to
                  // this window; `noreferrer` keeps the referrer out of it.
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-brand-sky px-7 py-4 font-heading text-[15px] font-extrabold text-brand-deep transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
                >
                  Apply now
                  <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <p
                  className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/20 px-7 py-4 font-heading text-[15px] font-extrabold text-white/55 sm:w-auto"
                  // Not a disabled button: there is nothing to press yet, and a
                  // dead control invites the click this sentence answers.
                >
                  Applications open {formatIntakeDate(intake.opensAt)}
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
