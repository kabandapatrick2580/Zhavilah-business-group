import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <main>
      <Breadcrumb title="Page Not Found" trail={[{ label: "404" }]} />

      <section className="py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-heading text-[7rem] font-extrabold leading-none tracking-tight text-brand sm:text-[9rem]">
            4<span className="text-brand-sky">0</span>4
          </h1>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-brand-ink sm:text-4xl">
            This page doesn&apos;t exist.
          </h2>
          <p className="mt-4 leading-relaxed text-brand-muted">
            The link may be broken or the page may have moved. Head back to the homepage to find what you need.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Back to Home <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
