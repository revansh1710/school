import {defineType} from 'sanity';
export const admissionsOverview = defineType({
  name: "admissionsOverview",
  type: "object",
  fields: [
    { name: "heading", type: "string" },
    { name: "description", type: "array", of: [{ type: "block" }] },
  ],
});