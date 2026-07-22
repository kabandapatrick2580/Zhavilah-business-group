"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { CONTACT, NAV, SOCIALS, type NavItem } from "@/lib/site";
import { SocialIcon } from "@/components/icons";

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href !== "#" && pathname === item.href) return true;
  return item.children?.some((c) => c.href === pathname) ?? false;
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="relative z-40">
      {/* Top bar */}
      <div className="hidden bg-primary text-white/90 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5 text-sm">
          <div className="flex items-center gap-6">
            <a href={CONTACT.emailHref} className="flex items-center gap-2 hover:text-white">
              <Mail className="size-4" /> {CONTACT.email}
            </a>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white">
              <Phone className="size-4" /> {CONTACT.phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="opacity-90 transition hover:opacity-100"
              >
                <SocialIcon name={s.icon} className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="sticky top-0 z-40 border-b border-line bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="shrink-0">
            <img src="/assets/img/logo.png" alt="ZHAVILAH BUSINESS GROUP" className="h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className={`flex items-center gap-1 py-2 text-[15px] font-medium transition hover:text-accent ${
                      isActive(pathname, item) ? "text-accent" : "text-ink"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="size-4 transition group-hover:rotate-180" />
                  </button>
                  <ul className="invisible absolute left-0 top-full z-50 w-64 translate-y-2 rounded-lg border border-line bg-white p-2 opacity-0 shadow-card transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className={`block rounded-md px-3 py-2 text-sm transition hover:bg-haze hover:text-accent ${
                            pathname === c.href ? "text-accent" : "text-body"
                          }`}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
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
            <Link
              href="/contact"
              className="hidden items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent sm:inline-flex"
            >
              Get a Quote <ArrowRight className="size-4" />
            </Link>
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
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-white p-6 shadow-float">
            <div className="mb-6 flex items-center justify-between">
              <img src="/assets/img/logo.png" alt="ZHAVILAH BUSINESS GROUP" className="h-9 w-auto" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1 text-ink"
              >
                <X className="size-6" />
              </button>
            </div>
            <nav className="flex flex-col">
              {NAV.map((item) =>
                item.children ? (
                  <div key={item.label} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setServicesOpen((v) => !v)}
                      className="flex w-full items-center justify-between py-3 font-medium text-ink"
                    >
                      {item.label}
                      <ChevronDown className={`size-4 transition ${servicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    {servicesOpen && (
                      <ul className="pb-2">
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
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-line py-3 font-medium text-ink hover:text-accent"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-accent"
            >
              Get a Quote <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
