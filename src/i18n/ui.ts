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
    outcomePrefix: string;
    filterAll: string;
    filterSales: string;
    filterContent: string;
    filterSystems: string;
  };
  about: { title: string; body: string };
  faq: { title: string; items: Array<{ question: string; answer: string }> };
  services: {
    titleSuffix: string;
  };
  footer: {
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    companyPlaceholder: string;
    messagePlaceholder: string;
    moreDetails: string;
    privacy: string;
    privacyLabel: string;
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
      outcomePrefix: "O que muda:",
      filterAll: "Todos",
      filterSales: "Atendimento e vendas",
      filterContent: "Conteúdo com IA",
      filterSystems: "Sistemas sob medida",
    },
    about: {
      title: "Quem faz",
      body: "A BuildAI é liderada por Marcos Ferreira. Cada projeto é pensado junto com você, do primeiro rascunho ao sistema rodando.",
    },
    faq: {
      title: "Perguntas frequentes",
      items: [
        {
          question: "Quanto custa?",
          answer: "Depende do tamanho do problema. Na conversa de 30 minutos a gente entende o caso e passa uma estimativa.",
        },
        // TODO Marcos confirmar as respostas sobre prazo e manutenção.
        {
          question: "Quanto tempo leva?",
          answer: "As primeiras entregas costumam sair nas primeiras semanas; o prazo exato sai depois da conversa inicial.",
        },
        {
          question: "Preciso ter equipe técnica?",
          answer: "Não. A BuildAI cuida do desenvolvimento e você acompanha cada etapa.",
        },
        {
          question: "E depois que ficar pronto?",
          answer: "A gente acompanha o lançamento e pode seguir com ajustes e melhorias.",
        },
      ],
    },
    services: {
      titleSuffix: "resultados",
    },
    footer: {
      namePlaceholder: "Seu nome",
      emailPlaceholder: "Seu email",
      phonePlaceholder: "Seu telefone",
      companyPlaceholder: "Sua empresa",
      messagePlaceholder: "O que você quer resolver?",
      moreDetails: "Adicionar mais detalhes",
      privacy: "/privacidade",
      privacyLabel: "Política de privacidade",
      nameRequired: "Nome é obrigatório",
      emailRequired: "Email é obrigatório",
      emailInvalid: "Email inválido",
      phoneRequired: "Telefone é obrigatório",
      phoneInvalid: "Telefone inválido",
      companyRequired: "Empresa é obrigatória",
      messageRequired: "Mensagem é obrigatória",
      whatsappIntro: (name, email, phone, company, message) =>
        [`Olá! Meu nome é ${name}.`, company && `Empresa: ${company}`, phone && `Telefone: ${phone}`, email && `Email: ${email}`, `O que quero resolver: ${message}`]
          .filter(Boolean)
          .join("\n"),
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
      outcomePrefix: "What changes:",
      filterAll: "All",
      filterSales: "Service and sales",
      filterContent: "AI content",
      filterSystems: "Custom systems",
    },
    about: {
      title: "Who builds it",
      body: "BuildAI is led by Marcos Ferreira. Each project is thought through with you, from the first draft to the system running.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question: "How much does it cost?",
          answer: "It depends on the size of the problem. In the 30-minute conversation we understand the case and give an estimate.",
        },
        {
          question: "How long does it take?",
          answer: "The first deliveries usually go out in the first weeks; the exact timeline comes after the initial conversation.",
        },
        {
          question: "Do I need a technical team?",
          answer: "No. BuildAI handles development and you follow every step.",
        },
        {
          question: "What happens after it is ready?",
          answer: "We follow the launch and can continue with adjustments and improvements.",
        },
      ],
    },
    services: {
      titleSuffix: "results",
    },
    footer: {
      namePlaceholder: "Your name",
      emailPlaceholder: "Your email",
      phonePlaceholder: "Your phone",
      companyPlaceholder: "Your company",
      messagePlaceholder: "What do you want to solve?",
      moreDetails: "Add more details",
      privacy: "/privacidade",
      privacyLabel: "Privacy policy",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email",
      phoneRequired: "Phone is required",
      phoneInvalid: "Invalid phone",
      companyRequired: "Company is required",
      messageRequired: "Message is required",
      whatsappIntro: (name, email, phone, company, message) =>
        [`Hi! My name is ${name}.`, company && `Company: ${company}`, phone && `Phone: ${phone}`, email && `Email: ${email}`, `What I want to solve: ${message}`]
          .filter(Boolean)
          .join("\n"),
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
      outcomePrefix: "Qué cambia:",
      filterAll: "Todos",
      filterSales: "Atención y ventas",
      filterContent: "Contenido con IA",
      filterSystems: "Sistemas a medida",
    },
    about: {
      title: "Quién lo hace",
      body: "BuildAI está liderada por Marcos Ferreira. Cada proyecto se piensa junto contigo, del primer borrador al sistema en marcha.",
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        {
          question: "¿Cuánto cuesta?",
          answer: "Depende del tamaño del problema. En la conversación de 30 minutos entendemos el caso y pasamos una estimación.",
        },
        {
          question: "¿Cuánto tiempo lleva?",
          answer: "Las primeras entregas suelen salir en las primeras semanas; el plazo exacto sale después de la conversación inicial.",
        },
        {
          question: "¿Necesito tener equipo técnico?",
          answer: "No. BuildAI se encarga del desarrollo y tú acompañas cada etapa.",
        },
        {
          question: "¿Y después de que quede listo?",
          answer: "Acompañamos el lanzamiento y podemos seguir con ajustes y mejoras.",
        },
      ],
    },
    services: {
      titleSuffix: "resultados",
    },
    footer: {
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "Tu email",
      phonePlaceholder: "Tu teléfono",
      companyPlaceholder: "Tu empresa",
      messagePlaceholder: "¿Qué quieres resolver?",
      moreDetails: "Agregar más detalles",
      privacy: "/privacidade",
      privacyLabel: "Política de privacidad",
      nameRequired: "El nombre es obligatorio",
      emailRequired: "El email es obligatorio",
      emailInvalid: "Email inválido",
      phoneRequired: "El teléfono es obligatorio",
      phoneInvalid: "Teléfono inválido",
      companyRequired: "La empresa es obligatoria",
      messageRequired: "El mensaje es obligatorio",
      whatsappIntro: (name, email, phone, company, message) =>
        [`¡Hola! Mi nombre es ${name}.`, company && `Empresa: ${company}`, phone && `Teléfono: ${phone}`, email && `Email: ${email}`, `Lo que quiero resolver: ${message}`]
          .filter(Boolean)
          .join("\n"),
      preferWhatsApp: "¿Prefieres WhatsApp?",
      rightsReserved: "Todos los derechos reservados.",
    },
  },
};

export const getUiTranslations = (locale: Locale): UiTranslations => uiByLocale[locale];
