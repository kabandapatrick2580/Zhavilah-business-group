import { getContent } from "@/lib/content";

export const metadata = {
  title: "Industries We Serve │ ZHAVILAH BUSINESS GROUP Ltd",
};

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("industries") }} />;
}
