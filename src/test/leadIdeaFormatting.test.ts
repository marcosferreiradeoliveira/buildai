import { describe, expect, it } from "vitest";
import {
  cleanIdeaDetailForDisplay,
  cleanIdeaTitleForDisplay,
  extractCaseTopic,
} from "../lib/leadIdeaFormatting";

describe("leadIdeaFormatting", () => {
  it("rejects broken or marketing sentence titles", () => {
    expect(extractCaseTopic("Nossos números, são mais de ...", "Bridge3")).toBeNull();
    expect(extractCaseTopic("A Bridge3 é a sua casa para desenvolver ideias", "Bridge3")).toBeNull();
  });

  it("extracts short topics when available", () => {
    expect(extractCaseTopic("Jornada Digital ESG")).toBe("Jornada Digital ESG");
    expect(
      extractCaseTopic("A Bridge3 integra a Rede Brasil do Pacto Global da ONU", "Bridge3"),
    ).toBeNull();
  });

  it("strips legacy verbose idea titles", () => {
    expect(
      cleanIdeaTitleForDisplay(
        "Operação automatizada: A Bridge3 integra a Rede Brasil do Pacto Global",
      ),
    ).toBe("Operação automatizada");
  });

  it("uses metric in email detail instead of truncated description", () => {
    const detail = cleanIdeaDetailForDisplay({
      title: "Painel de gestão",
      category: "MicroSaaS",
      description:
        "Produto digital para a Bridge3 acompanhar status, prazos e indicadores de A Bridge3 é a sua casa…",
      metric: "Visão única da operação",
    });

    expect(detail).toBe("Visão única da operação");
    expect(detail).not.toContain("…");
  });
});
