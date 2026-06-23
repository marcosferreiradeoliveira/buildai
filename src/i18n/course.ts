import { CourseBlock } from "@/types/landing";
import { courseLandingContent } from "@/content/course";
import { Locale } from "./types";

const courseByLocale: Record<Locale, Partial<CourseBlock>> = {
  pt: {},
  en: {
    eyebrow: "CursoIA · Artificial Intelligence in Culture",
    title: "AI projects and sales of up to",
    highlightedText: "R$ 5,000 per client",
    description:
      "Live course to apply AI in culture and the creative market — automation, prompts, sales and monetization, from zero to practical use.",
    metric: "Batch 01 · 14 discounted spots · 7-day guarantee",
    ctaLabel: "Explore the course",
  },
  es: {
    eyebrow: "CursoIA · Inteligencia Artificial en la Cultura",
    title: "Proyectos con IA y ventas de hasta",
    highlightedText: "R$ 5.000 por cliente",
    description:
      "Curso en vivo para aplicar IA en la cultura y el mercado creativo — automatización, prompts, comercial y monetización, de cero al uso práctico.",
    metric: "Lote 01 · 14 plazas con descuento · garantía de 7 días",
    ctaLabel: "Conocer el curso",
  },
};

export const getLocalizedCourse = (locale: Locale): CourseBlock => ({
  ...courseLandingContent,
  ...courseByLocale[locale],
});
