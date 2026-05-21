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

/** Extrai dados do site: API serverless (quando disponível) → fallbacks no navegador. */
export const fetchLeadFromWebsite = async (url: string): Promise<LeadWebsiteExtract> => {
  const fromApi = await fetchViaServerApi(url);
  if (fromApi) return fromApi;

  return extractLeadFromWebsite(url, fetchWebsiteHtmlForBrowser);
};
