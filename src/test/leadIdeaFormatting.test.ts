import { describe, expect, it } from "vitest";
import {
  buildPersonalizedIdeaCopy,
  cleanIdeaDetailForDisplay,
  cleanIdeaTitleForDisplay,
  derivePersonalizationHint,
  extractCaseTopic,
  extractShortGoalHint,
  isUsablePersonalizationHint,
  looksLikeBrokenPersonalizedDescription,
  sanitizeImplementationIdea,
  stripRedundantCompanyOpener,
} from "../lib/leadIdeaFormatting";
import { isInvalidCity } from "../lib/leadWebsiteExtract";

describe("leadIdeaFormatting", () => {
  it("rejects broken or marketing sentence titles", () => {
    expect(extractCaseTopic("Nossos números, são mais de ...", "Acme")).toBeNull();
    expect(extractCaseTopic("A Acme é a sua casa para desenvolver ideias", "Acme")).toBeNull();
  });

  it("rejects invalid city fragments", () => {
    expect(isInvalidCity("planejar suas")).toBe(true);
    expect(isInvalidCity("evidências")).toBe(true);
    expect(isInvalidCity("São Paulo")).toBe(false);
  });

  it("does not use truncated case descriptions as hints", () => {
    expect(
      derivePersonalizationHint(
        {
          title: "Serviços",
          description:
            "Atuamos como elo que busca facilitar processos institucionais capazes de apoiar a tomada de decisão baseada em evidências.",
        },
        "Move Social",
      ),
    ).toBeNull();
  });

  it("uses short case titles from any industry", () => {
    expect(
      derivePersonalizationHint(
        { title: "Gestão de Frotas", description: "Controle de veículos e manutenção preventiva." },
        "LogBrasil",
      ),
    ).toBe("Gestão de Frotas");

    expect(
      derivePersonalizationHint(
        { title: "E-commerce B2B", description: "Portal de pedidos para distribuidores." },
        "VarejoMax",
      ),
    ).toBe("E-commerce B2B");
  });

  it("extracts short goal hints from synthesized mission", () => {
    expect(
      extractShortGoalHint(
        "Operadora de turismo de aventura com reservas online e experiências guiadas no Rio de Janeiro.",
      ),
    ).toMatch(/turismo de aventura/i);
  });

  it("builds personalized copy with client context", () => {
    const copy = buildPersonalizedIdeaCopy("LogBrasil", "Gestão de Frotas", "automacao");

    expect(copy.description).toContain("Gestão de Frotas");
    expect(copy.description).not.toMatch(/^Para a /i);
    expect(copy.description).not.toContain("em Atuamos");
  });

  it("detects broken personalized descriptions", () => {
    expect(
      looksLikeBrokenPersonalizedDescription(
        "Para a Move Social, fluxos com IA para automatizar operações relacionados a Atuamos como elo que busca facilitar processos, com triagem, aprovações e handoff entre equipes.",
      ),
    ).toBe(true);
  });

  it("sanitizes broken stored ideas", () => {
    const fixed = sanitizeImplementationIdea(
      {
        title: "Automação operacional",
        category: "Automação com IA",
        description:
          "Para a Move Social, fluxos com IA para automatizar operações relacionados a Atuamos como elo que busca facilitar processos institucionais capazes de apoiar a tomada de, com triagem, aprovações e handoff entre equipes.",
        metric: "Menos retrabalho entre equipes",
      },
      "Move Social",
    );

    expect(fixed.description).not.toContain("Atuamos");
    expect(fixed.description).not.toMatch(/^Para a /i);
  });

  it("strips legacy verbose idea titles", () => {
    expect(
      cleanIdeaTitleForDisplay(
        "Operação automatizada: A Bridge3 integra a Rede Brasil do Pacto Global",
      ),
    ).toBe("Operação automatizada");
  });

  it("shows description and metric in email detail", () => {
    const detail = cleanIdeaDetailForDisplay(
      {
        title: "Automação operacional",
        category: "Automação com IA",
        description:
          "Para a LogBrasil, fluxos com IA para automatizar operações relacionados a Gestão de Frotas, com triagem, aprovações e handoff entre equipes.",
        metric: "Menos retrabalho entre equipes",
      },
      "LogBrasil",
    );

    expect(detail).toContain("Gestão de Frotas");
    expect(detail).not.toMatch(/^Para a LogBrasil/i);
    expect(detail).toContain("Menos retrabalho entre equipes");
  });

  it("strips redundant company opener from descriptions", () => {
    expect(
      stripRedundantCompanyOpener(
        "Para a Move Social, fluxos com IA para triar demandas e aprovar entregas.",
        "Move Social",
      ),
    ).toBe("Fluxos com IA para triar demandas e aprovar entregas.");
  });

  it("validates usable hints", () => {
    expect(isUsablePersonalizationHint("Gestão de Frotas")).toBe(true);
    expect(isUsablePersonalizationHint("planejar suas")).toBe(false);
    expect(isUsablePersonalizationHint("Atuamos como elo")).toBe(false);
  });
});
