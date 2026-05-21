export type { LeadSolutionCase } from "../../api/lib/leadWebsiteExtract";

export type LeadPageConfig = {
  id: string;
  slug: string;
  segmentSlug: string;
  companyName: string;
  city?: string;
  primaryGoal?: string;
  websiteUrl?: string;
  solutionCases?: LeadSolutionCase[];
  createdAt: string;
};
