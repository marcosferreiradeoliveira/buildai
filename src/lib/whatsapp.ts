import { trackWhatsAppClick } from "@/lib/analytics";

/** Dígitos apenas: código do país + DDD + número (sem +, sem espaços). */
const WHATSAPP_PHONE = "5521985015148";

const getWhatsAppPhoneDigits = (): string => WHATSAPP_PHONE;

/**
 * Link oficial do WhatsApp (evita erros de concatenação com `wa.me`).
 * Número oficial do site. Os CTAs usam `WHATSAPP_QUOTE_URL`.
 */
export const createWhatsAppUrl = (message?: string): string => {
  const phone = getWhatsAppPhoneDigits();
  const url = new URL("https://api.whatsapp.com/send");
  url.searchParams.set("phone", phone);
  if (message?.trim()) {
    url.searchParams.set("text", message.trim());
  }
  return url.toString();
};

/** URL sem mensagem pré-preenchida (útil para debug ou links estáticos). */
export const WHATSAPP_URL = createWhatsAppUrl();

/** Orçamento pelo site. Usar este link nos CTAs de conversão. */
export const WHATSAPP_QUOTE_URL =
  "https://wa.me/5521985015148?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20BuildAI";

export const createDefaultWhatsAppMessage = (companyName: string): string =>
  `Olá, quero mais informações sobre sistemas e automações para ${companyName}`;

export const createProspectWhatsAppMessage = (prospectCompany: string): string =>
  `Olá, BuildAI! Vi a proposta para ${prospectCompany} e gostaria de conversar.`;

export const openWhatsApp = (message?: string, source = "whatsapp") => {
  trackWhatsAppClick(source);
  window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
};
