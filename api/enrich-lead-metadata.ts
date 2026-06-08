import { enrichLeadMetadataServer, type LeadMetadataInput } from "./lib/leadMetadataServer";

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
        ? (JSON.parse(req.body) as LeadMetadataInput)
        : ((req.body ?? {}) as LeadMetadataInput);

    const result = await enrichLeadMetadataServer(body);

    if (!result.ok) {
      return res.status(503).json({ error: `Enriquecimento indisponível (${result.reason}).` });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao enriquecer metadados.";
    return res.status(500).json({ error: message });
  }
}
