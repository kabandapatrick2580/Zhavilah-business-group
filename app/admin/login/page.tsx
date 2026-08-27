import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import { getSession, isAdminConfigured } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Sign in",
  // The admin area is not content. Keeping it out of the index costs nothing
  // and removes the easiest way to find that it exists at all.
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getSession()) redirect("/admin");
  const configured = isAdminConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-haze px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex justify-center">
          <Image
            src="/assets/img/logo-2.png"
            alt="ZHAVILAH BUSINESS GROUP Ltd"
            width={190}
            height={48}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>

        <div className="rounded-2xl border border-brand-line bg-white p-8 shadow-[0_18px_50px_rgba(11,38,74,0.08)]">
          <h1 className="font-heading text-2xl font-extrabold text-brand-ink">Training dashboard</h1>
          <p className="mt-1.5 mb-7 text-sm text-brand-muted">
            Sign in to manage the training modules and intakes shown on the website.
          </p>

          {configured ? (
            <LoginForm />
          ) : (
            <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p className="leading-relaxed">
                No admin account is configured on this server. Set{" "}
                <code className="font-mono text-[13px]">ADMIN_USERNAME</code>,{" "}
                <code className="font-mono text-[13px]">ADMIN_PASSWORD</code> and{" "}
                <code className="font-mono text-[13px]">ADMIN_SESSION_SECRET</code>, then restart — see{" "}
                <code className="font-mono text-[13px]">docs/TRAINING-DASHBOARD.md</code>.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-brand-muted">
          <Link href="/" className="font-semibold transition hover:text-brand">
            ← Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
