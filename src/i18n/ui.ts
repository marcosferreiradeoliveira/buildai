import { Locale } from "./types";

export type UiTranslations = {
  cta: {
    quoteButton: string;
    bandMessage: string;
  };
  portfolio: {
    watchVideo: string;
    viewLive: string;
    viewAll: string;
  };
  services: {
    titleSuffix: string;
  };
  footer: {
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    companyPlaceholder: string;
    messagePlaceholder: string;
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    phoneRequired: string;
    phoneInvalid: string;
    companyRequired: string;
    messageRequired: string;
    whatsappIntro: (name: string, email: string, phone: string, company: string, message: string) => string;
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
      viewAll: "Ver todos os cases",
    },
    services: {
      titleSuffix: "resultados",
    },
    footer: {
      namePlaceholder: "Seu nome",
      emailPlaceholder: "Seu email",
      phonePlaceholder: "Seu telefone",
      companyPlaceholder: "Sua empresa",
      messagePlaceholder: "Conte sobre seu projeto...",
      nameRequired: "Nome é obrigatório",
      emailRequired: "Email é obrigatório",
      emailInvalid: "Email inválido",
      phoneRequired: "Telefone é obrigatório",
      phoneInvalid: "Telefone inválido",
      companyRequired: "Empresa é obrigatória",
      messageRequired: "Mensagem é obrigatória",
      whatsappIntro: (name, email, phone, company, message) =>
        `Olá! Meu nome é ${name}.\nEmpresa: ${company}\nTelefone: ${phone}\nEmail: ${email}\nMensagem: ${message}`,
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
      viewAll: "See all cases",
    },
    services: {
      titleSuffix: "results",
    },
    footer: {
      namePlaceholder: "Your name",
      emailPlaceholder: "Your email",
      phonePlaceholder: "Your phone",
      companyPlaceholder: "Your company",
      messagePlaceholder: "Tell us about your project...",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email",
      phoneRequired: "Phone is required",
      phoneInvalid: "Invalid phone",
      companyRequired: "Company is required",
      messageRequired: "Message is required",
      whatsappIntro: (name, email, phone, company, message) =>
        `Hi! My name is ${name}.\nCompany: ${company}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
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
      viewAll: "Ver todos los casos",
    },
    services: {
      titleSuffix: "resultados",
    },
    footer: {
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "Tu email",
      phonePlaceholder: "Tu teléfono",
      companyPlaceholder: "Tu empresa",
      messagePlaceholder: "Cuéntanos sobre tu proyecto...",
      nameRequired: "El nombre es obligatorio",
      emailRequired: "El email es obligatorio",
      emailInvalid: "Email inválido",
      phoneRequired: "El teléfono es obligatorio",
      phoneInvalid: "Teléfono inválido",
      companyRequired: "La empresa es obligatoria",
      messageRequired: "El mensaje es obligatorio",
      whatsappIntro: (name, email, phone, company, message) =>
        `¡Hola! Mi nombre es ${name}.\nEmpresa: ${company}\nTeléfono: ${phone}\nEmail: ${email}\nMensaje: ${message}`,
      preferWhatsApp: "¿Prefieres WhatsApp?",
      rightsReserved: "Todos los derechos reservados.",
    },
  },
};

export const getUiTranslations = (locale: Locale): UiTranslations => uiByLocale[locale];
