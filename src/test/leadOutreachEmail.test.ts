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

    expect(email.subject).toContain("Modus Inovandi");
    expect(email.body).toContain("Olá, Ana");
    expect(email.body).toContain("Painel de gestão");
    expect(email.body).toContain("diagnóstico gratuito");
    expect(email.body).toContain("https://buildai.dev.br/lp/modus-inovandi-tecnologia");
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
