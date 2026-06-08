export type ImplementationIdea = {
  title: string;
  category: string;
  description: string;
  metric: string;
};

export type ImplementationIdeasContext = {
  companyName: string;
  segmentSlug?: string;
  primaryGoal?: string;
  websiteUrl: string;
  solutionCases?: Array<{ title: string; description: string }>;
  pageText?: string;
};

const ALLOWED_CATEGORIES = [
  "Automação com IA",
  "MicroSaaS",
  "IA generativa",
  "Software sob medida",
] as const;

const MAX_SITE_CHARS = 10_000;

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

const normalizeCategory = (value: string | undefined): string => {
  const trimmed = value?.trim() ?? "";
  const match = ALLOWED_CATEGORIES.find((c) => c.toLowerCase() === trimmed.toLowerCase());
  return match ?? "Software sob medida";
};

const parseIdeas = (items: unknown): ImplementationIdea[] => {
  if (!Array.isArray(items)) return [];

  const parsed = items
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      return {
        title: typeof record.title === "string" ? record.title.trim() : "",
        category: normalizeCategory(
          typeof record.category === "string" ? record.category : undefined,
        ),
        description: typeof record.description === "string" ? record.description.trim() : "",
        metric: typeof record.metric === "string" ? record.metric.trim() : "",
      };
    })
    .filter(
      (item): item is ImplementationIdea =>
        !!item &&
        item.title.length >= 8 &&
        item.description.length >= 40 &&
        item.metric.length >= 8,
    );

  const seen = new Set<string>();
  const unique: ImplementationIdea[] = [];
  for (const item of parsed) {
    const key = item.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length >= 4) break;
  }

  return unique;
};

const SYSTEM_PROMPT = `Você é consultor da BuildAI (IA, automação, MicroSaaS, software sob medida).
Com base no contexto REAL do site e cases do cliente, gere implementationIdeas: exatamente 3 ou 4 propostas de O QUE A BUILDAI PODE IMPLEMENTAR para este cliente.

Regras:
- Use informações concretas do site (serviços, campanhas, projetos, clientes atendidos, tipo de operação).
- Cada proposta deve conectar com um frente de trabalho identificável (case, serviço, linha de atuação).
- NÃO seja genérico ("centralizar operação", "copiloto de conteúdo" sem contexto).
- NÃO apenas descreva o case do cliente — proponha produto/automação que a BuildAI entregaria.
- Varie categorias quando fizer sentido: "Automação com IA", "MicroSaaS", "IA generativa", "Software sob medida".
- Para agência/comunicação: aprovação de jobs, hub de assets, content factory para campanhas, portal do cliente.
- title: nome curto e específico (8-80 chars)
- description: 2 frases (40-320 chars)
- metric: benefício mensurável (8-120 chars)

Responda APENAS JSON: { "implementationIdeas": [ { "category", "title", "description", "metric" }, ... ] }`;

export type GenerateIdeasResult =
  | { ok: true; ideas: ImplementationIdea[] }
  | { ok: false; reason: "no_api_key" | "openai_error" | "empty" | "parse_error"; detail?: string };

export const generateImplementationIdeasServer = async (
  ctx: ImplementationIdeasContext,
): Promise<GenerateIdeasResult> => {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, reason: "no_api_key" };
  }

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

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 200);
    return { ok: false, reason: "openai_error", detail: `HTTP ${response.status}: ${detail}` };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return { ok: false, reason: "empty" };

  try {
    const parsed = JSON.parse(content) as { implementationIdeas?: unknown };
    const ideas = parseIdeas(parsed.implementationIdeas);
    if (!ideas.length) return { ok: false, reason: "parse_error", detail: content.slice(0, 200) };
    return { ok: true, ideas };
  } catch {
    return { ok: false, reason: "parse_error", detail: content.slice(0, 200) };
  }
};

export const fetchSiteHtml = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "BuildAI-LeadExtractor/1.0",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
};
