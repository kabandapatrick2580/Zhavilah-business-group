import { defineField, defineType } from "sanity";

/** §2.2 — Homepage banners. */
export const banner = defineType({
  name: "banner",
  title: "Homepage banner",
  type: "document",
  description:
    "The homepage hero. The first active banner is the one shown — reorder them to swap.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Small label above the headline",
      type: "string",
      initialValue: "One stop business solutions",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "heading",
      type: "string",
      description: "Wrap a phrase in *asterisks* to show it in blue.",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "subheading",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "image",
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "Button label",
      type: "string",
      initialValue: "Get a Quote",
    }),
    defineField({
      name: "ctaHref",
      title: "Button link",
      type: "string",
      description: "A path on this site, such as /contact.",
      initialValue: "/contact",
    }),
    defineField({
      name: "active",
      title: "Show on the homepage",
      type: "boolean",
      initialValue: true,
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
    select: { title: "heading", subtitle: "subheading", media: "image", active: "active" },
    prepare: ({ title, subtitle, media, active }) => ({
      title: active ? title : `${title} (hidden)`,
      subtitle,
      media,
    }),
  },
});
