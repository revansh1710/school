import {defineType} from 'sanity';
export const processStep = defineType({
  name: "processStep",
  type: "object",
  fields: [
    { name: "title", type: "string" },
    { name: "description", type: "text" },
    { name: "order", type: "number" },
  ],
});