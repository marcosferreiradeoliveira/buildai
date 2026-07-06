import type { LeadImplementationIdea } from "./leadWebsiteExtract";

export const shortenText = (text: string, max: number): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;

  const slice = normalized.slice(0, max - 1);
  const space = slice.lastIndexOf(" ");
  const cut = space > max * 0.45 ? slice.slice(0, space) : slice;
  return `${cut.trim()}…`;
};

/** Extrai um rótulo curto de um case/serviço do site (sem repetir frases inteiras). */
export const caseContextLabel = (title: string, max = 40): string => shortenText(title, max);

/** Remove títulos legados do tipo "Painel de gestão: frase enorme do site…". */
export const cleanIdeaTitleForDisplay = (title: string): string => {
  const normalized = title.replace(/\s+/g, " ").trim();
  const colonMatch = normalized.match(/^([^:]{4,42}):\s*(.+)$/);
  if (colonMatch && colonMatch[2].length > 28) {
    return colonMatch[1].trim();
  }
  return shortenText(normalized, 52);
};

export const cleanIdeaDetailForDisplay = (idea: LeadImplementationIdea): string => {
  const desc = idea.description
    .replace(/\s+/g, " ")
    .replace(/frente "[^"]+"/gi, "essa frente")
    .replace(/linha "[^"]+"/gi, "essa linha")
    .replace(/ligadas? a "[^"]+"/gi, "essa linha de atuação")
    .trim();

  const compact = shortenText(desc, 100);
  if (compact.length >= 24) return compact;
  return idea.metric ? shortenText(idea.metric, 80) : compact;
};
