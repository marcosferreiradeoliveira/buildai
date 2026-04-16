import { LandingContent } from "@/types/landing";
import educationHeroImage from "@/assets/Gemini_Generated_Image_re9l7qre9l7qre9l Small.png";
import educationCasesImage from "@/assets/Gemini_Generated_Image_jgkljmjgkljmjgkl Small.png";

export const baseLandingContent: LandingContent = {
  seo: {
    title: "BuildAI | MicroSaaS e IA para Negócios",
    description:
      "A BuildAI cria MicroSaaS, automações com IA e softwares sob medida para acelerar crescimento e eficiência operacional.",
    previewImageSrc: educationHeroImage,
    faviconHref: educationCasesImage,
  },
  navbar: {
    brandName: "BuildAI",
    navLinks: [
      { label: "Serviços", href: "#servicos" },
      { label: "Processo", href: "#build-in-public" },
      { label: "Tecnologias", href: "#tech-stack" },
      { label: "Portfólio", href: "#portfolio" },
      { label: "Contato", href: "#contato" },
    ],
    ctaLabel: "Agendar Consultoria",
  },
  hero: {
    badge: "Build-in-Public Agency",
    title: "Construímos o futuro do seu negócio com",
    highlightedText: "MicroSaaS e IA",
    description:
      "Transformamos suas ideias em softwares escaláveis e automações inteligentes que economizam centenas de horas e maximizam seu ROI.",
    primaryCtaLabel: "Agendar Consultoria →",
    secondaryCtaLabel: "Ver Portfólio",
    stats: [
      { value: "50+", label: "Projetos entregues" },
      { value: "98%", label: "Satisfação" },
      { value: "10x", label: "ROI médio" },
    ],
  },
  services: {
    eyebrow: "Nossos Serviços",
    title: "Soluções que",
    highlightedText: "impulsionam",
    description: "Combinamos tecnologia de ponta com estratégia de negócios para entregar valor real e mensurável.",
    items: [
      {
        title: "Desenvolvimento de MicroSaaS",
        description: "Do MVP à escala. Criamos produtos SaaS enxutos, validados e prontos para crescer com sua base de clientes.",
        tag: "MVP → Escala",
      },
      {
        title: "Automações com IA",
        description: "Conectamos agentes inteligentes aos seus fluxos de trabalho, eliminando tarefas repetitivas e reduzindo custos operacionais.",
        tag: "Agentes + Fluxos",
      },
      {
        title: "Softwares Sob Medida",
        description: "Soluções robustas para problemas complexos. Arquitetura limpa, performance e manutenibilidade como prioridades.",
        tag: "Custom Solutions",
      },
    ],
  },
  process: {
    eyebrow: "Build-in-Public",
    title: "Transparência",
    highlightedText: "total",
    description: "Você acompanha cada etapa do desenvolvimento. Sem surpresas, sem caixas-pretas.",
    timeline: [
      { date: "Semana 1", title: "Descoberta e Planejamento", description: "Entendemos seu problema, definimos escopo e escolhemos a stack ideal.", status: "done" },
      { date: "Semana 2-3", title: "MVP e Prototipação", description: "Desenvolvimento ágil com entregas diárias. Você acompanha tudo em tempo real.", status: "done" },
      { date: "Semana 4", title: "Testes e Feedback", description: "Ciclo de testes com usuários reais. Ajustes rápidos baseados em dados.", status: "active" },
      { date: "Semana 5+", title: "Deploy e Iteração", description: "Lançamento, monitoramento e melhoria contínua com métricas de sucesso.", status: "upcoming" },
    ],
  },
  techStack: {
    eyebrow: "Tech Stack",
    items: [
      { name: "React", icon: "⚛️" },
      { name: "Next.js", icon: "▲" },
      { name: "Python", icon: "🐍" },
      { name: "OpenAI", icon: "🤖" },
      { name: "Supabase", icon: "⚡" },
      { name: "TypeScript", icon: "📘" },
      { name: "Node.js", icon: "🟢" },
      { name: "PostgreSQL", icon: "🐘" },
    ],
  },
  portfolio: {
    eyebrow: "Portfólio",
    title: "Resultados que",
    highlightedText: "falam por si",
    items: [
      {
        title: "AutoFlow AI",
        category: "Automação com IA",
        metric: "Redução de 40% no custo operacional",
        description: "Sistema de automação inteligente para processos de atendimento ao cliente com agentes de IA.",
      },
      {
        title: "MetricHub",
        category: "MicroSaaS",
        metric: "3.000 usuários em 90 dias",
        description: "Dashboard analítico para e-commerces com integrações automáticas e insights em tempo real.",
      },
      {
        title: "LegalDocs Pro",
        category: "Software Sob Medida",
        metric: "200h/mês economizadas",
        description: "Plataforma de geração e gestão de documentos jurídicos com IA generativa integrada.",
      },
    ],
  },
  contact: {
    eyebrow: "Contato",
    title: "Pronto para",
    highlightedText: "começar",
    description: "Preencha o formulário e nossa equipe entrará em contato para entender seu projeto e propor a melhor solução.",
    submitLabel: "Enviar Mensagem",
    successTitle: "Mensagem enviada!",
    successDescription: "Entraremos em contato em até 24h.",
    socials: [
      { label: "twitter", href: "#" },
      { label: "linkedin", href: "#" },
      { label: "github", href: "#" },
    ],
    copyrightName: "BuildAI",
  },
};

export const educationLandingContent: LandingContent = {
  seo: {
    title: "BuildAI Educação | IA e Automação para Instituições de Ensino",
    description:
      "Soluções de IA para educação: captação, matrícula, retenção e eficiência acadêmica com foco em resultado.",
    previewImageSrc: educationCasesImage,
    faviconHref: educationHeroImage,
  },
  navbar: {
    brandName: "BuildAI Educação",
    navLinks: baseLandingContent.navbar.navLinks,
    ctaLabel: "Agendar Diagnóstico Educacional",
  },
  hero: {
    badge: "Soluções para Educação",
    title: "Escalamos operações acadêmicas com",
    highlightedText: "IA e automação",
    description:
      "Criamos plataformas e automações para escolas, cursos e edtechs melhorarem aprendizagem, retenção e eficiência operacional.",
    primaryCtaLabel: "Agendar Diagnóstico →",
    secondaryCtaLabel: "Ver Cases de Educação",
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
    eyebrow: "Stack para Educação",
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
