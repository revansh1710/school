import {defineType} from 'sanity';
export const careerOverview = defineType({
  name: "careerOverview",
  type: "object",
  fields: [
    { name: "heading", type: "string" },
    { name: "description", type: "array", of: [{ type: "block" }] },
  ],
});
