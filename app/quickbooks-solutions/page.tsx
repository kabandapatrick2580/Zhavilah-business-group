import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  FileSpreadsheet,
  ImagePlus,
  LineChart,
  MessageCircle,
  Phone,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Workflow,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";
import { CurtainReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "QuickBooks Solutions │ ZHAVILAH BUSINESS GROUP Ltd",
  description:
    "Certified QuickBooks ProAdvisors delivering QuickBooks Online and Desktop licensing, setup, data migration, training and ongoing support for startups, SMEs, NGOs and large enterprises.",
};

/** Who the service is written for — taken straight from the service brief. */
const audiences = ["Startups", "SMEs", "NGOs", "Large enterprises"];

/** The first six benefits sit in a 3×2 grid; the seventh closes the section
    as a full-width strip, which keeps the grid square instead of ragged. */
const benefits: { text: string; icon: React.ElementType }[] = [
  { text: "Automate your accounting and bookkeeping.", icon: Workflow },
  { text: "Create professional invoices and quotations in minutes.", icon: ReceiptText },
  { text: "Track income, expenses, and profitability in real time.", icon: LineChart },
  { text: "Manage inventory with confidence.", icon: Boxes },
  { text: "Monitor your cash flow and business performance from anywhere.", icon: Smartphone },
  { text: "Generate accurate financial reports instantly.", icon: FileSpreadsheet },
];

const closingBenefit = "Stay organized, tax-ready, and in control of your business.";

const deliverables = [
  "QuickBooks Online & Desktop Licensing",
  "Professional Installation and Setup",
  "Company File Configuration and Customization",
  "Data Migration from Existing Systems",
  "User Training and Capacity Building",
  "Ongoing Technical Support and Troubleshooting",
  "Financial Reporting and Accounting Advisory",
  "System Optimization as Your Business Grows",
];

// Photography for this page has not been supplied yet, so the image blocks
// below carry no `src`: each reserves its frame with a shot brief and a
// delivery spec. Adding the real asset is a one-line `src` change.
const leftColumn: HistoryBlock[] = [
  {
    kind: "image",
    icon: "laptop",
    alt: "QuickBooks Online dashboard open on a laptop at a client's desk",
    spec: "1180 × 580 · JPG",
  },
  {
    kind: "card",
    icon: "badge",
    heading: "Licensing You Can Trust",
    text: "We supply genuine QuickBooks Online and QuickBooks Desktop licences, and help you pick the edition that matches how your business actually works.",
  },
  {
    kind: "image",
    icon: "workflow",
    alt: "ProAdvisor configuring a company file with a client",
    spec: "1180 × 580 · JPG",
  },
  {
    kind: "card",
    icon: "layers",
    heading: "Setup, Configuration & Migration",
    text: "Professional installation, company file configuration and customization, and clean data migration from your existing systems — so you start on accurate books, not a rebuild.",
  },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    icon: "handshake",
    eyebrow: "QuickBooks Solutions",
    heading: "Your Accounting Technology Partner",
    text: "We don't just sell QuickBooks — we become your trusted accounting technology partner, from implementation through to ongoing support.",
  },
  {
    kind: "image",
    icon: "presentation",
    alt: "Training session with a client's finance team",
    spec: "1180 × 580 · JPG",
  },
  {
    kind: "card",
    icon: "graduation",
    heading: "Training & Capacity Building",
    text: "Your team is trained on the workflows they will use every day, so QuickBooks becomes a habit rather than a system somebody has to be chased about.",
  },
  {
    kind: "image",
    icon: "line-chart",
    alt: "Business owner reviewing QuickBooks reports on a tablet",
    spec: "1180 × 580 · JPG",
  },
  {
    kind: "card",
    icon: "trending",
    heading: "Support That Grows With You",
    text: "Ongoing technical support and troubleshooting, financial reporting and accounting advisory, and system optimization as your business grows.",
  },
];

export default function QuickBooksSolutionsPage() {
  return (
    <main>
      <Breadcrumb title="QuickBooks Solutions" trail={[{ label: "QuickBooks Solutions" }]} />

      {/* Promise */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Certified QuickBooks ProAdvisors"
              title="Simplify Your Business. Take Control of Your Finances."
            />
            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-brand-muted">
                Running a business should be about serving your customers, growing your business, and
                increasing your profits — not struggling with paperwork and complicated accounting.
              </p>
              <p className="mt-4 leading-relaxed text-brand-muted">
                As Certified QuickBooks ProAdvisors, we help businesses transform the way they manage their
                finances with QuickBooks Online and QuickBooks Desktop. We provide complete accounting
                solutions that save time, improve accuracy, and give you the financial insights you need to
                make confident business decisions.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-muted/70">
                Built for
              </p>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {audiences.map((a) => (
                  <li
                    key={a}
                    className="rounded-full border border-brand-line bg-brand-haze px-4 py-2 text-sm font-semibold text-brand-ink"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.28} className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Talk to a ProAdvisor <ArrowRight className="size-4" />
              </Link>
              <a
                href={CONTACT.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-brand px-7 py-4 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
              >
                <Phone className="size-4" /> {CONTACT.phone}
              </a>
            </Reveal>
          </div>

          {/* Reserved hero artwork. The card below it is the ProAdvisor
              certification lock-up, also awaiting its asset. */}
          <div className="relative">
            <CurtainReveal className="aspect-[4/5] w-full" from="left">
              <ImagePlaceholder
                icon="laptop"
                label="QuickBooks Online in use — consultant and business owner reviewing the dashboard together"
                spec="1000 × 1250 · JPG"
              />
            </CurtainReveal>

            <Reveal
              delay={0.45}
              className="absolute -bottom-6 left-6 right-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_18px_55px_rgba(11,38,74,0.14)] sm:right-auto"
            >
              <span className="zbg-placeholder flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-brand/25 text-brand">
                <ImagePlus className="size-5" />
              </span>
              <div>
                <div className="flex items-center gap-2 font-heading text-base font-extrabold text-brand-ink">
                  <BadgeCheck className="size-4 text-brand" /> Certified QuickBooks ProAdvisors
                </div>
                <span className="mt-1 block font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted/70">
                  ProAdvisor badge · 400 × 400 · PNG
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why QuickBooks */}
      <section className="bg-brand-haze py-20 pt-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="The Case for QuickBooks" title="Why Choose QuickBooks?" center />

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" step={0.07}>
            {benefits.map(({ text, icon: Icon }) => (
              <StaggerItem
                as="article"
                key={text}
                lift
                className="group rounded-2xl border border-brand-line bg-white p-8 shadow-[0_12px_35px_rgba(11,38,74,0.06)] transition-colors hover:border-brand/40"
              >
                <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-tint text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <p className="font-heading text-lg font-extrabold leading-snug text-brand-ink">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} className="mt-6">
            <p className="flex flex-col items-center gap-4 rounded-2xl bg-brand p-8 text-center font-heading text-xl font-extrabold text-white sm:flex-row sm:text-left">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-sky">
                <ShieldCheck className="size-5" />
              </span>
              {closingBenefit}
            </p>
          </Reveal>
        </div>
      </section>

      {/* What our ProAdvisors provide */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <SectionHeading
              eyebrow="Complete Business Solution"
              title="More Than Software — A Complete Business Solution"
            />
            <Reveal delay={0.12}>
              <p className="leading-relaxed text-brand-muted">
                We don&apos;t just sell QuickBooks — we become your trusted accounting technology partner. Our
                Certified QuickBooks ProAdvisors provide:
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.06}>
            {deliverables.map((item, i) => (
              <StaggerItem
                as="article"
                key={item}
                lift
                className="group relative overflow-hidden rounded-2xl border border-brand-line bg-white p-7 transition-colors hover:border-brand/40"
              >
                <span className="font-mono text-xs font-semibold tracking-[0.18em] text-brand-muted/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-base font-extrabold leading-snug text-brand-ink">
                  {item}
                </h3>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand-sky transition-transform duration-300 group-hover:scale-x-100" />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-12 max-w-3xl text-center leading-relaxed text-brand-muted">
              From implementation to ongoing support, we&apos;re committed to helping you maximize the value of
              your QuickBooks investment.
            </p>
          </Reveal>
        </div>
      </section>

      <ServiceHistory columns={[leftColumn, rightColumn]} />

      {/* Closing call to action */}
      <section className="py-20">
        <Reveal className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-dark px-8 py-14 text-center text-white sm:px-14">
            <h2 className="mx-auto max-w-2xl font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
              Ready to take control of your finances?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/80">
              Talk to a Certified QuickBooks ProAdvisor about licensing, setup, migration and training for your
              team.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand-sky px-7 py-4 text-sm font-semibold text-brand-dark transition hover:bg-white"
              >
                Request a Quote <ArrowRight className="size-4" />
              </Link>
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="size-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
