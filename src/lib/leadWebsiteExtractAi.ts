import {
  filterValidCases,
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
] as const;

const MAX_INPUT_CHARS = 14_000;

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
  const header = [
    `URL: ${extract.websiteUrl}`,
    extract.rawTitle ? `Título: ${extract.rawTitle}` : "",
    extract.rawDescription ? `Meta: ${extract.rawDescription}` : "",
    extract.companyName ? `Empresa (heurística): ${extract.companyName}` : "",
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

const normalizeAiPayload = (payload: AiLeadPayload, fallback: LeadWebsiteExtract): LeadWebsiteExtract => {
  const segmentSlug = ALLOWED_SEGMENTS.includes(
    payload.segmentSlug?.toLowerCase() as (typeof ALLOWED_SEGMENTS)[number],
  )
    ? payload.segmentSlug!.toLowerCase()
    : fallback.segmentSlug;

  const solutionCases = parseAiCases(payload.solutionCases, fallback.websiteUrl);

  return {
    ...fallback,
    companyName: payload.companyName?.trim() || fallback.companyName,
    city: payload.city?.trim() || fallback.city,
    primaryGoal: payload.primaryGoal?.trim()?.slice(0, 220) || fallback.primaryGoal,
    segmentSlug,
    solutionCases: solutionCases.length ? solutionCases : fallback.solutionCases,
  };
};

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
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Você extrai dados de sites de empresas para montar landing pages B2B da BuildAI (IA, automação, MicroSaaS).
Responda APENAS JSON válido com: companyName, city (cidade sede se explícita, senão null), primaryGoal (missão/oferta em 1 frase, máx 180 caracteres), segmentSlug (${ALLOWED_SEGMENTS.join("|")}), solutionCases (0 a 4 itens).
Cada solutionCase: title (nome do produto/serviço/case real da empresa) e description (o que entregam, 1-2 frases).
NÃO inclua: artigos de FAQ, direito do consumidor genérico, textos de busca ("qual seu problema"), menus, posts jurídicos educativos que não são portfólio da empresa.
Se o site for instituto/ONG de consumidor, segmentSlug=juridico e solutionCases=[] salvo se houver projetos reais listados.`,
        },
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
