/**
 * URLs oficiais das redes da BuildAI.
 * TODO: preencher LINKEDIN_URL, INSTAGRAM_URL e GITHUB_URL com os perfis reais.
 * String vazia (ou "#") esconde a rede — nunca renderizar placeholder.
 */
export const LINKEDIN_URL = "";
export const INSTAGRAM_URL = "";
export const GITHUB_URL = "";

export type SocialLink = {
  label: string;
  href: string;
};

const isPublicSocialUrl = (href: string): boolean => {
  const value = href.trim();
  return value.length > 0 && value !== "#";
};

export const getSocialLinks = (): SocialLink[] =>
  [
    { label: "LinkedIn", href: LINKEDIN_URL },
    { label: "Instagram", href: INSTAGRAM_URL },
    { label: "GitHub", href: GITHUB_URL },
  ].filter((link) => isPublicSocialUrl(link.href));
