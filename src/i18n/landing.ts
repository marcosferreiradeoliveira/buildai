import { getHomeCases } from "@/content/cases";
import { LandingContent } from "@/types/landing";
import { baseLandingContent } from "@/content/landing";
import { Locale } from "./types";

type LandingCopy = {
  seo: { title: string; description: string };
  navbar: {
    navLinks: string[];
    ctaLabel: string;
  };
  hero: {
    badge: string;
    title: string;
    highlightedText: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    stats: string[];
  };
  services: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
    items: Array<{ title: string; description: string; tag: string }>;
  };
  process: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
    timeline: Array<{ date: string; title: string; description: string }>;
  };
  techStack: { eyebrow: string; title: string };
  portfolio: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
    submitLabel: string;
    successTitle: string;
    successDescription: string;
  };
};

const enCopy: LandingCopy = {
  seo: {
    title: "BuildAI | Microsystems and automation for SMBs",
    description:
      "BuildAI creates custom AI solutions for small and mid-sized companies: a WhatsApp attendant, content generators, systems and automations.",
  },
  navbar: {
    navLinks: ["Services", "Process", "Technologies", "Portfolio", "Contact"],
    ctaLabel: "Book a conversation",
  },
  hero: {
    badge: "Custom AI solutions for SMBs",
    title: "Stop the rework with",
    highlightedText: "small systems and automation",
    description:
      "The same WhatsApp replies, spreadsheets copied by hand, and work redone between teams. BuildAI creates the small system that clears the bottleneck — and you follow every step.",
    primaryCtaLabel: "Request a quote on WhatsApp",
    secondaryCtaLabel: "See cases",
    stats: ["Custom systems", "AI automation", "MicroSaaS for SMBs"],
  },
  services: {
    eyebrow: "For the operation",
    title: "What we solve",
    highlightedText: "",
    description: "Custom solutions for the bottleneck that takes the most time from your team.",
    items: [
      {
        title: "WhatsApp service",
        description: "An AI assistant replies, qualifies and books. You step in only when it is worth it.",
        tag: "Service",
      },
      {
        title: "Content for social",
        description: "Carousels, videos and posts generated from a topic, with your brand's look.",
        tag: "Content",
      },
      {
        title: "Spreadsheets and rework",
        description: "Forms, dashboards and small systems instead of a spreadsheet copied by hand.",
        tag: "Systems",
      },
      {
        title: "Prospecting",
        description: "Company lists organized and qualified for the sales team.",
        tag: "Sales",
      },
    ],
  },
  process: {
    eyebrow: "Process",
    title: "How it works",
    highlightedText: "",
    description: "You follow every step of development. No surprises, no black boxes.",
    timeline: [
      {
        date: "Week 1",
        title: "Discovery and Planning",
        description: "We understand your problem, define scope and choose the ideal stack.",
      },
      {
        date: "Week 2-3",
        title: "MVP and Prototyping",
        description: "Agile development with frequent deliveries. You follow everything in real time.",
      },
      {
        date: "Week 4",
        title: "Testing and Feedback",
        description: "Testing cycle with real users. Quick adjustments based on data.",
      },
      {
        date: "Week 5+",
        title: "Deploy and Iteration",
        description: "Launch, monitoring and continuous improvement with success metrics.",
      },
    ],
  },
  techStack: { eyebrow: "Tools", title: "Tools we use" },
  portfolio: {
    eyebrow: "Portfolio",
    title: "Solutions already running",
    highlightedText: "",
    description: "Some custom solutions BuildAI built for clients and for its own operation.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Ready to",
    highlightedText: "get started",
    description: "Tell us briefly what you want to solve. The conversation continues on WhatsApp.",
    submitLabel: "Continue on WhatsApp",
    successTitle: "Message sent!",
    successDescription: "We will contact you within 24 hours.",
  },
};

const esCopy: LandingCopy = {
  seo: {
    title: "BuildAI | Microsistemas y automatización para pymes",
    description:
      "BuildAI crea soluciones a medida con IA para pequeñas y medianas empresas: asistente de WhatsApp, generadores de contenido, sistemas y automatizaciones.",
  },
  navbar: {
    navLinks: ["Servicios", "Proceso", "Tecnologías", "Portafolio", "Contacto"],
    ctaLabel: "Agendar conversación",
  },
  hero: {
    badge: "Soluciones a medida con IA para pymes",
    title: "Para el retrabajo con",
    highlightedText: "microsistemas y automatizaciones",
    description:
      "Atención repetida en WhatsApp, planillas copiadas a mano y el mismo trabajo hecho otra vez entre equipos. BuildAI crea el sistema chico que resuelve el cuello de botella — y acompañas cada etapa.",
    primaryCtaLabel: "Pedir presupuesto por WhatsApp",
    secondaryCtaLabel: "Ver casos",
    stats: ["Sistemas a medida", "Automatización con IA", "MicroSaaS para pymes"],
  },
  services: {
    eyebrow: "Para la operación",
    title: "Qué resolvemos",
    highlightedText: "",
    description: "Soluciones a medida para el cuello de botella que más tiempo le toma a tu equipo.",
    items: [
      {
        title: "Atención en WhatsApp",
        description: "Un asistente con IA responde, califica y agenda. Tú entras solo cuando vale la pena.",
        tag: "Atención",
      },
      {
        title: "Contenido para redes",
        description: "Carruseles, videos y posts generados a partir de un tema, con la cara de tu marca.",
        tag: "Contenido",
      },
      {
        title: "Planillas y retrabajo",
        description: "Formularios, paneles y sistemas chicos en lugar de la planilla copiada a mano.",
        tag: "Sistemas",
      },
      {
        title: "Prospección",
        description: "Listas de empresas organizadas y calificadas para el equipo comercial.",
        tag: "Ventas",
      },
    ],
  },
  process: {
    eyebrow: "Proceso",
    title: "Cómo funciona",
    highlightedText: "",
    description: "Acompañas cada etapa del desarrollo. Sin sorpresas, sin cajas negras.",
    timeline: [
      {
        date: "Semana 1",
        title: "Descubrimiento y Planificación",
        description: "Entendemos tu problema, definimos alcance y elegimos el stack ideal.",
      },
      {
        date: "Semana 2-3",
        title: "MVP y Prototipado",
        description: "Desarrollo ágil con entregas frecuentes. Sigues todo en tiempo real.",
      },
      {
        date: "Semana 4",
        title: "Pruebas y Feedback",
        description: "Ciclo de pruebas con usuarios reales. Ajustes rápidos basados en datos.",
      },
      {
        date: "Semana 5+",
        title: "Deploy e Iteración",
        description: "Lanzamiento, monitoreo y mejora continua con métricas de éxito.",
      },
    ],
  },
  techStack: { eyebrow: "Herramientas", title: "Herramientas que usamos" },
  portfolio: {
    eyebrow: "Portafolio",
    title: "Soluciones que ya están en marcha",
    highlightedText: "",
    description: "Algunas soluciones a medida que BuildAI creó para clientes y para su propia operación.",
  },
  contact: {
    eyebrow: "Contacto",
    title: "¿Listo para",
    highlightedText: "empezar",
    description: "Cuéntanos rápido qué quieres resolver. La conversación sigue por WhatsApp.",
    submitLabel: "Continuar en WhatsApp",
    successTitle: "¡Mensaje enviado!",
    successDescription: "Nos pondremos en contacto en hasta 24h.",
  },
};

const applyCopy = (base: LandingContent, copy: LandingCopy): LandingContent => ({
  ...base,
  seo: { ...base.seo, ...copy.seo },
  navbar: {
    ...base.navbar,
    navLinks: base.navbar.navLinks.map((link, index) => ({
      ...link,
      label: copy.navbar.navLinks[index] ?? link.label,
    })),
    ctaLabel: copy.navbar.ctaLabel,
  },
  hero: {
    ...base.hero,
    ...copy.hero,
    stats: copy.hero.stats.map((value) => ({ value, label: "" })),
  },
  services: {
    ...base.services,
    eyebrow: copy.services.eyebrow,
    title: copy.services.title,
    highlightedText: copy.services.highlightedText,
    description: copy.services.description,
    items: base.services.items.map((item, index) => ({
      ...item,
      ...copy.services.items[index],
    })),
  },
  process: {
    ...base.process,
    eyebrow: copy.process.eyebrow,
    title: copy.process.title,
    highlightedText: copy.process.highlightedText,
    description: copy.process.description,
    timeline: base.process.timeline.map((item, index) => ({
      ...item,
      ...copy.process.timeline[index],
    })),
  },
  techStack: {
    ...base.techStack,
    eyebrow: copy.techStack.eyebrow,
    title: copy.techStack.title,
  },
  portfolio: {
    ...base.portfolio,
    eyebrow: copy.portfolio.eyebrow,
    title: copy.portfolio.title,
    highlightedText: copy.portfolio.highlightedText,
    description: copy.portfolio.description,
  },
  contact: {
    ...base.contact,
    ...copy.contact,
  },
});

const copyByLocale: Partial<Record<Locale, LandingCopy>> = {
  en: enCopy,
  es: esCopy,
};

export const getLocalizedLandingContent = (locale: Locale): LandingContent => {
  if (locale === "pt") {
    return baseLandingContent;
  }

  const copy = copyByLocale[locale];
  if (!copy) return baseLandingContent;

  const content = applyCopy(baseLandingContent, copy);
  return {
    ...content,
    portfolio: {
      ...content.portfolio,
      items: getHomeCases(locale),
    },
  };
};
