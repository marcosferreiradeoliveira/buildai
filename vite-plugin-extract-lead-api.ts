import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { extractLeadFromWebsite, normalizeWebsiteUrl } from "./src/lib/leadWebsiteExtract";

const readJsonBody = (req: IncomingMessage): Promise<{ url?: string }> =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? (JSON.parse(raw) as { url?: string }) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

export const extractLeadApiPlugin = (): Plugin => ({
  name: "extract-lead-api",
  configureServer(server) {
    server.middlewares.use("/api/extract-lead-from-url", async (req, res, next) => {
      if (req.method !== "POST") {
        return next();
      }

      try {
        const body = await readJsonBody(req);
        const url = typeof body.url === "string" ? body.url : "";
        normalizeWebsiteUrl(url);
        const data = await extractLeadFromWebsite(url);
        sendJson(res, 200, data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao extrair dados do site.";
        sendJson(res, 400, { error: message });
      }
    });
  },
});
