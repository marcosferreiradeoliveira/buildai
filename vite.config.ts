import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { extractLeadApiPlugin } from "./vite-plugin-extract-lead-api";

const homeDescription =
  "A BuildAI cria soluções sob medida com IA para pequenas e médias empresas: atendente de WhatsApp, geradores de conteúdo, sistemas e automações.";

const caseTitles = [
  "Atendente de WhatsApp com IA",
  "LeadGen AI",
  "Green Sky",
  "Gerador de carrosséis",
  "NewsGen AI: vídeos com apresentador virtual",
  "Content Factory AI",
  "Conexão Ativa: automação de notícias",
  "Gerador de artes em lote",
  "AlphaCoach",
  "Sistemas para escritório de contabilidade",
  "GrowthOS",
];

const withRouteHtml = (
  html: string,
  meta: { title: string; description: string; canonical: string; body: string },
) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${meta.description}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${meta.canonical}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${meta.title}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${meta.description}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${meta.canonical}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${meta.title}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${meta.description}$2`)
    .replace('<div id="root"></div>', `<div id="root">${meta.body}</div>`);

const portfolioHtmlPlugin = (): Plugin => ({
  name: "portfolio-html",
  apply: "build",
  closeBundle() {
    const source = readFileSync(path.resolve(__dirname, "dist/index.html"), "utf8");
    const pages = [
      {
        file: "dist/index.html",
        title: "BuildAI | Microssistemas e automações para PMEs",
        description: homeDescription,
        canonical: "https://buildai.dev.br/",
        body: `<main><h1>Pare o retrabalho com microssistemas e automações</h1><p>${homeDescription}</p><h2>O que a gente resolve</h2><h2>Soluções que já estão rodando</h2>${[
          "Atendente de WhatsApp com IA",
          "Gerador de carrosséis",
          "NewsGen AI: vídeos com apresentador virtual",
          "Sistemas para escritório de contabilidade",
          "AlphaCoach",
          "LeadGen AI",
        ]
          .map((title) => `<h3>${title}</h3>`)
          .join("")}</main>`,
      },
      {
        file: "dist/portfolio/index.html",
        title: "Portfólio | BuildAI: sistemas, automações e IA sob medida",
        description: "Cases reais de microssistemas, automações com IA e chatbots de WhatsApp desenvolvidos pela BuildAI.",
        canonical: "https://buildai.dev.br/portfolio",
        body: `<main><h1>Soluções que já estão rodando</h1><h2>Atendimento e vendas</h2><h2>Conteúdo com IA</h2><h2>Sistemas sob medida</h2>${caseTitles
          .map((title) => `<h3>${title}</h3>`)
          .join("")}</main>`,
      },
      {
        file: "dist/privacidade/index.html",
        title: "Política de privacidade | BuildAI",
        description: "Como a BuildAI usa o Google Analytics e os dados enviados pelo formulário de contato.",
        canonical: "https://buildai.dev.br/privacidade",
        body: "<main><h1>Política de privacidade</h1><p>Este site usa o Google Analytics para entender quais páginas são visitadas.</p><p>Os dados do formulário de contato são usados só para responder o contato, pelo WhatsApp.</p></main>",
      },
    ];

    for (const page of pages) {
      const file = path.resolve(__dirname, page.file);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, withRouteHtml(source, page));
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), extractLeadApiPlugin(), portfolioHtmlPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
