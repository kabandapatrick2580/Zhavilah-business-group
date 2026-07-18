import { getContent } from "@/lib/content";

// Site header / navigation. Markup is the original template header, untouched.
export default function Header() {
  return <div dangerouslySetInnerHTML={{ __html: getContent("header") }} />;
}
