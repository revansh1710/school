import {defineType} from 'sanity';
export const documentItem = defineType({
  name: "documentItem",
  type: "object",
  fields: [
    { name: "name", type: "string" },
    { name: "notes", type: "string" },
  ],
});