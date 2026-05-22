-- Permite apagar landings pelo admin (anon key, mesmo padrão das outras policies)

create policy "lead_pages_delete_public"
  on public.lead_pages
  for delete
  to anon, authenticated
  using (true);
