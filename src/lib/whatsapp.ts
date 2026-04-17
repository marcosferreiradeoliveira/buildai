const WHATSAPP_NUMBER = "521966225632";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const createDefaultWhatsAppMessage = (companyName: string): string =>
  `Olá, quero mais informações sobre sistemas e automações para ${companyName}`;

export const createWhatsAppUrl = (message?: string): string => {
  if (!message?.trim()) {
    return WHATSAPP_URL;
  }

  return `${WHATSAPP_URL}?text=${encodeURIComponent(message.trim())}`;
};

export const openWhatsApp = (message?: string) => {
  window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
};
