import { getContent } from "@/lib/content";

// Subscribe band + footer + copyright. Original template markup, untouched.
export default function Footer() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("footer") }} />;
}
