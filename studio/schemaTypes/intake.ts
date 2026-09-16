import { defineField, defineType } from "sanity";

/**
 * §2.2 — Training programs, the dated half.
 *
 * `trainingModule` is the syllabus, which changes rarely. An intake is one
 * scheduled run of it that people apply to, and it is the part with behaviour:
 * /training leads with the next one worth announcing and counts down to it.
 * See `lib/training/dates.ts` for the phase rules these dates drive.
 *
 * TIMEZONE: Sanity stores a datetime as a UTC instant and the Studio's picker
 * shows it in the editor's own browser timezone. The site renders in
 * Africa/Kigali (fixed UTC+02:00, no daylight saving). For editors in Kigali
 * the two agree exactly; an editor working from another country will see their
 * own local time in the Studio and should read the published page to confirm.
 */
export const intake = defineType({
  name: "intake",
  title: "Training intake",
  type: "document",
  description:
    "One scheduled run of the training. The soonest published intake that has not closed leads /training.",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "schedule", title: "Schedule" },
    { name: "payment", title: "Payment" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "details",
      description: 'For example "January 2027 intake".',
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      group: "details",
      description: "One or two sentences shown under the heading.",
      validation: (rule) => rule.max(400),
    }),

    defineField({
      name: "opensAt",
      title: "Applications open",
      type: "datetime",
      group: "schedule",
      description: "Before this moment the apply button is inert and the page counts down to it.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closesAt",
      title: "Application deadline",
      type: "datetime",
      group: "schedule",
      description: "Optional. After it, the intake drops off the page.",
      validation: (rule) =>
        rule.custom((closesAt, context) => {
          const opensAt = (context.document as { opensAt?: string } | undefined)?.opensAt;
          if (!closesAt || !opensAt) return true;
          return closesAt > opensAt || "The deadline must come after applications open.";
        }),
    }),
    defineField({
      name: "startsAt",
      title: "First day of class",
      type: "datetime",
      group: "schedule",
      description:
        "Optional. Shown as detail, and used as the countdown target when there is no deadline.",
      validation: (rule) =>
        rule.custom((startsAt, context) => {
          const opensAt = (context.document as { opensAt?: string } | undefined)?.opensAt;
          if (!startsAt || !opensAt) return true;
          return startsAt > opensAt || "Class cannot start before applications open.";
        }),
    }),

    defineField({
      name: "mode",
      type: "string",
      group: "details",
      description: 'Free text — "Classroom", "Online", "Hybrid", "Evenings & weekends"…',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "location",
      type: "string",
      group: "details",
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: "fee",
      type: "string",
      group: "details",
      description: 'Free text so it can carry a currency and a qualifier: "RWF 150,000 per participant".',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "seats",
      type: "number",
      group: "details",
      description: "Optional. Leave empty if places are not capped.",
      validation: (rule) => rule.integer().positive(),
    }),

    // The company's standing payment details, preloaded on every new intake by
    // `initialValue` so an editor only touches them when an account changes.
    // They live on the intake rather than in site settings because a run of the
    // training could one day be collected elsewhere.
    defineField({
      name: "payment",
      title: "Payment details",
      type: "object",
      group: "payment",
      description: "Shown on the training page so applicants know where to pay the fee.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "companyName",
          title: "Company name",
          type: "string",
          initialValue: "ZHAVILAH BUSINESS GROUP LTD",
          validation: (rule) => rule.max(160),
        }),
        defineField({
          name: "reason",
          type: "string",
          initialValue: "Training Fee",
          description: "What the payer writes as the reason for the transfer.",
          validation: (rule) => rule.max(160),
        }),
        defineField({
          name: "bankName",
          title: "Bank",
          type: "string",
          initialValue: "Equity",
          validation: (rule) => rule.max(80),
        }),
        defineField({
          name: "bankAccount",
          title: "Bank account",
          type: "string",
          initialValue: "4003201102265",
          validation: (rule) => rule.max(40),
        }),
        defineField({
          name: "momoCode",
          title: "MoMo code",
          type: "string",
          initialValue: "221231",
          validation: (rule) => rule.max(40),
        }),
      ],
    }),

    defineField({
      name: "applicationUrl",
      title: "Application form link",
      type: "url",
      group: "details",
      description: "The Google Form (or equivalent) the apply button opens in a new tab.",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "published",
      title: "Show on the website",
      type: "boolean",
      group: "details",
      description: "Unpublished intakes are visible here only.",
      initialValue: false,
    }),
  ],
  orderings: [
    { title: "Opens soonest", name: "opensAsc", by: [{ field: "opensAt", direction: "asc" }] },
    { title: "Newest first", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", opensAt: "opensAt", published: "published" },
    prepare: ({ title, opensAt, published }) => ({
      title: published ? title : `${title} (hidden)`,
      subtitle: opensAt
        ? `Applications open ${new Date(opensAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Africa/Kigali",
          })}`
        : "No opening date",
    }),
  },
});
