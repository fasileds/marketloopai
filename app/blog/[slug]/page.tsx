import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createServiceRoleClient } from "@/lib/supabase/server";

export const revalidate = 60;

async function getPost(slug: string) {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, content, category, author_name, published_at, published, cover_image_url")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <article className="px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {post.category && (
          <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
            {post.category}
          </span>
        )}
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {post.author_name}
          {post.published_at && ` · ${new Date(post.published_at).toLocaleDateString()}`}
        </p>

        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt=""
            className="mt-8 aspect-video w-full rounded-2xl object-cover"
          />
        )}

        <div
          className="prose prose-neutral dark:prose-invert mt-8 max-w-none text-muted-foreground [&_a]:text-primary [&_img]:rounded-xl"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />
      </div>
    </article>
  );
}
