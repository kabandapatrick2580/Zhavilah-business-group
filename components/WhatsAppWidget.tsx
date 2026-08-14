"use client";

// Floating WhatsApp button that expands into a QR panel.
//
// The button stays where it has always been; the code is revealed on demand
// rather than parked over the page, because a QR is only useful at the moment
// someone decides to scan it. The panel keeps a direct link alongside the code
// so the same control works on a phone, where scanning your own screen is not
// possible.

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { EASE } from "@/components/motion/primitives";

export default function WhatsAppWidget({
  href,
  qrSvg,
  label = "Chat on WhatsApp",
}: {
  href: string;
  /** Pre-rendered SVG markup from `toQrSvg`, generated on the server. */
  qrSvg: string;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes, and focus returns to the button that opened the panel —
  // otherwise a keyboard user is dropped at the top of the document.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Pointer-down rather than click, so the panel closes before any control
  // underneath receives the press.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  return (
    <div ref={wrapper} className="relative">
      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Chat with us on WhatsApp"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: reduce ? 0.15 : 0.28, ease: EASE }}
            // Anchored to the button's bottom-right so it opens upward and
            // inward, never off-screen on a narrow viewport.
            className="absolute bottom-full right-0 mb-3 w-[16.5rem] origin-bottom-right rounded-2xl border border-brand-line bg-white p-4 shadow-float"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-heading text-sm font-extrabold text-brand-ink">Scan to chat</p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  Point your camera here to open WhatsApp.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  close();
                  toggle.current?.focus();
                }}
                aria-label="Close"
                className="-mr-1 -mt-1 rounded-full p-1 text-brand-muted transition hover:bg-brand-haze hover:text-brand-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Generated on the server from our own contact URL. The white
                plate and padding give the code the quiet zone it needs. */}
            <div
              aria-hidden="true"
              className="mt-3 rounded-xl bg-white p-2 ring-1 ring-brand-line [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />

            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              <WhatsAppGlyph className="size-4" />
              Open WhatsApp
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        ref={toggle}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={label}
        className="flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-float transition hover:scale-105"
      >
        <WhatsAppGlyph className="size-6" />
      </button>
    </div>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
