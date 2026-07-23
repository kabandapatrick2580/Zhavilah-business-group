import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Plus, ShieldCheck, Wrench } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";

export const metadata: Metadata = {
  title: "Industries We Serve │ ZHAVILAH BUSINESS GROUP Ltd",
};

const industries: { title: string; copy: string; href: string; image: string }[] = [
  {
    title: "Accounting & Financial Services",
    copy: "We help businesses manage their financial health through bookkeeping, tax planning, and financial advisory services.",
    href: "/accounting-services",
    image: "/assets/img/service/service-1.jpg",
  },
  {
    title: "Tax Advisory & Compliance",
    copy: "Navigating tax laws can be complex — our experts provide tailored solutions for businesses and individuals to optimize tax efficiency.",
    href: "/tax-advisory",
    image: "/assets/img/service/service-2.jpg",
  },
  {
    title: "Audit & Assurance",
    copy: "Our auditing services help organizations maintain transparency, mitigate risks, and comply with industry regulations.",
    href: "/auditing-assurance",
    image: "/assets/img/service/service-3.jpg",
  },
  {
    title: "Business Consulting & Advisory",
    copy: "From business registration to strategic planning, we support enterprises with expert guidance to enhance growth and profitability.",
    href: "/business-advisory",
    image: "/assets/img/service/service-4.jpg",
  },
  {
    title: "Customs Clearing & Forwarding",
    copy: "We streamline the import/export process, ensuring hassle-free customs clearance and efficient global trade logistics.",
    href: "/customs-clearing-forwarding",
    image: "/assets/img/service/service-5.jpg",
  },
  {
    title: "Transport & Logistics",
    copy: "Our transportation services cover road, air, and sea freight, ensuring smooth and reliable delivery of goods across borders.",
    href: "/transport-logistics",
    image: "/assets/img/service/service-2.jpg",
  },
  {
    title: "Customs Bonded Warehousing",
    copy: "We provide secure storage facilities for imported goods, allowing businesses to manage inventory efficiently while awaiting clearance.",
    href: "/warehousing-services",
    image: "/assets/img/service/service-3.jpg",
  },
  {
    title: "Professional Training & Development",
    copy: "Our training programs equip professionals with industry-leading knowledge in accounting, taxation, and financial management.",
    href: "/training",
    image: "/assets/img/service/service-4.jpg",
  },
];

const reasons: { title: string; copy: string; icon: React.ElementType }[] = [
  {
    title: "Industry Expertise",
    copy: "Years of experience in financial and business consulting.",
    icon: Award,
  },
  {
    title: "Tailored Solutions",
    copy: "Customized services to meet your unique business needs.",
    icon: Wrench,
  },
  {
    title: "Compliance & Risk Management",
    copy: "Ensuring your business meets all regulatory requirements.",
    icon: ShieldCheck,
  },
];

export default function IndustriesPage() {
  return (
    <main>
      <Breadcrumb title="Industries We Serve" trail={[{ label: "Industries We Serve" }]} />

      <section className="bg-brand-haze py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
            {industries.map((item) => (
              <StaggerItem
                as="article"
                key={item.title}
                lift
                className="group relative isolate flex min-h-[355px] flex-col justify-end overflow-hidden rounded-2xl p-7"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-dark/10 to-brand-dark/95" />
                <div className="relative">
                  <h3 className="font-heading text-xl font-extrabold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{item.copy}</p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-sky transition group-hover:gap-3"
                  >
                    Read More <Plus className="size-4" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Why choose us */}
          <Reveal className="mt-16 text-center" blur>
            <h2 className="font-heading text-3xl font-extrabold text-brand-ink sm:text-4xl">Why Choose Us?</h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3" step={0.12}>
            {reasons.map(({ title, copy, icon: Icon }) => (
              <StaggerItem
                key={title}
                lift
                className="rounded-2xl border border-brand-line bg-white p-9 text-center transition-shadow hover:shadow-[0_18px_42px_rgba(16,58,107,0.1)]"
              >
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-haze text-brand">
                  <Icon className="size-7" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-extrabold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{copy}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </main>
  );
}
