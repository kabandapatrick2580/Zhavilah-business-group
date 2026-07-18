import { getContent } from "@/lib/content";

export const metadata = {
  title: "Company History │ ZHAVILAH BUSINESS GROUP Ltd",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("company-history") }} />;
}
