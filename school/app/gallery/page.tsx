import {galleryQuery} from '../lib/queries/gallery'
import GallerySection from '../components/gallery';
import { client } from "@/sanity/lib/client";
export default async function Home() {
    const galleryData=await client.fetch(galleryQuery)
    return(
        <>
        <GallerySection gallery={galleryData}/>
        </>
    )
}