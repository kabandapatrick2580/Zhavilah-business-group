// Result shapes for the GROQ queries in ./queries.ts.
//
// These are written by hand rather than generated. The Studio lives in its own
// npm project (see ../../studio), so nothing here is coupled to its build — the
// cost is keeping the two in step when a schema field changes.

import type { PortableTextBlock } from "@portabletext/react";

export type SanityImage = {
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type PostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  author?: string;
  coverImage: SanityImage;
};

export type Post = PostSummary & {
  body: PortableTextBlock[];
};

export type GalleryItem = {
  _id: string;
  alt: string;
  caption?: string;
  image: SanityImage;
};

export type Banner = {
  _id: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image: SanityImage;
};
