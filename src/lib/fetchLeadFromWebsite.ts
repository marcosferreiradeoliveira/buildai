import type { LeadWebsiteExtract } from "@/lib/leadWebsiteExtract";

export const fetchLeadFromWebsite = async (url: string): Promise<LeadWebsiteExtract> => {
  const response = await fetch("/api/extract-lead-from-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const payload = (await response.json()) as LeadWebsiteExtract & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Não foi possível extrair informações do site.");
  }

  return payload;
};
