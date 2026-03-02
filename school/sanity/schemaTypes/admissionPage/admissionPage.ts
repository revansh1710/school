import { defineType, defineField } from "sanity";

export default defineType({
  name: "admissionsPage",
  title: "Admissions Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "admissionsHero",
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "admissionsOverview",
    }),
    defineField({
      name: "eligibility",
      title: "Eligibility Criteria",
      type: "array",
      of: [{ type: "eligibilityItem" }],
    }),
    defineField({
      name: "process",
      title: "Admission Process",
      type: "array",
      of: [{ type: "processStep" }],
    }),
    defineField({
      name: "documents",
      title: "Required Documents",
      type: "array",
      of: [{ type: "documentItem" }],
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "admissionsCTA",
    }),
  ],
});