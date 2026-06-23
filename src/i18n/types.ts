export const SUPPORTED_LOCALES = ["pt", "en", "es"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export type LocaleOption = {
  code: Locale;
  label: string;
  short: string;
};
