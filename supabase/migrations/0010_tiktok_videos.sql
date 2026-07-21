-- TikTok video showcase: admin pastes a TikTok URL, we fetch TikTok's
-- official oEmbed response once (at add-time) and cache the embed markup so
-- the public site never has to call TikTok's API on every page load.
create table if not exists public.tiktok_videos (
  id uuid primary key default gen_random_uuid(),
  tiktok_url text not null,
  video_id text,
  embed_html text not null,
  thumbnail_url text,
  custom_thumbnail_url text,
  title text,
  author_name text,
  caption text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tiktok_videos_sort_idx on public.tiktok_videos (published, sort_order);

alter table public.tiktok_videos enable row level security;

-- No public policies: reads (Home page, Media page) and writes (/admin) both
-- go through server-only service-role clients, matching the testimonials
-- and blog_posts pattern.
