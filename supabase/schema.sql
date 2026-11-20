-- Run this in Supabase SQL Editor.
create table if not exists public.portfolio_content (
  id bigint primary key check (id = 1),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;

-- Public visitors can read the published portfolio.
create policy "Public can read portfolio content"
on public.portfolio_content for select
to anon, authenticated
using (true);

-- Only authenticated admins can insert/update portfolio content.
create policy "Authenticated admins can insert portfolio content"
on public.portfolio_content for insert
to authenticated
with check (true);

create policy "Authenticated admins can update portfolio content"
on public.portfolio_content for update
to authenticated
using (true)
with check (true);

-- IMPORTANT: For a production multi-admin setup, add an admin allow-list
-- and restrict write policies to approved user IDs. Do not enable public signups.
