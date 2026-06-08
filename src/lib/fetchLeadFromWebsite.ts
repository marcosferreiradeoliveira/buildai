import {
  extractLeadFromWebsite,
  fetchWebsiteHtmlForBrowser,
  isInvalidCity,
  isInvalidCompanyName,
  summarizePrimaryGoal,
  type LeadWebsiteExtract,
} from "@/lib/leadWebsiteExtract";

export type FetchLeadFromWebsiteResult = {
  data: LeadWebsiteExtract;
  warnings: string[];
};

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

const fetchViaServerApi = async (
  url: string,
): Promise<{ data: LeadWebsiteExtract | null; warning?: string }> => {
  try {
    const response = await fetch("/api/extract-lead-from-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const payload = await parseApiResponse(response);

    if (!response.ok) {
      return {
        data: null,
        warning: `API de extração falhou (HTTP ${response.status}): ${payload.error ?? "erro desconhecido"}`,
      };
    }

    return { data: payload };
  } catch (error) {
    return {
      data: null,
      warning: `API de extração indisponível: ${error instanceof Error ? error.message : "erro de rede"}`,
    };
  }
};

const needsMetadataEnrichment = (extract: LeadWebsiteExtract): boolean =>
  isInvalidCompanyName(extract.companyName) ||
  isInvalidCity(extract.city) ||
  !extract.primaryGoal?.trim() ||
  extract.primaryGoal.endsWith("…") ||
  !extract.primaryGoal.includes(".");

const enrichMetadataFromApi = async (
  extract: LeadWebsiteExtract,
): Promise<{ data: LeadWebsiteExtract; warning?: string }> => {
  if (!needsMetadataEnrichment(extract)) return { data: extract };

  try {
    const response = await fetch("/api/enrich-lead-metadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        websiteUrl: extract.websiteUrl,
        scrapedCompanyName: extract.companyName,
        scrapedPrimaryGoal: extract.primaryGoal,
        scrapedTitle: extract.rawTitle,
        scrapedDescription: extract.rawDescription,
      }),
    });

    const raw = await response.text();
    let payload: {
      companyName?: string;
      primaryGoal?: string;
      segmentSlug?: string;
      city?: string | null;
      error?: string;
    } = {};

    if (raw) {
      try {
        payload = JSON.parse(raw) as typeof payload;
      } catch {
        return {
          data: extract,
          warning: `Enriquecimento de metadados indisponível: ${raw.replace(/\s+/g, " ").trim().slice(0, 180)}`,
        };
      }
    }

    if (!response.ok) {
      return { data: extract, warning: payload.error };
    }

    return {
      data: {
        ...extract,
        companyName:
          payload.companyName && !isInvalidCompanyName(payload.companyName)
            ? payload.companyName
            : extract.companyName,
        primaryGoal: payload.primaryGoal
          ? summarizePrimaryGoal(payload.primaryGoal, 220)
          : extract.primaryGoal,
        segmentSlug: payload.segmentSlug ?? extract.segmentSlug,
        city:
          payload.city && !isInvalidCity(payload.city) ? payload.city : extract.city,
      },
    };
  } catch (error) {
    return {
      data: extract,
      warning: `Enriquecimento de metadados indisponível: ${error instanceof Error ? error.message : "erro"}`,
    };
  }
};

const fetchImplementationIdeasFromApi = async (
  extract: LeadWebsiteExtract,
): Promise<{ data: LeadWebsiteExtract; warning?: string }> => {
  if (extract.implementationIdeas?.length >= 3) {
    return { data: extract };
  }

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

    const raw = await response.text();
    let payload: {
      implementationIdeas?: LeadWebsiteExtract["implementationIdeas"];
      error?: string;
    } = {};

    if (raw) {
      try {
        payload = JSON.parse(raw) as typeof payload;
      } catch {
        payload = { error: raw.slice(0, 180) };
      }
    }

    if (response.ok && payload.implementationIdeas?.length) {
      return { data: { ...extract, implementationIdeas: payload.implementationIdeas } };
    }

    return {
      data: extract,
      warning:
        payload.error ??
        `API de propostas retornou HTTP ${response.status} sem ideias.`,
    };
  } catch (error) {
    return {
      data: extract,
      warning: `API de propostas indisponível: ${error instanceof Error ? error.message : "erro de rede"}`,
    };
  }
};

/** Extrai dados do site: API serverless (quando disponível) → fallbacks no navegador. */
export const fetchLeadFromWebsite = async (url: string): Promise<FetchLeadFromWebsiteResult> => {
  const warnings: string[] = [];

  const apiAttempt = await fetchViaServerApi(url);
  if (apiAttempt.warning) warnings.push(apiAttempt.warning);

  const base =
    apiAttempt.data ?? (await extractLeadFromWebsite(url, fetchWebsiteHtmlForBrowser));

  if (!apiAttempt.data) {
    warnings.push("Extração no navegador — nome e propostas passam por IA na API.");
  }

  const metadataAttempt =
    !apiAttempt.data || needsMetadataEnrichment(base)
      ? await enrichMetadataFromApi(base)
      : { data: base };
  if (metadataAttempt.warning) warnings.push(metadataAttempt.warning);

  const ideasAttempt = await fetchImplementationIdeasFromApi(metadataAttempt.data);
  if (ideasAttempt.warning) warnings.push(ideasAttempt.warning);

  return { data: ideasAttempt.data, warnings };
};
