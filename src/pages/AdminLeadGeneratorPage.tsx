import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { landingContentBySegment } from "@/content/landing";
import {
  createLeadSlug,
  deleteLeadPage,
  isSupabaseConfigured,
  loadLeadPages,
  saveLeadPage,
} from "@/lib/leadPages";
import { LeadImplementationIdea, LeadPageConfig, LeadSolutionCase } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";
import { fetchLeadFromWebsite } from "@/lib/fetchLeadFromWebsite";

const AdminLeadGeneratorPage = () => {
  const [segmentSlug, setSegmentSlug] = useState("educacao");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [solutionCases, setSolutionCases] = useState<LeadSolutionCase[]>([]);
  const [implementationIdeas, setImplementationIdeas] = useState<LeadImplementationIdea[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [leads, setLeads] = useState<LeadPageConfig[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const { toast } = useToast();

  const knownSegments = useMemo(() => Object.keys(landingContentBySegment), []);
  const generatedSlug = createLeadSlug(segmentSlug, companyName);
  const appOrigin = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setListLoading(true);
      try {
        const data = await loadLeadPages();
        if (!cancelled) setLeads(data);
      } catch (err) {
        if (!cancelled) {
          toast({
            title: "Não foi possível carregar os leads",
            description: err instanceof Error ? err.message : "Verifique o Supabase e as variáveis de ambiente.",
            variant: "destructive",
          });
          setLeads([]);
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExtractFromWebsite = async () => {
    if (!websiteUrl.trim()) {
      toast({
        title: "Informe o site do lead",
        description: "Cole a URL do site para buscar nome, descrição e segmento sugerido.",
        variant: "destructive",
      });
      return;
    }

    setExtracting(true);
    try {
      const data = await fetchLeadFromWebsite(websiteUrl);
      if (data.companyName) setCompanyName(data.companyName);
      if (data.city) setCity(data.city);
      if (data.primaryGoal) setPrimaryGoal(data.primaryGoal);
      if (data.segmentSlug) setSegmentSlug(data.segmentSlug);
      setSolutionCases(data.solutionCases ?? []);
      setImplementationIdeas(data.implementationIdeas ?? []);

      const ideasCount = data.implementationIdeas?.length ?? 0;
      toast({
        title: "Informações importadas",
        description: ideasCount
          ? `${ideasCount} proposta(s) para "O que podemos implementar" gerada(s) com IA. Revise e salve a página.`
          : data.companyName
            ? `Dados de ${data.companyName} importados. Configure OPENAI_API_KEY na Vercel para gerar propostas com IA.`
            : "Dados importados. Sem IA, a LP usa fallback por segmento.",
      });
    } catch (err) {
      toast({
        title: "Não foi possível puxar o site",
        description: err instanceof Error ? err.message : "Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setExtracting(false);
    }
  };

  const handleDeleteLead = async (lead: LeadPageConfig) => {
    const confirmed = window.confirm(
      `Apagar a landing de "${lead.companyName}"?\n\n/lp/${lead.slug}\n\nEsta ação não pode ser desfeita.`,
    );
    if (!confirmed) return;

    setDeletingSlug(lead.slug);
    try {
      await deleteLeadPage(lead);
      setLeads(await loadLeadPages());
      toast({
        title: "Landing apagada",
        description: `A página /lp/${lead.slug} foi removida do banco.`,
      });
    } catch (err) {
      toast({
        title: "Erro ao apagar",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!segmentSlug.trim() || !companyName.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha segmento e nome da empresa.",
      });
      return;
    }

    try {
      const persisted = await saveLeadPage({
        slug: generatedSlug,
        segmentSlug: segmentSlug.trim().toLowerCase(),
        companyName: companyName.trim(),
        city: city.trim() || undefined,
        primaryGoal: primaryGoal.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        solutionCases: solutionCases.length ? solutionCases : undefined,
        implementationIdeas: implementationIdeas.length ? implementationIdeas : undefined,
      });

      setLeads(await loadLeadPages());

      toast({
        title: "Página gerada com sucesso",
        description: `Lead salvo em /lp/${persisted.slug}`,
      });
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-heading font-bold">Gerador de Landing por Lead</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Preencha os dados do lead para gerar uma página dedicada em tempo real.
          </p>
          {!isSupabaseConfigured() ? (
            <p className="mt-3 text-sm text-amber-600 dark:text-amber-500">
              Supabase não configurado: usando armazenamento local do navegador. Defina{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">VITE_SUPABASE_URL</code> e{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">VITE_SUPABASE_ANON_KEY</code> em{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>.
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-5">
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 space-y-3">
            <label htmlFor="websiteUrl" className="block text-sm font-medium">
              Site do lead
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
                placeholder="https://empresa.com.br"
                className="w-full flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50"
              />
              <button
                type="button"
                disabled={extracting}
                onClick={() => void handleExtractFromWebsite()}
                className="rounded-lg border border-primary/40 bg-background px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition disabled:opacity-60"
              >
                {extracting ? "Buscando…" : "Puxar informações"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Usa IA (OpenAI na API) para preencher campos e gerar a seção &quot;O que podemos implementar&quot;
              com propostas sob medida para o negócio.
            </p>
          </div>

          {implementationIdeas.length > 0 ? (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <p className="text-sm font-medium">
                O que podemos implementar ({implementationIdeas.length}) — exibido na landing
              </p>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {implementationIdeas.map((item) => (
                  <li key={item.title} className="rounded-lg border border-border px-3 py-2 text-sm">
                    <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                      {item.category}
                    </p>
                    <p className="font-medium mt-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    <p className="text-xs gradient-text font-semibold mt-1">{item.metric}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {solutionCases.length > 0 ? (
            <div className="rounded-xl border border-border bg-background/60 p-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Cases no site ({solutionCases.length}) — referência interna, não vão para a seção de implementação
              </p>
              <ul className="space-y-2 max-h-56 overflow-y-auto">
                {solutionCases.map((item) => (
                  <li key={item.title} className="rounded-lg border border-border px-3 py-2 text-sm">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="segmentSlug" className="mb-2 block text-sm font-medium">
                Segmento
              </label>
              <input
                id="segmentSlug"
                list="segments"
                value={segmentSlug}
                onChange={(event) => setSegmentSlug(event.target.value)}
                placeholder="educacao"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50"
              />
              <datalist id="segments">
                {knownSegments.map((segment) => (
                  <option key={segment} value={segment} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="companyName" className="mb-2 block text-sm font-medium">
                Nome da empresa
              </label>
              <input
                id="companyName"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Escola Alpha"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium">
                Cidade (opcional)
              </label>
              <input
                id="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="São Paulo"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label htmlFor="primaryGoal" className="mb-2 block text-sm font-medium">
                Objetivo principal (opcional)
              </label>
              <input
                id="primaryGoal"
                value={primaryGoal}
                onChange={(event) => setPrimaryGoal(event.target.value)}
                placeholder="aumentar matrículas"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/60 px-4 py-3 text-sm">
            <span className="text-muted-foreground">URL gerada: </span>
            <span className="font-medium text-primary">/lp/{generatedSlug}</span>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Gerar página do lead
          </button>
        </form>

        <div className="mt-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-heading font-semibold">Páginas geradas</h2>
            <span className="text-xs rounded-full border border-border px-2.5 py-1 text-muted-foreground">
              {leads.length} {leads.length === 1 ? "página" : "páginas"}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {listLoading ? (
              <p className="text-sm text-muted-foreground">Carregando…</p>
            ) : leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma página gerada ainda.</p>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium">{lead.companyName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Segmento: {lead.segmentSlug} · Criada em{" "}
                      {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    <a
                      href={`${appOrigin}/lp/${lead.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs text-primary hover:underline break-all"
                    >
                      {`${appOrigin}/lp/${lead.slug}`}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Link to={`/lp/${lead.slug}`} className="text-sm text-primary hover:underline">
                      Abrir página
                    </Link>
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={async () => {
                        await navigator.clipboard.writeText(`${appOrigin}/lp/${lead.slug}`);
                        toast({
                          title: "Link copiado",
                          description: `URL /lp/${lead.slug} copiada para a área de transferência.`,
                        });
                      }}
                    >
                      Copiar link
                    </button>
                    <button
                      type="button"
                      disabled={deletingSlug === lead.slug}
                      className="text-sm text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
                      onClick={() => void handleDeleteLead(lead)}
                    >
                      {deletingSlug === lead.slug ? "Apagando…" : "Apagar"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeadGeneratorPage;
