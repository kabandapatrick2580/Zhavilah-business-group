"use client";

// The live countdown on the training page.
//
// Server and client cannot agree on "now", so the first paint deliberately
// shows placeholder digits and the real numbers appear on mount. Rendering the
// server's clock instead would produce a hydration mismatch on the seconds
// every single time. The surrounding copy is not affected — the phase is
// decided by the server and the numbers are the only part that waits.

import { useEffect, useState } from "react";
import { countdownParts } from "@/lib/training/dates";

const UNITS = ["days", "hours", "minutes", "seconds"] as const;

export default function Countdown({
  target,
  /** "light" sits on the navy panel; "dark" sits on a white surface. */
  tone = "light",
  onElapsed,
}: {
  target: string;
  tone?: "light" | "dark";
  onElapsed?: () => void;
}) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const deadline = Date.parse(target);
    if (Number.isNaN(deadline)) return;

    const tick = () => {
      const left = deadline - Date.now();
      setRemaining(Math.max(0, left));
      if (left <= 0) onElapsed?.();
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [target, onElapsed]);

  const parts = remaining === null ? null : countdownParts(remaining);

  const box =
    tone === "light"
      ? "border-white/15 bg-white/10 text-white"
      : "border-brand-line bg-brand-haze text-brand-ink";
  const caption = tone === "light" ? "text-white/60" : "text-brand-muted";

  return (
    <ul className="flex flex-wrap gap-2.5 sm:gap-3" aria-label="Time remaining">
      {UNITS.map((unit) => (
        <li
          key={unit}
          className={`min-w-[74px] flex-1 rounded-xl border px-3 py-3 text-center sm:min-w-[86px] sm:px-4 ${box}`}
        >
          <span
            className="block font-heading text-3xl font-extrabold leading-none tabular-nums sm:text-4xl"
            // The value changes every second; announcing each tick would make a
            // screen reader unusable, so the region is silent and the deadline
            // is stated in prose next to it.
            aria-hidden="true"
          >
            {parts ? String(parts[unit]).padStart(2, "0") : "––"}
          </span>
          <span className={`mt-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] ${caption}`}>
            {unit}
          </span>
        </li>
      ))}
    </ul>
  );
}
