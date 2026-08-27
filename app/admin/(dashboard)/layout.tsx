import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, ExternalLink, LayoutDashboard, LogOut, Layers } from "lucide-react";
import { getSession } from "@/lib/admin/auth";
import { logoutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s │ Training dashboard" },
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/modules", label: "Training modules", icon: Layers },
  { href: "/admin/intakes", label: "Upcoming intakes", icon: CalendarClock },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // The single gate for the whole dashboard. Every page underneath inherits it,
  // and the actions in `app/admin/actions.ts` re-check independently because a
  // Server Action is reachable without ever rendering this layout.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-brand-haze lg:flex">
      <aside className="bg-brand-deep text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
        <div className="flex h-full flex-col px-5 py-6">
          <p className="px-2 font-heading text-sm font-extrabold uppercase tracking-[0.14em] text-brand-sky">
            Zhavilah
          </p>
          <p className="mt-1 px-2 font-heading text-lg font-extrabold">Training dashboard</p>

          <nav className="mt-8 flex flex-wrap gap-1 lg:flex-col">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-1 border-t border-white/10 pt-5 lg:mt-auto lg:flex-col lg:items-stretch">
            <Link
              href="/training"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="size-4 shrink-0" />
              View /training
            </Link>

            <form action={logoutAction} className="contents">
              <button
                type="submit"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4 shrink-0" />
                Sign out
                <span className="ml-auto hidden text-xs font-normal text-white/40 lg:inline">
                  {session.username}
                </span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
