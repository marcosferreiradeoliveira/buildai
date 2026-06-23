import { Locale, LocaleOption, SUPPORTED_LOCALES } from "./types";

export const LOCALE_STORAGE_KEY = "buildai.locale";

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: "pt", label: "Português", short: "PT" },
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
];

export const isLocale = (value: string): value is Locale =>
  SUPPORTED_LOCALES.includes(value as Locale);

export const detectBrowserLocale = (): Locale => {
  if (typeof window === "undefined") return "pt";

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && isLocale(stored)) return stored;

  const browser = navigator.language.toLowerCase();
  if (browser.startsWith("pt")) return "pt";
  if (browser.startsWith("es")) return "es";
  if (browser.startsWith("en")) return "en";
  return "pt";
};

export const persistLocale = (locale: Locale) => {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.documentElement.lang = locale;
};
