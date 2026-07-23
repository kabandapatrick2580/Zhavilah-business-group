"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { EASE, Stagger, StaggerItem } from "@/components/motion/primitives";

export type GalleryImage = { src: string; alt: string };

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    // Stop the page behind the lightbox from scrolling.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active]);

  return (
    <>
      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
        {images.map((img, i) => (
          <StaggerItem key={img.src} lift>
            <motion.button
              type="button"
              onClick={() => setActive(i)}
              // Shared element: the tile morphs into the lightbox image.
              layoutId={reduce ? undefined : `gallery-${img.src}`}
              className="group relative block h-72 w-full overflow-hidden rounded-2xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-brand-dark/0 transition group-hover:bg-brand-dark/50">
                <span className="flex size-11 scale-75 items-center justify-center rounded-full bg-brand-sky text-brand opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <Plus className="size-5" />
                </span>
              </span>
            </motion.button>
          </StaggerItem>
        ))}
      </Stagger>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-deep/90 p-6 backdrop-blur-sm"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={images[active].alt}
          >
            <motion.button
              type="button"
              aria-label="Close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.15, duration: 0.3, ease: EASE }}
              className="absolute right-6 top-6 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              onClick={() => setActive(null)}
            >
              <X className="size-6" />
            </motion.button>

            <motion.div
              layoutId={reduce ? undefined : `gallery-${images[active].src}`}
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
              className="relative h-[80vh] w-full max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[active].src}
                alt={images[active].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
