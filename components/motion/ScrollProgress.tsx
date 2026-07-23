"use client";

// A thin navy → light-blue bar pinned to the top of the viewport that tracks
// how far the page has been read. Scroll-linked rather than time-based, so it
// costs nothing when the user is idle.

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return <motion.div className="zbg-progress" style={{ scaleX }} aria-hidden="true" />;
}
