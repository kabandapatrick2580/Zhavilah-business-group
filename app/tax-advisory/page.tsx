import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";

export const metadata: Metadata = {
  title: "Tax Advisory │ ZHAVILAH BUSINESS GROUP Ltd",
};

const leftColumn: HistoryBlock[] = [
  { kind: "image", src: "/assets/img/project/project-1.jpg", alt: "Tax Advisory Services" },
  {
    kind: "card",
    heading: "Expert Tax Planning",
    text: "At ZHAVILAH BUSINESS GROUP Ltd, we understand that tax planning and compliance can be overwhelming. That's why we're here to simplify the process and help you make informed decisions that can optimize your tax situation.",
  },
  { kind: "image", src: "/assets/img/project/project-2.jpg", alt: "Tax Compliance" },
  {
    kind: "card",
    heading: "Customized Tax Solutions",
    text: "With years of experience and in-depth knowledge of tax laws, we offer customized solutions designed to minimize your tax liability, maximize your savings, and ensure full compliance with all tax regulations.",
  },
  { kind: "image", src: "/assets/img/project/project-3.jpg", alt: "Tax Services" },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    eyebrow: "Tax Advisory Services",
    heading: "Comprehensive Tax Support",
    text: "From corporate and personal income tax to value added tax and payroll taxes, we provide comprehensive support for all your taxation needs across Rwanda.",
  },
  { kind: "image", src: "/assets/img/project/project-4.jpg", alt: "Tax Benefits" },
  {
    kind: "card",
    heading: "Tax Savings Strategies",
    text: "Our expert advisors develop strategies designed to minimize tax liabilities and increase financial efficiency for individuals, small businesses, and large enterprises.",
  },
  { kind: "image", src: "/assets/img/project/project-5.jpg", alt: "Tax Planning" },
  {
    kind: "card",
    heading: "Peace of Mind",
    text: "Partner with ZHAVILAH BUSINESS GROUP Ltd and gain peace of mind knowing your taxes are in the hands of trusted professionals who understand Rwanda's tax regulations.",
  },
];

export default function TaxAdvisoryPage() {
  return (
    <main>
      <Breadcrumb title="Tax Advisory" trail={[{ label: "Tax Advisory" }]} />
      <ServiceHistory columns={[leftColumn, rightColumn]} />
    </main>
  );
}
