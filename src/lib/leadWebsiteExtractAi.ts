import {
  filterValidCases,
  isInvalidCity,
  isInvalidCompanyName,
  sanitizeCompanyName,
  summarizePrimaryGoal,
  type LeadImplementationIdea,
  type LeadSolutionCase,
  type LeadWebsiteExtract,
} from "./leadWebsiteExtract";

const ALLOWED_SEGMENTS = [
  "educacao",
  "saude",
  "varejo",
  "cultura",
  "tecnologia",
  "juridico",
  "comunicacao",
  "esg",
] as const;

const ALLOWED_CATEGORIES = [
  "Automação com IA",
  "MicroSaaS",
  "IA generativa",
  "Software sob medida",
] as const;

const MAX_INPUT_CHARS = 14_000;

const normalizeCompanyName = (
  aiName: string | undefined,
  fallback: LeadWebsiteExtract,
): string | undefined => {
  const trimmed = aiName?.trim();
  if (trimmed) {
    const cleaned = sanitizeCompanyName(trimmed);
    if (!isInvalidCompanyName(cleaned)) return cleaned;
  }
  if (fallback.companyName) {
    const cleaned = sanitizeCompanyName(fallback.companyName);
    if (!isInvalidCompanyName(cleaned)) return cleaned;
  }
  return undefined;
};

export type LeadAiExtractInput = {
  websiteUrl: string;
  pageText: string;
  fallback: LeadWebsiteExtract;
};

type AiLeadPayload = {
  companyName?: string;
  city?: string;
  primaryGoal?: string;
  segmentSlug?: string;
  solutionCases?: Array<{ title?: string; description?: string }>;
  implementationIdeas?: Array<{
    title?: string;
    category?: string;
    description?: string;
    metric?: string;
  }>;
};

const stripHtmlToText = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const buildPageTextForAi = (html: string, extract: LeadWebsiteExtract): string => {
  const plain = stripHtmlToText(html);
  const casesSummary = extract.solutionCases
    .slice(0, 6)
    .map((item, index) => `${index + 1}. ${item.title}`)
    .join("\n");

  const header = [
    `URL: ${extract.websiteUrl}`,
    extract.rawTitle ? `Título: ${extract.rawTitle}` : "",
    extract.rawDescription ? `Meta: ${extract.rawDescription}` : "",
    extract.companyName ? `Empresa (heurística): ${extract.companyName}` : "",
    extract.segmentSlug ? `Segmento sugerido: ${extract.segmentSlug}` : "",
    casesSummary ? `Cases no site:\n${casesSummary}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const body = plain.slice(0, MAX_INPUT_CHARS);
  return `${header}\n\nConteúdo:\n${body}`;
};

export const getOpenAiApiKey = (): string | undefined => {
  const key = process.env.OPENAI_API_KEY?.trim();
  return key || undefined;
};

const parseAiCases = (items: AiLeadPayload["solutionCases"], websiteUrl: string): LeadSolutionCase[] => {
  if (!Array.isArray(items)) return [];

  const mapped = items
    .map((item) => ({
      title: typeof item.title === "string" ? item.title.trim() : "",
      description: typeof item.description === "string" ? item.description.trim() : "",
      category: "Identificado por IA",
      sourceUrl: websiteUrl,
    }))
    .filter((item) => item.title && item.description);

  return filterValidCases(mapped).slice(0, 4);
};

const normalizeCategory = (value: string | undefined): string => {
  const trimmed = value?.trim() ?? "";
  const match = ALLOWED_CATEGORIES.find((c) => c.toLowerCase() === trimmed.toLowerCase());
  return match ?? "Software sob medida";
};

export const parseImplementationIdeas = (
  items: AiLeadPayload["implementationIdeas"],
): LeadImplementationIdea[] => {
  if (!Array.isArray(items)) return [];

  const parsed = items
    .map((item) => ({
      title: typeof item.title === "string" ? item.title.trim() : "",
      category: normalizeCategory(item.category),
      description: typeof item.description === "string" ? item.description.trim() : "",
      metric: typeof item.metric === "string" ? item.metric.trim() : "",
    }))
    .filter(
      (item) =>
        item.title.length >= 8 &&
        item.title.length <= 90 &&
        item.description.length >= 40 &&
        item.description.length <= 320 &&
        item.metric.length >= 8 &&
        item.metric.length <= 120,
    );

  const seen = new Set<string>();
  const unique: LeadImplementationIdea[] = [];
  for (const item of parsed) {
    const key = item.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length >= 4) break;
  }

  return unique;
};

const normalizeAiPayload = (payload: AiLeadPayload, fallback: LeadWebsiteExtract): LeadWebsiteExtract => {
  const segmentSlug = ALLOWED_SEGMENTS.includes(
    payload.segmentSlug?.toLowerCase() as (typeof ALLOWED_SEGMENTS)[number],
  )
    ? payload.segmentSlug!.toLowerCase()
    : fallback.segmentSlug;

  const solutionCases = parseAiCases(payload.solutionCases, fallback.websiteUrl);
  const implementationIdeas = parseImplementationIdeas(payload.implementationIdeas);

  const companyName = normalizeCompanyName(payload.companyName, fallback) ?? fallback.companyName;
  const primaryGoal = payload.primaryGoal?.trim()
    ? summarizePrimaryGoal(payload.primaryGoal, 220)
    : fallback.primaryGoal;

  return {
    ...fallback,
    companyName,
    city:
      payload.city?.trim() && !isInvalidCity(payload.city) ? payload.city.trim() : fallback.city,
    primaryGoal,
    segmentSlug,
    solutionCases: solutionCases.length ? solutionCases : fallback.solutionCases,
    implementationIdeas: implementationIdeas.length
      ? implementationIdeas
      : fallback.implementationIdeas,
  };
};

const SYSTEM_PROMPT = `Você extrai dados de sites de empresas/instituições para montar landing pages B2B da BuildAI (IA, automação, MicroSaaS).
Responda APENAS JSON válido com:
- companyName: nome REAL da marca/empresa (NUNCA "Home", "Menu", "Contato" ou título de seção do site)
- city (cidade sede se explícita, senão null)
- primaryGoal: 1 ou 2 frases COMPLETAS com missão/oferta de valor (sintetize, não copie trecho cortado)
- segmentSlug (${ALLOWED_SEGMENTS.join("|")})
- solutionCases (0 a 4): produtos/serviços/cases REAIS listados no site (title + description). Não inclua FAQ, artigos jurídicos genéricos, busca do site.
- implementationIdeas (exatamente 3 ou 4): propostas que a BuildAI pode IMPLEMENTAR para ESTE negócio (foco em solução digital, não em descrever cases que eles já têm).
  Cada item: category (uma de: ${ALLOWED_CATEGORIES.map((c) => `"${c}"`).join(", ")}), title (nome curto da solução), description (2 frases: o que a BuildAI entrega para este cliente), metric (benefício em poucas palavras).
  Adapte ao contexto: instituto/ONG de defesa do consumidor → triagem de demandas, base de conhecimento, chatbot orientação, automação de atendimento (NÃO "painel de campanhas" nem "content factory" genérico de agência).
  Escola → matrículas, retenção; clínica → agendamento; agência → conteúdo e operação; varejo → conversão e estoque.
NÃO repita o mesmo tipo de solução com títulos parecidos. Varie as categorias quando fizer sentido.`;

export const enrichLeadExtractWithAi = async (
  input: LeadAiExtractInput,
): Promise<LeadWebsiteExtract> => {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) return input.fallback;

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const userContent = buildPageTextForAi(input.pageText, input.fallback);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("OpenAI lead extract failed:", response.status, errText.slice(0, 300));
    return input.fallback;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return input.fallback;

  try {
    const parsed = JSON.parse(content) as AiLeadPayload;
    return normalizeAiPayload(parsed, input.fallback);
  } catch {
    return input.fallback;
  }
};
