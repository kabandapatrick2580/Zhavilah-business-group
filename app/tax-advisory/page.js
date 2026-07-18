import { getContent } from "@/lib/content";

export const metadata = {
  title: "Tax Advisory │ ZHAVILAH BUSINESS GROUP Ltd",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("tax-advisory") }} />;
}
