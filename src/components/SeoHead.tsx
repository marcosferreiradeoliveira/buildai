import { useEffect } from "react";

const SITE_ORIGIN = "https://buildai.dev.br";
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/preview.jpeg`;

type SeoHeadProps = {
  title: string;
  description: string;
  previewImageSrc: string;
  faviconHref: string;
  canonicalPath?: string;
};

const toAbsoluteImageUrl = (src: string): string => {
  if (/^https?:\/\//i.test(src)) return src;
  if (typeof window === "undefined") return src;
  return new URL(src, window.location.origin).href;
};

const ensureMetaTag = (attr: "name" | "property", value: string) => {
  let tag = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  return tag;
};

const ensureLink = (rel: string) => {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  return tag;
};

const SeoHead = ({ title, description, previewImageSrc, faviconHref, canonicalPath }: SeoHeadProps) => {
  useEffect(() => {
    document.title = title;

    const descriptionTag = ensureMetaTag("name", "description");
    descriptionTag.content = description;

    const path = canonicalPath ?? window.location.pathname;
    const canonicalUrl = `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
    ensureLink("canonical").href = canonicalUrl;

    const ogTitle = ensureMetaTag("property", "og:title");
    ogTitle.content = title;

    const ogDescription = ensureMetaTag("property", "og:description");
    ogDescription.content = description;

    ensureMetaTag("property", "og:url").content = canonicalUrl;
    ensureMetaTag("property", "og:locale").content = "pt_BR";
    ensureMetaTag("property", "og:site_name").content = "BuildAI";

    const previewImageUrl =
      previewImageSrc === "/preview.jpeg" || previewImageSrc.endsWith("/preview.jpeg")
        ? DEFAULT_OG_IMAGE
        : toAbsoluteImageUrl(previewImageSrc);

    const ogImage = ensureMetaTag("property", "og:image");
    ogImage.content = previewImageUrl;

    const twitterCard = ensureMetaTag("name", "twitter:card");
    twitterCard.content = "summary_large_image";

    const twitterTitle = ensureMetaTag("name", "twitter:title");
    twitterTitle.content = title;

    const twitterDescription = ensureMetaTag("name", "twitter:description");
    twitterDescription.content = description;

    const twitterImage = ensureMetaTag("name", "twitter:image");
    twitterImage.content = previewImageUrl;

    let faviconTag = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!faviconTag) {
      faviconTag = document.createElement("link");
      faviconTag.rel = "icon";
      document.head.appendChild(faviconTag);
    }
    faviconTag.href = faviconHref;
  }, [title, description, previewImageSrc, faviconHref, canonicalPath]);

  return null;
};

export default SeoHead;
