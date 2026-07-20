-- Rich blog content: a cover image per post, plus inline images uploaded
-- into post bodies via the Tiptap editor in /admin/blog.
alter table public.blog_posts add column if not exists cover_image_url text;

-- Public bucket: images need to be viewable by anonymous site visitors.
-- Uploads only ever happen server-side through the service-role client in
-- the admin-gated /api/admin/blog/upload-image route, so no public INSERT
-- policy is needed — RLS on storage.objects is bypassed by that client the
-- same way it already is for every other admin write in this project.
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;
