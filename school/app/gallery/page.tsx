import {galleryQuery} from '../lib/queries/gallery'
import GallerySection from '../components/gallery';
import { client } from "@/sanity/lib/client";
import {getCurrentUser} from '../../lib/auth'
export default async function Home() {
    const galleryData=await client.fetch(galleryQuery)
    const user=await getCurrentUser();
    return(
        <>
        <GallerySection gallery={galleryData}/>
        </>
    )
}