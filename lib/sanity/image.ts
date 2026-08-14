import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "./client";
import type { SanityImage } from "./types";

const builder = projectId ? imageUrlBuilder({ projectId, dataset }) : null;

/**
 * Builds a CDN URL for a Sanity image, honouring any hotspot/crop the editor
 * set in the Studio.
 *
 * Returns null when Sanity is not configured, so callers must handle the
 * unconfigured case — the same branch that handles a missing image.
 */
export function urlFor(source: SanityImage, width: number, height?: number): string | null {
  if (!builder) return null;
  let image = builder.image(source).width(width).fit("crop").auto("format");
  if (height) image = image.height(height);
  return image.url();
}
