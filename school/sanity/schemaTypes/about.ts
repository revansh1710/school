import { defineType, defineField } from "sanity";

export default defineType({
  name: "about",
  title: "About School",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),

    defineField({
      name: "establishedYear",
      title: "Established Year",
      type: "number",
    }),

    defineField({
      name: "affiliation",
      title: "Board Affiliation",
      type: "string",
    }),

    defineField({
      name: "vision",
      title: "Vision",
      type: "text",
    }),

    defineField({
      name: "mission",
      title: "Mission",
      type: "text",
    }),

    defineField({
      name: "principalName",
      title: "Principal Name",
      type: "string",
    }),

    defineField({
      name: "designation",
      title: "Designation",
      type: "string",
    }),

    defineField({
      name: "principalMessage",
      title: "Principal Message",
      type: "text",
    }),

    defineField({
      name: "principalImage",
      title: "Principal Image",
      type: "image",
      options: { hotspot: true },
    }),

    // 🏫 Facilities Array
    defineField({
      name: "facilities",
      title: "Facilities",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Facility Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Facility Description",
              type: "text",
            }),
            defineField({
              name: "image",
              title: "Facility Image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
        },
      ],
    }),

    // 🏆 Achievements Array
    defineField({
      name: "achievements",
      title: "Achievements",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Achievement Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Achievement Description",
              type: "text",
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "number",
            }),
          ],
        },
      ],
    }),
  ],
});