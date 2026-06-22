import { createGmailDraft, resolveGmailAccessToken } from "../server/lib/gmailServer";
import { handleOptions, parseBody } from "../server/lib/apiResponse";

type ApiRequest = {
  method?: string;
  headers?: { cookie?: string };
  body?: string | { to?: string; subject?: string; body?: string };
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
    const body = parseBody<{ to?: string; subject?: string; body?: string }>(req);
    const to = body.to?.trim();
    const subject = body.subject?.trim();
    const text = body.body?.trim();

    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Informe to, subject e body." });
    }

    const session = await resolveGmailAccessToken(req.headers?.cookie);
    if (!session) {
      return res.status(401).json({ error: "Conecte sua conta Gmail antes de criar rascunhos." });
    }

    if (session.cookies?.length) {
      res.setHeader?.("Set-Cookie", session.cookies);
    }

    const draft = await createGmailDraft(session.accessToken, { to, subject, body: text });

    return res.status(200).json({
      draftId: draft.draftId,
      messageId: draft.messageId,
      gmailDraftsUrl: "https://mail.google.com/mail/u/0/#drafts",
    });
  } catch (error) {
    console.error("gmail-draft:", error);
    const message = error instanceof Error ? error.message : "Falha ao criar rascunho.";
    return res.status(500).json({ error: message });
  }
}
