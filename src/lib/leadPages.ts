import { baseLandingContent, getSegmentLandingContent } from "@/content/landing";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { LeadImplementationIdea, LeadPageConfig } from "@/types/lead";
import { LandingContent, ProjectItem } from "@/types/landing";

const STORAGE_KEY = "buildai.lead-pages";

type LeadPageRow = {
  id: string;
  slug: string;
  segment_slug: string;
  company_name: string;
  city: string | null;
  primary_goal: string | null;
  website_url: string | null;
  solution_cases: LeadSolutionCase[] | null;
  implementation_ideas: LeadImplementationIdea[] | null;
  created_at: string;
};

const rowToLead = (row: LeadPageRow): LeadPageConfig => ({
  id: row.id,
  slug: row.slug,
  segmentSlug: row.segment_slug,
  companyName: row.company_name,
  city: row.city ?? undefined,
  primaryGoal: row.primary_goal ?? undefined,
  websiteUrl: row.website_url ?? undefined,
  solutionCases: Array.isArray(row.solution_cases) ? row.solution_cases : undefined,
  implementationIdeas: Array.isArray(row.implementation_ideas) ? row.implementation_ideas : undefined,
  createdAt: row.created_at,
});

const parseStoredLeads = (value: string | null): LeadPageConfig[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as LeadPageConfig[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getLeadPagesLocal = (): LeadPageConfig[] => {
  if (typeof window === "undefined") return [];
  return parseStoredLeads(window.localStorage.getItem(STORAGE_KEY));
};

const getLeadPageBySlugLocal = (slug: string): LeadPageConfig | undefined =>
  getLeadPagesLocal().find((lead) => lead.slug === slug);

const saveLeadPageLocal = (lead: Omit<LeadPageConfig, "id" | "createdAt">): LeadPageConfig => {
  if (typeof window === "undefined") {
    throw new Error("saveLeadPage só pode ser usado no navegador.");
  }

  const leads = getLeadPagesLocal();
  const sameSlugIndex = leads.findIndex((item) => item.slug === lead.slug);

  const persistedLead: LeadPageConfig = {
    id: sameSlugIndex >= 0 ? leads[sameSlugIndex].id : crypto.randomUUID(),
    createdAt: sameSlugIndex >= 0 ? leads[sameSlugIndex].createdAt : new Date().toISOString(),
    ...lead,
  };

  if (sameSlugIndex >= 0) {
    leads[sameSlugIndex] = persistedLead;
  } else {
    leads.unshift(persistedLead);
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  return persistedLead;
};

export const loadLeadPages = async (): Promise<LeadPageConfig[]> => {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("lead_pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ((data ?? []) as LeadPageRow[]).map(rowToLead);
  }

  return getLeadPagesLocal();
};

export const loadLeadPageBySlug = async (slug: string): Promise<LeadPageConfig | null> => {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.from("lead_pages").select("*").eq("slug", slug).maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return rowToLead(data as LeadPageRow);
  }

  return getLeadPageBySlugLocal(slug) ?? null;
};

export const saveLeadPage = async (
  lead: Omit<LeadPageConfig, "id" | "createdAt">,
): Promise<LeadPageConfig> => {
  const sb = getSupabase();
  if (sb) {
    const { data: existing, error: fetchError } = await sb
      .from("lead_pages")
      .select("*")
      .eq("slug", lead.slug)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const payload = {
      slug: lead.slug,
      segment_slug: lead.segmentSlug,
      company_name: lead.companyName,
      city: lead.city ?? null,
      primary_goal: lead.primaryGoal ?? null,
      website_url: lead.websiteUrl ?? null,
      solution_cases: lead.solutionCases?.length ? lead.solutionCases : null,
      implementation_ideas: lead.implementationIdeas?.length ? lead.implementationIdeas : null,
    };

    if (existing) {
      const { data, error } = await sb
        .from("lead_pages")
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", lead.slug)
        .select()
        .single();

      if (error) throw error;
      return rowToLead(data as LeadPageRow);
    }

    const { data, error } = await sb.from("lead_pages").insert(payload).select().single();

    if (error) throw error;
    return rowToLead(data as LeadPageRow);
  }

  return saveLeadPageLocal(lead);
};

const removeLeadPageLocal = (slug: string, id?: string) => {
  if (typeof window === "undefined") return;

  const leads = getLeadPagesLocal().filter(
    (item) => item.slug !== slug && (!id || item.id !== id),
  );
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
};

const deleteLeadPageViaServerApi = async (
  lead: Pick<LeadPageConfig, "slug" | "id">,
): Promise<"deleted" | "unavailable"> => {
  if (typeof window === "undefined") return "unavailable";

  const response = await fetch("/api/delete-lead-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug: lead.slug, id: lead.id }),
  });

  const payload = (await response.json().catch(() => ({}))) as { error?: string };

  if (response.status === 503) return "unavailable";

  if (!response.ok) {
    throw new Error(payload.error ?? `Falha ao apagar (HTTP ${response.status}).`);
  }

  return "deleted";
};

const deleteLeadPageWithAnonKey = async (lead: Pick<LeadPageConfig, "slug" | "id">): Promise<void> => {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase não configurado.");

  let query = sb.from("lead_pages").delete();
  if (lead.id) {
    query = query.eq("id", lead.id);
  } else {
    query = query.eq("slug", lead.slug.trim());
  }

  const { data, error } = await query.select("id");
  if (error) throw error;

  if (!data?.length) {
    throw new Error(
      "Sem permissão para apagar (anon). Adicione SUPABASE_SERVICE_ROLE_KEY na Vercel ou rode a migration lead_pages_delete_policy no Supabase.",
    );
  }
};

export const deleteLeadPage = async (lead: Pick<LeadPageConfig, "slug" | "id">): Promise<void> => {
  const normalizedSlug = lead.slug.trim();
  if (!normalizedSlug) throw new Error("Slug inválido.");

  if (isSupabaseConfigured()) {
    const viaApi = await deleteLeadPageViaServerApi(lead);
    if (viaApi === "deleted") {
      removeLeadPageLocal(normalizedSlug, lead.id);
      return;
    }

    await deleteLeadPageWithAnonKey(lead);
    removeLeadPageLocal(normalizedSlug, lead.id);
    return;
  }

  if (typeof window === "undefined") {
    throw new Error("deleteLeadPage só pode ser usado no navegador.");
  }

  removeLeadPageLocal(normalizedSlug, lead.id);
};

export { isSupabaseConfigured };

export const createLeadSlug = (segmentSlug: string, companyName: string): string => {
  const normalizedCompany = companyName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const normalizedSegment = segmentSlug
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${normalizedCompany || "empresa"}-${normalizedSegment || "segmento"}`;
};

const toProjectItems = (ideas: LeadImplementationIdea[]): ProjectItem[] =>
  ideas.map((item) => ({
    title: item.title,
    category: item.category,
    description: item.description,
    metric: item.metric,
  }));

/** Fallback por segmento quando IA não rodou ou lead antigo sem implementation_ideas. */
const buildSegmentImplementationFallback = (
  segmentSlug: string,
  company: string,
): LeadImplementationIdea[] => {
  const c = company;
  const bySegment: Record<string, LeadImplementationIdea[]> = {
    juridico: [
      {
        category: "Automação com IA",
        title: "Triagem inteligente de demandas",
        description: `Classificação e priorização automática de relatos recebidos pela ${c}, com IA identificando tema, urgência e próximo passo.`,
        metric: "Atendimento mais rápido com menos esforço manual",
      },
      {
        category: "MicroSaaS",
        title: "Base de conhecimento assistida",
        description: `Portal para a ${c} consultar legislação, precedentes e respostas padronizadas com busca semântica e atualização centralizada.`,
        metric: "Equipe alinhada e respostas consistentes",
      },
      {
        category: "IA generativa",
        title: "Assistente de orientação ao cidadão",
        description: `Chatbot com IA que orienta consumidores com linguagem clara, encaminhando casos complexos para especialistas da ${c}.`,
        metric: "Mais alcance sem aumentar fila humana",
      },
    ],
    educacao: [
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
        description: `Geração assistida de materiais, comunicados e campanhas para a ${c} personalizados por segmento de aluno.`,
        metric: "Mais comunicação com o mesmo time",
      },
    ],
    comunicacao: [
      {
        category: "Automação com IA",
        title: "Operação de jobs e briefings",
        description: `Fluxos para a ${c} receber briefings, aprovar pautas e distribuir tarefas entre equipes com resumos gerados por IA.`,
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
        description: `Pautas, roteiros e adaptações multicanal com IA para a ${c} aumentar volume de peças sem expandir headcount.`,
        metric: "Mais entregas no mesmo prazo",
      },
    ],
  };

  const generic: LeadImplementationIdea[] = [
    {
      category: "Automação com IA",
      title: "Processos e atendimento com IA",
      description: `Automação de fluxos repetitivos e triagem de demandas para a ${c}, liberando o time para o estratégico.`,
      metric: "Ganho de produtividade operacional",
    },
    {
      category: "MicroSaaS",
      title: "Produto digital sob medida",
      description: `Plataforma exclusiva para a ${c} centralizar operação, indicadores e experiência do cliente/usuário.`,
      metric: "Operação escalável em um só sistema",
    },
    {
      category: "IA generativa",
      title: "Copiloto de conteúdo e análise",
      description: `IA aplicada aos dados e comunicação da ${c} para acelerar decisões e produção de materiais.`,
      metric: "Resultados mais rápidos com IA",
    },
  ];

  return bySegment[segmentSlug] ?? generic;
};

const buildImplementationIdeas = (lead: LeadPageConfig): ProjectItem[] => {
  if (lead.implementationIdeas?.length) {
    return toProjectItems(lead.implementationIdeas.slice(0, 4));
  }

  return toProjectItems(buildSegmentImplementationFallback(lead.segmentSlug, lead.companyName));
};

export const buildLandingContentFromLead = (lead: LeadPageConfig): LandingContent => {
  const segmentTemplate = getSegmentLandingContent(lead.segmentSlug) ?? baseLandingContent;
  const content: LandingContent = JSON.parse(JSON.stringify(segmentTemplate));
  const buildai = baseLandingContent;

  const segmentName = lead.segmentSlug.charAt(0).toUpperCase() + lead.segmentSlug.slice(1);
  const cityLabel = lead.city ? ` em ${lead.city}` : "";
  const cleanGoalForLabels =
    lead.primaryGoal?.trim() && !/!\[|blob:/i.test(lead.primaryGoal)
      ? lead.primaryGoal.trim()
      : "";
  const objectiveLabel = cleanGoalForLabels ? ` com foco em ${cleanGoalForLabels}` : "";

  content.prospectCompanyName = lead.companyName;

  content.seo.title = `BuildAI para ${lead.companyName} | MicroSaaS e IA`;
  content.seo.description = `Proposta da BuildAI para ${lead.companyName}${cityLabel}: soluções de IA e automação para ${segmentName}${objectiveLabel}.`;
  content.seo.previewImageSrc = buildai.seo.previewImageSrc;
  content.seo.faviconHref = buildai.seo.faviconHref;

  content.navbar.brandName = buildai.navbar.brandName;
  content.navbar.navLinks = [
    { label: "Implementações", href: "#implementacoes" },
    { label: "Portfólio", href: "#portfolio" },
    { label: "Serviços", href: "#servicos" },
    { label: "Processo", href: "#build-in-public" },
    { label: "Tecnologias", href: "#tech-stack" },
    { label: "Contato", href: "#contato" },
  ];
  content.navbar.ctaLabel = "Agendar consultoria";

  content.hero.badge = `Proposta BuildAI para ${lead.companyName}`;
  content.hero.title = `Construímos o futuro da ${lead.companyName} com`;
  const cleanGoal = lead.primaryGoal?.trim();
  const goalSuffix =
    cleanGoal && cleanGoal.length >= 30 && !/!\[|blob:/i.test(cleanGoal)
      ? ` com foco em ${cleanGoal}`
      : "";

  content.hero.description = `A BuildAI preparou um plano sob medida para a ${lead.companyName}${cityLabel}, com IA e automação para acelerar resultados${goalSuffix}.`;
  content.hero.primaryCtaLabel = "Falar com a BuildAI →";
  content.hero.secondaryCtaLabel = "Ver implementações";

  content.services.description = `A BuildAI recomenda para a ${lead.companyName}${cityLabel} soluções de IA e automação alinhadas às metas do negócio.`;

  content.implementationIdeas = {
    eyebrow: "Ideias de implementação",
    title: "O que podemos implementar em",
    highlightedText: lead.companyName,
    description: `Propostas de automação, MicroSaaS e IA sob medida para a ${lead.companyName}, com base no contexto do negócio:`,
    items: buildImplementationIdeas(lead),
  };

  content.portfolio = {
    ...buildai.portfolio,
    eyebrow: "Portfólio BuildAI",
    title: "Confira nosso",
    highlightedText: "portfólio",
    description: "Cases reais que a BuildAI já entregou em automação, MicroSaaS e software sob medida.",
    backgroundImageSrc: undefined,
  };

  content.contact.title = "Pronto para transformar a";
  content.contact.highlightedText = lead.companyName;
  content.contact.description = `Converse com a BuildAI e veja como aplicar IA e automação na ${lead.companyName}${objectiveLabel}.`;
  content.contact.submitLabel = "Quero conversar com a BuildAI";
  content.contact.copyrightName = buildai.contact.copyrightName;

  return content;
};
