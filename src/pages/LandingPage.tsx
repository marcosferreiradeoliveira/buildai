import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BuildInPublicSection from "@/components/BuildInPublicSection";
import TechStackSection from "@/components/TechStackSection";
import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";
import FaqSection from "@/components/FaqSection";
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
        logoSrc={content.navbar.logoSrc}
        navLinks={content.navbar.navLinks}
        ctaLabel={content.navbar.ctaLabel}
        prospectCompanyName={content.prospectCompanyName}
      />
      <HeroSection content={content.hero} secondaryCtaHref="#portfolio" />
      {content.implementationIdeas ? (
        <PortfolioSection sectionId="implementacoes" content={content.implementationIdeas} />
      ) : null}
      <ServicesSection content={content.services} />
      <PortfolioSection content={content.portfolio} allCasesHref="/portfolio" />
      <BuildInPublicSection content={content.process} />
      <TechStackSection content={content.techStack} />
      {content.showTrustSections ? (
        <>
          <AboutSection />
          <FaqSection />
        </>
      ) : null}
      <FooterSection content={content.contact} />
    </div>
  );
};

export default LandingPage;
