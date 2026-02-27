import Hero from './components/Hero';
import Header from './components/Header';
import AboutSection from './components/about/AboutSection'
import {aboutQuery} from './lib/queries/about';
import { client } from "@/sanity/lib/client";
export default async function Home() {
  const data = await client.fetch(aboutQuery);
  console.log(data)
  return (
    <>
      <Header />
      <Hero />
      <AboutSection data={data}/>
    </>
  );
}
