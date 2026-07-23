import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";

export const metadata: Metadata = {
  title: "Business Advisory │ ZHAVILAH BUSINESS GROUP Ltd",
};

const leftColumn: HistoryBlock[] = [
  { kind: "image", src: "/assets/img/project/project-1.jpg", alt: "Business Advisory" },
  {
    kind: "card",
    heading: "Expert Business Advisory",
    text: "At ZHAVILAH BUSINESS GROUP Ltd, we offer expert Business Advisory Services designed to help you navigate today's complex business landscape.",
  },
  { kind: "image", src: "/assets/img/project/project-2.jpg", alt: "Business Planning" },
  {
    kind: "card",
    heading: "Tailored Solutions",
    text: "Our experienced advisors work closely with you to understand your unique goals and challenges, providing strategic insights and actionable solutions.",
  },
  { kind: "image", src: "/assets/img/about/1708158441664.jpg", alt: "Business Strategy" },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    eyebrow: "Business Advisory",
    heading: "Strategic Guidance",
    text: "Whether you're a startup, a growing enterprise, or an established organization, our tailored advice helps you make smarter decisions, streamline operations, and drive long-term success.",
  },
  {
    kind: "image",
    src: "/assets/img/about/Image-for-article-2-Strategy-Compass-1110x504.jpg.webp",
    alt: "Business Registration",
  },
  {
    kind: "card",
    heading: "Registration & Compliance",
    text: "We provide comprehensive services including Business Registration, Annual Return Filing, Beneficial Ownership registration, Business Amendments, Certificate of Good Standing, Investment certificate request, business plan and Business Closure support.",
  },
  { kind: "image", src: "/assets/img/project/project-5.jpg", alt: "Business Growth" },
  {
    kind: "card",
    heading: "Sustainable Growth",
    text: "From business planning and financial strategies to risk management and operational efficiency, we're here to help you build a sustainable future for your business.",
  },
];

export default function BusinessAdvisoryPage() {
  return (
    <main>
      <Breadcrumb title="Business Advisory" trail={[{ label: "Business Advisory" }]} />
      <ServiceHistory columns={[leftColumn, rightColumn]} />
    </main>
  );
}
