import { useQuery } from "@tanstack/react-query";
import { fetchHubspotLeads } from "@/lib/fetchHubspotLeads";
import { resolveHubspotWebsiteUrl } from "@/lib/hubspotWebsite";
import type { HubspotLead } from "@/types/hubspot";

type HubspotLeadsSectionProps = {
  onSelectLead: (lead: HubspotLead) => void;
  extractingLeadId?: string | null;
};

const formatDate = (value?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
};

const HubspotLeadsSection = ({ onSelectLead, extractingLeadId }: HubspotLeadsSectionProps) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["hubspot-leads"],
    queryFn: fetchHubspotLeads,
    staleTime: 60_000,
    retry: 1,
  });

  const leads = data ?? [];
  const isBusy = Boolean(extractingLeadId);

  return (
    <section className="mb-10 rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-primary">HubSpot</p>
          <h2 className="mt-1 text-xl font-heading font-semibold">Leads do CRM</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Clique no contato para inferir o site pelo e-mail corporativo (ou website do HubSpot) e
            puxar automaticamente nome, segmento e propostas de implementação.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching || isBusy}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition disabled:opacity-60"
        >
          {isFetching ? "Atualizando…" : "Atualizar"}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando leads do HubSpot…</p>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error instanceof Error ? error.message : "Erro ao carregar leads."}
          </div>
        ) : leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum contato encontrado no HubSpot.</p>
        ) : (
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
            {leads.map((lead) => {
              const inferredUrl = resolveHubspotWebsiteUrl({
                website: lead.website,
                email: lead.email,
              });
              const isExtracting = extractingLeadId === lead.id;

              return (
                <div
                  key={lead.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{lead.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lead.company ? `${lead.company}` : "Sem empresa"}
                      {lead.city ? ` · ${lead.city}` : ""}
                      {lead.lifecycleStage ? ` · ${lead.lifecycleStage}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {lead.email ?? "Sem e-mail"}
                      {lead.phone ? ` · ${lead.phone}` : ""}
                    </p>
                    {inferredUrl ? (
                      <p className="mt-1 text-xs text-primary truncate">Site: {inferredUrl}</p>
                    ) : (
                      <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">
                        Sem site detectável (e-mail genérico ou sem website)
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Criado em {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isBusy || !inferredUrl}
                    onClick={() => onSelectLead(lead)}
                    className="shrink-0 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition disabled:opacity-50"
                  >
                    {isExtracting ? "Extraindo…" : "Importar e extrair"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default HubspotLeadsSection;
