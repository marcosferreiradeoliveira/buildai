import { fetchHubspotLeads } from "./lib/hubspotServer";
import { handleOptions } from "./lib/apiResponse";

type ApiRequest = {
  method?: string;
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

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await fetchHubspotLeads();

    if (!result.ok) {
      if (result.reason === "no_token") {
        return res.status(503).json({
          error:
            "Configure HUBSPOT_ACCESS_TOKEN nas variáveis de ambiente (Vercel ou .env.local) e faça redeploy.",
        });
      }

      return res.status(502).json({
        error: `Não foi possível buscar leads no HubSpot.${result.detail ? ` ${result.detail}` : ""}`,
      });
    }

    return res.status(200).json({ leads: result.leads });
  } catch (error) {
    console.error("hubspot-leads:", error);
    const message = error instanceof Error ? error.message : "Falha ao buscar leads do HubSpot.";
    return res.status(500).json({ error: message });
  }
}
