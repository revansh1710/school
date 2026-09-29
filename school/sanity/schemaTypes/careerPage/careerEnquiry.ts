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
          { title: "AI Screened", value: "ai_screened" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Interview Scheduled", value: "interview_scheduled" },
          { title: "Offered", value: "offered" },
          { title: "Hired", value: "hired" },
          { title: "Rejected", value: "rejected" }
        ]
      },
      initialValue: "new"
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
    }),
    defineField({
      name: "aiScreeningScore",
      title: "AI Screening Score (0-100)",
      type: "number",
      description: "Automated match score calculated by the AI recruitment agent",
    }),
    defineField({
      name: "aiScreeningSummary",
      title: "AI Screening Summary",
      type: "text",
      description: "Structured evaluation summary generated from applicant cover letter and resume",
    }),
    defineField({
      name: "aiRecommendation",
      title: "AI Recommendation",
      type: "string",
      options: {
        list: [
          { title: "Recommend Interview", value: "Recommend Interview" },
          { title: "Missing Mandatory Certification", value: "Missing Mandatory Certification" },
          { title: "Under-qualified", value: "Under-qualified" },
          { title: "Potential Fit", value: "Potential Fit" },
        ],
      },
    }),
    defineField({
      name: "aiMissingQualifications",
      title: "AI Identified Missing Qualifications",
      type: "array",
      of: [{ type: "string" }],
      description: "Items required by the role that were not identified in the application",
    }),
    defineField({
      name: "aiScreenedAt",
      title: "AI Screened At",
      type: "datetime",
    }),
    defineField({
      name: "aiExecutiveBrief",
      title: "Principal's Executive Brief & Dossier",
      type: "object",
      description: "Confidential interview brief synthesized by AI for the Principal and Selection Committee",
      fields: [
        defineField({
          name: "deNoisedSummary",
          title: "Factual Summary (De-noised)",
          type: "text",
        }),
        defineField({
          name: "statutoryCompliance",
          title: "CBSE & Statutory Compliance Assessment",
          type: "text",
        }),
        defineField({
          name: "tenureContinuity",
          title: "Tenure Stability & Career Continuity",
          type: "text",
        }),
        defineField({
          name: "humanInquiryGuide",
          title: "Human Inquiry Guide (Interview Probes)",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "probeQuestion", type: "string", title: "Targeted Question" },
                { name: "pedagogicalRationale", type: "text", title: "Rationale / What to Look For" },
                { name: "focusArea", type: "string", title: "Focus Area (e.g. Pedagogy, Conflict, Ethics, Transition)" },
              ],
            },
          ],
        }),
        defineField({
          name: "documentChecklist",
          title: "Physical Document Verification Checklist",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "generatedAt",
          title: "Dossier Generated At",
          type: "datetime",
        }),
      ],
    })
  ],
})
