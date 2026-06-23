import { LandingContent } from "@/types/landing";
import { baseLandingContent } from "@/content/landing";
import { Locale } from "./types";
import { getLocalizedCourse } from "./course";

type PortfolioCopy = {
  category: string;
  metric: string;
  description: string;
};

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
    items: PortfolioCopy[];
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
    title: "BuildAI | MicroSaaS and AI for Business",
    description:
      "BuildAI builds MicroSaaS, AI automations and custom software to accelerate growth and operational efficiency.",
  },
  navbar: {
    navLinks: ["Services", "Process", "Technologies", "Portfolio", "AI Course", "Contact"],
    ctaLabel: "Book a Consultation",
  },
  hero: {
    badge: "Build-in-Public Agency",
    title: "We build the future of your business with",
    highlightedText: "MicroSaaS and AI",
    description:
      "We turn your ideas into scalable software and intelligent automations that save hundreds of hours and maximize ROI.",
    primaryCtaLabel: "Book a Consultation →",
    secondaryCtaLabel: "View Portfolio",
    stats: ["Projects delivered", "Satisfaction", "Average ROI"],
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
    eyebrow: "Build-in-Public",
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
    items: [
      {
        category: "AI Automation",
        metric: "Batch production of visual assets from template + spreadsheet, with no manual rework",
        description:
          "Web app that turns a fixed Photoshop (PSD) layout into a batch generator: named layers, Excel spreadsheet and image folder become final PNG/PSD assets — catalogs, cards, banners, menus and any repetitive layout in one click.",
      },
      {
        category: "Content Factory",
        metric: "Informative video production with fewer manual steps — script, voice and editing in one flow",
        description:
          "Web platform that turns content into video with AI: from text (news or script) it generates narration and video with a virtual presenter; also translates recorded videos into other languages while keeping audio and video in sync. Secure login, project history and AI tool configuration in the browser.",
      },
      {
        category: "Custom Software",
        metric: "Online bookings with Stripe and social impact fund — purpose-driven adventure tourism in Rio",
        description:
          "Institutional and commercial site for a paragliding and hang gliding operator (São Conrado and Niterói): experience catalog, Stripe checkout or consultative WhatsApp flow, public Propósito fund counter and i18n in 6 languages.",
      },
      {
        category: "MicroSaaS",
        metric: "Full marketing and product funnel in one place — with AI-generated strategic reports",
        description:
          "Web dashboard for Chief Growth Officer: executive view (revenue, CAC, leads, ROAS), product funnel and channel comparison. Connects Google Ads, Meta, Brevo, Snov.io, Mixpanel and GA4; CGO AI Analyst generates strategic reports with Gemini from synced data.",
      },
      {
        category: "AI Automation",
        metric: "From Telegram to published portal in minutes — text, audio, SEO and social with no manual rework",
        description:
          "Monitors a Telegram channel and turns text or audio messages into SEO-optimized articles: OpenAI transcription, Claude structured writing, Tavily image search and automatic publishing to WordPress (RankMath), Facebook and Instagram — with conditional reposting to secondary portals.",
      },
      {
        category: "AI Automation",
        metric: "99Freelas prospecting and bids on autopilot — with human review before sending",
        description:
          "Local dashboard that scans Web/Mobile/Software projects on 99Freelas, filters by whitelist/blacklist, generates proposals with Gemini (text, price and deadline) and sends bids via Playwright. Dashboard to review, edit each proposal and trigger the queue manually — auto-send off by default.",
      },
      {
        category: "Custom Software",
        metric: "Immersive educational experience — hacking the past to rebuild memories of the African diaspora",
        description:
          "Cooperative narrative RPG with AI about Mohammed Gardo Baquaqua and diaspora routes: investigate historical phases, talk to period NPCs and use real documents (Slave Voyages, newspapers, biographies) as evidence. Three roles — linguist, archivist and strategist — afrofuturist narrative with Gemini and PT, EN and FR support.",
      },
      {
        category: "Custom Software",
        metric: "AI-assisted writing atelier — from oral story to final text in your personal library",
        description:
          "Literary facilitator with AI to create and refine personal stories: voice or text session with thought-provoking questions, transcription, poetic mosaic with keywords and suggested images. Facilitator's welcoming feedback, text structuring with Gemini and full archive — process and final version — in My Library.",
      },
      {
        category: "AI Automation",
        metric: "Sales scale through automated and qualified prospecting",
        description:
          "Outbound prospecting tool that automates search, data extraction and profile qualification. Web scraping integration with commercial analysis via OpenAI for personalized message generation.",
      },
      {
        category: "MicroSaaS",
        metric: "Automation of complex accountability processes with document compliance analysis",
        description:
          "B2B platform for financial management and compliance of cultural projects funded by incentive laws. Includes budget control by line items, AI invoice analysis and subscription management.",
      },
      {
        category: "Custom Software",
        metric: "Awarded as Brazil's best Internet of Things (IoT) app",
        description:
          "Interactive guide for the Museum of Tomorrow using beacon technology for contextual real-time interactivity. Robust architecture integrating hardware (IoT) and high-performance mobile software.",
      },
      {
        category: "Content Factory",
        metric: "Drastic cost reduction by eliminating traditional studios through digital avatars",
        description: "Omnichannel content pack generator that turns topics into ebooks, podcasts and videos.",
      },
    ],
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
    title: "BuildAI | MicroSaaS e IA para Negocios",
    description:
      "BuildAI crea MicroSaaS, automatizaciones con IA y software a medida para acelerar el crecimiento y la eficiencia operacional.",
  },
  navbar: {
    navLinks: ["Servicios", "Proceso", "Tecnologías", "Portafolio", "Curso IA", "Contacto"],
    ctaLabel: "Agendar Consultoría",
  },
  hero: {
    badge: "Agencia Build-in-Public",
    title: "Construimos el futuro de tu negocio con",
    highlightedText: "MicroSaaS e IA",
    description:
      "Transformamos tus ideas en software escalable y automatizaciones inteligentes que ahorran cientos de horas y maximizan el ROI.",
    primaryCtaLabel: "Agendar Consultoría →",
    secondaryCtaLabel: "Ver Portafolio",
    stats: ["Proyectos entregados", "Satisfacción", "ROI promedio"],
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
        tag: "Custom Solutions",
      },
    ],
  },
  process: {
    eyebrow: "Build-in-Public",
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
  techStack: { eyebrow: "Tech Stack" },
  portfolio: {
    eyebrow: "Portafolio",
    title: "Resultados que",
    highlightedText: "hablan por sí solos",
    items: [
      {
        category: "Automatización con IA",
        metric: "Producción en lote de piezas visuales desde plantilla + hoja de cálculo, sin retrabajo manual",
        description:
          "Aplicación web que transforma un layout fijo en Photoshop (PSD) en generador en lote: capas nombradas, Excel y carpeta de imágenes se convierten en artes finales PNG/PSD — catálogos, cards, banners, menús y cualquier layout repetitivo con un clic.",
      },
      {
        category: "Content Factory",
        metric: "Producción de videos informativos con menos pasos manuales — guion, voz y montaje en un solo flujo",
        description:
          "Plataforma web que transforma contenido en video con IA: a partir de texto (noticias o guion) genera narración y video con presentador virtual; también traduce videos grabados a otros idiomas manteniendo audio e imagen sincronizados. Login seguro, historial de proyectos y configuración de herramientas de IA en el navegador.",
      },
      {
        category: "Software a Medida",
        metric: "Reservas online con Stripe y fondo de impacto social — turismo de aventura con propósito en Río",
        description:
          "Sitio institucional y comercial para operador de parapente y ala delta (São Conrado y Niterói): catálogo de experiencias, checkout Stripe o flujo consultivo por WhatsApp, contador público del fondo Propósito e i18n en 6 idiomas.",
      },
      {
        category: "MicroSaaS",
        metric: "Embudo completo de marketing y producto en un solo lugar — con informe estratégico generado por IA",
        description:
          "Dashboard web para Chief Growth Officer: visión ejecutiva (ingresos, CAC, leads, ROAS), embudo de producto y comparación de canales. Conecta Google Ads, Meta, Brevo, Snov.io, Mixpanel y GA4; el CGO AI Analyst genera informes estratégicos con Gemini a partir de datos sincronizados.",
      },
      {
        category: "Automatización con IA",
        metric: "Del Telegram al portal publicado en minutos — texto, audio, SEO y redes sin retrabajo manual",
        description:
          "Monitorea un canal de Telegram y transforma mensajes de texto o audio en artículos optimizados para SEO: transcripción con OpenAI, redacción estructurada con Claude, búsqueda de imagen en Tavily y publicación automática en WordPress (RankMath), Facebook e Instagram — con republicación condicional en portales secundarios.",
      },
      {
        category: "Automatización con IA",
        metric: "Prospección y propuestas en 99Freelas en piloto automático — con revisión humana antes del envío",
        description:
          "Panel local que rastrea proyectos Web/Mobile/Software en 99Freelas, filtra por whitelist/blacklist, genera propuestas con Gemini (texto, precio y plazo) y envía ofertas vía Playwright. Dashboard para revisar, editar cada propuesta y disparar la cola manualmente — envío automático desactivado por defecto.",
      },
      {
        category: "Software a Medida",
        metric: "Experiencia educativa inmersiva — hackear el pasado para reconstruir memorias de la diáspora africana",
        description:
          "RPG narrativo cooperativo con IA sobre Mohammed Gardo Baquaqua y las rutas de la diáspora: investiga fases históricas, conversa con NPCs de la época y usa documentos reales (Slave Voyages, periódicos, biografías) como evidencia. Tres roles — lingüista, archivista y estratega — narrativa afrofuturista con Gemini y soporte PT, EN y FR.",
      },
      {
        category: "Software a Medida",
        metric: "Taller de escritura asistida por IA — del relato oral al texto final en tu biblioteca personal",
        description:
          "Facilitador literario con IA para crear y pulir relatos personales: sesión por voz o texto con preguntas instigadoras, transcripción, mosaico poético con palabras clave e imágenes sugeridas. Mirada acogedora del facilitador, estructuración del texto con Gemini y archivo completo — proceso y versión final — en Mi Biblioteca.",
      },
      {
        category: "Automatización con IA",
        metric: "Escala en ventas mediante prospección automatizada y calificada",
        description:
          "Herramienta de prospección outbound que automatiza la búsqueda, extracción de datos y calificación de perfiles. Integración de Web Scraping con análisis comercial vía OpenAI para generación de mensajes personalizados.",
      },
      {
        category: "MicroSaaS",
        metric: "Automatización de procesos complejos de rendición de cuentas con análisis de conformidad de documentos",
        description:
          "Plataforma B2B para gestión financiera y compliance de proyectos culturales financiados por leyes de incentivo. Incluye control de presupuesto por rubros, análisis de facturas con IA y gestión de suscripciones.",
      },
      {
        category: "Software a Medida",
        metric: "Premiado como la mejor aplicación de Internet de las Cosas (IoT) de Brasil",
        description:
          "Guía interactiva para el Museo del Mañana utilizando tecnología de beacons para interactividad contextual en tiempo real. Arquitectura robusta integrando hardware (IoT) y software mobile de alto rendimiento.",
      },
      {
        category: "Content Factory",
        metric: "Reducción drástica de costos eliminando estudios tradicionales mediante avatares digitales",
        description:
          "Generador de paquetes de contenido omnicanal que transforma temas en ebooks, podcasts y videos.",
      },
    ],
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

const applyCopy = (base: LandingContent, copy: LandingCopy, locale: Locale): LandingContent => ({
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
    stats: base.hero.stats.map((stat, index) => ({
      ...stat,
      label: copy.hero.stats[index] ?? stat.label,
    })),
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
    items: base.portfolio.items.map((item, index) => ({
      ...item,
      ...copy.portfolio.items[index],
    })),
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

  const content = applyCopy(baseLandingContent, copy, locale);
  return {
    ...content,
    course: getLocalizedCourse(locale),
  };
};
