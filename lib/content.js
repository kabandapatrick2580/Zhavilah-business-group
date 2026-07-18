import fs from "fs";
import path from "path";

// Reads a pre-extracted HTML partial from /content and returns it as a string.
// These partials are the original template markup (design untouched); they are
// injected verbatim via dangerouslySetInnerHTML so styling stays identical.
export function getContent(name) {
  const file = path.join(process.cwd(), "content", `${name}.html`);
  return fs.readFileSync(file, "utf8");
}

export function Html({ name, as: Tag = "div", className }) {
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: getContent(name) }}
    />
  );
}
