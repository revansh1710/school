import {defineType} from 'sanity';
export const careerProcessStep = defineType({
  name: "careerProcessStep",
  type: "object",
  fields: [
    { name: "title", type: "string" },
    { name: "description", type: "text" },
    { name: "order", type: "number" },
  ],
});
