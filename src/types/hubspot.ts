export type HubspotLead = {
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

export type HubspotLeadsResponse = {
  leads: HubspotLead[];
};
