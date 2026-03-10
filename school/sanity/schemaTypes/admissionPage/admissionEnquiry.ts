import { defineType, defineField } from "sanity"

export default defineType({
  name: "admissionEnquiry",
  title: "Admission Enquiries",
  type: "document",
  fields: [
    defineField({
      name: "parentName",
      title: "Parent Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "studentName",
      title: "Student Name",
      type: "string",
    }),
    defineField({
      name: "grade",
      title: "Grade Applying For",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["ENQUIRY", "DOCUMENTS", "INTERVIEW","ACCEPTED","REJECTED","ENROLLED"],
      },
      initialValue: "new",
    }),
  ],
})