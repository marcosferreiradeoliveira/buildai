export type HubspotLeadRecord = {
  id: string;
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  website?: string;
  jobTitle?: string;
  city?: string;
  lifecycleStage?: string;
  leadStatus?: string;
  createdAt?: string;
};

const CONTACT_PROPERTIES = [
  "firstname",
  "lastname",
  "email",
  "company",
  "phone",
  "website",
  "lifecyclestage",
  "hs_lead_status",
  "jobtitle",
  "city",
  "createdate",
] as const;

type HubspotApiContact = {
  id: string;
  properties: Record<string, string | null | undefined>;
  createdAt?: string;
};

type HubspotListResponse = {
  results?: HubspotApiContact[];
};

const pick = (props: Record<string, string | null | undefined>, key: string): string | undefined => {
  const value = props[key]?.trim();
  return value || undefined;
};

const formatContactName = (props: Record<string, string | null | undefined>): string => {
  const full = `${pick(props, "firstname") ?? ""} ${pick(props, "lastname") ?? ""}`.trim();
  if (full) return full;
  return pick(props, "company") ?? pick(props, "email") ?? "Contato sem nome";
};

const mapContact = (contact: HubspotApiContact): HubspotLeadRecord => {
  const props = contact.properties ?? {};
  return {
    id: contact.id,
    name: formatContactName(props),
    email: pick(props, "email"),
    company: pick(props, "company"),
    phone: pick(props, "phone"),
    website: pick(props, "website"),
    jobTitle: pick(props, "jobtitle"),
    city: pick(props, "city"),
    lifecycleStage: pick(props, "lifecyclestage"),
    leadStatus: pick(props, "hs_lead_status"),
    createdAt: pick(props, "createdate") ?? contact.createdAt,
  };
};

export type FetchHubspotLeadsResult =
  | { ok: true; leads: HubspotLeadRecord[] }
  | { ok: false; reason: "no_token" | "hubspot_error"; detail?: string };

export const fetchHubspotLeads = async (limit = 50): Promise<FetchHubspotLeadsResult> => {
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!token) {
    return { ok: false, reason: "no_token" };
  }

  const params = new URLSearchParams({
    limit: String(Math.min(Math.max(limit, 1), 100)),
    properties: CONTACT_PROPERTIES.join(","),
    sorts: "-createdate",
  });

  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    return { ok: false, reason: "hubspot_error", detail: `HTTP ${response.status}: ${detail}` };
  }

  const data = (await response.json()) as HubspotListResponse;
  const leads = (data.results ?? []).map(mapContact);
  return { ok: true, leads };
};
