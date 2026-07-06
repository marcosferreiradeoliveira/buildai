import type { LeadImplementationIdea } from "./leadWebsiteExtract";
import type { LeadSolutionCase } from "./leadWebsiteExtract";

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

/** Extrai um rótulo curto utilizável; retorna null se o título for frase de marketing incompleta. */
export const extractCaseTopic = (title: string, companyName?: string): string | null => {
  let text = title.replace(/\s+/g, " ").trim();
  if (!text || text.length < 4 || looksLikeBrokenSnippet(text)) return null;

  if (companyName) {
    text = text
      .replace(new RegExp(`^a\\s+${escapeRegExp(companyName)}\\s+`, "i"), "")
      .replace(new RegExp(`^${escapeRegExp(companyName)}\\s+`, "i"), "")
      .trim();
  }

  const integraMatch = text.match(/^integra\s+(?:a\s+)?(.+)$/i);
  if (integraMatch) text = integraMatch[1].trim();

  if (/^(é|somos|nossos?)(\s|,|$)/i.test(text)) return null;

  const words = text.split(/\s+/);
  if (words.length > 7 || text.length > 72) return null;

  return text;
};

const firstSentence = (text: string): string => {
  const match = text.match(/^[^.!?]+[.!?]?/);
  return (match?.[0] ?? text).trim();
};

const stripCompanyPrefix = (text: string, companyName?: string): string => {
  if (!companyName) return text;
  return text
    .replace(new RegExp(`^a\\s+${escapeRegExp(companyName)}[,\\s]+`, "i"), "")
    .replace(new RegExp(`^${escapeRegExp(companyName)}[,\\s]+`, "i"), "")
    .trim();
};

/** Contexto utilizável para personalizar ideias (prioriza descrição do case, depois título). */
export const derivePersonalizationHint = (
  item: Pick<LeadSolutionCase, "title" | "description">,
  companyName?: string,
): string | null => {
  const description = item.description.replace(/\s+/g, " ").trim();
  if (description.length >= 24 && !looksLikeBrokenSnippet(description)) {
    const sentence = stripCompanyPrefix(firstSentence(description), companyName);
    if (sentence.length >= 20 && sentence.length <= 110) return sentence;
    if (sentence.length > 110) {
      const words = sentence.split(/\s+/).slice(0, 14).join(" ");
      if (words.length >= 20) return words;
    }
  }

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
    if (topic.length >= 8 && topic.length <= 72 && !looksLikeBrokenSnippet(topic)) {
      return topic;
    }
  }

  return extractCaseTopic(item.title, companyName);
};

const focusPhrase = (hint: string): string => {
  if (/^(nossos?|somos|é)\b/i.test(hint)) return "na operação de vocês";
  if (/rede|programa|jornada|plataforma|frente|iniciativa/i.test(hint)) {
    return `na frente de ${hint}`;
  }
  return `em ${hint}`;
};

export const buildPersonalizedIdeaCopy = (
  companyName: string,
  hint: string | null,
  kind: "automacao" | "painel" | "ia" | "hub",
): { description: string; metric: string } => {
  const focus = hint ? focusPhrase(hint) : null;

  switch (kind) {
    case "automacao":
      return {
        description: focus
          ? `Para a ${companyName}, fluxos com IA para automatizar e escalar a operação ${focus}, com triagem, aprovações e handoff entre equipes.`
          : `Para a ${companyName}, fluxos com IA para triar demandas, aprovar entregas e repassar tarefas entre equipes sem retrabalho.`,
        metric: "Menos retrabalho entre equipes",
      };
    case "painel":
      return {
        description: focus
          ? `Para a ${companyName}, painel digital para acompanhar status, prazos e indicadores ${focus} em tempo real.`
          : `Para a ${companyName}, produto digital para centralizar status, prazos e indicadores da operação em um só lugar.`,
        metric: "Visão única da operação",
      };
    case "ia":
      return {
        description: focus
          ? `Para a ${companyName}, IA generativa para acelerar entregas, variações e materiais ${focus}, mantendo consistência.`
          : `Para a ${companyName}, IA para acelerar entregas, variações e materiais com consistência e qualidade.`,
        metric: "Mais volume sem aumentar headcount",
      };
    case "hub":
      return {
        description: focus
          ? `Para a ${companyName}, hub sob medida para organizar assets, versões e entregas ${focus} com menos fricção.`
          : `Para a ${companyName}, workflow sob medida para organizar assets, versões e entregas com menos fricção.`,
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

const cleanDescriptionText = (description: string): string =>
  description
    .replace(/\s+/g, " ")
    .replace(/frente "[^"]+"/gi, "essa frente")
    .replace(/linha "[^"]+"/gi, "essa linha")
    .replace(/ligadas? a "[^"]+"/gi, "essa linha de atuação")
    .trim();

/** Texto exibido no e-mail: descrição personalizada + benefício, sem cortes abruptos. */
export const cleanIdeaDetailForDisplay = (idea: LeadImplementationIdea): string => {
  const desc = cleanDescriptionText(idea.description);
  const metric = idea.metric?.replace(/\s+/g, " ").trim();

  if (desc.length >= 36 && !looksLikeBrokenSnippet(desc)) {
    if (metric && !desc.toLowerCase().includes(metric.toLowerCase())) {
      const combined = `${desc} → ${metric}`;
      return combined.length <= 200 ? combined : desc;
    }
    return desc.length <= 200 ? desc : firstSentence(desc);
  }

  if (metric) return metric;
  return "Solução de IA sob medida para o contexto de vocês.";
};
