import { getGmailOAuthConfig, resolveGmailAccessToken } from "../server/lib/gmailServer";
import { clearGmailSessionCookies, readGmailCookies } from "../server/lib/gmailCookies";
import { handleOptions, parseBody } from "../server/lib/apiResponse";

type ApiRequest = {
  method?: string;
  headers?: { cookie?: string };
  body?: string | { action?: string };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader?: (key: string, value: string | string[]) => void;
  end?: (body?: string) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method === "OPTIONS") {
    handleOptions(res);
    return;
  }

  const cookieHeader = req.headers?.cookie;

  if (req.method === "POST") {
    const body = parseBody<{ action?: string }>(req);
    if (body.action === "disconnect") {
      res.setHeader?.("Set-Cookie", clearGmailSessionCookies());
      return res.status(200).json({ connected: false });
    }
    return res.status(400).json({ error: "Ação inválida." });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const configured = !!getGmailOAuthConfig();
  const session = readGmailCookies(cookieHeader);

  if (!configured) {
    return res.status(200).json({ configured: false, connected: false });
  }

  if (!session.accessToken && !session.refreshToken) {
    return res.status(200).json({ configured: true, connected: false });
  }

  try {
    const resolved = await resolveGmailAccessToken(cookieHeader);
    if (!resolved) {
      return res.status(200).json({ configured: true, connected: false });
    }

    if (resolved.cookies?.length) {
      res.setHeader?.("Set-Cookie", resolved.cookies);
    }

    return res.status(200).json({
      configured: true,
      connected: true,
      email: resolved.email ?? session.email,
    });
  } catch (error) {
    console.error("gmail-status:", error);
    return res.status(200).json({ configured: true, connected: false });
  }
}
