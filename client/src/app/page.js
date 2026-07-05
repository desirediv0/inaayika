
import HeroSection from "@/components/sections/HeroSection";
import LuxuryMarquee from "@/components/sections/LuxuryMarquee";
import TrustBadgesSection from "@/components/sections/TrustBadgesSection";
import HomePageContent from "@/components/sections/HomePageContent";
import { WhyBuySection } from "@/components/sections/WhyBuySection";
// import FeaturedOffers from "@/components/sections/FeaturedOffers";
import {
  ColdChainBanner,
} from "@/components/sections/JewelryHomeSections";
import CategoryGrid from "@/components/sections/CategoryGrid";

export const metadata = {
  title: "Inaayika | Handcrafted Premium Jewellery",
  description: "Exquisite handcrafted jewellery designed to make you stand out. Browse our custom and handmade collections.",
};

export default function Home() {
  return (
    <>
      <main>
        {/* Hero */}
        <HeroSection />

        {/* Live luxury ribbon */}
        <LuxuryMarquee />

        {/* Trust Guarantees */}
        <TrustBadgesSection />
        {/* Featured Healthcare Offers */}
        {/* <FeaturedOffers /> */}
        <CategoryGrid />

        {/* Dynamic product sections */}
        <HomePageContent />

        {/* Cold chain delivery banner */}
        <ColdChainBanner />

        {/* Why Choose Us */}
        <WhyBuySection />
      </main>
    </>
  );
}
