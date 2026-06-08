import { describe, expect, it } from "vitest";
import {
  getSegmentImplementationIdeas,
  mergeImplementationIdeas,
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
});
