import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BuildInPublicSection from "@/components/BuildInPublicSection";
import TechStackSection from "@/components/TechStackSection";
import PortfolioSection from "@/components/PortfolioSection";
import FooterSection from "@/components/FooterSection";
import SeoHead from "@/components/SeoHead";
import { LandingContent } from "@/types/landing";

type LandingPageProps = {
  content: LandingContent;
};

const LandingPage = ({ content }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={content.seo.title}
        description={content.seo.description}
        previewImageSrc={content.seo.previewImageSrc}
        faviconHref={content.seo.faviconHref}
      />
      <Navbar
        brandName={content.navbar.brandName}
        navLinks={content.navbar.navLinks}
        ctaLabel={content.navbar.ctaLabel}
      />
      <HeroSection content={content.hero} companyName={content.navbar.brandName} />
      <ServicesSection content={content.services} />
      <BuildInPublicSection content={content.process} />
      <TechStackSection content={content.techStack} />
      <PortfolioSection content={content.portfolio} />
      <FooterSection content={content.contact} />
    </div>
  );
};

export default LandingPage;
