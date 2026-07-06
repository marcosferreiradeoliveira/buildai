import { describe, expect, it } from "vitest";
import { buildOutreachEmail } from "../lib/leadOutreachEmail";

describe("leadOutreachEmail", () => {
  it("includes company name, ideas and free diagnostic offer", () => {
    const email = buildOutreachEmail({
      companyName: "Modus Inovandi",
      contactName: "Ana",
      implementationIdeas: [
        {
          category: "MicroSaaS",
          title: "Painel de gestão",
          description: "Produto digital para acompanhar indicadores em tempo real.",
          metric: "Visão única da operação",
        },
      ],
      landingUrl: "https://buildai.dev.br/lp/modus-inovandi-tecnologia",
    });

    expect(email.subject).toContain("Diagnóstico gratuito de IA");
    expect(email.subject).toContain("Modus Inovandi");
    expect(email.body).toContain("Olá, Ana");
    expect(email.body).toContain("Retomo o contato");
    expect(email.body).toContain("espero que estejam bem");
    expect(email.body).toContain("diagnóstico gratuito de uso de IA");
    expect(email.body).toContain("Painel de gestão");
    expect(email.body).toContain("Ideias principais:");
    expect(email.body).toContain("https://calendly.com/buildaidev/30min");
    expect(email.body).toContain("https://buildai.dev.br/lp/modus-inovandi-tecnologia");
    expect(email.bodyHtml).toContain("<strong>diagnóstico gratuito de uso de IA</strong>");
    expect(email.bodyHtml).toContain("<strong>Painel de gestão</strong>");
    expect(email.bodyHtml).toContain("https://calendly.com/buildaidev/30min");
  });

  it("falls back to segment ideas when none provided", () => {
    const email = buildOutreachEmail({
      companyName: "ESG Soluções",
      segmentSlug: "esg",
    });

    expect(email.body).toMatch(/implementações|Automação|MicroSaaS/i);
    expect(email.body).toContain("ESG Soluções");
  });
});
