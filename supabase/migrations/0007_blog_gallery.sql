-- Extra images beyond the cover image, shown as a gallery grid at the end
-- of the post (as opposed to images placed inline in the rich text body).
alter table public.blog_posts add column if not exists gallery_image_urls text[] not null default '{}';
