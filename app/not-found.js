import { getContent } from "@/lib/content";

export const metadata = {
  title: "Not Found │ ZHAVILAH BUSINESS GROUP Ltd",
};

export default function NotFound() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("notfound") }} />;
}
