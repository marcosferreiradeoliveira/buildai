import type { LeadImplementationIdea } from "./leadWebsiteExtract";

export const shortenText = (text: string, max: number): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;

  const slice = normalized.slice(0, max - 1);
  const space = slice.lastIndexOf(" ");
  const cut = space > max * 0.45 ? slice.slice(0, space) : slice;
  return `${cut.trim()}…`;
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const looksLikeBrokenSnippet = (text: string): boolean =>
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

  if (/^(é|somos|nossos?)\b/i.test(text)) return null;

  const words = text.split(/\s+/);
  if (words.length > 5 || text.length > 36) return null;

  return text;
};

/** @deprecated Prefer extractCaseTopic; kept for tests. */
export const caseContextLabel = (title: string, max = 40): string | null =>
  extractCaseTopic(title) ?? (title.length <= max ? title : null);

export const cleanIdeaTitleForDisplay = (title: string): string => {
  const normalized = title.replace(/\s+/g, " ").trim();
  const colonMatch = normalized.match(/^([^:]{4,42}):\s*(.+)$/);
  if (colonMatch && colonMatch[2].length > 28) {
    return colonMatch[1].trim();
  }
  if (normalized.length <= 52) return normalized;
  return shortenText(normalized, 52);
};

/** Linha de apoio no e-mail: prioriza métrica (sempre curta) e evita descrições truncadas. */
export const cleanIdeaDetailForDisplay = (idea: LeadImplementationIdea): string => {
  const metric = idea.metric?.replace(/\s+/g, " ").trim();
  if (metric) return metric;

  const desc = idea.description
    .replace(/\s+/g, " ")
    .replace(/frente "[^"]+"/gi, "essa frente")
    .replace(/linha "[^"]+"/gi, "essa linha")
    .replace(/ligadas? a "[^"]+"/gi, "essa linha de atuação")
    .replace(/\s*—\s*aplicável a[^.]+/gi, "")
    .replace(/\s+(de|em)\s+[^.]{30,}/gi, "")
    .trim();

  if (!desc || looksLikeBrokenSnippet(desc)) return "Oportunidade de ganho operacional com IA";

  const firstSentence = desc.match(/^[^.!?]+[.!?]/)?.[0]?.trim();
  if (firstSentence && firstSentence.length <= 100) return firstSentence;

  return desc.length <= 100 ? desc : shortenText(desc, 100);
};
