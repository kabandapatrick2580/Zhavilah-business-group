import { getContent } from "@/lib/content";

export const metadata = {
  title: "Transport & Logistics │ ZHAVILAH BUSINESS GROUP Ltd",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("transport-logistics") }} />;
}
