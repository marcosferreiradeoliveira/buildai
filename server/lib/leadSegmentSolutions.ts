export type ImplementationIdea = {
  title: string;
  category: string;
  description: string;
  metric: string;
};

const segmentTemplates: Record<string, (company: string) => ImplementationIdea[]> = {
  esg: (c) => [
    {
      category: "MicroSaaS",
      title: "Painel de jornada e indicadores ESG",
      description: `Plataforma para a ${c} consolidar métricas ambientais, sociais e de governança, com trilhas por cliente e alertas de compliance.`,
      metric: "Visão única da jornada ESG por conta",
    },
    {
      category: "Automação com IA",
      title: "Coleta e validação de dados ESG",
      description: `Fluxos com IA para a ${c} captar, classificar e validar evidências e indicadores de sustentabilidade com menos trabalho manual.`,
      metric: "Menos retrabalho na consolidação de dados",
    },
    {
      category: "IA generativa",
      title: "Relatórios e comunicação ESG",
      description: `Geração assistida de relatórios, respostas a questionários e materiais de sustentabilidade para a ${c} em múltiplos formatos.`,
      metric: "Mais entregas documentais no mesmo prazo",
    },
    {
      category: "Software sob medida",
      title: "Portal do cliente ESG",
      description: `Ambiente digital para a ${c} e seus clientes acompanharem etapas, documentos e status da jornada de sustentabilidade.`,
      metric: "Transparência e engajamento do cliente",
    },
  ],
  juridico: (c) => [
    {
      category: "Automação com IA",
      title: "Triagem inteligente de demandas",
      description: `Classificação e priorização automática de relatos recebidos pela ${c}, com IA identificando tema, urgência e próximo passo.`,
      metric: "Atendimento mais rápido com menos esforço manual",
    },
    {
      category: "MicroSaaS",
      title: "Base de conhecimento assistida",
      description: `Portal para a ${c} consultar legislação, precedentes e respostas padronizadas com busca semântica.`,
      metric: "Respostas consistentes em escala",
    },
    {
      category: "IA generativa",
      title: "Assistente de orientação",
      description: `Chatbot com IA que orienta usuários com linguagem clara e encaminha casos complexos para especialistas da ${c}.`,
      metric: "Mais alcance sem aumentar fila humana",
    },
  ],
  educacao: (c) => [
    {
      category: "Automação com IA",
      title: "Funil de matrículas com IA",
      description: `Captação, qualificação e follow-up de leads educacionais para a ${c}, com respostas automáticas e scoring de intenção.`,
      metric: "Mais matrículas com menos trabalho manual",
    },
    {
      category: "MicroSaaS",
      title: "Painel pedagógico e operacional",
      description: `Dashboard para a ${c} unificar indicadores de evasão, turmas, metas e tarefas entre equipes.`,
      metric: "Decisão baseada em dados em tempo real",
    },
    {
      category: "IA generativa",
      title: "Conteúdo educacional em escala",
      description: `Geração assistida de materiais e comunicados para a ${c} personalizados por perfil de aluno.`,
      metric: "Mais comunicação com o mesmo time",
    },
  ],
  comunicacao: (c) => [
    {
      category: "Automação com IA",
      title: "Operação de jobs e briefings",
      description: `Fluxos para a ${c} receber briefings, aprovar pautas e distribuir tarefas com resumos gerados por IA.`,
      metric: "Menos retrabalho na operação diária",
    },
    {
      category: "MicroSaaS",
      title: "Painel de campanhas e clientes",
      description: `Produto digital para a ${c} acompanhar entregas, status e métricas por conta em um só lugar.`,
      metric: "Visibilidade ponta a ponta",
    },
    {
      category: "IA generativa",
      title: "Content Factory",
      description: `Pautas, roteiros e adaptações multicanal com IA para a ${c} aumentar volume sem expandir equipe.`,
      metric: "Mais entregas no mesmo prazo",
    },
  ],
  tecnologia: (c) => [
    {
      category: "MicroSaaS",
      title: "Produto digital complementar",
      description: `Módulo ou painel para a ${c} estender a oferta atual com assinatura, métricas de uso e onboarding automatizado.`,
      metric: "Nova linha de receita recorrente",
    },
    {
      category: "Automação com IA",
      title: "Suporte e onboarding com IA",
      description: `Agentes para a ${c} responder dúvidas técnicas, triar tickets e guiar usuários no produto.`,
      metric: "Menor carga no time de suporte",
    },
    {
      category: "Software sob medida",
      title: "Integrações e APIs sob medida",
      description: `Conectores e fluxos personalizados para a ${c} integrar sistemas legados e parceiros com confiabilidade.`,
      metric: "Operação conectada ponta a ponta",
    },
  ],
  saude: (c) => [
    {
      category: "Automação com IA",
      title: "Agendamento e triagem com IA",
      description: `Fluxos para a ${c} qualificar demandas, agendar consultas e reduzir no-show com lembretes inteligentes.`,
      metric: "Agenda mais cheia e organizada",
    },
    {
      category: "MicroSaaS",
      title: "Painel clínico-operacional",
      description: `Dashboard para a ${c} acompanhar filas, indicadores e satisfação em tempo real.`,
      metric: "Gestão baseada em dados",
    },
    {
      category: "IA generativa",
      title: "Comunicação com pacientes",
      description: `Mensagens e orientações personalizadas para a ${c} manter engajamento entre consultas.`,
      metric: "Melhor experiência do paciente",
    },
  ],
  varejo: (c) => [
    {
      category: "Automação com IA",
      title: "Funil de vendas e recuperação",
      description: `Automação para a ${c} captar, qualificar e reativar leads com IA em WhatsApp, e-mail e site.`,
      metric: "Mais conversão com menos esforço manual",
    },
    {
      category: "MicroSaaS",
      title: "Painel de estoque e pedidos",
      description: `Visão unificada para a ${c} de pedidos, estoque e indicadores comerciais.`,
      metric: "Operação previsível",
    },
    {
      category: "IA generativa",
      title: "Conteúdo para e-commerce",
      description: `Descrições, campanhas e variações de anúncios com IA para a ${c} escalar catálogo digital.`,
      metric: "Mais produtos publicados por semana",
    },
  ],
  cultura: (c) => [
    {
      category: "MicroSaaS",
      title: "Gestão de programas e editais",
      description: `Plataforma para a ${c} administrar inscrições, avaliações e cronogramas de projetos culturais.`,
      metric: "Menos planilhas e mais controle",
    },
    {
      category: "IA generativa",
      title: "Produção de conteúdo cultural",
      description: `Apoio de IA para a ${c} gerar textos, releases e materiais de divulgação de ações culturais.`,
      metric: "Mais campanhas no ar",
    },
    {
      category: "Automação com IA",
      title: "Atendimento ao público",
      description: `Chatbot e fluxos para a ${c} orientar visitantes e participantes sobre programação e inscrições.`,
      metric: "Resposta imediata ao público",
    },
  ],
};

const genericTemplates = (c: string): ImplementationIdea[] => [
  {
    category: "Automação com IA",
    title: "Processos e atendimento com IA",
    description: `Automação de fluxos repetitivos e triagem de demandas para a ${c}, liberando o time para o estratégico.`,
    metric: "Ganho de produtividade operacional",
  },
  {
    category: "MicroSaaS",
    title: "Produto digital sob medida",
    description: `Plataforma para a ${c} centralizar operação, indicadores e experiência do cliente.`,
    metric: "Operação escalável em um só sistema",
  },
  {
    category: "IA generativa",
    title: "Copiloto de conteúdo e análise",
    description: `IA aplicada aos dados e comunicação da ${c} para acelerar decisões e produção de materiais.`,
    metric: "Resultados mais rápidos com IA",
  },
];

export const getSegmentImplementationIdeas = (
  segmentSlug: string | undefined,
  companyName: string,
): ImplementationIdea[] => {
  const slug = segmentSlug?.toLowerCase() ?? "";
  const factory = segmentTemplates[slug];
  return factory ? factory(companyName) : genericTemplates(companyName);
};

export const countValidSolutionCases = (
  cases: Array<{ title: string }> | undefined,
): number =>
  (cases ?? []).filter((item) => item.title.length >= 8 && !item.title.includes("![")).length;

export const mergeImplementationIdeas = (
  ideas: ImplementationIdea[],
  segmentSlug: string | undefined,
  companyName: string,
  minCount = 3,
): ImplementationIdea[] => {
  const seen = new Set(ideas.map((item) => item.title.toLowerCase()));
  const merged = [...ideas];

  for (const fallback of getSegmentImplementationIdeas(segmentSlug, companyName)) {
    if (merged.length >= minCount) break;
    const key = fallback.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(fallback);
  }

  return merged.slice(0, 4);
};
