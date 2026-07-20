-- Admin-authored legal/policy documents (Terms, Privacy, etc. beyond the
-- built-in static pages), served at /legal/[slug]. Mirrors blog_posts.
create table if not exists public.legal_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists legal_pages_published_idx on public.legal_pages (published, sort_order);

alter table public.legal_pages enable row level security;

-- No public policies: reads (footer links, /legal/[slug]) and writes
-- (/admin/legal) both go through server-only service-role clients, matching
-- the blog_posts pattern.
