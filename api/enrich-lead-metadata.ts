import { enrichLeadMetadataServer, type LeadMetadataInput } from "./lib/leadMetadataServer";
import { handleOptions, parseBody } from "./lib/apiResponse";

type ApiRequest = {
  method?: string;
  body?: string | LeadMetadataInput;
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
    const body = parseBody<LeadMetadataInput>(req);
    const result = await enrichLeadMetadataServer(body);

    if (!result.ok) {
      return res.status(503).json({ error: `Enriquecimento indisponível (${result.reason}).` });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error("enrich-lead-metadata:", error);
    const message = error instanceof Error ? error.message : "Falha ao enriquecer metadados.";
    return res.status(500).json({ error: message });
  }
}
