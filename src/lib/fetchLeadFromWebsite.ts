import {
  extractLeadFromWebsite,
  fetchWebsiteHtmlViaCorsProxy,
} from "@/lib/leadWebsiteExtract";

/** Extrai dados do site do lead no navegador (sem API serverless na Vercel). */
export const fetchLeadFromWebsite = async (url: string) => {
  if (import.meta.env.DEV) {
    try {
      const response = await fetch("/api/extract-lead-from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        return (await response.json()) as Awaited<ReturnType<typeof extractLeadFromWebsite>>;
      }
    } catch {
      // fallback para proxy no dev
    }
  }

  return extractLeadFromWebsite(url, fetchWebsiteHtmlViaCorsProxy);
};
