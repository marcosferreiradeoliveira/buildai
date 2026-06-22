import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { loadEnv } from "vite";
import { deleteLeadPageServer } from "./api/lib/deleteLeadPageServer";
import { enrichLeadMetadataServer } from "./api/lib/leadMetadataServer";
import {
  generateImplementationIdeasServer,
  type ImplementationIdeasContext,
} from "./api/lib/implementationIdeasServer";
import { runExtractLeadPipeline } from "./api/lib/extractLeadPipeline";
import { normalizeWebsiteUrl } from "./src/lib/leadWebsiteExtract";

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
    if (env.HUBSPOT_ACCESS_TOKEN && !process.env.HUBSPOT_ACCESS_TOKEN) {
      process.env.HUBSPOT_ACCESS_TOKEN = env.HUBSPOT_ACCESS_TOKEN;
    }
    if (env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID) {
      process.env.GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
    }
    if (env.GOOGLE_CLIENT_SECRET && !process.env.GOOGLE_CLIENT_SECRET) {
      process.env.GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
    }
    if (env.GOOGLE_REDIRECT_URI && !process.env.GOOGLE_REDIRECT_URI) {
      process.env.GOOGLE_REDIRECT_URI = env.GOOGLE_REDIRECT_URI;
    }

    const mountGmailApi = async (
      path: string,
      loader: () => Promise<{ default: (req: IncomingMessage, res: ServerResponse) => Promise<void> }>,
      methods: string[],
    ) => {
      const handler = (await loader()).default;
      server.middlewares.use(path, async (req, res, next) => {
        if (!req.method || !methods.includes(req.method)) {
          return next();
        }
        const host = req.headers.host ?? "localhost:8080";
        const url = new URL(req.url ?? "/", `http://${host}`);
        let body: string | undefined;
        if (req.method === "POST") {
          const parsed = await readJsonBody<Record<string, unknown>>(req);
          body = JSON.stringify(parsed);
        }
        const vercelReq = {
          method: req.method,
          headers: req.headers as { cookie?: string; host?: string },
          query: Object.fromEntries(url.searchParams.entries()),
          url: req.url,
          body,
        };
        await handler(vercelReq as IncomingMessage, res);
      });
    };

    void mountGmailApi("/api/gmail-oauth-start", () => import("./api/gmail-oauth-start"), ["GET"]);
    void mountGmailApi("/api/gmail-oauth-callback", () => import("./api/gmail-oauth-callback"), ["GET"]);
    void mountGmailApi("/api/gmail-status", () => import("./api/gmail-status"), ["GET", "POST", "OPTIONS"]);
    void mountGmailApi("/api/gmail-draft", () => import("./api/gmail-draft"), ["POST", "OPTIONS"]);
    void mountGmailApi("/api/gmail-send", () => import("./api/gmail-send"), ["POST", "OPTIONS"]);

    server.middlewares.use("/api/hubspot-leads", async (req, res, next) => {
      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.end();
        return;
      }

      if (req.method !== "GET") {
        return next();
      }

      try {
        const { fetchHubspotLeads } = await import("./api/lib/hubspotServer");
        const result = await fetchHubspotLeads();

        if (!result.ok) {
          if (result.reason === "no_token") {
            sendJson(res, 503, {
              error: "Configure HUBSPOT_ACCESS_TOKEN no .env.local para listar leads do HubSpot.",
            });
            return;
          }

          sendJson(res, 502, {
            error: `Não foi possível buscar leads no HubSpot.${result.detail ? ` ${result.detail}` : ""}`,
          });
          return;
        }

        sendJson(res, 200, { leads: result.leads });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao buscar leads do HubSpot.";
        sendJson(res, 500, { error: message });
      }
    });

    server.middlewares.use("/api/enrich-lead-metadata", async (req, res, next) => {
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
        const body = await readJsonBody<{
          websiteUrl?: string;
          scrapedCompanyName?: string;
          scrapedPrimaryGoal?: string;
          scrapedTitle?: string;
          scrapedDescription?: string;
          pageText?: string;
        }>(req);

        const result = await enrichLeadMetadataServer(body);
        if (!result.ok) {
          sendJson(res, 503, { error: `Enriquecimento indisponível (${result.reason}).` });
          return;
        }

        sendJson(res, 200, result.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao enriquecer metadados.";
        sendJson(res, 500, { error: message });
      }
    });

    server.middlewares.use("/api/generate-implementation-ideas", async (req, res, next) => {
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
        const body = await readJsonBody<ImplementationIdeasContext>(req);
        if (!body.companyName?.trim()) {
          sendJson(res, 400, { error: "Informe companyName." });
          return;
        }

        const result = await generateImplementationIdeasServer(body);
        if (!result.ok) {
          sendJson(res, 503, {
            error:
              result.reason === "no_api_key"
                ? "Configure OPENAI_API_KEY no .env.local para gerar propostas."
                : `Falha ao gerar propostas (${result.reason}).${result.detail ? ` ${result.detail}` : ""}`,
            implementationIdeas: [],
          });
          return;
        }

        sendJson(res, 200, { implementationIdeas: result.ideas });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao gerar propostas.";
        sendJson(res, 500, { error: message });
      }
    });

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
        const data = await runExtractLeadPipeline(url);
        sendJson(res, 200, data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao extrair dados do site.";
        sendJson(res, 400, { error: message });
      }
    });
  },
});
