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

const DEFAULT_NEWS = `Na BuildAI, seguimos ampliando entregas em MicroSaaS, automação com IA e software sob medida — ajudando empresas a reduzir retrabalho operacional e abrir novas linhas de receita com produtos digitais.`;

const formatIdeasList = (ideas: LeadImplementationIdea[]): string =>
  ideas
    .slice(0, 4)
    .map(
      (item, index) =>
        `${index + 1}. ${item.title} (${item.category})\n   ${item.description}\n   → ${item.metric}`,
    )
    .join("\n\n");

const genericIdeasBlock = (company: string): string =>
  [
    `1. Automação de processos com IA\n   Fluxos inteligentes para a ${company} ganhar escala sem aumentar headcount.`,
    `2. MicroSaaS sob medida\n   Produto digital exclusivo para centralizar operação e indicadores.`,
    `3. Copiloto de conteúdo e análise\n   IA aplicada aos dados e comunicação para acelerar decisões.`,
  ].join("\n\n");

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
  const news = input.newsHighlight?.trim() || DEFAULT_NEWS;

  const contextLine =
    input.primaryGoal?.trim() ?
      `Considerando o contexto de vocês — ${input.primaryGoal.trim()} — mapeamos oportunidades práticas de IA para o negócio.\n`
    : `Com base no perfil da ${company}, mapeamos oportunidades práticas de IA para o negócio.\n`;

  const ideasBlock = ideas.length ? formatIdeasList(ideas) : genericIdeasBlock(company);

  const landingBlock =
    input.landingUrl ?
      `\nTambém preparei uma visão dedicada para a ${company} (implementações, portfólio e próximos passos):\n${input.landingUrl}\n`
    : "";

  const body = `${greeting}

${news}

${contextLine}
Com base no que entendemos sobre a ${company}, estas são implementações que podemos construir juntos:

${ideasBlock}
${landingBlock}
Gostaria de oferecer um diagnóstico gratuito (30–45 min) para priorizar essas frentes com o time de vocês — sem compromisso.

Podemos agendar? Responda este e-mail ou sugira um horário que funcione.

Abraço,
Equipe BuildAI
MicroSaaS · Automação · IA sob medida`;

  return {
    subject: `BuildAI × ${company} — implementações de IA + diagnóstico gratuito`,
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
