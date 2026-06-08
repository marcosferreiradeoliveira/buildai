import {
  buildImplementationIdeasSystemPrompt,
  buildImplementationIdeasUserPrompt,
} from "../../src/lib/leadImplementationIdeasPrompt";
import { mergeImplementationIdeas } from "../../src/lib/leadSegmentSolutions";

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
        { role: "system", content: buildImplementationIdeasSystemPrompt(ctx) },
        { role: "user", content: buildImplementationIdeasUserPrompt(ctx) },
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
    const ideas = mergeImplementationIdeas(
      parseIdeas(parsed.implementationIdeas),
      ctx.segmentSlug,
      ctx.companyName,
    );
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
