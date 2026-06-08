import {
  generateImplementationIdeasServer,
  type ImplementationIdeasContext as ServerContext,
} from "../../api/lib/implementationIdeasServer";
import type { LeadImplementationIdea, LeadSolutionCase, LeadWebsiteExtract } from "./leadWebsiteExtract";

export type ImplementationIdeasContext = ServerContext & {
  solutionCases?: LeadSolutionCase[];
};

export const generateImplementationIdeasWithAi = async (
  ctx: ImplementationIdeasContext,
): Promise<LeadImplementationIdea[]> => {
  const result = await generateImplementationIdeasServer(ctx);
  return result.ok ? result.ideas : [];
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
