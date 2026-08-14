/**
 * Dates are rendered on both the server and the client, so the locale and time
 * zone are pinned explicitly. Left to the environment's defaults they would
 * differ between the two and React would report a hydration mismatch.
 */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Kigali",
  });
}
