-- Blog post email notifications, sent to the waitlist via Resend.
alter table public.waitlist add column if not exists unsubscribed_at timestamptz;

alter table public.blog_posts add column if not exists notified_at timestamptz;
alter table public.blog_posts add column if not exists notified_count integer;
