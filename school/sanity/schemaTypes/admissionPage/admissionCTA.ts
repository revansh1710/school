import {defineType} from 'sanity';
export const admissionsCTA = defineType({
  name: "admissionsCTA",
  type: "object",
  fields: [
    { name: "heading", type: "string" },
    { name: "description", type: "text" },
    { name: "primaryButtonText", type: "string" },
    { name: "primaryButtonLink", type: "string" },
    { name: "secondaryButtonText", type: "string" },
    { name: "secondaryButtonLink", type: "string" },
  ],
});