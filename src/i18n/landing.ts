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
  techStack: { eyebrow: string };
  portfolio: {
    eyebrow: string;
    title: string;
    highlightedText: string;
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
      "BuildAI builds small systems, AI automation and custom software that remove repeat work from small and mid-sized operations.",
  },
  navbar: {
    navLinks: ["Services", "Process", "Technologies", "Portfolio", "Contact"],
    ctaLabel: "Book a Consultation",
  },
  hero: {
    badge: "An agency that builds in public",
    title: "Stop the rework with",
    highlightedText: "small systems and automation",
    description:
      "The same WhatsApp replies, spreadsheets copied by hand, and work redone between teams. BuildAI creates the small system that clears the bottleneck — and you follow every step.",
    primaryCtaLabel: "Request a quote on WhatsApp",
    secondaryCtaLabel: "See cases",
    stats: ["Custom systems", "AI automation", "MicroSaaS for SMBs"],
  },
  services: {
    eyebrow: "Our Services",
    title: "Solutions that",
    highlightedText: "drive",
    description: "We combine cutting-edge technology with business strategy to deliver real, measurable value.",
    items: [
      {
        title: "MicroSaaS Development",
        description:
          "From MVP to scale. We build lean, validated SaaS products ready to grow with your customer base.",
        tag: "MVP → Scale",
      },
      {
        title: "AI Automations",
        description:
          "We connect intelligent agents to your workflows, eliminating repetitive tasks and reducing operational costs.",
        tag: "Agents + Flows",
      },
      {
        title: "Custom Software",
        description:
          "Robust solutions for complex problems. Clean architecture, performance and maintainability as priorities.",
        tag: "Custom Solutions",
      },
    ],
  },
  process: {
    eyebrow: "Building in public",
    title: "Full",
    highlightedText: "transparency",
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
        description: "Agile development with daily deliveries. You follow everything in real time.",
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
  techStack: { eyebrow: "Tech Stack" },
  portfolio: {
    eyebrow: "Portfolio",
    title: "Results that",
    highlightedText: "speak for themselves",
  },
  contact: {
    eyebrow: "Contact",
    title: "Ready to",
    highlightedText: "get started",
    description:
      "Fill out the form and our team will reach out to understand your project and propose the best solution.",
    submitLabel: "Send Message",
    successTitle: "Message sent!",
    successDescription: "We will contact you within 24 hours.",
  },
};

const esCopy: LandingCopy = {
  seo: {
    title: "BuildAI | Microsistemas y automatización para pymes",
    description:
      "BuildAI crea microsistemas, automatización con IA y software a medida para sacar el retrabajo de la operación de pequeñas y medianas empresas.",
  },
  navbar: {
    navLinks: ["Servicios", "Proceso", "Tecnologías", "Portafolio", "Contacto"],
    ctaLabel: "Agendar Consultoría",
  },
  hero: {
    badge: "Agencia que construye en público",
    title: "Para el retrabajo con",
    highlightedText: "microsistemas y automatizaciones",
    description:
      "Atención repetida en WhatsApp, planillas copiadas a mano y el mismo trabajo hecho otra vez entre equipos. BuildAI crea el sistema chico que resuelve el cuello de botella — y acompañas cada etapa.",
    primaryCtaLabel: "Pedir presupuesto por WhatsApp",
    secondaryCtaLabel: "Ver casos",
    stats: ["Sistemas a medida", "Automatización con IA", "MicroSaaS para pymes"],
  },
  services: {
    eyebrow: "Nuestros Servicios",
    title: "Soluciones que",
    highlightedText: "impulsan",
    description:
      "Combinamos tecnología de punta con estrategia de negocios para entregar valor real y medible.",
    items: [
      {
        title: "Desarrollo de MicroSaaS",
        description:
          "Del MVP a la escala. Creamos productos SaaS ágiles, validados y listos para crecer con tu base de clientes.",
        tag: "MVP → Escala",
      },
      {
        title: "Automatizaciones con IA",
        description:
          "Conectamos agentes inteligentes a tus flujos de trabajo, eliminando tareas repetitivas y reduciendo costos operacionales.",
        tag: "Agentes + Flujos",
      },
      {
        title: "Software a Medida",
        description:
          "Soluciones robustas para problemas complejos. Arquitectura limpia, rendimiento y mantenibilidad como prioridades.",
        tag: "Soluciones a medida",
      },
    ],
  },
  process: {
    eyebrow: "Construcción en público",
    title: "Transparencia",
    highlightedText: "total",
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
        description: "Desarrollo ágil con entregas diarias. Sigues todo en tiempo real.",
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
  techStack: { eyebrow: "Tecnologías" },
  portfolio: {
    eyebrow: "Portafolio",
    title: "Resultados que",
    highlightedText: "hablan por sí solos",
  },
  contact: {
    eyebrow: "Contacto",
    title: "¿Listo para",
    highlightedText: "empezar",
    description:
      "Completa el formulario y nuestro equipo se pondrá en contacto para entender tu proyecto y proponer la mejor solución.",
    submitLabel: "Enviar Mensaje",
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
  },
  portfolio: {
    ...base.portfolio,
    eyebrow: copy.portfolio.eyebrow,
    title: copy.portfolio.title,
    highlightedText: copy.portfolio.highlightedText,
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
