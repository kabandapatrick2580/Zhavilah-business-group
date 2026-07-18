import { getContent } from "@/lib/content";

export const metadata = {
  title: "Customs Clearing & Forwarding │ ZHAVILAH BUSINESS GROUP Ltd",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("customs-clearing-forwarding") }} />;
}
