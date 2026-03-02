import { groq } from "next-sanity";

export const aboutQuery = groq`
*[_type == "about"][0]{
  title,
  description,
  establishedYear,
  affiliation,
  vision,
  mission,
  principalName,
  designation,
  principalMessage,
  principalImage,
  facilities[]{
    title,
    description,
    image
  },
  achievements[]{
    title,
    description,
    year
  }
}
`;