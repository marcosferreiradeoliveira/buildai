import { runExtractLeadPipeline } from "./lib/extractLeadPipeline";
import { normalizeWebsiteUrl } from "../src/lib/leadWebsiteExtract";
import { handleOptions, parseBody } from "./lib/apiResponse";

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
    handleOptions(res);
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody<{ url?: string }>(req);
    const url = typeof body.url === "string" ? body.url : "";

    normalizeWebsiteUrl(url);
    const data = await runExtractLeadPipeline(url);
    return res.status(200).json(data);
  } catch (error) {
    console.error("extract-lead-from-url:", error);
    const message = error instanceof Error ? error.message : "Falha ao extrair dados do site.";
    return res.status(400).json({ error: message });
  }
}
