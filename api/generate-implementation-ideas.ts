import {
  fetchSiteHtml,
  generateImplementationIdeasServer,
  type ImplementationIdeasContext,
} from "../server/lib/implementationIdeasServer";
import { handleOptions, parseBody } from "../server/lib/apiResponse";

type ApiRequest = {
  method?: string;
  body?: string | ImplementationIdeasContext;
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
    const body = parseBody<ImplementationIdeasContext>(req);

    if (!body.companyName?.trim()) {
      return res.status(400).json({ error: "Informe companyName." });
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
        return res.status(503).json({
          error:
            "OPENAI_API_KEY não encontrada no servidor. Adicione em Vercel → Environment Variables (Production) e faça redeploy.",
        });
      }

      return res.status(503).json({
        error: `Não foi possível gerar propostas (${result.reason}).${result.detail ? ` ${result.detail}` : ""}`,
        implementationIdeas: [],
      });
    }

    return res.status(200).json({ implementationIdeas: result.ideas });
  } catch (error) {
    console.error("generate-implementation-ideas:", error);
    const message = error instanceof Error ? error.message : "Falha ao gerar propostas.";
    return res.status(500).json({ error: message });
  }
}
