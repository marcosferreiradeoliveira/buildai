import { baseLandingContent, getSegmentLandingContent } from "@/content/landing";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { LeadPageConfig, LeadSolutionCase } from "@/types/lead";
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

/** Soluções BuildAI exibidas na LP — independentes do nome do case no site do lead. */
const IMPLEMENTATION_SOLUTIONS: ReadonlyArray<{
  category: string;
  title: string;
  description: (company: string) => string;
  metric: string;
}> = [
  {
    category: "Automação com IA",
    title: "Funil e atendimento com IA",
    description: (company) =>
      `Captação, qualificação e roteamento de demandas para a ${company}, com IA resumindo briefings e priorizando oportunidades.`,
    metric: "Menos trabalho manual no comercial e no atendimento",
  },
  {
    category: "MicroSaaS",
    title: "Painel de campanhas e entregas",
    description: (company) =>
      `Produto digital para a ${company} acompanhar jobs, aprovações, métricas e histórico por cliente em um só lugar.`,
    metric: "Visibilidade e previsibilidade operacional",
  },
  {
    category: "IA generativa",
    title: "Content Factory",
    description: (company) =>
      `Pautas, roteiros, posts e adaptações multicanal com IA para a ${company} escalar volume sem multiplicar equipe.`,
    metric: "Mais conteúdo publicado com o mesmo time",
  },
  {
    category: "Software sob medida",
    title: "Hub de assets e brand kit",
    description: (company) =>
      `Repositório com busca inteligente, versionamento e geração de peças on-brand para a ${company} e contas atendidas.`,
    metric: "Menos retrabalho e mais consistência de marca",
  },
];

const mapLeadCaseToImplementationIdea = (index: number, companyName: string): ProjectItem => {
  const template = IMPLEMENTATION_SOLUTIONS[index % IMPLEMENTATION_SOLUTIONS.length];

  return {
    title: template.title,
    category: template.category,
    description: template.description(companyName),
    metric: template.metric,
  };
};

const getDefaultImplementationIdeas = (lead: LeadPageConfig): ProjectItem[] =>
  IMPLEMENTATION_SOLUTIONS.slice(0, 3).map((template, index) =>
    mapLeadCaseToImplementationIdea(index, lead.companyName),
  );

const buildImplementationIdeas = (lead: LeadPageConfig): ProjectItem[] => {
  const validCaseCount = (lead.solutionCases ?? []).filter(
    (item) => item.title.length >= 12 && !item.title.includes("!["),
  ).length;

  if (validCaseCount >= 2) {
    return Array.from({ length: Math.min(validCaseCount, 4) }, (_, index) =>
      mapLeadCaseToImplementationIdea(index, lead.companyName),
    );
  }

  if (validCaseCount === 1) {
    return [
      mapLeadCaseToImplementationIdea(0, lead.companyName),
      ...getDefaultImplementationIdeas(lead).slice(1, 3),
    ];
  }

  return getDefaultImplementationIdeas(lead);
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
    { label: "Serviços", href: "#servicos" },
    { label: "Processo", href: "#build-in-public" },
    { label: "Tecnologias", href: "#tech-stack" },
    { label: "Implementações", href: "#implementacoes" },
    { label: "Portfólio", href: "#portfolio" },
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

  content.services.description = `A BuildAI recomenda para a ${lead.companyName}${cityLabel} soluções de IA e automação alinhadas às metas do negócio.`;

  content.implementationIdeas = {
    eyebrow: "Ideias de implementação",
    title: "O que podemos implementar em",
    highlightedText: lead.companyName,
    description: `Soluções de automação, MicroSaaS e IA que a BuildAI pode implementar para a ${lead.companyName}:`,
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
