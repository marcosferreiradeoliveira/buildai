import { describe, expect, it } from "vitest";
import {
  extractCasesFromWebsiteHtml,
  normalizeWebsiteUrl,
  parseLeadFromWebsiteHtml,
  sanitizeMarkdownText,
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

  it("rejects consumer FAQ articles as portfolio cases", () => {
    const html = `
      <h3>Direito ao arrependimento de compra ou serviço</h3>
      <p>O direito de arrependimento vale, em regra, para contratações feitas fora do estabelecimento comercial, conforme o Código de Defesa do Consumidor artigo 49.</p>
      <h3>Qual seu problema de consumo?</h3>
      <p>Digite seu problema de consumo Ordenar por relevância.</p>
    `;

    const cases = extractCasesFromWebsiteHtml(html, "https://idc.org.br");
    expect(cases).toEqual([]);
  });

  it("does not infer city from em regra", () => {
    const html = `
      <html>
        <head><title>IDC</title></head>
        <body><p>O direito vale, em regra, para contratações em São Paulo.</p></body>
      </html>
    `;
    const result = parseLeadFromWebsiteHtml(html, "https://idc.org.br");
    expect(result.city).toBe("São Paulo");
  });

  it("infers juridico segment for consumer defense sites", () => {
    const html = `
      <html>
        <head>
          <title>Instituto de Defesa de Consumidores</title>
          <meta name="description" content="Defesa do consumidor e orientação jurídica." />
        </head>
      </html>
    `;
    const result = parseLeadFromWebsiteHtml(html, "https://idc.org.br");
    expect(result.segmentSlug).toBe("juridico");
  });

  it("strips markdown images and bold fragments from jina-like text", () => {
    const dirty =
      "![Image 1](blob:http://localhost/x) **Relevância, impacto.** **Temos as palavras certas**";
    const clean = sanitizeMarkdownText(dirty);

    expect(clean).not.toContain("![");
    expect(clean).not.toContain("blob:");
    expect(clean).toContain("Relevância, impacto.");
  });
});
