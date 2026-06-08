import { fetchWebsiteHtml } from "../src/lib/leadWebsiteExtract";
import {
  generateImplementationIdeasWithAi,
  type ImplementationIdeasContext,
} from "../src/lib/leadImplementationIdeasAi";

type ApiRequest = {
  method?: string;
  body?: string | ImplementationIdeasContext & { websiteUrl?: string };
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
        ? (JSON.parse(req.body) as ImplementationIdeasContext)
        : ((req.body ?? {}) as ImplementationIdeasContext);

    if (!body.companyName?.trim()) {
      return res.status(400).json({ error: "Informe companyName." });
    }

    let pageText = body.pageText;
    if (!pageText && body.websiteUrl?.trim()) {
      try {
        pageText = await fetchWebsiteHtml(body.websiteUrl);
      } catch {
        // segue sem HTML completo
      }
    }

    const ideas = await generateImplementationIdeasWithAi({ ...body, pageText });

    if (!ideas.length) {
      return res.status(503).json({
        error: "Não foi possível gerar propostas. Verifique OPENAI_API_KEY na Vercel.",
        implementationIdeas: [],
      });
    }

    return res.status(200).json({ implementationIdeas: ideas });
  } catch (error) {
    console.error("generate-implementation-ideas:", error);
    const message = error instanceof Error ? error.message : "Falha ao gerar propostas.";
    return res.status(500).json({ error: message });
  }
}
