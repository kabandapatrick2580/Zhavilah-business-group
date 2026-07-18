import { getContent } from "@/lib/content";

export const metadata = {
  title: "Business Advisory │ ZHAVILAH BUSINESS GROUP Ltd",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("business-advisory") }} />;
}
