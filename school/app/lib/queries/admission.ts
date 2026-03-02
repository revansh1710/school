export const admissionsQuery = `
*[_type == "admissionsPage"][0]{
  hero{
    title,
    subtitle,
    statusLabel,
    "backgroundImage": backgroundImage.asset->url
  },
  overview,
  eligibility,
  process|order(order asc),
  documents,
  cta
}
`;