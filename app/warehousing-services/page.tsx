import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";

export const metadata: Metadata = {
  title: "Warehousing Services │ ZHAVILAH BUSINESS GROUP Ltd",
};

const leftColumn: HistoryBlock[] = [
  { kind: "image", src: "/assets/img/project/project-1.jpg", alt: "Customs Bonded Warehouse" },
  {
    kind: "card",
    heading: "Secure Customs Bonded Warehouse",
    text: "At ZHAVILAH BUSINESS GROUP Ltd, we provide you with a secured facility where imported goods can be stored without the payment of customs duties and taxes until they are cleared for entry into the domestic market.",
  },
  { kind: "image", src: "/assets/img/project/project-2.jpg", alt: "Warehouse Storage" },
  {
    kind: "card",
    heading: "Cost-Effective Storage Solutions",
    text: "Our Customs Bonded Warehouse provides businesses with a cost-effective way to manage their goods while awaiting clearance, offering flexible storage services to meet your specific needs.",
  },
  {
    kind: "image",
    src: "/assets/img/about/large-wooden-case-1-uai-1200x675.jpg",
    alt: "Warehouse Operations",
  },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    eyebrow: "Warehouse Services",
    heading: "Comprehensive Documentation",
    text: "Our expert team handles all cargo documentation requirements, ensuring your goods are properly recorded and compliant with all regulatory standards throughout the storage period.",
  },
  {
    kind: "image",
    src: "/assets/img/about/warehousing-repacking-and-labeling1985.jpg",
    alt: "Value-Added Services",
  },
  {
    kind: "card",
    heading: "Repacking and Labeling",
    text: "We offer value-added services including repacking and labeling options for your stored goods, providing flexibility to prepare your products for their final destination.",
  },
  { kind: "image", src: "/assets/img/about/ncua-bond-rule-change.webp", alt: "Compliance Management" },
  {
    kind: "card",
    heading: "Bond Management and Compliance",
    text: "Trust ZHAVILAH BUSINESS GROUP Ltd for expert bond management and compliance services, along with seamless import and export facilitation for your goods in transit and transshipment services.",
  },
];

export default function WarehousingServicesPage() {
  return (
    <main>
      <Breadcrumb title="Warehousing Services" trail={[{ label: "Warehousing Services" }]} />
      <ServiceHistory columns={[leftColumn, rightColumn]} />
    </main>
  );
}
