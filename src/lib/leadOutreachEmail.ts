import { sanitizeCompanyName } from "./leadWebsiteExtract";
import { resolveImplementationIdeas } from "./leadSegmentSolutions";
import type { LeadImplementationIdea, LeadSolutionCase } from "@/types/lead";

export type OutreachEmailInput = {
  companyName: string;
  contactName?: string;
  segmentSlug?: string;
  primaryGoal?: string;
  implementationIdeas?: LeadImplementationIdea[];
  solutionCases?: LeadSolutionCase[];
  landingUrl?: string;
  newsHighlight?: string;
};

export type OutreachEmail = {
  subject: string;
  body: string;
};

export const OUTREACH_CALENDLY_URL = "https://calendly.com/buildaidev/30min";

const DIVIDER = "──────────────";

const formatIdeasList = (ideas: LeadImplementationIdea[]): string =>
  ideas
    .slice(0, 3)
    .map((item) => `• ${item.title} (${item.category}) — ${item.description}`)
    .join("\n");

const genericIdeasBlock = (company: string): string =>
  [
    `• Automação com IA — escala operacional para a ${company}`,
    `• MicroSaaS sob medida — produto digital exclusivo`,
    `• Copiloto de análise — decisões mais rápidas com IA`,
  ].join("\n");

export const buildOutreachEmail = (input: OutreachEmailInput): OutreachEmail => {
  const company = sanitizeCompanyName(input.companyName) || "sua empresa";
  const contact = input.contactName?.trim();

  const ideas =
    input.implementationIdeas?.length ?
      input.implementationIdeas
    : resolveImplementationIdeas({
        solutionCases: input.solutionCases,
        segmentSlug: input.segmentSlug,
        companyName: company,
        primaryGoal: input.primaryGoal,
      });

  const greeting = contact ? `Olá, ${contact},` : `Olá, equipe ${company},`;

  const landingLead = input.landingUrl
    ? `Preparamos um diagnóstico gratuito de uso de IA para a ${company} — com implementações sugeridas para o caso de vocês:\n\n${input.landingUrl}`
    : `Mapeamos um diagnóstico gratuito de uso de IA para a ${company}.`;

  const newsBlock = input.newsHighlight?.trim() ? `\n\n${input.newsHighlight.trim()}` : "";

  const ideasBlock = ideas.length ? formatIdeasList(ideas) : genericIdeasBlock(company);

  const body = `${greeting}

${landingLead}${newsBlock}

Ideias principais:
${ideasBlock}

${DIVIDER}
Próximo passo: conversa de 30 min para priorizar (sem compromisso)
Agendar: ${OUTREACH_CALENDLY_URL}

Abraço,
Equipe BuildAI`;

  return {
    subject: `Diagnóstico gratuito de IA — ${company}`,
    body: body.replace(/\n{3,}/g, "\n\n").trim(),
  };
};

export const buildMailtoUrl = (to: string | undefined, subject: string, body: string): string => {
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  const address = to?.trim() ?? "";
  return address ? `mailto:${address}?${params.toString()}` : `mailto:?${params.toString()}`;
};
