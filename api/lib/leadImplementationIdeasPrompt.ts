import { countValidSolutionCases } from "./leadSegmentSolutions.js";

export type ImplementationIdeasPromptContext = {
  companyName: string;
  segmentSlug?: string;
  primaryGoal?: string;
  websiteUrl: string;
  solutionCases?: Array<{ title: string; description: string }>;
  pageText?: string;
};

const stripHtmlToText = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const buildImplementationIdeasUserPrompt = (
  ctx: ImplementationIdeasPromptContext,
): string => {
  const hasCases = countValidSolutionCases(ctx.solutionCases) > 0;
  const casesBlock =
    hasCases ?
      ctx.solutionCases!
        .slice(0, 8)
        .map((item, index) => `${index + 1}. ${item.title} — ${item.description.slice(0, 200)}`)
        .join("\n")
    : "Nenhum case ou projeto estruturado foi encontrado no site.";

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

export const buildImplementationIdeasSystemPrompt = (
  ctx: ImplementationIdeasPromptContext,
): string => {
  const hasCases = countValidSolutionCases(ctx.solutionCases) > 0;

  if (hasCases) {
    return `Você é consultor da BuildAI (IA, automação, MicroSaaS, software sob medida).
Com base no contexto REAL do site e cases do cliente, gere implementationIdeas: exatamente 3 ou 4 propostas de O QUE A BUILDAI PODE IMPLEMENTAR para este cliente.

Regras:
- Use informações concretas do site (serviços, campanhas, projetos, clientes atendidos, tipo de operação).
- Cada proposta deve conectar com uma frente de trabalho identificável (case, serviço, linha de atuação).
- NÃO seja genérico sem contexto.
- NÃO apenas descreva o case do cliente — proponha produto/automação que a BuildAI entregaria.
- Varie categorias quando fizer sentido: "Automação com IA", "MicroSaaS", "IA generativa", "Software sob medida".
- title: nome curto e específico (8-80 chars)
- description: 2 frases (40-320 chars)
- metric: benefício mensurável (8-120 chars)

Responda APENAS JSON: { "implementationIdeas": [ { "category", "title", "description", "metric" }, ... ] }`;
  }

  return `Você é consultor da BuildAI (IA, automação, MicroSaaS, software sob medida).
O site do cliente NÃO trouxe cases ou projetos estruturados. Gere implementationIdeas: exatamente 3 ou 4 propostas de O QUE A BUILDAI PODE IMPLEMENTAR.

Regras:
- Baseie-se no segmento, missão, serviços e texto do site — propostas devem fazer sentido para o tipo de negócio, mesmo sem cases nomeados.
- Pode ser mais genérico que um case específico, mas SEMPRE aplicado ao segmento e ao contexto da empresa (ex: ESG → painel de indicadores, coleta de dados, relatórios; educação → matrículas, painel pedagógico).
- NÃO invente cases ou clientes que não aparecem no site.
- Proponha produto/automação que a BuildAI entregaria — não apenas descreva o que a empresa já faz.
- Varie categorias: "Automação com IA", "MicroSaaS", "IA generativa", "Software sob medida".
- title: nome claro e aplicável ao segmento (8-80 chars)
- description: 2 frases (40-320 chars) mencionando a empresa quando possível
- metric: benefício mensurável (8-120 chars)

Responda APENAS JSON: { "implementationIdeas": [ { "category", "title", "description", "metric" }, ... ] }`;
};
