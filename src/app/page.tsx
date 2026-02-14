import Navbar from "@/components/luxury/Navbar";
import Hero from "@/components/luxury/Hero";
import FeaturedCollection from "@/components/luxury/FeaturedCollection";
import OurStory from "@/components/luxury/OurStory";
import ProductList from "@/components/luxury/ProductList";

import { mockProducts } from "@/data/products";

export default function Home() {
  const featuredProducts = mockProducts
    .filter((p) => p.metadata.grade === 'AAA')
    .slice(0, 4);

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <FeaturedCollection />
      <OurStory />
      <ProductList products={featuredProducts} hideFilters />
    </main>
  );
}
