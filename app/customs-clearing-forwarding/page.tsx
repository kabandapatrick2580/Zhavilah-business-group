import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";

export const metadata: Metadata = {
  title: "Customs Clearing & Forwarding │ ZHAVILAH BUSINESS GROUP Ltd",
};

const leftColumn: HistoryBlock[] = [
  {
    kind: "image",
    icon: "globe",
    src: "/assets/img/about/role-of-customs-clearing-forwarding-cf-agents-in-exports.webp",
    alt: "Customs Clearing Services",
  },
  {
    kind: "card",
    icon: "route",
    heading: "Seamless Clearing and Forwarding",
    text: "At ZHAVILAH BUSINESS GROUP Ltd, we specialize in providing seamless Clearing and Forwarding services to help businesses navigate the complexities of international shipping and customs regulations.",
  },
  { kind: "image", icon: "container", src: "/assets/img/project/project-2.jpg", alt: "Import Export Services" },
  {
    kind: "card",
    icon: "file-text",
    heading: "Expert Customs Documentation",
    text: "Our expert team ensures that your goods move efficiently and safely through customs, handling all aspects from documentation to freight forwarding and final delivery.",
  },
  {
    kind: "image",
    icon: "stamp",
    src: "/assets/img/about/international-moving-customs-1920x1080-1-1536x864.jpeg",
    alt: "Customs Process",
  },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    icon: "package-check",
    eyebrow: "Clearing Services",
    heading: "Comprehensive Import & Export Solutions",
    text: "We offer specialized services for Import (DMC), Export (EX 1), Re-Export (R 1), and Transit Goods (T 1), reducing delays and minimizing costs for your international trade operations.",
  },
  {
    kind: "image",
    icon: "network",
    src: "/assets/img/about/clearing-forwarding-services-500x500.webp",
    alt: "Logistics Network",
  },
  {
    kind: "card",
    icon: "truck",
    heading: "Transport & Logistics Excellence",
    text: "Our services extend to Road Transportation, Sea and Coast freight, Inland Transport, Courier freight, Air cargo transport, and Domestic and international Removal Services for complete logistics solutions.",
  },
  {
    kind: "image",
    icon: "warehouse",
    src: "/assets/img/about/boxes-stacked-in-a-warehouse.webp",
    alt: "Customs Bonded Warehouse",
  },
  {
    kind: "card",
    icon: "lock",
    heading: "Customs Bonded Warehouse",
    text: "Let us take the hassle out of logistics with our secured facility where imported goods can be stored without customs duties and taxes until they are cleared for entry into the domestic market.",
  },
];

export default function CustomsClearingForwardingPage() {
  return (
    <main>
      <Breadcrumb
        title="Customs Clearing & Forwarding"
        trail={[{ label: "Customs Clearing & Forwarding" }]}
      />
      <ServiceHistory columns={[leftColumn, rightColumn]} />
    </main>
  );
}
