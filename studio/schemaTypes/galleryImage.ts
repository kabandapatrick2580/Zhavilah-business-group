import { defineField, defineType } from "sanity";

/** §2.2 — Gallery. Replaces the hardcoded array in app/gallery/page.tsx. */
export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describes the photograph for screen readers and search engines.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "alt", subtitle: "caption", media: "image" },
  },
});
