export const GMAIL_ACCESS_COOKIE = "buildai_gmail_at";
export const GMAIL_REFRESH_COOKIE = "buildai_gmail_rt";
export const GMAIL_EMAIL_COOKIE = "buildai_gmail_email";
export const GMAIL_OAUTH_STATE_COOKIE = "buildai_gmail_oauth_state";

const cookieFlags = (maxAgeSec: number, httpOnly = true): string => {
  const parts = [`Path=/`, `Max-Age=${maxAgeSec}`, `SameSite=Lax`];
  if (httpOnly) parts.push("HttpOnly");
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
};

export const parseCookieHeader = (header: string | undefined, name: string): string | undefined => {
  if (!header) return undefined;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = header.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

export const readGmailCookies = (cookieHeader?: string) => ({
  accessToken: parseCookieHeader(cookieHeader, GMAIL_ACCESS_COOKIE),
  refreshToken: parseCookieHeader(cookieHeader, GMAIL_REFRESH_COOKIE),
  email: parseCookieHeader(cookieHeader, GMAIL_EMAIL_COOKIE),
});

export const buildGmailSessionCookies = (tokens: {
  accessToken: string;
  refreshToken?: string;
  email?: string;
  expiresIn?: number;
}): string[] => {
  const maxAccess = tokens.expiresIn ?? 3600;
  const cookies = [`${GMAIL_ACCESS_COOKIE}=${encodeURIComponent(tokens.accessToken)}; ${cookieFlags(maxAccess)}`];

  if (tokens.refreshToken) {
    cookies.push(
      `${GMAIL_REFRESH_COOKIE}=${encodeURIComponent(tokens.refreshToken)}; ${cookieFlags(60 * 60 * 24 * 90)}`,
    );
  }

  if (tokens.email) {
    cookies.push(`${GMAIL_EMAIL_COOKIE}=${encodeURIComponent(tokens.email)}; ${cookieFlags(60 * 60 * 24 * 90, false)}`);
  }

  return cookies;
};

export const clearGmailSessionCookies = (): string[] => [
  `${GMAIL_ACCESS_COOKIE}=; Path=/; Max-Age=0`,
  `${GMAIL_REFRESH_COOKIE}=; Path=/; Max-Age=0`,
  `${GMAIL_EMAIL_COOKIE}=; Path=/; Max-Age=0`,
];

export const buildOAuthStateCookie = (state: string): string =>
  `${GMAIL_OAUTH_STATE_COOKIE}=${encodeURIComponent(state)}; ${cookieFlags(600)}`;

export const clearOAuthStateCookie = (): string =>
  `${GMAIL_OAUTH_STATE_COOKIE}=; Path=/; Max-Age=0`;
