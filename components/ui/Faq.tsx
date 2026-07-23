"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-brand-line bg-white"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading text-base font-semibold text-brand-ink"
            >
              {item.question}
              <Plus
                className={`size-5 shrink-0 text-brand transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-brand-muted">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
