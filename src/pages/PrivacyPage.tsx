import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SeoHead from "@/components/SeoHead";
import { COMPANY_EMAIL } from "@/config/company";
import { useLanguage } from "@/i18n/LanguageContext";

const PrivacyPage = () => {
  const { landingContent } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Política de privacidade | BuildAI"
        description="Como a BuildAI usa o Google Analytics e os dados enviados pelo formulário de contato."
        previewImageSrc="/preview.jpeg"
        faviconHref={landingContent.seo.faviconHref}
        canonicalPath="/privacidade"
      />
      <Navbar
        brandName={landingContent.navbar.brandName}
        logoSrc={landingContent.navbar.logoSrc}
        navLinks={landingContent.navbar.navLinks}
        ctaLabel={landingContent.navbar.ctaLabel}
      />
      <main className="container mx-auto max-w-2xl px-4 pb-24 pt-32">
        <h1 className="text-3xl font-heading font-bold">Política de privacidade</h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>Este site usa o Google Analytics para entender quais páginas são visitadas.</p>
          <p>
            Os dados do formulário de contato (nome e o que você quer resolver, e o que mais você escolher informar) são usados só para responder o contato, pelo WhatsApp.
          </p>
          <p>
            Para pedir a exclusão desses dados, escreva para o e-mail de contato da BuildAI{COMPANY_EMAIL ? ` (${COMPANY_EMAIL})` : ""}.
          </p>
        </div>
        <Link to="/" className="mt-8 inline-block text-sm font-semibold text-primary hover:underline">
          Voltar para o início
        </Link>
      </main>
    </div>
  );
};

export default PrivacyPage;
