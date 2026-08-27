"use client";

// `template.tsx` (rather than `layout.tsx`) remounts on every navigation,
// which is exactly what a route transition needs: each page enters with a
// short lift-and-focus pass so navigation feels continuous instead of abrupt.

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/motion/primitives";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  // The dashboard is a tool, not a marketing surface. Fading it in on every
  // navigation between Modules and Intakes is half a second of semi-transparent
  // UI in exchange for nothing, so /admin renders immediately.
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <motion.div
      // Opacity + a small lift only: blurring a whole page costs real GPU time
      // on low-end devices, so that pass is reserved for individual headings.
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
