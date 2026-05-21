import { describe, expect, it } from "vitest";
import {
  extractCasesFromWebsiteHtml,
  normalizeWebsiteUrl,
  parseLeadFromWebsiteHtml,
} from "@/lib/leadWebsiteExtract";

describe("leadWebsiteExtract", () => {
  it("normalizes urls without protocol", () => {
    expect(normalizeWebsiteUrl("alter.com.br")).toBe("https://alter.com.br");
  });

  it("extracts company and description from html metadata", () => {
    const html = `
      <html>
        <head>
          <title>Alter Educação | Plataforma de ensino</title>
          <meta property="og:site_name" content="Alter Educação" />
          <meta name="description" content="Soluções digitais para escolas em São Paulo." />
        </head>
      </html>
    `;

    const result = parseLeadFromWebsiteHtml(html, "https://alter.com.br");

    expect(result.companyName).toBe("Alter Educação");
    expect(result.primaryGoal).toContain("Soluções digitais");
    expect(result.segmentSlug).toBe("educacao");
    expect(result.city).toBe("São Paulo");
    expect(result.solutionCases).toEqual([]);
  });

  it("extracts cases from portfolio sections as possible solutions", () => {
    const html = `
      <section id="portfolio">
        <h2>Cases</h2>
        <h3>Plataforma de Matrículas</h3>
        <p>Automatizamos captação e conversão de alunos com fluxos omnichannel para escolas de médio e grande porte.</p>
        <h3>Retenção Acadêmica</h3>
        <p>Painel preditivo com alertas de evasão e recomendações de intervenção para coordenadores pedagógicos.</p>
      </section>
    `;

    const cases = extractCasesFromWebsiteHtml(html, "https://alter.com.br");

    expect(cases.length).toBeGreaterThanOrEqual(2);
    expect(cases[0]?.title).toContain("Matrículas");
    expect(cases[0]?.description.length).toBeGreaterThan(20);
  });
});
