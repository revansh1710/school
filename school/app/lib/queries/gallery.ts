export const galleryQuery = `
*[_type == "gallery"][0]{
  _id,
  title,
  images[]{
    alt,
    caption,
    "url": asset->url,
    "metadata": asset->metadata{
      lqip,
      dimensions
    }
  }
}
`;