import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getLocalizedLandingContent } from "./landing";
import { detectBrowserLocale, persistLocale } from "./locales";
import { getUiTranslations, type UiTranslations } from "./ui";
import { Locale } from "./types";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  ui: UiTranslations;
  landingContent: ReturnType<typeof getLocalizedLandingContent>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => detectBrowserLocale());

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  };

  useEffect(() => {
    persistLocale(locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      ui: getUiTranslations(locale),
      landingContent: getLocalizedLandingContent(locale),
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const useUi = () => useLanguage().ui;
