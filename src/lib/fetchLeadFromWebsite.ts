import {
  extractLeadFromWebsite,
  fetchWebsiteHtmlViaCorsProxy,
  type LeadWebsiteExtract,
} from "@/lib/leadWebsiteExtract";

const parseApiResponse = async (
  response: Response,
): Promise<LeadWebsiteExtract & { error?: string }> => {
  const raw = await response.text();

  try {
    return JSON.parse(raw) as LeadWebsiteExtract & { error?: string };
  } catch {
    const preview = raw.replace(/\s+/g, " ").trim().slice(0, 160);
    throw new Error(
      preview || `Resposta inválida do servidor (HTTP ${response.status}).`,
    );
  }
};

const fetchViaLocalApi = async (url: string): Promise<LeadWebsiteExtract | null> => {
  try {
    const response = await fetch("/api/extract-lead-from-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) return null;

    const payload = await parseApiResponse(response);
    return payload;
  } catch {
    return null;
  }
};

/** Extrai dados do site do lead (proxy no browser em produção; API local no dev). */
export const fetchLeadFromWebsite = async (url: string): Promise<LeadWebsiteExtract> => {
  if (import.meta.env.DEV) {
    const fromApi = await fetchViaLocalApi(url);
    if (fromApi) return fromApi;
  }

  return extractLeadFromWebsite(url, fetchWebsiteHtmlViaCorsProxy);
};
