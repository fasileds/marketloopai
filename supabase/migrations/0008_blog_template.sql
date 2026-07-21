-- Which pre-built visual template a post renders with. Content is plain
-- text (paragraphs separated by a blank line) — the template controls all
-- typography/layout, so authors never need to hand-format anything.
alter table public.blog_posts add column if not exists template text not null default 'editorial';

alter table public.blog_posts drop constraint if exists blog_posts_template_check;
alter table public.blog_posts add constraint blog_posts_template_check
  check (template in ('editorial', 'magazine', 'minimal'));
