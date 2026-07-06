import { describe, expect, it } from "vitest";
import {
  cleanIdeaDetailForDisplay,
  cleanIdeaTitleForDisplay,
  caseContextLabel,
} from "../lib/leadIdeaFormatting";

describe("leadIdeaFormatting", () => {
  it("shortens long case titles for context", () => {
    const long =
      "A Bridge3 integra a Rede Brasil do Pacto Global da ONU";
    expect(caseContextLabel(long).length).toBeLessThanOrEqual(41);
    expect(caseContextLabel(long)).not.toBe(long);
  });

  it("strips legacy verbose idea titles", () => {
    expect(
      cleanIdeaTitleForDisplay(
        "Operação automatizada: A Bridge3 integra a Rede Brasil do Pacto Global",
      ),
    ).toBe("Operação automatizada");
  });

  it("compacts awkward descriptions for email", () => {
    const detail = cleanIdeaDetailForDisplay({
      title: "Painel de gestão",
      category: "MicroSaaS",
      description:
        'Produto digital para a Bridge3 acompanhar status, prazos e indicadores da linha "A Bridge3 é a sua casa para desenvolver ideias e construir conhecimento." com visão única.',
      metric: "Visão única da operação",
    });

    expect(detail.length).toBeLessThanOrEqual(101);
    expect(detail).not.toContain('"A Bridge3 é a sua casa');
  });
});
