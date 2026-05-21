export const config = {
  runtime: "edge",
};

import { extractLeadFromWebsite, normalizeWebsiteUrl } from "./lib/leadWebsiteExtract";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = (await request.json()) as { url?: string };
    const url = typeof body.url === "string" ? body.url : "";

    normalizeWebsiteUrl(url);
    const data = await extractLeadFromWebsite(url);
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao extrair dados do site.";
    return Response.json({ error: message }, { status: 400 });
  }
}
