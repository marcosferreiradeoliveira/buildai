import type { ProjectItem } from "@/types/landing";
import type { Locale } from "@/i18n/types";
import encartes640 from "@/assets/cases/encartes-640.webp";
import encartes960 from "@/assets/cases/encartes-960.webp";
import encartesJpeg from "@/assets/cases/encartes-960.jpg";
import greensky640 from "@/assets/cases/greensky-640.webp";
import greensky960 from "@/assets/cases/greensky-960.webp";
import greenskyJpeg from "@/assets/cases/greensky-960.jpg";
import conexao640 from "@/assets/cases/conexao-640.webp";
import conexao960 from "@/assets/cases/conexao-960.webp";
import conexaoJpeg from "@/assets/cases/conexao-960.jpg";
import newsgen640 from "@/assets/cases/newsgen-640.webp";
import newsgen960 from "@/assets/cases/newsgen-960.webp";
import newsgenJpeg from "@/assets/cases/newsgen-960.jpg";
import growth640 from "@/assets/cases/growth-640.webp";
import growth960 from "@/assets/cases/growth-960.webp";
import growthJpeg from "@/assets/cases/growth-960.jpg";

type CaseCopy = {
  title: string;
  category: string;
  metric: string;
  description: string;
};

type CaseMedia = Pick<
  ProjectItem,
  "imageSrc" | "imageSrcSet" | "webpSrcSet" | "imageSizes" | "href" | "videoUrl"
>;

const sizes = "(min-width: 1024px) 22rem, (min-width: 640px) 46vw, 100vw";

const media = (jpeg: string, webp640: string, webp960: string, extra?: Pick<CaseMedia, "href" | "videoUrl">): CaseMedia => ({
  imageSrc: jpeg,
  imageSrcSet: `${jpeg} 960w`,
  webpSrcSet: `${webp640} 640w, ${webp960} 960w`,
  imageSizes: sizes,
  ...extra,
});

const encartesMedia = media(encartesJpeg, encartes640, encartes960, {
  href: "https://psdautomator.vercel.app/",
});
const greenskyMedia = media(greenskyJpeg, greensky640, greensky960, {
  href: "https://greensky.com.br/",
});
const conexaoMedia = media(conexaoJpeg, conexao640, conexao960, {
  videoUrl: "https://youtu.be/W5IOzuOQIVw",
});
const newsgenMedia = media(newsgenJpeg, newsgen640, newsgen960, {
  href: "https://ai-video-news-generator--video-generator-39001.us-central1.hosted.app/",
});
const growthMedia = media(growthJpeg, growth640, growth960, {
  videoUrl: "https://youtu.be/oJyN6APFjuA",
});

const toItem = (copy: CaseCopy, extra?: CaseMedia): ProjectItem => ({ ...copy, ...extra });

const pt = {
  encartes: {
    title: "Gerador de Encartes para Varejo/Supermercado",
    category: "Automação com IA",
    metric: "Produção em lote de encartes e peças de varejo a partir de um layout e de uma planilha, sem retrabalho manual.",
    description:
      "Pega um layout do Photoshop (PSD com camadas nomeadas), uma planilha de Excel e uma pasta de imagens, e gera as artes finais em lote — encartes, catálogos, cards e banners de supermercado ou varejo, sem montar peça por peça na mão.",
  },
  greensky: {
    title: "Green Sky",
    category: "Software sob medida",
    metric: "Reservas online com pagamento no site ou conversa no WhatsApp — turismo de aventura no Rio.",
    description:
      "Site da operadora de parapente e asa delta (São Conrado e Niterói), com catálogo de experiências, checkout no Stripe ou conversa no WhatsApp, site em 6 idiomas e contador público do fundo de impacto da operação.",
  },
  accounting: {
    title: "Sistemas para escritório de contabilidade de saúde",
    category: "Software sob medida",
    metric: "Menos planilha e menos arquivo solto na coleta do IR e na escuta dos clientes.",
    description:
      "Para um escritório de contabilidade que atende profissionais de saúde, a BuildAI criou um formulário de Imposto de Renda — o cliente preenche e a equipe recebe os dados organizados — e uma pesquisa de satisfação com dashboard de NPS, médias por serviço e evolução ao longo do tempo.",
  },
  ir: {
    title: "Formulário de Imposto de Renda",
    category: "Software sob medida",
    metric: "A equipe recebe os dados de IR organizados, no lugar da planilha e do vai-e-vem de arquivo.",
    description:
      "Formulário online para um escritório de contabilidade que atende profissionais de saúde coletar os dados de Imposto de Renda dos clientes e avisar a equipe, no lugar da planilha e do vai-e-vem de arquivo.",
  },
  nps: {
    title: "Pesquisa e dashboard de NPS",
    category: "Software sob medida",
    metric: "A escuta dos clientes do escritório deixa de ficar espalhada em arquivo solto.",
    description:
      "Pesquisa de satisfação com os clientes de um escritório de contabilidade de profissionais de saúde, e um painel com NPS geral, distribuição de promotores, neutros e detratores, médias por serviço e evolução mensal.",
  },
  alpha: {
    title: "AlphaCoach",
    category: "MicroSaaS",
    metric: "A operação do coach e a jornada do aluno no mesmo sistema, com a cara de cada profissional.",
    description:
      "Plataforma para coaches e alunos, com web e aplicativo no celular. Cada coach tem o seu espaço, com cores, logo e identidade próprios, sem precisar publicar um app separado.",
  },
  leadgen: {
    title: "LeadGen AI",
    category: "MicroSaaS",
    metric: "Prospecção organizada num só fluxo — a BuildAI usa e também entrega para outras empresas.",
    description:
      "Produto da BuildAI para prospecção B2B. A equipe usa internamente e também oferece às empresas. Entra uma lista ou um conjunto de empresas; o sistema organiza e enriquece os leads, ajuda a qualificar e prepara o caminho para o contato.",
  },
  conexao: {
    title: "Conexão Ativa — Automação de Notícias",
    category: "Automação com IA",
    metric: "Do Telegram ao portal, ao Facebook e ao Instagram, sem o time copiar e colar o mesmo conteúdo em três lugares.",
    description:
      "Monitora um canal do Telegram (texto ou áudio), transcreve, estrutura o artigo com SEO, busca imagem e publica no WordPress, no Facebook e no Instagram, com repostagem em portais secundários quando cabe.",
  },
  newsgen: {
    title: "NewsGen AI",
    category: "Vídeo com IA",
    metric: "Roteiro, voz e montagem de vídeo informativo num só fluxo.",
    description:
      "A partir de um texto (notícia ou roteiro), gera narração e vídeo com apresentador virtual. Também traduz um vídeo já gravado, mantendo áudio e imagem alinhados. Cada conta tem login e histórico.",
  },
  growth: {
    title: "GrowthOS",
    category: "MicroSaaS",
    metric: "Funil de marketing e produto no mesmo lugar, com relatório estratégico gerado por IA.",
    description:
      "Painel de growth com visão de receita, CAC, leads e ROAS, funil de produto e comparação de canais. Conecta Google Ads, Meta, Brevo, Snov.io, Mixpanel e GA4. Um analista de IA monta o relatório estratégico a partir dos dados sincronizados.",
  },
  factory: {
    title: "Content Factory AI",
    category: "Content Factory",
    metric: "Um tema vira pacote de conteúdo em vários formatos, no mesmo fluxo.",
    description:
      "Gerador de pacotes de conteúdo a partir de um tema — ebook, podcast e vídeo — para um time pequeno que precisa aparecer em mais de um canal sem produzir cada peça em silos.",
  },
  cnu: {
    title: "CNU Simulado",
    category: "Educação",
    metric: "Simulado alinhado à vaga, com revisão personalizada a partir dos erros.",
    description:
      "Simulador do Concurso Nacional Unificado. O candidato escolhe o bloco e a vaga, faz a prova e, no fim, pode gerar um áudio de revisão só com as questões que errou.",
  },
} satisfies Record<string, CaseCopy>;

const en: typeof pt = {
  encartes: {
    title: "Retail and supermarket flyer generator",
    category: "AI automation",
    metric: "Batch production of retail flyers from one layout and a spreadsheet, without rebuilding each piece by hand.",
    description:
      "Takes a Photoshop layout (PSD with named layers), an Excel spreadsheet and a folder of images, and generates the final artwork in batch — supermarket and retail flyers, catalogs, cards and banners.",
  },
  greensky: {
    title: "Green Sky",
    category: "Custom software",
    metric: "Online bookings paid on the site or continued on WhatsApp — adventure tourism in Rio.",
    description:
      "Website for a paragliding and hang gliding operator in São Conrado and Niterói, with an experience catalog, Stripe checkout or a WhatsApp conversation, six languages and a public counter for the operation's impact fund.",
  },
  accounting: {
    title: "Systems for a health-professionals accounting firm",
    category: "Custom software",
    metric: "Less spreadsheet and fewer loose files when collecting tax data and listening to clients.",
    description:
      "For an accounting firm that serves health professionals, BuildAI built an income-tax form — the client fills it in and the team receives organized data — and a satisfaction survey with an NPS dashboard, averages by service and change over time.",
  },
  ir: {
    title: "Income tax form",
    category: "Custom software",
    metric: "The team receives organized income-tax data instead of a spreadsheet and files going back and forth.",
    description:
      "Online form for an accounting firm that serves health professionals to collect clients' income-tax data and notify the team, instead of a spreadsheet and loose files.",
  },
  nps: {
    title: "NPS survey and dashboard",
    category: "Custom software",
    metric: "Client feedback for the firm no longer lives in scattered files.",
    description:
      "Satisfaction survey for the clients of an accounting firm that serves health professionals, plus a dashboard with overall NPS, promoters, passives and detractors, averages by service and monthly change.",
  },
  alpha: {
    title: "AlphaCoach",
    category: "MicroSaaS",
    metric: "The coach's operation and the student's journey in one system, with each professional's own look.",
    description:
      "Platform for coaches and students, on the web and on a phone app. Each coach gets their own space, with their colors, logo and identity, without publishing a separate app.",
  },
  leadgen: {
    title: "LeadGen AI",
    category: "MicroSaaS",
    metric: "Prospecting in one flow — BuildAI uses it and also delivers it to other companies.",
    description:
      "BuildAI's product for B2B prospecting. The team uses it internally and also offers it to companies. A list or a set of companies goes in; the system organizes and enriches the leads, helps qualify them and prepares the outreach.",
  },
  conexao: {
    title: "Conexão Ativa — news automation",
    category: "AI automation",
    metric: "From Telegram to the site, Facebook and Instagram, without the team pasting the same story in three places.",
    description:
      "Watches a Telegram channel (text or audio), transcribes it, structures the article for search, finds an image and publishes to WordPress, Facebook and Instagram, reposting to secondary sites when it fits.",
  },
  newsgen: {
    title: "NewsGen AI",
    category: "AI video",
    metric: "Script, voice and edit of an informational video in one flow.",
    description:
      "From a text (a news item or a script), it generates narration and a video with a virtual presenter. It also translates a recorded video, keeping audio and picture aligned. Each account has login and history.",
  },
  growth: {
    title: "GrowthOS",
    category: "MicroSaaS",
    metric: "Marketing and product funnel in one place, with a strategy report written by AI.",
    description:
      "Growth dashboard with revenue, CAC, leads and ROAS, the product funnel and a channel comparison. It connects Google Ads, Meta, Brevo, Snov.io, Mixpanel and GA4. An AI analyst writes the strategy report from the synced data.",
  },
  factory: {
    title: "Content Factory AI",
    category: "Content Factory",
    metric: "One topic becomes a content pack in several formats, in the same flow.",
    description:
      "Content-pack generator from a topic — ebook, podcast and video — for a small team that needs to show up on more than one channel without producing each piece in a silo.",
  },
  cnu: {
    title: "CNU practice exam",
    category: "Education",
    metric: "A practice exam matched to the role, with a review built from the questions the candidate missed.",
    description:
      "Practice exam for Brazil's Concurso Nacional Unificado. The candidate picks the block and the role, takes the test and can generate a review audio with only the questions they got wrong.",
  },
};

const es: typeof pt = {
  encartes: {
    title: "Generador de folletos para retail y supermercado",
    category: "Automatización con IA",
    metric: "Producción en lote de folletos de retail a partir de un layout y una planilla, sin rehacer cada pieza a mano.",
    description:
      "Toma un layout de Photoshop (PSD con capas nombradas), una planilla de Excel y una carpeta de imágenes, y genera las artes finales en lote — folletos, catálogos, cards y banners de supermercado o retail.",
  },
  greensky: {
    title: "Green Sky",
    category: "Software a medida",
    metric: "Reservas online con pago en el sitio o conversación por WhatsApp — turismo de aventura en Río.",
    description:
      "Sitio de un operador de parapente y ala delta (São Conrado y Niterói), con catálogo de experiencias, checkout en Stripe o conversación por WhatsApp, sitio en 6 idiomas y contador público del fondo de impacto de la operación.",
  },
  accounting: {
    title: "Sistemas para un estudio contable de profesionales de la salud",
    category: "Software a medida",
    metric: "Menos planilla y menos archivo suelto al recoger datos de impuestos y escuchar a los clientes.",
    description:
      "Para un estudio contable que atiende a profesionales de la salud, BuildAI creó un formulario de impuesto a la renta — el cliente completa y el equipo recibe los datos ordenados — y una encuesta de satisfacción con panel de NPS, promedios por servicio y evolución en el tiempo.",
  },
  ir: {
    title: "Formulario de impuesto a la renta",
    category: "Software a medida",
    metric: "El equipo recibe los datos de impuestos ordenados, en lugar de la planilla y el ida y vuelta de archivos.",
    description:
      "Formulario online para que un estudio contable de profesionales de la salud recoja los datos de impuesto a la renta de los clientes y avise al equipo, en lugar de la planilla y los archivos sueltos.",
  },
  nps: {
    title: "Encuesta y panel de NPS",
    category: "Software a medida",
    metric: "La escucha de los clientes del estudio deja de quedar en archivos sueltos.",
    description:
      "Encuesta de satisfacción con los clientes de un estudio contable de profesionales de la salud, y un panel con NPS general, promotores, neutros y detractores, promedios por servicio y evolución mensual.",
  },
  alpha: {
    title: "AlphaCoach",
    category: "MicroSaaS",
    metric: "La operación del coach y el recorrido del alumno en el mismo sistema, con la cara de cada profesional.",
    description:
      "Plataforma para coaches y alumnos, en web y en la app del celular. Cada coach tiene su espacio, con colores, logo e identidad propios, sin publicar una app separada.",
  },
  leadgen: {
    title: "LeadGen AI",
    category: "MicroSaaS",
    metric: "Prospección organizada en un solo flujo — BuildAI lo usa y también lo entrega a otras empresas.",
    description:
      "Producto de BuildAI para prospección B2B. El equipo lo usa por dentro y también lo ofrece a las empresas. Entra una lista o un conjunto de empresas; el sistema organiza y enriquece los leads, ayuda a calificar y prepara el contacto.",
  },
  conexao: {
    title: "Conexão Ativa — automatización de noticias",
    category: "Automatización con IA",
    metric: "Del Telegram al portal, a Facebook y a Instagram, sin que el equipo copie el mismo contenido en tres lugares.",
    description:
      "Monitorea un canal de Telegram (texto o audio), transcribe, estructura el artículo para búsqueda, busca imagen y publica en WordPress, Facebook e Instagram, con republicación en portales secundarios cuando corresponde.",
  },
  newsgen: {
    title: "NewsGen AI",
    category: "Video con IA",
    metric: "Guion, voz y montaje de un video informativo en un solo flujo.",
    description:
      "A partir de un texto (noticia o guion), genera narración y video con presentador virtual. También traduce un video ya grabado, manteniendo audio e imagen alineados. Cada cuenta tiene acceso e historial.",
  },
  growth: {
    title: "GrowthOS",
    category: "MicroSaaS",
    metric: "Embudo de marketing y producto en el mismo lugar, con informe estratégico generado por IA.",
    description:
      "Panel de growth con ingresos, CAC, leads y ROAS, embudo de producto y comparación de canales. Conecta Google Ads, Meta, Brevo, Snov.io, Mixpanel y GA4. Un analista de IA arma el informe a partir de los datos sincronizados.",
  },
  factory: {
    title: "Content Factory AI",
    category: "Content Factory",
    metric: "Un tema se vuelve un paquete de contenido en varios formatos, en el mismo flujo.",
    description:
      "Generador de paquetes de contenido a partir de un tema — ebook, podcast y video — para un equipo chico que necesita aparecer en más de un canal sin producir cada pieza por separado.",
  },
  cnu: {
    title: "Simulacro CNU",
    category: "Educación",
    metric: "Simulacro alineado a la vacante, con repaso personalizado a partir de los errores.",
    description:
      "Simulacro del Concurso Nacional Unificado. El candidato elige el bloque y la vacante, hace la prueba y, al final, puede generar un audio de repaso solo con las preguntas que erró.",
  },
};

const byLocale: Record<Locale, typeof pt> = { pt, en, es };

const homeKeys = ["encartes", "greensky", "accounting", "alpha", "leadgen", "conexao"] as const;
const pageKeys = ["encartes", "greensky", "ir", "nps", "alpha", "leadgen", "conexao", "newsgen", "growth", "factory", "cnu"] as const;

const mediaByKey: Partial<Record<(typeof pageKeys)[number] | "accounting", CaseMedia>> = {
  encartes: encartesMedia,
  greensky: greenskyMedia,
  conexao: conexaoMedia,
  newsgen: newsgenMedia,
  growth: growthMedia,
  factory: { href: "https://fabrica-de-conteudo.vercel.app/" },
  alpha: { href: "https://slug-centric-3a4a6c77.vercel.app/" },
  leadgen: { href: "https://leads-pi-seven.vercel.app/" },
  cnu: { href: "https://cnu-three.vercel.app/" },
};

const pick = (locale: Locale, keys: readonly (keyof typeof pt)[]): ProjectItem[] =>
  keys.map((key) => toItem(byLocale[locale][key], mediaByKey[key]));

export const getHomeCases = (locale: Locale): ProjectItem[] => pick(locale, homeKeys);

export const getPortfolioCases = (locale: Locale): ProjectItem[] => pick(locale, pageKeys);
