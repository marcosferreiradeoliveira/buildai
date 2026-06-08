export type LeadMetadataInput = {
  websiteUrl: string;
  scrapedCompanyName?: string;
  scrapedPrimaryGoal?: string;
  scrapedTitle?: string;
  scrapedDescription?: string;
  pageText?: string;
};

export type LeadMetadataResult = {
  companyName?: string;
  primaryGoal?: string;
  segmentSlug?: string;
};

const ALLOWED_SEGMENTS = [
  "educacao",
  "saude",
  "varejo",
  "cultura",
  "tecnologia",
  "juridico",
  "comunicacao",
];

const stripHtml = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SYSTEM_PROMPT = `Você identifica dados de empresas a partir de sites para landing pages B2B.
Responda APENAS JSON: { "companyName", "primaryGoal", "segmentSlug" }

Regras:
- companyName: nome REAL da empresa/instituição (marca), NÃO título de seção ("Home", "Menu", "Contato", "Quem somos").
- primaryGoal: 1 ou 2 frases COMPLETAS resumindo missão, oferta principal ou proposta de valor. Não copie trecho cortado; sintetize.
- segmentSlug: um de ${ALLOWED_SEGMENTS.join("|")}
- Use URL, título, meta e conteúdo do site. Se o nome extraído for "Home" ou genérico, infira o nome correto do conteúdo.`;

export const enrichLeadMetadataServer = async (
  input: LeadMetadataInput,
): Promise<{ ok: true; data: LeadMetadataResult } | { ok: false; reason: string }> => {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return { ok: false, reason: "no_api_key" };

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const excerpt = input.pageText ? stripHtml(input.pageText).slice(0, 12_000) : "";

  const userContent = [
    `URL: ${input.websiteUrl}`,
    input.scrapedTitle ? `Título da página: ${input.scrapedTitle}` : "",
    input.scrapedDescription ? `Meta description: ${input.scrapedDescription}` : "",
    input.scrapedCompanyName ? `Nome extraído (pode estar errado): ${input.scrapedCompanyName}` : "",
    input.scrapedPrimaryGoal ? `Objetivo extraído (pode estar incompleto): ${input.scrapedPrimaryGoal}` : "",
    excerpt ? `Conteúdo:\n${excerpt}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

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
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!response.ok) {
    return { ok: false, reason: `openai_${response.status}` };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return { ok: false, reason: "empty" };

  try {
    const parsed = JSON.parse(content) as LeadMetadataResult;
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, reason: "parse_error" };
  }
};
