import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { landingContentBySegment } from "@/content/landing";
import { createLeadSlug, getLeadPages, saveLeadPage } from "@/lib/leadPages";
import { useToast } from "@/hooks/use-toast";

const AdminLeadGeneratorPage = () => {
  const [segmentSlug, setSegmentSlug] = useState("educacao");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [leads, setLeads] = useState(() => getLeadPages());
  const { toast } = useToast();

  const knownSegments = useMemo(() => Object.keys(landingContentBySegment), []);
  const generatedSlug = createLeadSlug(segmentSlug, companyName);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!segmentSlug.trim() || !companyName.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha segmento e nome da empresa.",
      });
      return;
    }

    const persisted = saveLeadPage({
      slug: generatedSlug,
      segmentSlug: segmentSlug.trim().toLowerCase(),
      companyName: companyName.trim(),
      city: city.trim() || undefined,
      primaryGoal: primaryGoal.trim() || undefined,
    });

    setLeads(getLeadPages());

    toast({
      title: "Página gerada com sucesso",
      description: `Lead salvo em /lp/${persisted.slug}`,
    });
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
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-5">
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
          <h2 className="text-xl font-heading font-semibold">Leads gerados</h2>
          <div className="mt-4 space-y-3">
            {leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma página gerada ainda.</p>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium">{lead.companyName}</p>
                    <p className="text-xs text-muted-foreground">
                      Segmento: {lead.segmentSlug} · URL: /lp/{lead.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/lp/${lead.slug}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Abrir página
                    </Link>
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
