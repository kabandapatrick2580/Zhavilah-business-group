import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";

export const metadata: Metadata = {
  title: "Business Advisory",
};

const leftColumn: HistoryBlock[] = [
  { kind: "image", icon: "briefcase", src: "/assets/img/project/project-1.jpg", alt: "Business Advisory" },
  {
    kind: "card",
    icon: "compass",
    heading: "Expert Business Advisory",
    text: "At ZHAVILAH BUSINESS GROUP Ltd, we advise businesses on registration, planning and compliance.",
  },
  { kind: "image", icon: "clipboard", src: "/assets/img/project/project-2.jpg", alt: "Business Planning" },
  {
    kind: "card",
    icon: "target",
    heading: "Advice Built Around Your Business",
    text: "Our experienced advisors work closely with you to understand your unique goals and challenges, providing strategic insights and actionable solutions.",
  },
  { kind: "image", icon: "milestone", src: "/assets/img/about/1708158441664.jpg", alt: "Business Strategy" },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    icon: "route",
    heading: "Strategic Guidance",
    text: "Whether you're a startup, a growing enterprise, or an established organization, we give advice that fits your size and stage.",
  },
  {
    kind: "image",
    icon: "building",
    src: "/assets/img/about/Image-for-article-2-Strategy-Compass-1110x504.jpg.webp",
    alt: "Business Registration",
  },
  {
    kind: "card",
    icon: "scroll",
    heading: "Registration & Compliance",
    text: "We provide comprehensive services including Business Registration, Annual Return Filing, Beneficial Ownership registration, Business Amendments, Certificate of Good Standing, Investment certificate request, business plan and Business Closure support.",
  },
  { kind: "image", icon: "line-chart", src: "/assets/img/project/project-5.jpg", alt: "Business Growth" },
  {
    kind: "card",
    icon: "trending",
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
