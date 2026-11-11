import { LandingContent } from "@/types/landing";
import buildaiIcon from "@/assets/buildai-icon-only.png";
import buildaiLogoDark from "@/assets/buildai-logo-transparent.png";
import educationHeroImage from "@/assets/Gemini_Generated_Image_re9l7qre9l7qre9l Small.png";
import educationCasesImage from "@/assets/Gemini_Generated_Image_jgkljmjgkljmjgkl Small.png";
import { getHomeCases } from "@/content/cases";

export const baseLandingContent: LandingContent = {
  seo: {
    title: "BuildAI | Microssistemas e automações para PMEs",
    description:
      "A BuildAI cria soluções sob medida com IA para pequenas e médias empresas: atendente de WhatsApp, geradores de conteúdo, sistemas e automações.",
    previewImageSrc: "/preview.jpeg",
    faviconHref: buildaiIcon,
  },
  navbar: {
    brandName: "BuildAI",
    logoSrc: buildaiLogoDark,
    navLinks: [
      { label: "Serviços", href: "#servicos" },
      { label: "Processo", href: "#build-in-public" },
      { label: "Tecnologias", href: "#tech-stack" },
      { label: "Portfólio", href: "#portfolio" },
      { label: "Contato", href: "#contato" },
    ],
    ctaLabel: "Agendar conversa",
  },
  hero: {
    badge: "Soluções sob medida com IA para PMEs",
    title: "Pare o retrabalho com",
    highlightedText: "microssistemas e automações",
    description:
      "Atendimento repetitivo no WhatsApp, planilhas copiadas à mão e o mesmo trabalho feito de novo entre equipes. A BuildAI cria o sistema pequeno que resolve o gargalo da sua operação — e você acompanha cada etapa.",
    primaryCtaLabel: "Pedir orçamento no WhatsApp",
    secondaryCtaLabel: "Ver cases",
    stats: [
      { value: "Sistemas sob medida", label: "" },
      { value: "Automações com IA", label: "" },
      { value: "MicroSaaS para PME", label: "" },
    ],
  },
  showTrustSections: true,
  services: {
    eyebrow: "Para a operação",
    title: "O que a gente resolve",
    highlightedText: "",
    description: "Soluções sob medida para o gargalo que mais toma tempo da sua equipe.",
    items: [
      {
        title: "Atendimento no WhatsApp",
        description: "Um assistente com IA responde, qualifica e agenda. Você entra só quando vale a pena.",
        tag: "Atendimento",
      },
      {
        title: "Conteúdo para redes",
        description: "Carrosséis, vídeos e posts gerados a partir de um tema, com a cara da sua marca.",
        tag: "Conteúdo",
      },
      {
        title: "Planilhas e retrabalho",
        description: "Formulários, painéis e sistemas pequenos no lugar da planilha copiada à mão.",
        tag: "Sistemas",
      },
      {
        title: "Prospecção",
        description: "Listas de empresas organizadas e qualificadas para a equipe comercial.",
        tag: "Vendas",
      },
    ],
  },
  process: {
    eyebrow: "Processo",
    title: "Como funciona",
    highlightedText: "",
    description: "Você acompanha cada etapa do desenvolvimento. Sem surpresas, sem caixas-pretas.",
    timeline: [
      { date: "Semana 1", title: "Descoberta e Planejamento", description: "Entendemos seu problema, definimos escopo e escolhemos a tecnologia ideal.", status: "done" },
      { date: "Semana 2-3", title: "Protótipo", description: "Desenvolvimento ágil com entregas frequentes. Você acompanha tudo em tempo real.", status: "done" },
      { date: "Semana 4", title: "Testes e ajustes", description: "Ciclo de testes com usuários reais. Ajustes rápidos baseados em dados.", status: "active" },
      { date: "Semana 5+", title: "Lançamento e iteração", description: "Lançamento, monitoramento e melhoria contínua com métricas de sucesso.", status: "upcoming" },
    ],
  },
  techStack: {
    eyebrow: "Ferramentas",
    title: "Ferramentas que usamos",
    items: [
      { name: "React", icon: "" },
      { name: "Next.js", icon: "" },
      { name: "TypeScript", icon: "" },
      { name: "Firebase", icon: "" },
      { name: "Supabase", icon: "" },
      { name: "OpenAI", icon: "" },
      { name: "Gemini", icon: "" },
      { name: "Claude", icon: "" },
      { name: "ElevenLabs", icon: "" },
      { name: "HeyGen", icon: "" },
      { name: "Flutter", icon: "" },
    ],
  },
  portfolio: {
    eyebrow: "Portfólio",
    title: "Soluções que já estão rodando",
    highlightedText: "",
    description: "Algumas soluções sob medida que a BuildAI criou para clientes e para a própria operação.",
    items: getHomeCases("pt"),
  },
  contact: {
    eyebrow: "Contato",
    title: "Pronto para",
    highlightedText: "começar",
    description: "Conte rapidinho o que você quer resolver. A conversa continua no WhatsApp.",
    submitLabel: "Continuar no WhatsApp",
    successTitle: "Mensagem enviada!",
    successDescription: "Entraremos em contato em até 24h.",
    // Redes exibidas só se a URL existir em src/config/social.ts.
    socials: [],
    copyrightName: "BuildAI",
  },
};

export const educationLandingContent: LandingContent = {
  seo: {
    title: "BuildAI Educação | IA e Automação para Instituições de Ensino",
    description:
      "Soluções de IA para educação: captação, matrícula, retenção e eficiência acadêmica com foco em resultado.",
    previewImageSrc: educationCasesImage,
    faviconHref: buildaiIcon,
  },
  navbar: {
    brandName: "BuildAI Educação",
    logoSrc: buildaiLogoDark,
    navLinks: baseLandingContent.navbar.navLinks,
    ctaLabel: "Agendar Diagnóstico Educacional",
  },
  hero: {
    badge: "Soluções para Educação",
    title: "Escalamos operações acadêmicas com",
    highlightedText: "IA e automação",
    description:
      "Criamos plataformas e automações para escolas, cursos e edtechs melhorarem aprendizagem, retenção e eficiência operacional.",
    primaryCtaLabel: "Pedir orçamento no WhatsApp",
    secondaryCtaLabel: "Ver cases",
    stats: [
      { value: "35+", label: "Projetos em educação" },
      { value: "-42%", label: "Tempo em tarefas administrativas" },
      { value: "+28%", label: "Retenção de alunos" },
    ],
    backgroundImageSrc: educationHeroImage,
  },
  services: {
    eyebrow: "Serviços para Educação",
    title: "Soluções para",
    highlightedText: "instituições de ensino",
    description: "Unimos produto, dados e IA para otimizar jornada do aluno, operação acadêmica e performance comercial.",
    items: [
      {
        title: "Plataformas Acadêmicas Sob Medida",
        description: "Construímos portais, dashboards e fluxos administrativos para secretaria, coordenação e direção acompanharem indicadores em tempo real.",
        tag: "Gestão Acadêmica",
      },
      {
        title: "Automação de Atendimento e Matrícula",
        description: "Implementamos agentes de IA para captar, qualificar e converter leads educacionais com respostas instantâneas e personalizadas.",
        tag: "Captação + Conversão",
      },
      {
        title: "Analytics de Aprendizagem",
        description: "Consolidamos dados de LMS, CRM e financeiro para prever evasão, identificar gargalos pedagógicos e apoiar decisões com dados.",
        tag: "Dados + Predição",
      },
    ],
  },
  process: {
    eyebrow: "Método Validado",
    title: "Execução",
    highlightedText: "orientada a resultados",
    description: "Cada sprint gera entregas aplicadas a contextos reais de escolas, faculdades e cursos profissionalizantes.",
    timeline: [
      { date: "Sprint 1", title: "Diagnóstico Institucional", description: "Mapeamos jornadas de captação, matrícula e retenção para priorizar ganhos rápidos.", status: "done" },
      { date: "Sprint 2", title: "Protótipo com Stakeholders", description: "Validamos fluxos com time acadêmico, comercial e atendimento antes do desenvolvimento completo.", status: "active" },
      { date: "Sprint 3", title: "Implementação Assistida", description: "Publicamos módulos em produção e treinamos a equipe para adoção do novo processo.", status: "upcoming" },
      { date: "Sprint 4+", title: "Escala e Otimização", description: "Acompanhamos KPIs e iteramos continuamente para ampliar eficiência e experiência do aluno.", status: "upcoming" },
    ],
  },
  techStack: {
    eyebrow: "Tecnologias para educação",
    items: [
      { name: "React", icon: "⚛️" },
      { name: "Python", icon: "🐍" },
      { name: "OpenAI", icon: "🤖" },
      { name: "WhatsApp API", icon: "💬" },
      { name: "Supabase", icon: "⚡" },
      { name: "Metabase", icon: "📊" },
      { name: "Node.js", icon: "🟢" },
      { name: "PostgreSQL", icon: "🐘" },
    ],
  },
  portfolio: {
    eyebrow: "Ideias de Cases Educacionais",
    title: "Possíveis resultados para",
    highlightedText: "educação",
    items: [
      {
        title: "UniFlow Admissions",
        category: "Captação e Matrícula",
        metric: "Potencial de até 2,1x mais inscrições qualificadas em 60 dias",
        description: "Ideia de automação omnichannel de funil para universidade privada, com foco em reduzir tempo de resposta e aumentar conversão.",
      },
      {
        title: "LMS Insight 360",
        category: "Analytics Acadêmico",
        metric: "Possível redução de evasão semestral em até 31%",
        description: "Ideia de painel com alertas preditivos de risco de evasão e recomendações de intervenção para coordenadores.",
      },
      {
        title: "Escola Conecta IA",
        category: "Atendimento com IA",
        metric: "Potencial de resolver até 73% dos atendimentos sem fila",
        description: "Ideia de assistente virtual para secretaria escolar, cobrindo dúvidas de alunos e responsáveis 24/7.",
      },
    ],
    backgroundImageSrc: educationCasesImage,
  },
  contact: {
    eyebrow: "Contato",
    title: "Quer transformar sua",
    highlightedText: "operação educacional",
    description: "Fale com nosso time para desenhar um plano de implementação com foco em captação, retenção e eficiência acadêmica.",
    submitLabel: "Quero um plano para Educação",
    successTitle: "Recebemos seu contato!",
    successDescription: "Nosso time de educação vai responder em até 1 dia útil.",
    socials: baseLandingContent.contact.socials,
    copyrightName: "BuildAI Educação",
  },
};

export const landingContentBySegment: Record<string, LandingContent> = {
  educacao: educationLandingContent,
};

export const getSegmentLandingContent = (segmentSlug: string) =>
  landingContentBySegment[segmentSlug.toLowerCase()];
