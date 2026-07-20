-- Waitlist table for Content Sparkler marketing site.
create extension if not exists pgcrypto;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  company text,
  website text,
  business_type text,
  company_size text,
  current_tools text[],
  monthly_ad_spend text,
  interested_features text[],
  country text,
  referral_code text not null unique,
  referred_by text references public.waitlist (referral_code),
  created_at timestamptz not null default now()
);

create index if not exists waitlist_referred_by_idx on public.waitlist (referred_by);
create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

alter table public.waitlist enable row level security;

-- No public select/insert/update/delete policies: all access goes through
-- the server-only service-role client in app/api/waitlist/route.ts. This
-- keeps waitlist emails and referral data unreadable from the browser.
