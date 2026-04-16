import { baseLandingContent, getSegmentLandingContent } from "@/content/landing";
import { LeadPageConfig } from "@/types/lead";
import { LandingContent } from "@/types/landing";

const STORAGE_KEY = "buildai.lead-pages";

const parseStoredLeads = (value: string | null): LeadPageConfig[] => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as LeadPageConfig[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getLeadPages = (): LeadPageConfig[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return parseStoredLeads(raw);
};

export const getLeadPageBySlug = (slug: string): LeadPageConfig | undefined =>
  getLeadPages().find((lead) => lead.slug === slug);

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

export const saveLeadPage = (lead: Omit<LeadPageConfig, "id" | "createdAt">): LeadPageConfig => {
  if (typeof window === "undefined") {
    throw new Error("saveLeadPage só pode ser usado no navegador.");
  }

  const leads = getLeadPages();
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
