"use client";

// Shared Framer Motion primitives.
//
// Everything animated on the site is composed from these four pieces so the
// timing language stays consistent: one easing curve, one distance, one
// stagger rhythm. Each primitive honours `prefers-reduced-motion` by
// collapsing to a plain opacity change (or to nothing at all).

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
  type Variants,
} from "framer-motion";

/** The single easing curve used across the site — a soft, confident ease-out. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const TRANSITION: Transition = { duration: 0.7, ease: EASE };

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Reveals its children once they scroll into view. `blur` adds a short
 * defocus-to-focus pass, which reads as more deliberate than a plain fade on
 * large type and imagery.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  blur = false,
  amount = 0.25,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  blur?: boolean;
  amount?: number;
  className?: string;
  as?: "div" | "span" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const offset = reduce ? OFFSET.none : OFFSET[direction];

  return (
    <Component
      className={className}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        filter: blur && !reduce ? "blur(10px)" : "blur(0px)",
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduce ? 0.25 : duration, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

/**
 * Parent for a list of `StaggerItem`s. Children animate in sequence rather
 * than all at once, which gives grids a sense of direction.
 */
export function Stagger({
  children,
  className,
  delay = 0,
  step = 0.09,
  amount = 0.15,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  step?: number;
  amount?: number;
  as?: "div" | "ul" | "section";
}) {
  const Component = motion[as];
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: step, delayChildren: delay } },
  };

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </Component>
  );
}

/**
 * A single item inside `Stagger`. Rises and settles with a slight scale.
 * `lift` adds a spring-loaded hover raise — used for cards.
 */
export function StaggerItem({
  children,
  className,
  direction = "up",
  lift = false,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  lift?: boolean;
  as?: "div" | "li" | "article" | "span";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const offset = reduce ? OFFSET.none : OFFSET[direction];

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y, scale: reduce ? 1 : 0.98 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: reduce ? 0.25 : 0.65, ease: EASE },
    },
  };

  return (
    <Component
      className={className}
      variants={variants}
      whileHover={lift && !reduce ? { y: -8 } : undefined}
      transition={lift ? { type: "spring", stiffness: 300, damping: 22 } : undefined}
    >
      {children}
    </Component>
  );
}

/**
 * Counts from zero to `value` when scrolled into view, easing out via a
 * spring so the last few digits decelerate instead of stopping dead.
 */
export function Counter({
  value,
  suffix = "",
  className,
  suffixClassName,
}: {
  value: number;
  suffix?: string;
  className?: string;
  suffixClassName?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 60, damping: 18, mass: 0.8 });
  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (inView) progress.set(value);
  }, [inView, progress, value]);

  if (reduce) {
    return (
      <span className={className}>
        {value.toLocaleString()}
        {suffix && <span className={suffixClassName}>{suffix}</span>}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </span>
  );
}

/**
 * Wipes an image into view behind a moving mask instead of fading it. Used for
 * the large editorial photography on the home and about pages.
 */
export function CurtainReveal({
  children,
  className,
  delay = 0,
  from = "bottom",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left";
}) {
  const reduce = useReducedMotion();
  const hidden =
    from === "left" ? "inset(0 100% 0 0 round 24px)" : "inset(100% 0 0 0 round 24px)";

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { clipPath: hidden, scale: 1.04 }}
      whileInView={
        reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0% round 24px)", scale: 1 }
      }
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduce ? 0.25 : 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
