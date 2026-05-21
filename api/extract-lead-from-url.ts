import { extractLeadFromWebsite, normalizeWebsiteUrl } from "../src/lib/leadWebsiteExtract";

type ApiRequest = {
  method?: string;
  body?: string | { url?: string };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader?: (key: string, value: string) => void;
  end?: (body?: string) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method === "OPTIONS") {
    res.status?.(204);
    res.setHeader?.("Access-Control-Allow-Origin", "*");
    res.setHeader?.("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader?.("Access-Control-Allow-Headers", "Content-Type");
    res.end?.("");
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? (JSON.parse(req.body) as { url?: string })
        : (req.body ?? {});
    const url = typeof body.url === "string" ? body.url : "";

    normalizeWebsiteUrl(url);
    const data = await extractLeadFromWebsite(url);
    return res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao extrair dados do site.";
    return res.status(400).json({ error: message });
  }
}
