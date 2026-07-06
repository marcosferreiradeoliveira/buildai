import { describe, expect, it } from "vitest";
import {
  buildIdeasFromSolutionCases,
  getSegmentImplementationIdeas,
  inferSegmentForIdeas,
  mergeImplementationIdeas,
  resolveImplementationIdeas,
} from "../lib/leadSegmentSolutions";

describe("leadSegmentSolutions", () => {
  it("returns ESG-specific ideas for esg segment", () => {
    const ideas = getSegmentImplementationIdeas("esg", "ESG Soluções");
    expect(ideas.length).toBeGreaterThanOrEqual(3);
    expect(ideas.some((item) => /esg|sustentab/i.test(item.title + item.description))).toBe(true);
  });

  it("pads partial AI ideas to at least 3 with segment fallbacks", () => {
    const merged = mergeImplementationIdeas(
      [
        {
          category: "Automação com IA",
          title: "Automação pontual",
          description:
            "Uma proposta incompleta que a IA retornou quando não havia cases no site do cliente.",
          metric: "Ganho operacional",
        },
      ],
      "esg",
      "ESG Soluções",
    );

    expect(merged.length).toBeGreaterThanOrEqual(3);
    expect(merged[0].title).toBe("Automação pontual");
  });

  it("builds 4 ideas from a single solution case", () => {
    const ideas = buildIdeasFromSolutionCases(
      [{ title: "Jornada Digital ESG", description: "Suporte digital em todas as etapas da jornada ESG." }],
      "ESG Soluções",
    );

    expect(ideas).toHaveLength(4);
    expect(new Set(ideas.map((item) => item.category)).size).toBeGreaterThanOrEqual(3);
    expect(ideas[0].title).toBe("Automação operacional");
    expect(ideas[0].description).toContain("ESG Soluções");
    expect(ideas[0].description).not.toContain("aplicável a");
    expect(ideas[0].metric).toBe("Menos retrabalho entre equipes");
  });

  it("infers esg segment from company name for fallbacks", () => {
    expect(inferSegmentForIdeas("tecnologia", "ESG Soluções", "jornada ESG")).toBe("esg");
  });

  it("resolves at least 3 ideas when only one case exists and no stored ideas", () => {
    const ideas = resolveImplementationIdeas({
      solutionCases: [
        { title: "Jornada Digital ESG", description: "Da transmissão do conhecimento à aplicação prática em ESG." },
      ],
      segmentSlug: "tecnologia",
      companyName: "ESG Soluções",
      primaryGoal: "Jornada ESG para organizações.",
    });

    expect(ideas.length).toBeGreaterThanOrEqual(3);
  });
});
