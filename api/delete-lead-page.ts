import { deleteLeadPageServer } from "./lib/deleteLeadPageServer";

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
        ? (JSON.parse(req.body) as { slug?: string; id?: string })
        : (req.body ?? {});

    const result = await deleteLeadPageServer({
      slug: typeof body.slug === "string" ? body.slug : undefined,
      id: typeof body.id === "string" ? body.id : undefined,
    });

    if (result.reason === "no_service_role") {
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
    const message = error instanceof Error ? error.message : "Falha ao apagar lead.";
    return res.status(400).json({ error: message });
  }
}
