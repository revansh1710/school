import {defineType} from 'sanity';
export const careerDocumentItem = defineType({
  name: "careerDocumentItem",
  type: "object",
  fields: [
    { name: "name", type: "string" },
    { name: "notes", type: "string" },
  ],
});
