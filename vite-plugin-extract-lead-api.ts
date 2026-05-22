import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { loadEnv } from "vite";
import { deleteLeadPageServer } from "./api/lib/deleteLeadPageServer";
import { extractLeadFromWebsite, normalizeWebsiteUrl } from "./src/lib/leadWebsiteExtract";

const readJsonBody = <T extends Record<string, unknown>>(req: IncomingMessage): Promise<T> =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? (JSON.parse(raw) as T) : ({} as T));
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
  apply: "serve",
  configureServer(server) {
    const env = loadEnv(server.config.mode, server.config.envDir, "");
    if (env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
      process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
    }
    if (env.OPENAI_MODEL && !process.env.OPENAI_MODEL) {
      process.env.OPENAI_MODEL = env.OPENAI_MODEL;
    }
    if (env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
    }
    if (env.SUPABASE_URL && !process.env.SUPABASE_URL) {
      process.env.SUPABASE_URL = env.SUPABASE_URL;
    }
    if (env.VITE_SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
      process.env.VITE_SUPABASE_URL = env.VITE_SUPABASE_URL;
    }

    server.middlewares.use("/api/delete-lead-page", async (req, res, next) => {
      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.end();
        return;
      }

      if (req.method !== "POST") {
        return next();
      }

      try {
        const body = await readJsonBody<{ slug?: string; id?: string }>(req);
        const result = await deleteLeadPageServer({
          slug: typeof body.slug === "string" ? body.slug : undefined,
          id: typeof body.id === "string" ? body.id : undefined,
        });

        if (result.reason === "no_service_role") {
          sendJson(res, 503, {
            error: "Configure SUPABASE_SERVICE_ROLE_KEY no .env.local para apagar leads em dev.",
          });
          return;
        }

        if (!result.ok) {
          sendJson(res, 404, { error: "Lead não encontrado no banco." });
          return;
        }

        sendJson(res, 200, { deleted: true, ids: result.deletedIds });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao apagar lead.";
        sendJson(res, 400, { error: message });
      }
    });

    server.middlewares.use("/api/extract-lead-from-url", async (req, res, next) => {
      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.end();
        return;
      }

      if (req.method !== "POST") {
        return next();
      }

      try {
        const body = await readJsonBody<{ url?: string }>(req);
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
