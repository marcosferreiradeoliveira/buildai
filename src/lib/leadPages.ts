import { baseLandingContent, getSegmentLandingContent } from "@/content/landing";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { LeadPageConfig } from "@/types/lead";
import { LandingContent } from "@/types/landing";

const STORAGE_KEY = "buildai.lead-pages";

type LeadPageRow = {
  id: string;
  slug: string;
  segment_slug: string;
  company_name: string;
  city: string | null;
  primary_goal: string | null;
  created_at: string;
};

const rowToLead = (row: LeadPageRow): LeadPageConfig => ({
  id: row.id,
  slug: row.slug,
  segmentSlug: row.segment_slug,
  companyName: row.company_name,
  city: row.city ?? undefined,
  primaryGoal: row.primary_goal ?? undefined,
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

export const buildLandingContentFromLead = (lead: LeadPageConfig): LandingContent => {
  const segmentTemplate = getSegmentLandingContent(lead.segmentSlug) ?? baseLandingContent;
  const content: LandingContent = JSON.parse(JSON.stringify(segmentTemplate));

  const segmentName = lead.segmentSlug.charAt(0).toUpperCase() + lead.segmentSlug.slice(1);
  const cityLabel = lead.city ? ` em ${lead.city}` : "";
  const objectiveLabel = lead.primaryGoal?.trim()
    ? ` com foco em ${lead.primaryGoal.trim()}`
    : "";

  content.seo.title = `${lead.companyName} | Soluções de IA para ${segmentName}`;
  content.seo.description = `${lead.companyName}${cityLabel}: landing personalizada para ${segmentName}${objectiveLabel}.`;

  content.navbar.brandName = lead.companyName;
  content.navbar.ctaLabel = `Agendar com ${lead.companyName}`;

  content.hero.badge = `${lead.companyName}${cityLabel}`;
  content.hero.description = `Criamos um plano personalizado para ${lead.companyName}${cityLabel}, usando IA e automação para acelerar resultados${objectiveLabel}.`;
  content.hero.primaryCtaLabel = `Quero um plano para ${lead.companyName} →`;

  content.services.description = `Soluções recomendadas para ${lead.companyName}${cityLabel}, considerando metas de negócio e maturidade digital.`;

  content.portfolio.eyebrow = `Ideias para ${lead.companyName}`;
  content.portfolio.title = "Possíveis iniciativas para";
  content.portfolio.highlightedText = lead.companyName;

  content.contact.title = `Pronto para evoluir a`;
  content.contact.highlightedText = `operação da ${lead.companyName}`;
  content.contact.description = `Fale com nosso time para desenhar um roadmap de implementação para ${lead.companyName}${objectiveLabel}.`;
  content.contact.submitLabel = `Quero esse plano para ${lead.companyName}`;
  content.contact.copyrightName = lead.companyName;

  return content;
};
