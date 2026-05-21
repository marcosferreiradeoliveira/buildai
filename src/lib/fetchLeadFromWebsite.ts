import type { LeadWebsiteExtract } from "@/lib/leadWebsiteExtract";

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

export const fetchLeadFromWebsite = async (url: string): Promise<LeadWebsiteExtract> => {
  const response = await fetch("/api/extract-lead-from-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const payload = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(payload.error ?? "Não foi possível extrair informações do site.");
  }

  return payload;
};
