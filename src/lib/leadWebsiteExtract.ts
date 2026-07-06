export type LeadSolutionCase = {
  title: string;
  description: string;
  category?: string;
  metric?: string;
  imageSrc?: string;
  sourceUrl?: string;
};

export type LeadImplementationIdea = {
  title: string;
  category: string;
  description: string;
  metric: string;
};

export type LeadWebsiteExtract = {
  websiteUrl: string;
  companyName?: string;
  city?: string;
  primaryGoal?: string;
  segmentSlug?: string;
  solutionCases: LeadSolutionCase[];
  implementationIdeas?: LeadImplementationIdea[];
  rawTitle?: string;
  rawDescription?: string;
};

const CASE_SECTION_HINTS =
  /portfolio|cases|case|projetos|projeto|clientes|solu[cç][õo]es|trabalhos/i;
const SKIP_PAGE_PATH_HINTS =
  /problema|consumidor|direito|faq|artigo|noticia|notícia|blog\/|tag\/|categoria|pesquisa|busca|ajuda|suporte|termos|privacidade/i;
const MAX_CASES = 6;
const MAX_EXTRA_PAGES = 2;

/** Títulos/descrições típicos de FAQ, artigos jurídicos e busca — não são cases de portfólio. */
const NON_PORTFOLIO_TEXT =
  /qual\s+seu\s+problema|ordenar\s+por|digite\s+seu|pesquisar|resultados?\s+para|menu\s+principal/i;
const NON_PORTFOLIO_TITLE =
  /^(direito|cancelamento|defeito|plano\s+individual|negativa\s+de|o\s+direito|há\s+duas)/i;
const NON_PORTFOLIO_LEGAL =
  /consumidor|arrependimento|c[oó]digo de defesa|\bcdc\b|fornecedor descumpre|artigo\s+\d+|plano de sa[uú]de|procon|defesa do consumidor|contrata[cç][aã]o feita fora/i;

const INVALID_CITY_WORDS = new Set([
  "regra",
  "caso",
  "geral",
  "seguida",
  "primeiro",
  "momento",
  "prazo",
  "todas",
  "etapas",
  "jornada",
  "acesso",
  "oferecemos",
  "evidências",
  "evidencias",
  "práticas",
  "praticas",
  "baseado",
  "comprometidas",
  "sustentável",
  "sustentavel",
  "planejar",
  "planejamento",
  "atuamos",
  "facilitar",
  "institucionais",
  "processos",
  "suas",
  "seus",
  "tomada",
]);

const looksLikePlaceName = (city: string): boolean =>
  city
    .trim()
    .split(/\s+/)
    .some((word) => /^[A-ZÁÉÍÓÚÂÊÔÃÇ]/.test(word));

export const isInvalidCity = (city: string | undefined): boolean => {
  if (!city?.trim()) return true;
  const normalized = city.trim().toLowerCase();
  if (normalized.length < 4 || normalized.length > 40) return true;
  const first = normalized.split(/\s+/)[0];
  if (first && INVALID_CITY_WORDS.has(first)) return true;
  if (/todas|etapas|jornada|oferecemos|planejar|atuamos|facilitar|suas|seus|tomada/i.test(normalized)) {
    return true;
  }
  if (!looksLikePlaceName(city)) return true;
  return false;
};

const SEGMENT_KEYWORDS: Record<string, string[]> = {
  educacao: ["educação", "educacao", "escola", "universidade", "ensino", "matrícula", "matricula", "pedagógico"],
  saude: ["saúde", "saude", "clínica", "clinica", "hospital", "médico", "medico", "paciente"],
  varejo: ["varejo", "e-commerce", "ecommerce", "loja", "produtos", "varejista"],
  cultura: ["cultura", "cultural", "museu", "artes", "incentivo", "leis de incentivo"],
  tecnologia: ["software", "tecnologia", "saas", "startup", "digital", "ti"],
  juridico: ["advocacia", "jurídico", "juridico", "defesa do consumidor", "direito do consumidor", "procon"],
  comunicacao: [
    "comunicação",
    "comunicacao",
    "agência",
    "agencia",
    "branding",
    "assessoria de imprensa",
    "reputação",
    "campanha",
    "conteúdo",
    "conteudo",
  ],
  esg: [
    "esg",
    "sustentabilidade",
    "sustentável",
    "sustentavel",
    "governança",
    "governanca",
    "ambiental",
    "social",
    "carbono",
    "emissões",
    "emissoes",
    "relatório de sustentabilidade",
    "relatorio de sustentabilidade",
  ],
};

export const normalizeWebsiteUrl = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Informe a URL do site.");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const HTML_NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  aacute: "á",
  Aacute: "Á",
  acirc: "â",
  Acirc: "Â",
  agrave: "à",
  Agrave: "À",
  atilde: "ã",
  Atilde: "Ã",
  auml: "ä",
  Auml: "Ä",
  aring: "å",
  Aring: "Å",
  eacute: "é",
  Eacute: "É",
  ecirc: "ê",
  Ecirc: "Ê",
  egrave: "è",
  Egrave: "È",
  iacute: "í",
  Iacute: "Í",
  icirc: "î",
  Icirc: "Î",
  iuml: "ï",
  Iuml: "Ï",
  oacute: "ó",
  Oacute: "Ó",
  ocirc: "ô",
  Ocirc: "Ô",
  ograve: "ò",
  Ograve: "Ò",
  otilde: "õ",
  Otilde: "Õ",
  ouml: "ö",
  Ouml: "Ö",
  uacute: "ú",
  Uacute: "Ú",
  ucirc: "û",
  Ucirc: "Û",
  ugrave: "ù",
  Ugrave: "Ù",
  uuml: "ü",
  Uuml: "Ü",
  ccedil: "ç",
  Ccedil: "Ç",
  ntilde: "ñ",
  Ntilde: "Ñ",
  ordm: "º",
  ordf: "ª",
  middot: "·",
  bull: "•",
  hellip: "…",
  copy: "©",
  reg: "®",
  trade: "™",
  euro: "€",
};

const decodeHtmlOnce = (value: string): string =>
  value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : `&#x${hex};`;
    })
    .replace(/&#(\d+);/g, (_, num) => {
      const code = Number.parseInt(num, 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : `&#${num};`;
    })
    .replace(/&([a-zA-Z]+);/g, (entity, name) => HTML_NAMED_ENTITIES[name] ?? entity);

/** Decodifica entidades HTML (&eacute;, &#233;, etc.), inclusive duplamente codificadas. */
export const decodeHtmlEntities = (value: string): string => {
  if (!value) return "";

  let decoded = value;
  for (let i = 0; i < 3; i++) {
    const next = decodeHtmlOnce(decoded);
    if (next === decoded) break;
    decoded = next;
  }

  return decoded.replace(/\u00A0/g, " ").trim();
};

const decodeHtml = decodeHtmlEntities;

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

const INVALID_COMPANY_NAMES = new Set([
  "home",
  "início",
  "inicio",
  "página inicial",
  "pagina inicial",
  "menu",
  "contato",
  "sobre",
  "quem somos",
  "blog",
  "portfolio",
  "portfólio",
  "serviços",
  "servicos",
  "produtos",
  "soluções",
  "solucoes",
  "welcome",
  "index",
]);

export const isInvalidCompanyName = (value: string | undefined): boolean => {
  if (!value?.trim()) return true;
  const normalized = value.trim().toLowerCase();
  if (INVALID_COMPANY_NAMES.has(normalized)) return true;
  if (normalized.length < 3) return true;
  if (/^https?:\/\//i.test(normalized)) return true;
  if (/\.(com|br|org|net)$/i.test(normalized) && !normalized.includes(" ")) return true;
  if (/^\d{1,3}\s*[-.)]?\s*\w/.test(normalized)) return true;
  if (/^(página|pagina|landing|home page|site|page)\b/.test(normalized)) return true;
  if (/página de vendas|pagina de vendas|landing page/i.test(normalized)) return true;
  return false;
};

/** Remove numeração, títulos de página e ruído — extrai a marca (ex: "08 Página de Vendas Modus Inovandi" → "Modus Inovandi"). */
export const sanitizeCompanyName = (value: string): string => {
  let name = sanitizeMarkdownText(value).trim();
  if (!name) return name;

  const segments = name.split(/\s*[|\-–—:]\s*/).map((part) => part.trim()).filter(Boolean);
  if (segments.length > 1) {
    const meaningful = segments.find((part) => !isInvalidCompanyName(part));
    name = meaningful ?? segments[0] ?? name;
  }

  name = name.replace(/^\d{1,3}\s*[-.)]?\s*/, "");

  const pagePrefix =
    /^(página de vendas|pagina de vendas|landing page|página inicial|pagina inicial|página|pagina|home page|site|page)\s+(de\s+)?/i;
  while (pagePrefix.test(name)) {
    name = name.replace(pagePrefix, "").trim();
  }

  return stripLeadingArticleFromCompanyName(
    name.replace(/\s+(home|início|inicio|página inicial|pagina inicial)$/i, "").trim(),
  );
};

/** Texto colado do site (ex.: "Somos uma empresa B...") — não serve para hero nem metadados finais. */
export const looksLikeScrapedMarketingCopy = (text: string): boolean => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return true;
  if (normalized.length > 170) return true;
  if (/^somos\b/i.test(normalized)) return true;
  if (/^nós\b/i.test(normalized)) return true;
  if (/^a\s+\w+\s+é\b/i.test(normalized)) return true;
  if (/empresa\s+b\b/i.test(normalized)) return true;
  if (/associad[oa]\s+(?:à|a)\s+rede/i.test(normalized)) return true;
  return false;
};

const stripLeadingArticleFromCompanyName = (name: string): string => {
  if (/^A\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÇ])/.test(name) && !/^A\s+\d/.test(name)) {
    return name.replace(/^A\s+/, "").trim();
  }
  return name;
};

const companyNameFromHostname = (websiteUrl: string): string => {
  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./, "");
    const brand = host.split(".")[0] ?? host;
    return brand
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  } catch {
    return "Empresa";
  }
};

const cleanCompanyName = (value: string): string => sanitizeCompanyName(value);

const resolveCompanyName = (
  html: string,
  websiteUrl: string,
  rawTitle?: string,
): string => {
  const candidates = [
    readMetaContent(html, "og:site_name"),
    readJsonLdOrganizationName(html),
    rawTitle ? cleanCompanyName(rawTitle) : undefined,
    companyNameFromHostname(websiteUrl),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const cleaned = sanitizeCompanyName(candidate);
    if (cleaned && !isInvalidCompanyName(cleaned)) {
      return cleaned;
    }
  }

  return companyNameFromHostname(websiteUrl);
};

/** Resume missão/oferta em 1–2 frases completas (sem reticências). */
export const summarizePrimaryGoal = (text: string, maxChars = 220): string => {
  const clean = sanitizeMarkdownText(text).replace(/…+/g, "").trim();
  if (!clean) return "";

  const sentences = clean.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [];
  if (sentences.length) {
    const first = sentences[0];
    const two = sentences[1] ? `${first} ${sentences[1]}`.trim() : first;
    if (two.length <= maxChars) return two;
    return first;
  }

  if (clean.length <= maxChars) return clean;

  const slice = clean.slice(0, maxChars);
  const boundary = slice.lastIndexOf(" ");
  return (boundary > 0 ? slice.slice(0, boundary) : slice).trim();
};

const inferCity = (text: string): string | undefined => {
  const cityRegex =
    /\b(?:em|sede em|localizada em|localizado em)\s+([A-ZÁÉÍÓÚÂÊÔÃÇ][\wáéíóúâêôãç]+(?:\s+(?:(?:do|de|da)\s+)?[A-ZÁÉÍÓÚÂÊÔÃÇ][\wáéíóúâêôãç]+)?)/gi;

  let match: RegExpExecArray | null;
  while ((match = cityRegex.exec(text)) !== null) {
    const city = match[1]?.trim();
    if (!city) continue;

    if (isInvalidCity(city)) continue;

    return city;
  }

  return undefined;
};

const isLegalOrFaqContent = (title: string, description: string): boolean => {
  const combined = `${title} ${description}`.toLowerCase();
  return (
    NON_PORTFOLIO_TEXT.test(combined) ||
    NON_PORTFOLIO_TITLE.test(title) ||
    NON_PORTFOLIO_LEGAL.test(combined)
  );
};

const isLikelyLegalSnippet = (text: string): boolean =>
  NON_PORTFOLIO_LEGAL.test(text) || /\bartigo\s+\d+\b/i.test(text) || /em regra,?\s+para/i.test(text);

const truncateAtWord = (text: string, max: number): string => {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const slice = trimmed.slice(0, max);
  const boundary = slice.lastIndexOf(" ");
  return `${(boundary > 0 ? slice.slice(0, boundary) : slice).trim()}…`;
};

const extractAboutSnippet = (html: string): string | undefined => {
  const aboutMatch = html.match(
    /<(?:section|div)[^>]*(?:quem-somos|about|sobre)[^>]*>[\s\S]*?<p[^>]*>([^<]{60,500})<\/p>/i,
  );
  if (aboutMatch?.[1]) return stripHtml(aboutMatch[1]);

  const firstParagraph = html.match(/<p[^>]*>([^<]{80,400})<\/p>/i);
  return firstParagraph?.[1] ? stripHtml(firstParagraph[1]) : undefined;
};

const inferSegmentSlug = (text: string): string | undefined => {
  const normalized = text.toLowerCase();

  if (/defesa do consumidor|instituto.*consumidor|direito do consumidor|procon\b/i.test(normalized)) {
    return "juridico";
  }

  let best: { slug: string; score: number } | undefined;

  for (const [slug, keywords] of Object.entries(SEGMENT_KEYWORDS)) {
    const score = keywords.reduce((acc, keyword) => (normalized.includes(keyword) ? acc + 1 : acc), 0);
    if (score > 0 && (!best || score > best.score)) {
      best = { slug, score };
    }
  }

  // "academia" em artigo de consumidor não deve classificar como educação
  if (best?.slug === "educacao" && NON_PORTFOLIO_LEGAL.test(normalized)) {
    return "juridico";
  }

  return best?.slug;
};

const stripHtml = (value: string): string =>
  sanitizeMarkdownText(
    decodeHtml(
      value
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    ),
  );

/** Remove lixo de markdown (imagens blob, links, negrito) vindo do Jina Reader. */
export const sanitizeMarkdownText = (value: string): string =>
  decodeHtmlEntities(value)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`[^`]+`/g, " ")
    .replace(/blob:[^\s)]+/gi, " ")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeCaseTitle = (title: string): string =>
  sanitizeMarkdownText(title).toLowerCase().replace(/\s+/g, " ").trim();

const isValidCase = (title: string, description: string): boolean => {
  const cleanTitle = sanitizeMarkdownText(title);
  const cleanDescription = sanitizeMarkdownText(description);

  if (cleanTitle.length < 12 || cleanTitle.length > 100) return false;
  if (cleanDescription.length < 40 || cleanDescription.length > 420) return false;
  if (/^(home|contato|blog|menu|saiba mais|quem somos)$/i.test(cleanTitle)) return false;
  if (/^\d{1,3}\s*[-.)]?\s*(página|pagina|page|landing)/i.test(cleanTitle)) return false;
  if (/página de vendas|pagina de vendas|landing page/i.test(cleanTitle)) return false;
  if (/[!\[\]{}]|blob:|\.(png|jpe?g|webp|gif|svg)\b/i.test(cleanTitle)) return false;
  if (/^\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/i.test(cleanTitle)) return false;
  if ((cleanTitle.match(/\*\*/g) ?? []).length > 0) return false;

  const titleWords = cleanTitle.split(" ").filter(Boolean);
  if (titleWords.length < 2) return false;
  if (titleWords.length < 3 && cleanTitle.length < 18) return false;

  // Frases cortadas típicas de blocos de marketing (não são cases)
  if (
    /^(temos as|comunicação que|relevância|impacto|multiplica experiências|informa, educa)/i.test(
      cleanTitle,
    )
  ) {
    return false;
  }

  if (isLegalOrFaqContent(cleanTitle, cleanDescription)) return false;

  return true;
};

export const filterValidCases = (cases: LeadSolutionCase[]): LeadSolutionCase[] =>
  cases
    .map((item) => ({
      ...item,
      title: sanitizeMarkdownText(item.title),
      description: sanitizeMarkdownText(item.description),
    }))
    .filter((item) => isValidCase(item.title, item.description));

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

export const extractCasesFromWebsiteHtml = (html: string, sourceUrl: string): LeadSolutionCase[] => {
  const fromPortfolio = dedupeCases([
    ...extractCasesFromJsonLd(html, sourceUrl),
    ...extractCasesFromSections(html, sourceUrl),
  ]);
  if (fromPortfolio.length) return fromPortfolio;

  // HTML sintético do Jina (só <article> com cases já filtrados)
  if (/<article[^>]*>[\s\S]*?<h[2-4]/i.test(html)) {
    return dedupeCases(extractPairsFromChunk(html, sourceUrl));
  }

  return [];
};

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

  const defaults = ["/portfolio", "/cases", "/projetos", "/clientes"];
  for (const path of defaults) {
    const resolved = resolveUrl(path, baseUrl);
    if (resolved) urls.add(resolved);
  }

  return [...urls]
    .filter((url) => url !== baseUrl && !SKIP_PAGE_PATH_HINTS.test(url))
    .slice(0, MAX_EXTRA_PAGES);
};

export const enrichCasesAsSolutions = (
  cases: LeadSolutionCase[],
  companyName: string,
): LeadSolutionCase[] =>
  cases.map((item) => ({
    ...item,
    category: "Case do lead",
    metric:
      item.metric ??
      `Contexto identificado no site da ${companyName} — base para ideia de implementação BuildAI.`,
  }));

export const parseLeadFromWebsiteHtml = (html: string, websiteUrl: string): LeadWebsiteExtract => {
  const rawTitle = readTitle(html);
  const rawDescription =
    readMetaContent(html, "og:description") ??
    readMetaContent(html, "description") ??
    readMetaContent(html, "twitter:description");

  const companyName = resolveCompanyName(html, websiteUrl, rawTitle);

  const combinedText = [rawTitle, rawDescription, html.slice(0, 8000)].filter(Boolean).join(" ");
  const company = companyName ?? "sua empresa";
  const rawCases = extractCasesFromWebsiteHtml(html, websiteUrl);
  const validCases = filterValidCases(rawCases);
  const solutionCases = enrichCasesAsSolutions(validCases, company);
  const cleanDescription = sanitizeMarkdownText(rawDescription ?? "");
  const aboutSnippet = sanitizeMarkdownText(extractAboutSnippet(html) ?? "");
  const goalSource =
    cleanDescription.length >= 40 && !isLikelyLegalSnippet(cleanDescription)
      ? cleanDescription
      : aboutSnippet.length >= 40 && !isLikelyLegalSnippet(aboutSnippet)
        ? aboutSnippet
        : `${company} — presença digital e operação com foco em resultado.`;
  const primaryGoal = summarizePrimaryGoal(goalSource, 220);

  return {
    websiteUrl,
    companyName,
    city: (() => {
      const city = inferCity(combinedText);
      return city && !isInvalidCity(city) ? city : undefined;
    })(),
    primaryGoal,
    segmentSlug: inferSegmentSlug(combinedText),
    solutionCases,
    rawTitle,
    rawDescription,
  };
};

const fetchWithTimeout = async (url: string, timeoutMs = 15_000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "BuildAI-LeadExtractor/1.0",
      },
      signal: controller.signal,
      redirect: "follow",
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchWebsiteHtml = async (url: string): Promise<string> => {
  const normalized = normalizeWebsiteUrl(url);
  const response = await fetchWithTimeout(normalized);

  if (!response.ok) {
    throw new Error(`Não foi possível acessar o site (HTTP ${response.status}).`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    throw new Error("A URL não retornou uma página HTML.");
  }

  return response.text();
};

/** Jina Reader: contorna bloqueio de proxies e CORS no navegador. */
export const fetchWebsiteHtmlViaJina = async (url: string): Promise<string> => {
  const normalized = normalizeWebsiteUrl(url);
  const response = await fetchWithTimeout(`https://r.jina.ai/${normalized}`, 30_000);

  if (!response.ok) {
    throw new Error(`Jina Reader retornou HTTP ${response.status}.`);
  }

  const text = await response.text();
  if (text.length < 80) {
    throw new Error("Jina Reader retornou conteúdo vazio.");
  }

  const titleMatch = text.match(/^Title:\s*(.+)$/m);
  const descriptionMatch = text.match(/^Description:\s*(.+)$/m);
  const rawJinaTitle = titleMatch?.[1]?.trim() ?? "";
  const jinaDescription = sanitizeMarkdownText(descriptionMatch?.[1]?.trim() ?? "");
  const titleFromUrl = companyNameFromHostname(normalized);
  const title = isInvalidCompanyName(rawJinaTitle)
    ? titleFromUrl
    : sanitizeCompanyName(rawJinaTitle);
  const body = text.replace(/^Title:[\s\S]*?Markdown Content:\s*/m, "").trim();

  const sections: Array<{ title: string; description: string }> = [];
  let current: { title: string; lines: string[] } | null = null;

  const flushSection = () => {
    if (!current) return;
    const description = sanitizeMarkdownText(current.lines.join(" "));
    const heading = sanitizeMarkdownText(current.title);
    if (isValidCase(heading, description)) {
      sections.push({ title: heading, description });
    }
    current = null;
  };

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (!line || /^!\[/.test(line)) continue;

    if (/^#{2,3}\s+/.test(line)) {
      flushSection();
      current = { title: line.replace(/^#+\s*/, ""), lines: [] };
      continue;
    }

    if (/^#{4,6}\s+/.test(line)) {
      flushSection();
      continue;
    }

    if (current) {
      current.lines.push(line);
    }
  }

  flushSection();

  const uniqueSections = filterValidCases(
    sections.map((section, index) => ({
      title: section.title,
      description: section.description,
      category: "Case identificado",
      sourceUrl: normalized,
    })),
  ).slice(0, MAX_CASES);

  const articles = uniqueSections
    .map(
      (section) =>
        `<article><h3>${section.title}</h3><p>${section.description}</p></article>`,
    )
    .join("");

  const bodySnippet = sanitizeMarkdownText(
    body
      .split("\n")
      .filter((line) => line.trim() && !/^#{1,6}\s/.test(line) && !/^!\[/.test(line))
      .slice(0, 8)
      .join(" "),
  );
  const aboutText =
    summarizePrimaryGoal(jinaDescription || bodySnippet, 280) ||
    "Comunicação estratégica e presença digital.";

  const safeAbout = aboutText.replace(/"/g, "'");
  const safeSiteName = title.replace(/"/g, "'");

  return `<html><head><title>${title}</title><meta property="og:site_name" content="${safeSiteName}" /><meta name="description" content="${safeAbout}" /></head><body>${articles}<p>${safeAbout}</p></body></html>`;
};

const fetchViaProxy = async (proxyUrl: string, label: string): Promise<string> => {
  const response = await fetchWithTimeout(proxyUrl, 22_000);
  if (!response.ok) {
    throw new Error(`${label} retornou HTTP ${response.status}.`);
  }

  const html = await response.text();
  if (html.length < 80) {
    throw new Error(`${label} retornou resposta vazia.`);
  }

  return html;
};

/** Busca HTML no navegador com vários fallbacks. */
export const fetchWebsiteHtmlForBrowser = async (url: string): Promise<string> => {
  const normalized = normalizeWebsiteUrl(url);
  const attempts: Array<{ label: string; run: () => Promise<string> }> = [
    { label: "Jina Reader", run: () => fetchWebsiteHtmlViaJina(url) },
    {
      label: "Codetabs",
      run: () =>
        fetchViaProxy(
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(normalized)}`,
          "Codetabs",
        ),
    },
    {
      label: "AllOrigins",
      run: () =>
        fetchViaProxy(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(normalized)}`,
          "AllOrigins",
        ),
    },
    {
      label: "CorsProxy",
      run: () =>
        fetchViaProxy(`https://corsproxy.io/?${encodeURIComponent(normalized)}`, "CorsProxy"),
    },
  ];

  const errors: string[] = [];

  for (const attempt of attempts) {
    try {
      return await attempt.run();
    } catch (error) {
      errors.push(
        `${attempt.label}: ${error instanceof Error ? error.message : "erro desconhecido"}`,
      );
    }
  }

  throw new Error(
    `Não foi possível acessar o site do lead. ${errors.join(" · ")}`,
  );
};

/** @deprecated Use fetchWebsiteHtmlForBrowser */
export const fetchWebsiteHtmlViaCorsProxy = fetchWebsiteHtmlForBrowser;

export type WebsiteHtmlFetcher = (url: string) => Promise<string>;

export const extractLeadFromWebsite = async (
  url: string,
  fetchHtml: WebsiteHtmlFetcher = fetchWebsiteHtml,
): Promise<LeadWebsiteExtract> => {
  const websiteUrl = normalizeWebsiteUrl(url);
  const mainHtml = await fetchHtml(websiteUrl);
  let result = parseLeadFromWebsiteHtml(mainHtml, websiteUrl);

  const extraUrls = discoverPortfolioPageUrls(mainHtml, websiteUrl);
  for (const pageUrl of extraUrls) {
    try {
      const html = await fetchHtml(pageUrl);
      const extraCases = extractCasesFromWebsiteHtml(html, pageUrl);
      const merged = filterValidCases(dedupeCases([...result.solutionCases, ...extraCases]));
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
