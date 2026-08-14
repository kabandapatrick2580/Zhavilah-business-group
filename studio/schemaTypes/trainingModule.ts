import { defineField, defineType } from "sanity";

/** §2.2 — Training programs. Replaces `modules` in app/training/page.tsx. */
export const trainingModule = defineType({
  name: "trainingModule",
  title: "Training module",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: 'For example "Module II: Taxation".',
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "iconKey",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Book", value: "book" },
          { title: "Percent", value: "percent" },
          { title: "Laptop", value: "laptop" },
          { title: "Graduation cap", value: "graduation" },
          { title: "Presentation", value: "presentation" },
          { title: "Calculator", value: "calculator" },
        ],
      },
      initialValue: "book",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Topics covered",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
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
    select: { title: "title", items: "items" },
    prepare: ({ title, items }) => ({
      title,
      subtitle: `${items?.length ?? 0} topics`,
    }),
  },
});
