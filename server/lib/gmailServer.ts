import {
  buildGmailSessionCookies,
  readGmailCookies,
} from "./gmailCookies";

export type GmailOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export type GmailSendInput = {
  to: string;
  subject: string;
  body: string;
  bodyHtml?: string;
};

const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

export const getGmailOAuthConfig = (): GmailOAuthConfig | null => {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (!clientId || !clientSecret || !redirectUri) return null;
  return { clientId, clientSecret, redirectUri };
};

export const buildGmailAuthUrl = (state: string): string => {
  const config = getGmailOAuthConfig();
  if (!config) throw new Error("Gmail OAuth não configurado.");

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: GMAIL_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
};

const exchangeToken = async (params: Record<string, string>): Promise<TokenResponse> => {
  const config = getGmailOAuthConfig();
  if (!config) throw new Error("Gmail OAuth não configurado.");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      ...params,
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 200);
    throw new Error(`Falha ao obter token Google: ${detail}`);
  }

  return (await response.json()) as TokenResponse;
};

export const exchangeOAuthCode = async (code: string) => {
  const config = getGmailOAuthConfig();
  if (!config) throw new Error("Gmail OAuth não configurado.");

  const tokens = await exchangeToken({
    code,
    grant_type: "authorization_code",
    redirect_uri: config.redirectUri,
  });

  const email = await fetchGoogleEmail(tokens.access_token);
  const cookies = buildGmailSessionCookies({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    email,
    expiresIn: tokens.expires_in,
  });

  return { email, cookies };
};

const fetchGoogleEmail = async (accessToken: string): Promise<string | undefined> => {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return undefined;
  const data = (await response.json()) as { email?: string };
  return data.email;
};

export const refreshGmailAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string; expiresIn?: number; cookies: string[] }> => {
  const tokens = await exchangeToken({
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const cookies = buildGmailSessionCookies({
    accessToken: tokens.access_token,
    expiresIn: tokens.expires_in,
  });

  return { accessToken: tokens.access_token, expiresIn: tokens.expires_in, cookies };
};

export const resolveGmailAccessToken = async (
  cookieHeader?: string,
): Promise<{ accessToken: string; email?: string; cookies?: string[] } | null> => {
  const session = readGmailCookies(cookieHeader);
  if (session.accessToken) {
    return { accessToken: session.accessToken, email: session.email };
  }

  if (!session.refreshToken) return null;

  const refreshed = await refreshGmailAccessToken(session.refreshToken);
  return {
    accessToken: refreshed.accessToken,
    email: session.email,
    cookies: refreshed.cookies,
  };
};

/** RFC 2822 + base64url para Gmail API. */
export const buildRawEmail = (input: GmailSendInput): string => {
  const to = input.to.trim();
  const subjectEncoded = `=?UTF-8?B?${Buffer.from(input.subject, "utf8").toString("base64")}?=`;
  const bodyHtml = input.bodyHtml?.trim();

  const raw =
    bodyHtml ?
      (() => {
        const boundary = `buildai_${Date.now().toString(36)}`;
        return [
          `To: ${to}`,
          `Subject: ${subjectEncoded}`,
          "MIME-Version: 1.0",
          `Content-Type: multipart/alternative; boundary="${boundary}"`,
          "",
          `--${boundary}`,
          "Content-Type: text/plain; charset=UTF-8",
          "Content-Transfer-Encoding: 8bit",
          "",
          input.body,
          "",
          `--${boundary}`,
          "Content-Type: text/html; charset=UTF-8",
          "Content-Transfer-Encoding: 8bit",
          "",
          bodyHtml,
          "",
          `--${boundary}--`,
        ].join("\r\n");
      })()
    : [
        `To: ${to}`,
        `Subject: ${subjectEncoded}`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "Content-Transfer-Encoding: 8bit",
        "",
        input.body,
      ].join("\r\n");

  return Buffer.from(raw, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const createGmailDraft = async (
  accessToken: string,
  input: GmailSendInput,
): Promise<{ draftId: string; messageId?: string }> => {
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: { raw: buildRawEmail(input) },
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Gmail draft failed: ${detail}`);
  }

  const data = (await response.json()) as { id?: string; message?: { id?: string } };
  if (!data.id) throw new Error("Gmail não retornou ID do rascunho.");
  return { draftId: data.id, messageId: data.message?.id };
};

export const sendGmailDraft = async (accessToken: string, draftId: string): Promise<{ messageId?: string }> => {
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: draftId }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Gmail send failed: ${detail}`);
  }

  const data = (await response.json()) as { id?: string };
  return { messageId: data.id };
};
