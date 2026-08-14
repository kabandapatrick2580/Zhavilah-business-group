import { defineArrayMember, defineType } from "sanity";

/**
 * The rich-text field shared by blog posts, services and pages.
 *
 * The style list is deliberately short. Editors get the marks they need for
 * business copy and nothing that could break the site's typography — no colour
 * pickers, no font sizes, no raw HTML.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "Describes the image for screen readers and search engines.",
          validation: (rule) => rule.required(),
        },
        { name: "caption", title: "Caption", type: "string" },
      ],
    }),
  ],
});
