-- Ideias "O que podemos implementar" geradas por IA na extração do site

alter table public.lead_pages
  add column if not exists implementation_ideas jsonb;
