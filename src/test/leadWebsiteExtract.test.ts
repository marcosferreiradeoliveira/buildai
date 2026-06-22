import { describe, expect, it } from "vitest";
import {
  extractCasesFromWebsiteHtml,
  normalizeWebsiteUrl,
  parseLeadFromWebsiteHtml,
  sanitizeCompanyName,
  sanitizeMarkdownText,
} from "@/lib/leadWebsiteExtract";
import { parseImplementationIdeas } from "@/lib/leadWebsiteExtractAi";

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

  it("parses AI implementation ideas with valid shape", () => {
    const ideas = parseImplementationIdeas([
      {
        category: "Automação com IA",
        title: "Triagem de demandas do consumidor",
        description:
          "Classificação automática de relatos recebidos pelo instituto, com priorização por tema e urgência para a equipe jurídica.",
        metric: "Menos tempo na triagem manual",
      },
      {
        category: "MicroSaaS",
        title: "Base de conhecimento jurídica",
        description:
          "Portal com busca semântica em legislação e orientações para padronizar respostas da equipe de defesa do consumidor.",
        metric: "Respostas consistentes em escala",
      },
    ]);

    expect(ideas).toHaveLength(2);
    expect(ideas[0]?.category).toBe("Automação com IA");
    expect(ideas[0]?.title).toContain("Triagem");
  });

  it("rejects Home as company name and uses hostname brand", () => {
    const html = `
      <html>
        <head><title>Home</title></head>
        <body><p>ESG e sustentabilidade corporativa.</p></body>
      </html>
    `;

    const result = parseLeadFromWebsiteHtml(html, "https://www.esgexpert.com.br");
    expect(result.companyName?.toLowerCase()).not.toBe("home");
    expect(result.companyName).toBeTruthy();
  });

  it("summarizes primary goal in complete sentences", () => {
    const html = `
      <html>
        <head>
          <title>ESG Expert</title>
          <meta name="description" content="Da transmissão do conhecimento à aplicação prática em ESG, sua organização terá acesso a suporte digital de especialistas em todas as etapas da jornada ESG. Oferecemos todas as ferramentas necessárias para evoluir." />
        </head>
      </html>
    `;

    const result = parseLeadFromWebsiteHtml(html, "https://esgexpert.com.br");
    expect(result.primaryGoal).toMatch(/\.$/);
    expect(result.primaryGoal).not.toContain("…");
    expect(result.primaryGoal).toContain("ESG");
  });

  it("decodes HTML entities in meta description for primary goal", () => {
    const html = `
      <html>
        <head>
          <title>Contsimples</title>
          <meta name="description" content="A Contsimples &eacute; um escrit&oacute;rio de contabilidade online que disp&otilde;e de uma plataforma digital exclusiva desenvolvida para tornar mais simples a sua rela&ccedil;&atilde;o com o seu contador." />
        </head>
      </html>
    `;

    const result = parseLeadFromWebsiteHtml(html, "https://contsimples.com.br");
    expect(result.primaryGoal).toContain("é um escritório");
    expect(result.primaryGoal).toContain("relação");
    expect(result.primaryGoal).not.toContain("&eacute;");
    expect(result.primaryGoal).not.toContain("&ccedil;");
  });

  it("strips numbered page titles from company name", () => {
    expect(sanitizeCompanyName("08 Página de Vendas Modus Inovandi")).toBe("Modus Inovandi");

    const html = `
      <html>
        <head>
          <title>08 Página de Vendas Modus Inovandi</title>
          <meta property="og:site_name" content="08 Página de Vendas Modus Inovandi" />
        </head>
      </html>
    `;

    const result = parseLeadFromWebsiteHtml(html, "https://modusinovandi.com.br");
    expect(result.companyName).toBe("Modus Inovandi");
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
