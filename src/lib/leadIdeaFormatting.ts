import type { LeadImplementationIdea } from "./leadWebsiteExtract";
import type { LeadSolutionCase } from "./leadWebsiteExtract";
import { looksLikeScrapedMarketingCopy, summarizePrimaryGoal } from "./leadWebsiteExtract";

export const shortenText = (text: string, max: number): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;

  const slice = normalized.slice(0, max - 1);
  const space = slice.lastIndexOf(" ");
  const cut = space > max * 0.45 ? slice.slice(0, space) : slice;
  return `${cut.trim()}…`;
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const looksLikeBrokenSnippet = (text: string): boolean =>
  text.includes("...") || text.includes("…") || /,\s*são\s+mais\s+de/i.test(text);

/** Hint curto e utilizável para personalizar copy — vale para qualquer segmento. */
export const isUsablePersonalizationHint = (hint: string | null | undefined): hint is string => {
  if (!hint?.trim()) return false;
  const t = hint.replace(/\s+/g, " ").trim();
  if (looksLikeBrokenSnippet(t) || looksLikeScrapedMarketingCopy(t)) return false;
  if (t.length < 4 || t.length > 50) return false;
  if (/^(atuamos|somos|nós|busca|facilitar|planejar|apoiar|como|que|para|com)\b/i.test(t)) {
    return false;
  }

  const words = t.split(/\s+/);
  if (words.length > 6) return false;
  if (/^(de|da|do|das|dos|a|o|as|os|suas|seus|tomada)$/i.test(words[words.length - 1] ?? "")) {
    return false;
  }

  if (/[A-ZÁÉÍÓÚÂÊÔÃÇ]/.test(t)) return true;
  return words.length <= 4;
};

const GENERIC_CASE_TITLES =
  /^(serviços|servicos|o que fazemos|quem somos|sobre|cases|projetos|home|soluções|solucoes|contato|blog)$/i;

/** Nome curto de produto/serviço/case do site — sem frases de marketing. */
export const extractCaseTopic = (title: string, companyName?: string): string | null => {
  let text = title.replace(/\s+/g, " ").trim();
  if (!text || text.length < 4 || looksLikeBrokenSnippet(text)) return null;
  if (GENERIC_CASE_TITLES.test(text)) return null;

  if (companyName) {
    text = text
      .replace(new RegExp(`^a\\s+${escapeRegExp(companyName)}\\s+`, "i"), "")
      .replace(new RegExp(`^${escapeRegExp(companyName)}\\s+`, "i"), "")
      .trim();
  }

  const integraMatch = text.match(/^integra\s+(?:a\s+)?(.+)$/i);
  if (integraMatch) text = integraMatch[1].trim();

  if (/^(é|somos|nossos?|atuamos)(\s|,|$)/i.test(text)) return null;

  const words = text.split(/\s+/);
  if (words.length > 7 || text.length > 55) return null;

  return isUsablePersonalizationHint(text) ? text : null;
};

const firstSentence = (text: string): string => {
  const match = text.match(/^[^.!?]+[.!?]?/);
  return (match?.[0] ?? text).trim();
};

/** Trecho curto do objetivo/missão (ex.: após síntese por IA) — qualquer segmento. */
export const extractShortGoalHint = (primaryGoal: string | undefined): string | null => {
  if (!primaryGoal?.trim() || looksLikeScrapedMarketingCopy(primaryGoal)) return null;

  const summary = summarizePrimaryGoal(primaryGoal, 90).replace(/\.$/, "");
  const clause = summary.split(/[,;]/)[0]?.trim() ?? summary;
  const shortClause = clause.split(/\s+/).slice(0, 5).join(" ");
  if (isUsablePersonalizationHint(shortClause)) return shortClause;
  return isUsablePersonalizationHint(clause) ? clause : null;
};

/** Contexto de personalização: título do case ou missão resumida — nunca trecho cru do site. */
export const derivePersonalizationHint = (
  item: Pick<LeadSolutionCase, "title" | "description">,
  companyName?: string,
): string | null => {
  const fromTitle = extractCaseTopic(item.title, companyName);
  if (fromTitle) return fromTitle;

  let title = item.title.replace(/\s+/g, " ").trim();
  if (companyName) {
    title = title
      .replace(new RegExp(`^a\\s+${escapeRegExp(companyName)}\\s+`, "i"), "")
      .replace(new RegExp(`^${escapeRegExp(companyName)}\\s+`, "i"), "")
      .trim();
  }

  const integraMatch = title.match(/^integra\s+(?:a\s+)?(.+)$/i);
  if (integraMatch) {
    const topic = integraMatch[1].trim();
    if (isUsablePersonalizationHint(topic)) return topic;
  }

  return null;
};

export const looksLikeBrokenPersonalizedDescription = (description: string): boolean => {
  const normalized = description.replace(/\s+/g, " ").toLowerCase();
  if (/operação em (atuamos|planejar|apoiar|busca|facilitar|suas)\b/.test(normalized)) return true;
  if (/indicadores em (atuamos|planejar|apoiar|busca|facilitar)\b/.test(normalized)) return true;
  if (/materiais em (atuamos|planejar|apoiar|busca|facilitar)\b/.test(normalized)) return true;
  if (/entregas em (atuamos|planejar|apoiar|busca|facilitar)\b/.test(normalized)) return true;
  if (/relacionados a (atuamos|planejar|apoiar|busca|facilitar|suas)\b/.test(normalized)) return true;
  if (/tomada de[,]?\s*(com triagem|$)/.test(normalized)) return true;
  return false;
};

const categoryToKind = (category: string): "automacao" | "painel" | "ia" | "hub" => {
  if (/microsaas|painel/i.test(category)) return "painel";
  if (/generativa/i.test(category)) return "ia";
  if (/software|hub/i.test(category)) return "hub";
  return "automacao";
};

export const sanitizeImplementationIdea = (
  idea: LeadImplementationIdea,
  companyName: string,
): LeadImplementationIdea => {
  if (!looksLikeBrokenPersonalizedDescription(idea.description)) return idea;
  const copy = buildPersonalizedIdeaCopy(companyName, null, categoryToKind(idea.category));
  return { ...idea, description: copy.description };
};

export const buildPersonalizedIdeaCopy = (
  _companyName: string,
  hint: string | null,
  kind: "automacao" | "painel" | "ia" | "hub",
): { description: string; metric: string } => {
  const focus = isUsablePersonalizationHint(hint) ? ` relacionados a ${hint}` : "";

  switch (kind) {
    case "automacao":
      return {
        description: focus
          ? `Fluxos com IA para automatizar operações${focus}, com triagem, aprovações e handoff entre equipes.`
          : `Fluxos com IA para triar demandas, aprovar entregas e repassar tarefas entre equipes sem retrabalho.`,
        metric: "Menos retrabalho entre equipes",
      };
    case "painel":
      return {
        description: focus
          ? `Painel digital para acompanhar status, prazos e indicadores${focus} em tempo real.`
          : `Produto digital para centralizar status, prazos e indicadores da operação em um só lugar.`,
        metric: "Visão única da operação",
      };
    case "ia":
      return {
        description: focus
          ? `IA generativa para acelerar entregas, variações e materiais${focus}, mantendo consistência.`
          : `IA para acelerar entregas, variações e materiais com consistência e qualidade.`,
        metric: "Mais volume sem aumentar headcount",
      };
    case "hub":
      return {
        description: focus
          ? `Hub sob medida para organizar assets, versões e entregas${focus} com menos fricção.`
          : `Workflow sob medida para organizar assets, versões e entregas com menos fricção.`,
        metric: "Menos fricção entre equipes e clientes",
      };
  }
};

export const cleanIdeaTitleForDisplay = (title: string): string => {
  const normalized = title.replace(/\s+/g, " ").trim();
  const colonMatch = normalized.match(/^([^:]{4,42}):\s*(.+)$/);
  if (colonMatch && colonMatch[2].length > 28) {
    return colonMatch[1].trim();
  }
  if (normalized.length <= 52) return normalized;
  return shortenText(normalized, 52);
};

const companyNameVariants = (companyName: string): string[] => {
  const trimmed = companyName.replace(/\s+/g, " ").trim();
  if (!trimmed) return [];

  const variants = new Set<string>([trimmed]);
  const withoutArticle = trimmed.replace(/^A\s+/i, "").trim();
  if (withoutArticle) variants.add(withoutArticle);
  if (!/^A\s+/i.test(trimmed)) variants.add(`A ${trimmed}`);
  return [...variants];
};

/** Remove abertura repetitiva "Para a [empresa]," — o nome já está no título da seção. */
export const stripRedundantCompanyOpener = (
  description: string,
  companyName?: string,
): string => {
  let result = description.replace(/\s+/g, " ").trim();
  if (!result || !companyName?.trim()) return result;

  for (const name of companyNameVariants(companyName)) {
    const escaped = escapeRegExp(name);
    result = result.replace(
      new RegExp(`^Para\\s+(?:a\\s+)?${escaped}[,:\\s–—-]+\\s*`, "i"),
      "",
    );
  }

  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result.trim();
};

export const formatIdeaDescriptionForDisplay = (
  description: string,
  companyName?: string,
): string =>
  stripRedundantCompanyOpener(cleanDescriptionText(description), companyName);

const cleanDescriptionText = (description: string): string =>
  description
    .replace(/\s+/g, " ")
    .replace(/frente "[^"]+"/gi, "essa frente")
    .replace(/linha "[^"]+"/gi, "essa linha")
    .replace(/ligadas? a "[^"]+"/gi, "essa linha de atuação")
    .trim();

/** Texto exibido no e-mail: descrição personalizada + benefício, sem cortes abruptos. */
export const cleanIdeaDetailForDisplay = (
  idea: LeadImplementationIdea,
  companyName?: string,
): string => {
  const desc = formatIdeaDescriptionForDisplay(idea.description, companyName);
  const metric = idea.metric?.replace(/\s+/g, " ").trim();

  if (
    desc.length >= 36 &&
    !looksLikeBrokenSnippet(desc) &&
    !looksLikeBrokenPersonalizedDescription(desc)
  ) {
    if (metric && !desc.toLowerCase().includes(metric.toLowerCase())) {
      const combined = `${desc} → ${metric}`;
      return combined.length <= 200 ? combined : desc;
    }
    return desc.length <= 200 ? desc : firstSentence(desc);
  }

  if (metric) return metric;
  return "Solução de IA sob medida para o contexto de vocês.";
};
