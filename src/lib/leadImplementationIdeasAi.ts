import type { LeadImplementationIdea, LeadSolutionCase, LeadWebsiteExtract } from "./leadWebsiteExtract";
import { getOpenAiApiKey, parseImplementationIdeas } from "./leadWebsiteExtractAi";

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

const buildPrompt = (ctx: ImplementationIdeasContext): string => {
  const casesBlock =
    ctx.solutionCases?.length ?
      ctx.solutionCases
        .slice(0, 8)
        .map((item, index) => `${index + 1}. ${item.title} — ${item.description.slice(0, 200)}`)
        .join("\n")
    : "Nenhum case estruturado (inferir do texto do site).";

  const siteExcerpt = ctx.pageText ? stripHtmlToText(ctx.pageText).slice(0, 10_000) : "";

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

const SYSTEM_PROMPT = `Você é consultor da BuildAI. Gere implementationIdeas: 3 ou 4 propostas do que a BuildAI pode IMPLEMENTAR para este cliente.
Use contexto REAL do site. Não seja genérico.
Responda APENAS JSON: { "implementationIdeas": [ { "category", "title", "description", "metric" }, ... ] }
Categorias: "Automação com IA", "MicroSaaS", "IA generativa", "Software sob medida".`;

export const generateImplementationIdeasWithAi = async (
  ctx: ImplementationIdeasContext,
): Promise<LeadImplementationIdea[]> => {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) return [];

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
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
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(ctx) },
      ],
    }),
  });

  if (!response.ok) return [];

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
