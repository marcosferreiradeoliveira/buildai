/**
 * URLs oficiais das redes da BuildAI.
 * Rede com string vazia fica oculta — nunca usar "#".
 */
// TODO Marcos: preencher LINKEDIN_URL com o perfil oficial da BuildAI.
export const LINKEDIN_URL = "";
export const INSTAGRAM_URL = "https://www.instagram.com/buildai.dev/";
// TODO Marcos: preencher GITHUB_URL com a organização oficial. Não usar perfil pessoal até confirmar.
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
    { label: "Instagram", href: INSTAGRAM_URL },
    { label: "LinkedIn", href: LINKEDIN_URL },
    { label: "GitHub", href: GITHUB_URL },
  ].filter((link) => isPublicSocialUrl(link.href));
