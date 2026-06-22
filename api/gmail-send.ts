import { resolveGmailAccessToken, sendGmailDraft } from "../server/lib/gmailServer";
import { handleOptions, parseBody } from "../server/lib/apiResponse";

type ApiRequest = {
  method?: string;
  headers?: { cookie?: string };
  body?: string | { draftId?: string };
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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody<{ draftId?: string }>(req);
    const draftId = body.draftId?.trim();

    if (!draftId) {
      return res.status(400).json({ error: "Informe draftId." });
    }

    const session = await resolveGmailAccessToken(req.headers?.cookie);
    if (!session) {
      return res.status(401).json({ error: "Conecte sua conta Gmail antes de enviar." });
    }

    if (session.cookies?.length) {
      res.setHeader?.("Set-Cookie", session.cookies);
    }

    const sent = await sendGmailDraft(session.accessToken, draftId);

    return res.status(200).json({
      sent: true,
      messageId: sent.messageId,
    });
  } catch (error) {
    console.error("gmail-send:", error);
    const message = error instanceof Error ? error.message : "Falha ao enviar e-mail.";
    return res.status(500).json({ error: message });
  }
}
