import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";

export const metadata: Metadata = {
  title: "Company History │ ZHAVILAH BUSINESS GROUP Ltd",
};

const PLACEHOLDER =
  "Aliquam sit amet massa quis augue porta consequat eu eu lectus. Praesent a ipsum a sem tristique.";

const leftColumn: HistoryBlock[] = [
  { kind: "image", src: "/assets/img/project/project-1.jpg", alt: "Opening Office" },
  { kind: "card", eyebrow: "2017", heading: "Opening Office", text: PLACEHOLDER },
  { kind: "image", src: "/assets/img/project/project-2.jpg", alt: "Opening Office" },
  { kind: "card", eyebrow: "2017", heading: "Opening Office", text: PLACEHOLDER },
  { kind: "image", src: "/assets/img/project/project-3.jpg", alt: "Opening Office" },
];

const rightColumn: HistoryBlock[] = [
  { kind: "card", eyebrow: "2017", heading: "Opening Office", text: PLACEHOLDER },
  { kind: "image", src: "/assets/img/project/project-4.jpg", alt: "Opening Office" },
  { kind: "card", eyebrow: "2017", heading: "Opening Office", text: PLACEHOLDER },
  { kind: "image", src: "/assets/img/project/project-5.jpg", alt: "Opening Office" },
  { kind: "card", eyebrow: "2017", heading: "Opening Office", text: PLACEHOLDER },
];

export default function CompanyHistoryPage() {
  return (
    <main>
      <Breadcrumb title="Company History" trail={[{ label: "Company History" }]} />
      <ServiceHistory columns={[leftColumn, rightColumn]} />
    </main>
  );
}
