import { CourseBlock } from "@/types/landing";
import coursePreviewImage from "@/assets/1718220391901.jpeg";
import courseBackgroundImage from "@/assets/watermarked_img_2560458068198262558.jpg";

export const courseLandingContent: CourseBlock = {
  eyebrow: "CursoIA · Inteligência Artificial na Cultura",
  title: "Projetos com IA e vendas de até",
  highlightedText: "R$ 5 mil por cliente",
  description:
    "Curso ao vivo para aplicar IA na cultura e no mercado criativo — automação, prompts, comercial e monetização, do zero ao uso prático.",
  metric: "Lote 01 · 14 vagas com desconto · garantia de 7 dias",
  previewImageSrc: coursePreviewImage,
  backgroundImageSrc: courseBackgroundImage,
  instructorName: "Marcos Ferreira",
  pricing: {
    originalPrice: "R$ 997,00",
    installments: "10x de R$ 45,00",
    total: "R$ 450,00 à vista",
  },
  ctaLabel: "Conhecer o curso",
  ctaHref: "https://cursobuildai.vercel.app/",
};
