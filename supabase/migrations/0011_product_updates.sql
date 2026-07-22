-- Product update announcements, emailed to the whole waitlist. Separate from
-- blog_posts: these have no public web page, they're purely admin-authored
-- emails with a choice of visual template, mirroring the blog's admin UX.
create table if not exists public.product_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  template text not null default 'announcement',
  cover_image_url text,
  sent boolean not null default false,
  sent_at timestamptz,
  recipient_count integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_updates drop constraint if exists product_updates_template_check;
alter table public.product_updates add constraint product_updates_template_check
  check (template in (
    'announcement', 'changelog', 'minimal', 'milestone',
    'feature-spotlight', 'newsletter', 'roadmap-update', 'big-reveal'
  ));

create index if not exists product_updates_created_idx on public.product_updates (created_at desc);

alter table public.product_updates enable row level security;

-- No public policies: there's no public page for these — reads and writes
-- both go through the admin-gated /admin/product-updates screens via a
-- server-only service-role client, matching every other admin table here.
