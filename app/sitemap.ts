import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/sanity/queries";

const SITE_URL = "https://zhavilahbusinessgroup.com";

// Regenerated at most once an hour, so a newly published article reaches the
// sitemap without a redeploy.
export const revalidate = 3600;

// Public pages only. Deliberately absent: /admin, /api, /sucess (the post-submit
// confirmation) and /company-history, which is still placeholder text — add it
// here once it has real content.
const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/industries", priority: 0.8 },
  { path: "/accounting-services", priority: 0.9 },
  { path: "/tax-advisory", priority: 0.9 },
  { path: "/auditing-assurance", priority: 0.9 },
  { path: "/business-advisory", priority: 0.9 },
  { path: "/quickbooks-solutions", priority: 0.9 },
  { path: "/customs-clearing-forwarding", priority: 0.9 },
  { path: "/transport-logistics", priority: 0.9 },
  { path: "/warehousing-services", priority: 0.9 },
  { path: "/training", priority: 0.9 },
  { path: "/blog", priority: 0.7 },
  { path: "/gallery", priority: 0.5 },
  { path: "/contact", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  return [
    ...PAGES.map(({ path, priority }) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      priority,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      priority: 0.6,
    })),
  ];
}
