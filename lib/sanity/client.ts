// The read-only connection to the Sanity Content Lake.
//
// Content is fetched at build time and during ISR revalidation, never from the
// browser, so the deployed site stays static HTML on Vercel's edge and has no
// runtime dependency on Sanity's availability.

import { createClient, type SanityClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Pinned so a future API change cannot alter query results without a code change. */
export const apiVersion = "2024-10-01";

/**
 * False until the Sanity project exists and its ID is in the environment.
 * Lets the site build and run before Phase 0 of the CMS rollout is complete —
 * see docs/CMS-IMPLEMENTATION.md.
 */
export const isSanityConfigured = Boolean(projectId);

export const client: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      // Drafts are never served. The Free plan's dataset is public-read, so
      // this is what keeps unpublished work off the live site.
      perspective: "published",
    })
  : null;

/**
 * Runs a GROQ query, returning `fallback` while Sanity is not yet configured.
 *
 * Query failures are deliberately *not* caught. Under ISR, a render that throws
 * leaves the previously generated page in place, so a Sanity outage means
 * visitors keep seeing the last good content. Swallowing the error would instead
 * cache an empty page over the top of it.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown>,
  fallback: T
): Promise<T> {
  if (!client) return fallback;
  return client.fetch<T>(query, params);
}
