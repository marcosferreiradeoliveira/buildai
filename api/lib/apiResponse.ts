const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const jsonResponse = (body: unknown, status = 200): Response =>
  Response.json(body, { status, headers: corsHeaders });

export const optionsResponse = (): Response =>
  new Response(null, { status: 204, headers: corsHeaders });

export const parseJsonBody = async <T>(request: Request): Promise<T> => {
  const text = await request.text();
  if (!text.trim()) return {} as T;
  return JSON.parse(text) as T;
};
