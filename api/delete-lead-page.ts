import { deleteLeadPageServer } from "./lib/deleteLeadPageServer.js";
import { jsonResponse, optionsResponse, parseJsonBody } from "./lib/apiResponse.js";

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return optionsResponse();

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await parseJsonBody<{ slug?: string; id?: string }>(request);

    const result = await deleteLeadPageServer({
      slug: typeof body.slug === "string" ? body.slug : undefined,
      id: typeof body.id === "string" ? body.id : undefined,
    });

    if (!result.ok && result.reason === "no_service_role") {
      return jsonResponse(
        {
          error:
            "Configure SUPABASE_SERVICE_ROLE_KEY nas variáveis da Vercel (Settings → Environment Variables).",
        },
        503,
      );
    }

    if (!result.ok) {
      return jsonResponse({ error: "Lead não encontrado no banco." }, 404);
    }

    return jsonResponse({ deleted: true, ids: result.deletedIds });
  } catch (error) {
    console.error("delete-lead-page:", error);
    const message = error instanceof Error ? error.message : "Falha ao apagar lead.";
    return jsonResponse({ error: message }, 500);
  }
}
