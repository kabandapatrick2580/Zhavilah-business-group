import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleCheckBig } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Message Sent │ ZHAVILAH BUSINESS GROUP Ltd",
};

export default function SuccessPage() {
  return (
    <main>
      <Breadcrumb title="Message Sent!" trail={[{ label: "Contact Us", href: "/contact" }]} />

      <section className="py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-lime text-brand">
            <CircleCheckBig className="size-10" />
          </span>
          <h2 className="mt-8 font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
            Thank you for reaching out!
          </h2>
          <p className="mt-4 leading-relaxed text-brand-muted">
            Your message has been sent successfully. A member of our team will get back to you as soon as
            possible.
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
