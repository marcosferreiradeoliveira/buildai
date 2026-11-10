import type { ReactNode } from "react";
import { trackWhatsAppClick } from "@/lib/analytics";
import { WHATSAPP_QUOTE_URL } from "@/lib/whatsapp";

type WhatsAppLinkProps = {
  children: ReactNode;
  className?: string;
  source: string;
  ariaLabel?: string;
};

const WhatsAppLink = ({ children, className, source, ariaLabel }: WhatsAppLinkProps) => (
  <a
    href={WHATSAPP_QUOTE_URL}
    target="_blank"
    rel="noopener"
    aria-label={ariaLabel}
    className={className}
    onClick={() => trackWhatsAppClick(source)}
  >
    {children}
  </a>
);

export default WhatsAppLink;
