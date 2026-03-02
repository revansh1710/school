import { groq } from "next-sanity";

export const contactQuery = groq`
*[_type == "contact"][0]{
  title,
  description,
  address,
  phone,
  email,
  officeHours,
  mapUrl,
  ctaText
}
`;