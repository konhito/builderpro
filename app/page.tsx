import Hero from "@/components/Hero";
import TrustBanner from "@/components/TrustBanner";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <Testimonials />
    </>
  );
}
