import { Locale } from "./types";

export type UiTranslations = {
  cta: {
    quoteButton: string;
    bandMessage: string;
  };
  portfolio: {
    watchVideo: string;
    viewLive: string;
  };
  services: {
    titleSuffix: string;
  };
  footer: {
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
    whatsappIntro: (name: string, email: string, message: string) => string;
    preferWhatsApp: string;
    rightsReserved: string;
  };
};

const uiByLocale: Record<Locale, UiTranslations> = {
  pt: {
    cta: {
      quoteButton: "Pedir orçamento no WhatsApp",
      bandMessage:
        "Tem uma ideia de app, sistema ou automação com IA? Fale com a gente em 1 minuto.",
    },
    portfolio: {
      watchVideo: "Assistir vídeo",
      viewLive: "Ver projeto ao vivo",
    },
    services: {
      titleSuffix: "resultados",
    },
    footer: {
      namePlaceholder: "Seu nome",
      emailPlaceholder: "Seu email",
      messagePlaceholder: "Conte sobre seu projeto...",
      nameRequired: "Nome é obrigatório",
      emailRequired: "Email é obrigatório",
      emailInvalid: "Email inválido",
      messageRequired: "Mensagem é obrigatória",
      whatsappIntro: (name, email, message) =>
        `Olá! Meu nome é ${name}.\nEmail: ${email}\nMensagem: ${message}`,
      preferWhatsApp: "Prefere WhatsApp?",
      rightsReserved: "Todos os direitos reservados.",
    },
  },
  en: {
    cta: {
      quoteButton: "Request a quote on WhatsApp",
      bandMessage: "Have an idea for an app, a custom system or AI automation? Talk to us in 1 minute.",
    },
    portfolio: {
      watchVideo: "Watch video",
      viewLive: "View live project",
    },
    services: {
      titleSuffix: "results",
    },
    footer: {
      namePlaceholder: "Your name",
      emailPlaceholder: "Your email",
      messagePlaceholder: "Tell us about your project...",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email",
      messageRequired: "Message is required",
      whatsappIntro: (name, email, message) =>
        `Hi! My name is ${name}.\nEmail: ${email}\nMessage: ${message}`,
      preferWhatsApp: "Prefer WhatsApp?",
      rightsReserved: "All rights reserved.",
    },
  },
  es: {
    cta: {
      quoteButton: "Pedir presupuesto por WhatsApp",
      bandMessage:
        "¿Tienes una idea de app, sistema o automatización con IA? Habla con nosotros en 1 minuto.",
    },
    portfolio: {
      watchVideo: "Ver video",
      viewLive: "Ver proyecto en vivo",
    },
    services: {
      titleSuffix: "resultados",
    },
    footer: {
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "Tu email",
      messagePlaceholder: "Cuéntanos sobre tu proyecto...",
      nameRequired: "El nombre es obligatorio",
      emailRequired: "El email es obligatorio",
      emailInvalid: "Email inválido",
      messageRequired: "El mensaje es obligatorio",
      whatsappIntro: (name, email, message) =>
        `¡Hola! Mi nombre es ${name}.\nEmail: ${email}\nMensaje: ${message}`,
      preferWhatsApp: "¿Prefieres WhatsApp?",
      rightsReserved: "Todos los derechos reservados.",
    },
  },
};

export const getUiTranslations = (locale: Locale): UiTranslations => uiByLocale[locale];
