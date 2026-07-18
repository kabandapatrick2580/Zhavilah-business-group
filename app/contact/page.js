import { getContent } from "@/lib/content";

export const metadata = {
  title: "Contact Us │ ZHAVILAH BUSINESS GROUP Ltd",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("contact") }} />;
}
