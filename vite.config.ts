import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { extractLeadApiPlugin } from "./vite-plugin-extract-lead-api";

const portfolioHtmlPlugin = (): Plugin => ({
  name: "portfolio-html",
  apply: "build",
  closeBundle() {
    const title = "Portfólio | BuildAI: sistemas, automações e IA sob medida";
    const description =
      "Cases reais de microssistemas, automações com IA e chatbots de WhatsApp desenvolvidos pela BuildAI.";
    const file = path.resolve(__dirname, "dist/index.html");
    let html = readFileSync(file, "utf8");
    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1https://buildai.dev.br/portfolio$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${title}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1https://buildai.dev.br/portfolio$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${title}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${description}$2`);
    const dir = path.resolve(__dirname, "dist/portfolio");
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "index.html"), html);
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
