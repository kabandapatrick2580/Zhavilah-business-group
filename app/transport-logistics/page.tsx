import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";

export const metadata: Metadata = {
  title: "Transport & Logistics │ ZHAVILAH BUSINESS GROUP Ltd",
};

const leftColumn: HistoryBlock[] = [
  { kind: "image", icon: "truck", src: "/assets/img/about/roads-and-transport-scaled.jpg", alt: "Road Transportation" },
  {
    kind: "card",
    icon: "route",
    heading: "Comprehensive Road Transportation",
    text: "At ZHAVILAH BUSINESS GROUP Ltd, we provide reliable road transportation services that connect businesses with markets across the region, ensuring your cargo reaches its destination safely and on time.",
  },
  { kind: "image", icon: "ship", src: "/assets/img/project/project-2.jpg", alt: "Sea Freight" },
  {
    kind: "card",
    icon: "anchor",
    heading: "Sea and Coast Freight Solutions",
    text: "Our sea and coast freight transport services offer cost-effective shipping options for large volumes of cargo, with comprehensive management from port to final destination.",
  },
  { kind: "image", icon: "map-pin", src: "/assets/img/about/sea-freight-auckland.webp", alt: "Inland Transport" },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    icon: "plane",
    eyebrow: "Transport Services",
    heading: "Efficient Air Cargo Transport",
    text: "When time is critical, our air cargo transport services provide the fastest delivery options for your valuable or time-sensitive shipments, with global reach and local expertise.",
  },
  { kind: "image", icon: "send", src: "/assets/img/about/rwandair_cargo_press_photo.jpg", alt: "Courier Services" },
  {
    kind: "card",
    icon: "package-check",
    heading: "Reliable Courier Freight Services",
    text: "Our courier freight services offer door-to-door delivery solutions for smaller packages and documents, combining speed with tracking capabilities for complete peace of mind.",
  },
  { kind: "image", icon: "container", src: "/assets/img/project/project-5.jpg", alt: "Removal Services" },
  {
    kind: "card",
    icon: "globe",
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
