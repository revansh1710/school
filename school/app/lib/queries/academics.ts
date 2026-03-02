import { groq } from "next-sanity";
export const academicsQuery = groq`
*[_type == "academics"][0]{
  title,
  overview,
  board,
  classes,
  departments,
  methodology,
  highlights
}
`;