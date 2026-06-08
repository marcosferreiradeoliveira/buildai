import {
  fetchSiteHtml,
  generateImplementationIdeasServer,
  type ImplementationIdeasContext,
} from "./lib/implementationIdeasServer.js";
import { jsonResponse, optionsResponse, parseJsonBody } from "./lib/apiResponse.js";

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return optionsResponse();

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await parseJsonBody<ImplementationIdeasContext>(request);

    if (!body.companyName?.trim()) {
      return jsonResponse({ error: "Informe companyName." }, 400);
    }

    let pageText = body.pageText;
    if (!pageText && body.websiteUrl?.trim()) {
      try {
        pageText = await fetchSiteHtml(body.websiteUrl);
      } catch {
        // segue com cases e metadados
      }
    }

    const result = await generateImplementationIdeasServer({ ...body, pageText });

    if (!result.ok) {
      if (result.reason === "no_api_key") {
        return jsonResponse(
          {
            error:
              "OPENAI_API_KEY não encontrada no servidor. Adicione em Vercel → Environment Variables (Production) e faça redeploy.",
          },
          503,
        );
      }

      return jsonResponse(
        {
          error: `Não foi possível gerar propostas (${result.reason}).${result.detail ? ` ${result.detail}` : ""}`,
          implementationIdeas: [],
        },
        503,
      );
    }

    return jsonResponse({ implementationIdeas: result.ideas });
  } catch (error) {
    console.error("generate-implementation-ideas:", error);
    const message = error instanceof Error ? error.message : "Falha ao gerar propostas.";
    return jsonResponse({ error: message }, 500);
  }
}
