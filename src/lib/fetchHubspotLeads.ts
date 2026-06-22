import type { HubspotLead, HubspotLeadsResponse } from "@/types/hubspot";

export const fetchHubspotLeads = async (): Promise<HubspotLead[]> => {
  const response = await fetch("/api/hubspot-leads");
  const raw = await response.text();

  let payload: HubspotLeadsResponse & { error?: string } = { leads: [] };
  if (raw) {
    try {
      payload = JSON.parse(raw) as HubspotLeadsResponse & { error?: string };
    } catch {
      throw new Error(raw.replace(/\s+/g, " ").trim().slice(0, 200) || `HTTP ${response.status}`);
    }
  }

  if (!response.ok) {
    throw new Error(payload.error ?? `HTTP ${response.status}`);
  }

  return payload.leads ?? [];
};
