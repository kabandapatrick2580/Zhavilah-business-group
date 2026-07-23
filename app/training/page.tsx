import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";
import { BookOpen, Check, Laptop, Percent } from "lucide-react";

export const metadata: Metadata = {
  title: "Training Center │ ZHAVILAH BUSINESS GROUP Ltd",
};

const modules: { title: string; icon: React.ElementType; items: string[] }[] = [
  {
    title: "Module I: Applied Business Accounting",
    icon: BookOpen,
    items: [
      "Meaning of Accounting",
      "Difference Between Accounting and Bookkeeping",
      "Users of Accounting Information",
      "Characteristics of Good Accounting Information",
      "Meaning of Business Transaction",
      "Difference Between Business Transactions and Events",
      "Cash Accounting and Accrual Accounting",
      "Journal Entries",
      "Elements of Financial Statements",
      "Accounting Equation",
      "Chart of Accounts, General Ledger & Trial Balance",
      "Payroll Management",
      "Inventory Management",
      "Month End Process",
      "Preparation of Financial Statements",
    ],
  },
  {
    title: "Module II: Taxation",
    icon: Percent,
    items: [
      "Corporate Income Tax (CIT)",
      "Value Added Tax (VAT)",
      "Withholding Taxes (WHT)",
      "Payroll Taxes",
      "Local Government Taxes",
      "Learn Basic Skills on How to Use EBM Invoicing Software",
    ],
  },
  {
    title: "Module III: QuickBooks Training",
    icon: Laptop,
    items: [
      "Setting Up a Company File",
      "Customizing a Company File",
      "Create Accounts and Chart of Account",
      "Setting Up Customers, Vendors, Items and Services",
      "Create Quotation, Purchase Order, Invoices and Bills",
      "Receive Payment from Customers",
      "Make Payment of Bills to Vendors",
      "Make Journal Entries",
      "Create and Record Memorized Transactions",
      "Make Bank Reconciliation",
      "Make Business Budget",
      "Create Assets Register",
      "Make Month End Adjustment",
      "Make Financial Statements in QuickBooks",
      "Customize Reports and Templates",
    ],
  },
];

const leftColumn: HistoryBlock[] = [
  { kind: "image", icon: "graduation", src: "/assets/img/about/4 - Copy.jpeg", alt: "Accounting Training" },
  {
    kind: "card",
    icon: "book",
    heading: "Expert Accounting & Taxation Training",
    text: "At ZHAVILAH TRAINING CENTER, we provide top-tier accounting and taxation training designed to help you master the skills you need to excel in today's fast-paced financial world.",
  },
  { kind: "image", icon: "laptop", src: "/assets/img/project/project-2.jpg", alt: "Practical Learning" },
  {
    kind: "card",
    icon: "workflow",
    heading: "Practical, Real-World Learning",
    text: "Our expert instructors use practical, real-world examples to make complex accounting and taxation principles easy to understand, ensuring you gain the confidence to apply your knowledge in any setting.",
  },
  { kind: "image", icon: "presentation", src: "/assets/img/about/_S7A1750.jpg", alt: "Training Sessions" },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    icon: "users",
    eyebrow: "Training Center",
    heading: "Experienced Industry Instructors",
    text: "Learn from industry experts who bring years of real-world experience, offering courses for beginners and experienced professionals looking to sharpen their expertise in Rwandan taxation and accounting software.",
  },
  { kind: "image", icon: "compass", src: "/assets/img/about/_S7A1746b.jpg", alt: "Flexible Learning" },
  {
    kind: "card",
    icon: "repeat",
    heading: "Flexible Training Options",
    text: "With flexible learning options including classroom, online, or one-on-one sessions tailored to your schedule, we're committed to helping you achieve your professional goals.",
  },
  { kind: "image", icon: "trending", src: "/assets/img/about/_S7A1737b.jpg", alt: "Career Advancement" },
  {
    kind: "card",
    icon: "award",
    heading: "Career Advancement Opportunities",
    text: "Join ZHAVILAH TRAINING CENTER today and enhance your skills, increase your marketability, and open doors to new job opportunities with our comprehensive curriculum covering bookkeeping, financial analysis, tax preparation, and more.",
  },
];

export default function TrainingPage() {
  return (
    <main>
      <Breadcrumb title="Training Center" trail={[{ label: "Training" }]} />

      {/* Intro */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-heading text-2xl font-extrabold text-brand-ink">
            Accounting in Business is like Blood in the Human Body!
          </p>
          <p className="mt-5 leading-relaxed text-brand-muted">
            <strong className="text-brand-ink">Remember!!</strong> If you can&apos;t Record, You Can&apos;t
            Measure; and If you can&apos;t Measure, You Can&apos;t Improve! This makes accounting one of the
            most in-demand careers, with organizations continuously seeking skilled professionals to drive
            financial success. However, academic qualifications alone are no longer enough to guarantee a
            thriving career. Employers today are looking for candidates who bring practical, hands-on skills —
            individuals who can deliver tangible results from day one. In today&apos;s competitive job market,
            having the right blend of technical expertise and real-world experience sets you apart. Equip
            yourself with the practical accounting skills that employers are seeking and unlock new
            opportunities for career growth by joining{" "}
            <strong className="text-brand-ink">ZHAVILAH PRACTICAL TRAINING CENTER</strong> to get the full
            package for your accounting position.
          </p>
        </div>
      </section>

      {/* Training contents */}
      <section className="bg-brand-haze py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 font-heading text-3xl font-extrabold text-brand-ink sm:text-4xl">
            Training Contents
          </h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {modules.map(({ title, icon: Icon, items }) => (
              <div
                key={title}
                className="group rounded-2xl border border-brand-line bg-white p-8 shadow-[0_12px_35px_rgba(11,38,74,0.06)] transition hover:-translate-y-1.5 hover:border-brand/40"
              >
                <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-tint text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-heading text-lg font-extrabold text-brand-ink">{title}</h3>
                <ul className="mt-5 space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-brand-muted">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceHistory columns={[leftColumn, rightColumn]} />
    </main>
  );
}
