import { describe, expect, it } from "vitest";
import {
  buildPersonalizedIdeaCopy,
  cleanIdeaDetailForDisplay,
  cleanIdeaTitleForDisplay,
  derivePersonalizationHint,
  extractCaseTopic,
} from "../lib/leadIdeaFormatting";

describe("leadIdeaFormatting", () => {
  it("rejects broken or marketing sentence titles", () => {
    expect(extractCaseTopic("Nossos números, são mais de ...", "Bridge3")).toBeNull();
    expect(extractCaseTopic("A Bridge3 é a sua casa para desenvolver ideias", "Bridge3")).toBeNull();
  });

  it("derives hint from integra titles", () => {
    expect(
      derivePersonalizationHint(
        {
          title: "A Bridge3 integra a Rede Brasil do Pacto Global da ONU",
          description: "",
        },
        "Bridge3",
      ),
    ).toBe("Rede Brasil do Pacto Global da ONU");
  });

  it("prefers case description when useful", () => {
    expect(
      derivePersonalizationHint(
        {
          title: "Programa X",
          description:
            "Consultoria em sustentabilidade e relatórios ESG para empresas de médio porte.",
        },
        "Bridge3",
      ),
    ).toContain("sustentabilidade");
  });

  it("builds personalized copy with client context", () => {
    const copy = buildPersonalizedIdeaCopy(
      "Bridge3",
      "Rede Brasil do Pacto Global da ONU",
      "automacao",
    );

    expect(copy.description).toContain("Bridge3");
    expect(copy.description).toContain("Rede Brasil do Pacto Global da ONU");
    expect(copy.description).not.toContain("…");
  });

  it("strips legacy verbose idea titles", () => {
    expect(
      cleanIdeaTitleForDisplay(
        "Operação automatizada: A Bridge3 integra a Rede Brasil do Pacto Global",
      ),
    ).toBe("Operação automatizada");
  });

  it("shows description and metric in email detail", () => {
    const detail = cleanIdeaDetailForDisplay({
      title: "Automação operacional",
      category: "Automação com IA",
      description:
        "Para a Bridge3, fluxos com IA para automatizar a operação na frente de Rede Brasil do Pacto Global da ONU.",
      metric: "Menos retrabalho entre equipes",
    });

    expect(detail).toContain("Bridge3");
    expect(detail).toContain("Rede Brasil");
    expect(detail).toContain("Menos retrabalho entre equipes");
    expect(detail).not.toContain("…");
  });
});
