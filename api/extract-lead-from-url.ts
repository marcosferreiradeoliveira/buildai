import {
  extractLeadFromWebsite,
  normalizeWebsiteUrl,
} from "../lib/leadWebsiteExtract";

type RequestBody = { url?: string };

type ApiRequest = {
  method?: string;
  body?: string | RequestBody;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? (JSON.parse(req.body) as RequestBody)
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
