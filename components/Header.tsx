"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { NAV, type NavItem } from "@/lib/site";
import { EASE } from "@/components/motion/primitives";

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href !== "#" && pathname === item.href) return true;
  return item.children?.some((c) => c.href === pathname) ?? false;
}

export default function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Transparent at the top of the page, solid once it has scrolled. The gap
  // between the two thresholds stops the bar's own height change from nudging
  // the scroll position back across a single cut-off and flickering.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) =>
    setScrolled((was) => (was ? latest > 12 : latest > 40)),
  );

  // Every page except the homepage opens on a dark banner, so while the bar is
  // transparent it switches to light text and a white logo there.
  const onDark = pathname !== "/" && !scrolled;

  return (
    <header
      className="zbg-site-header fixed inset-x-0 top-0 z-40"
      data-scrolled={scrolled ? "" : undefined}
      data-tone={onDark ? "light" : undefined}
    >
      {/* Main bar */}
      <motion.div
        className="relative z-40"
        animate={{
          paddingTop: scrolled ? 0 : 6,
          paddingBottom: scrolled ? 0 : 6,
        }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="shrink-0">
            <motion.span
              className="block"
              whileHover={reduce ? undefined : { scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <Image
                src="/assets/img/logo-2.png"
                alt="ZHAVILAH BUSINESS GROUP"
                width={500}
                height={186}
                priority
                className="zbg-logo h-10 w-auto"
              />
            </motion.span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="group relative"
                  onMouseEnter={() => setDropdown(item.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setDropdown(dropdown === item.label ? null : item.label)}
                    aria-expanded={dropdown === item.label}
                    className={`flex items-center gap-1 py-2 text-[15px] font-medium transition hover:text-accent ${
                      isActive(pathname, item) ? "text-accent" : "text-ink"
                    }`}
                  >
                    {item.label}
                    <motion.span
                      animate={{ rotate: dropdown === item.label ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="inline-flex"
                    >
                      <ChevronDown className="size-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {dropdown === item.label && (
                      <motion.ul
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className="absolute left-0 top-full z-50 w-64 origin-top rounded-lg border border-line bg-white p-2 shadow-card"
                      >
                        {item.children.map((c, i) => (
                          <motion.li
                            key={c.href}
                            initial={reduce ? false : { opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.03 * i, duration: 0.25, ease: EASE }}
                          >
                            <Link
                              href={c.href}
                              onClick={() => setDropdown(null)}
                              className={`block rounded-md px-3 py-2 text-sm transition hover:bg-haze hover:text-accent ${
                                pathname === c.href ? "text-accent" : "text-body"
                              }`}
                            >
                              {c.label}
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`py-2 text-[15px] font-medium transition hover:text-accent ${
                    isActive(pathname, item) ? "text-accent" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <motion.span
              className="hidden sm:block"
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
              >
                Get a Quote <ArrowRight className="size-4" />
              </Link>
            </motion.span>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex items-center justify-center rounded-md p-2 text-ink lg:hidden"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-brand-ink/60"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-white p-6 shadow-float"
            >
              <div className="mb-6 flex items-center justify-between">
                <Image
                  src="/assets/img/logo.png"
                  alt="ZHAVILAH BUSINESS GROUP"
                  width={500}
                  height={186}
                  className="h-9 w-auto"
                />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-md p-1 text-ink"
                >
                  <X className="size-6" />
                </button>
              </div>

              <motion.nav
                className="flex flex-col"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
              >
                {NAV.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, x: reduce ? 0 : 24 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
                    }}
                  >
                    {item.children ? (
                      <div className="border-b border-line">
                        <button
                          type="button"
                          onClick={() => setServicesOpen((v) => !v)}
                          aria-expanded={servicesOpen}
                          className="flex w-full items-center justify-between py-3 font-medium text-ink"
                        >
                          {item.label}
                          <motion.span
                            animate={{ rotate: servicesOpen ? 180 : 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="inline-flex"
                          >
                            <ChevronDown className="size-4" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {servicesOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                              className="overflow-hidden pb-2"
                            >
                              {item.children.map((c) => (
                                <li key={c.href}>
                                  <Link
                                    href={c.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block py-2 pl-4 text-sm text-body hover:text-accent"
                                  >
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block border-b border-line py-3 font-medium text-ink hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.nav>

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-accent"
              >
                Get a Quote <ArrowRight className="size-4" />
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
