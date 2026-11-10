import WhatsAppLink from "@/components/WhatsAppLink";
import { useUi } from "@/i18n/LanguageContext";

type WhatsAppCtaBandProps = {
  source: string;
  className?: string;
};

const WhatsAppCtaBand = ({ source, className = "" }: WhatsAppCtaBandProps) => {
  const ui = useUi();

  return (
    <div className={className}>
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card px-5 py-4 sm:px-6">
        <p className="max-w-3xl text-sm font-medium leading-relaxed text-foreground sm:text-base">
          {ui.cta.bandMessage}
        </p>
        <WhatsAppLink
          source={source}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 neon-glow"
        >
          {ui.cta.quoteButton}
        </WhatsAppLink>
      </div>
    </div>
  );
};

export default WhatsAppCtaBand;
