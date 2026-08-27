// Which intake the public page leads with.
//
// Shared by /training and the dashboard so the two can never disagree about
// what a visitor is currently being shown.

import { intakePhase } from "@/lib/training/dates";
import type { TrainingIntake } from "@/lib/training/types";

/**
 * The next intake worth announcing: published, not past its deadline, and the
 * soonest to open.
 *
 * Sorting by `opensAt` rather than by creation date means an intake whose
 * applications are already open outranks one announced later for next term —
 * the one a visitor can act on today leads the page.
 */
export function featuredIntake(intakes: TrainingIntake[], now: number): TrainingIntake | null {
  const live = intakes
    .filter((intake) => intake.published && intakePhase(intake, now) !== "closed")
    .sort((a, b) => Date.parse(a.opensAt) - Date.parse(b.opensAt));
  return live[0] ?? null;
}

/** The remaining published, non-closed intakes, in the same order. */
export function otherIntakes(intakes: TrainingIntake[], now: number): TrainingIntake[] {
  const featured = featuredIntake(intakes, now);
  return intakes
    .filter((intake) => intake.published && intakePhase(intake, now) !== "closed" && intake.id !== featured?.id)
    .sort((a, b) => Date.parse(a.opensAt) - Date.parse(b.opensAt));
}
