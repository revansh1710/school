import { defineType, defineField } from "sanity";

export default defineType({
  name: "careerPage",
  title: "Career Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "careerHero",
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "careerOverview",
    }),
    defineField({
      name: "eligibility",
      title: "Eligibility Criteria",
      type: "array",
      of: [{ type: "careerEligibilityItem" }],
    }),
    defineField({
      name: "process",
      title: "Hiring Process",
      type: "array",
      of: [{ type: "careerProcessStep" }],
    }),
    defineField({
      name: "documents",
      title: "Required Documents",
      type: "array",
      of: [{ type: "careerDocumentItem" }],
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "careerCTA",
    }),
  ],
});
