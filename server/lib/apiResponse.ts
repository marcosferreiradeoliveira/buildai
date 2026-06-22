type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader?: (key: string, value: string) => void;
  end?: (body?: string) => void;
};

export const setCorsHeaders = (res: ApiResponse) => {
  res.setHeader?.("Access-Control-Allow-Origin", "*");
  res.setHeader?.("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader?.("Access-Control-Allow-Headers", "Content-Type");
};

export const handleOptions = (res: ApiResponse) => {
  setCorsHeaders(res);
  res.status(204);
  res.end?.("");
};

export const parseBody = <T>(req: { body?: string | T }): T => {
  if (typeof req.body === "string") {
    return req.body ? (JSON.parse(req.body) as T) : ({} as T);
  }
  return (req.body ?? {}) as T;
};
