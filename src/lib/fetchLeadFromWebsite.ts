import {
  extractLeadFromWebsite,
  fetchWebsiteHtmlForBrowser,
  type LeadWebsiteExtract,
} from "@/lib/leadWebsiteExtract";

const parseApiResponse = async (
  response: Response,
): Promise<LeadWebsiteExtract & { error?: string }> => {
  const raw = await response.text();

  try {
    return JSON.parse(raw) as LeadWebsiteExtract & { error?: string };
  } catch {
    const preview = raw.replace(/\s+/g, " ").trim().slice(0, 200);
    throw new Error(preview || `Resposta inválida (HTTP ${response.status}).`);
  }
};

const fetchViaServerApi = async (url: string): Promise<LeadWebsiteExtract | null> => {
  try {
    const response = await fetch("/api/extract-lead-from-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const payload = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(payload.error ?? `API retornou HTTP ${response.status}.`);
    }

    return payload;
  } catch {
    return null;
  }
};

const fetchImplementationIdeasFromApi = async (
  extract: LeadWebsiteExtract,
): Promise<LeadWebsiteExtract> => {
  if (extract.implementationIdeas?.length >= 3) return extract;

  try {
    const response = await fetch("/api/generate-implementation-ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: extract.companyName ?? "Cliente",
        segmentSlug: extract.segmentSlug,
        primaryGoal: extract.primaryGoal,
        websiteUrl: extract.websiteUrl,
        solutionCases: extract.solutionCases,
      }),
    });

    const payload = (await response.json()) as {
      implementationIdeas?: LeadWebsiteExtract["implementationIdeas"];
      error?: string;
    };

    if (response.ok && payload.implementationIdeas?.length) {
      return { ...extract, implementationIdeas: payload.implementationIdeas };
    }
  } catch {
    // segue com dados já extraídos
  }

  return extract;
};

/** Extrai dados do site: API serverless (quando disponível) → fallbacks no navegador. */
export const fetchLeadFromWebsite = async (url: string): Promise<LeadWebsiteExtract> => {
  const fromApi = await fetchViaServerApi(url);
  const base =
    fromApi ?? (await extractLeadFromWebsite(url, fetchWebsiteHtmlForBrowser));

  return fetchImplementationIdeasFromApi(base);
};
