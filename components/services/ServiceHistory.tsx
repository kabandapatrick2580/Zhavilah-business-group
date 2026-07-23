"use client";

// The alternating image / content layout shared by every service page.
//
// The content cards are treated as nodes on a signal network: a measured SVG
// routes traces through the column gutter between consecutive nodes, and a
// light-blue pulse travels those traces in sequence, so the cards read as one
// connected system rather than five unrelated boxes.
//
// Geometry is measured from the live DOM (and re-measured on resize), which is
// what lets the same code serve the two-column desktop layout and the stacked
// mobile layout without a second set of hand-drawn paths.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CurtainReveal, EASE, Reveal } from "@/components/motion/primitives";
import { SERVICE_ICONS, type ServiceIconName } from "@/components/services/serviceIcons";

export type HistoryImage = {
  kind: "image";
  src: string;
  alt: string;
  /** Shown in the caption chip over the photograph. */
  icon?: ServiceIconName;
};

export type HistoryCard = {
  kind: "card";
  eyebrow?: string;
  heading: string;
  text: string;
  /** Shown in the node badge and echoed by the connecting trace. */
  icon?: ServiceIconName;
};

export type HistoryBlock = HistoryImage | HistoryCard;

/** One node's pulse-to-pulse offset; also the wire travel offset. */
const PULSE_STEP = 0.55;
const PULSE_TRAVEL = 1.8;

type Wire = { id: string; d: string };
type Geometry = { wires: Wire[]; order: Record<string, number>; count: number };

const EMPTY: Geometry = { wires: [], order: {}, count: 0 };

/**
 * Measures every card node and routes an elbowed trace between consecutive
 * ones: a short stub out of the card, a rounded corner, a run down the gutter,
 * then back in to the next card. Nodes are ordered by vertical position, so
 * the route follows how the page actually reads at the current breakpoint.
 */
function useSignalGeometry(
  containerRef: React.RefObject<HTMLDivElement | null>,
  nodes: React.RefObject<Map<string, HTMLElement>>
) {
  const [geometry, setGeometry] = useState<Geometry>(EMPTY);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const map = nodes.current;
    if (!container || !map || map.size < 2) return;

    const base = container.getBoundingClientRect();
    const points = [...map.entries()]
      .map(([id, el]) => {
        const r = el.getBoundingClientRect();
        return { id, x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
      })
      .sort((a, b) => a.y - b.y || a.x - b.x);

    const wires: Wire[] = [];
    const order: Record<string, number> = {};
    points.forEach((p, i) => {
      order[p.id] = i;
    });

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const stacked = Math.abs(a.x - b.x) < 8;

      if (stacked) {
        // Single column: a straight drop from one card's foot to the next.
        const x = a.x + a.w / 2;
        wires.push({ id: `${a.id}->${b.id}`, d: `M${x},${a.y + a.h} L${x},${b.y}` });
        continue;
      }

      const aIsLeft = a.x < b.x;
      const ax = aIsLeft ? a.x + a.w : a.x; // exit edge
      const bx = aIsLeft ? b.x : b.x + b.w; // entry edge
      const ay = a.y + a.h / 2;
      const by = b.y + b.h / 2;
      const gx = (ax + bx) / 2; // gutter centre line
      const hDir = Math.sign(gx - ax) || 1;
      const vDir = Math.sign(by - ay) || 1;
      const r = Math.min(14, Math.abs(gx - ax) * 0.85, Math.abs(by - ay) / 2);

      wires.push({
        id: `${a.id}->${b.id}`,
        d: [
          `M${ax},${ay}`,
          `H${gx - hDir * r}`,
          `Q${gx},${ay} ${gx},${ay + vDir * r}`,
          `V${by - vDir * r}`,
          `Q${gx},${by} ${gx + hDir * r},${by}`,
          `H${bx}`,
        ].join(" "),
      });
    }

    setGeometry((prev) => {
      const same =
        prev.wires.length === wires.length &&
        prev.wires.every((w, i) => w.d === wires[i].d && w.id === wires[i].id);
      return same ? prev : { wires, order, count: points.length };
    });
  }, [containerRef, nodes]);

  useEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container) return;

    // Card heights change with the viewport (text reflow) and with font
    // loading, so watch the nodes themselves rather than just the window.
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    nodes.current?.forEach((el) => observer.observe(el));
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, containerRef, nodes]);

  return geometry;
}

function NodeIcon({ name }: { name?: ServiceIconName }) {
  const Icon = name ? SERVICE_ICONS[name] : SERVICE_ICONS.network;
  return <Icon className="size-5" />;
}

/** Connection point where a trace meets a card. */
function Port({ delay, className }: { delay: number; className: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`absolute z-20 flex size-2.5 items-center justify-center ${className}`}>
      <span className="size-2.5 rounded-full border-2 border-white bg-brand-sky" />
      {!reduce && (
        <motion.span
          className="absolute size-2.5 rounded-full bg-brand-sky"
          animate={{ scale: [1, 3.2], opacity: [0.7, 0] }}
          transition={{ duration: 1.4, delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
        />
      )}
    </span>
  );
}

function CardNode({
  block,
  nodeId,
  index,
  total,
  register,
}: {
  block: HistoryCard;
  nodeId: string;
  index: number;
  total: number;
  register: (id: string, el: HTMLElement | null) => void;
}) {
  const reduce = useReducedMotion();
  const delay = index * PULSE_STEP;

  return (
    <motion.article
      ref={(el) => register(nodeId, el)}
      initial={{ opacity: 0, y: reduce ? 0 : 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduce ? 0.25 : 0.65, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group relative z-10 rounded-2xl border border-brand-line bg-white p-8 shadow-[0_18px_55px_rgba(11,38,74,0.06)] transition-colors duration-300 hover:border-brand/40"
    >
      {/* Ports: sides on the two-column layout, bottom-centre when stacked.
          Breakpoint matches the grid (md) so they line up with the traces. */}
      <Port delay={delay} className="left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex" />
      <Port delay={delay} className="right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:flex" />
      <Port delay={delay} className="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 md:hidden" />

      <header className="flex items-center gap-4">
        <motion.span
          className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white"
          whileHover={reduce ? undefined : { rotate: -6, scale: 1.06 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
        >
          <NodeIcon name={block.icon} />
          {!reduce && (
            // Fires as the incoming trace reaches this node.
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl ring-2 ring-brand-sky"
              animate={{ scale: [1, 1.35], opacity: [0.85, 0] }}
              transition={{
                duration: 1.2,
                delay,
                repeat: Infinity,
                repeatDelay: 1.4,
                ease: "easeOut",
              }}
            />
          )}
        </motion.span>

        <div className="min-w-0">
          {block.eyebrow && (
            <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-brand">
              {block.eyebrow}
            </span>
          )}
          <span className="block font-mono text-xs font-semibold tracking-[0.18em] text-brand-muted/70">
            {String(index + 1).padStart(2, "0")}
            <span className="text-brand-muted/40"> / {String(total).padStart(2, "0")}</span>
          </span>
        </div>
      </header>

      <h3 className="mt-5 font-heading text-2xl font-extrabold text-brand-ink">{block.heading}</h3>
      <p className="mt-3 leading-relaxed text-brand-muted">{block.text}</p>
    </motion.article>
  );
}

function ImageBlock({ block, index }: { block: HistoryImage; index: number }) {
  const Icon = block.icon ? SERVICE_ICONS[block.icon] : null;

  return (
    <CurtainReveal
      className="relative h-72 w-full overflow-hidden rounded-2xl shadow-[0_18px_55px_rgba(11,38,74,0.1)]"
      delay={index * 0.05}
    >
      <Image
        src={block.src}
        alt={block.alt}
        fill
        sizes="(max-width: 1024px) 92vw, 590px"
        className="object-cover"
      />
      <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-deep/80 to-transparent" />
      {/* Caption duplicates the alt text visually, so it is hidden from
          assistive tech to avoid announcing the same string twice. */}
      <span
        aria-hidden="true"
        className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md"
      >
        {Icon && <Icon className="size-3.5 text-brand-sky" />}
        {block.alt}
      </span>
    </CurtainReveal>
  );
}

export default function ServiceHistory({
  columns,
}: {
  columns: [HistoryBlock[], HistoryBlock[]];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<Map<string, HTMLElement>>(new Map());
  const reduce = useReducedMotion();
  // Looping pulses only run while the network is on screen.
  const inView = useInView(containerRef, { amount: 0.02 });

  const register = useCallback((id: string, el: HTMLElement | null) => {
    if (el) nodes.current.set(id, el);
    else nodes.current.delete(id);
  }, []);

  const { wires, order, count } = useSignalGeometry(containerRef, nodes);
  const cycle = Math.max(count, 1) * PULSE_STEP + PULSE_TRAVEL;

  return (
    <section className="zbg-signal-field bg-brand-haze py-20">
      <div ref={containerRef} className="relative mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2">
        {/* The network itself. Purely decorative: every node it links is
            already readable as ordinary prose. */}
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          {wires.map((wire, i) => (
            <g key={wire.id}>
              {/* Dormant trace — legible on its own, so the network still
                  reads as connected before (or without) any animation. */}
              <path
                d={wire.d}
                fill="none"
                stroke="var(--color-brand)"
                strokeOpacity={0.3}
                strokeWidth={1.5}
                strokeDasharray="2 5"
                strokeLinecap="round"
              />
              {/* Trace energising as the section scrolls in */}
              <motion.path
                d={wire.d}
                fill="none"
                stroke="var(--color-brand-sky)"
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
              />
              {/* Travelling signal. `pathLength={1}` normalises the dash units
                  so one dash pattern spans the trace regardless of its length. */}
              {!reduce && inView && (
                <motion.path
                  d={wire.d}
                  fill="none"
                  pathLength={1}
                  stroke="var(--color-brand-sky)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray="0.14 1"
                  style={{ filter: "drop-shadow(0 0 5px rgba(124,192,245,0.9))" }}
                  initial={{ strokeDashoffset: 0.14 }}
                  animate={{ strokeDashoffset: -1 }}
                  transition={{
                    duration: PULSE_TRAVEL,
                    delay: i * PULSE_STEP,
                    repeat: Infinity,
                    repeatDelay: Math.max(cycle - PULSE_TRAVEL, 0.2),
                    ease: "easeInOut",
                  }}
                />
              )}
            </g>
          ))}
        </svg>

        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="relative flex flex-col gap-6">
            {column.map((block, blockIndex) => {
              const nodeId = `${columnIndex}-${blockIndex}`;
              if (block.kind === "image") {
                return <ImageBlock key={nodeId} block={block} index={blockIndex} />;
              }
              return (
                <CardNode
                  key={nodeId}
                  nodeId={nodeId}
                  block={block}
                  index={order[nodeId] ?? 0}
                  total={count}
                  register={register}
                />
              );
            })}
          </div>
        ))}
      </div>

      <Reveal className="mx-auto mt-10 max-w-7xl px-6" delay={0.1}>
        <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted/70">
          <span className="inline-block h-px w-8 bg-brand-line" />
          One connected service network
          <span className="inline-block h-px w-8 bg-brand-line" />
        </p>
      </Reveal>
    </section>
  );
}
