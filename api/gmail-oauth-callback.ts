import { exchangeOAuthCode, getGmailOAuthConfig } from "../server/lib/gmailServer";
import {
  clearOAuthStateCookie,
  parseCookieHeader,
  GMAIL_OAUTH_STATE_COOKIE,
} from "../server/lib/gmailCookies";

type ApiRequest = {
  method?: string;
  headers?: { cookie?: string; host?: string };
  query?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader?: (key: string, value: string | string[]) => void;
  end?: (body?: string) => void;
};

const queryParam = (req: ApiRequest, key: string): string | undefined => {
  const value = req.query?.[key];
  if (Array.isArray(value)) return value[0];
  return value;
};

const adminRedirect = (host: string | undefined, params: Record<string, string>): string => {
  const protocol = host?.includes("localhost") ? "http" : "https";
  const base = host ? `${protocol}://${host}` : "";
  const qs = new URLSearchParams(params).toString();
  return `${base}/admin?${qs}`;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const host = req.headers?.host;
  const error = queryParam(req, "error");
  if (error) {
    res.status(302);
    res.setHeader?.("Location", adminRedirect(host, { gmail: "error", reason: error }));
    res.end?.("");
    return;
  }

  const code = queryParam(req, "code");
  const state = queryParam(req, "state");
  const savedState = parseCookieHeader(req.headers?.cookie, GMAIL_OAUTH_STATE_COOKIE);

  if (!code || !state || !savedState || state !== savedState) {
    res.status(302);
    res.setHeader?.("Location", adminRedirect(host, { gmail: "error", reason: "invalid_state" }));
    res.setHeader?.("Set-Cookie", clearOAuthStateCookie());
    res.end?.("");
    return;
  }

  if (!getGmailOAuthConfig()) {
    res.status(302);
    res.setHeader?.("Location", adminRedirect(host, { gmail: "error", reason: "not_configured" }));
    res.end?.("");
    return;
  }

  try {
    const { cookies } = await exchangeOAuthCode(code);
    res.setHeader?.("Set-Cookie", [clearOAuthStateCookie(), ...cookies]);
    res.status(302);
    res.setHeader?.("Location", adminRedirect(host, { gmail: "connected" }));
    res.end?.("");
  } catch (err) {
    console.error("gmail-oauth-callback:", err);
    res.status(302);
    res.setHeader?.("Location", adminRedirect(host, { gmail: "error", reason: "token_exchange" }));
    res.setHeader?.("Set-Cookie", clearOAuthStateCookie());
    res.end?.("");
  }
}
