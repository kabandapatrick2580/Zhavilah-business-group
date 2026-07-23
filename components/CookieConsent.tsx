"use client";

// Bottom-anchored cookie notice.
//
// Three first-class actions — accept all, reject non-essential, or open the
// per-category preferences — so the "reject" path is exactly as reachable as
// the "accept" path. Once a choice is stored the banner is replaced by a small
// launcher, because consent has to remain changeable after the fact.

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Cookie, Settings2, X } from "lucide-react";
import {
  ACCEPT_ALL,
  CATEGORIES,
  REJECT_ALL,
  readConsent,
  writeConsent,
  type Consent,
  type ConsentCategory,
} from "@/lib/consent";
import { EASE } from "@/components/motion/primitives";

export default function CookieConsent() {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [decided, setDecided] = useState(false);
  const [choices, setChoices] = useState<Consent>(REJECT_ALL);

  // Read the stored decision after mount only — localStorage is unavailable
  // during SSR and reading it in render would desync hydration.
  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setChoices(stored.consent);
      setDecided(true);
    } else {
      setOpen(true);
    }
    setReady(true);
  }, []);

  const save = useCallback((consent: Consent) => {
    writeConsent(consent);
    setChoices(consent);
    setDecided(true);
    setShowDetails(false);
    setOpen(false);
  }, []);

  const toggle = (id: ConsentCategory) =>
    setChoices((prev) => ({ ...prev, [id]: !prev[id] }));

  // Escape closes the banner only once a decision already exists, so a
  // first-time visitor can't dismiss it without choosing.
  useEffect(() => {
    if (!open || !decided) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, decided]);

  if (!ready) return null;

  const slide = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 120, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 80, scale: 0.98 },
      };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside
            key="cookie-banner"
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-title"
            {...slide}
            transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
            className="fixed inset-x-0 bottom-0 z-[70] px-3 pb-3 sm:px-5 sm:pb-5"
          >
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-brand-line bg-white/95 shadow-[0_24px_70px_rgba(11,38,74,0.22)] backdrop-blur-xl">
              {/* Light-blue top edge — a small brand cue on an otherwise plain surface */}
              <div className="h-1 bg-gradient-to-r from-brand via-accent to-brand-sky" />

              <div className="p-5 sm:p-7">
                <div className="flex items-start gap-4">
                  <motion.span
                    aria-hidden="true"
                    initial={reduce ? false : { rotate: -18, scale: 0.7 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 14 }}
                    className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand sm:flex"
                  >
                    <Cookie className="size-5" />
                  </motion.span>

                  <div className="min-w-0 flex-1">
                    <h2
                      id="cookie-title"
                      className="font-heading text-lg font-extrabold text-brand-ink"
                    >
                      We value your privacy
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
                      Zhavilah Business Group uses cookies to keep the site secure, understand how
                      it is used, and improve the services we offer. You can accept everything,
                      keep only what is strictly necessary, or choose per category.
                    </p>
                  </div>

                  {decided && (
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close cookie settings"
                      className="-mr-1 -mt-1 rounded-full p-1.5 text-brand-muted transition hover:bg-brand-haze hover:text-brand"
                    >
                      <X className="size-5" />
                    </button>
                  )}
                </div>

                {/* Per-category preferences */}
                <AnimatePresence initial={false}>
                  {showDetails && (
                    <motion.div
                      key="cookie-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0.15 : 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 grid gap-2.5 border-t border-brand-line pt-5">
                        {CATEGORIES.map((category, i) => {
                          const checked = choices[category.id];
                          return (
                            <motion.div
                              key={category.id}
                              initial={reduce ? false : { opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * i, duration: 0.35, ease: EASE }}
                              className="flex items-start gap-4 rounded-xl bg-brand-haze p-4"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="font-heading text-sm font-extrabold text-brand-ink">
                                  {category.label}
                                </span>
                                <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                                  {category.description}
                                </p>
                              </div>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={checked}
                                aria-label={`${category.label} cookies`}
                                disabled={category.locked}
                                onClick={() => !category.locked && toggle(category.id)}
                                className={`relative mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors ${
                                  checked ? "bg-brand" : "bg-brand-line"
                                } ${category.locked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                              >
                                <motion.span
                                  layout
                                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                                  className="size-5 rounded-full bg-white shadow-sm"
                                  style={{ marginLeft: checked ? "auto" : 0 }}
                                />
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <motion.button
                    type="button"
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => save(ACCEPT_ALL)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,58,107,0.28)] transition hover:bg-brand-dark"
                  >
                    <Check className="size-4" /> Accept all
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => save(REJECT_ALL)}
                    className="inline-flex items-center justify-center rounded-full border border-brand-line bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:border-brand hover:bg-brand-haze"
                  >
                    Reject non-essential
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setShowDetails((v) => !v)}
                    aria-expanded={showDetails}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-brand-muted transition hover:text-brand sm:ml-auto"
                  >
                    <Settings2 className="size-4" />
                    {showDetails ? "Hide preferences" : "Manage preferences"}
                  </button>

                  {showDetails && (
                    <motion.button
                      type="button"
                      initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => save(choices)}
                      className="inline-flex items-center justify-center rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
                    >
                      Save my choices
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Launcher — lets a visitor revisit the decision at any time. Sits
          bottom-left so it never collides with the floating contact buttons. */}
      <AnimatePresence>
        {decided && !open && (
          <motion.button
            key="cookie-launcher"
            type="button"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            whileHover={reduce ? undefined : { scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setOpen(true)}
            aria-label="Cookie settings"
            className="group fixed bottom-6 left-6 z-[65] flex size-11 items-center justify-center rounded-full border border-brand-line bg-white text-brand shadow-[0_10px_30px_rgba(11,38,74,0.18)]"
          >
            <Cookie className="size-5" />
            <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-full bg-brand-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
              Cookie settings
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
