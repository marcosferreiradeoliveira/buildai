import { sanitizeCompanyName } from "./leadWebsiteExtract";
import { resolveImplementationIdeas } from "./leadSegmentSolutions";
import {
  cleanIdeaDetailForDisplay,
  cleanIdeaTitleForDisplay,
} from "./leadIdeaFormatting";
import type { LeadImplementationIdea, LeadSolutionCase } from "@/types/lead";

export type OutreachEmailInput = {
  companyName: string;
  contactName?: string;
  segmentSlug?: string;
  primaryGoal?: string;
  implementationIdeas?: LeadImplementationIdea[];
  solutionCases?: LeadSolutionCase[];
  landingUrl?: string;
  newsHighlight?: string;
};

export type OutreachEmail = {
  subject: string;
  body: string;
  bodyHtml: string;
};

export const OUTREACH_CALENDLY_URL = "https://calendly.com/buildaidev/30min";

const DIVIDER = "──────────────";
const CONTACT_OPENER = "Retomo o contato — espero que estejam bem.";

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const emailLink = (href: string, label: string): string =>
  `<a href="${escapeHtml(href)}" style="color:#7B5CF0;font-weight:600;text-decoration:none;">${escapeHtml(label)}</a>`;

const formatIdeasList = (ideas: LeadImplementationIdea[], company: string): string =>
  ideas
    .slice(0, 3)
    .map((item) => {
      const title = cleanIdeaTitleForDisplay(item.title);
      const detail = cleanIdeaDetailForDisplay(item, company);
      return `• ${title} · ${item.category}\n  ${detail}`;
    })
    .join("\n\n");

const formatIdeasListHtml = (ideas: LeadImplementationIdea[], company: string): string =>
  ideas
    .slice(0, 3)
    .map((item) => {
      const title = cleanIdeaTitleForDisplay(item.title);
      const detail = cleanIdeaDetailForDisplay(item, company);
      return `<li style="margin:0 0 14px;"><strong>${escapeHtml(title)}</strong> <span style="color:#64748b;font-size:13px;">· ${escapeHtml(item.category)}</span><br><span style="color:#475569;font-size:14px;">${escapeHtml(detail)}</span></li>`;
    })
    .join("");

const genericIdeasBlock = (company: string): string =>
  [
    `• Automação com IA — escala operacional para a ${company}`,
    `• MicroSaaS sob medida — produto digital exclusivo`,
    `• Copiloto de análise — decisões mais rápidas com IA`,
  ].join("\n");

const genericIdeasBlockHtml = (company: string): string =>
  [
    `<li style="margin:0 0 10px;"><strong>Automação com IA</strong> — escala operacional para a ${escapeHtml(company)}</li>`,
    `<li style="margin:0 0 10px;"><strong>MicroSaaS sob medida</strong> — produto digital exclusivo</li>`,
    `<li style="margin:0 0 10px;"><strong>Copiloto de análise</strong> — decisões mais rápidas com IA</li>`,
  ].join("");

const wrapEmailHtml = (inner: string): string =>
  `<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#1e293b;background:#ffffff;"><div style="max-width:600px;padding:8px 4px;">${inner}</div></body></html>`;

export const buildOutreachEmail = (input: OutreachEmailInput): OutreachEmail => {
  const company = sanitizeCompanyName(input.companyName) || "sua empresa";
  const contact = input.contactName?.trim();

  const ideas =
    input.implementationIdeas?.length ?
      input.implementationIdeas
    : resolveImplementationIdeas({
        solutionCases: input.solutionCases,
        segmentSlug: input.segmentSlug,
        companyName: company,
        primaryGoal: input.primaryGoal,
      });

  const greeting = contact ? `Olá, ${contact},` : `Olá, equipe ${company},`;
  const greetingHtml = contact
    ? `Olá, <strong>${escapeHtml(contact)}</strong>,`
    : `Olá, equipe <strong>${escapeHtml(company)}</strong>,`;

  const landingLead = input.landingUrl
    ? `Preparamos um diagnóstico gratuito de uso de IA para a ${company} — com implementações sugeridas para o caso de vocês:\n\n${input.landingUrl}`
    : `Mapeamos um diagnóstico gratuito de uso de IA para a ${company}.`;

  const landingLeadHtml = input.landingUrl
    ? `<p style="margin:0 0 16px;">Preparamos um <strong>diagnóstico gratuito de uso de IA</strong> para a <strong>${escapeHtml(company)}</strong> — com implementações sugeridas para o caso de vocês:</p><p style="margin:0 0 20px;">${emailLink(input.landingUrl, "Acessar diagnóstico gratuito →")}</p>`
    : `<p style="margin:0 0 20px;">Mapeamos um <strong>diagnóstico gratuito de uso de IA</strong> para a <strong>${escapeHtml(company)}</strong>.</p>`;

  const newsBlock = input.newsHighlight?.trim() ? `\n\n${input.newsHighlight.trim()}` : "";
  const newsBlockHtml = input.newsHighlight?.trim()
    ? `<p style="margin:0 0 20px;color:#475569;">${escapeHtml(input.newsHighlight.trim())}</p>`
    : "";

  const ideasBlock = ideas.length ? formatIdeasList(ideas, company) : genericIdeasBlock(company);
  const ideasBlockHtml = ideas.length ? formatIdeasListHtml(ideas, company) : genericIdeasBlockHtml(company);

  const body = `${greeting}

${CONTACT_OPENER}

${landingLead}${newsBlock}

Ideias principais:
${ideasBlock}

${DIVIDER}
Próximo passo: conversa de 30 min para priorizar (sem compromisso)
Agendar: ${OUTREACH_CALENDLY_URL}

Abraço,
Equipe BuildAI`;

  const bodyHtml = wrapEmailHtml(`
<p style="margin:0 0 16px;">${greetingHtml}</p>
<p style="margin:0 0 16px;">${CONTACT_OPENER}</p>
${landingLeadHtml}
${newsBlockHtml}
<p style="margin:0 0 8px;"><strong>Ideias principais:</strong></p>
<ul style="margin:0 0 24px;padding-left:20px;">${ideasBlockHtml}</ul>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
<p style="margin:0 0 8px;"><strong>Próximo passo:</strong> conversa de 30 min para priorizar <span style="color:#64748b;">(sem compromisso)</span></p>
<p style="margin:0 0 24px;">${emailLink(OUTREACH_CALENDLY_URL, "Agendar reunião no Calendly →")}</p>
<p style="margin:0;">Abraço,<br><strong>Equipe BuildAI</strong></p>
`);

  return {
    subject: `Diagnóstico gratuito de IA — ${company}`,
    body: body.replace(/\n{3,}/g, "\n\n").trim(),
    bodyHtml,
  };
};

export const buildMailtoUrl = (to: string | undefined, subject: string, body: string): string => {
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  const address = to?.trim() ?? "";
  return address ? `mailto:${address}?${params.toString()}` : `mailto:?${params.toString()}`;
};
