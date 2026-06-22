import { randomBytes } from "node:crypto";
import { buildGmailAuthUrl, getGmailOAuthConfig } from "../server/lib/gmailServer";
import { buildOAuthStateCookie } from "../server/lib/gmailCookies";

type ApiRequest = {
  method?: string;
  headers?: { host?: string };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader?: (key: string, value: string | string[]) => void;
  end?: (body?: string) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!getGmailOAuthConfig()) {
    return res.status(503).json({
      error:
        "Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_REDIRECT_URI no servidor.",
    });
  }

  const state = randomBytes(16).toString("hex");
  const authUrl = buildGmailAuthUrl(state);

  res.setHeader?.("Set-Cookie", buildOAuthStateCookie(state));
  res.status(302);
  res.setHeader?.("Location", authUrl);
  res.end?.("");
}
