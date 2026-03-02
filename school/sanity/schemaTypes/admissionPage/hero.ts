import {defineType} from 'sanity';
export const admissionsHero = defineType({
  name: "admissionsHero",
  type: "object",
  fields: [
    { name: "title", type: "string" },
    { name: "subtitle", type: "text" },
    { name: "statusLabel", type: "string" }, // e.g. "Admissions Open 2026–27"
    { name: "backgroundImage", type: "image" },
  ],
});