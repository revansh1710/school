import HeroCanvas from './components/Hero';
import Header from './components/Header';
import Footer from './components/Footer'
import AboutSection from './components/about/AboutSection'
import {aboutQuery} from './lib/queries/about';
import AcademicsSection from './components/Academics'
import {academicsQuery} from './lib/queries/academics'
import ContactSection from './components/ContactSection';
import {contactQuery} from './lib/queries/contact'
import { client } from "@/sanity/lib/client";
export default async function Home() {
  const aboutData = await client.fetch(aboutQuery);
  const academicData=await client.fetch(academicsQuery)
  const contactData=await client.fetch(contactQuery)
  return (
    <>
      <Header />
      <HeroCanvas />
      <AboutSection data={aboutData}/>
      <AcademicsSection data={academicData}/>
      <ContactSection data={contactData}/>
      <Footer/>
    </>
  );
}
