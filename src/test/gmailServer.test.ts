import { describe, expect, it } from "vitest";
import { buildRawEmail } from "../../server/lib/gmailServer";

describe("gmailServer", () => {
  it("builds base64url raw email with utf-8 subject", () => {
    const raw = buildRawEmail({
      to: "cliente@empresa.com",
      subject: "BuildAI × Empresa — diagnóstico",
      body: "Olá,\n\nTexto com acentuação: implementações de IA.",
    });

    expect(raw).toMatch(/^[A-Za-z0-9_-]+$/);
    const decoded = Buffer.from(raw.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    expect(decoded).toContain("To: cliente@empresa.com");
    expect(decoded).toContain("implementações de IA");
  });

  it("builds multipart html email when bodyHtml is provided", () => {
    const raw = buildRawEmail({
      to: "cliente@empresa.com",
      subject: "Diagnóstico gratuito de IA",
      body: "Olá,\n\nTexto simples.",
      bodyHtml: "<p>Olá, <strong>Cliente</strong></p>",
    });

    const decoded = Buffer.from(raw.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    expect(decoded).toContain("multipart/alternative");
    expect(decoded).toContain("text/html; charset=UTF-8");
    expect(decoded).toContain("<strong>Cliente</strong>");
    expect(decoded).toContain("Texto simples.");
  });
});
