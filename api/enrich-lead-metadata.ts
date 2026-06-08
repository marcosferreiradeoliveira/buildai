import { enrichLeadMetadataServer, type LeadMetadataInput } from "./lib/leadMetadataServer.js";
import { jsonResponse, optionsResponse, parseJsonBody } from "./lib/apiResponse.js";

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return optionsResponse();

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await parseJsonBody<LeadMetadataInput>(request);
    const result = await enrichLeadMetadataServer(body);

    if (!result.ok) {
      return jsonResponse({ error: `Enriquecimento indisponível (${result.reason}).` }, 503);
    }

    return jsonResponse(result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao enriquecer metadados.";
    return jsonResponse({ error: message }, 500);
  }
}
