-- Content Sparkler / MarketLoopAI admin CMS: blog posts + testimonials.
create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  category text,
  author_name text not null default 'MarketLoopAI Team',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on public.blog_posts (published, published_at desc);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_published_idx on public.testimonials (published, sort_order);

alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;

-- No public select/insert/update/delete policies: all reads (including the
-- public blog page) and all writes (the admin CMS) go through server-only
-- service-role clients, matching the waitlist table's pattern. This keeps
-- unpublished drafts invisible to anyone without the service-role key.
