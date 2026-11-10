import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BuildInPublicSection from "@/components/BuildInPublicSection";
import TechStackSection from "@/components/TechStackSection";
import PortfolioSection from "@/components/PortfolioSection";
import FooterSection from "@/components/FooterSection";
import SeoHead from "@/components/SeoHead";
import WhatsAppCtaBand from "@/components/WhatsAppCtaBand";
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
      <HeroSection
        content={content.hero}
        logoSrc={content.navbar.logoSrc}
        secondaryCtaHref="#portfolio"
      />
      {content.implementationIdeas ? (
        <PortfolioSection sectionId="implementacoes" content={content.implementationIdeas} />
      ) : null}
      <PortfolioSection content={content.portfolio} allCasesHref="/portfolio" />
      <ServicesSection content={content.services} />
      <BuildInPublicSection content={content.process} />
      <TechStackSection content={content.techStack} />
      <FooterSection content={content.contact} />
      <WhatsAppCtaBand source="page_end" className="container mx-auto px-4 pb-4" />
    </div>
  );
};

export default LandingPage;
