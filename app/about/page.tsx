import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus, TrendingUp } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq, { type FaqItem } from "@/components/ui/Faq";
import TeamGrid, { type TeamMember } from "@/components/about/TeamGrid";

export const metadata: Metadata = {
  title: "About Us │ ZHAVILAH BUSINESS GROUP Ltd",
};

const values: { title: string; text: string }[] = [
  {
    title: "Professionalism",
    text: "At ZHAVILAH Business Group Ltd, professionalism is at the heart of everything we do. We are committed to upholding the highest standards of integrity, competence, and accountability in every aspect of our business.",
  },
  {
    title: "Integrity",
    text: "Integrity is the cornerstone of our business practices. We believe in doing what's right, even when no one is watching.",
  },
  {
    title: "Confidentiality",
    text: "We take extra care with the privacy and confidentiality of our clients' business information. This commitment allows us to create value while safeguarding our clients' best interests.",
  },
];

const brands: { src: string; alt: string }[] = [
  { src: "/assets/img/about/IMUVERA LOGO.jpeg", alt: "Imuvera" },
  { src: "/assets/img/about/SALAMA LOGO.PNG", alt: "Salama" },
];

const faqs: FaqItem[] = [
  {
    question: "1. What services does ZHAVILAH Business Group offer?",
    answer: (
      <>
        <p>We provide a wide range of business advisory services including:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Accounting Services</li>
          <li>Bookkeeping Services</li>
          <li>Taxation Services</li>
          <li>Auditing Services</li>
          <li>Business Advisory Services</li>
          <li>Customs Clearing and Forwarding</li>
          <li>Bonded Warehousing</li>
          <li>Transport and Logistics</li>
          <li>Professional Training Services</li>
        </ul>
      </>
    ),
  },
  {
    question: "2. What tax services do you provide?",
    answer: (
      <>
        <p>Our tax advisory services include:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Corporate Income Tax (CIT)</li>
          <li>Personal Income Tax (PIT)</li>
          <li>Quarterly Installment Prepayment (IQP)</li>
          <li>Trading License</li>
          <li>Value Added Tax (VAT)</li>
          <li>Payroll Taxes</li>
          <li>RSSB Contributions</li>
          <li>Withholding Tax</li>
          <li>District Taxes</li>
        </ul>
        <p className="mt-2">We help minimize your tax liability while ensuring full compliance.</p>
      </>
    ),
  },
  {
    question: "3. What business advisory services do you offer?",
    answer: (
      <>
        <p>Our business registration services include:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Company registration with Rwanda Development Board (RDB)</li>
          <li>Annual return filing</li>
          <li>Business amendments</li>
          <li>Business plan preparation</li>
          <li>Beneficial ownership registration</li>
          <li>Investment certificate requests</li>
          <li>Certificate of good standing requests</li>
          <li>Business closure processes</li>
        </ul>
        <p className="mt-2">We handle all paperwork and regulatory requirements for you.</p>
      </>
    ),
  },
  {
    question: "4. What training programs does ZHAVILAH offer?",
    answer: (
      <>
        <p>
          ZHAVILAH Training Center provides practical training from beginner to advanced levels. Our courses
          cover Applied Business Accounting, Tax Preparation and Declarations, QuickBooks Software, Financial
          Decision Analysis and Financial Reporting.
        </p>
        <p className="mt-2">
          Flexible learning options include classroom sessions, day &amp; evening classes, weekend programs,
          online learning and one-on-one sessions, typically spanning 4 weeks of hands-on training.
        </p>
      </>
    ),
  },
];

const team: TeamMember[] = [
  {
    name: "Andre Hitimana, MBA ACCA finalist",
    role: "Director",
    image: "/assets/img/about/hitman.png",
    bio: "Andre Hitimana holds a Master in Business Administration (MBA) specializing in Accounting and Finance from Annamalai University, India and a Bachelor of Accounting Sciences from National University of Rwanda. He is an ACCA finalist with a wide range of experience in accounting, bookkeeping, taxation, auditing, financial advisory and business advisory acquired from different accounting firms across the industry.",
  },
  {
    name: "CPA Jean Pierre Nsanzumukiza MFIN",
    role: "Head of Accounting and Advisory Services",
    image: "/assets/img/about/1.jpeg",
    bio: "CPA Jean Pierre Nsanzumukiza holds a Master in Finance from Kigali Independent University and a Bachelor of Science Hons in Accounting from the University of Rwanda. He is a certified public accountant (CPA) and a member of the Institute of Certified Public Accountants of Rwanda (ICPAR). He previously served as senior internal auditor at ICM Rwanda AGRIBUSINESS, accountant at East Africa Exchange (EAX) Ltd, financial and compliance auditor at the Office of the Auditor General (OAG), and customs officer at Rwanda Revenue Authority (RRA).",
  },
  {
    name: "CPA Francois Songa MBA",
    role: "Head of Audit and Advisory Services",
    image: "/assets/img/about/ppp.png",
    bio: "CPA Francois Songa holds a Master in Business Administration (MBA) specialized in Finance and Accounting from the University of Kigali and a Bachelor of Science Hons in Accounting from the University of Rwanda. He is a certified public accountant (CPA), a member of ICPAR, and a certified financial modeling and valuation analyst (FMVA) accredited by the Corporate Finance Institute of Canada. He previously served as managing director at FS Global Consulting Ltd and audit and consulting manager at DNR Partners CPA Ltd.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <Breadcrumb title="About Us" trail={[{ label: "About Us" }]} />

      {/* About */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <img
              src="/assets/img/about/_S7A1754.jpg"
              alt="ZHAVILAH Business Group"
              className="w-full rounded-3xl object-cover shadow-[0_18px_55px_rgba(8,63,52,0.12)]"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="About ZHAVILAH" title="One Stop Solution of Choice to Every Business" />
            <div className="mt-6 space-y-5">
              <div>
                <h3 className="font-heading text-lg font-semibold text-brand-ink">Vision</h3>
                <p className="mt-1 leading-relaxed text-brand-muted">
                  To be a one-stop solution of choice for every business.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-brand-ink">Mission</h3>
                <p className="mt-1 leading-relaxed text-brand-muted">
                  Our mission is to empower businesses through a one-stop center for expert consulting —
                  fostering innovation and driving positive transformation across all aspects of their
                  operations. We deliver customized solutions that enable our clients to achieve sustainable
                  growth and long-term success.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-brand-ink">Core Values</h3>
                <div className="mt-3 space-y-4">
                  {values.map((v) => (
                    <div key={v.title}>
                      <h4 className="font-semibold text-brand-ink">{v.title}</h4>
                      <p className="mt-1 leading-relaxed text-brand-muted">{v.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/industries"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Our Services <Plus className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-brand-haze py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Why Choose Us" title="Your Trusted Business Partner" />
            <p className="mt-5 leading-relaxed text-brand-muted">
              At ZHAVILAH Business Group Ltd, our mission is to empower businesses through a one-stop center for
              expert consulting — fostering innovation and driving positive transformation across all aspects of
              their operations. We deliver customized solutions that help our clients achieve sustainable growth
              and long-term success.
            </p>
            <Link
              href="/industries"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Our Services <Plus className="size-4" />
            </Link>
          </div>
          <div className="relative">
            <img
              src="/assets/img/about/4.jpeg"
              alt="ZHAVILAH team at work"
              className="w-full rounded-3xl object-cover shadow-[0_18px_55px_rgba(8,63,52,0.12)]"
            />
            <div className="absolute -bottom-6 left-6 flex items-center gap-4 rounded-2xl bg-brand-lime p-5 shadow-lg">
              <TrendingUp className="size-8 text-brand" />
              <div>
                <div className="font-heading text-3xl font-bold text-brand-ink">8+</div>
                <span className="text-sm font-medium text-brand-ink">Service Categories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-12 px-6">
          {brands.map((b) => (
            <img key={b.alt} src={b.src} alt={b.alt} className="h-16 w-auto object-contain" />
          ))}
        </div>
      </section>

      {/* Training CTA + FAQ */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div className="flex flex-col justify-center rounded-3xl bg-brand p-10 text-white">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Visit Our Training Center</h2>
            <p className="mt-5 leading-relaxed text-white/80">
              Learn from industry experts with years of real-world experience. We offer practical training for
              both beginners and seasoned professionals in Rwandan Taxation, Applied Business Accounting, and
              QuickBooks Accounting Software.
            </p>
            <Link
              href="/training"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-brand-lime px-7 py-4 text-sm font-semibold text-brand-dark transition hover:bg-white"
            >
              Training Center <Plus className="size-4" />
            </Link>
          </div>
          <div>
            <SectionHeading eyebrow="FAQ Questions" title="Common Questions About Our Services" />
            <div className="mt-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-brand-haze py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Team member" title="Our Leadership Team" center className="mb-12" />
          <TeamGrid members={team} />
        </div>
      </section>
    </main>
  );
}
