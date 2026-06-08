import type { LeadImplementationIdea, LeadSolutionCase, LeadWebsiteExtract } from "./leadWebsiteExtract";
import { getOpenAiApiKey, parseImplementationIdeas } from "./leadWebsiteExtractAi";

const MAX_SITE_CHARS = 10_000;

export type ImplementationIdeasContext = {
  companyName: string;
  segmentSlug?: string;
  primaryGoal?: string;
  websiteUrl: string;
  solutionCases?: LeadSolutionCase[];
  pageText?: string;
};

const stripHtmlToText = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const buildImplementationIdeasPrompt = (ctx: ImplementationIdeasContext): string => {
  const casesBlock =
    ctx.solutionCases?.length ?
      ctx.solutionCases
        .slice(0, 8)
        .map((item, index) => `${index + 1}. ${item.title} — ${item.description.slice(0, 200)}`)
        .join("\n")
    : "Nenhum case estruturado (inferir do texto do site).";

  const siteExcerpt = ctx.pageText ? stripHtmlToText(ctx.pageText).slice(0, MAX_SITE_CHARS) : "";

  return [
    `Empresa: ${ctx.companyName}`,
    `Segmento: ${ctx.segmentSlug ?? "não informado"}`,
    `Site: ${ctx.websiteUrl}`,
    `Missão/contexto: ${ctx.primaryGoal ?? "não informado"}`,
    "",
    "Cases, projetos, campanhas ou frentes identificadas no site:",
    casesBlock,
    "",
    siteExcerpt ? `Trecho do site:\n${siteExcerpt}` : "",
  ]
    .filter(Boolean)
    .join("\n");
};

const IMPLEMENTATION_SYSTEM_PROMPT = `Você é consultor da BuildAI (IA, automação, MicroSaaS, software sob medida).
Com base no contexto REAL do site e cases do cliente, gere implementationIdeas: exatamente 3 ou 4 propostas de O QUE A BUILDAI PODE IMPLEMENTAR para este cliente.

Regras:
- Use informações concretas do site (serviços, campanhas, projetos, clientes atendidos, tipo de operação).
- Cada proposta deve conectar com um frente de trabalho identificável (case, serviço, linha de atuação).
- NÃO seja genérico ("centralizar operação", "copiloto de conteúdo" sem contexto).
- NÃO apenas descreva o case do cliente — proponha produto/automação que a BuildAI entregaria.
- Varie categorias quando fizer sentido: "Automação com IA", "MicroSaaS", "IA generativa", "Software sob medida".
- Para agência/comunicação: pense em aprovação de jobs, hub de assets, content factory para campanhas específicas, portal do cliente, monitoramento de entregas.
- Para instituto/jurídico: triagem, base de conhecimento, chatbot orientação.
- title: nome curto e específico da solução (8-80 chars)
- description: 2 frases com o que a BuildAI implementa para ESTE cliente (40-320 chars)
- metric: benefício mensurável (8-120 chars)

Responda APENAS JSON: { "implementationIdeas": [ { "category", "title", "description", "metric" }, ... ] }`;

export const generateImplementationIdeasWithAi = async (
  ctx: ImplementationIdeasContext,
): Promise<LeadImplementationIdea[]> => {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) return [];

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const userContent = buildImplementationIdeasPrompt(ctx);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.45,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: IMPLEMENTATION_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!response.ok) {
    console.error("OpenAI implementation ideas failed:", response.status);
    return [];
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return [];

  try {
    const parsed = JSON.parse(content) as { implementationIdeas?: unknown };
    return parseImplementationIdeas(
      parsed.implementationIdeas as Parameters<typeof parseImplementationIdeas>[0],
    );
  } catch {
    return [];
  }
};

export const enrichExtractWithImplementationIdeas = async (
  extract: LeadWebsiteExtract,
  pageText?: string,
): Promise<LeadWebsiteExtract> => {
  if (extract.implementationIdeas?.length >= 3) return extract;

  const ideas = await generateImplementationIdeasWithAi({
    companyName: extract.companyName ?? "Cliente",
    segmentSlug: extract.segmentSlug,
    primaryGoal: extract.primaryGoal,
    websiteUrl: extract.websiteUrl,
    solutionCases: extract.solutionCases,
    pageText,
  });

  if (!ideas.length) return extract;

  return { ...extract, implementationIdeas: ideas };
};

export const extractToImplementationContext = (
  extract: LeadWebsiteExtract,
  pageText?: string,
): ImplementationIdeasContext => ({
  companyName: extract.companyName ?? "Cliente",
  segmentSlug: extract.segmentSlug,
  primaryGoal: extract.primaryGoal,
  websiteUrl: extract.websiteUrl,
  solutionCases: extract.solutionCases,
  pageText,
});
