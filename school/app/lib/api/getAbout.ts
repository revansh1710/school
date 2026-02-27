import { client } from "@/sanity/lib/client";
import { aboutQuery } from "../queries/about";

export async function getAboutData() {
  return client.fetch(aboutQuery);
}