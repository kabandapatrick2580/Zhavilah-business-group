import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton — contact details and social profiles shown in the header and
 * footer. Replaces the `CONTACT` and `SOCIALS` constants in lib/site.ts.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "social", title: "Social" },
  ],
  fields: [
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
      group: "contact",
      description: "As displayed, for example +250 788 221 231.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "address",
      type: "text",
      rows: 2,
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      type: "string",
      group: "contact",
      description: "Digits only, including country code — for example 250788221231.",
      validation: (rule) =>
        rule.required().regex(/^\d{7,15}$/, { name: "digits only, 7–15 characters" }),
    }),
    defineField({
      name: "socials",
      title: "Social profiles",
      type: "array",
      group: "social",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "platform",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "X (Twitter)", value: "x" },
                  { title: "Instagram", value: "instagram" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "LinkedIn", value: "linkedin" },
                ],
              },
              validation: (rule) => rule.required(),
            },
            {
              name: "url",
              type: "url",
              validation: (rule) => rule.required(),
            },
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
