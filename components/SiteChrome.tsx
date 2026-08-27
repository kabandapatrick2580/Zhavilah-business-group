"use client";

// Hides the marketing chrome inside the admin area.
//
// The root layout has to render `<html>` and `<body>`, so it wraps every route
// including /admin — and a dashboard framed by the site navigation, the
// newsletter footer and the cookie banner reads as a page that leaked rather
// than a tool. Multiple root layouts (a `(site)` / `(admin)` split) would be
// the textbook fix, but that removes the single root layout that `not-found`
// depends on and moves every existing route on disk, which is a large change
// to make for a wrapper.
//
// The chrome is passed in as children, so Header and Footer are still rendered
// on the server; only the decision to show them happens on the client.

import { usePathname } from "next/navigation";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
