import { LandingContent } from "@/types/landing";
import educationHeroImage from "@/assets/Gemini_Generated_Image_re9l7qre9l7qre9l Small.png";
import educationCasesImage from "@/assets/Gemini_Generated_Image_jgkljmjgkljmjgkl Small.png";
import previewImage from "@/assets/preview.jpeg";
import courseOgImage from "@/assets/watermarked_img_2560458068198262558.jpg";
import igScoutCaseImage from "@/assets/case1.jpeg";
import culturaFluxoCaseImage from "@/assets/fluxo.jpeg";
import appAmanhaCaseImage from "@/assets/MuseuDoAmanha-300x277-DqxW2IJM.png";
import contentFactoryCaseImage from "@/assets/Carrossel.png";
import freelasSniperCaseImage from "@/assets/99sniper Large.jpeg";
import automacaoCaseImage from "@/assets/automacao Large.jpeg";
import fabuladorCaseImage from "@/assets/Fabulador Large.jpeg";
import greenSkyCaseImage from "@/assets/greensky Large.jpeg";
import grioAiCaseImage from "@/assets/GrioAI Large.jpeg";
import newsGenCaseImage from "@/assets/Newsgen Large.jpeg";
import growthOsCaseImage from "@/assets/GrowOS Large.jpeg";
import { courseLandingContent } from "@/content/course";

export const baseLandingContent: LandingContent = {
  seo: {
    title: "BuildAI | MicroSaaS e IA para Negócios",
    description:
      "A BuildAI cria MicroSaaS, automações com IA e softwares sob medida para acelerar crescimento e eficiência operacional.",
    previewImageSrc: courseOgImage,
    faviconHref: educationCasesImage,
  },
  navbar: {
    brandName: "BuildAI",
    navLinks: [
      { label: "Serviços", href: "#servicos" },
      { label: "Processo", href: "#build-in-public" },
      { label: "Tecnologias", href: "#tech-stack" },
      { label: "Portfólio", href: "#portfolio" },
      { label: "Curso IA", href: "#curso-ia" },
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
      { name: "React 19", icon: "⚛️" },
      { name: "Next.js 15", icon: "▲" },
      { name: "TypeScript", icon: "📘" },
      { name: "Firebase Suite", icon: "🔥" },
      { name: "Supabase", icon: "⚡" },
      { name: "OpenAI GPT-4o", icon: "🤖" },
      { name: "Google Gemini", icon: "✨" },
      { name: "Claude", icon: "🧠" },
      { name: "ElevenLabs", icon: "🎙️" },
      { name: "HeyGen", icon: "🎬" },
      { name: "Flutter", icon: "💙" },
      { name: "Dart", icon: "🎯" },
    ],
  },
  portfolio: {
    eyebrow: "Portfólio",
    title: "Resultados que",
    highlightedText: "falam por si",
    items: [
      {
        title: "Gerador de Artes PSD",
        category: "Automação com IA",
        metric: "Produção em lote de peças visuais a partir de template + planilha, sem retrabalho manual",
        description:
          "Aplicação web que transforma um layout fixo no Photoshop (PSD) em gerador em lote: camadas nomeadas, planilha Excel e pasta de imagens viram artes finais em PNG/PSD — catálogos, cards, banners, menus e qualquer layout repetitivo com um clique.",
        imageSrc: previewImage,
        href: "https://psdautomator.vercel.app/",
      },
      {
        title: "NewsGen AI",
        category: "Content Factory",
        metric: "Produção de vídeos informativos com menos etapas manuais — roteiro, voz e montagem em um só fluxo",
        description:
          "Plataforma web que transforma conteúdo em vídeo com IA: a partir de texto (notícias ou roteiro), gera narração e vídeo com apresentador virtual; também traduz vídeos gravados para outros idiomas mantendo áudio e imagem sincronizados. Login seguro, histórico de projetos e configuração das ferramentas de IA no browser.",
        imageSrc: newsGenCaseImage,
        href: "https://ai-video-news-generator--video-generator-39001.us-central1.hosted.app/",
      },
      {
        title: "Green Sky",
        category: "Software Sob Medida",
        metric: "Reservas online com Stripe e fundo de impacto social — turismo de aventura com propósito no Rio",
        description:
          "Site institucional e comercial para operadora de parapente e asa delta (São Conrado e Niterói): catálogo de experiências, checkout Stripe ou fluxo consultivo via WhatsApp, contador público do fundo Propósito e i18n em 6 idiomas. React 19, Firebase, Cloud Functions e EmailJS.",
        imageSrc: greenSkyCaseImage,
        href: "https://greensky.com.br/",
      },
      {
        title: "GrowthOS",
        category: "MicroSaaS",
        metric: "Funil completo de marketing e produto em um só lugar — com relatório estratégico gerado por IA",
        description:
          "Dashboard web para Chief Growth Officer: visão executiva (receita, CAC, leads, ROAS), funil de produto e comparação de canais. Conecta Google Ads, Meta, Brevo, Snov.io, Mixpanel e GA4; o CGO AI Analyst gera relatórios estratégicos com Gemini a partir dos dados sincronizados.",
        imageSrc: growthOsCaseImage,
      },
      {
        title: "Conexão Ativa — Automação de Notícias",
        category: "Automação com IA",
        metric: "Do Telegram ao portal publicado em minutos — texto, áudio, SEO e redes sociais sem retrabalho manual",
        description:
          "Monitora um canal do Telegram e transforma mensagens de texto ou áudio em artigos otimizados para SEO: transcrição com OpenAI, redação estruturada com Claude, busca de imagem no Tavily e publicação automática no WordPress (RankMath), Facebook e Instagram — com repostagem condicional em portais secundários.",
        imageSrc: automacaoCaseImage,
        videoUrl: "https://youtu.be/W5IOzuOQIVw",
      },
      {
        title: "99Freelas Sniper",
        category: "Automação com IA",
        metric: "Prospecção e lances no 99Freelas no piloto automático — com revisão humana antes do envio",
        description:
          "Painel local que varre projetos Web/Mobile/Software no 99Freelas, filtra por whitelist/blacklist, gera propostas com Gemini (texto, preço e prazo) e envia lances via Playwright. Dashboard para revisar, editar cada proposta e disparar a fila manualmente — envio automático desligado por padrão.",
        imageSrc: freelasSniperCaseImage,
        videoUrl: "https://youtu.be/0PwsGTaO3KI",
      },
      {
        title: "Griô AI — Horizontes da Diáspora",
        category: "Software Sob Medida",
        metric: "Experiência educativa imersiva — hackear o passado para reconstruir memórias da diáspora africana",
        description:
          "RPG narrativo cooperativo com IA sobre Mohammed Gardo Baquaqua e as rotas da diáspora: investigue fases históricas, converse com NPCs da época e use documentos reais (Slave Voyages, jornais, biografias) como evidência. Três papéis — linguista, arquivista e estrategista — narrativa afrofuturista com Gemini e suporte a PT, EN e FR.",
        imageSrc: grioAiCaseImage,
        href: "https://gri-ai-horizontes-da-di-spora-108605433402.us-west1.run.app/",
      },
      {
        title: "Espelho Literário (Fabulador)",
        category: "Software Sob Medida",
        metric: "Atelier de escrita assistida por IA — do relato oral ao texto final na sua biblioteca pessoal",
        description:
          "Facilitador literário com IA para criar e lapidar relatos pessoais: sessão por voz ou texto com perguntas instigadoras, transcrição, mosaico poético com palavras-chave e imagens sugeridas. Olhar acolhedor do facilitador, estruturação do texto com Gemini e acervo completo — processo e versão final — na Minha Biblioteca.",
        imageSrc: fabuladorCaseImage,
        href: "https://fabulador.web.app/",
      },
      {
        title: "IG-Scout AI",
        category: "Automação com IA",
        metric: "Escala em vendas através de prospecção automatizada e qualificada",
        description:
          "Ferramenta de prospecção outbound que automatiza a busca, extração de dados e qualificação de perfis. Integração de Web Scraping com análise comercial via OpenAI para geração de mensagens personalizadas.",
        imageSrc: igScoutCaseImage,
        href: "https://instagramscrapper-nine.vercel.app/",
      },
      {
        title: "Cultura Fluxo Finance",
        category: "MicroSaaS",
        metric: "Automação de processos complexos de prestação de contas com análise de conformidade de documentos",
        description:
          "Plataforma B2B para gestão financeira e compliance de projetos culturais financiados por leis de incentivo. Inclui controle de orçamento por rubricas, análise de notas fiscais via IA e gestão de assinaturas.",
        imageSrc: culturaFluxoCaseImage,
        href: "https://execucaofinanceira.web.app/",
      },
      {
        title: "App Amanhã (IoT)",
        category: "Software Sob Medida",
        metric: "Premiado como o melhor aplicativo de Internet das Coisas (IoT) do Brasil",
        description:
          "Guia interativo para o Museu do Amanhã utilizando tecnologia de beacons para interatividade contextual em tempo real. Arquitetura robusta integrando hardware (IoT) e software mobile de alta performance.",
        imageSrc: appAmanhaCaseImage,
        videoUrl: "https://www.youtube.com/watch?v=JFg02dn56qU",
      },
      {
        title: "Content Factory AI",
        category: "Content Factory",
        metric:
          "Redução drástica de custos eliminando a necessidade de estúdios tradicionais através de avatares digitais",
        description:
          "Gerador de pacotes de conteúdo omnichannel que transforma temas em ebooks, podcasts e vídeos.",
        imageSrc: contentFactoryCaseImage,
        href: "https://gerador-de-carrossel-amber.vercel.app/",
      },
    ],
  },
  course: courseLandingContent,
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
