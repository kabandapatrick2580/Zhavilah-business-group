import { defineField, defineType } from "sanity";

/**
 * §2.2 — Website pages.
 *
 * Scope boundary: this document lets editors change the *text and imagery* of
 * pages that already exist (About, Company History, Industries). It is not a
 * page builder — layout and section structure remain in code. See
 * docs/CMS-IMPLEMENTATION.md §3.
 */
export const page = defineType({
  name: "page",
  title: "Website page",
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
      description: 'Must match an existing route, for example "about".',
      options: { source: "title", maxLength: 96 },
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
      name: "seoDescription",
      title: "Search engine description",
      type: "text",
      rows: 3,
      description: "Around 150 characters. Shown in Google results and link previews.",
      validation: (rule) => rule.max(200),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", media: "heroImage" },
  },
});
