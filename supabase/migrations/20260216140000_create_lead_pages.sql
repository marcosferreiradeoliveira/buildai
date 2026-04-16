-- Tabela de landings geradas por lead (slug público em /lp/:slug)
-- Aplicar no Supabase: SQL Editor ou `supabase db push` após link do projeto.
--
-- Segurança: as policies abaixo permitem leitura e escrita anônima.
-- Para produção, restrinja INSERT/UPDATE (ex.: Edge Function com service role ou auth).

create table if not exists public.lead_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  segment_slug text not null,
  company_name text not null,
  city text,
  primary_goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lead_pages_created_at_idx on public.lead_pages (created_at desc);

alter table public.lead_pages enable row level security;

create policy "lead_pages_select_public"
  on public.lead_pages
  for select
  to anon, authenticated
  using (true);

create policy "lead_pages_insert_public"
  on public.lead_pages
  for insert
  to anon, authenticated
  with check (true);

create policy "lead_pages_update_public"
  on public.lead_pages
  for update
  to anon, authenticated
  using (true)
  with check (true);
