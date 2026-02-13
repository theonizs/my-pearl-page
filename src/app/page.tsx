import Navbar from "@/components/luxury/Navbar";
import Hero from "@/components/luxury/Hero";
import FeaturedCollection from "@/components/luxury/FeaturedCollection";
import OurStory from "@/components/luxury/OurStory";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <FeaturedCollection />
      <OurStory />
    </main>
  );
}
