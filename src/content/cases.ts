import type { CaseCategory, ProjectItem } from "@/types/landing";
import type { Locale } from "@/i18n/types";

/** O Marcos pode desligar se o atendente de WhatsApp estiver fora do ar. */
export const showWhatsappDemoCta = true;

type CaseKey =
  | "whatsapp"
  | "leadgen"
  | "greensky"
  | "carrosseis"
  | "newsgen"
  | "factory"
  | "conexao"
  | "encartes"
  | "alpha"
  | "accounting"
  | "growth"
  | "cnu";

type CaseCopy = {
  title: string;
  tag: string;
  description: string;
  outcome: string;
  imageAlt: string;
  badge?: string;
  ctaLabel?: string;
};

const sizes = "(min-width: 1024px) 22rem, (min-width: 640px) 46vw, 100vw";

const media = (file: string) => ({
  imageSrc: `/cases/${file.replace(".webp", "-800.webp")}`,
  imageSrcSet: `/cases/${file.replace(".webp", "-800.webp")} 800w, /cases/${file} 1600w`,
  imageSizes: sizes,
});

const pt: Record<CaseKey, CaseCopy> = {
  whatsapp: {
    title: "Atendente de WhatsApp com IA",
    tag: "ATENDIMENTO COM IA",
    badge: "Em uso na própria BuildAI",
    description:
      "Assistente virtual que atende no WhatsApp a qualquer hora. Entende o que a pessoa precisa, faz as perguntas certas, mostra um exemplo parecido e já manda o link para agendar uma conversa. Quando o assunto é preço, reclamação ou a pessoa pede um humano, passa a conversa para a equipe.",
    outcome: "Nenhum contato fica sem resposta, e a equipe só entra quando a conversa já está qualificada.",
    imageAlt: "Conversa de exemplo com o atendente de WhatsApp com IA da BuildAI",
    ctaLabel: "Converse com ele no WhatsApp",
  },
  leadgen: {
    title: "LeadGen AI",
    tag: "MICROSAAS",
    description:
      "Produto da BuildAI para prospecção B2B: organiza e enriquece listas de empresas, ajuda a qualificar e prepara o primeiro contato.",
    outcome: "Prospecção num só fluxo. A BuildAI usa e também entrega para outras empresas.",
    imageAlt: "Tela do LeadGen AI da BuildAI",
    ctaLabel: "Ver projeto ao vivo",
  },
  greensky: {
    title: "Green Sky",
    tag: "SITE + RESERVAS",
    description:
      "Site de reservas para operadora de parapente e asa delta no Rio, com catálogo de voos, pagamento no site ou conversa no WhatsApp, em 6 idiomas.",
    outcome: "O cliente escolhe e paga o voo sem depender de atendimento manual.",
    imageAlt: "Tela do site Green Sky da BuildAI",
    ctaLabel: "Ver projeto ao vivo",
  },
  carrosseis: {
    title: "Gerador de carrosséis",
    tag: "CONTEÚDO COM IA",
    description: "Transforma um tema em carrosséis prontos para o Instagram, com texto e arte, seguindo a identidade da marca.",
    outcome: "Os posts saem de uma lista de temas, sem montar lâmina por lâmina.",
    imageAlt: "Ilustração do gerador de carrosséis da BuildAI transformando um tema em lâminas para Instagram",
    ctaLabel: "Pedir uma demonstração",
  },
  newsgen: {
    title: "NewsGen AI: vídeos com apresentador virtual",
    tag: "VÍDEO COM IA",
    description:
      "A partir de um texto, gera narração e vídeo com apresentador virtual. Também traduz um vídeo já gravado, mantendo voz e imagem alinhadas.",
    outcome: "Roteiro, voz e vídeo num só fluxo, sem gravar nem editar na mão.",
    imageAlt: "Tela do NewsGen da BuildAI",
    ctaLabel: "Ver projeto ao vivo",
  },
  factory: {
    title: "Content Factory AI",
    tag: "CONTEÚDO COM IA",
    description: "De uma ideia, gera pesquisa, posts, roteiros e newsletter no tom da marca.",
    outcome: "Um tema vira conteúdo para vários canais no mesmo fluxo.",
    imageAlt: "Tela do gerador de conteúdo da BuildAI",
    ctaLabel: "Ver projeto ao vivo",
  },
  conexao: {
    title: "Conexão Ativa: automação de notícias",
    tag: "AUTOMAÇÃO COM IA",
    description:
      "Do Telegram ao portal: transcreve, escreve a matéria com SEO, escolhe imagem e publica no WordPress, no Facebook e no Instagram.",
    outcome: "O time para de copiar e colar o mesmo conteúdo em três lugares.",
    imageAlt: "Tela da automação de notícias Conexão Ativa da BuildAI",
    ctaLabel: "Assistir vídeo",
  },
  encartes: {
    title: "Gerador de artes em lote",
    tag: "DESIGN EM LOTE",
    description:
      "A partir de um layout do Photoshop e de uma planilha, gera dezenas de peças de uma vez: encartes, catálogos, banners e cards.",
    outcome: "Troca de preço ou produto vira planilha, não retrabalho de design.",
    imageAlt: "Tela do gerador de artes em lote da BuildAI",
    ctaLabel: "Ver projeto ao vivo",
  },
  alpha: {
    title: "AlphaCoach",
    tag: "MICROSAAS",
    description:
      "Plataforma web e app para coaches e alunos. Cada coach tem o seu espaço com cores e logo próprios, sem publicar um app separado.",
    outcome: "A operação do coach e a jornada do aluno no mesmo lugar.",
    imageAlt: "Tela do AlphaCoach da BuildAI",
    ctaLabel: "Ver projeto ao vivo",
  },
  accounting: {
    title: "Sistemas para escritório de contabilidade",
    tag: "SOFTWARE SOB MEDIDA",
    description:
      "Para um escritório de contabilidade que atende profissionais de saúde: formulário online de Imposto de Renda e pesquisa de satisfação com painel de NPS.",
    outcome: "Menos planilha e arquivo solto na coleta do IR e na escuta dos clientes.",
    imageAlt: "Tela do formulário de Imposto de Renda e do painel de NPS da BuildAI",
  },
  growth: {
    title: "GrowthOS",
    tag: "MICROSAAS",
    description: "Painel de growth que junta Google Ads, Meta, e-mail e analytics, e gera um relatório estratégico com IA.",
    outcome: "Funil de marketing e produto num só lugar.",
    imageAlt: "Tela do painel GrowthOS da BuildAI",
    ctaLabel: "Assistir vídeo",
  },
  cnu: {
    title: "CNU Simulado",
    tag: "EDUCAÇÃO",
    description: "Simulador do Concurso Nacional Unificado, oculto enquanto o demo estiver fora do ar.",
    outcome: "Simulado alinhado à vaga, com revisão a partir dos erros.",
    imageAlt: "Tela do CNU Simulado da BuildAI",
  },
};

const en: Record<CaseKey, CaseCopy> = {
  whatsapp: {
    title: "AI WhatsApp attendant",
    tag: "AI SERVICE",
    badge: "In use at BuildAI",
    description:
      "A virtual assistant that answers on WhatsApp at any hour. It understands what the person needs, asks the right questions, shows a similar example and sends the link to book a conversation. When the topic is price, a complaint, or the person asks for a human, it hands the chat to the team.",
    outcome: "No contact goes unanswered, and the team steps in only after the conversation is qualified.",
    imageAlt: "Sample chat with BuildAI's AI WhatsApp attendant",
    ctaLabel: "Talk to it on WhatsApp",
  },
  leadgen: {
    title: "LeadGen AI",
    tag: "MICROSAAS",
    description:
      "BuildAI's product for B2B prospecting: it organizes and enriches company lists, helps qualify them and prepares the first contact.",
    outcome: "Prospecting in one flow. BuildAI uses it and also delivers it to other companies.",
    imageAlt: "Screen of LeadGen AI by BuildAI",
    ctaLabel: "View live project",
  },
  greensky: {
    title: "Green Sky",
    tag: "SITE + BOOKING",
    description:
      "Booking site for a paragliding and hang-gliding operator in Rio, with a flight catalog, payment on the site or a WhatsApp conversation, in 6 languages.",
    outcome: "The customer chooses and pays for the flight without depending on manual service.",
    imageAlt: "Screen of the Green Sky website by BuildAI",
    ctaLabel: "View live project",
  },
  carrosseis: {
    title: "Carousel generator",
    tag: "AI CONTENT",
    description: "Turns a topic into Instagram carousels, with copy and artwork that follow the brand.",
    outcome: "Posts come from a list of topics, without building slide by slide.",
    imageAlt: "Illustration of BuildAI's carousel generator turning a topic into Instagram slides",
    ctaLabel: "Ask for a demo",
  },
  newsgen: {
    title: "NewsGen AI: videos with a virtual presenter",
    tag: "AI VIDEO",
    description:
      "From a text, it generates narration and a video with a virtual presenter. It also translates a recorded video, keeping voice and picture aligned.",
    outcome: "Script, voice and video in one flow, without recording or editing by hand.",
    imageAlt: "Screen of NewsGen by BuildAI",
    ctaLabel: "View live project",
  },
  factory: {
    title: "Content Factory AI",
    tag: "AI CONTENT",
    description: "From an idea, it generates research, posts, scripts and a newsletter in the brand's voice.",
    outcome: "One topic becomes content for several channels in the same flow.",
    imageAlt: "Screen of BuildAI's content generator",
    ctaLabel: "View live project",
  },
  conexao: {
    title: "Conexão Ativa: news automation",
    tag: "AI AUTOMATION",
    description:
      "From Telegram to the site: it transcribes, writes the story for search, picks an image and publishes to WordPress, Facebook and Instagram.",
    outcome: "The team stops pasting the same content in three places.",
    imageAlt: "Screen of the Conexão Ativa news automation by BuildAI",
    ctaLabel: "Watch video",
  },
  encartes: {
    title: "Batch artwork generator",
    tag: "BATCH DESIGN",
    description:
      "From a Photoshop layout and a spreadsheet, it generates dozens of pieces at once: flyers, catalogs, banners and cards.",
    outcome: "A price or product change becomes a spreadsheet, not a design redo.",
    imageAlt: "Screen of BuildAI's batch artwork generator",
    ctaLabel: "View live project",
  },
  alpha: {
    title: "AlphaCoach",
    tag: "MICROSAAS",
    description:
      "Web platform and app for coaches and students. Each coach gets a space with their own colors and logo, without publishing a separate app.",
    outcome: "The coach's operation and the student's journey in the same place.",
    imageAlt: "Screen of AlphaCoach by BuildAI",
    ctaLabel: "View live project",
  },
  accounting: {
    title: "Systems for an accounting firm",
    tag: "CUSTOM SOFTWARE",
    description:
      "For an accounting firm that serves health professionals: an online income-tax form and a satisfaction survey with an NPS dashboard.",
    outcome: "Less spreadsheet and loose files when collecting tax data and listening to clients.",
    imageAlt: "Screen of BuildAI's income-tax form and NPS dashboard",
  },
  growth: {
    title: "GrowthOS",
    tag: "MICROSAAS",
    description: "A growth dashboard that brings together Google Ads, Meta, email and analytics, and writes a strategy report with AI.",
    outcome: "Marketing and product funnel in one place.",
    imageAlt: "Screen of the GrowthOS dashboard by BuildAI",
    ctaLabel: "Watch video",
  },
  cnu: {
    title: "CNU practice exam",
    tag: "EDUCATION",
    description: "Practice exam for Brazil's unified national exam, hidden while the demo is down.",
    outcome: "A practice exam matched to the role, with a review built from the misses.",
    imageAlt: "Screen of the CNU practice exam by BuildAI",
  },
};

const es: Record<CaseKey, CaseCopy> = {
  whatsapp: {
    title: "Asistente de WhatsApp con IA",
    tag: "ATENCIÓN CON IA",
    badge: "En uso en la propia BuildAI",
    description:
      "Asistente virtual que atiende por WhatsApp a cualquier hora. Entiende lo que la persona necesita, hace las preguntas correctas, muestra un ejemplo parecido y ya manda el enlace para agendar una conversación. Cuando el tema es precio, un reclamo o la persona pide un humano, pasa la charla al equipo.",
    outcome: "Ningún contacto queda sin respuesta, y el equipo entra solo cuando la conversación ya está calificada.",
    imageAlt: "Conversación de ejemplo con el asistente de WhatsApp con IA de BuildAI",
    ctaLabel: "Habla con él por WhatsApp",
  },
  leadgen: {
    title: "LeadGen AI",
    tag: "MICROSAAS",
    description:
      "Producto de BuildAI para prospección B2B: organiza y enriquece listas de empresas, ayuda a calificar y prepara el primer contacto.",
    outcome: "Prospección en un solo flujo. BuildAI lo usa y también lo entrega a otras empresas.",
    imageAlt: "Pantalla de LeadGen AI de BuildAI",
    ctaLabel: "Ver proyecto en vivo",
  },
  greensky: {
    title: "Green Sky",
    tag: "SITIO + RESERVAS",
    description:
      "Sitio de reservas para un operador de parapente y ala delta en Río, con catálogo de vuelos, pago en el sitio o conversación por WhatsApp, en 6 idiomas.",
    outcome: "El cliente elige y paga el vuelo sin depender de atención manual.",
    imageAlt: "Pantalla del sitio Green Sky de BuildAI",
    ctaLabel: "Ver proyecto en vivo",
  },
  carrosseis: {
    title: "Generador de carruseles",
    tag: "CONTENIDO CON IA",
    description: "Transforma un tema en carruseles listos para Instagram, con texto y arte, siguiendo la identidad de la marca.",
    outcome: "Los posts salen de una lista de temas, sin armar lámina por lámina.",
    imageAlt: "Ilustración del generador de carruseles de BuildAI transformando un tema en láminas para Instagram",
    ctaLabel: "Pedir una demostración",
  },
  newsgen: {
    title: "NewsGen AI: videos con presentador virtual",
    tag: "VIDEO CON IA",
    description:
      "A partir de un texto, genera narración y video con presentador virtual. También traduce un video ya grabado, manteniendo voz e imagen alineadas.",
    outcome: "Guion, voz y video en un solo flujo, sin grabar ni editar a mano.",
    imageAlt: "Pantalla de NewsGen de BuildAI",
    ctaLabel: "Ver proyecto en vivo",
  },
  factory: {
    title: "Content Factory AI",
    tag: "CONTENIDO CON IA",
    description: "De una idea, genera investigación, posts, guiones y newsletter con el tono de la marca.",
    outcome: "Un tema se vuelve contenido para varios canales en el mismo flujo.",
    imageAlt: "Pantalla del generador de contenido de BuildAI",
    ctaLabel: "Ver proyecto en vivo",
  },
  conexao: {
    title: "Conexão Ativa: automatización de noticias",
    tag: "AUTOMATIZACIÓN CON IA",
    description:
      "Del Telegram al portal: transcribe, escribe la nota para búsqueda, elige imagen y publica en WordPress, Facebook e Instagram.",
    outcome: "El equipo deja de copiar y pegar el mismo contenido en tres lugares.",
    imageAlt: "Pantalla de la automatización de noticias Conexão Ativa de BuildAI",
    ctaLabel: "Ver video",
  },
  encartes: {
    title: "Generador de artes en lote",
    tag: "DISEÑO EN LOTE",
    description:
      "A partir de un layout de Photoshop y una planilla, genera decenas de piezas a la vez: folletos, catálogos, banners y cards.",
    outcome: "Un cambio de precio o de producto se vuelve planilla, no rehacer el diseño.",
    imageAlt: "Pantalla del generador de artes en lote de BuildAI",
    ctaLabel: "Ver proyecto en vivo",
  },
  alpha: {
    title: "AlphaCoach",
    tag: "MICROSAAS",
    description:
      "Plataforma web y app para coaches y alumnos. Cada coach tiene su espacio con colores y logo propios, sin publicar una app separada.",
    outcome: "La operación del coach y el recorrido del alumno en el mismo lugar.",
    imageAlt: "Pantalla de AlphaCoach de BuildAI",
    ctaLabel: "Ver proyecto en vivo",
  },
  accounting: {
    title: "Sistemas para un estudio contable",
    tag: "SOFTWARE A MEDIDA",
    description:
      "Para un estudio contable que atiende a profesionales de la salud: formulario online de impuesto a la renta y encuesta de satisfacción con panel de NPS.",
    outcome: "Menos planilla y archivo suelto al recoger datos de impuestos y escuchar a los clientes.",
    imageAlt: "Pantalla del formulario de impuestos y del panel de NPS de BuildAI",
  },
  growth: {
    title: "GrowthOS",
    tag: "MICROSAAS",
    description:
      "Panel de growth que junta Google Ads, Meta, e-mail y analytics, y genera un informe estratégico con IA.",
    outcome: "Embudo de marketing y producto en un solo lugar.",
    imageAlt: "Pantalla del panel GrowthOS de BuildAI",
    ctaLabel: "Ver video",
  },
  cnu: {
    title: "Simulacro CNU",
    tag: "EDUCACIÓN",
    description: "Simulacro del Concurso Nacional Unificado, oculto mientras el demo esté caído.",
    outcome: "Simulacro alineado a la vacante, con repaso a partir de los errores.",
    imageAlt: "Pantalla del simulacro CNU de BuildAI",
  },
};

const links: Record<CaseKey, { href?: string; videoUrl?: string; hidden?: boolean; images?: string[] }> = {
  whatsapp: {
    href: showWhatsappDemoCta
      ? "https://wa.me/5521985015148?text=Oi!%20Quero%20conhecer%20o%20atendente%20de%20WhatsApp%20da%20BuildAI"
      : undefined,
  },
  leadgen: { href: "https://leads-pi-seven.vercel.app/" },
  greensky: { href: "https://greensky.com.br/" },
  carrosseis: {
    href: "https://wa.me/5521985015148?text=Oi!%20Quero%20ver%20uma%20demonstra%C3%A7%C3%A3o%20do%20gerador%20de%20carross%C3%A9is",
  },
  newsgen: { href: "https://ai-video-news-generator--video-generator-39001.us-central1.hosted.app/" },
  factory: { href: "https://fabrica-de-conteudo.vercel.app/" },
  conexao: { videoUrl: "https://youtu.be/W5IOzuOQIVw" },
  encartes: { href: "https://psdautomator.vercel.app/" },
  alpha: { href: "https://slug-centric-3a4a6c77.vercel.app/" },
  accounting: {
    images: ["/cases/contabilidade-ir-800.webp", "/cases/contabilidade-nps-800.webp"],
  },
  growth: { videoUrl: "https://youtu.be/oJyN6APFjuA" },
  cnu: { hidden: true, href: "https://cnu-three.vercel.app/" },
};

const files: Record<CaseKey, string> = {
  whatsapp: "atendente-whatsapp.webp",
  leadgen: "leadgen.webp",
  greensky: "greensky.webp",
  carrosseis: "gerador-carrosseis.webp",
  newsgen: "newsgen.webp",
  factory: "content-factory.webp",
  conexao: "conexao.webp",
  encartes: "encartes.webp",
  alpha: "alphacoach.webp",
  accounting: "contabilidade-ir.webp",
  growth: "growth.webp",
  cnu: "encartes.webp",
};

const meta: Record<CaseKey, { caseCategory: CaseCategory; featuredOrder: number | null }> = {
  whatsapp: { caseCategory: "atendimento", featuredOrder: 1 },
  carrosseis: { caseCategory: "conteudo", featuredOrder: 2 },
  newsgen: { caseCategory: "conteudo", featuredOrder: 3 },
  accounting: { caseCategory: "sistemas", featuredOrder: 4 },
  alpha: { caseCategory: "sistemas", featuredOrder: 5 },
  leadgen: { caseCategory: "atendimento", featuredOrder: 6 },
  greensky: { caseCategory: "atendimento", featuredOrder: null },
  factory: { caseCategory: "conteudo", featuredOrder: null },
  conexao: { caseCategory: "conteudo", featuredOrder: null },
  encartes: { caseCategory: "conteudo", featuredOrder: null },
  growth: { caseCategory: "sistemas", featuredOrder: null },
  cnu: { caseCategory: "sistemas", featuredOrder: null },
};

const pageOrder: CaseKey[] = [
  "whatsapp",
  "leadgen",
  "greensky",
  "carrosseis",
  "newsgen",
  "factory",
  "conexao",
  "encartes",
  "alpha",
  "accounting",
  "growth",
  "cnu",
];

const byLocale: Record<Locale, Record<CaseKey, CaseCopy>> = { pt, en, es };

const toItem = (locale: Locale, key: CaseKey): ProjectItem => {
  const copy = byLocale[locale][key];
  const link = links[key];
  const picture = media(files[key]);
  return {
    title: copy.title,
    category: copy.tag,
    tag: copy.tag,
    metric: copy.outcome,
    outcome: copy.outcome,
    description: copy.description,
    imageAlt: copy.imageAlt,
    badge: copy.badge,
    ctaLabel: link.href || link.videoUrl ? copy.ctaLabel : undefined,
    ...picture,
    images: link.images,
    href: link.href,
    videoUrl: link.videoUrl,
    hidden: link.hidden,
    ...meta[key],
  };
};

export const getHomeCases = (locale: Locale): ProjectItem[] =>
  pageOrder
    .map((key) => toItem(locale, key))
    .filter((item) => !item.hidden && item.featuredOrder != null)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

export const getPortfolioCases = (locale: Locale): ProjectItem[] =>
  pageOrder.map((key) => toItem(locale, key)).filter((item) => !item.hidden);
