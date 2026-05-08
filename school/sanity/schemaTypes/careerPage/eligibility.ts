import {defineType} from 'sanity';
export const careerEligibilityItem = defineType({
  name: "careerEligibilityItem",
  type: "object",
  fields: [
    { name: "role", type: "string", title: "Role / Position" },
    { name: "criteria", type: "text", title: "Eligibility Criteria" },
  ],
});
