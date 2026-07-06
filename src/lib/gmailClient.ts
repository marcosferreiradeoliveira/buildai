export type GmailStatus = {
  configured: boolean;
  connected: boolean;
  email?: string;
};

export type GmailDraftResult = {
  draftId: string;
  messageId?: string;
  gmailDraftsUrl: string;
};

const parseJson = async <T>(response: Response): Promise<T & { error?: string }> => {
  const raw = await response.text();
  if (!raw) return {} as T;
  try {
    return JSON.parse(raw) as T & { error?: string };
  } catch {
    throw new Error(raw.slice(0, 200) || `HTTP ${response.status}`);
  }
};

export const fetchGmailStatus = async (): Promise<GmailStatus> => {
  const response = await fetch("/api/gmail-status", { credentials: "include" });
  const data = await parseJson<GmailStatus>(response);
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
  return data;
};

export const disconnectGmail = async (): Promise<void> => {
  const response = await fetch("/api/gmail-status", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "disconnect" }),
  });
  const data = await parseJson<{ error?: string }>(response);
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
};

export const connectGmail = (): void => {
  window.location.href = "/api/gmail-oauth-start";
};

export const createGmailDraft = async (input: {
  to: string;
  subject: string;
  body: string;
  bodyHtml?: string;
}): Promise<GmailDraftResult> => {
  const response = await fetch("/api/gmail-draft", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<GmailDraftResult>(response);
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
  return data;
};

export const sendGmailDraft = async (draftId: string): Promise<{ messageId?: string }> => {
  const response = await fetch("/api/gmail-send", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ draftId }),
  });
  const data = await parseJson<{ messageId?: string; error?: string }>(response);
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
  return { messageId: data.messageId };
};
