import type { LeadSolutionCase } from "@/types/lead";

export type LeadWebsiteExtract = {
  websiteUrl: string;
  companyName?: string;
  city?: string;
  primaryGoal?: string;
  segmentSlug?: string;
  solutionCases: LeadSolutionCase[];
  rawTitle?: string;
  rawDescription?: string;
};

const CASE_SECTION_HINTS =
  /portfolio|cases|case|projetos|projeto|clientes|solu[cç][õo]es|trabalhos|servi[cç]os/i;
const MAX_CASES = 6;
const MAX_EXTRA_PAGES = 2;

const SEGMENT_KEYWORDS: Record<string, string[]> = {
  educacao: ["educação", "educacao", "escola", "universidade", "ensino", "matrícula", "matricula", "acadêmico"],
  saude: ["saúde", "saude", "clínica", "clinica", "hospital", "médico", "medico", "paciente"],
  varejo: ["varejo", "e-commerce", "ecommerce", "loja", "produtos", "varejista"],
  cultura: ["cultura", "cultural", "museu", "artes", "incentivo", "leis de incentivo"],
  tecnologia: ["software", "tecnologia", "saas", "startup", "digital", "ti"],
};

export const normalizeWebsiteUrl = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Informe a URL do site.");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const decodeHtml = (value: string): string =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

const readMetaContent = (html: string, key: string): string | undefined => {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }

  return undefined;
};

const readTitle = (html: string): string | undefined => {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeHtml(match[1]) : undefined;
};

const readJsonLdOrganizationName = (html: string): string | undefined => {
  const scripts = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (!scripts) return undefined;

  for (const script of scripts) {
    const jsonText = script.replace(/<\/?script[^>]*>/gi, "").trim();
    try {
      const data = JSON.parse(jsonText) as unknown;
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (!item || typeof item !== "object") continue;
        const record = item as Record<string, unknown>;
        if (record["@type"] === "Organization" && typeof record.name === "string") {
          return record.name.trim();
        }
        if (typeof record.name === "string" && (record["@type"] === "WebSite" || record.publisher)) {
          return record.name.trim();
        }
      }
    } catch {
      // ignore invalid JSON-LD blocks
    }
  }

  return undefined;
};

const cleanCompanyName = (value: string): string => {
  const withoutSuffix = value.split(/\s*[|\-–—]\s*/)[0]?.trim() ?? value.trim();
  return withoutSuffix.replace(/\s+(home|início|inicio|página inicial)$/i, "").trim();
};

const inferCity = (text: string): string | undefined => {
  const match = text.match(
    /\b(?:em|sede em|localizada em|localizado em)\s+([A-ZÁÉÍÓÚÂÊÔÃÇ][\wáéíóúâêôãç]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÇ][\wáéíóúâêôãç]+)?)/i,
  );
  return match?.[1]?.trim();
};

const inferSegmentSlug = (text: string): string | undefined => {
  const normalized = text.toLowerCase();
  let best: { slug: string; score: number } | undefined;

  for (const [slug, keywords] of Object.entries(SEGMENT_KEYWORDS)) {
    const score = keywords.reduce((acc, keyword) => (normalized.includes(keyword) ? acc + 1 : acc), 0);
    if (score > 0 && (!best || score > best.score)) {
      best = { slug, score };
    }
  }

  return best?.slug;
};

const stripHtml = (value: string): string =>
  decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );

const normalizeCaseTitle = (title: string): string => title.toLowerCase().replace(/\s+/g, " ").trim();

const isValidCase = (title: string, description: string): boolean => {
  if (title.length < 4 || title.length > 120) return false;
  if (description.length < 24 || description.length > 420) return false;
  if (/^(home|contato|blog|menu|saiba mais)$/i.test(title)) return false;
  return true;
};

const resolveUrl = (href: string, baseUrl: string): string | null => {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
};

const dedupeCases = (cases: LeadSolutionCase[]): LeadSolutionCase[] => {
  const seen = new Set<string>();
  const result: LeadSolutionCase[] = [];

  for (const item of cases) {
    const key = normalizeCaseTitle(item.title);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
    if (result.length >= MAX_CASES) break;
  }

  return result;
};

const extractPairsFromChunk = (chunk: string, sourceUrl: string): LeadSolutionCase[] => {
  const cases: LeadSolutionCase[] = [];

  const articlePattern =
    /<article[^>]*>[\s\S]*?<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/article>/gi;
  const headingPattern = /<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;

  for (const pattern of [articlePattern, headingPattern]) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(chunk)) !== null) {
      const title = stripHtml(match[1]);
      const description = stripHtml(match[2]);
      if (!isValidCase(title, description)) continue;

      cases.push({
        title,
        description,
        category: "Case identificado",
        sourceUrl,
      });
    }
  }

  return cases;
};

const extractCasesFromSections = (html: string, sourceUrl: string): LeadSolutionCase[] => {
  const cases: LeadSolutionCase[] = [];
  const sectionRegex =
    /<(?:section|div)[^>]*(?:id|class)=["'][^"']*(?:portfolio|cases|case|projetos|projeto|clientes|solucoes|soluções|trabalhos)[^"']*["'][^>]*>([\s\S]*?)<\/(?:section|div)>/gi;

  let match: RegExpExecArray | null;
  while ((match = sectionRegex.exec(html)) !== null) {
    cases.push(...extractPairsFromChunk(match[1], sourceUrl));
  }

  return cases;
};

const extractCasesFromJsonLd = (html: string, sourceUrl: string): LeadSolutionCase[] => {
  const cases: LeadSolutionCase[] = [];
  const scripts = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (!scripts) return cases;

  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }

    const record = node as Record<string, unknown>;
    const type = String(record["@type"] ?? "");
    const name = typeof record.name === "string" ? record.name.trim() : "";
    const description =
      typeof record.description === "string"
        ? record.description.trim()
        : typeof record.headline === "string"
          ? record.headline.trim()
          : "";

    if (name && description && /CreativeWork|Article|Product|Service|Project/i.test(type)) {
      if (isValidCase(name, description)) {
        cases.push({
          title: name,
          description: description.slice(0, 420),
          category: "Case identificado",
          sourceUrl,
        });
      }
    }

    if (Array.isArray(record.itemListElement)) {
      record.itemListElement.forEach(visit);
    }

    Object.values(record).forEach((value) => {
      if (value && typeof value === "object") visit(value);
    });
  };

  for (const script of scripts) {
    const jsonText = script.replace(/<\/?script[^>]*>/gi, "").trim();
    try {
      visit(JSON.parse(jsonText));
    } catch {
      // ignore invalid JSON-LD
    }
  }

  return cases;
};

export const extractCasesFromWebsiteHtml = (html: string, sourceUrl: string): LeadSolutionCase[] =>
  dedupeCases([
    ...extractCasesFromJsonLd(html, sourceUrl),
    ...extractCasesFromSections(html, sourceUrl),
    ...extractPairsFromChunk(html.slice(0, 120_000), sourceUrl),
  ]);

export const discoverPortfolioPageUrls = (html: string, baseUrl: string): string[] => {
  const urls = new Set<string>();
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const label = stripHtml(match[2]);
    if (!CASE_SECTION_HINTS.test(href) && !CASE_SECTION_HINTS.test(label)) continue;

    const resolved = resolveUrl(href, baseUrl);
    if (resolved) urls.add(resolved);
  }

  const defaults = ["/portfolio", "/cases", "/projetos", "/clientes", "/solucoes", "/servicos"];
  for (const path of defaults) {
    const resolved = resolveUrl(path, baseUrl);
    if (resolved) urls.add(resolved);
  }

  return [...urls].filter((url) => url !== baseUrl).slice(0, MAX_EXTRA_PAGES);
};

export const enrichCasesAsSolutions = (
  cases: LeadSolutionCase[],
  companyName: string,
): LeadSolutionCase[] =>
  cases.map((item) => ({
    ...item,
    category: "Possível solução",
    metric:
      item.metric ??
      `BuildAI pode aplicar automação e IA para potencializar "${item.title}" em ${companyName}.`,
  }));

export const parseLeadFromWebsiteHtml = (html: string, websiteUrl: string): LeadWebsiteExtract => {
  const rawTitle = readTitle(html);
  const rawDescription =
    readMetaContent(html, "og:description") ??
    readMetaContent(html, "description") ??
    readMetaContent(html, "twitter:description");

  const companyName =
    readMetaContent(html, "og:site_name") ??
    readJsonLdOrganizationName(html) ??
    (rawTitle ? cleanCompanyName(rawTitle) : undefined) ??
    cleanCompanyName(new URL(websiteUrl).hostname.replace(/^www\./, ""));

  const combinedText = [rawTitle, rawDescription, html.slice(0, 8000)].filter(Boolean).join(" ");
  const company = companyName ?? "sua empresa";
  const rawCases = extractCasesFromWebsiteHtml(html, websiteUrl);
  const solutionCases = enrichCasesAsSolutions(rawCases, company);

  return {
    websiteUrl,
    companyName,
    city: inferCity(combinedText),
    primaryGoal: rawDescription?.slice(0, 220),
    segmentSlug: inferSegmentSlug(combinedText),
    solutionCases,
    rawTitle,
    rawDescription,
  };
};

export const fetchWebsiteHtml = async (url: string): Promise<string> => {
  const normalized = normalizeWebsiteUrl(url);
  const response = await fetch(normalized, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "BuildAI-LeadExtractor/1.0",
    },
    signal: AbortSignal.timeout(15_000),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Não foi possível acessar o site (HTTP ${response.status}).`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    throw new Error("A URL não retornou uma página HTML.");
  }

  return response.text();
};

export const extractLeadFromWebsite = async (url: string): Promise<LeadWebsiteExtract> => {
  const websiteUrl = normalizeWebsiteUrl(url);
  const mainHtml = await fetchWebsiteHtml(websiteUrl);
  let result = parseLeadFromWebsiteHtml(mainHtml, websiteUrl);

  const extraUrls = discoverPortfolioPageUrls(mainHtml, websiteUrl);
  for (const pageUrl of extraUrls) {
    try {
      const html = await fetchWebsiteHtml(pageUrl);
      const extraCases = extractCasesFromWebsiteHtml(html, pageUrl);
      const merged = dedupeCases([...result.solutionCases, ...extraCases]);
      const company = result.companyName ?? "sua empresa";
      result = {
        ...result,
        solutionCases: enrichCasesAsSolutions(merged, company),
      };
    } catch {
      // ignora páginas de cases inacessíveis
    }
  }

  return result;
};
