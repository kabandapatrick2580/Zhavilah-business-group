"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { EASE, Stagger, StaggerItem } from "@/components/motion/primitives";

export type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

export default function Faq({ items }: { items: FaqItem[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number>(0);

  return (
    <Stagger className="space-y-3" step={0.07}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <StaggerItem
            key={i}
            className={`overflow-hidden rounded-xl border bg-white transition-colors ${
              isOpen ? "border-brand/40 shadow-[0_12px_30px_rgba(11,38,74,0.08)]" : "border-brand-line"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading text-base font-extrabold text-brand-ink"
            >
              {item.question}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: reduce ? 0.1 : 0.25, ease: EASE }}
                className="inline-flex shrink-0 text-brand"
              >
                <Plus className="size-5" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.38, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-sm leading-relaxed text-brand-muted">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
