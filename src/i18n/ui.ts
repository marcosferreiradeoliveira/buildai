import { Locale } from "./types";

export type UiTranslations = {
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
    rightsReserved: string;
  };
};

const uiByLocale: Record<Locale, UiTranslations> = {
  pt: {
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
      rightsReserved: "Todos os direitos reservados.",
    },
  },
  en: {
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
      rightsReserved: "All rights reserved.",
    },
  },
  es: {
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
      rightsReserved: "Todos los derechos reservados.",
    },
  },
};

export const getUiTranslations = (locale: Locale): UiTranslations => uiByLocale[locale];
