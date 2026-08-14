import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * §2.2 — Services. Replaces the `SERVICES` array in lib/site.ts plus the body
 * copy of the eight service pages.
 *
 * Layout stays in code; this document supplies the text and imagery. See
 * docs/CMS-IMPLEMENTATION.md §3 for the agreed scope boundary.
 */

// Mirrors the keys of SERVICE_ICONS in components/services/serviceIcons.tsx.
// Keep the two lists in step when adding an icon.
const ICON_KEYS = [
  "anchor", "award", "badge", "banknote", "book", "boxes", "briefcase",
  "building", "calculator", "clipboard", "coins", "compass", "container",
  "forklift", "globe", "graduation", "handshake", "key", "landmark", "laptop",
  "layers", "lock", "milestone", "network", "package", "percent", "plane",
  "presentation", "receipt", "repeat", "route", "scale", "scroll", "search",
  "send", "shield", "ship", "sparkles", "spreadsheet", "stamp", "tags",
  "target", "trending", "truck", "users", "warehouse", "workflow",
];

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "The web address of this service page.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navLabel",
      title: "Menu label",
      type: "string",
      description: "Shorter wording for the Services dropdown. Defaults to the title.",
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      description: "One or two sentences, used in listings and link previews.",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "iconKey",
      title: "Icon",
      type: "string",
      options: { list: ICON_KEYS.map((k) => ({ title: k, value: k })) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Header image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        },
      ],
    }),
    defineField({
      name: "body",
      type: "blockContent",
    }),
    defineField({
      name: "faqs",
      title: "Frequently asked questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "question", type: "string", validation: (rule) => rule.required() },
            { name: "answer", type: "text", rows: 4, validation: (rule) => rule.required() },
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Controls the position in the Services menu. Lower numbers appear first.",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "summary", media: "heroImage" },
  },
});
