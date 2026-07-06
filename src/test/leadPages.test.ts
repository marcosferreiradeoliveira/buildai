import { describe, expect, it } from "vitest";
import { buildLeadHeroDescription } from "../lib/leadPages";

describe("leadPages hero", () => {
  it("avoids dumping scraped marketing copy into hero", () => {
    const description = buildLeadHeroDescription(
      "Move Social",
      "evidências",
      "Somos uma empresa B, associada a Rede Brasileira de Monitoramento e Avaliação (RBMA) e a Rede Latimpacto, que atua a partir de práticas ambientais, sociais e de governança comprometidas com um futuro mais sustentável e igualitário.",
    );

    expect(description).toContain("Move Social");
    expect(description).not.toContain("Somos uma empresa");
    expect(description).not.toContain("evidências");
    expect(description).not.toContain("RBMA");
  });

  it("uses synthesized goal when it is clean", () => {
    const description = buildLeadHeroDescription(
      "Move Social",
      "São Paulo",
      "Consultoria em impacto social e monitoramento de projetos com foco em práticas ESG.",
    );

    expect(description).toContain("Move Social");
    expect(description).toContain("impacto social");
    expect(description).toContain("São Paulo");
  });
});
