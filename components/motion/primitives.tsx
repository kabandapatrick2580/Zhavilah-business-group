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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // The wipe is a CSS transition, not a Framer animation. Framer will not
  // interpolate `clip-path` here — it animates the accompanying `scale` and
  // leaves the clip pinned at its start value, so the element stays masked out
  // and the photograph never appears. The browser interpolates clip-path
  // natively without complaint, so Framer is used only to detect the element
  // entering the viewport. Corner rounding stays with the frame's
  // `rounded-*` class.
  const hidden = from === "left" ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)";
  const eased = `cubic-bezier(${EASE.join(",")})`;

  const style: React.CSSProperties = reduce
    ? {
        opacity: inView ? 1 : 0,
        transition: `opacity 0.25s ${eased} ${delay}s`,
      }
    : {
        clipPath: inView ? "inset(0 0 0 0)" : hidden,
        transform: inView ? "scale(1)" : "scale(1.04)",
        transition: `clip-path 1s ${eased} ${delay}s, transform 1s ${eased} ${delay}s`,
      };

  // The clip goes on an inner element, never on the observed one. Chrome
  // intersects a target *after* its own `clip-path`, so an element masked to
  // `inset(0 100% 0 0)` reports `intersectionRatio: 0` however far down the
  // viewport it sits — it would wait forever to be seen, and stay clipped
  // because it never was. Observing the unclipped frame breaks that circle.
  // The frame keeps the caller's `relative`/sizing classes, so `<Image fill>`
  // children still resolve against a full-size positioned box.
  return (
    <div ref={ref} className={className}>
      <div style={{ position: "relative", width: "100%", height: "100%", ...style }}>
        {children}
      </div>
    </div>
  );
}
