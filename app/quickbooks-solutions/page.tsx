import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  FileSpreadsheet,
  LineChart,
  MessageCircle,
  Phone,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Workflow,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";
import { CurtainReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "QuickBooks Solutions",
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

// The one block still carrying no `src` is awaiting photography: it reserves
// its frame with a shot brief and a delivery spec, so adding the real asset is
// a one-line change.
const leftColumn: HistoryBlock[] = [
  {
    kind: "image",
    fit: "contain",
    icon: "laptop",
    src: "/assets/img/service/quickbooks-online-devices.png",
    alt: "QuickBooks Online on a laptop and phone — the same books on every device",
  },
  {
    kind: "card",
    icon: "badge",
    heading: "Licensing You Can Trust",
    text: "We supply genuine QuickBooks Online and QuickBooks Desktop licences, and help you pick the edition that matches how your business actually works.",
  },
  {
    kind: "image",
    fit: "contain",
    icon: "workflow",
    src: "/assets/img/service/quickbooks-data-migration.webp",
    alt: "Accounting data migration — records moving from a source system into a new company file, securely and intact",
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
    fit: "contain",
    icon: "line-chart",
    src: "/assets/img/service/quickbooks-business-overview.png",
    alt: "QuickBooks business overview — cash flow, expenses, profit and loss and bank accounts at a glance",
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

          {/* The card below the photograph is the ProAdvisor certification
              lock-up, still awaiting its badge asset. */}
          <div className="relative">
            <CurtainReveal
              className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_18px_55px_rgba(25,20,65,0.12)]"
              from="left"
            >
              <Image
                src="/assets/img/service/quickbooks-hero.jpg"
                alt="Two colleagues reviewing an accounting dashboard on a laptop"
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 590px"
                className="object-cover"
              />
            </CurtainReveal>

            <Reveal
              delay={0.45}
              className="absolute -bottom-6 left-6 right-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_18px_55px_rgba(25,20,65,0.14)] sm:right-auto"
            >
              <Image
                src="/assets/img/service/quickbooks-proadvisor.png"
                alt="Intuit QuickBooks Certified ProAdvisor — Online"
                width={480}
                height={638}
                className="h-16 w-auto shrink-0"
              />
              <div>
                <div className="font-heading text-base font-extrabold text-brand-ink">
                  Certified QuickBooks ProAdvisors
                </div>
                <span className="mt-1 block text-sm text-brand-muted">
                  QuickBooks Online &amp; Desktop
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
                className="group rounded-2xl border border-brand-line bg-white p-8 shadow-[0_12px_35px_rgba(25,20,65,0.06)] transition-colors hover:border-brand/40"
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
          {/* The photograph carries the "partner, not vendor" half of this
              section, so it sits beside the deliverables rather than above
              them — which also gives a portrait crop somewhere to live. */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <CurtainReveal
              className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_18px_55px_rgba(25,20,65,0.12)]"
              from="left"
            >
              <Image
                src="/assets/img/service/quickbooks-team-support.webp"
                alt="A ProAdvisor working through a client's books alongside their finance officer"
                fill
                sizes="(max-width: 1024px) 92vw, 590px"
                className="object-cover"
              />
            </CurtainReveal>

            <div>
              <SectionHeading
                eyebrow="Complete Business Solution"
                title="More Than Software — A Complete Business Solution"
              />
              <Reveal delay={0.12}>
                <p className="mt-6 leading-relaxed text-brand-muted">
                  We don&apos;t just sell QuickBooks — we become your trusted accounting technology partner.
                  Our Certified QuickBooks ProAdvisors provide:
                </p>
              </Reveal>

              <Stagger className="mt-8 grid gap-4 sm:grid-cols-2" step={0.06}>
                {deliverables.map((item, i) => (
                  <StaggerItem
                    as="article"
                    key={item}
                    lift
                    className="group relative overflow-hidden rounded-2xl border border-brand-line bg-white p-5 transition-colors hover:border-brand/40"
                  >
                    <span className="font-mono text-xs font-semibold tracking-[0.18em] text-brand-muted/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-heading text-[0.95rem] font-extrabold leading-snug text-brand-ink">
                      {item}
                    </h3>
                    <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand-sky transition-transform duration-300 group-hover:scale-x-100" />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>

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
            <Image
              src="/assets/img/service/quickbooks-proadvisor.png"
              alt="Intuit QuickBooks Certified ProAdvisor — Online"
              width={480}
              height={638}
              className="mx-auto mb-8 h-20 w-auto drop-shadow-[0_10px_30px_rgba(13,11,36,0.45)]"
            />
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
