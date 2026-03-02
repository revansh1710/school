import Hero from './components/Hero';
import Header from './components/Header';
import Footer from './components/Footer'
import AboutSection from './components/about/AboutSection'
import {aboutQuery} from './lib/queries/about';
import AcademicsSection from './components/Academics'
import {academicsQuery} from './lib/queries/academics'
import GallerySection from './components/gallery';
import {galleryQuery} from './lib/queries/gallery';
import ContactSection from './components/ContactSection';
import {contactQuery} from './lib/queries/contact'
import { client } from "@/sanity/lib/client";
export default async function Home() {
  const aboutData = await client.fetch(aboutQuery);
  const academicData=await client.fetch(academicsQuery)
  const galleryData=await client.fetch(galleryQuery);
  const contactData=await client.fetch(contactQuery)
  return (
    <>
      <Header />
      <Hero />
      <AboutSection data={aboutData}/>
      <AcademicsSection data={academicData}/>
      <GallerySection gallery={galleryData}/>
      <ContactSection data={contactData}/>
      <Footer/>
    </>
  );
}
