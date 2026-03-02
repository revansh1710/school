import { defineType, defineField } from "sanity";

export default defineType({
  name: "contact",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),

    defineField({
      name: "address",
      title: "Address",
      type: "text",
    }),

    defineField({
      name: "phone",
      title: "Phone Numbers",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),

    defineField({
      name: "officeHours",
      title: "Office Hours",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "mapUrl",
      title: "Google Maps Embed URL",
      type: "url",
    }),

    defineField({
      name: "ctaText",
      title: "CTA Text",
      type: "string",
    }),
  ],
});