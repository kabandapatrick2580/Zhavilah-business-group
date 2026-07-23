import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";

export const metadata: Metadata = {
  title: "Accounting Services │ ZHAVILAH BUSINESS GROUP Ltd",
};

const leftColumn: HistoryBlock[] = [
  { kind: "image", icon: "spreadsheet", src: "/assets/img/project/project-1.jpg", alt: "Accounting Services" },
  {
    kind: "card",
    icon: "calculator",
    heading: "Reliable Financial Solutions",
    text: "At ZHAVILAH BUSINESS GROUP Ltd, we are committed to delivering reliable, tailored accounting solutions designed to help you navigate the complexities of finance and grow your business with confidence.",
  },
  { kind: "image", icon: "users", src: "/assets/img/project/project-2.jpg", alt: "Experienced Accountants" },
  {
    kind: "card",
    icon: "handshake",
    heading: "Expert Financial Team",
    text: "Our team of experienced accountants and financial experts is dedicated to providing clear, concise, and strategic guidance to optimize your financial health.",
  },
  { kind: "image", icon: "banknote", src: "/assets/img/project/project-3.jpg", alt: "Financial Services" },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    icon: "layers",
    eyebrow: "Accounting Services",
    heading: "Comprehensive Solutions",
    text: "From tax planning and bookkeeping to auditing and business consulting, we are here to simplify your financial journey with our professional accounting services.",
  },
  { kind: "image", icon: "line-chart", src: "/assets/img/project/project-4.jpg", alt: "Accounting Benefits" },
  {
    kind: "card",
    icon: "target",
    heading: "Personalized Approach",
    text: "We take the time to understand your specific goals and challenges, providing timely, accurate, and efficient accounting solutions for your financial needs.",
  },
  { kind: "image", icon: "compass", src: "/assets/img/project/project-5.jpg", alt: "Financial Planning" },
  {
    kind: "card",
    icon: "trending",
    heading: "Business Growth Focus",
    text: "Partner with ZHAVILAH BUSINESS GROUP Ltd and let us handle the accounting while you focus on what matters most—growing your business and achieving your financial goals.",
  },
];

export default function AccountingServicesPage() {
  return (
    <main>
      <Breadcrumb title="Accounting Services" trail={[{ label: "Accounting Services" }]} />
      <ServiceHistory columns={[leftColumn, rightColumn]} />
    </main>
  );
}
