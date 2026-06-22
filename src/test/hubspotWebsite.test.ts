import { describe, expect, it } from "vitest";
import { resolveHubspotWebsiteUrl, websiteUrlFromEmail } from "../lib/hubspotWebsite";

describe("hubspotWebsite", () => {
  it("infers corporate website from email domain", () => {
    expect(websiteUrlFromEmail("contato@esgsolucoes.com")).toBe("https://esgsolucoes.com");
  });

  it("ignores free email providers", () => {
    expect(websiteUrlFromEmail("joao@gmail.com")).toBeUndefined();
  });

  it("prefers explicit website over email domain", () => {
    expect(
      resolveHubspotWebsiteUrl({
        website: "https://www.empresa.com.br",
        email: "a@gmail.com",
      }),
    ).toBe("https://www.empresa.com.br");
  });

  it("falls back to email domain when website is missing", () => {
    expect(
      resolveHubspotWebsiteUrl({
        email: "vendas@buildai.dev.br",
      }),
    ).toBe("https://buildai.dev.br");
  });
});
