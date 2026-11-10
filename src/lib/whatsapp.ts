import { trackWhatsAppClick } from "@/lib/analytics";

/** Dígitos apenas: código do país + DDD + número (sem +, sem espaços). */
const DEFAULT_WHATSAPP_PHONE = "5521966225632";

const getWhatsAppPhoneDigits = (): string => {
  const raw = import.meta.env.VITE_WHATSAPP_PHONE?.trim() || DEFAULT_WHATSAPP_PHONE;
  return raw.replace(/\D/g, "");
};

/**
 * Link oficial do WhatsApp (evita erros de concatenação com `wa.me`).
 * Em produção, defina `VITE_WHATSAPP_PHONE` na Vercel se o número mudar.
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
  "https://wa.me/5521966225632?text=Olá!%20Vim%20pelo%20site%20da%20BuildAI%20e%20quero%20um%20orçamento.";

export const createDefaultWhatsAppMessage = (companyName: string): string =>
  `Olá, quero mais informações sobre sistemas e automações para ${companyName}`;

export const createProspectWhatsAppMessage = (prospectCompany: string): string =>
  `Olá, BuildAI! Vi a proposta para ${prospectCompany} e gostaria de conversar.`;

export const openWhatsApp = (message?: string, source = "whatsapp") => {
  trackWhatsAppClick(source);
  window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
};
