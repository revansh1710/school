export const careerQuery = `
*[_type == "careerPage"][0]{
  hero{
    title,
    subtitle,
    statusLabel,
    "backgroundImage": backgroundImage.asset->url
  },
  overview{
    heading,
    description
  },
  eligibility[]{
    role,
    criteria
  },
  process|order(order asc){
    title,
    description,
    order
  },
  documents[]{
    name,
    notes
  },
  cta{
    heading,
    description,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink
  }
}
`;

export const jobPostingsQuery = `
*[_type == "jobPosting" && isActive == true] | order(_createdAt desc) {
  _id,
  title,
  location,
  employmentType,
  summary,
  requirements
}
`;
