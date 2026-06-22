import { deleteLeadPageServer } from "../server/lib/deleteLeadPageServer";
import { handleOptions, parseBody } from "../server/lib/apiResponse";

type ApiRequest = {
  method?: string;
  body?: string | { slug?: string; id?: string };
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
    const body = parseBody<{ slug?: string; id?: string }>(req);

    const result = await deleteLeadPageServer({
      slug: typeof body.slug === "string" ? body.slug : undefined,
      id: typeof body.id === "string" ? body.id : undefined,
    });

    if (!result.ok && result.reason === "no_service_role") {
      return res.status(503).json({
        error:
          "Configure SUPABASE_SERVICE_ROLE_KEY nas variáveis da Vercel (Settings → Environment Variables).",
      });
    }

    if (!result.ok) {
      return res.status(404).json({ error: "Lead não encontrado no banco." });
    }

    return res.status(200).json({ deleted: true, ids: result.deletedIds });
  } catch (error) {
    console.error("delete-lead-page:", error);
    const message = error instanceof Error ? error.message : "Falha ao apagar lead.";
    return res.status(500).json({ error: message });
  }
}
