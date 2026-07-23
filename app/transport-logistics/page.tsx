import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";

export const metadata: Metadata = {
  title: "Transport & Logistics │ ZHAVILAH BUSINESS GROUP Ltd",
};

const leftColumn: HistoryBlock[] = [
  { kind: "image", src: "/assets/img/about/roads-and-transport-scaled.jpg", alt: "Road Transportation" },
  {
    kind: "card",
    heading: "Comprehensive Road Transportation",
    text: "At ZHAVILAH BUSINESS GROUP Ltd, we provide reliable road transportation services that connect businesses with markets across the region, ensuring your cargo reaches its destination safely and on time.",
  },
  { kind: "image", src: "/assets/img/project/project-2.jpg", alt: "Sea Freight" },
  {
    kind: "card",
    heading: "Sea and Coast Freight Solutions",
    text: "Our sea and coast freight transport services offer cost-effective shipping options for large volumes of cargo, with comprehensive management from port to final destination.",
  },
  { kind: "image", src: "/assets/img/about/sea-freight-auckland.webp", alt: "Inland Transport" },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    eyebrow: "Transport Services",
    heading: "Efficient Air Cargo Transport",
    text: "When time is critical, our air cargo transport services provide the fastest delivery options for your valuable or time-sensitive shipments, with global reach and local expertise.",
  },
  { kind: "image", src: "/assets/img/about/rwandair_cargo_press_photo.jpg", alt: "Courier Services" },
  {
    kind: "card",
    heading: "Reliable Courier Freight Services",
    text: "Our courier freight services offer door-to-door delivery solutions for smaller packages and documents, combining speed with tracking capabilities for complete peace of mind.",
  },
  { kind: "image", src: "/assets/img/project/project-5.jpg", alt: "Removal Services" },
  {
    kind: "card",
    heading: "Domestic & International Removals",
    text: "Trust ZHAVILAH BUSINESS GROUP Ltd for comprehensive domestic and international removal services for personal effects, along with innovative e-commerce logistics solutions to support your online business.",
  },
];

export default function TransportLogisticsPage() {
  return (
    <main>
      <Breadcrumb title="Transport & Logistics" trail={[{ label: "Transport & Logistics" }]} />
      <ServiceHistory columns={[leftColumn, rightColumn]} />
    </main>
  );
}
