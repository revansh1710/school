import { defineType, defineField } from "sanity";

export default defineType({
  name: "academics",
  title: "Academics",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
    }),

    defineField({
      name: "board",
      title: "Affiliation / Board",
      type: "string",
    }),

    defineField({
      name: "classes",
      title: "Classes Offered",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "departments",
      title: "Departments",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Department Name" },
            { name: "description", type: "text", title: "Description" },
          ],
        },
      ],
    }),

    defineField({
      name: "methodology",
      title: "Teaching Methodology",
      type: "text",
    }),

    defineField({
      name: "highlights",
      title: "Academic Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});