export type DeleteLeadInput = {
  slug?: string;
  id?: string;
};

export type DeleteLeadResult =
  | { ok: true; deletedIds: string[] }
  | { ok: false; reason: "no_service_role" | "not_found" };

const getSupabaseConfig = () => {
  const url = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)?.trim().replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
};

/** DELETE via PostgREST (sem SDK — evita erro 500 no serverless da Vercel). */
export const deleteLeadPageServer = async (input: DeleteLeadInput): Promise<DeleteLeadResult> => {
  const config = getSupabaseConfig();
  if (!config) return { ok: false, reason: "no_service_role" };

  const slug = input.slug?.trim();
  const id = input.id?.trim();
  if (!slug && !id) throw new Error("Informe slug ou id do lead.");

  const filter = id ? `id=eq.${encodeURIComponent(id)}` : `slug=eq.${encodeURIComponent(slug!)}`;
  const endpoint = `${config.url}/rest/v1/lead_pages?${filter}`;

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });

  const raw = await response.text();
  let payload: unknown = [];
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      throw new Error(raw.slice(0, 200) || `Supabase retornou HTTP ${response.status}.`);
    }
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String((payload as { message: string }).message)
        : raw.slice(0, 200) || `Supabase retornou HTTP ${response.status}.`;
    throw new Error(message);
  }

  const rows = Array.isArray(payload) ? payload : [];
  if (!rows.length) return { ok: false, reason: "not_found" };

  const deletedIds = rows
    .map((row) => (typeof row === "object" && row !== null && "id" in row ? String(row.id) : ""))
    .filter(Boolean);

  return { ok: true, deletedIds };
};
