import {defineType} from 'sanity';
export const eligibilityItem = defineType({
  name: "eligibilityItem",
  type: "object",
  fields: [
    { name: "grade", type: "string" },
    { name: "criteria", type: "text" },
  ],
});