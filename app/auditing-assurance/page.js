import { getContent } from "@/lib/content";

export const metadata = {
  title: "Auditing & Assurance │ ZHAVILAH BUSINESS GROUP Ltd",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("auditing-assurance") }} />;
}
