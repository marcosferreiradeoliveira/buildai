import { baseLandingContent, getSegmentLandingContent } from "@/content/landing";
import { resolveImplementationIdeas } from "@/lib/leadSegmentSolutions";
import {
  isInvalidCity,
  looksLikeScrapedMarketingCopy,
  sanitizeCompanyName,
  summarizePrimaryGoal,
} from "@/lib/leadWebsiteExtract";
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

  const raw = await response.text();
  let payload: { error?: string } = {};
  if (raw) {
    try {
      payload = JSON.parse(raw) as { error?: string };
    } catch {
      payload = { error: raw.slice(0, 180) };
    }
  }

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

/** Frase completa para o hero — sem reticências nem corte no meio. */
const toHeroGoalLine = (goal: string | undefined): string | null => {
  if (!goal?.trim() || /!\[|blob:/i.test(goal)) return null;

  const clean = goal.trim().replace(/…+/g, "").trim();
  const sentences = clean.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [];

  if (sentences.length > 0) {
    const first = sentences[0];
    return first.length >= 20 ? first : null;
  }

  if (/[.!?]$/.test(clean) && clean.length >= 20) return clean;

  return null;
};

export const buildLeadHeroDescription = (
  companyName: string,
  city: string | undefined,
  primaryGoal: string | undefined,
): string => {
  const cityLabel = city && !isInvalidCity(city) ? ` em ${city}` : "";
  const goal = toHeroGoalLine(primaryGoal);

  if (goal && !looksLikeScrapedMarketingCopy(goal)) {
    const pitch = summarizePrimaryGoal(goal, 140).replace(/\.$/, "");
    return `Identificamos oportunidades de IA e automação para a ${companyName}${cityLabel}, com foco em ${pitch.toLowerCase()}.`;
  }

  return `Diagnóstico gratuito com implementações de IA e automação sugeridas para a ${companyName}, sem compromisso.`;
};

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

const buildImplementationIdeas = (lead: LeadPageConfig): ProjectItem[] =>
  toProjectItems(
    resolveImplementationIdeas({
      implementationIdeas: lead.implementationIdeas,
      solutionCases: lead.solutionCases,
      segmentSlug: lead.segmentSlug,
      companyName: sanitizeCompanyName(lead.companyName),
      primaryGoal: lead.primaryGoal,
    }),
  );

export const buildLandingContentFromLead = (lead: LeadPageConfig): LandingContent => {
  const segmentTemplate = getSegmentLandingContent(lead.segmentSlug) ?? baseLandingContent;
  const content: LandingContent = JSON.parse(JSON.stringify(segmentTemplate));
  const buildai = baseLandingContent;
  const companyName = sanitizeCompanyName(lead.companyName);
  const safeCity = lead.city && !isInvalidCity(lead.city) ? lead.city : undefined;

  const cityLabel = safeCity ? ` em ${safeCity}` : "";
  const cleanGoalForLabels =
    lead.primaryGoal?.trim() && !/!\[|blob:/i.test(lead.primaryGoal)
      ? lead.primaryGoal.trim()
      : "";
  const objectiveLabel = cleanGoalForLabels ? ` com foco em ${cleanGoalForLabels}` : "";

  content.prospectCompanyName = companyName;

  content.seo.title = `Diagnóstico gratuito de IA — ${companyName} | BuildAI`;
  content.seo.description = `Diagnóstico gratuito de uso de IA da BuildAI para ${companyName}${cityLabel}: oportunidades de automação e software sob medida para o caso de vocês.`;
  content.seo.previewImageSrc = buildai.seo.previewImageSrc;
  content.seo.faviconHref = buildai.seo.faviconHref;

  content.navbar.brandName = buildai.navbar.brandName;
  content.navbar.logoSrc = buildai.navbar.logoSrc;
  content.navbar.navLinks = [
    { label: "Implementações", href: "#implementacoes" },
    { label: "Portfólio", href: "#portfolio" },
    { label: "Serviços", href: "#servicos" },
    { label: "Processo", href: "#build-in-public" },
    { label: "Tecnologias", href: "#tech-stack" },
    { label: "Contato", href: "#contato" },
  ];
  content.navbar.ctaLabel = "Agendar diagnóstico";

  content.hero.badge = "Diagnóstico gratuito de IA";
  content.hero.title = "Diagnóstico de uso de IA para";
  content.hero.highlightedText = companyName;
  content.hero.titleSuffix = undefined;

  content.hero.description = buildLeadHeroDescription(companyName, safeCity, lead.primaryGoal);
  content.hero.primaryCtaLabel = "Agendar diagnóstico →";
  content.hero.secondaryCtaLabel = "Ver implementações";

  content.services.description = `A BuildAI recomenda para a ${companyName}${cityLabel} soluções de IA e automação alinhadas às metas do negócio.`;

  content.implementationIdeas = {
    eyebrow: "Diagnóstico gratuito",
    title: "Oportunidades de IA para",
    highlightedText: companyName,
    description: `Implementações sugeridas pela BuildAI com base no contexto da ${companyName}:`,
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
  content.contact.highlightedText = companyName;
  content.contact.description = `Converse com a BuildAI e veja como aplicar IA e automação na ${companyName}${objectiveLabel}.`;
  content.contact.submitLabel = "Quero conversar com a BuildAI";
  content.contact.copyrightName = buildai.contact.copyrightName;

  return content;
};
