import {
  extractLeadFromWebsite,
  normalizeWebsiteUrl,
} from "../src/lib/leadWebsiteExtract";

type VercelRequest = {
  method?: string;
  body?: string | Record<string, unknown>;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  end: () => void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? (JSON.parse(req.body) as { url?: string }) : (req.body ?? {});
    const url = typeof body.url === "string" ? body.url : "";

    normalizeWebsiteUrl(url);
    const data = await extractLeadFromWebsite(url);
    return res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao extrair dados do site.";
    return res.status(400).json({ error: message });
  }
}
