export type LeadSolutionCase = {
  title: string;
  description: string;
  category?: string;
  metric?: string;
  imageSrc?: string;
  sourceUrl?: string;
};

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
