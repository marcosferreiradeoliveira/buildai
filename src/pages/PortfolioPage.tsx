import FooterSection from "@/components/FooterSection";
import Navbar from "@/components/Navbar";
import PortfolioSection from "@/components/PortfolioSection";
import SeoHead from "@/components/SeoHead";
import WhatsAppCtaBand from "@/components/WhatsAppCtaBand";
import { getPortfolioCases } from "@/content/cases";
import { useLanguage } from "@/i18n/LanguageContext";

const seoByLocale = {
  pt: {
    title: "Portfólio | BuildAI",
    description:
      "Cases de microssistemas, automações com IA e software sob medida da BuildAI para a operação de PMEs.",
  },
  en: {
    title: "Portfolio | BuildAI",
    description: "BuildAI cases in small systems, AI automation and custom software for SMB operations.",
  },
  es: {
    title: "Portafolio | BuildAI",
    description:
      "Casos de microsistemas, automatización con IA y software a medida de BuildAI para la operación de pymes.",
  },
} as const;

const PortfolioPage = () => {
  const { locale, landingContent } = useLanguage();
  const seo = seoByLocale[locale];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={seo.title}
        description={seo.description}
        previewImageSrc="/preview.jpeg"
        faviconHref={landingContent.seo.faviconHref}
        canonicalPath="/portfolio"
      />
      <Navbar
        brandName={landingContent.navbar.brandName}
        logoSrc={landingContent.navbar.logoSrc}
        navLinks={landingContent.navbar.navLinks}
        ctaLabel={landingContent.navbar.ctaLabel}
      />
      <main className="pt-24">
        <PortfolioSection
          sectionId="cases"
          content={{
            ...landingContent.portfolio,
            items: getPortfolioCases(locale),
          }}
        />
        <WhatsAppCtaBand source="portfolio_page" />
      </main>
      <FooterSection content={landingContent.contact} />
    </div>
  );
};

export default PortfolioPage;
