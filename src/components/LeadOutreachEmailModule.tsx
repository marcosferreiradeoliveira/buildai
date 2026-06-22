import { useEffect, useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { buildMailtoUrl, buildOutreachEmail } from "@/lib/leadOutreachEmail";
import {
  connectGmail,
  createGmailDraft,
  disconnectGmail,
  fetchGmailStatus,
  sendGmailDraft,
  type GmailStatus,
} from "@/lib/gmailClient";
import type { LeadImplementationIdea, LeadSolutionCase } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";

type LeadOutreachEmailModuleProps = {
  companyName: string;
  contactName?: string;
  recipientEmail?: string;
  segmentSlug?: string;
  primaryGoal?: string;
  implementationIdeas?: LeadImplementationIdea[];
  solutionCases?: LeadSolutionCase[];
  landingUrl?: string;
};

const LeadOutreachEmailModule = ({
  companyName,
  contactName,
  recipientEmail,
  segmentSlug,
  primaryGoal,
  implementationIdeas,
  solutionCases,
  landingUrl,
}: LeadOutreachEmailModuleProps) => {
  const { toast } = useToast();
  const [newsHighlight, setNewsHighlight] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [gmailStatus, setGmailStatus] = useState<GmailStatus | null>(null);
  const [gmailLoading, setGmailLoading] = useState(true);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftUrl, setDraftUrl] = useState<string | null>(null);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [sending, setSending] = useState(false);

  const draft = useMemo(
    () =>
      buildOutreachEmail({
        companyName,
        contactName,
        segmentSlug,
        primaryGoal,
        implementationIdeas,
        solutionCases,
        landingUrl,
        newsHighlight: newsHighlight || undefined,
      }),
    [
      companyName,
      contactName,
      segmentSlug,
      primaryGoal,
      implementationIdeas,
      solutionCases,
      landingUrl,
      newsHighlight,
    ],
  );

  const loadGmailStatus = async () => {
    setGmailLoading(true);
    try {
      setGmailStatus(await fetchGmailStatus());
    } catch {
      setGmailStatus({ configured: false, connected: false });
    } finally {
      setGmailLoading(false);
    }
  };

  useEffect(() => {
    void loadGmailStatus();
  }, []);

  useEffect(() => {
    setSubject(draft.subject);
    setBody(draft.body);
    setDraftId(null);
    setDraftUrl(null);
    setPendingApproval(false);
  }, [draft.subject, draft.body]);

  if (!companyName.trim()) return null;

  const copyText = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: `${label} copiado`, description: "Conteúdo na área de transferência." });
  };

  const openMailClient = () => {
    window.location.href = buildMailtoUrl(recipientEmail, subject, body);
  };

  const handleCreateGmailDraft = async () => {
    if (!recipientEmail?.trim()) {
      toast({
        title: "Informe o e-mail do contato",
        description: "Preencha o campo de e-mail do destinatário no formulário acima.",
        variant: "destructive",
      });
      return;
    }

    setSavingDraft(true);
    try {
      const result = await createGmailDraft({
        to: recipientEmail.trim(),
        subject,
        body,
      });
      setDraftId(result.draftId);
      setDraftUrl(result.gmailDraftsUrl);
      setPendingApproval(true);
      toast({
        title: "Rascunho criado no Gmail",
        description: "Revise o texto abaixo e clique em Aprovar e enviar quando estiver ok.",
      });
    } catch (err) {
      toast({
        title: "Erro ao criar rascunho",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSendApproved = async () => {
    if (!draftId) return;

    const confirmed = window.confirm(
      `Enviar e-mail para ${recipientEmail}?\n\nAssunto: ${subject}\n\nEsta ação não pode ser desfeita.`,
    );
    if (!confirmed) return;

    setSending(true);
    try {
      await sendGmailDraft(draftId);
      toast({
        title: "E-mail enviado",
        description: `Mensagem enviada para ${recipientEmail} via Gmail.`,
      });
      setDraftId(null);
      setDraftUrl(null);
      setPendingApproval(false);
    } catch (err) {
      toast({
        title: "Erro ao enviar",
        description: err instanceof Error ? err.message : "Tente recriar o rascunho.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const gmailReady = gmailStatus?.configured && gmailStatus.connected;

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8 space-y-5">
      <div>
        <p className="text-xs uppercase tracking-wider text-primary">Outreach</p>
        <h2 className="mt-1 text-xl font-heading font-semibold">E-mail para o cliente</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Novidades da BuildAI, implementações de IA e convite para diagnóstico gratuito. Conecte o
          Gmail para criar rascunho e enviar após aprovação.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background/60 px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          {gmailLoading ?
            <span className="text-muted-foreground">Verificando Gmail…</span>
          : !gmailStatus?.configured ?
            <span className="text-amber-600 dark:text-amber-500">
              Gmail não configurado no servidor (GOOGLE_CLIENT_ID / SECRET / REDIRECT_URI).
            </span>
          : gmailReady ?
            <span>
              Conectado como{" "}
              <span className="font-medium text-primary">{gmailStatus.email ?? "Gmail"}</span>
            </span>
          : <span className="text-muted-foreground">Gmail não conectado nesta sessão.</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {gmailStatus?.configured && !gmailReady ?
            <button
              type="button"
              onClick={connectGmail}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Conectar Gmail
            </button>
          : null}
          {gmailReady ?
            <button
              type="button"
              onClick={() =>
                void disconnectGmail()
                  .then(() => loadGmailStatus())
                  .then(() => toast({ title: "Gmail desconectado" }))
              }
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted/50 transition"
            >
              Desconectar
            </button>
          : null}
        </div>
      </div>

      {pendingApproval && draftId ?
        <div className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 space-y-2">
          <p className="text-sm font-medium text-primary">Rascunho aguardando aprovação</p>
          <p className="text-xs text-muted-foreground">
            ID do rascunho: {draftId}. Revise o texto abaixo ou abra os rascunhos no Gmail antes de
            enviar.
          </p>
          {draftUrl ?
            <a
              href={draftUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-block"
            >
              Abrir rascunhos no Gmail
            </a>
          : null}
        </div>
      : null}

      <div>
        <label htmlFor="outreachNews" className="mb-2 block text-sm font-medium">
          Novidades (opcional)
        </label>
        <Textarea
          id="outreachNews"
          value={newsHighlight}
          onChange={(event) => setNewsHighlight(event.target.value)}
          placeholder="Ex.: Lançamos um novo módulo de automação para times comerciais…"
          rows={3}
          className="text-sm resize-y"
        />
      </div>

      <div>
        <label htmlFor="outreachSubject" className="mb-2 block text-sm font-medium">
          Assunto
        </label>
        <input
          id="outreachSubject"
          value={subject}
          onChange={(event) => {
            setSubject(event.target.value);
            setPendingApproval(false);
            setDraftId(null);
          }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50"
        />
      </div>

      <div>
        <label htmlFor="outreachBody" className="mb-2 block text-sm font-medium">
          Corpo do e-mail
        </label>
        <Textarea
          id="outreachBody"
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
            setPendingApproval(false);
            setDraftId(null);
          }}
          rows={18}
          className="text-sm font-mono resize-y min-h-[320px]"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void copyText(body, "Corpo")}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition"
        >
          Copiar corpo
        </button>
        <button
          type="button"
          onClick={() => {
            setSubject(draft.subject);
            setBody(draft.body);
            toast({ title: "Texto regenerado" });
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition"
        >
          Regenerar
        </button>
        <button
          type="button"
          onClick={openMailClient}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition"
        >
          Abrir no cliente de e-mail
        </button>
        {gmailReady ?
          <>
            <button
              type="button"
              disabled={savingDraft || !recipientEmail?.trim()}
              onClick={() => void handleCreateGmailDraft()}
              className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition disabled:opacity-50"
            >
              {savingDraft ? "Criando rascunho…" : "Criar rascunho no Gmail"}
            </button>
            {pendingApproval && draftId ?
              <button
                type="button"
                disabled={sending}
                onClick={() => void handleSendApproved()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
              >
                {sending ? "Enviando…" : "Aprovar e enviar"}
              </button>
            : null}
          </>
        : null}
      </div>
    </section>
  );
};

export default LeadOutreachEmailModule;
