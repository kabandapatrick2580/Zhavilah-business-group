import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/sucess"] }],
    sitemap: "https://zhavilahbusinessgroup.com/sitemap.xml",
  };
}
