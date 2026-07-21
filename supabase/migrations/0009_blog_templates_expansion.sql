-- Expands the blog template system: 6 new template types, plus structured
-- content for the two templates that genuinely need it (Data & Insights'
-- stat cards, Case Study's Challenge/Goals/Strategy/Results sections).
-- Plain-paragraph `content` stays the primary body for every template —
-- these are optional additions only Data & Insights / Case Study render.
alter table public.blog_posts drop constraint if exists blog_posts_template_check;
alter table public.blog_posts add constraint blog_posts_template_check
  check (template in (
    'editorial', 'magazine', 'minimal',
    'cover-gallery', 'split-screen', 'visual-story',
    'data-insights', 'case-study', 'modular'
  ));

alter table public.blog_posts add column if not exists stats jsonb not null default '[]'::jsonb;
alter table public.blog_posts add column if not exists case_study jsonb not null default '{}'::jsonb;
