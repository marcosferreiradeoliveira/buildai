import { Globe } from "lucide-react";
import { LOCALE_OPTIONS } from "@/i18n/locales";
import { useLanguage } from "@/i18n/LanguageContext";
import { Locale } from "@/i18n/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage();
  const current = LOCALE_OPTIONS.find((option) => option.code === locale) ?? LOCALE_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          aria-label="Change language"
        >
          <Globe className="h-3.5 w-3.5" />
          {current.short}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => setLocale(option.code as Locale)}
            className={locale === option.code ? "font-semibold text-primary" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
