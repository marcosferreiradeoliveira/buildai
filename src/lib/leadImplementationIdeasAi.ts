import {
  buildImplementationIdeasSystemPrompt,
  buildImplementationIdeasUserPrompt,
} from "./leadImplementationIdeasPrompt";
import { mergeImplementationIdeas } from "./leadSegmentSolutions";
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
        { role: "system", content: buildImplementationIdeasSystemPrompt(ctx) },
        { role: "user", content: buildImplementationIdeasUserPrompt(ctx) },
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
    const ideas = parseImplementationIdeas(
      parsed.implementationIdeas as Parameters<typeof parseImplementationIdeas>[0],
    );
    return mergeImplementationIdeas(ideas, ctx.segmentSlug, ctx.companyName);
  } catch {
    return [];
  }
};

export const enrichExtractWithImplementationIdeas = async (
  extract: LeadWebsiteExtract,
  pageText?: string,
): Promise<LeadWebsiteExtract> => {
  const company = extract.companyName ?? "Cliente";

  if (extract.implementationIdeas && extract.implementationIdeas.length >= 3) {
    return {
      ...extract,
      implementationIdeas: mergeImplementationIdeas(
        extract.implementationIdeas,
        extract.segmentSlug,
        company,
      ),
    };
  }

  const ideas = await generateImplementationIdeasWithAi({
    companyName: company,
    segmentSlug: extract.segmentSlug,
    primaryGoal: extract.primaryGoal,
    websiteUrl: extract.websiteUrl,
    solutionCases: extract.solutionCases,
    pageText,
  });

  const merged =
    ideas.length ?
      ideas
    : mergeImplementationIdeas([], extract.segmentSlug, company);

  if (!merged.length) return extract;
  return { ...extract, implementationIdeas: merged };
};
