import {defineType} from 'sanity';
export const careerHero = defineType({
  name: "careerHero",
  type: "object",
  fields: [
    { name: "title", type: "string" },
    { name: "subtitle", type: "text" },
    { name: "statusLabel", type: "string" },
    { name: "backgroundImage", type: "image" },
  ],
});
