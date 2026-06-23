import LandingPage from "@/pages/LandingPage";
import { useLanguage } from "@/i18n/LanguageContext";

const Index = () => {
  const { landingContent } = useLanguage();
  return <LandingPage content={landingContent} />;
};

export default Index;
