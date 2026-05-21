-- Cases extraídos do site do lead (possíveis soluções na landing /lp/:slug)

alter table public.lead_pages
  add column if not exists website_url text,
  add column if not exists solution_cases jsonb;
