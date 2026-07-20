-- Generic key/value content store so every registered text field across the
-- site can be edited from /admin/content without a schema change per field.
create table if not exists public.site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- No public policies: reads happen through a server-only service-role
-- client (lib/content/get-site-content.ts) at render time, matching the
-- waitlist/blog_posts/testimonials pattern. Writes only happen through the
-- admin-gated API route.
