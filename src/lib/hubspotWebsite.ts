const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.com.br",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "mail.com",
  "gmx.com",
  "uol.com.br",
  "bol.com.br",
  "terra.com.br",
  "ig.com.br",
  "globo.com",
  "globomail.com",
  "r7.com",
  "zipmail.com.br",
]);

/** Infere URL do site a partir do domínio do e-mail corporativo. */
export const websiteUrlFromEmail = (email: string | undefined): string | undefined => {
  if (!email?.trim()) return undefined;

  const match = email.trim().match(/^[^\s@]+@([^\s@]+\.[^\s@]+)$/i);
  if (!match) return undefined;

  const domain = match[1].toLowerCase();
  if (FREE_EMAIL_DOMAINS.has(domain)) return undefined;

  return `https://${domain}`;
};

export const normalizeWebsiteInput = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

/** Prioriza website do HubSpot; senão infere pelo domínio do e-mail. */
export const resolveHubspotWebsiteUrl = (input: {
  website?: string;
  email?: string;
}): string | undefined =>
  normalizeWebsiteInput(input.website) ?? websiteUrlFromEmail(input.email);
