import { runExtractLeadPipeline } from "./lib/extractLeadPipeline.js";
import { normalizeWebsiteUrl } from "../src/lib/leadWebsiteExtract.js";
import { jsonResponse, optionsResponse, parseJsonBody } from "./lib/apiResponse.js";

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return optionsResponse();

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await parseJsonBody<{ url?: string }>(request);
    const url = typeof body.url === "string" ? body.url : "";

    normalizeWebsiteUrl(url);
    const data = await runExtractLeadPipeline(url);
    return jsonResponse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao extrair dados do site.";
    return jsonResponse({ error: message }, 400);
  }
}
