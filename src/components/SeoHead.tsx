import { useEffect } from "react";

type SeoHeadProps = {
  title: string;
  description: string;
  previewImageSrc: string;
  faviconHref: string;
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

const SeoHead = ({ title, description, previewImageSrc, faviconHref }: SeoHeadProps) => {
  useEffect(() => {
    document.title = title;

    const descriptionTag = ensureMetaTag("name", "description");
    descriptionTag.content = description;

    const ogTitle = ensureMetaTag("property", "og:title");
    ogTitle.content = title;

    const ogDescription = ensureMetaTag("property", "og:description");
    ogDescription.content = description;

    const ogImage = ensureMetaTag("property", "og:image");
    ogImage.content = previewImageSrc;

    const twitterCard = ensureMetaTag("name", "twitter:card");
    twitterCard.content = "summary_large_image";

    const twitterTitle = ensureMetaTag("name", "twitter:title");
    twitterTitle.content = title;

    const twitterDescription = ensureMetaTag("name", "twitter:description");
    twitterDescription.content = description;

    const twitterImage = ensureMetaTag("name", "twitter:image");
    twitterImage.content = previewImageSrc;

    let faviconTag = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!faviconTag) {
      faviconTag = document.createElement("link");
      faviconTag.rel = "icon";
      document.head.appendChild(faviconTag);
    }
    faviconTag.href = faviconHref;
  }, [title, description, previewImageSrc, faviconHref]);

  return null;
};

export default SeoHead;
