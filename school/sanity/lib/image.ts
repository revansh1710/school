import  createImageUrlBuilder  from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

const { projectId, dataset } = client.config();

const builder =
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset })
    : null;

export function urlFor(source: SanityImageSource) {
  return builder?.image(source);
}