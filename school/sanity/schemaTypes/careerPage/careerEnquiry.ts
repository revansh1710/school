import { defineType, defineField } from "sanity"

export default defineType({
  name: "careerEnquiry",
  title: "Career Applications",
  type: "document",
  fields: [
    defineField({
      name: "applicantName",
      title: "Applicant Name",
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
      name: "positionAppliedFor",
      title: "Position Applied For",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message / Cover Letter",
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
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Interview Scheduled", value: "interview_scheduled" },
          { title: "Offered", value: "offered" },
          { title: "Hired", value: "hired" },
          { title: "Rejected", value: "rejected" }
        ]
      }
    }),
    {
      name: "resume",
      title: "Resume / CV",
      type: "file"
    },
    {
      name: "portfolio",
      title: "Portfolio / Additional Documents",
      type: "file"
    },
    defineField({
      name: "interviewDate",
      title: "Scheduled Interview Date",
      type: "datetime"
    })
  ],
})
