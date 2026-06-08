import {
  extractLeadFromWebsite,
  fetchWebsiteHtml,
  isInvalidCity,
  isInvalidCompanyName,
  normalizeWebsiteUrl,
  summarizePrimaryGoal,
  type LeadWebsiteExtract,
} from "../../src/lib/leadWebsiteExtract";
import { enrichLeadExtractWithAi } from "../../src/lib/leadWebsiteExtractAi";
import { generateImplementationIdeasServer } from "./implementationIdeasServer";
import { enrichLeadMetadataServer } from "./leadMetadataServer";

const applyMetadata = async (
  result: LeadWebsiteExtract,
  pageText: string,
): Promise<LeadWebsiteExtract> => {
  if (!process.env.OPENAI_API_KEY?.trim()) return result;
  if (!isInvalidCompanyName(result.companyName) && result.primaryGoal?.includes(".")) {
    return result;
  }

  const meta = await enrichLeadMetadataServer({
    websiteUrl: result.websiteUrl,
    scrapedCompanyName: result.companyName,
    scrapedPrimaryGoal: result.primaryGoal,
    scrapedTitle: result.rawTitle,
    scrapedDescription: result.rawDescription,
    pageText,
  });

  if (!meta.ok) return result;

  return {
    ...result,
    companyName:
      meta.data.companyName && !isInvalidCompanyName(meta.data.companyName)
        ? meta.data.companyName
        : result.companyName,
    primaryGoal: meta.data.primaryGoal
      ? summarizePrimaryGoal(meta.data.primaryGoal, 220)
      : result.primaryGoal,
    segmentSlug: meta.data.segmentSlug ?? result.segmentSlug,
    city:
      meta.data.city && !isInvalidCity(meta.data.city) ? meta.data.city.trim() : result.city,
  };
};

/** Pipeline serverless: scrape → IA (metadados + propostas). Só importa api → src. */
export const runExtractLeadPipeline = async (url: string): Promise<LeadWebsiteExtract> => {
  const websiteUrl = normalizeWebsiteUrl(url);
  let result = await extractLeadFromWebsite(url);

  if (isInvalidCity(result.city)) {
    result = { ...result, city: undefined };
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return result;
  }

  let pageText = "";
  try {
    pageText = await fetchWebsiteHtml(websiteUrl);
  } catch {
    return result;
  }

  try {
    result = await enrichLeadExtractWithAi({
      websiteUrl,
      pageText,
      fallback: result,
    });

    if (isInvalidCity(result.city)) {
      result = { ...result, city: undefined };
    }

    if (!result.implementationIdeas?.length || result.implementationIdeas.length < 3) {
      const ideas = await generateImplementationIdeasServer({
        companyName: result.companyName ?? "Cliente",
        segmentSlug: result.segmentSlug,
        primaryGoal: result.primaryGoal,
        websiteUrl: result.websiteUrl,
        solutionCases: result.solutionCases,
        pageText,
      });
      if (ideas.ok) {
        result = { ...result, implementationIdeas: ideas.ideas };
      }
    }

    result = await applyMetadata(result, pageText);
  } catch (error) {
    console.error("extractLeadPipeline AI step failed:", error);
  }

  return result;
};
