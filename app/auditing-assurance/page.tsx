import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ServiceHistory, { type HistoryBlock } from "@/components/services/ServiceHistory";

export const metadata: Metadata = {
  title: "Auditing & Assurance │ ZHAVILAH BUSINESS GROUP Ltd",
};

const leftColumn: HistoryBlock[] = [
  { kind: "image", icon: "search", src: "/assets/img/project/project-1.jpg", alt: "Auditing Services" },
  {
    kind: "card",
    icon: "file-check",
    heading: "Comprehensive Auditing Solutions",
    text: "At ZHAVILAH BUSINESS GROUP Ltd, we specialize in providing comprehensive auditing services that give you the insights and confidence needed to ensure your financial operations are sound and transparent.",
  },
  { kind: "image", icon: "spreadsheet", src: "/assets/img/project/project-2.jpg", alt: "Financial Audits" },
  {
    kind: "card",
    icon: "users",
    heading: "Skilled Audit Team",
    text: "Our team of skilled auditors uses the latest tools and methodologies to deliver accurate, actionable reports, helping you maintain trust with stakeholders, investors, and regulatory bodies.",
  },
  { kind: "image", icon: "workflow", src: "/assets/img/project/project-3.jpg", alt: "Audit Process" },
];

const rightColumn: HistoryBlock[] = [
  {
    kind: "card",
    icon: "scale",
    eyebrow: "Audit Assurance",
    heading: "Transparency & Integrity",
    text: "We believe that effective auditing is not just about compliance—it's about helping your organization thrive and grow through thorough and honest audits that help you understand your financial position.",
  },
  { kind: "image", icon: "clipboard", src: "/assets/img/project/project-4.jpg", alt: "Audit Reports" },
  {
    kind: "card",
    icon: "shield",
    heading: "Risk Mitigation",
    text: "We identify potential risks and provide practical recommendations to strengthen your financial controls, helping you improve business operations and safeguard your financial future.",
  },
  { kind: "image", icon: "stamp", src: "/assets/img/project/project-5.jpg", alt: "Audit Compliance" },
  {
    kind: "card",
    icon: "badge",
    heading: "Regulatory Compliance",
    text: "Partner with ZHAVILAH BUSINESS GROUP Ltd for peace of mind knowing your financial records are accurate, compliant, and transparent, ensuring your business meets all regulatory requirements.",
  },
];

export default function AuditingAssurancePage() {
  return (
    <main>
      <Breadcrumb title="Auditing & Assurance" trail={[{ label: "Auditing & Assurance" }]} />
      <ServiceHistory columns={[leftColumn, rightColumn]} />
    </main>
  );
}
