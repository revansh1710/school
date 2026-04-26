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
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Documents Submitted", value: "documents_submitted" },
          { title: "Interview Scheduled", value: "interview_scheduled" },
          { title: "Accepted", value: "accepted" },
          { title: "Rejected", value: "rejected" },
          { title: "Withdrawn", value: "withdrawn" }
        ]
      }
    }),
    {
      name: "documents",
      type: "object",
      fields: [
        { name: "birthCertificate", type: "file" },
        { name: "previousMarksheet", type: "file" },
        { name: "transferCertificate", type: "file" }
      ]
    },
    {
      name: "documentsStatus",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Submitted", value: "submitted" },
          { title: "Verified", value: "verified" }
        ]
      }
    },
    {
      name: "gradeCategory",
      type: "string"
    },
    defineField({
      name: "requiredDocuments",
      title: "Required Documents",
      type: "array",
      of: [{ type: "string" }]
    }),
    {
      name: "dateOfBirth",
      type: "date"
    },
    defineField({
      name: "interviewDate",
      title: "Requested/Scheduled Interview Date",
      type: "datetime"
    }),
    defineField({
      name: "interviewApprovalStatus",
      title: "Interview Approval Status",
      type: "string",
      options: {
        list: [
          { title: "Pending Request", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" }
        ]
      }
    })
  ],
})