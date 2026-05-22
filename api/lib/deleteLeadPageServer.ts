import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type DeleteLeadInput = {
  slug?: string;
  id?: string;
};

export const getSupabaseAdmin = (): SupabaseClient | null => {
  const url = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, { auth: { persistSession: false } });
};

export type DeleteLeadResult =
  | { ok: true; deletedIds: string[] }
  | { ok: false; reason: "no_service_role" | "not_found" };

export const deleteLeadPageServer = async (input: DeleteLeadInput): Promise<DeleteLeadResult> => {
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, reason: "no_service_role" };

  const slug = input.slug?.trim();
  const id = input.id?.trim();
  if (!slug && !id) throw new Error("Informe slug ou id do lead.");

  let query = sb.from("lead_pages").delete();
  if (id) {
    query = query.eq("id", id);
  } else if (slug) {
    query = query.eq("slug", slug);
  }

  const { data, error } = await query.select("id");
  if (error) throw error;
  if (!data?.length) return { ok: false, reason: "not_found" };

  return { ok: true, deletedIds: data.map((row) => row.id as string) };
};
