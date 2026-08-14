// GROQ queries, one per view. Each projects exactly the fields its page needs
// rather than returning whole documents.

import { sanityFetch } from "./client";
import type { Banner, GalleryItem, Post, PostSummary } from "./types";

const IMAGE_FIELDS = `asset, alt, caption, hotspot, crop`;

const POST_SUMMARY_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  author,
  coverImage { ${IMAGE_FIELDS} }
`;

export function getPosts(): Promise<PostSummary[]> {
  return sanityFetch<PostSummary[]>(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) { ${POST_SUMMARY_FIELDS} }`,
    {},
    []
  );
}

export function getPost(slug: string): Promise<Post | null> {
  return sanityFetch<Post | null>(
    `*[_type == "post" && slug.current == $slug][0] {
      ${POST_SUMMARY_FIELDS},
      body[] {
        ...,
        _type == "image" => { ${IMAGE_FIELDS} }
      }
    }`,
    { slug },
    null
  );
}

/** Used by generateStaticParams and, later, the sitemap. */
export function getPostSlugs(): Promise<string[]> {
  return sanityFetch<string[]>(
    `*[_type == "post" && defined(slug.current)].slug.current`,
    {},
    []
  );
}

/** Posts other than the one being read, for the "more articles" strip. */
export function getRelatedPosts(slug: string, limit = 3): Promise<PostSummary[]> {
  return sanityFetch<PostSummary[]>(
    `*[_type == "post" && defined(slug.current) && slug.current != $slug]
      | order(publishedAt desc)[0...$limit] { ${POST_SUMMARY_FIELDS} }`,
    { slug, limit },
    []
  );
}

export function getGalleryImages(): Promise<GalleryItem[]> {
  return sanityFetch<GalleryItem[]>(
    `*[_type == "galleryImage"] | order(order asc) {
      _id, alt, caption, image { ${IMAGE_FIELDS} }
    }`,
    {},
    []
  );
}

export function getBanners(): Promise<Banner[]> {
  return sanityFetch<Banner[]>(
    `*[_type == "banner" && active == true] | order(order asc) {
      _id, eyebrow, heading, subheading, ctaLabel, ctaHref, image { ${IMAGE_FIELDS} }
    }`,
    {},
    []
  );
}
